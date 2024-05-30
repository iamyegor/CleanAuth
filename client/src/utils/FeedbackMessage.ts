export default class FeedbackMessage {
    message: string;
    isSuccess: boolean;
    isFailure: boolean;
    generatedAt: number;

    private constructor(message: string, isSuccess: boolean, generatedAt: number) {
        this.message = message;
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.generatedAt = generatedAt;
    }

    static createSuccess(message: string): FeedbackMessage {
        return new FeedbackMessage(message, true, Date.now());
    }

    static createError(message: string): FeedbackMessage {
        return new FeedbackMessage(message, false, Date.now());
    }
}
