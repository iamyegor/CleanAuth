import { test, describe, beforeEach } from "vitest";
import getStoredPhoneNumber from "@/utils/phoneNumberData/getStoredPhoneNumber.ts";

describe("getStoredPhoneNumber", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test("1. Returns null if no phone number is stored", () => {
        const result = getStoredPhoneNumber();

        expect(result).toBeNull();
    });

    test("2. Returns stored phone number if present", () => {
        const phoneNumber = "1234567890";
        sessionStorage.setItem("phoneNumber", phoneNumber);

        const result = getStoredPhoneNumber();

        expect(result).toBe(phoneNumber);
    });
});
