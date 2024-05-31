import { ResultOr } from "@/utils/resultOfT.ts";
import isNullOrWhitespace from "@/utils/isNullOrWhitespace.ts";
import validatePassword from "@/utils/validatePassword.ts";
import FieldError from "@/utils/FieldError.ts";
import {EMAIL_REGEX} from "@/data/regularExpressions.ts";


export function validateSignupData(signupData: SignupData): ResultOr<FieldError> {
    let fieldError: FieldError | null = null;
    const passwordValidation = validatePassword(signupData.password);

    if (isNullOrWhitespace(signupData.username)) {
        fieldError = FieldError.create("username", "Username must not be empty");
    } else if (!signupData.email) {
        fieldError = FieldError.create("email", "Email must not be empty");
    } else if (!EMAIL_REGEX.test(signupData.email)) {
        fieldError = FieldError.create("email", "Invalid email format");
    } else if (passwordValidation.isFailure) {
        fieldError = FieldError.create("password", passwordValidation.errorMessage!);
    } else if (signupData.password !== signupData.repeatedPassword) {
        fieldError = FieldError.create("repeatedPassword", "Passwords do not match");
    }

    if (fieldError) {
        return ResultOr.Fail<FieldError>(fieldError);
    }

    return ResultOr.Ok();
}
