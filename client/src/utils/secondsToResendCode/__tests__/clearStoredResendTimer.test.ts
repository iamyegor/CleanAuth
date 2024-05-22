import { beforeEach, describe, test } from "vitest";
import clearStoredResendTimer from "@/utils/secondsToResendCode/clearStoredResendTimer.ts";

describe("clearStoredResendTimer", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test("1. Removes 'secondsToResendCode' from sessionStorage", () => {
        sessionStorage.setItem("secondsToResendCode", "30");

        clearStoredResendTimer();

        const storedData = sessionStorage.getItem("secondsToResendCode");
        expect(storedData).toBeNull();
    });
});
