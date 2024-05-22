import SeparatorLine from "@/pages/Login/components/SeparatorLine.tsx";
import RecoveryAndSignupLinks from "@/pages/Login/components/RecoveryAndSignupLinks.tsx";
import SocialLoginButtons from "@/pages/Login/components/socialLoginButtons/SocialLoginButtons.tsx";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import { validateCredentials } from "@/pages/Login/utils/validateCredentials.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import LoginError from "@/pages/Login/types/LoginError.ts";
import { ResultOf } from "@/utils/resultOfT.ts";
import { extractLoginError } from "@/pages/Login/utils/extractLoginError.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import getErrorMessageForField from "@/utils/getErrorMessageForField.ts";
import LoginPageLoginOrEmailInput from "@/pages/Login/components/LoginOrEmailInput.tsx";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import LoginPagePasswordInput from "@/pages/Login/components/LoginPagePasswordInput.tsx";

export async function action({ request }: any): Promise<LoginError | Response> {
    const data = await request.formData();

    const credentials = {
        loginOrEmail: data.get("loginOrEmail"),
        password: data.get("password"),
    };

    const validationResult: ResultOf<LoginError> = validateCredentials(credentials);
    if (validationResult.isFailure) {
        return validationResult.error!;
    }

    try {
        await api.post("api/login", credentials);
        return redirect("/");
    } catch (err) {
        return extractLoginError(err as AxiosError<ServerErrorResponse>);
    }
}

export default function LoginForm() {
    const loginError = useActionData() as LoginError | null;
    const { state } = useNavigation();

    function isPasswordError(): boolean {
        return loginError?.problematicField === "password";
    }

    function isBothError(): boolean {
        return loginError?.problematicField === "both";
    }

    function getBothErrorMessage(): ErrorMessage | null {
        return getErrorMessageForField("both", loginError);
    }

    return (
        <Form method="post" action={"/login"} replace data-testid="LoginForm">
            <div className={isBothError() || isPasswordError() ? "mb-6" : "mb-8"}>
                <div className={`space-y-4 ${isBothError() && "mb-6"}`}>
                    <LoginPageLoginOrEmailInput loginError={loginError} />
                    <LoginPagePasswordInput loginError={loginError} />
                </div>
                <ErrorMessageComponent errorMessage={getBothErrorMessage()} />
            </div>
            <RecoveryAndSignupLinks />
            <SubmittingButton loading={state == "submitting"} text="Sign in" />
            <SeparatorLine text="Or continue with" />
            <SocialLoginButtons />
        </Form>
    );
}
