import PasswordResetError from "@/pages/PasswordReset/types/PasswordResetError.ts";
import { ResultOr } from "@/utils/resultOfT.ts";
import validatePassword from "@/utils/validatePassword.ts";
import { Result } from "@/utils/result.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";

export default function validateDataForPasswordReset(
    password: string,
    confirmPassword: string,
): ResultOr<PasswordResetError> {
    const passwordValidation: Result = validatePassword(password);

    if (passwordValidation.isFailure) {
        const errorMessage: ErrorMessage = ErrorMessage.create(passwordValidation.errorMessage!);
        return ResultOr.Fail({ field: "password", errorMessage });
    }

    if (password !== confirmPassword) {
        const errorMessage: ErrorMessage = ErrorMessage.create("Passwords do not match.");
        return ResultOr.Fail({ field: "confirmPassword", errorMessage });
    }

    return ResultOr.Ok();
}
