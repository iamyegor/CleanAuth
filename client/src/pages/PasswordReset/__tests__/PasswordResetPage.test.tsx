import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.ts";
import { http, HttpResponse } from "msw";
import routes from "@/lib/routes.tsx";
import userEvent from "@testing-library/user-event";

const needToResetPasswordEndpoint = "*/api/need-to-reset-password";

const failNeedToResetPasswordHandler = http.get(needToResetPasswordEndpoint, async () =>
    HttpResponse.json(
        {
            errorCode: "password.reset.token.invalid",
            errorMessage: "Message from the server that will be overwritten",
        },
        { status: 400 },
    ),
);

const successNeedToResetPasswordHandler = http.get(needToResetPasswordEndpoint, async () =>
    HttpResponse.json({}, { status: 200 }),
);

const successResetPasswordHandler = http.post(`*/api/reset-password`, async () =>
    HttpResponse.json(),
);

const failIsAuthenticatedHandler = http.get("*/api/is-authenticated", async () =>
    HttpResponse.json({}, { status: 400 }),
);

const successGetUsernameHandler = http.get("*/api/username", async () =>
    HttpResponse.json("yegor", { status: 200 }),
);

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
        server.use(successNeedToResetPasswordHandler);
        server.use(successResetPasswordHandler);
        server.use(successGetUsernameHandler);
        render(<PasswordResetPageDefault />);

        await waitFor(() => {
            expect(passwordResetPage.form).toBeInTheDocument();
        });

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
