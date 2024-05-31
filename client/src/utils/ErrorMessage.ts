export default class ErrorMessage {
    value: string;

    constructor(message: string) {
        this.value = message;
    }

    static create(message: string): ErrorMessage {
        return new ErrorMessage(message);
    }

    static toString(error: ErrorMessage): string {
        return error.value;
    }
}
