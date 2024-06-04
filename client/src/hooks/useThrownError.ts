import {useEffect, useState} from "react";

export default function useThrownError() {
    const [thrownError, setThrownError] = useState<Error | null>(null);

    useEffect(() => {
        if (thrownError) {
            throw thrownError;
        }
    }, [thrownError]);

    return { setThrownError };
}
