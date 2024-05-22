import React, { ComponentProps } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vitest } from "vitest";
import PhoneInput from "@/pages/AddPhoneNumber/components/PhoneInput.tsx";
import countries from "@/pages/AddPhoneNumber/data/countries.ts";

const PhoneInputDefault = (props: Partial<ComponentProps<typeof PhoneInput>>) => (
    <PhoneInput
        country={countries[0]}
        setCountry={() => {}}
        phoneNumber=""
        setPhoneNumber={() => {}}
        {...props}
    />
);

const phoneInput = {
    get input() {
        return screen.getByTestId("PhoneInput.Input");
    },
    get countryCodeButton() {
        return screen.getByTestId("CountryCodeButton.Button");
    },
    get countryCodeButtonDialCode() {
        return screen.getByTestId("CountryCodeButton.DialCode");
    },
    get countriesDropdown() {
        return screen.queryByTestId("CountriesDropdown");
    },
    get countryOptions() {
        return screen.getAllByTestId("CountryDropdownOption");
    },
    get russiaCountryOption() {
        return screen.getAllByTestId("CountryDropdownOption").find((option) => {
            const countryDetails: string | null = within(option).getByTestId(
                "CountryDropdownOption.Details",
            ).textContent;

            return countryDetails?.includes("Russia");
        })!;
    },
};

describe("<PhoneInput />", () => {
    test("1. Formats inputted phone number", async () => {
        const setPhoneNumber = vitest.fn();
        const russia = countries.find((country) => country.name === "Russia")!;
        render(<PhoneInputDefault setPhoneNumber={setPhoneNumber} country={russia} />);

        await userEvent.click(phoneInput.input);
        await userEvent.paste("1234567890");

        await waitFor(() => expect(setPhoneNumber).toHaveBeenCalledWith("(123) 456-7890"));
    });

    test("2. Displays dropdown on country code button click", async () => {
        render(<PhoneInputDefault />);

        await userEvent.click(phoneInput.countryCodeButton);

        expect(phoneInput.countriesDropdown).toBeInTheDocument();
    });

    test("3. Calls setCountry on country selection", async () => {
        const setCountry = vitest.fn();
        render(<PhoneInputDefault setCountry={setCountry} />);

        await userEvent.click(phoneInput.countryCodeButton);
        await userEvent.click(phoneInput.countryOptions[2]);

        expect(setCountry).toHaveBeenCalledWith(countries[2]);
    });

    test("4. Closes dropdown on outside click", async () => {
        render(<PhoneInputDefault />);

        await userEvent.click(phoneInput.countryCodeButton);
        expect(phoneInput.countriesDropdown).toBeInTheDocument();

        await userEvent.click(document.body);
        expect(phoneInput.countriesDropdown).not.toBeInTheDocument();
    });
});
