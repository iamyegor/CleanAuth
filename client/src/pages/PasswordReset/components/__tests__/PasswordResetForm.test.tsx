import PasswordResetForm, { action } from "@/pages/PasswordReset/components/PasswordResetForm.tsx";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.tsx";
import { failedPasswordResetHandler } from "@/test/requestHandlers/passwordResetPageHandlers.ts";

const PasswordResetFormDefault = () => {
    const router = createMemoryRouter([
        { path: "*", element: <PasswordResetForm />, action: action },
    ]);

    return <RouterProvider router={router} />;
};

const passwordResetForm = {
    get form() {
        return screen.getByRole("form");
    },
    password: {
        get input() {
            return screen.getByPlaceholderText("New password");
        },
        get errorMessage() {
            return screen.getByTestId("ErrorMessageComponent.Message");
        },
    },
    confirmPassword: {
        get input() {
            return screen.getByPlaceholderText("Repeat password");
        },
        get errorMessage() {
            return screen.getByTestId("ErrorMessageComponent.Message");
        },
    },
    get submittingButton() {
        return screen.getByTestId("SubmittingButton");
    },
};

describe("<PasswordResetForm />", () => {
    test("1. Displays error message for password input when invalid password is entered", async () => {
        render(<PasswordResetFormDefault />);

        await userEvent.type(passwordResetForm.password.input, "password");
        await userEvent.type(passwordResetForm.confirmPassword.input, "password");
        await userEvent.click(passwordResetForm.submittingButton);

        expect(passwordResetForm.password.errorMessage).toHaveTextContent(
            "Password must contain at least one upper case, one lower case letter and either one number or a special character",
        );
    });

    test("2. Displays error message for password input when server invalidates password", async () => {
        server.use(failedPasswordResetHandler);
        render(<PasswordResetFormDefault />);

        await userEvent.type(passwordResetForm.password.input, "passwordA123");
        await userEvent.type(passwordResetForm.confirmPassword.input, "passwordA123");
        await userEvent.click(passwordResetForm.submittingButton);

        expect(passwordResetForm.password.errorMessage).toHaveTextContent(
            "The new password can not be the same as the current one.",
        );
    });

    test("3. Displays error message for confirm password input when passwords do not match", async () => {
        render(<PasswordResetFormDefault />);

        await userEvent.type(passwordResetForm.password.input, "passwordA123");
        await userEvent.type(passwordResetForm.confirmPassword.input, "passwordA1234");
        await userEvent.click(passwordResetForm.submittingButton);

        expect(passwordResetForm.confirmPassword.errorMessage).toHaveTextContent(
            "Passwords do not match.",
        );
    });

    test("4. Disables submitting button when submitting", async () => {
        render(<PasswordResetFormDefault />);

        await userEvent.type(passwordResetForm.password.input, "passwordA123");
        await userEvent.type(passwordResetForm.confirmPassword.input, "passwordA123");
        await userEvent.click(passwordResetForm.submittingButton);

        expect(passwordResetForm.submittingButton).toBeDisabled();
    });
});
