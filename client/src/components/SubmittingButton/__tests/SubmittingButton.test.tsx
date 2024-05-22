import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

const SubmittingButtonDefault = (props: Partial<ComponentProps<typeof SubmittingButton>>) => (
    <SubmittingButton loading={false} text="Submit" {...props} />
);

const submittingButton = {
    get button() {
        return screen.getByTestId("SubmittingButton");
    },
    get text() {
        return screen.queryByTestId("SubmittingButton.Text");
    },
    get spinner() {
        return screen.queryByTestId("SubmittingButton.Spinner");
    },
};

describe("<SubmittingButton />", () => {
    test("1. Renders button with correct text", () => {
        render(<SubmittingButtonDefault />);

        expect(submittingButton.text).toHaveTextContent("Submit");
    });

    test("2. Shows spinner when loading", () => {
        render(<SubmittingButtonDefault loading={true} />);

        expect(submittingButton.spinner).toBeInTheDocument();
        expect(submittingButton.text).not.toBeInTheDocument();
    });

    test("3. Disables button when loading", () => {
        render(<SubmittingButtonDefault loading={true} />);

        expect(submittingButton.button).toBeDisabled();
    });

    test("4. Disables button when disabled prop is true", () => {
        render(<SubmittingButtonDefault disabled={true} />);

        expect(submittingButton.button).toBeDisabled();
    });

    test("5. Calls onClick handler when clicked", async () => {
        const onClickMock = vi.fn();
        const user = userEvent.setup();
        render(<SubmittingButtonDefault onClick={onClickMock} />);

        await user.click(submittingButton.button);

        expect(onClickMock).toHaveBeenCalled();
    });

    test("6. Does not call onClick handler when loading", async () => {
        const onClickMock = vi.fn();
        const user = userEvent.setup();
        render(<SubmittingButtonDefault loading={true} onClick={onClickMock} />);

        await user.click(submittingButton.button);

        expect(onClickMock).not.toHaveBeenCalled();
    });

    test("7. Does not call onClick handler when disabled", async () => {
        const onClickMock = vi.fn();
        const user = userEvent.setup();
        render(<SubmittingButtonDefault disabled={true} onClick={onClickMock} />);

        await user.click(submittingButton.button);

        expect(onClickMock).not.toHaveBeenCalled();
    });
});
