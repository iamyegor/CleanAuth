import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import PasswordInput from "@/components/ui/PasswordInput.tsx";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import api from "@/lib/api.ts";
import { useState } from "react";
import getQueryParam from "@/utils/getQueryParam.ts";
import extractPasswordResetError from "@/pages/PasswordReset/utils/extractPasswordResetError.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import PasswordResetError from "@/pages/PasswordReset/types/PasswordResetError.ts";
import { ResultOr } from "@/utils/resultOfT.ts";
import validatePasswordResetData from "@/pages/PasswordReset/utils/validateDataForPasswordReset.ts";

export async function action({ request }: any): Promise<Response | PasswordResetError> {
    const data = await request.formData();
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    const validationResult: ResultOr<PasswordResetError> = validatePasswordResetData(
        password,
        confirmPassword,
    );

    if (validationResult.isFailure) {
        return validationResult.error!;
    }

    const token: string | null = getQueryParam(request.url, "token");
    const uid: string | null = getQueryParam(request.url, "uid");

    try {
        await api.post(`api/reset-password?userId=${uid}&token=${token}`, { password });
        return redirect("/");
    } catch (err) {
        const errorMessage: ErrorMessage = extractPasswordResetError(
            err as AxiosError<ServerErrorResponse>,
        );

        return { field: "password", errorMessage };
    }
}

export default function PasswordResetForm() {
    const { state } = useNavigation();
    const passwordResetError = useActionData() as PasswordResetError | null;
    const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);

    function getErrorMessageForField(field: string): ErrorMessage | null {
        return passwordResetError?.field == field ? passwordResetError.errorMessage : null;
    }

    return (
        <Form method="post" data-testid="PasswordResetForm">
            <div className={`space-y-4 ${isConfirmPasswordError ? "mb-6" : "mb-8"}`}>
                <PasswordInput
                    name="password"
                    placeholder="New password"
                    errorMessage={getErrorMessageForField("password")}
                />
                <PasswordInput
                    name="confirmPassword"
                    placeholder="Repeat password"
                    errorMessage={getErrorMessageForField("confirmPassword")}
                    handleErrorShown={setIsConfirmPasswordError}
                />
            </div>
            <SubmittingButton
                loading={state === "loading" || state === "submitting"}
                text="Reset password"
            />
        </Form>
    );
}
