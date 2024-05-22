import { useEffect, useState } from "react";
import getStoredPhoneNumber from "@/utils/phoneNumberData/getStoredPhoneNumber.ts";

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

