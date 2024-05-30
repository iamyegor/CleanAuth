import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.ts";
import routes from "@/lib/routes.tsx";
import {
    failIsAuthenticatedHandler,
    successIsAuthenticatedHandler,
} from "@/test/requestHandlers/isAuthenticatedHandlers.ts";
import { successGetUsernameHandler } from "@/test/requestHandlers/loginPageHandlers.ts";

const RequestPasswordResetPageDefault = () => {
    const router = createMemoryRouter(routes, {
        initialEntries: ["/request-password-reset"],
    });
    return <RouterProvider router={router} />;
};

const requestPasswordResetPage = {
    get form() {
        return screen.getByTestId("RequestPasswordResetForm");
    },
    get self() {
        return screen.getByTestId("RequestPasswordResetPage");
    },
    get navLink() {
        return screen.getByRole("link", { name: /go back to login/i });
    },
};

describe("<RequestPasswordResetPage />", () => {
    test("1. Redirects to home page if already authenticated", async () => {
        server.use(successIsAuthenticatedHandler);
        server.use(successGetUsernameHandler);
        render(<RequestPasswordResetPageDefault />);

        await waitFor(() => expect(screen.getByTestId("HomePage")).toBeInTheDocument());
    });

    test("2. Displays request password reset page when user isn't authenticated", async () => {
        server.use(failIsAuthenticatedHandler);
        render(<RequestPasswordResetPageDefault />);

        await waitFor(() => {
            expect(requestPasswordResetPage.self).toBeInTheDocument();
            expect(requestPasswordResetPage.form).toBeInTheDocument();
        });
    });

    test("3. Navigates back to login page when 'Go back to login' is clicked", async () => {
        server.use(failIsAuthenticatedHandler);
        render(<RequestPasswordResetPageDefault />);

        await waitFor(() => {
            expect(requestPasswordResetPage.self).toBeInTheDocument();
        });

        await userEvent.click(requestPasswordResetPage.navLink);

        await waitFor(() => {
            expect(screen.getByTestId("LoginPage")).toBeInTheDocument();
        });
    });
});
