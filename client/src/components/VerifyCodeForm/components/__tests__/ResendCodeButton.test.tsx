import React, { ComponentProps } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import userEvent from "@testing-library/user-event";
import ResendCodeButton from "@/components/VerifyCodeForm/components/ResendCodeButton.tsx";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup.ts";
import wait from "@/utils/wait.ts";

const successResendCodeHandler = http.post("*/resend-code", async () => {
    await wait(100);
    return new HttpResponse();
});

const ResendCodeButtonDefault = (props: Partial<ComponentProps<typeof ResendCodeButton>>) => (
    <ResendCodeButton
        setSecondsLeft={() => {}}
        secondsLeft={0}
        maxSeconds={60}
        setMessage={() => {}}
        resendCodeEndpoint="/resend-code"
        {...props}
    />
);

const resendCodeButton = {
    get button() {
        return screen.getByTestId("ResendCodeButton");
    },
    get spinner() {
        return screen.getByTestId("Spinner");
    },
};

describe("<ResendCodeButton />", () => {
    test("1. Displays resend code button", () => {
        render(<ResendCodeButtonDefault />);

        expect(resendCodeButton.button).toBeInTheDocument();
    });

    test("2. Disables button when secondsLeft is greater than 0", () => {
        render(<ResendCodeButtonDefault secondsLeft={10} />);

        expect(resendCodeButton.button).toBeDisabled();
    });

    test("3. Enables button when secondsLeft is 0", () => {
        render(<ResendCodeButtonDefault secondsLeft={0} />);

        expect(resendCodeButton.button).toBeEnabled();
    });

    // If any problems occur in this test, they may be due to the wait time in the
    // successResendCodeHandler
    test("4. Displays spinner when loading", async () => {
        server.use(successResendCodeHandler);
        render(<ResendCodeButtonDefault />);

        await userEvent.click(resendCodeButton.button);

        await waitFor(() => expect(resendCodeButton.spinner).toBeInTheDocument());
    });

    test("5. Resets timer and sets success message on successful API call", async () => {
        // Arrange
        server.use(successResendCodeHandler);
        const setMessageMock = vi.fn();
        const setSecondsLeftMock = vi.fn();

        render(
            <ResendCodeButtonDefault
                setMessage={setMessageMock}
                setSecondsLeft={setSecondsLeftMock}
                maxSeconds={60}
            />,
        );

        // Act
        await userEvent.click(resendCodeButton.button);

        // Assert
        await waitFor(() => {
            expect(setSecondsLeftMock).toHaveBeenCalledWith(60);

            const message = setMessageMock.mock.calls[0][0];
            expect(message.message).toBe("Verification code sent successfully!");
            expect(message.isSuccess).toBe(true);
        });
    });
});
