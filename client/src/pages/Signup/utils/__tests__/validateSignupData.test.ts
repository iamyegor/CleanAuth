import { validateSignupData } from "@/pages/Signup/utils/validateSignupData";
import { ResultOr } from "@/utils/resultOfT";

// Helper function to create signup data
const createSignupData = (overrides = {}) => ({
    username: "testuser",
    email: "test@example.com",
    password: "Test@1234",
    repeatedPassword: "Test@1234",
    ...overrides,
});

describe("validateSignupData", () => {
    test("1. Returns failure if username is empty", () => {
        const signupData = createSignupData({ username: "" });

        const result = validateSignupData(signupData);

        expect(result).toEqual(
            ResultOr.Fail({
                problematicField: "username",
                errorMessage: "Username must not be empty",
            }),
        );
    });

    test("2. Returns failure if email is empty", () => {
        const signupData = createSignupData({ email: "" });

        const result = validateSignupData(signupData);

        expect(result).toEqual(
            ResultOr.Fail({
                problematicField: "email",
                errorMessage: "Email must not be empty",
            }),
        );
    });

    test("3. Returns failure if email format is invalid", () => {
        const signupData = createSignupData({ email: "invalid-email" });

        const result = validateSignupData(signupData);

        expect(result).toEqual(
            ResultOr.Fail({
                problematicField: "email",
                errorMessage: "Invalid email format",
            }),
        );
    });

    test("4. Returns failure if password validation fails", () => {
        const signupData = createSignupData({ password: "short", repeatedPassword: "short" });

        const result = validateSignupData(signupData);

        expect(result).toEqual(
            ResultOr.Fail({
                problematicField: "password",
                errorMessage: "Password length must be between 6 and 50 characters",
            }),
        );
    });

    test("5. Returns failure if passwords do not match", () => {
        const signupData = createSignupData({
            password: "Test@1234",
            repeatedPassword: "Test@5678",
        });

        const result = validateSignupData(signupData);

        expect(result).toEqual(
            ResultOr.Fail({
                problematicField: "repeatedPassword",
                errorMessage: "Passwords do not match",
            }),
        );
    });

    test("6. Returns success if all validations pass", () => {
        const signupData = createSignupData();

        const result = validateSignupData(signupData);

        expect(result).toEqual(ResultOr.Ok());
    });
});
