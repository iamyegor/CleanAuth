import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vitest } from "vitest";
import CountryCodeButton from "@/pages/AddPhoneNumber/components/CountryCodeButton.tsx";
import countries from "@/pages/AddPhoneNumber/data/countries.ts";

const CountryCodeButtonDefault = (props: Partial<ComponentProps<typeof CountryCodeButton>>) => (
    <CountryCodeButton country={countries[0]} setIsOpen={() => {}} {...props} />
);

const countryCodeButton = {
    get button() {
        return screen.getByTestId("CountryCodeButton.Button");
    },
    get flag() {
        return screen.getByTestId("CountryCodeButton.Flag");
    },
    get dialCode() {
        return screen.getByTestId("CountryCodeButton.DialCode");
    },
};

describe("<CountryCodeButton />", () => {
    test("1. Renders flag and dial code", () => {
        render(<CountryCodeButtonDefault />);

        expect(countryCodeButton.flag).toHaveTextContent(countries[0].flag);
        expect(countryCodeButton.dialCode).toHaveTextContent(countries[0].dialCode);
    });

    test("2. Shows dropdown on click", async () => {
        const isOpen = false;
        const setIsOpen = vitest.fn((newValue: (prev: boolean) => boolean) => newValue(isOpen));
        render(<CountryCodeButtonDefault setIsOpen={setIsOpen} />);

        await userEvent.click(countryCodeButton.button);

        expect(setIsOpen).toHaveBeenCalledTimes(1);
        expect(setIsOpen.mock.results[0].value).toBe(true);
    });

    test("3. Hides dropdown on second click", async () => {
        const isOpen = true;
        const setIsOpen = vitest.fn((newValue: (prev: boolean) => boolean) => newValue(isOpen));
        render(<CountryCodeButtonDefault setIsOpen={setIsOpen} />);

        await userEvent.click(countryCodeButton.button);

        expect(setIsOpen).toHaveBeenCalledTimes(1);
        expect(setIsOpen.mock.results[0].value).toBe(false);
    });
});
