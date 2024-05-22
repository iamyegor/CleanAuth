import { ResultOf } from "@/utils/resultOfT";
import LoginError from "@/pages/Login/types/LoginError";
import { validateCredentials } from "@/pages/Login/utils/validateCredentials.ts";

describe("validateCredentials", () => {
    test("1. Returns correct failed result for empty login or email", () => {
        const loginOrEmail = "";
        const password = "ValidPassword1!";

        const result = validateCredentials({ loginOrEmail, password });

        expect(result).toEqual(
            ResultOf.Fail<LoginError>({
                problematicField: "loginOrEmail",
                errorMessage: "Login or Email field must not be empty",
            }),
        );
    });

    test("2. Returns correct failed result for invalid password", () => {
        const loginOrEmail = "validemail@example.com";
        const password = "short";

        const result = validateCredentials({ loginOrEmail, password });

        expect(result).toEqual(
            ResultOf.Fail<LoginError>({
                problematicField: "password",
                errorMessage: "Password length must be between 6 and 50 characters",
            }),
        );
    });

    test("3. Returns success for valid credentials", () => {
        const loginOrEmail = "validemail@example.com";
        const password = "ValidPassword1!";

        const result = validateCredentials({ loginOrEmail, password });

        expect(result).toEqual(ResultOf.Ok());
    });
});
