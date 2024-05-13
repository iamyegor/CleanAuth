import React, { useRef, useState } from "react";
import downArrowImage from "@/pages/AddPhoneNumber/images/down-arrow.png";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import CountryCodes from "@/pages/AddPhoneNumber/data/countries.ts";
import CountriesSearchBar from "@/pages/AddPhoneNumber/components/CountriesSearchBar.tsx";
import Image from "@/components/ui/Image.tsx";
import useCloseOnOutsideClick from "@/pages/AddPhoneNumber/hooks/useCloseOnOutsideClick.ts";
import useSearchCountries from "@/pages/AddPhoneNumber/hooks/useSearchCountries.ts";
import CountriesComponent from "@/pages/AddPhoneNumber/components/CountriesComponent.tsx";

interface CountriesDropdown {
    country: Country;
    setCountry: (country: Country) => void;
}

export default function CountriesDropdown({ country, setCountry }: CountriesDropdown) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [displayedCountries, setDisplayedCountries] = useState(CountryCodes);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useSearchCountries(search, setDisplayedCountries);
    useCloseOnOutsideClick(wrapperRef.current, setIsOpen);

    const handleSelect = (country: Country) => {
        setCountry(country);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative select-none">
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center justify-center bg-neutral-100
                rounded-md h-10 cursor-pointer mx-1.5 px-4 space-x-2"
            >
                <span className="flex items-center space-x-1">
                    <span>{country.flag}</span>
                    <span>{country.dialCode}</span>
                </span>
                <Image src={downArrowImage} alt="Expand" className="w-4 h-4" />
            </div>
            {isOpen && (
                <div className="absolute top-full mt-3 w-96 z-50 space-y-0.5">
                    <CountriesSearchBar search={search} setSearch={setSearch} />
                    <CountriesComponent countries={displayedCountries} handleClick={handleSelect} />
                </div>
            )}
        </div>
    );
}
