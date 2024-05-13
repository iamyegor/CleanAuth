import isNullOrWhitespace from "@/utils/isNullOrWhitespace.ts";
import LoginError from "@/pages/Login/types/LoginError.ts";
import { Result } from "@/utils/resultOfT.ts";
import { Result as SimpleResult } from "@/utils/result.ts";
import validatePassword from "@/utils/validatePassword.ts";

export function validateCredentials({
    loginOrEmail,
    password,
}: LoginCredentials): Result<LoginError> {
    if (isNullOrWhitespace(loginOrEmail)) {
        return Result.Fail<LoginError>({
            problematicField: "loginOrEmail",
            errorMessage: "Login or Email field must not be empty",
        });
    }

    const passwordValidation: SimpleResult = validatePassword(password);
    if (passwordValidation.isFailure) {
        return Result.Fail<LoginError>({
            problematicField: "password",
            errorMessage: passwordValidation.errorMessage!,
        });
    }

    return Result.Ok<LoginError>();
}
