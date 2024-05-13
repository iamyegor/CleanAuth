import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import PasswordInput from "@/components/Inputs/PasswordInput.tsx";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import validatePassword from "@/utils/validatePassword.ts";
import { Result } from "@/utils/result.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import api from "@/lib/api.ts";
import getServerErrorMessageOrThrow from "@/utils/getServerErrorMessageOrThrow.ts";
import DisplayedErrorMessage from "@/components/ui/DisplayedErrorMessage.tsx";
import { useState } from "react";
import getQueryParam from "@/utils/getQueryParam.ts";

export async function action({ request }: any): Promise<Response | ErrorMessage> {
    const data = await request.formData();
    const password = data.get("password");

    const passwordValidation: Result = validatePassword(password);
    if (passwordValidation.isFailure) {
        return ErrorMessage.create(passwordValidation.errorMessage!);
    }

    const token: string | null = getQueryParam(request.url, "token");
    const uid: string | null = getQueryParam(request.url, "uid");

    try {
        await api.post(`api/reset-password?userId=${uid}&token=${token}`, { password });
        return redirect("/login");
    } catch (err) {
        return ErrorMessage.create(getServerErrorMessageOrThrow(err));
    }
}

export default function PasswordResetForm() {
    const { state } = useNavigation();
    const errorMessage = useActionData() as ErrorMessage | null;
    const [isErrorShown, setIsErrorShown] = useState(false);

    return (
        <>
            <div>
                <h2 className="text-center text-4xl font-bold text-gray-900 mb-3">
                    Set your new password
                </h2>
                <p className="text-center text-lg text-gray-600 mb-8">
                    Please enter your new password below
                </p>
            </div>
            <Form method="post" className={isErrorShown ? "space-y-6" : "space-y-8"}>
                <PasswordInput name="password" placeholder="New password" />
                <DisplayedErrorMessage
                    errorMessage={errorMessage}
                    setIsErrorShown={setIsErrorShown}
                />
                <SubmittingButton
                    loading={state === "loading" || state === "submitting"}
                    text="Reset password"
                />
            </Form>
        </>
    );
}
