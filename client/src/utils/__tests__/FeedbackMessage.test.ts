import { test, describe, expect } from "vitest";
import FeedbackMessage from "@/utils/FeedbackMessage.ts";

const createSuccessMessage = (message: string): FeedbackMessage => {
    return FeedbackMessage.createSuccess(message);
};

const createErrorMessage = (message: string): FeedbackMessage => {
    return FeedbackMessage.createError(message);
};

describe("FeedbackMessage", () => {
    test("1. Creates success FeedbackMessage with given message", () => {
        const feedbackMessage = createSuccessMessage("Operation successful");

        expect(feedbackMessage.message).toBe("Operation successful");
        expect(feedbackMessage.isSuccess).toBe(true);
        expect(typeof feedbackMessage.generatedAt).toBe("number");
    });

    test("2. Creates error FeedbackMessage with given message", () => {
        const feedbackMessage = createErrorMessage("Operation failed");

        expect(feedbackMessage.message).toBe("Operation failed");
        expect(feedbackMessage.isSuccess).toBe(false);
        expect(typeof feedbackMessage.generatedAt).toBe("number");
    });
});
