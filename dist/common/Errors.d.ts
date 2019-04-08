export interface ValidationError {
    fields: {
        [key: string]: {
            message: string;
            value: any;
        };
    };
    message: string;
}
export declare namespace ValidationError {
    const Validation_Error_Name = "ValidateError";
    function decorate(err: any): void;
}
export declare function isValidationError(err: any): err is ValidationError;
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
    message: string;
    method: string;
    stack: string;
    status: number;
    url: string;
}
export declare class ApiError extends Error {
    httpError?: HttpErrorInfo;
    status?: number | undefined;
    constructor(error: any);
}
