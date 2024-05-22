import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import BasePasswordReset from "@/components/ui/BasePasswordReset.tsx";

const BasePasswordResetDefault = (props: Partial<ComponentProps<typeof BasePasswordReset>>) => (
    <BasePasswordReset {...props}>
        <div data-testid="ChildElement">Test Child</div>
    </BasePasswordReset>
);

const basePasswordReset = {
    get childElement() {
        return screen.getByTestId("ChildElement");
    },
};

describe("<BasePasswordReset />", () => {
    test("1. Displays the children", () => {
        render(<BasePasswordResetDefault data-testid="BasePasswordReset" />);

        expect(basePasswordReset.childElement).toHaveTextContent("Test Child");
    });

    test("2. Uses the provided data-testid", () => {
        const testId = "CustomTestId";
        render(<BasePasswordResetDefault data-testid={testId} />);

        expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
});
