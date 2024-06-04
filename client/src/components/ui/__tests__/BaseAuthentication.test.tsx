import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import BaseAuthentication from "@/components/ui/basePages/BaseAuthentication.tsx";
import abstractFormImage from "@/assets/abstract_3d_form.png";

const BaseAuthenticationDefault = (props: Partial<ComponentProps<typeof BaseAuthentication>>) => (
    <BaseAuthentication image={abstractFormImage} {...props}>
        <div data-testid="ChildElement">Test Child</div>
    </BaseAuthentication>
);

const baseAuthentication = {
    get primaryImage() {
        return screen.getByTestId("PrimaryImage.Image");
    },
    get decorativeImage() {
        return screen.getByTestId("BaseAuthentication.DecorativeBackground");
    },
    get childElement() {
        return screen.getByTestId("ChildElement");
    },
};

describe("<BaseAuthentication />", () => {
    test("1. Renders the primary image", () => {
        render(<BaseAuthenticationDefault image={abstractFormImage} />);

        expect(baseAuthentication.primaryImage).toHaveAttribute("src", abstractFormImage);
    });

    test("2. Renders the decorative background image", () => {
        render(<BaseAuthenticationDefault />);

        expect(baseAuthentication.decorativeImage).toBeInTheDocument();
    });

    test("3. Displays the children", () => {
        render(<BaseAuthenticationDefault />);

        expect(baseAuthentication.childElement).toHaveTextContent("Test Child");
    });

    test("4. Uses the provided data-testid", () => {
        const testId = "CustomTestId";
        render(<BaseAuthenticationDefault data-testid={testId} />);

        expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    test("5. Applies default data-testid if none provided", () => {
        render(<BaseAuthenticationDefault />);

        expect(screen.getByTestId("BaseAuthentication")).toBeInTheDocument();
    });
});
