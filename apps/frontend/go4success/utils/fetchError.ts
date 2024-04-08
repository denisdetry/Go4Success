export class fetchError extends Error {
    constructor(
        message: string,
        public responseError: Response,
    ) {
        super(message);
    }
}
