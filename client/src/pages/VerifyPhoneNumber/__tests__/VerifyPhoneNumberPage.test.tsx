import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.ts";
import { http, HttpResponse } from "msw";
import routes from "@/lib/routes.tsx";
import userEvent from "@testing-library/user-event";

const phoneNumberForVerificationEndpoint = "*/api/phone-number-for-verification";

const failPhoneNumberForVerificationHandler = http.get(
    phoneNumberForVerificationEndpoint,
    async () => HttpResponse.json({}, { status: 400 }),
);

const successPhoneNumberForVerificationHandler = http.get(
    phoneNumberForVerificationEndpoint,
    async () => HttpResponse.json("123-456-7890", { status: 200 }),
);

const successVerifyPhoneNumberHandler = http.post("*/api/verify-phone-number", async () =>
    HttpResponse.json({}, { status: 200 }),
);

const successGetUsernameHandler = http.get("*/api/username", async () =>
    HttpResponse.json("yegor", { status: 200 }),
);

const successNeedToAddPhoneNumberHandler = http.get("*/api/need-to-add-phone-number", async () =>
    HttpResponse.json({}, { status: 200 }),
);

const VerifyPhoneNumberPageDefault = () => {
    const router = createMemoryRouter(routes, {
        initialEntries: ["/verify-phone-number"],
    });
    return <RouterProvider router={router} />;
};

const verifyPhoneNumberPage = {
    get form() {
        return screen.getByTestId("VerifyCodeForm.Form");
    },
    formElements: {
        get codeInput() {
            return screen.getAllByRole("textbox");
        },
        get submittingButton() {
            return screen.getByTestId("SubmittingButton");
        },
        get goBackButton() {
            return screen.getByTestId("GoBackButton");
        },
    },
};

describe("<VerifyPhoneNumberPage />", () => {
    test("1. Redirects to signup page if phone number verification fails", async () => {
        server.use(failPhoneNumberForVerificationHandler);
        render(<VerifyPhoneNumberPageDefault />);

        await waitFor(() => expect(screen.getByTestId("SignupPage")).toBeInTheDocument());
    });

    test("2. Displays verify phone number page when phone number verification is successful", async () => {
        server.use(successPhoneNumberForVerificationHandler);
        render(<VerifyPhoneNumberPageDefault />);

        await waitFor(() => expect(verifyPhoneNumberPage.form).toBeInTheDocument());
    });

    test("3. Successfully verifies phone number and redirects", async () => {
        // Arrange
        server.use(successGetUsernameHandler);
        server.use(successPhoneNumberForVerificationHandler);
        server.use(successVerifyPhoneNumberHandler);
        render(<VerifyPhoneNumberPageDefault />);

        await waitFor(() => {
            expect(verifyPhoneNumberPage.form).toBeInTheDocument();
        });

        // Act
        await userEvent.type(verifyPhoneNumberPage.formElements.codeInput[0], "1");
        await userEvent.type(verifyPhoneNumberPage.formElements.codeInput[1], "2");
        await userEvent.type(verifyPhoneNumberPage.formElements.codeInput[2], "3");
        await userEvent.type(verifyPhoneNumberPage.formElements.codeInput[3], "4");
        await userEvent.click(verifyPhoneNumberPage.formElements.submittingButton);

        // Assert
        await waitFor(() => {
            expect(screen.getByTestId("HomePage")).toBeInTheDocument();
        });
    });

    test("4. Go back button redirects to add phone number page", async () => {
        // Arrange
        server.use(successPhoneNumberForVerificationHandler);
        server.use(successNeedToAddPhoneNumberHandler);
        render(<VerifyPhoneNumberPageDefault />);

        await waitFor(() => {
            expect(verifyPhoneNumberPage.form).toBeInTheDocument();
        });

        // Act
        await userEvent.click(verifyPhoneNumberPage.formElements.goBackButton);

        // Assert
        await waitFor(() => {
            expect(screen.getByTestId("AddPhoneNumberPage")).toBeInTheDocument();
        });
    });
});
