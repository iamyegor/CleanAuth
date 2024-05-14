import LoginError from "@/pages/Login/types/LoginError.ts";
import { useEffect, useState } from "react";
import ErrorMessage from "@/utils/ErrorMessage.ts";

export default function useLoginPageInputError(
    loginError: LoginError | null,
    problematicField: string,
) {
    const [shouldApplyErrorClass, setShouldApplyErrorClass] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);

    useEffect(() => {
        const hasLoginOrEmailError = loginError?.problematicField === problematicField;
        const hasBothError = loginError?.problematicField === "both";

        setShouldApplyErrorClass(hasLoginOrEmailError || hasBothError);
        setErrorMessage(hasLoginOrEmailError ? ErrorMessage.create(loginError.errorMessage) : null);
    }, [loginError, problematicField]);

    return { shouldApplyErrorClass, errorMessage };
}
