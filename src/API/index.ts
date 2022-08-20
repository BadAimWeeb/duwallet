import { encode as msgencode, decode as msgdecode } from "@msgpack/msgpack";

import { encrypt as aesEncrypt, decrypt as aesDecrypt } from "./AES";
import { hash as sha256Hash } from "./SHA256";

class API {
    #passphrase = "";
    data: {
        encryptPart: any;
        plainTextPart: any;
        type: "UNENCRYPTED" | "HALF-ENCRYPTED" | "ENCRYPTED" | "UNKNOWN",
        isDecrypted: boolean;
    } = {
            encryptPart: null,
            plainTextPart: null,
            type: "UNKNOWN",
            isDecrypted: false
        };

    async loadData(passphrase?: string) {
        let lsData = localStorage.getItem('duwallet');
        if (lsData) {
            let data = msgdecode(
                new Uint8Array(lsData.match(/.{1,2}/g)!.map(x => parseInt(x, 16)))
            ) as [mode: number, unencrypted: any, salt: number[], iv: number[], encrypted: number[]];

            switch (data[0]) {
                case 0: // Unencrypted
                    this.data = {
                        encryptPart: null,
                        plainTextPart: data[1],
                        type: "UNENCRYPTED",
                        isDecrypted: true
                    };
                    return "OK";
                case 1: // Half-encrypted
                case 2: // Encrypted
                    if (passphrase) {
                        // Try to decrypt
                        let saltString = Array.from(data[2])
                            .map(x => x.toString(16).padStart(2, '0')).join();

                        // Add salt to passphrase
                        let saltedPassphrase = passphrase + saltString;

                        // Convert salted passphrase to Uint8Array and generate key
                        let saltedPassphraseUint8Array = new TextEncoder().encode(saltedPassphrase);
                        let key = new Uint8Array(await sha256Hash(saltedPassphraseUint8Array));

                        // Decrypt data
                        try {
                            let decryptedData = await aesDecrypt(
                                new Uint8Array(data[3]),
                                key,
                                new Uint8Array(data[4])
                            );

                            // Decode data
                            try {
                                let decodedData = msgdecode(decryptedData);

                                this.data = {
                                    encryptPart: decodedData,
                                    plainTextPart: data[1],
                                    type: data[0] === 2 ? "ENCRYPTED" : "HALF-ENCRYPTED",
                                    isDecrypted: true
                                };

                                this.#passphrase = passphrase;
                                return "OK";
                            } catch {
                                return "WRONG_PASSPHRASE";
                            }
                        } catch {
                            return "WRONG_PASSPHRASE";
                        }
                    } else {
                        if (data[0] === 1) {
                            // Load unencrypted part only
                            this.data = {
                                encryptPart: null,
                                plainTextPart: data[1],
                                type: "HALF-ENCRYPTED",
                                isDecrypted: false
                            };
                            return "PASSPHRASE_REQUIRED_HALF";
                        } else {
                            return "PASSPHRASE_REQUIRED";
                        }
                    }
                default:
                    return "UNKNOWN_DATA";
            }
        } else {
            return "NEW";
        }
    }

    createUnencryptedWallet() {
        this.data = {
            encryptPart: null,
            plainTextPart: {},
            type: "UNENCRYPTED",
            isDecrypted: false
        }
        return this.saveData();
    }

    createHalfEncryptedWallet(passphrase: string) {
        this.#passphrase = passphrase;
        this.data = {
            encryptPart: {},
            plainTextPart: {},
            type: "HALF-ENCRYPTED",
            isDecrypted: true
        }
        return this.saveData();
    }

    createEncryptedWallet(passphrase: string) {
        this.#passphrase = passphrase;
        this.data = {
            encryptPart: {},
            plainTextPart: null,
            type: "ENCRYPTED",
            isDecrypted: true
        }
        return this.saveData();
    }

    async saveData() {
        switch (this.data.type) {
            case "UNENCRYPTED":
                // Save data
                localStorage.setItem(
                    'duwallet',
                    Array.from(msgencode([0, this.data.plainTextPart]))
                        .map(x => x.toString(16).padStart(2, '0')).join("")
                );
                return true;
            case "HALF-ENCRYPTED":
                if (!this.data.isDecrypted) return false;
            case "ENCRYPTED":
                // Generate salt
                let salt = crypto.getRandomValues(new Uint8Array(16));
                let saltString = Array.from(salt)
                    .map(x => x.toString(16).padStart(2, '0')).join();

                // Add salt to passphrase
                let saltedPassphrase = this.#passphrase + saltString;

                // Convert salted passphrase to Uint8Array and generate key
                let saltedPassphraseUint8Array = new TextEncoder().encode(saltedPassphrase);
                let key = new Uint8Array(await sha256Hash(saltedPassphraseUint8Array));

                // Generate IV
                let iv = crypto.getRandomValues(new Uint8Array(16));

                // Encrypt data
                let encryptedData = await aesEncrypt(
                    iv,
                    key,
                    msgencode(this.data.encryptPart)
                );

                // Save data
                localStorage.setItem(
                    'duwallet',
                    Array.from(msgencode([
                        this.data.type === "ENCRYPTED" ? 2 : 1,
                        this.data.type === "ENCRYPTED" ?
                            null :
                            this.data.plainTextPart,
                        Array.from(salt),
                        Array.from(iv),
                        encryptedData
                    ]))
                        .map(x => x.toString(16).padStart(2, '0')).join("")
                );
        }
    }
}

export default new API();