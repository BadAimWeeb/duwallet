import aes from "aes-js";

let hasSubtle = !!window.crypto.subtle;
if (!hasSubtle) {
    console.warn("WebCrypto is not available. Using aes-js instead, which is not time-constant and therefore not secure.");
}

export async function encrypt(counter: Uint8Array, key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    // Test if WebCrypto is available
    if (hasSubtle) {
        const SubtleCrypto = window.crypto.subtle;
        // Encrypt using WebCrypto
        let encryptedData = (await SubtleCrypto.encrypt(
            { name: "AES-CTR", counter },
            await SubtleCrypto.importKey("raw", key, "AES-CTR", false, ["encrypt"]), 
            data
        )) as ArrayBuffer;

        // Return encrypted data
        return new Uint8Array(encryptedData);
    } else {
        // Encrypt using aes-js
        let aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(counter));
        let encryptedData = aesCtr.encrypt(data);
        return encryptedData;
    }
}

export async function decrypt(counter: Uint8Array, key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    // Test if WebCrypto is available
    if (hasSubtle) {
        const SubtleCrypto = window.crypto.subtle;
        // Decrypt using WebCrypto
        let decryptedData = (await SubtleCrypto.decrypt(
            { name: "AES-CTR", counter },
            await SubtleCrypto.importKey("raw", key, "AES-CTR", false, ["decrypt"]),
            data
        )) as Uint8Array;

        // Return decrypted data
        return decryptedData;
    } else {
        // Decrypt using aes-js
        let aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(counter));
        let decryptedData = aesCtr.decrypt(data);
        return decryptedData;
    }
}