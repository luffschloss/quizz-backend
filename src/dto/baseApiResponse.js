module.exports = class BaseAPIResponse {
    constructor(code, data, message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
}
