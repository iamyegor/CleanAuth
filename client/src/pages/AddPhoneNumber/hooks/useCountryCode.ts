import { useEffect, useState } from "react";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import countries from "@/pages/AddPhoneNumber/utils/countries.ts";
import getStoredCountryCodeIndex from "@/utils/phoneNumberData/getStoredCountryCodeIndex.ts";

export default function useCountryCode() {
    const [country, setCountry] = useState<Country>(countries[0]);

    useEffect(() => {
        const storedCountryCodeIndex = getStoredCountryCodeIndex();

        if (storedCountryCodeIndex) {
            setCountry(countries[storedCountryCodeIndex]);
        }
    }, []);

    return { country, setCountry };
}
