import React, { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vitest } from "vitest";
import CountriesSearchBar from "@/pages/AddPhoneNumber/components/CountriesSearchBar.tsx";

const CountriesSearchBarDefault = (props: Partial<ComponentProps<typeof CountriesSearchBar>>) => (
    <CountriesSearchBar search="" setSearch={() => {}} {...props} />
);

const countriesSearchBar = {
    get input() {
        return screen.getByTestId("CountriesSearchBar.Input");
    },
};

describe("<CountriesSearchBar />", () => {
    test("1. Displays initial search value", () => {
        const searchValue = "Test";
        render(<CountriesSearchBarDefault search={searchValue} />);

        expect(countriesSearchBar.input).toHaveValue(searchValue);
    });

    test("2. Calls setSearch on input change", async () => {
        const setSearch = vitest.fn();
        render(<CountriesSearchBarDefault setSearch={setSearch} />);

        await userEvent.type(countriesSearchBar.input, "a");
        expect(setSearch).toHaveBeenCalledWith("a");

        await userEvent.type(countriesSearchBar.input, "b");
        expect(setSearch).toHaveBeenCalledWith("b");
    });
});
