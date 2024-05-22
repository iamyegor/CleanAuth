import { describe, test, expect } from "vitest";
import getQueryParam from "@/utils/getQueryParam.ts";

describe("getQueryParam", () => {
    test("1. Returns the value of the specified query parameter", () => {
        const url = "https://example.com/page?param1=value1&param2=value2";

        const result = getQueryParam(url, "param1");

        expect(result).toBe("value1");
    });

    test("2. Returns null if the specified query parameter is not present", () => {
        const url = "https://example.com/page?param1=value1&param2=value2";

        const result = getQueryParam(url, "param3");

        expect(result).toBeNull();
    });
});
