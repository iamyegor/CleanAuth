import { ResultOf } from "@/utils/resultOfT.ts";
import { Result } from "@/utils/result.ts";
import isNullOrWhitespace from "@/utils/isNullOrWhitespace.ts";
import validatePassword from "@/utils/validatePassword.ts";

const EMAIL_REGEX = new RegExp("^[^@]+@[^@]+.[^@]+$");

export function validateSignupData(signupData: SignupData): ResultOf<SignupError> {
    if (isNullOrWhitespace(signupData.username)) {
        return ResultOf.Fail<SignupError>({
            problematicField: "username",
            errorMessage: "Username must not be empty",
        });
    }

    if (!signupData.email) {
        return ResultOf.Fail<SignupError>({
            problematicField: "email",
            errorMessage: "Email must not be empty",
        });
    }

    if (!EMAIL_REGEX.test(signupData.email)) {
        return ResultOf.Fail<SignupError>({
            problematicField: "email",
            errorMessage: "Invalid email format",
        });
    }

    const passwordValidation: Result = validatePassword(signupData.password);
    if (passwordValidation.isFailure) {
        return ResultOf.Fail<SignupError>({
            problematicField: "password",
            errorMessage: passwordValidation.errorMessage!,
        });
    }

    if (signupData.password !== signupData.repeatedPassword) {
        return ResultOf.Fail<SignupError>({
            problematicField: "repeatedPassword",
            errorMessage: "Passwords do not match",
        });
    }

    return ResultOf.Ok<SignupError>();
}
