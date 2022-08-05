import msgpack from "@msgpack/msgpack";

class API {
    loadData() {
        let lsData = localStorage.getItem('duwallet');
        if (lsData) {

        } else {
            return "NEW";
        }
    }
}

export default new API();