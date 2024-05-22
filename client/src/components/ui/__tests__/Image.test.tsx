import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import Image from "@/components/ui/Image.tsx";

const ImageDefault = (props: Partial<ComponentProps<typeof Image>>) => (
    <Image src="test-src" alt="test-alt" {...props} />
);

const imageComponent = {
    get img() {
        return screen.getByAltText("test-alt");
    },
};

describe("<Image />", () => {
    test("1. Renders with the correct src and alt attributes", () => {
        render(<ImageDefault />);

        expect(imageComponent.img).toHaveAttribute("src", "test-src");
        expect(imageComponent.img).toHaveAttribute("alt", "test-alt");
    });

    test("2. Applies additional className if provided", () => {
        render(<ImageDefault className="additional-class" />);

        expect(imageComponent.img).toHaveClass("select-none additional-class");
    });

    test("3. Forwards additional props to the img element", () => {
        render(<ImageDefault data-testid="custom-test-id" />);

        expect(screen.getByTestId("custom-test-id")).toBeInTheDocument();
    });
});
