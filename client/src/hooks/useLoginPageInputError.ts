import { useEffect, useState } from "react";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import FieldError from "@/utils/FieldError.ts";

export default function useLoginPageInputError(
    loginError: FieldError | null,
    problematicField: string,
) {
    const [shouldApplyErrorClass, setShouldApplyErrorClass] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);

    useEffect(() => {
        const hasProblematicFieldError: boolean = loginError?.isField(problematicField) ?? false;
        const hasBothError: boolean = loginError?.isField("both") ?? false;

        setShouldApplyErrorClass(hasProblematicFieldError || hasBothError);
        setErrorMessage(
            hasProblematicFieldError ? ErrorMessage.create(loginError!.errorMessage) : null,
        );
    }, [loginError, problematicField]);

    return { shouldApplyErrorClass, errorMessage };
}
