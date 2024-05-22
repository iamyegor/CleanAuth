import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import VerificationCodeInput from "@/components/VerifyCodeForm/components/VerificationCodeInput.tsx";
import React, { useEffect, useState } from "react";
import api from "@/lib/api.ts";
import validateCode from "@/components/VerifyCodeForm/utils/validateCode.ts";
import { Result } from "@/utils/result.ts";
import CountdownDisplay from "@/components/VerifyCodeForm/components/CountdownDisplay.tsx";
import getCodeFromForm from "@/components/VerifyCodeForm/utils/getCodeFromForm.ts";
import BackToPrevPageButton from "@/components/VerifyCodeForm/components/GoBackButton.tsx";
import ResendCodeButton from "@/components/VerifyCodeForm/components/ResendCodeButton.tsx";
import useSecondsLeft from "@/components/VerifyCodeForm/hooks/useSecondsLeft.tsx";
import FeedbackMessage from "@/utils/FeedbackMessage.ts";

interface VerifyCodeFormProps {
    contactDetail: string;
    contactValue: string;
    codeLength: number;
    onSubmitActionRoute: string;
    goBackRoute: string;
    goBackButtonText: string;
    resendCodeEndpoint: string;
    maxSeconds: number;
}

export async function baseAction(
    request: any,
    maxCodeLength: number,
    verificationEndpoint: string,
    redirectRoute: string,
    errorExtractor: (err: any) => string,
): Promise<FeedbackMessage | Response> {
    const code: string = await getCodeFromForm(request, maxCodeLength);

    const validationResult: Result = validateCode(code, maxCodeLength);
    if (validationResult.isFailure) {
        return FeedbackMessage.createError(validationResult.errorMessage!);
    }

    try {
        await api.post(verificationEndpoint, { code });
        return redirect(redirectRoute);
    } catch (err) {
        const errorMessage: string = errorExtractor(err);
        return FeedbackMessage.createError(errorMessage);
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
    maxSeconds,
}: VerifyCodeFormProps) {
    const actionError = useActionData() as FeedbackMessage;
    const { state } = useNavigation();
    const [inputs, setInputs] = useState<string[]>(Array(codeLength).fill(""));
    const { secondsLeft, setSecondsLeft } = useSecondsLeft(maxSeconds);
    const [message, setMessage] = useState<FeedbackMessage | null>(null);

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
            <h2
                className="mb-3 text-4xl font-bold text-gray-900"
                data-testid="VerifyCodeForm.ContactDetailHeading"
            >
                Verify Your {contactDetail}
            </h2>
            <p
                className="mb-8 text-lg text-gray-600"
                data-testid="VerifyCodeForm.ContactDetailMessage"
            >
                Please enter the verification code sent to <u>{contactValue}</u>
            </p>
            <Form
                method="post"
                action={onSubmitActionRoute}
                className="space-y-8"
                data-testid="VerifyCodeForm.Form"
            >
                <div className={message ? "space-y-6" : "space-y-8"}>
                    <VerificationCodeInput
                        inputs={inputs}
                        setInputs={setInputs}
                        message={message}
                    />
                    <SubmittingButton
                        loading={state == "submitting" || state == "loading"}
                        text="Verify Code"
                    />
                </div>
                <div className="flex justify-center space-x-2">
                    <BackToPrevPageButton route={goBackRoute} text={goBackButtonText} />
                    <ResendCodeButton
                        resendCodeEndpoint={resendCodeEndpoint}
                        setMessage={setMessage}
                        setSecondsLeft={setSecondsLeft}
                        secondsLeft={secondsLeft}
                        maxSeconds={maxSeconds}
                    />
                </div>
                <CountdownDisplay secondsLeft={secondsLeft} />
            </Form>
        </div>
    );
}
