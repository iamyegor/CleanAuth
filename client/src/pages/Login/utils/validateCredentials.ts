import isNullOrWhitespace from "@/utils/isNullOrWhitespace.ts";
import { ResultOr } from "@/utils/resultOfT.ts";
import { Result as SimpleResult } from "@/utils/result.ts";
import validatePassword from "@/utils/validatePassword.ts";
import FieldError from "@/utils/FieldError.ts";

export function validateCredentials({
    loginOrEmail,
    password,
}: LoginCredentials): ResultOr<FieldError> {
    let fieldError: FieldError | null = null;
    const passwordValidation: SimpleResult = validatePassword(password);

    if (isNullOrWhitespace(loginOrEmail)) {
        fieldError = FieldError.create("loginOrEmail", "Login or Email field must not be empty");
    } else if (passwordValidation.isFailure) {
        fieldError = FieldError.create("password", passwordValidation.errorMessage!);
    }

    if (fieldError) {
        return ResultOr.Fail<FieldError>(fieldError);
    }

    return ResultOr.Ok<FieldError>();
}
