module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(message = '') {
        if(message.length){
            return new ApiError(401, message);
        }
        return new ApiError(401, "USER_IS_NOT_AUTHORIZED");
    }

    static BadRequestError(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static NotFoundError(message) {
        return new ApiError(404, message);
    }

    static InvalidActivationLink() {
        return new ApiError(500, "INVALID_ACTIVATION_LINK");
    }
}