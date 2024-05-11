export default class DisplayedMessage {
    message: string;
    isSuccess: boolean;
    generatedAt: number;

    private constructor(message: string, isSuccess: boolean, generatedAt: number) {
        this.message = message;
        this.isSuccess = isSuccess;
        this.generatedAt = generatedAt;
    }

    static createSuccess(message: string): DisplayedMessage {
        return new DisplayedMessage(message, true, Date.now());
    }

    static createError(message: string): DisplayedMessage {
        return new DisplayedMessage(message, false, Date.now());
    }
}
