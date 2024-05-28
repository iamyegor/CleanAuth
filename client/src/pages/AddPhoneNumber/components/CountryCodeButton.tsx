import React, { useRef } from "react";
import downArrowImage from "@/pages/AddPhoneNumber/images/down-arrow.png";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import Image from "@/components/ui/Image.tsx";

interface CountriesDropdown {
    country: Country;
    setIsOpen: (newValue: (prev: boolean) => boolean) => void;
}

export default function CountryCodeButton({ country, setIsOpen }: CountriesDropdown) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={wrapperRef} className="relative select-none">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                data-testid="CountryCodeButton.Button"
                className="flex items-center justify-center bg-neutral-100
                rounded-md h-10 cursor-pointer mx-1.5 px-4 space-x-2"
                type="button"
            >
                <span className="flex items-center space-x-1">
                    <span data-testid="CountryCodeButton.Flag">{country.flag}</span>
                    <span data-testid="CountryCodeButton.DialCode">{country.dialCode}</span>
                </span>
                <Image src={downArrowImage} alt="Expand" className="w-4 h-4" />
            </button>
        </div>
    );
}
