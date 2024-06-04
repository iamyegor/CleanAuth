import AddUsernameForm, { action } from "@/pages/AddUsername/components/AddUsernameForm.tsx";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.tsx";
import { http, HttpResponse } from "msw";

const failedUsernameAddHandler = http.post(`*/api/add-login`, async () =>
    HttpResponse.json(
        {
            errorCode: "login.can.not.be.added",
            errorMessage: "Username can not be added, try again later",
        },
        { status: 400 },
    ),
);

const AddUsernameFormDefault = () => {
    const router = createMemoryRouter([
        { path: "*", element: <AddUsernameForm />, action: action },
    ]);
    return <RouterProvider router={router} />;
};

const addUsernameForm = {
    get form() {
        return screen.getByTestId("AddUsernameForm");
    },
    get input() {
        return screen.getByTestId("InputField.Input");
    },
    get errorMessage() {
        return screen.getByTestId("ErrorMessageComponent.Message");
    },
    get submittingButton() {
        return screen.getByTestId("SubmittingButton");
    },
};

describe("<AddUsernameForm />", () => {
    test("1. Displays error message for empty username input", async () => {
        render(<AddUsernameFormDefault />);

        await userEvent.click(addUsernameForm.submittingButton);

        expect(addUsernameForm.errorMessage).toHaveTextContent(
            "Username input field must not be empty",
        );
    });

    test("2. Displays error message for invalid username from server", async () => {
        server.use(failedUsernameAddHandler);
        render(<AddUsernameFormDefault />);

        await userEvent.type(addUsernameForm.input, "invalid_username");
        await userEvent.click(addUsernameForm.submittingButton);

        expect(addUsernameForm.errorMessage).toHaveTextContent(
            "Username can not be added, try again later",
        );
    });

    test("3. Disables submitting button when submitting", async () => {
        render(<AddUsernameFormDefault />);

        await userEvent.type(addUsernameForm.input, "valid_username");
        await userEvent.click(addUsernameForm.submittingButton);

        expect(addUsernameForm.submittingButton).toBeDisabled();
    });
});
