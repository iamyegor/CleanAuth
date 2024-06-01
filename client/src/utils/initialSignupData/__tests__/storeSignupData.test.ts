import { beforeEach, describe, test } from "vitest";
import storeSignupData from "@/utils/initialSignupData/storeSignupData.ts";

describe("storeSignupData", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test("1. Stores signup data in sessionStorage", () => {
        const signupData = {
            username: "testuser",
            email: "test@example.com",
            password: "testPassword",
            confirmPassword: "testPassword",
        };

        storeSignupData(signupData);

        const storedData = sessionStorage.getItem("signupData");
        expect(storedData).toEqual(JSON.stringify(signupData));
    });

    test("2. Overwrites existing signup data in sessionStorage", () => {
        const initialSignupData = {
            username: "initialUser",
            email: "initial@example.com",
            password: "initialPassword",
            confirmPassword: "initialPassword",
        };

        const newSignupData = {
            username: "newUser",
            email: "new@example.com",
            password: "newPassword",
            confirmPassword: "newPassword",
        };

        sessionStorage.setItem("signupData", JSON.stringify(initialSignupData));

        storeSignupData(newSignupData);

        const storedData = sessionStorage.getItem("signupData");
        expect(storedData).toEqual(JSON.stringify(newSignupData));
    });
});
