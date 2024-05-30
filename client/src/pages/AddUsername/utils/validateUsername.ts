import isNullOrWhitespace from "@/utils/isNullOrWhitespace.ts";
import { Result } from "@/utils/result.ts";

export default function validateUsername(username: string): Result {
    if (isNullOrWhitespace(username)) {
        return Result.Fail("Username input field must not be empty");
    }

    return Result.Ok();
}
