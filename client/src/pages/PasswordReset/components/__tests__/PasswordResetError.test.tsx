import PasswordResetError from "@/pages/PasswordReset/components/PasswordResetError.tsx";
import React, { ComponentProps } from "react";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MemoryRouter } from "react-router-dom";

const PasswordResetErrorDefault = (props: Partial<ComponentProps<typeof PasswordResetError>>) => (
    <MemoryRouter>
        <PasswordResetError errorMessage={ErrorMessage.create("error message")} {...props} />
    </MemoryRouter>
);

const errorMessage = {
    get message() {
        return screen.getByTestId("PasswordResetError.Message");
    },
};

describe("<PasswordResetError />", () => {
    test("1. Renders error message", () => {
        const messageToDisplay: ErrorMessage = ErrorMessage.create("Error message");
        render(<PasswordResetErrorDefault errorMessage={messageToDisplay} />);

        expect(errorMessage.message).toHaveTextContent("Error message");
    });
});
