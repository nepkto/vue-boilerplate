class Error {
    constructor() {
        this.vErrs = {}
    }

    get(field) {
        if(this.vErrs[field]) {
            return this.vErrs[field][0];
        }
    }

    record(errors) {
        this.vErrs = errors;
    }
}

export default Error;