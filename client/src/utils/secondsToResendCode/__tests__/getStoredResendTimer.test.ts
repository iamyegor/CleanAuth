import { test, describe, beforeEach } from "vitest";
import getStoredResendTimer from "@/utils/secondsToResendCode/getStoredResendTimer.ts";

describe("getStoredResendTimer", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test("1. Returns null if 'secondsToResendCode' is not stored", () => {
        const result = getStoredResendTimer();

        expect(result).toBeNull();
    });

    test("2. Returns parsed seconds if 'secondsToResendCode' is stored", () => {
        const seconds = 30;
        sessionStorage.setItem("secondsToResendCode", seconds.toString());

        const result = getStoredResendTimer();

        expect(result).toBe(seconds);
    });
});
