import { Result } from "@/utils/resultOfT.ts";
import { Result as SimpleResult } from "@/utils/result.ts";
import isNullOrWhitespace from "@/utils/isNullOrWhitespace.ts";
import validatePassword from "@/utils/validatePassword.ts";

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

    const passwordValidation: SimpleResult = validatePassword(signupData.password);
    if (passwordValidation.isFailure) {
        return Result.Fail<SignupError>({
            problematicField: "password",
            errorMessage: passwordValidation.errorMessage!,
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
