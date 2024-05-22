import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { RouteError } from "@/types/RouteError";
import ErrorPage from "@/pages/ErrorPage/ErrorPage.tsx";

const FakePage = ({ error }: { error: RouteError }) => {
    throw error;
};

const ErrorPageDefault = ({ error }: { error: RouteError }) => {
    const router = createMemoryRouter([
        {
            path: "*",
            element: <FakePage error={error} />,
            errorElement: <ErrorPage />,
        },
    ]);
    return <RouterProvider router={router} />;
};

const errorPage = {
    get title() {
        return screen.getByTestId("ErrorPage.Title");
    },
    get message() {
        return screen.getByTestId("ErrorMessage.Message");
    },
    get reloadButton() {
        return screen.getByTestId("ErrorPage.ReloadButton");
    },
};

describe("<ErrorPage />", () => {
    test("1. Sets the correct title and message for server.error", () => {
        render(<ErrorPageDefault error={RouteError.serverError()} />);

        expect(errorPage.title).toHaveTextContent("500");
        expect(errorPage.message).toHaveTextContent(
            "It seems there is an issue with our server. Please try again later or contact support if the problem persists.",
        );
    });

    test("2. Sets the correct title and message for unexpected error", () => {
        render(<ErrorPageDefault error={RouteError.unexpected()} />);

        expect(errorPage.title).toHaveTextContent("Oops!");
        expect(errorPage.message).toHaveTextContent(
            "An unexpected error has occurred. Please try again or contact support if the issue continues.",
        );
    });

    test("3. Reloads the page when the 'Reload Page' button is clicked", async () => {
        Object.defineProperty(window, "location", {
            configurable: true,
            value: { reload: vi.fn() },
        });
        render(<ErrorPageDefault error={RouteError.serverError()} />);

        await userEvent.click(errorPage.reloadButton);

        expect(window.location.reload).toHaveBeenCalled();
    });
});
