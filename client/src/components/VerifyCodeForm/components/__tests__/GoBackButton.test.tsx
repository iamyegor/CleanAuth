import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MemoryRouter } from "react-router-dom";
import GoBackButtonVariant2 from "@/components/VerifyCodeForm/components/GoBackButtonVariant2.tsx";

const GoBackButtonDefault = (props: Partial<ComponentProps<typeof GoBackButtonVariant2>>) => (
    <MemoryRouter>
        <GoBackButtonVariant2 route="/signup" text="Back to Signup" {...props} />
    </MemoryRouter>
);

const goBackButtonTest = {
    get button() {
        return screen.getByTestId("GoBackButton");
    },
};

describe("<GoBackButton />", () => {
    test("1. Displays button with provided properties", () => {
        render(<GoBackButtonDefault route="/login" text="Back to Login" />);

        expect(goBackButtonTest.button).toHaveTextContent("Back to Login");
        expect(goBackButtonTest.button).toHaveAttribute("href", "/login");
    });
});
