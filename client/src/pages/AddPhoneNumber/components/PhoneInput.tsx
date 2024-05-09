import React, { useState } from "react";
import { formatPhoneNumber } from "@/pages/AddPhoneNumber/utils/formatPhoneNumber.ts";
import { getPlaceholderBasedOnMaxDigits } from "@/pages/AddPhoneNumber/utils/getPlaceholderBasedOnMaxDigits.ts";
import CountriesDropdown from "@/pages/AddPhoneNumber/components/CountriesDropdown.tsx";
import CountryCode from "@/pages/AddPhoneNumber/types/CountryCode.ts";

interface PhoneInputProps {
    country: CountryCode;
    setCountry: (value: CountryCode) => void;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
}

function PhoneInput({ country, setCountry, phoneNumber, setPhoneNumber }: PhoneInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPhoneNumber(formatPhoneNumber(country, event.target.value));
    }

    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur() {
        setIsFocused(false);
    }

    return (
        <div
            className={`flex items-center border border-gray-300 rounded-md h-14 bg-white 
            ${isFocused ? "ring-2 ring-blue-500" : ""} transition z-20`}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <CountriesDropdown country={country} setCountry={setCountry} />
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
