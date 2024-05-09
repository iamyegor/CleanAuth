import { Result } from "@/utils/resultOfT.ts";
import isNullOrWhitespace from "@/utils/isNullOrWhitespace.ts";
import { PWD_REGEX } from "@/data/regularExpressions.ts";

const EMAIL_REGEX = new RegExp("^[^@]+@[^@]+.[^@]+$");

export function validateSignupData(signupData: SignupData): Result<SignupError> {
    if (isNullOrWhitespace(signupData.username)) {
        return Result.Fail<SignupError>({
            problematicField: "username",
            errorMessage: "Username must not be empty",
        });
    }

    if (!signupData.email) {
        return Result.Fail<SignupError>({
            problematicField: "email",
            errorMessage: "Email must not be empty",
        });
    }

    if (!EMAIL_REGEX.test(signupData.email)) {
        return Result.Fail<SignupError>({
            problematicField: "email",
            errorMessage: "Invalid email format",
        });
    }

    if (signupData.password.length < 6 || signupData.password.length > 50) {
        return Result.Fail<SignupError>({
            problematicField: "password",
            errorMessage: "Password length must be between 6 and 50 characters",
        });
    }

    if (!PWD_REGEX.test(signupData.password)) {
        return Result.Fail<SignupError>({
            problematicField: "password",
            errorMessage:
                "Password must contain at least one upper case, one lower case, and either one number or a special character",
        });
    }

    if (signupData.password !== signupData.repeatedPassword) {
        return Result.Fail<SignupError>({
            problematicField: "repeatedPassword",
            errorMessage: "Passwords do not match",
        });
    }

    return Result.Ok<SignupError>();
}
