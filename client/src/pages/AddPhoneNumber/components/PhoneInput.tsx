import React, { useEffect, useRef, useState } from "react";
import { formatPhoneNumber } from "@/pages/AddPhoneNumber/utils/formatPhoneNumber.ts";
import { getPlaceholderBasedOnMaxDigits } from "@/pages/AddPhoneNumber/utils/getPlaceholderBasedOnMaxDigits.ts";
import CountryCodeButton from "@/pages/AddPhoneNumber/components/CountryCodeButton.tsx";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import CountriesDropdown from "@/pages/AddPhoneNumber/components/CountriesDropdown.tsx";
import useCloseOnOutsideClick from "@/pages/AddPhoneNumber/hooks/useCloseOnOutsideClick.ts";

interface PhoneInputProps {
    country: Country;
    setCountry: (value: Country) => void;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
}

function PhoneInput({ country, setCountry, phoneNumber, setPhoneNumber }: PhoneInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const countriesDropdownRef = useRef<HTMLDivElement>(null);

    function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPhoneNumber(formatPhoneNumber(country, event.target.value));
    }

    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur() {
        setIsFocused(false);
    }

    useEffect(() => {
        setPhoneNumber(formatPhoneNumber(country, phoneNumber));
    }, [phoneNumber, country]);

    useCloseOnOutsideClick(countriesDropdownRef.current, setIsDropdownOpen);

    return (
        <div
            className={`flex items-center border border-gray-300 rounded-md h-14 bg-white 
            ${isFocused ? "ring-2 ring-blue-500" : ""} transition z-20 relative`}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <div ref={countriesDropdownRef}>
                <CountryCodeButton country={country} setIsOpen={setIsDropdownOpen} />
                <CountriesDropdown
                    isOpen={isDropdownOpen}
                    setIsOpen={setIsDropdownOpen}
                    setCountry={setCountry}
                />
            </div>
            <input
                type="text"
                className="pl-3 text-lg border-none focus:ring-0 focus:border-none w-full h-full 
                outline-none rounded-md"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={getPlaceholderBasedOnMaxDigits(country.maxDigits)}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    );
}

export default PhoneInput;
