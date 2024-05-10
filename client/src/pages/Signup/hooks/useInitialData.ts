import { useEffect, useState } from "react";

export default function useInitialData() {
    const [initialData, setInitialData] = useState<SignupData | null>(null);

    useEffect(() => {
        const signupDataString = sessionStorage.getItem("signupData");
        if (signupDataString) {
            setInitialData(JSON.parse(signupDataString));
        }
    }, []);

    return initialData;
}
