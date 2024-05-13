import countries from "@/pages/AddPhoneNumber/data/countries.ts";
import React from "react";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import CountryCodes from "@/pages/AddPhoneNumber/data/countries.ts";

interface CountryDropdownOptionsProps {
    handleClick: () => void;
    country: Country;
}

export default function CountryDropdownOption({
    handleClick,
    country,
}: CountryDropdownOptionsProps) {
    return (
        <>
            <div className="p-1 flex items-center cursor-pointer bg-white" onClick={handleClick}>
                <div className="hover:bg-gray-100 w-full flex justify-start px-3 py-1 rounded">
                    <span className="mr-2">{country.flag}</span>
                    <span>{`${country.name} (${country.dialCode})`}</span>
                </div>
            </div>
            {countries[CountryCodes.length - 1] != country && <hr />}
        </>
    );
}
