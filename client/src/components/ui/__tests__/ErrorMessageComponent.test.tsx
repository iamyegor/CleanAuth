import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import ErrorMessage from "@/utils/ErrorMessage.ts";

const ErrorMessageComponentDefault = (
    props: Partial<ComponentProps<typeof ErrorMessageComponent>>,
) => <ErrorMessageComponent errorMessage={null} {...props} />;

const errorMessageComponent = {
    get container() {
        return screen.queryByTestId("ErrorMessageComponent");
    },
    get message() {
        return screen.queryByTestId("ErrorMessageComponent.Message");
    },
};

describe("<ErrorMessageComponent />", () => {
    test("1. Displays the error message when errorMessage is provided", () => {
        const errorMessage = ErrorMessage.create("Test error message");
        render(<ErrorMessageComponentDefault errorMessage={errorMessage} />);

        expect(errorMessageComponent.message).toHaveTextContent("Test error message");
    });

    test("2. Does not display anything when errorMessage is null", () => {
        render(<ErrorMessageComponentDefault />);

        expect(errorMessageComponent.container).not.toBeInTheDocument();
    });

    test("3. Calls handleErrorShown with true when error message is shown", () => {
        const handleErrorShown = vi.fn();
        const errorMessage = ErrorMessage.create("Test error message");
        render(
            <ErrorMessageComponentDefault
                errorMessage={errorMessage}
                handleErrorShown={handleErrorShown}
            />,
        );

        expect(handleErrorShown).toHaveBeenCalledWith(true);
    });

    test("4. Calls handleErrorShown with false when error message is not shown", () => {
        const handleErrorShown = vi.fn();
        render(<ErrorMessageComponentDefault handleErrorShown={handleErrorShown} />);

        expect(handleErrorShown).toHaveBeenCalledWith(false);
    });
});
