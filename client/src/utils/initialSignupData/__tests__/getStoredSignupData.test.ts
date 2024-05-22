import { describe, test } from "vitest";
import getStoredSignupData from "@/utils/initialSignupData/getStoredSignupData.ts";

describe("getStoredSignupData", () => {
    test("1. Returns null if no signup data is stored", () => {
        sessionStorage.clear();

        const result = getStoredSignupData();

        expect(result).toBeNull();
    });

    test("2. Returns parsed signup data if stored", () => {
        const signupData = {
            username: "testuser",
            email: "test@example.com",
            password: "testPassword",
            repeatedPassword: "testPassword",
        };
        sessionStorage.setItem("signupData", JSON.stringify(signupData));

        const result = getStoredSignupData();

        expect(result).toEqual(signupData);
    });
});
