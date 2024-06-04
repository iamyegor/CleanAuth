import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { server } from "@/test/setup.tsx";
import routes from "@/lib/routes.tsx";
import userEvent from "@testing-library/user-event";
import { successGetUsernameHandler } from "@/test/requestHandlers/loginPageHandlers.ts";
import { successNeedToAddPhoneNumberHandler } from "@/test/requestHandlers/addPhoneNumberPageHandlers.ts";
import {
    failPhoneNumberForVerificationHandler,
    successPhoneNumberForVerificationHandler,
    successVerifyPhoneNumberHandler,
} from "@/test/requestHandlers/verifyPhoneNumberPageHandlers.ts";
import {
    failIsAuthenticatedHandler,
    successIsAuthenticatedHandler
} from "@/test/requestHandlers/isAuthenticatedHandlers.ts";

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
    test("1. Redirects to signup page if phone number doesn't need verification", async () => {
        server.use(failPhoneNumberForVerificationHandler);
        server.use(failIsAuthenticatedHandler);
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
        await waitFor(() => expect(screen.getByTestId("HomePage")).toBeInTheDocument());
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
