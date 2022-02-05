import aes from "aes-js";
import sha from "sha.js";

export default class CLogic {
    #key: string | null = null;
    protected db: object = {};
    cbs: Function[] = [];
    rcode: number = 0;

    hookDataUpdate(cb: Function) {
        this.cbs.push(cb);
    }

    unhookDataUpdate(cb: Function) {
        this.cbs.splice(this.cbs.findIndex(v => v === cb), 1);
    }

    readData(key?: string) {
        if (typeof key === "string") {
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
                            console.log(decData, decDataS);
                            this.callCB();
                            return "OK";
                        } catch {
                            this.callCB();
                            return "DECFAULT";
                        }
                    } catch {
                        this.callCB();
                        return "DECFAULT";
                    }
                } else {
                    this.callCB();
                    return "ENCRYPTED";
                }
            } else {
                try {
                    this.db = JSON.parse(data);
                    this.callCB();
                    return "OK";
                } catch {
                    this.callCB();
                    return "MALFORMED";
                }
            }
        } else {
            localStorage.setItem("duwallet", "{}");
            this.db = {};
            this.callCB();
            return "NEW";
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

    setData(data: object) {
        this.db = data;
        this.writeData();
        this.callCB();
    }

    callCB() {
        this.cbs.forEach(cb => cb(this.rcode++));
    }

    voidKey() {
        this.#key = null;
    }

    voidData() {
        this.voidKey();
        this.setData({});
    }
}
