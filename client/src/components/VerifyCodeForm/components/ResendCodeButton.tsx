import classNames from "classnames";
import api from "@/lib/api.ts";
import getServerErrorMessageOrThrow from "@/utils/getServerErrorMessageOrThrow.ts";
import React, { useState } from "react";
import { SpinnerCircularFixed } from "spinners-react";
import sendImage from "@/components/VerifyCodeForm/images/send.png";
import DisplayedMessage from "@/components/VerifyCodeForm/types/DisplayedMessage.ts";

interface ResendCodeButtonProps {
    setSecondsLeft: (seconds: number) => void;
    secondsLeft: number;
    maxSeconds: number;
    setMessage: (value: DisplayedMessage) => void;
}

export default function ResendCodeButton({
    setSecondsLeft,
    secondsLeft,
    maxSeconds,
    setMessage,
}: ResendCodeButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    async function resendCode() {
        setIsLoading(true);

        try {
            await api.post("api/resend-email-code");
            setMessage({ isSuccess: true, message: "Verification code sent successfully!" });
            setSecondsLeft(maxSeconds);
        } catch (err) {
            const error = getServerErrorMessageOrThrow(err);
            setMessage({ isSuccess: false, message: error });
        }
        
        setIsLoading(false);
    }

    const resendCodeButtonClasses = classNames(
        isLoading
            ? "verification-code-auxiliary-button--loading"
            : "verification-code-auxiliary-button",
    );

    return (
        <button
            type="button"
            className={resendCodeButtonClasses}
            disabled={secondsLeft > 0}
            onClick={() => resendCode()}
        >
            {isLoading ? (
                <SpinnerCircularFixed
                    size={30}
                    thickness={200}
                    speed={100}
                    color="rgba(194, 194, 194, 1)"
                    secondaryColor="rgba(173, 173, 173, 0.3)"
                />
            ) : (
                <>
                    <img src={sendImage} alt="return" className="w-5 mt-2 mr-1" />
                    <span>Resend code</span>
                </>
            )}
        </button>
    );
}
