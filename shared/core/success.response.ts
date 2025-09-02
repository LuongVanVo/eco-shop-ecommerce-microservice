import { reasonPhrases, statusCodes } from '../utils/httpStatusCode';

class SuccessResponse {
    message: string
    statusCode: number
    reasonStatusCode: string
    metadata: any

    constructor(
        message: string | { message: string; metadata?: any }, 
        statusCode: number = statusCodes.OK, 
        reasonStatusCode: string = reasonPhrases.OK, 
        metadata: any = {}
    ) {
        if (typeof message === 'object') {
            this.message = message.message;
            this.metadata = message.metadata || {};
        } else {
            this.message = message;
            this.metadata = metadata;
        }
        this.statusCode = statusCode;
        this.reasonStatusCode = reasonStatusCode;
    }

    send(res: any, headers: any = {}) {
        return res.status(this.statusCode).json(this)
    }
}


class OK extends SuccessResponse {
    constructor(message: string, metadata: any) {
        super(message, metadata)
    }
}

class CREATED extends SuccessResponse{
    options: any

    constructor(options: any = {}, message: string, statusCode: number = statusCodes.CREATED, reasonStatusCode: string = reasonPhrases.CREATED, metadata: any = {}) {
        super(message, statusCode, reasonStatusCode, metadata);
        this.options = options;
    }
}

export {
    OK,
    CREATED,
    SuccessResponse
}