import { ResultOr } from "@/utils/resultOfT.ts";
import validatePassword from "@/utils/validatePassword.ts";
import { Result } from "@/utils/result.ts";
import FieldError from "@/utils/FieldError.ts";

export default function validateDataForPasswordReset(
    password: string,
    confirmPassword: string,
): ResultOr<FieldError> {
    let fieldError: FieldError | null = null;
    const passwordValidation: Result = validatePassword(password);

    if (passwordValidation.isFailure) {
        fieldError = FieldError.create("password", passwordValidation.errorMessage!);
    } else if (password !== confirmPassword) {
        fieldError = FieldError.create("confirmPassword", "Passwords do not match.");
    }

    if (fieldError) {
        return ResultOr.Fail(fieldError);
    }

    return ResultOr.Ok();
}
