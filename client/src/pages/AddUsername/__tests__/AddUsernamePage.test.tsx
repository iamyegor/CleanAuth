import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.tsx";
import routes from "@/lib/routes.tsx";
import userEvent from "@testing-library/user-event";
import {
    failCanAddLoginHandler,
    successAddLoginHandler,
    successCanAddLoginHandler,
} from "@/test/requestHandlers/addUsernamePageHandlers.ts";
import { successNeedToAddPhoneNumberHandler } from "@/test/requestHandlers/addPhoneNumberPageHandlers.ts";

const AddUsernamePageDefault = () => {
    const router = createMemoryRouter(routes, {
        initialEntries: ["/add-username"],
    });
    return <RouterProvider router={router} />;
};

const addUsernamePage = {
    get page() {
        return screen.getByTestId("AddUsernamePage");
    },
    get form() {
        return screen.getByTestId("AddUsernameForm");
    },
    formElements: {
        get input() {
            return screen.getByTestId("InputField.Input");
        },
        get errorMessage() {
            return screen.getByTestId("ErrorMessageComponent.Message");
        },
        get submittingButton() {
            return screen.getByTestId("SubmittingButton");
        },
    },
    get goBackButton() {
        return screen.getByText("Go back to login");
    },
};

describe("<AddUsernamePage />", () => {
    test("1. Redirects to signup page if user isn't allowed to add username", async () => {
        server.use(failCanAddLoginHandler);
        render(<AddUsernamePageDefault />);

        await waitFor(() => expect(screen.getByTestId("SignupPage")).toBeInTheDocument());
    });

    test("2. Displays add username page when user can add username", async () => {
        server.use(successCanAddLoginHandler);
        render(<AddUsernamePageDefault />);

        await waitFor(() => expect(addUsernamePage.page).toBeInTheDocument());
    });

    test("3. Successfully submits username and redirects to add phone number page", async () => {
        // Arrange
        server.use(successCanAddLoginHandler);
        server.use(successAddLoginHandler);
        server.use(successNeedToAddPhoneNumberHandler);
        render(<AddUsernamePageDefault />);

        await waitFor(() => {
            expect(addUsernamePage.form).toBeInTheDocument();
        });

        // Act
        await userEvent.type(addUsernamePage.formElements.input, "valid_username");
        await userEvent.click(addUsernamePage.formElements.submittingButton);

        // Assert
        await waitFor(() => {
            expect(screen.getByTestId("AddPhoneNumberPage")).toBeInTheDocument();
        });
    });

    test("4. Navigates back to login page when go back button is clicked", async () => {
        server.use(successCanAddLoginHandler);
        render(<AddUsernamePageDefault />);
        await waitFor(() => expect(addUsernamePage.goBackButton).toBeInTheDocument());

        await userEvent.click(addUsernamePage.goBackButton);

        await waitFor(() => expect(screen.getByTestId("LoginPage")).toBeInTheDocument());
    });
});
