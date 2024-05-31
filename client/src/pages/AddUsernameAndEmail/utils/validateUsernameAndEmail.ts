import isNullOrWhitespace from "@/utils/isNullOrWhitespace.ts";
import { ResultOr } from "@/utils/resultOfT.ts";
import FieldError from "@/utils/FieldError.ts";
import { EMAIL_REGEX } from "@/data/regularExpressions.ts";

export default function validateUsernameAndEmail(
    username: string,
    email: string,
): ResultOr<FieldError> {
    let fieldError: FieldError | null = null;

    if (isNullOrWhitespace(username)) {
        fieldError = FieldError.create("username", "Username input field must not be empty");
    } else if (isNullOrWhitespace(email)) {
        fieldError = FieldError.create("email", "Email input field must not be empty");
    } else if (!EMAIL_REGEX.test(email)) {
        fieldError = FieldError.create("email", "Invalid email format");
    }

    if (fieldError) {
        return ResultOr.Fail<FieldError>(fieldError);
    }

    return ResultOr.Ok();
}
