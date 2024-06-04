import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import RequestPasswordResetForm, {
    action,
} from "@/pages/RequestPasswordReset/components/RequestPasswordResetForm.tsx";
import { server } from "@/test/setup.tsx";
import {
    failedRequestPasswordResetHandler,
    successRequestPasswordResetHandler,
} from "@/test/requestHandlers/requestPasswordResetPageHandlers.ts";

const RequestPasswordResetFormDefault = () => {
    const router = createMemoryRouter([
        { path: "*", element: <RequestPasswordResetForm />, action: action },
    ]);
    return <RouterProvider router={router} />;
};

const requestPasswordResetForm = {
    get form() {
        return screen.getByRole("form");
    },
    emailOrUsername: {
        get input() {
            return screen.getByPlaceholderText("Enter email or username");
        },
        get errorMessage() {
            return screen.getByTestId("ErrorMessageComponent.Message");
        },
    },
    get successMessage() {
        return screen.queryByTestId("FeedbackMessageComponent.SuccessMessage");
    },
    get submittingButton() {
        return screen.getByTestId("SubmittingButton");
    },
};

describe("<RequestPasswordResetForm />", () => {
    test("1. Displays error message when email or username is not entered", async () => {
        render(<RequestPasswordResetFormDefault />);

        await userEvent.click(requestPasswordResetForm.submittingButton);

        expect(requestPasswordResetForm.emailOrUsername.errorMessage).toHaveTextContent(
            "The field must not be empty",
        );
    });

    test("2. Displays error message for email or username input when server invalidates the request", async () => {
        server.use(failedRequestPasswordResetHandler);
        render(<RequestPasswordResetFormDefault />);

        await userEvent.type(requestPasswordResetForm.emailOrUsername.input, "invalidUser");
        await userEvent.click(requestPasswordResetForm.submittingButton);

        expect(requestPasswordResetForm.emailOrUsername.errorMessage).toHaveTextContent(
            "User with this login or email does not exist.",
        );
    });

    test("3. Displays success message when password reset link is sent successfully", async () => {
        server.use(successRequestPasswordResetHandler);
        render(<RequestPasswordResetFormDefault />);

        await userEvent.type(requestPasswordResetForm.emailOrUsername.input, "validUser");
        await userEvent.click(requestPasswordResetForm.submittingButton);

        expect(requestPasswordResetForm.successMessage).toHaveTextContent(
            "Password reset link sent successfully.",
        );
    });

    test("4. Disables submitting button when submitting", async () => {
        render(<RequestPasswordResetFormDefault />);

        await userEvent.type(requestPasswordResetForm.emailOrUsername.input, "validUser");
        await userEvent.click(requestPasswordResetForm.submittingButton);

        expect(requestPasswordResetForm.submittingButton).toBeDisabled();
    });
});
