export interface ValidationError {
    fields: {
        [key: string]: {
            message: string,
            value: any
        }
    };
    message: string;
}

export namespace ValidationError {
    export const Validation_Error_Name = "ValidateError"
    export function decorate(err: any) {
        err.name = Validation_Error_Name;
    }
}

export function isValidationError(err: any): err is ValidationError {
    const { name = "" } = err;
    return name === ValidationError.Validation_Error_Name;
}

export interface DatabaseError extends Error {
    code: string;
    column?: any;
    constraint: string;
    dataType?: any;
    detail: string;
    file: string;
    hint?: any;
    internalPosition?: any;
    internalQuery?: any;
    length: number;
    line: string;
    message: string;
    name: string;
    position?: any;
    routine: string;
    schema: string;
    severity: string;
    stack: string;
    table: string;
    where?: any;
}

export interface HttpErrorInfo {
    message: string
    method: string
    stack: string
    status: number
    url: string
}

export class ApiError extends Error {
    httpError?: HttpErrorInfo;
    status?: number | undefined;
    constructor(error: any) {
        super();
        const { message, stack, response } = error;
        this.message = message;
        this.stack = stack;

        // If there is http response in error
        if (response) {
            const { body = {}, error: httpError } = response;
            if (httpError) {
                this.httpError = httpError;
                this.status = httpError.status;
            }

            if (body) {
                // Clones all of the values in the body object into this error
                Object.keys(body).forEach(key => {
                    this[key] = JSON.parse(JSON.stringify(body[key]));
                });
            }
        }
    }
}
