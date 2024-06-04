import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import PasswordInput from "@/components/ui/inputs/PasswordInput.tsx";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import api from "@/lib/api.ts";
import getQueryParam from "@/utils/getQueryParam.ts";
import extractPasswordResetError from "@/pages/PasswordReset/utils/extractPasswordResetError.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { ResultOr } from "@/utils/resultOfT.ts";
import validatePasswordResetData from "@/pages/PasswordReset/utils/validateDataForPasswordReset.ts";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import getFieldErrorMessage from "@/utils/getFieldErrorMessage.ts";
import FieldError from "@/utils/FieldError.ts";

export async function action({ request }: any): Promise<Response | FieldError> {
    const data = await request.formData();
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    const validationResult: ResultOr<FieldError> = validatePasswordResetData(
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
        return extractPasswordResetError(err as AxiosError<ServerErrorResponse>);
    }
}

export default function PasswordResetForm() {
    const { state } = useNavigation();
    const passwordResetError = useActionData() as FieldError | null;

    const passwordError: boolean = passwordResetError?.isField("password") ?? false;
    const confirmPasswordError: boolean = passwordResetError?.isField("confirmPassword") ?? false;

    return (
        <Form method="post" data-testid="PasswordResetForm">
            <div className={`space-y-4 ${confirmPasswordError ? "mb-6" : "mb-8"}`}>
                <PasswordInput
                    name="password"
                    placeholder="New password"
                    isInvalid={passwordError}
                />
                <ErrorMessageComponent
                    errorMessage={getFieldErrorMessage("password", passwordResetError)}
                />
                <PasswordInput
                    name="confirmPassword"
                    placeholder="Repeat password"
                    isInvalid={confirmPasswordError}
                />
                <ErrorMessageComponent
                    errorMessage={getFieldErrorMessage("confirmPassword", passwordResetError)}
                />
            </div>
            <SubmittingButton
                loading={state === "loading" || state === "submitting"}
                text="Reset password"
            />
        </Form>
    );
}
