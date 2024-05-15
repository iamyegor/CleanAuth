import PasswordResetError from "@/pages/PasswordReset/types/PasswordResetError.ts";
import { ResultOf } from "@/utils/resultOfT.ts";
import validatePassword from "@/utils/validatePassword.ts";
import { Result } from "@/utils/result.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";

export default function validateDataForPasswordReset(
    password: string,
    confirmPassword: string,
): ResultOf<PasswordResetError> {
    const passwordValidation: Result = validatePassword(password);

    if (passwordValidation.isFailure) {
        const errorMessage: ErrorMessage = ErrorMessage.create(passwordValidation.errorMessage!);
        return ResultOf.Fail({ field: "password", errorMessage });
    }

    if (password !== confirmPassword) {
        const errorMessage: ErrorMessage = ErrorMessage.create("Passwords do not match.");
        return ResultOf.Fail({ field: "confirmPassword", errorMessage });
    }

    return ResultOf.Ok();
}
