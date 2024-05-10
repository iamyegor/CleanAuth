import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import storeSecondsToResendCode from "@/utils/secondsToResendCode/storeSecondsToResendCode.ts";
import getSecondsToResendCode from "@/utils/secondsToResendCode/getSecondsToResendCode.ts";
import clearSecondsToResendCode from "@/utils/secondsToResendCode/clearSecondsToResendCode.ts";

export default function useSecondsLeft(initialTime: number) {
    const [secondsLeft, setSecondsLeft] = useState<number>(() => {
        const savedTime = getSecondsToResendCode();
        return savedTime ? savedTime : initialTime;
    });

    const location = useLocation();

    useEffect(() => {
        storeSecondsToResendCode(secondsLeft);
    }, [secondsLeft]);

    useEffect(() => {
        return () => {
            clearSecondsToResendCode();
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
