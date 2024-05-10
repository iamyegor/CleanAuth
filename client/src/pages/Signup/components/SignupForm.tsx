import InputField from "@/components/ui/InputField.tsx";
import SubmittingButton from "@/components/ui/SubmittingButton.tsx";
import {
    Form,
    json,
    NavLink,
    redirect,
    useActionData,
    useLoaderData,
    useNavigation,
} from "react-router-dom";
import { validateSignupData } from "@/pages/Signup/utils/validateSignupData.ts";
import { Result } from "@/utils/resultOfT.ts";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import parseResponseToSignupError from "@/pages/Signup/utils/parseResponseToSignupError.ts";
import { getSignupData } from "@/pages/Signup/utils/getSignupData.ts";

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

        sessionStorage.setItem("signupData", JSON.stringify(data));

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
    const initialSignupData = useLoaderData() as SignupData | null;
    const signupError = useActionData() as SignupError;
    const { state } = useNavigation();

    function getErrorMessage(problematicField: string): string | undefined {
        if (signupError) {
            return signupError.problematicField == problematicField
                ? signupError.errorMessage
                : undefined;
        }
    }

    return (
        <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
            <h2 className="mb-3 text-4xl font-bold text-gray-900">Create account</h2>
            <p className="mb-10 text-lg text-gray-600">To get you started!</p>
            <Form method="post" action={"/signup"}>
                <InputField
                    type="text"
                    name="username"
                    placeholder="Username"
                    additionalClasses="mb-4"
                    errorMessage={getErrorMessage("username")}
                    defaultValue={initialSignupData?.username}
                />
                <InputField
                    type="email"
                    name="email"
                    placeholder="Email"
                    additionalClasses="mb-4"
                    errorMessage={getErrorMessage("email")}
                    defaultValue={initialSignupData?.email}
                />
                <InputField
                    type="password"
                    name="password"
                    placeholder="Password"
                    additionalClasses="mb-4"
                    errorMessage={getErrorMessage("password")}
                    defaultValue={initialSignupData?.password}
                />
                <InputField
                    type="password"
                    name="repeatedPassword"
                    placeholder="Repeat Password"
                    additionalClasses="mb-8"
                    errorMessage={getErrorMessage("repeatedPassword")}
                    defaultValue={initialSignupData?.repeatedPassword}
                />
                <div className="mb-8 text-lef text-sm flex space-x-1 items-center">
                    <span>Already a member?</span>
                    <NavLink to="/login" className="hover:underline decoration-blue-500">
                        <span className="text-blue-500">Sign in!</span>
                    </NavLink>
                </div>
                <SubmittingButton
                    loading={state == "submitting"}
                    text="Sign up"
                    additionalClasses="bg-red-500 hover:bg-red-600"
                />
            </Form>
        </div>
    );
}
