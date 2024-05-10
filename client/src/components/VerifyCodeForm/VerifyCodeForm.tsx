import { Form, NavLink, redirect, useActionData, useNavigation } from "react-router-dom";
import SubmittingButton from "@/components/ui/SubmittingButton.tsx";
import VerificationCodeInput from "@/components/VerifyCodeForm/components/VerificationCodeInput.tsx";
import { useState } from "react";
import api from "@/lib/api.ts";
import getServerErrorMessageOrThrow from "@/utils/getServerErrorMessageOrThrow.ts";
import validateCode from "@/components/VerifyCodeForm/utils/validateCode.ts";
import { Result } from "@/utils/result.ts";

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
    const form = await request.formData();

    let code: string = "";
    for (let i = 0; i < maxCodeLength; i++) {
        code += form.get(`code-${i}`);
    }

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
    const errorMessage = useActionData() as string;
    const { state } = useNavigation();
    const [inputs, setInputs] = useState<string[]>(Array(codeLength).fill(""));

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
                <VerificationCodeInput
                    inputs={inputs}
                    setInputs={setInputs}
                    errorMessage={errorMessage}
                />
                <div className="mb-8 flex justify-start space-x-1">
                    <div>Entered incorrect email?</div>
                    <NavLink to={"/signup"} className="text-blue-500 hover:underline">
                        Go back
                    </NavLink>
                </div>
                <SubmittingButton
                    disabled={!allInputsPopulated()}
                    loading={state == "loading"}
                    text="Verify Code"
                    additionalClasses="bg-blue-500 hover:bg-blue-600"
                />
            </Form>
        </div>
    );
}
