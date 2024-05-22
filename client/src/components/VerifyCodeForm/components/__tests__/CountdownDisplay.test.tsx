import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import CountdownDisplay from "@/components/VerifyCodeForm/components/CountdownDisplay.tsx";

const CountdownDisplayDefault = (props: Partial<ComponentProps<typeof CountdownDisplay>>) => (
    <CountdownDisplay secondsLeft={0} {...props} />
);

const countdownDisplay = {
    get text() {
        return screen.queryByTestId("CountdownDisplay.Text");
    },
};

describe("<CountdownDisplay />", () => {
    test("1. Displays countdown text when secondsLeft is greater than 0", () => {
        render(<CountdownDisplayDefault secondsLeft={90} />);

        expect(countdownDisplay.text).toHaveTextContent("1:30");
    });

    test("2. Displays formatted countdown with leading zeroes for seconds", () => {
        render(<CountdownDisplayDefault secondsLeft={65} />);

        expect(countdownDisplay.text).toHaveTextContent("1:05");
    });

    test("3. Does not display countdown text when secondsLeft is 0", () => {
        render(<CountdownDisplayDefault secondsLeft={0} />);

        expect(countdownDisplay.text).not.toBeInTheDocument();
    });
});
