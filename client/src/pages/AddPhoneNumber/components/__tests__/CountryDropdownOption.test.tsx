import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vitest } from "vitest";
import CountryDropdownOption from "@/pages/AddPhoneNumber/components/CountryDropdownOption.tsx";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import countries from "@/pages/AddPhoneNumber/data/countries.ts";

const CountryDropdownOptionDefault = (
    props: Partial<ComponentProps<typeof CountryDropdownOption>>,
) => (
    <CountryDropdownOption
        handleClick={() => {}}
        country={countries[0]}
        isLast={false}
        {...props}
    />
);

const countryDropdownOption = {
    get self() {
        return screen.getByTestId("CountryDropdownOption");
    },
    get flag() {
        return screen.getByTestId("CountryDropdownOption.Flag");
    },
    get countryDetails() {
        return screen.getByTestId("CountryDropdownOption.Details");
    },
    get Line() {
        return screen.queryByTestId("CountryDropdownOption.Line");
    },
};

describe("<CountryDropdownOption />", () => {
    test("1. Renders country flag and details", () => {
        const country: Country = countries[0];
        render(<CountryDropdownOptionDefault country={country} />);

        expect(countryDropdownOption.flag).toHaveTextContent(country.flag);
        expect(countryDropdownOption.countryDetails).toHaveTextContent(
            `${country.name} (${country.dialCode})`,
        );
    });

    test("2. Handles click event", async () => {
        const handleClick = vitest.fn();
        render(<CountryDropdownOptionDefault handleClick={handleClick} />);

        await userEvent.click(countryDropdownOption.self);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("3. Displays horizontal line if the country isn't the last one", () => {
        render(<CountryDropdownOptionDefault isLast={false} />);

        expect(countryDropdownOption.Line).toBeInTheDocument();
    });

    test("4. Does not display <hr> for the last country", () => {
        render(<CountryDropdownOptionDefault isLast={true} />);

        expect(countryDropdownOption.Line).not.toBeInTheDocument();
    });
});
