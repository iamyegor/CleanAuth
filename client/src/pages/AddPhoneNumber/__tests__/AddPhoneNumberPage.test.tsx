import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.ts";
import { http, HttpResponse } from "msw";
import routes from "@/lib/routes.tsx";
import userEvent from "@testing-library/user-event";

const needToAddPhoneNumberEndpoint = "*/api/need-to-add-phone-number";

const successNeedToAddPhoneNumberHandler = http.get(needToAddPhoneNumberEndpoint, async () =>
    HttpResponse.json({}, { status: 200 }),
);

const failNeedToAddPhoneNumberHandler = http.get(needToAddPhoneNumberEndpoint, async () =>
    HttpResponse.json({}, { status: 400 }),
);

const successAddPhoneNumberHandler = http.post("*/api/add-phone-number", async () => {
    return HttpResponse.json({}, { status: 200 });
});

const successGetPhoneNumberForVerificationHandler = http.get(
    "*/api/phone-number-for-verification",
    async () => HttpResponse.json("1234567890", { status: 200 }),
);

const AddPhoneNumberPageDefault = () => {
    const router = createMemoryRouter(routes, {
        initialEntries: ["/add-phone-number"],
    });

    return <RouterProvider router={router} />;
};

const addPhoneNumberPage = {
    get form() {
        return screen.getByTestId("AddPhoneNumberForm");
    },
    formElements: {
        get phoneInput() {
            return screen.getByTestId("PhoneInput.Input");
        },
        get submittingButton() {
            return screen.getByTestId("SubmittingButton");
        },
    },
};

export const getSignupPage = () => screen.getByTestId("SignupPage");

describe("<AddPhoneNumberPage />", async () => {
    test("1. Redirects to signup page if the user doesn't need to add phone number", async () => {
        server.use(failNeedToAddPhoneNumberHandler);
        render(<AddPhoneNumberPageDefault />);

        await waitFor(() => expect(getSignupPage()).toBeInTheDocument());
    });

    test("2. Displays add phone number page when user needs to add phone number", async () => {
        server.use(successNeedToAddPhoneNumberHandler);
        render(<AddPhoneNumberPageDefault />);

        await waitFor(() => {
            expect(addPhoneNumberPage.form).toBeInTheDocument();
        });
    });

    test("3. Successfully submits phone number and redirects to verification page", async () => {
        // Arrange
        server.use(successNeedToAddPhoneNumberHandler);
        server.use(successAddPhoneNumberHandler);
        server.use(successGetPhoneNumberForVerificationHandler);
        render(<AddPhoneNumberPageDefault />);

        await waitFor(() => {
            expect(addPhoneNumberPage.form).toBeInTheDocument();
        });

        // Act
        await userEvent.type(addPhoneNumberPage.formElements.phoneInput, "1234567890");
        await userEvent.click(addPhoneNumberPage.formElements.submittingButton);

        // Assert
        await waitFor(() => {
            expect(screen.getByTestId("VerifyPhoneNumberPage")).toBeInTheDocument();
        });
    });
});
