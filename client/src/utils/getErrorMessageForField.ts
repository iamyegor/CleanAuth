import ErrorMessage from "@/utils/ErrorMessage.ts";

export default function getErrorMessageForField(
    problematicField: string,
    fieldAndMessageError: { problematicField: string; errorMessage: string } | null,
): ErrorMessage | null {
    return fieldAndMessageError?.problematicField == problematicField
        ? ErrorMessage.create(fieldAndMessageError.errorMessage)
        : null;
}
