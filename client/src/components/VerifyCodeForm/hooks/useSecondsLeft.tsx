import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import storeResendTimer from "@/utils/secondsToResendCode/storeResendTimer.ts";
import getStoredResendTimer from "@/utils/secondsToResendCode/getStoredResendTimer.ts";
import clearStoredResendTimer from "@/utils/secondsToResendCode/clearStoredResendTimer.ts";

export default function useSecondsLeft(initialTime: number) {
    const [secondsLeft, setSecondsLeft] = useState<number>(() => {
        const savedTime = getStoredResendTimer();
        return savedTime == null ? initialTime : savedTime;
    });

    const location = useLocation();

    useEffect(() => {
        storeResendTimer(secondsLeft);
    }, [secondsLeft]);

    useEffect(() => {
        return () => {
            clearStoredResendTimer();
        };
    }, [location]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSecondsLeft((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [secondsLeft]);

    return { secondsLeft, setSecondsLeft };
}
