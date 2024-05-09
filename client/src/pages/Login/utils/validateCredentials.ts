import isNullOrWhitespace from "@/utils/isNullOrWhitespace.ts";
import { PWD_REGEX } from "@/data/regularExpressions.ts";
import LoginError from "@/pages/Login/types/LoginError.ts";
import { Result } from "@/utils/resultOfT.ts";

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

    if (password.length < 6 || password.length > 50) {
        return Result.Fail<LoginError>({
            problematicField: "password",
            errorMessage: "Password length must be between 6 and 50 characters",
        });
    }

    if (!PWD_REGEX.test(password)) {
        return Result.Fail<LoginError>({
            problematicField: "password",
            errorMessage:
                "Password must contain at least one upper case, one lower case letter and either one number or a special character",
        });
    }

    return Result.Ok<LoginError>();
}
