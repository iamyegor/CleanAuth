import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import SubmittingButton from "@/components/ui/SubmittingButton.tsx";
import VerificationCodeInput from "@/components/VerifyCodeForm/components/VerificationCodeInput.tsx";
import React, { useEffect, useRef, useState } from "react";
import api from "@/lib/api.ts";
import getServerErrorMessageOrThrow from "@/utils/getServerErrorMessageOrThrow.ts";
import validateCode from "@/components/VerifyCodeForm/utils/validateCode.ts";
import { Result } from "@/utils/result.ts";
import CountdownDisplay from "@/components/VerifyCodeForm/components/CountdownDisplay.tsx";
import getCodeFromForm from "@/components/VerifyCodeForm/utils/getCodeFromForm.ts";
import BackToPrevPageButton from "@/components/VerifyCodeForm/components/BackToSignupButton.tsx";
import ResendCodeButton from "@/components/VerifyCodeForm/components/ResendCodeButton.tsx";
import useSecondsLeft from "@/components/VerifyCodeForm/hooks/useSecondsLeft.tsx";
import DisplayedMessage from "@/components/VerifyCodeForm/utils/DisplayedMessage.ts";

interface VerifyCodeFormProps {
    contactDetail: string;
    contactValue: string;
    codeLength: number;
    onSubmitActionRoute: string;
    goBackRoute: string;
    goBackButtonText: string;
    resendCodeEndpoint: string;
}

export async function baseAction(
    request: any,
    maxCodeLength: number,
    verificationEndpoint: string,
    redirectRoute: string,
): Promise<DisplayedMessage | Response> {
    const code: string = await getCodeFromForm(request, maxCodeLength);

    const validationResult: Result = validateCode(code, maxCodeLength);
    if (validationResult.isFailure) {
        return DisplayedMessage.createError(validationResult.errorMessage!);
    }

    try {
        await api.post(verificationEndpoint, { code });
        return redirect(redirectRoute);
    } catch (err) {
        return DisplayedMessage.createError(getServerErrorMessageOrThrow(err));
    }
}

export default function VerifyCodeForm({
    contactDetail,
    contactValue,
    codeLength,
    onSubmitActionRoute,
    goBackRoute,
    goBackButtonText,
    resendCodeEndpoint,
}: VerifyCodeFormProps) {
    const maxSeconds = useRef<number>(0);
    const actionError = useActionData() as DisplayedMessage;
    const { state } = useNavigation();
    const [inputs, setInputs] = useState<string[]>(Array(codeLength).fill(""));
    const { secondsLeft, setSecondsLeft } = useSecondsLeft(maxSeconds.current);
    const [message, setMessage] = useState<DisplayedMessage | null>(null);

    useEffect(() => {
        if (!actionError) {
            return;
        }

        if (message === null || actionError.generatedAt > message.generatedAt) {
            setMessage(actionError);
        }
    }, [actionError?.generatedAt]);

    return (
        <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
            <h2 className="mb-3 text-4xl font-bold text-gray-900">Verify Your {contactDetail}</h2>
            <p className="mb-8 text-lg text-gray-600">
                Please enter the verification code sent to <u>{contactValue}</u>
            </p>
            <Form method="post" action={onSubmitActionRoute}>
                <VerificationCodeInput inputs={inputs} setInputs={setInputs} message={message} />
                <SubmittingButton
                    loading={state == "loading"}
                    text="Verify Code"
                    additionalClasses="mb-6"
                    additionalEnabledClasses="bg-blue-500 hover:bg-blue-600"
                />
                <div className="flex justify-center space-x-2 mb-8">
                    <BackToPrevPageButton route={goBackRoute} text={goBackButtonText} />
                    <ResendCodeButton
                        resendCodeEndpoint={resendCodeEndpoint}
                        setMessage={setMessage}
                        setSecondsLeft={setSecondsLeft}
                        secondsLeft={secondsLeft}
                        maxSeconds={maxSeconds.current}
                    />
                </div>
                <CountdownDisplay secondsLeft={secondsLeft} />
            </Form>
        </div>
    );
}
