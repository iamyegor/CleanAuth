import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import React, { useState } from "react";
import SubmittingButton from "@/components/ui/SubmittingButton.tsx";
import VerificationCodeInput from "@/pages/EmailVerificationPage/components/ValidationCodeInput.tsx";
import { ONLY_NUMBERS_REGEX } from "@/data/regularExpressions.ts";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import ErrorMessage from "@/components/ui/ErrorMessage.tsx";
import { SignupSessionInfo } from "@/pages/EmailVerificationPage/types/SignupSessionInfo.ts";

export async function action({ request }: any): Promise<string | Response> {
    const form = await request.formData();

    let code: string = "";
    for (let i = 0; i < 5; i++) {
        code += form.get(`code-${i}`);
    }

    if (code.length != 5) {
        return "Code length must be 5";
    } else if (!ONLY_NUMBERS_REGEX.test(code)) {
        return "Code must contain only numbers and no letters";
    }

    try {
        const { email }: SignupSessionInfo = JSON.parse(localStorage.getItem("signupSessionInfo")!);
        await api.post("api/verify-email", { email, code });

        localStorage.removeItem("signupSessionInfo");

        return redirect("/verify-phone");
    } catch (err) {
        const error = err as AxiosError<ServerErrorResponse>;
        if (error.response?.data) {
            return error.response.data.errorMessage;
        }

        throw new Error("No response was received");
    }
}

interface EmailVerificationFormProps {
    email: string;
}

export default function EmailVerificationForm({ email }: EmailVerificationFormProps) {
    const errorMessage = useActionData() as string;
    const { state } = useNavigation();
    const [inputs, setInputs] = useState<string[]>(Array(5).fill(""));

    function allInputsPopulated(): boolean {
        return inputs.every((i) => i.trim() != "");
    }

    return (
        <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
            <h2 className="mb-3 text-4xl font-bold text-gray-900">Verify Your Email</h2>
            <p className="mb-8 text-lg text-gray-600">
                Please enter the verification code sent to <u>{email}</u>
            </p>
            <Form method="post" action={"/verify-email"}>
                <div className="mb-8">
                    <VerificationCodeInput
                        inputs={inputs}
                        setInputs={setInputs}
                        isError={!!errorMessage}
                    />
                    {errorMessage && (
                        <ErrorMessage errorMessage={errorMessage} additionalClasses="mt-8" />
                    )}
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
