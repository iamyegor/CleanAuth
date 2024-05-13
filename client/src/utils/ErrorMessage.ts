export default class ErrorMessage {
    errorMessage: string;

    constructor(message: string) {
        this.errorMessage = message;
    }

    static create(message: string): ErrorMessage {
        return new ErrorMessage(message);
    }

    static toString(error: ErrorMessage): string {
        return error.errorMessage;
    }
}
