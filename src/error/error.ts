import { HttpException, HttpStatus } from "@nestjs/common";

enum ErrorKeys {
    UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
    BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR',
    FORBIDDEN_ERROR = 'FORBIDDEN_ERROR',
    NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}  

enum MessageError {
  NOT_FOUND = 'No record found'
}

export interface Errors {}