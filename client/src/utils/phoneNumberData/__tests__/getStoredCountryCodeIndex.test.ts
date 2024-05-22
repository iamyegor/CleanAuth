import {test, describe, beforeEach} from "vitest";
import getStoredCountryCodeIndex from "@/utils/phoneNumberData/getStoredCountryCodeIndex.ts";

describe("getStoredCountryCodeIndex", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });
    
    test("1. Returns null if no country code index is stored", () => {
        sessionStorage.clear();

        const result = getStoredCountryCodeIndex();

        expect(result).toBeNull();
    });

    test("2. Returns parsed country code index if stored", () => {
        const countryCodeIndex = 5;
        sessionStorage.setItem("countryCodeIndex", countryCodeIndex.toString());

        const result = getStoredCountryCodeIndex();

        expect(result).toBe(countryCodeIndex);
    });
});
