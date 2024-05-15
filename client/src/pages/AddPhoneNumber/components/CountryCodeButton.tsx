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
        </div>
    );
}
