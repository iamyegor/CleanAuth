import SignupForm, { action } from "@/pages/Signup/components/SignupForm.tsx";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.tsx";
import {failedSignupHandler} from "@/test/requestHandlers/signupPageHandlers.ts";

const SignupFormDefault = () => {
    const router = createMemoryRouter([{ path: "*", element: <SignupForm />, action: action }]);
    return <RouterProvider router={router} />;
};

const signupForm = {
    username: {
        get input() {
            return screen.getAllByTestId("InputField.Input")[0];
        },
        get errorMessage() {
            return screen.getByTestId("ErrorMessageComponent.Message");
        },
    },
    email: {
        get input() {
            return screen.getAllByTestId("InputField.Input")[1];
        },
        get errorMessage() {
            return screen.getByTestId("ErrorMessageComponent.Message");
        },
    },
    password: {
        get input() {
            return screen.getAllByTestId("PasswordInput.Input")[0];
        },
        get errorMessage() {
            return screen.getByTestId("ErrorMessageComponent.Message");
        },
    },
    repeatedPassword: {
        get input() {
            return screen.getAllByTestId("PasswordInput.Input")[1];
        },
        get errorMessage() {
            return screen.getByTestId("ErrorMessageComponent.Message");
        },
    },
    get submittingButton() {
        return screen.getByTestId("SubmittingButton");
    },
};

describe("<SignupForm />", () => {
    test("1. Displays error message for empty username", async () => {
        render(<SignupFormDefault />);

        await userEvent.type(signupForm.email.input, "test@example.com");
        await userEvent.type(signupForm.password.input, "Password1!");
        await userEvent.type(signupForm.repeatedPassword.input, "Password1!");
        await userEvent.click(signupForm.submittingButton);

        expect(signupForm.username.errorMessage).toHaveTextContent("Username must not be empty");
    });

    test("2. Email field renders with correct attributes", async () => {
        render(<SignupFormDefault />);

        expect(signupForm.email.input).toHaveAttribute("type", "email");
        expect(signupForm.email.input).not.toHaveAttribute("formNoValidate");
    });

    test("3. Displays error message for password input when invalid password is entered", async () => {
        render(<SignupFormDefault />);

        await userEvent.type(signupForm.username.input, "testuser");
        await userEvent.type(signupForm.email.input, "test@example.com");
        await userEvent.type(signupForm.password.input, "password");
        await userEvent.type(signupForm.repeatedPassword.input, "password");
        await userEvent.click(signupForm.submittingButton);

        expect(signupForm.password.errorMessage).toHaveTextContent(
            "Password must contain at least one upper case, one lower case letter and either one number or a special character",
        );
    });

    test("4. Displays error message for repeated password input when passwords do not match", async () => {
        render(<SignupFormDefault />);

        await userEvent.type(signupForm.username.input, "testuser");
        await userEvent.type(signupForm.email.input, "test@example.com");
        await userEvent.type(signupForm.password.input, "Password1!");
        await userEvent.type(signupForm.repeatedPassword.input, "Password2!");
        await userEvent.click(signupForm.submittingButton);

        expect(signupForm.repeatedPassword.errorMessage).toHaveTextContent(
            "Passwords do not match",
        );
    });

    test("5. Displays error message for email input when server invalidates email", async () => {
        server.use(failedSignupHandler);
        render(<SignupFormDefault />);

        await userEvent.type(signupForm.username.input, "testuser");
        await userEvent.type(signupForm.email.input, "test@example.com");
        await userEvent.type(signupForm.password.input, "Password1!");
        await userEvent.type(signupForm.repeatedPassword.input, "Password1!");
        await userEvent.click(signupForm.submittingButton);

        expect(signupForm.email.errorMessage).toHaveTextContent("Email already taken");
    });

    test("6. Disables submitting button when submitting", async () => {
        render(<SignupFormDefault />);

        await userEvent.type(signupForm.username.input, "testuser1");
        await userEvent.type(signupForm.email.input, "test@example.com");
        await userEvent.type(signupForm.password.input, "Password1!");
        await userEvent.type(signupForm.repeatedPassword.input, "Password1!");
        await userEvent.click(signupForm.submittingButton);

        expect(signupForm.submittingButton).toBeDisabled();
    });
});
