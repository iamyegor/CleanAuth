import classNames from "classnames";
import api from "@/lib/api.ts";
import React, { useState } from "react";
import sendImage from "@/components/VerifyCodeForm/images/send.png";
import disabledSendImage from "@/components/VerifyCodeForm/images/send_disabled.png";
import Spinner from "@/components/ui/Spinner.tsx";
import FeedbackMessage from "@/utils/FeedbackMessage.ts";
import Image from "@/components/ui/Image.tsx";
import { RouteError } from "@/types/RouteError.ts";

interface ResendCodeButtonProps {
    setSecondsLeft: (seconds: number) => void;
    secondsLeft: number;
    maxSeconds: number;
    setMessage: (value: FeedbackMessage) => void;
    resendCodeEndpoint: string;
}

export default function ResendCodeButton({
    setSecondsLeft,
    secondsLeft,
    maxSeconds,
    setMessage,
    resendCodeEndpoint,
}: ResendCodeButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function resendCode() {
        setIsLoading(true);

        try {
            await api.post(resendCodeEndpoint);
            setMessage(FeedbackMessage.createSuccess("Verification code sent successfully!"));
            setSecondsLeft(maxSeconds);
        } catch (err) {
            throw RouteError.unexpected();
        }

        setIsLoading(false);
    }

    const resendCodeButtonClasses = classNames(
        isLoading
            ? "verification-code-auxiliary-button--loading"
            : "verification-code-auxiliary-button",
    );

    function isDisabled() {
        return secondsLeft > 0;
    }

    return (
        <button
            type="button"
            className={resendCodeButtonClasses}
            disabled={isDisabled()}
            onClick={() => resendCode()}
            data-testid="ResendCodeButton"
        >
            {isLoading ? (
                <Spinner size={20} />
            ) : (
                <>
                    <Image
                        src={isDisabled() ? disabledSendImage : sendImage}
                        alt="return"
                        className="w-5 mt-2 mr-1"
                    />
                    <span>Resend code</span>
                </>
            )}
        </button>
    );
}
