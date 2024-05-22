import React, { ComponentProps } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vitest } from "vitest";
import CountriesComponent from "@/pages/AddPhoneNumber/components/CountriesComponent.tsx";
import countries from "@/pages/AddPhoneNumber/data/countries.ts";

const CountriesComponentDefault = (props: Partial<ComponentProps<typeof CountriesComponent>>) => (
    <CountriesComponent countries={[]} handleClick={() => {}} {...props} />
);

const countriesComponent = {
    get countryOptions() {
        return screen.getAllByTestId("CountryDropdownOption");
    },
};

describe("<CountriesComponent />", () => {
    test("1. Renders multiple country options", () => {
        render(<CountriesComponentDefault countries={countries} />);

        expect(countriesComponent.countryOptions.length).toBe(countries.length);
    });

    test("2. Calls handleClick when a country option is clicked", async () => {
        const handleClick = vitest.fn();
        render(<CountriesComponentDefault countries={countries} handleClick={handleClick} />);

        await userEvent.click(countriesComponent.countryOptions[0]);

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith(countries[0]);
    });

    test("3. Displays horizontal line for all countries except the last one", () => {
        render(<CountriesComponentDefault countries={countries} />);

        const lines = screen.queryAllByTestId("CountryDropdownOption.Line");
        expect(lines.length).toBe(countries.length - 1);
    });

    test("4. Does not display horizontal line for the last country", () => {
        render(<CountriesComponentDefault countries={countries} />);

        const lastCountryOption = countriesComponent.countryOptions[countries.length - 1];
        const line = within(lastCountryOption).queryByTestId("CountryDropdownOption.Line");

        expect(line).not.toBeInTheDocument();
    });
});
