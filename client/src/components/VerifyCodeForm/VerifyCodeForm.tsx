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
import BackToSignupButton from "@/components/VerifyCodeForm/components/BackToSignupButton.tsx";
import ResendCodeButton from "@/components/VerifyCodeForm/components/ResendCodeButton.tsx";
import DisplayedMessage from "@/components/VerifyCodeForm/types/DisplayedMessage.ts";
import useSecondsLeft from "@/components/VerifyCodeForm/hooks/useSecondsLeft.tsx";

interface VerifyCodeFormProps {
    contactDetail: string;
    contactValue: string;
    codeLength: number;
    onSubmitActionRoute: string;
}

export async function baseAction(
    request: any,
    maxCodeLength: number,
    verificationEndpoint: string,
    redirectRoute: string,
): Promise<string | Response> {
    const code: string = await getCodeFromForm(request, maxCodeLength);

    const validationResult: Result = validateCode(code, maxCodeLength);
    if (validationResult.isFailure) {
        return validationResult.errorMessage!;
    }

    try {
        await api.post(verificationEndpoint, { code });
        return redirect(redirectRoute);
    } catch (err) {
        return getServerErrorMessageOrThrow(err);
    }
}

export default function VerifyCodeForm({
    contactDetail,
    contactValue,
    codeLength,
    onSubmitActionRoute,
}: VerifyCodeFormProps) {
    const maxSeconds = useRef<number>(60);
    const actionError = useActionData() as string | null;
    const { state } = useNavigation();
    const [inputs, setInputs] = useState<string[]>(Array(codeLength).fill(""));
    const { secondsLeft, setSecondsLeft } = useSecondsLeft(maxSeconds.current);
    const [message, setMessage] = useState<DisplayedMessage | null>(null);
    const [submissionsNumber, setSubmissionsNumber] = useState<number>(0);
    const prevSubmissionsNumber = useRef<number>(0);

    useEffect(() => {
        if (actionError && submissionsNumber > prevSubmissionsNumber.current) {
            setMessage({ isSuccess: false, message: actionError! });
            prevSubmissionsNumber.current = submissionsNumber;
        }
    });

    function incrementSubmissionsNumber() {
        setSubmissionsNumber((prev) => prev + 1);
    }

    function allInputsPopulated(): boolean {
        return inputs.every((i) => i.trim() != "");
    }

    return (
        <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
            <h2 className="mb-3 text-4xl font-bold text-gray-900">Verify Your {contactDetail}</h2>
            <p className="mb-8 text-lg text-gray-600">
                Please enter the verification code sent to <u>{contactValue}</u>
            </p>
            <Form method="post" action={onSubmitActionRoute}>
                <VerificationCodeInput inputs={inputs} setInputs={setInputs} message={message} />
                <SubmittingButton
                    onClick={incrementSubmissionsNumber}
                    disabled={!allInputsPopulated()}
                    loading={state == "loading"}
                    text="Verify Code"
                    additionalClasses="mb-6"
                    additionalEnabledClasses="bg-blue-500 hover:bg-blue-600"
                />
                <div className="flex justify-center space-x-2 mb-8">
                    <BackToSignupButton />
                    <ResendCodeButton
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
