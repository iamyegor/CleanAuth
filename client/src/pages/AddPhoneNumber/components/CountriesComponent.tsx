import CountryDropdownOption from "@/pages/AddPhoneNumber/components/CountryDropdownOption.tsx";
import React from "react";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";

interface CountriesProps {
    countries: Country[];
    handleClick: (country: Country) => void;
}

export default function CountriesComponent({ countries, handleClick }: CountriesProps) {
    return (
        <div
            className="dropdown-scrollbar h-48 border border-gray-300 rounded-md 
                    overflow-auto bg-white"
        >
            {countries.map((country, index) => (
                <div key={index}>
                    <CountryDropdownOption
                        index={index}
                        handleClick={() => handleClick(country)}
                        country={country}
                    />
                </div>
            ))}
        </div>
    );
}
