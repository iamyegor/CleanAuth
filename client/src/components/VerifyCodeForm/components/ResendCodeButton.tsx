import classNames from "classnames";
import api from "@/lib/api.ts";
import getServerErrorMessageOrThrow from "@/utils/getServerErrorMessageOrThrow.ts";
import React, { useState } from "react";
import sendImage from "@/components/VerifyCodeForm/images/send.png";
import Spinner from "@/components/ui/Spinner.tsx";
import DisplayedMessage from "@/components/VerifyCodeForm/utils/DisplayedMessage.ts";
import Image from "@/components/ui/Image.tsx";

interface ResendCodeButtonProps {
    setSecondsLeft: (seconds: number) => void;
    secondsLeft: number;
    maxSeconds: number;
    setMessage: (value: DisplayedMessage) => void;
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
            setMessage(DisplayedMessage.createSuccess("Verification code sent successfully!"));
            setSecondsLeft(maxSeconds);
        } catch (err) {
            const error = getServerErrorMessageOrThrow(err);
            setMessage(DisplayedMessage.createError(error));
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
                <Spinner size={20} />
            ) : (
                <>
                    <Image src={sendImage} alt="return" className="w-5 mt-2 mr-1" />
                    <span>Resend code</span>
                </>
            )}
        </button>
    );
}
