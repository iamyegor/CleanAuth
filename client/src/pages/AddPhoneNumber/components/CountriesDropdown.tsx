import CountriesSearchBar from "@/pages/AddPhoneNumber/components/CountriesSearchBar.tsx";
import CountriesComponent from "@/pages/AddPhoneNumber/components/CountriesComponent.tsx";
import React, { useState } from "react";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import useSearchCountries from "@/pages/AddPhoneNumber/hooks/useSearchCountries.ts";
import countries from "@/pages/AddPhoneNumber/data/countries.ts";

interface CountriesDropdownProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setCountry: (country: Country) => void;
}

const CountriesDropdown = ({ isOpen, setIsOpen, setCountry }: CountriesDropdownProps) => {
    const [search, setSearch] = useState("");
    const [displayedCountries, setDisplayedCountries] = useState(countries);

    useSearchCountries(search, setDisplayedCountries);

    const handleSelect = (country: Country) => {
        setCountry(country);
        setIsOpen(false);
    };

    return (
        isOpen && (
            <div
                className="absolute top-full mt-1 z-50 space-y-0.5"
                data-testid="CountriesDropdown"
            >
                <CountriesSearchBar search={search} setSearch={setSearch} />
                <CountriesComponent countries={displayedCountries} handleClick={handleSelect} />
            </div>
        )
    );
};

export default CountriesDropdown;
