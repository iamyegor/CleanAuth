import { test, describe, beforeEach } from "vitest";
import storeCountryCodeIndex from "@/utils/phoneNumberData/storeCountryCode.ts";

describe("storeCountryCodeIndex", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test("1. Stores country code index in sessionStorage", () => {
        const countryCodeIndex = 5;

        storeCountryCodeIndex(countryCodeIndex);

        const storedData = sessionStorage.getItem("countryCodeIndex");
        expect(storedData).toEqual(countryCodeIndex.toString());
    });

    test("2. Overwrites existing country code index in sessionStorage", () => {
        const initialCountryCodeIndex = 3;
        const newCountryCodeIndex = 8;

        sessionStorage.setItem("countryCodeIndex", initialCountryCodeIndex.toString());

        storeCountryCodeIndex(newCountryCodeIndex);

        const storedData = sessionStorage.getItem("countryCodeIndex");
        expect(storedData).toEqual(newCountryCodeIndex.toString());
    });
});
