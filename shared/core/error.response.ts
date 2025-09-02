import { reasonPhrases, statusCodes } from '../utils/httpStatusCode';

class ErrorResponse extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

class ConflictRequestEror extends ErrorResponse {
    constructor(message: string = reasonPhrases.CONFLICT, statusCode: number = statusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message: string = reasonPhrases.BAD_REQUEST, statusCode: number = statusCodes.BAD_REQUEST) {
        super(message, statusCode)
    }
}

class UnauthorizedRequestError extends ErrorResponse {
    constructor(message: string = reasonPhrases.UNAUTHORIZED, statusCode: number = statusCodes.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundRequestError extends ErrorResponse {
    constructor(message: string = reasonPhrases.NOT_FOUND, statusCode: number = statusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor(message: string = reasonPhrases.FORBIDDEN, statusCode: number = statusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

export {
    ConflictRequestEror,
    BadRequestError,
    UnauthorizedRequestError,
    NotFoundRequestError,
    ForbiddenRequestError
}