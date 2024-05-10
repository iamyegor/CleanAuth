import { useEffect, useState } from "react";
import getStoredSignupData from "@/utils/initialSignupData/getStoredSignupData.ts";

export default function useInitialSignupData() {
    const [initialData, setInitialData] = useState<SignupData | null>(null);

    useEffect(() => {
        setInitialData(getStoredSignupData());
    }, []);

    return initialData;
}
