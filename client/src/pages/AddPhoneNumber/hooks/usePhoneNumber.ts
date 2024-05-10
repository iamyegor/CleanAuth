import { useEffect, useState } from "react";
import getStoredPhoneNumber from "@/utils/phoneNumberData/getStoredPhoneNumber.ts";
import getStoredCountryCodeIndex from "@/utils/phoneNumberData/getStoredCountryCodeIndex.ts";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import countries from "@/pages/AddPhoneNumber/utils/countries.ts";

export default function usePhoneNumber() {
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const storedPhoneNumber = getStoredPhoneNumber();

        if (storedPhoneNumber) {
            setPhoneNumber(storedPhoneNumber);
        }
    }, []);

    return { phoneNumber, setPhoneNumber };
}

