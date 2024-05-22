import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vitest } from "vitest";
import CountriesDropdown from "@/pages/AddPhoneNumber/components/CountriesDropdown.tsx";
import countries from "@/pages/AddPhoneNumber/data/countries.ts";

const CountriesDropdownDefault = (props: Partial<ComponentProps<typeof CountriesDropdown>>) => (
    <CountriesDropdown isOpen={true} setIsOpen={() => {}} setCountry={() => {}} {...props} />
);

const countriesDropdown = {
    get self() {
        return screen.queryByTestId("CountriesDropdown");
    },
    get searchBar() {
        return screen.getByRole("textbox");
    },
    get countryOptions() {
        return screen.getAllByTestId("CountryDropdownOption");
    },
};

describe("<CountriesDropdown />", () => {
    test("1. Renders when isOpen is true", () => {
        render(<CountriesDropdownDefault isOpen={true} />);

        expect(countriesDropdown.searchBar).toBeInTheDocument();
        expect(countriesDropdown.countryOptions.length).toBe(countries.length);
    });

    test("2. Does not render when isOpen is false", () => {
        render(<CountriesDropdownDefault isOpen={false} />);

        expect(countriesDropdown.self).not.toBeInTheDocument();
    });

    test("3. Filters countries based on search input", async () => {
        render(<CountriesDropdownDefault />);
        expect(countriesDropdown.countryOptions).not.toHaveLength(1);

        await userEvent.type(countriesDropdown.searchBar, "United States");

        expect(countriesDropdown.countryOptions).toHaveLength(1);
    });

    test("4. Calls setCountry and setIsOpen on country selection", async () => {
        const setCountry = vitest.fn();
        const setIsOpen = vitest.fn();
        render(<CountriesDropdownDefault setCountry={setCountry} setIsOpen={setIsOpen} />);

        await userEvent.click(countriesDropdown.countryOptions[0]);

        expect(setCountry).toHaveBeenCalledWith(countries[0]);
        expect(setIsOpen).toHaveBeenCalledWith(false);
    });
});
