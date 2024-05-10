import BaseLoginPage from "@/pages/BaseLogin/BaseLoginPage.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import { redirect, useLoaderData } from "react-router-dom";
import api from "@/lib/api.ts";
import VerifyCodeForm, { baseAction } from "@/components/VerifyCodeForm/VerifyCodeForm.tsx";

export async function loader(): Promise<string | Response> {
    try {
        const response = await api.get<string>("api/email-for-verification");

        return response.data;
    } catch {
        return redirect("/signup");
    }
}

export async function action({ request }: any): Promise<string | Response> {
    const result: string | Response = await baseAction(
        request,
        5,
        "api/verify-email",
        "/add-phone-number",
    );

    if (result instanceof Response) {
        sessionStorage.removeItem("signupData");
    }

    return result;
}

export default function VerifyEmailPage() {
    const email = useLoaderData() as string;

    return (
        <BaseLoginPage image={signupPrimaryImage}>
            <VerifyCodeForm
                goBackRoute="/signup"
                goBackButtonText="Go back to signup"
                resendCodeEndpoint="api/resend-email-code"
                contactDetail="Email"
                contactValue={email}
                codeLength={5}
                onSubmitActionRoute="/verify-email"
            />
        </BaseLoginPage>
    );
}
