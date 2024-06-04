import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import BaseRoundedPage from "@/components/ui/basePages/BaseRoundedPage.tsx";

const BaseRoundedPageDefault = (props: Partial<ComponentProps<typeof BaseRoundedPage>>) => (
    <BaseRoundedPage {...props}>
        <div data-testid="ChildElement">Test Child</div>
    </BaseRoundedPage>
);

const baseRoundedPage = {
    get childElement() {
        return screen.getByTestId("ChildElement");
    },
};

describe("<BaseRoundedPage />", () => {
    test("1. Displays the children", () => {
        render(<BaseRoundedPageDefault data-testid="BaseRoundedPage" />);

        expect(baseRoundedPage.childElement).toHaveTextContent("Test Child");
    });

    test("2. Uses the provided data-testid", () => {
        const testId = "CustomTestId";
        render(<BaseRoundedPageDefault data-testid={testId} />);

        expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
});
