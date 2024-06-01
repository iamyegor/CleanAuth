import ErrorMessage from "@/utils/ErrorMessage.ts";
import FieldError from "@/utils/FieldError.ts";

export default function getFieldErrorMessage(
    problematicField: string,
    fieldError: FieldError | null,
): ErrorMessage | null {
    return fieldError?.isField(problematicField)
        ? ErrorMessage.create(fieldError.errorMessage)
        : null;
}
