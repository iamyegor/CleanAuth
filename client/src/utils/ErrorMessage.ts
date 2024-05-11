export default class ErrorMessage {
    message: string;

    constructor(message: string) {
        this.message = message;
    }

    static create(message: string): ErrorMessage {
        return new ErrorMessage(message);
    }

    static toString(error: ErrorMessage): string {
        return error.message;
    }
}
