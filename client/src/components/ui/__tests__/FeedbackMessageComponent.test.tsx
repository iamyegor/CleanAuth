import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import FeedbackMessageComponent from "@/components/ui/FeedbackMessageComponent.tsx";
import FeedbackMessage from "@/utils/FeedbackMessage.ts";

const FeedbackMessageComponentDefault = (
    props: Partial<ComponentProps<typeof FeedbackMessageComponent>>,
) => <FeedbackMessageComponent feedback={null} {...props} />;

const feedbackMessageComponent = {
    get successMessage() {
        return screen.queryByTestId("FeedbackMessageComponent.SuccessMessage");
    },
    get checkIcon() {
        return screen.queryByTestId("FeedbackMessageComponent.CheckIcon");
    },
    get errorMessage() {
        return screen.queryByTestId("ErrorMessageComponent.Message");
    },
};

describe("<FeedbackMessageComponent />", () => {
    test("1. Displays success message when feedback is success", () => {
        const feedback = FeedbackMessage.createSuccess("Test success message");
        render(<FeedbackMessageComponentDefault feedback={feedback} />);

        expect(feedbackMessageComponent.successMessage).toHaveTextContent("Test success message");
        expect(feedbackMessageComponent.checkIcon).toBeInTheDocument();
    });

    test("2. Displays error message when feedback is not success", () => {
        const feedback = FeedbackMessage.createError("Test error message");
        render(<FeedbackMessageComponentDefault feedback={feedback} />);

        expect(feedbackMessageComponent.errorMessage).toHaveTextContent("Test error message");
    });

    test("3. Does not display anything when feedback is null", () => {
        render(<FeedbackMessageComponentDefault />);

        expect(feedbackMessageComponent.successMessage).not.toBeInTheDocument();
        expect(feedbackMessageComponent.errorMessage).not.toBeInTheDocument();
    });
});
