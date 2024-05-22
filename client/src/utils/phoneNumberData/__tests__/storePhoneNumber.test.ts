import { test, describe, beforeEach } from "vitest";
import storePhoneNumber from "@/utils/phoneNumberData/storePhoneNumber.ts";

describe("storePhoneNumber", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test("1. Stores phone number in sessionStorage", () => {
        const phoneNumber = "1234567890";

        storePhoneNumber(phoneNumber);

        const storedData = sessionStorage.getItem("phoneNumber");
        expect(storedData).toEqual(phoneNumber);
    });

    test("2. Overwrites existing phone number in sessionStorage", () => {
        const initialPhoneNumber = "0987654321";
        const newPhoneNumber = "1234567890";

        sessionStorage.setItem("phoneNumber", initialPhoneNumber);

        storePhoneNumber(newPhoneNumber);

        const storedData = sessionStorage.getItem("phoneNumber");
        expect(storedData).toEqual(newPhoneNumber);
    });
});
