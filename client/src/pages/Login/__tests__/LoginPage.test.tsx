import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.ts";
import routes from "@/lib/routes.tsx";
import userEvent from "@testing-library/user-event";
import {
    successGetUsernameHandler,
    successLoginHandler,
} from "@/test/requestHandlers/loginPageHandlers.ts";
import {
    failIsAuthenticatedHandler,
    successIsAuthenticatedHandler
} from "@/test/requestHandlers/isAuthenticatedHandlers.ts";

const LoginPageDefault = () => {
    const router = createMemoryRouter(routes, {
        initialEntries: ["/login"],
    });
    return <RouterProvider router={router} />;
};

const loginPage = {
    get form() {
        return screen.getByTestId("LoginForm");
    },
    formElements: {
        get emailInput() {
            return screen.getByTestId("LoginOrEmailInput.Input");
        },
        get passwordInput() {
            return screen.getByTestId("LoginPagePasswordInput.Input");
        },
        get submittingButton() {
            return screen.getByTestId("SubmittingButton");
        },
    },
};

export const getHomePage = () => screen.getByTestId("HomePage");

describe("<LoginPage />", async () => {
    test("1. Redirects to home page if already authenticated", async () => {
        server.use(successIsAuthenticatedHandler);
        server.use(successGetUsernameHandler);
        render(<LoginPageDefault />);

        await waitFor(() => expect(getHomePage()).toBeInTheDocument());
    });

    test("2. Displays login page when user isn't authenticated", async () => {
        server.use(failIsAuthenticatedHandler);
        render(<LoginPageDefault />);

        await waitFor(() => {
            expect(loginPage.form).toBeInTheDocument();
        });
    });

    test("3. Successfully logs in and redirects to home page", async () => {
        // Arrange
        server.use(failIsAuthenticatedHandler);
        server.use(successGetUsernameHandler);
        server.use(successLoginHandler);

        render(<LoginPageDefault />);

        await waitFor(() => {
            expect(loginPage.form).toBeInTheDocument();
        });

        // Act
        await userEvent.type(loginPage.formElements.emailInput, "test@example.com");
        await userEvent.type(loginPage.formElements.passwordInput, "strongPassword123");
        await userEvent.click(loginPage.formElements.submittingButton);

        // Assert
        await waitFor(() => {
            expect(getHomePage()).toBeInTheDocument();
        });
    });
});
