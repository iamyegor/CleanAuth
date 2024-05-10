import SeparatorLine from "@/pages/Login/components/SeparatorLine.tsx";
import InputField from "@/components/ui/InputField.tsx";
import RecoveryAndSignupLinks from "@/pages/Login/components/RecoveryAndSignupLinks.tsx";
import SocialLoginButtons from "@/pages/Login/components/SocialLoginButtons.tsx";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import SubmittingButton from "@/components/ui/SubmittingButton.tsx";
import { validateCredentials } from "@/pages/Login/utils/validateCredentials.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import LoginError from "@/pages/Login/types/LoginError.ts";
import { Result } from "@/utils/resultOfT.ts";
import { parseResponseToLoginError } from "@/pages/Login/utils/parseResponseToLoginError.ts";

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

    function getErrorMessage(problematicField: string): string | undefined {
        if (loginError) {
            return loginError.problematicField == problematicField
                ? loginError.errorMessage
                : undefined;
        }
    }

    return (
        <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
            <h2 className="mb-3 text-4xl font-bold text-gray-900">Hello Again!</h2>
            <p className="mb-10 text-lg text-gray-600">Welcome back you've been missed!</p>
            <Form method="post" action={"/login"} replace>
                <InputField
                    type="text"
                    name="loginOrEmail"
                    placeholder="Login or Email"
                    additionalClasses="mb-4"
                    errorMessage={getErrorMessage("loginOrEmail")}
                />
                <InputField
                    type="password"
                    name="password"
                    placeholder="Password"
                    additionalClasses="mb-8"
                    errorMessage={getErrorMessage("password")}
                />
                <RecoveryAndSignupLinks additionalClasses="mb-8" />
                <SubmittingButton
                    loading={state == "submitting"}
                    text="Sign in"
                    additionalClasses="mb-8"
                    additionalEnabledClasses="bg-red-500 hover:bg-red-500"
                />
                <SeparatorLine text="Or continue with" additionalClasses="mb-8" />
                <SocialLoginButtons />
            </Form>
        </div>
    );
}
