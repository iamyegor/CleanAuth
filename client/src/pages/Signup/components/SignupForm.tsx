import InputField from "@/components/ui/InputField.tsx";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import { Form, NavLink, redirect, useActionData, useNavigation } from "react-router-dom";
import { validateSignupData } from "@/pages/Signup/utils/validateSignupData.ts";
import { Result } from "@/utils/resultOfT.ts";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import parseResponseToSignupError from "@/pages/Signup/utils/parseResponseToSignupError.ts";
import { getSignupData } from "@/pages/Signup/utils/getSignupData.ts";
import useStoredSignupData from "@/pages/Signup/hooks/useInitialSignupData.ts";
import storeSignupData from "@/utils/initialSignupData/storeSignupData.ts";
import PasswordInput from "@/components/ui/PasswordInput.tsx";
import getErrorMessageForField from "@/utils/getErrorMessageForField.ts";

export async function action({ request }: any): Promise<SignupError | Response> {
    const form = await request.formData();
    const data: SignupData = getSignupData(form);

    const validationResult: Result<SignupError> = validateSignupData(data);
    if (validationResult.isFailure) {
        return validationResult.error!;
    }

    try {
        await api.post("api/signup", {
            login: data.username,
            email: data.email,
            password: data.password,
        });

        storeSignupData(data);

        return redirect("/verify-email");
    } catch (err) {
        const error = err as AxiosError<ServerErrorResponse>;
        if (error.response?.data) {
            return parseResponseToSignupError(error.response.data);
        }

        throw new Error("No response was received");
    }
}

export default function SignupForm() {
    const storedSignupData: SignupData | null = useStoredSignupData();
    const signupError = useActionData() as SignupError;
    const { state } = useNavigation();

    return (
        <Form method="post" action={"/signup"} className={"space-y-8"}>
            <div
                className={
                    getErrorMessageForField("repeatedPassword", signupError)
                        ? "space-y-4"
                        : "space-y-8"
                }
            >
                <div className="space-y-4">
                    <InputField
                        type="text"
                        name="username"
                        placeholder="Username"
                        errorMessage={getErrorMessageForField("username", signupError)}
                        defaultValue={storedSignupData?.username}
                    />
                    <InputField
                        type="email"
                        name="email"
                        placeholder="Email"
                        errorMessage={getErrorMessageForField("email", signupError)}
                        defaultValue={storedSignupData?.email}
                    />
                    <PasswordInput
                        name="password"
                        placeholder="Password"
                        errorMessage={getErrorMessageForField("password", signupError)}
                        defaultValue={storedSignupData?.password}
                    />
                    <PasswordInput
                        name="repeatedPassword"
                        placeholder="Repeat Password"
                        errorMessage={getErrorMessageForField("repeatedPassword", signupError)}
                        defaultValue={storedSignupData?.repeatedPassword}
                    />
                </div>
                <div className="text-lef text-sm flex space-x-1 items-center">
                    <span>Already a member?</span>
                    <NavLink to="/login" className="hover:underline decoration-blue-500">
                        <span className="text-blue-500">Sign in!</span>
                    </NavLink>
                </div>
            </div>
            <SubmittingButton loading={state == "submitting"} text="Sign up" />
        </Form>
    );
}
