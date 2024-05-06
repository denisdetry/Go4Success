export class fetchError extends Error {
    constructor(
        message: string,
        public responseError: Response,
    ) {
        super(message);
    }
}

export interface fetchError extends Error {
    responseError: Response;
}
