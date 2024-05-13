import SeparatorLine from "@/pages/Login/components/SeparatorLine.tsx";
import InputField from "@/components/ui/InputField.tsx";
import RecoveryAndSignupLinks from "@/pages/Login/components/RecoveryAndSignupLinks.tsx";
import SocialLoginButtons from "@/pages/Login/components/SocialLoginButtons.tsx";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import { validateCredentials } from "@/pages/Login/utils/validateCredentials.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import LoginError from "@/pages/Login/types/LoginError.ts";
import { Result } from "@/utils/resultOfT.ts";
import { parseResponseToLoginError } from "@/pages/Login/utils/parseResponseToLoginError.ts";
import PasswordInput from "@/components/ui/PasswordInput.tsx";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import getErrorMessageForField from "@/utils/getErrorMessageForField.ts";

export async function action({ request }: any): Promise<LoginError | Response> {
    const data = await request.formData();

    const credentials = {
        loginOrEmail: data.get("loginOrEmail"),
        password: data.get("password"),
    };

    const validationResult: Result<LoginError> = validateCredentials(credentials);
    if (validationResult.isFailure) {
        return validationResult.error!;
    }

    try {
        await api.post("api/login", credentials);
        return redirect("/");
    } catch (err) {
        const error = err as AxiosError<ServerErrorResponse>;
        if (error.response?.data) {
            return parseResponseToLoginError(error.response.data);
        }

        throw new Error("No response war received");
    }
}

export default function LoginForm() {
    const loginError = useActionData() as LoginError;
    const { state } = useNavigation();

    return (
        <Form method="post" action={"/login"} replace>
            <div className={getErrorMessageForField("password", loginError) ? "mb-4" : "mb-8"}>
                <div className="space-y-4">
                    <InputField
                        type="text"
                        name="loginOrEmail"
                        placeholder="Login or Email"
                        errorMessage={getErrorMessageForField("loginOrEmail", loginError)}
                    />
                    <PasswordInput
                        name="password"
                        placeholder="Password"
                        errorMessage={getErrorMessageForField("password", loginError)}
                    />
                </div>
            </div>
            <RecoveryAndSignupLinks />
            <SubmittingButton loading={state == "submitting"} text="Sign in" />
            <SeparatorLine text="Or continue with" />
            <SocialLoginButtons />
        </Form>
    );
}
