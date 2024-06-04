import VerifyCodeForm, { baseAction } from "@/components/VerifyCodeForm/VerifyCodeForm.tsx";
import React, { ComponentProps } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup.tsx";

const failedVerificationHandler = http.post("*/verify-code", async () =>
    HttpResponse.json({ errorMessage: "Invalid verification code" }, { status: 400 }),
);

const successResendCodeHandler = http.post("*/resend-code", async () => {
    return new HttpResponse();
});

const VerifyCodeFormDefault = (props: Partial<ComponentProps<typeof VerifyCodeForm>>) => {
    const verifyCodeFormProps = {
        contactDetail: "email",
        contactValue: "test@example.com",
        codeLength: 6,
        onSubmitActionRoute: "/verify-code",
        goBackRoute: "/signup",
        goBackButtonText: "Back to Signup",
        resendCodeEndpoint: "/resend-code",
        maxSeconds: 60,
        ...props,
    };

    const router = createMemoryRouter([
        {
            path: "*",
            element: <VerifyCodeForm {...verifyCodeFormProps} />,
            action: ({ request }: any) =>
                baseAction(
                    request,
                    6,
                    "/verify-code",
                    "/signup",
                    (err: any) => err.response.data.errorMessage,
                ),
        },
    ]);
    return <RouterProvider router={router} />;
};

const verifyCodeForm = {
    get form() {
        return screen.getByTestId("VerifyCodeForm.Form");
    },
    codeInput: {
        get input() {
            return screen.queryAllByRole("textbox");
        },
        get feedbackMessage() {
            return (
                screen.queryByTestId("ErrorMessageComponent.Message") ??
                screen.getByTestId("FeedbackMessageComponent.SuccessMessage")
            );
        },
    },
    get submittingButton() {
        return screen.getByTestId("SubmittingButton");
    },
    get resendCodeButton() {
        return screen.getByTestId("ResendCodeButton");
    },
    get countdownDisplayText() {
        return screen.getByTestId("CountdownDisplay.Text");
    },
    get contactDetailHeading() {
        return screen.getByTestId("VerifyCodeForm.ContactDetailHeading");
    },
    get contactDetailMessage() {
        return screen.getByTestId("VerifyCodeForm.ContactDetailMessage");
    },
    get goBackButton() {
        return screen.getByTestId("GoBackButton");
    },
};

describe("<VerifyCodeForm />", () => {
    test("1. Displays error message for code input when invalid code is entered", async () => {
        render(<VerifyCodeFormDefault />);

        await userEvent.type(verifyCodeForm.codeInput.input[0], "1");
        await userEvent.type(verifyCodeForm.codeInput.input[1], "2");
        await userEvent.type(verifyCodeForm.codeInput.input[2], "3");

        await userEvent.click(verifyCodeForm.submittingButton);

        await waitFor(() => {
            expect(verifyCodeForm.codeInput.feedbackMessage).toHaveTextContent(
                "Code length must be 6 numbers long",
            );
        });
    });

    test("2. Disables submitting button when submitting", async () => {
        render(<VerifyCodeFormDefault />);

        await userEvent.type(verifyCodeForm.codeInput.input[0], "1");
        await userEvent.type(verifyCodeForm.codeInput.input[1], "2");
        await userEvent.type(verifyCodeForm.codeInput.input[2], "3");
        await userEvent.type(verifyCodeForm.codeInput.input[3], "4");
        await userEvent.type(verifyCodeForm.codeInput.input[4], "5");
        await userEvent.type(verifyCodeForm.codeInput.input[5], "6");

        await userEvent.click(verifyCodeForm.submittingButton);

        expect(verifyCodeForm.submittingButton).toBeDisabled();
    });

    test("3. Displays countdown timer with correct time", async () => {
        render(<VerifyCodeFormDefault maxSeconds={61} />);

        await userEvent.click(verifyCodeForm.resendCodeButton);

        expect(verifyCodeForm.countdownDisplayText).toHaveTextContent(
            "You will be able resend code in 1:01",
        );
    });

    test("4. Resend code button is disabled when more than 0 seconds left", () => {
        render(<VerifyCodeFormDefault />);

        expect(verifyCodeForm.resendCodeButton).toBeDisabled();
    });

    test("5. Error message from submission overrides feedback message from code resend", async () => {
        // Arrange
        server.use(successResendCodeHandler);
        render(<VerifyCodeFormDefault maxSeconds={0} />);

        await userEvent.click(verifyCodeForm.resendCodeButton);

        await waitFor(() => {
            expect(verifyCodeForm.codeInput.feedbackMessage).toHaveTextContent(
                "Verification code sent successfully!",
            );
        });

        // Act
        await userEvent.type(verifyCodeForm.codeInput.input[0], "1");
        await userEvent.type(verifyCodeForm.codeInput.input[1], "2");
        await userEvent.type(verifyCodeForm.codeInput.input[2], "3");

        await userEvent.click(verifyCodeForm.submittingButton);

        // Assert
        await waitFor(() => {
            expect(verifyCodeForm.codeInput.feedbackMessage).toHaveTextContent(
                "Code length must be 6 numbers long",
            );
        });
    });

    test("6. Displays correct contact detail information", () => {
        render(<VerifyCodeFormDefault contactDetail="phone number" contactValue="123-456-7890" />);

        expect(verifyCodeForm.contactDetailHeading).toHaveTextContent("Verify Your phone number");
        expect(verifyCodeForm.contactDetailMessage).toHaveTextContent(
            "Please enter the verification code sent to 123-456-7890",
        );
    });

    test("7. Form has correct action route", () => {
        render(<VerifyCodeFormDefault onSubmitActionRoute="/custom-verify-code" />);

        expect(verifyCodeForm.form).toHaveAttribute("action", "/custom-verify-code");
    });

    test("8. Go back button has correct route and text", () => {
        render(<VerifyCodeFormDefault goBackRoute="/home" goBackButtonText="Go Home" />);

        expect(verifyCodeForm.goBackButton).toHaveTextContent("Go Home");
        expect(verifyCodeForm.goBackButton).toHaveAttribute("href", "/home");
    });

    test("9. Resend code button has correct endpoint", async () => {
        const customHandler = http.post("*/custom-resend-code", async () => new HttpResponse());
        server.use(customHandler);
        render(<VerifyCodeFormDefault resendCodeEndpoint="/custom-resend-code" maxSeconds={0} />);

        await userEvent.click(verifyCodeForm.resendCodeButton);

        await waitFor(() => {
            expect(verifyCodeForm.codeInput.feedbackMessage).toHaveTextContent(
                "Verification code sent successfully!",
            );
        });
    });

    test("10. Displays error message when server invalidates the code", async () => {
        server.use(failedVerificationHandler);
        render(<VerifyCodeFormDefault />);

        await userEvent.type(verifyCodeForm.codeInput.input[0], "1");
        await userEvent.type(verifyCodeForm.codeInput.input[1], "2");
        await userEvent.type(verifyCodeForm.codeInput.input[2], "3");
        await userEvent.type(verifyCodeForm.codeInput.input[3], "4");
        await userEvent.type(verifyCodeForm.codeInput.input[4], "5");
        await userEvent.type(verifyCodeForm.codeInput.input[5], "6");

        await userEvent.click(verifyCodeForm.submittingButton);

        await waitFor(() => {
            expect(verifyCodeForm.codeInput.feedbackMessage).toHaveTextContent(
                "Invalid verification code",
            );
        });
    });
});
