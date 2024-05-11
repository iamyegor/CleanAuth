import React, { useState, useRef, useEffect } from "react";
import downArrowImage from "@/pages/AddPhoneNumber/images/down-arrow.png";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import countries from "@/pages/AddPhoneNumber/utils/countries.ts";
import CountryDropdownOption from "@/pages/AddPhoneNumber/components/CountryDropdownOption.tsx";
import CountriesSearchBar from "@/pages/AddPhoneNumber/components/CountriesSearchBar.tsx";
import CountryCodes from "@/pages/AddPhoneNumber/utils/countries.ts";
import Image from "@/components/ui/Image.tsx";

interface CountriesDropdown {
    country: Country;
    setCountry: (country: Country) => void;
}

function CountriesDropdown({ country, setCountry }: CountriesDropdown) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [displayedCountries, setDisplayedCountries] = useState(CountryCodes);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDisplayedCountries(
            countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
        );
    }, [search]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

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
                    <div
                        className="dropdown-scrollbar h-48 border border-gray-300 rounded-md 
                    overflow-auto bg-white"
                    >
                        {displayedCountries.map((country, index) => (
                            <div key={index}>
                                <CountryDropdownOption
                                    index={index}
                                    handleClick={() => handleSelect(country)}
                                    country={country}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CountriesDropdown;
