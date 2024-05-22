import { test, describe, beforeEach } from "vitest";
import storeResendTimer from "@/utils/secondsToResendCode/storeResendTimer.ts";

describe("storeResendTimer", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test("1. Stores resend timer in sessionStorage", () => {
        const seconds = 30;

        storeResendTimer(seconds);

        const storedData = sessionStorage.getItem("secondsToResendCode");
        expect(storedData).toEqual(seconds.toString());
    });

    test("2. Overwrites existing resend timer in sessionStorage", () => {
        const initialSeconds = 15;
        const newSeconds = 45;

        sessionStorage.setItem("secondsToResendCode", initialSeconds.toString());

        storeResendTimer(newSeconds);

        const storedData = sessionStorage.getItem("secondsToResendCode");
        expect(storedData).toEqual(newSeconds.toString());
    });
});
