import aes from "aes-js";
import sha from "sha.js";

export default class CLogic {
    #key: string | null = null;
    db: any;

    readData(key?: string) {
        if (key) {
            this.#key = key;
        }

        let data = localStorage.getItem("duwallet");
        if (data) {
            if (data.startsWith("ENCRYPTED-")) {
                if (this.#key) {
                    let hkey = (new sha.sha256()).update(this.#key).digest("hex");
                    let ctr = new aes.ModeOfOperation.ctr(aes.utils.hex.toBytes(hkey));
                    data = data.slice(10);
                    try {
                        let decData = ctr.decrypt(aes.utils.hex.toBytes(data));
                        let decDataS = aes.utils.utf8.fromBytes(decData);
                        try {
                            this.db = JSON.parse(decDataS);
                            return "OK";
                        } catch {
                            return "MALFORMED";
                        }
                    } catch {
                        return "DECFAULT";
                    }
                } else {
                    return "ENCRYPTED";
                }
            } else {
                try {
                    this.db = JSON.parse(data);
                    return "OK";
                } catch {
                    return "MALFORMED";
                }
            }
        } else {
            localStorage.setItem("duwallet", "{}");
            this.db = {};
            return "OK";
        }
    }

    writeData(key?: string) {
        if (key) {
            this.#key = key;
        }

        let data = JSON.stringify(this.db);
        if (this.#key) {
            let hkey = (new sha.sha256()).update(this.#key).digest("hex");
            let ctr = new aes.ModeOfOperation.ctr(aes.utils.hex.toBytes(hkey));

            data = "ENCRYPTED-" + aes.utils.hex.fromBytes(
                ctr.encrypt(
                    aes.utils.utf8.toBytes(data)
                )
            )
        }

        localStorage.setItem("duwallet", data);
    }

    voidKey() {
        this.#key = null;
    }
}
