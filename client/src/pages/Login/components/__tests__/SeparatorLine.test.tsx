import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import SeparatorLine from "@/pages/Login/components/SeparatorLine.tsx";

// Wrapper component with default props
const SeparatorLineDefault = (props: Partial<ComponentProps<typeof SeparatorLine>>) => (
    <SeparatorLine text="Default Text" {...props} />
);

const component = {
    get textElement() {
        return screen.getByTestId("SeparatorLine.Text");
    },
};

describe("<SeparatorLine />", () => {
    test("1. Displays the correct text", () => {
        render(<SeparatorLineDefault text={"Custom Text"} />);

        expect(component.textElement).toHaveTextContent("Custom Text");
    });
});
