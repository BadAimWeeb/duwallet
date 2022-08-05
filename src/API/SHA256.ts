import sha from "sha.js";

let hasSubtle = !!window.crypto.subtle;
if (!hasSubtle) {
    console.warn("WebCrypto is not available. Using sha.js instead, which is not time-constant and therefore not secure.");
}

export async function hash(data: Uint8Array): Promise<Uint8Array> {
    // Test if WebCrypto is available
    if (hasSubtle) {
        const SubtleCrypto = window.crypto.subtle;
        // Hash using WebCrypto
        let hash = (await SubtleCrypto.digest({ name: "SHA-256" }, data)) as Uint8Array;

        // Return hash
        return hash;
    } else {
        // Hash using sha.js
        let hash = sha("sha256").update(data).digest();
        return Uint8Array.from(hash);
    }
}
