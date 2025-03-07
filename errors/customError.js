import { StatusCodes } from "http-status-codes";

export const NotFoundError = class extends Error {
    constructor(message){
        super(message);
        this.name = 'NotFoundError',
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export const BadRequestError = class extends Error {
    constructor(message){
        super(message);
        this.name = 'BadRequestError',
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export const UnauthenticatedError = class extends Error {
    constructor(message){
        super(message);
        this.name = 'UnauthenticatedError',
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export const UnauthorizedError = class extends Error {
    constructor(message){
        super(message);
        this.name = 'UnauthorizedError',
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}