import aes from "aes-js";

let hasSubtle = !!window.crypto.subtle;
if (!hasSubtle) {
    console.warn("WebCrypto is not available. Using aes-js instead, which is not time-constant and therefore not secure.");
}

export async function encrypt(iv: Uint8Array, key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    // Test if WebCrypto is available
    if (hasSubtle) {
        const SubtleCrypto = window.crypto.subtle;
        // Encrypt using WebCrypto
        let encryptedData = (await SubtleCrypto.encrypt(
            { name: "AES-CBC", iv },
            await SubtleCrypto.importKey("raw", key, "AES-CBC", false, ["encrypt"]), 
            data
        )) as ArrayBuffer;

        // Return encrypted data
        return new Uint8Array(encryptedData);
    } else {
        // Encrypt using aes-js
        let aesCbc = new aes.ModeOfOperation.cbc(key, iv);
        let encryptedData = aesCbc.encrypt(data);
        return encryptedData;
    }
}

export async function decrypt(iv: Uint8Array, key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    // Test if WebCrypto is available
    if (hasSubtle) {
        const SubtleCrypto = window.crypto.subtle;
        // Decrypt using WebCrypto
        let decryptedData = (await SubtleCrypto.decrypt(
            { name: "AES-CBC", iv },
            await SubtleCrypto.importKey("raw", key, "AES-CBC", false, ["decrypt"]),
            data
        )) as Uint8Array;

        // Return decrypted data
        return decryptedData;
    } else {
        // Decrypt using aes-js
        let aesCbc = new aes.ModeOfOperation.cbc(key, iv);
        let decryptedData = aesCbc.decrypt(data);
        return decryptedData;
    }
}