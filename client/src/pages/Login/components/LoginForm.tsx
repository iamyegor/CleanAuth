import SeparatorLine from "@/pages/Login/components/SeparatorLine.tsx";
import RecoveryAndSignupLinks from "@/pages/Login/components/RecoveryAndSignupLinks.tsx";
import SocialLoginButtons from "@/pages/Login/components/socialLoginButtons/SocialLoginButtons.tsx";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import { validateCredentials } from "@/pages/Login/utils/validateCredentials.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { ResultOr } from "@/utils/resultOfT.ts";
import { extractLoginError } from "@/pages/Login/utils/extractLoginError.ts";
import getFieldErrorMessage from "@/utils/getFieldErrorMessage.ts";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import FieldError from "@/utils/FieldError.ts";
import Input from "@/components/ui/inputs/Input.tsx";
import PasswordInput from "@/components/ui/inputs/PasswordInput.tsx";

export async function action({ request }: any): Promise<FieldError | Response> {
    const data = await request.formData();

    const credentials = {
        loginOrEmail: data.get("loginOrEmail"),
        password: data.get("password"),
    };

    const validationResult: ResultOr<FieldError> = validateCredentials(credentials);
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
    const fieldError = useActionData() as FieldError | null;
    const { state } = useNavigation();

    function isPasswordError(): boolean {
        return fieldError?.problematicField === "password";
    }

    const bothError: boolean = fieldError?.isField("both") ?? false;
    const loginOrEmailError: boolean = fieldError?.isField("loginOrEmail") ?? false;
    const passwordError: boolean = fieldError?.isField("password") ?? false;

    return (
        <Form method="post" action={"/login"} replace data-testid="LoginForm">
            <div className={bothError || isPasswordError() ? "mb-6" : "mb-8"}>
                <div className={`space-y-4 ${bothError && "mb-6"}`}>
                    <Input
                        type="text"
                        name="loginOrEmail"
                        placeholder="Login or Email"
                        data-testid="LoginForm.LoginOrEmailInput"
                        isInvalid={bothError || loginOrEmailError}
                    />
                    <ErrorMessageComponent
                        errorMessage={getFieldErrorMessage("loginOrEmail", fieldError)}
                    />
                    <PasswordInput
                        name="password"
                        placeholder="Password"
                        data-testid="LoginForm.PasswordInput"
                        isInvalid={bothError || passwordError}
                    />
                    <ErrorMessageComponent
                        errorMessage={getFieldErrorMessage("password", fieldError)}
                    />
                </div>
                <ErrorMessageComponent errorMessage={getFieldErrorMessage("both", fieldError)} />
            </div>
            <RecoveryAndSignupLinks />
            <SubmittingButton loading={state == "submitting"} text="Sign in" />
            <SeparatorLine text="Or continue with" />
            <SocialLoginButtons />
        </Form>
    );
}
