import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.tsx";
import routes from "@/lib/routes.tsx";
import userEvent from "@testing-library/user-event";
import { successGetUsernameHandler } from "@/test/requestHandlers/loginPageHandlers.ts";
import { failIsAuthenticatedHandler } from "@/test/requestHandlers/isAuthenticatedHandlers.ts";
import {
    failNeedToResetPasswordHandler,
    successNeedToResetPasswordHandler,
    successResetPasswordHandler,
} from "@/test/requestHandlers/passwordResetPageHandlers.ts";

const PasswordResetPageDefault = ({
    uid = "testUid",
    token = "testToken",
}: {
    uid?: string;
    token?: string;
}) => {
    const router = createMemoryRouter(routes, {
        initialEntries: [`/reset-password?uid=${uid}&token=${token}`],
    });

    return <RouterProvider router={router} />;
};

function mockHref(href: string) {
    const originalLocation = window.location;

    // @ts-ignore
    delete window.location;
    window.location = { ...originalLocation, href };
}

const passwordResetPage = {
    get errorMessage() {
        return screen.queryByTestId("PasswordResetError.Message");
    },
    get form() {
        return screen.getByTestId("PasswordResetForm");
    },
    formElements: {
        get passwordInput() {
            return screen.getByPlaceholderText("New password");
        },
        get confirmPasswordInput() {
            return screen.getByPlaceholderText("Repeat password");
        },
        get submittingButton() {
            return screen.getByTestId("SubmittingButton");
        },
    },
    errorMessageElements: {
        get goBackLink() {
            return screen.getByTestId("PasswordResetError.GoBackLink");
        },
    },
};

export const getRequestPasswordResetPage = () => screen.getByTestId("RequestPasswordResetPage");
export const getHomePage = () => screen.getByTestId("HomePage");

describe("<PasswordResetPage />", async () => {
    test("1. Displays error message when uid is empty", async () => {
        render(<PasswordResetPageDefault uid="" />);

        await waitFor(() => {
            expect(passwordResetPage.errorMessage).toHaveTextContent("Invalid link.");
        });
    });

    test("2. Displays error message when token is empty", async () => {
        render(<PasswordResetPageDefault token="" />);

        await waitFor(() => {
            expect(passwordResetPage.errorMessage).toHaveTextContent("Invalid link.");
        });
    });

    test("3. Displays error message when server invalidates uid or token", async () => {
        server.use(failNeedToResetPasswordHandler);
        render(<PasswordResetPageDefault />);

        await waitFor(() => {
            expect(passwordResetPage.errorMessage).toHaveTextContent("Invalid link.");
        });
    });

    test("4. Redirects to home page when successfully submitting the form", async () => {
        // Arrange
        mockHref("http://localhost/reset-password?uid=testUid&token=testToken");
        
        server.use(successNeedToResetPasswordHandler);
        server.use(successResetPasswordHandler);
        server.use(successGetUsernameHandler);
        render(<PasswordResetPageDefault />);
        
        await waitFor(() => expect(passwordResetPage.form).toBeInTheDocument());

        // Act
        await userEvent.type(passwordResetPage.formElements.passwordInput, "strongPass123");
        await userEvent.type(passwordResetPage.formElements.confirmPasswordInput, "strongPass123");
        await userEvent.click(passwordResetPage.formElements.submittingButton);

        // Assert
        await waitFor(() => expect(getHomePage()).toBeInTheDocument());
    });

    test("5. Redirects back to request password reset page when clicking on go back link", async () => {
        // Arrange
        server.use(failNeedToResetPasswordHandler);
        server.use(failIsAuthenticatedHandler);
        render(<PasswordResetPageDefault />);

        await waitFor(() => {
            expect(passwordResetPage.errorMessageElements.goBackLink).toBeInTheDocument();
        });

        // Act
        await userEvent.click(passwordResetPage.errorMessageElements.goBackLink);

        // Assert
        await waitFor(() => {
            expect(getRequestPasswordResetPage()).toBeInTheDocument();
        });
    });
});
