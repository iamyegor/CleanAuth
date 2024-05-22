import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.ts";
import { http, HttpResponse } from "msw";
import routes from "@/lib/routes.tsx";
import userEvent from "@testing-library/user-event";

const emailForVerificationEndpoint = "*/api/email-for-verification";

const failEmailForVerificationHandler = http.get(emailForVerificationEndpoint, async () =>
    HttpResponse.json({}, { status: 400 }),
);

const successEmailForVerificationHandler = http.get(emailForVerificationEndpoint, async () =>
    HttpResponse.json("test@example.com", { status: 200 }),
);

const successVerifyEmailHandler = http.post("*/api/verify-email", async () =>
    HttpResponse.json({}, { status: 200 }),
);

const successNeedToAddPhoneNumberHandler = http.get("*/api/need-to-add-phone-number", async () =>
    HttpResponse.json({}, { status: 200 }),
);

const VerifyEmailPageDefault = () => {
    const router = createMemoryRouter(routes, {
        initialEntries: ["/verify-email"],
    });
    return <RouterProvider router={router} />;
};

const verifyEmailPage = {
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

describe("<VerifyEmailPage />", () => {
    test("1. Redirects to signup page if email verification fails", async () => {
        server.use(failEmailForVerificationHandler);
        render(<VerifyEmailPageDefault />);

        await waitFor(() => expect(screen.getByTestId("SignupPage")).toBeInTheDocument());
    });

    test("2. Displays verify email page when email verification is successful", async () => {
        server.use(successEmailForVerificationHandler);
        render(<VerifyEmailPageDefault />);

        await waitFor(() => expect(verifyEmailPage.form).toBeInTheDocument());
    });

    test("3. Successfully verifies email and redirects", async () => {
        // Arrange
        server.use(successEmailForVerificationHandler);
        server.use(successVerifyEmailHandler);
        server.use(successNeedToAddPhoneNumberHandler);
        render(<VerifyEmailPageDefault />);

        await waitFor(() => {
            expect(verifyEmailPage.form).toBeInTheDocument();
        });

        // Act
        await userEvent.type(verifyEmailPage.formElements.codeInput[0], "1");
        await userEvent.type(verifyEmailPage.formElements.codeInput[1], "2");
        await userEvent.type(verifyEmailPage.formElements.codeInput[2], "3");
        await userEvent.type(verifyEmailPage.formElements.codeInput[3], "4");
        await userEvent.type(verifyEmailPage.formElements.codeInput[4], "5");
        await userEvent.click(verifyEmailPage.formElements.submittingButton);

        // Assert
        await waitFor(() => {
            expect(screen.getByTestId("AddPhoneNumberPage")).toBeInTheDocument();
        });
    });
    
    test("4. Go back button redirects to signup page", async () => {
        // Arrange
        server.use(successEmailForVerificationHandler);
        render(<VerifyEmailPageDefault />);

        await waitFor(() => {
            expect(verifyEmailPage.form).toBeInTheDocument();
        });

        // Act
        await userEvent.click(verifyEmailPage.formElements.goBackButton);

        // Assert
        await waitFor(() => {
            expect(screen.getByTestId("SignupPage")).toBeInTheDocument();
        });
    });
});
