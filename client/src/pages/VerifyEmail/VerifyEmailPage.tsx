import BaseAuthentication from "@/components/ui/BaseAuthentication.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import { redirect, useLoaderData } from "react-router-dom";
import api from "@/lib/api.ts";
import VerifyCodeForm, { baseAction } from "@/components/VerifyCodeForm/VerifyCodeForm.tsx";
import FeedbackMessage from "@/utils/FeedbackMessage.ts";
import VerifyEmailLoaderData from "@/pages/VerifyEmail/types/VerifyEmailLoaderData.ts";
import extractVerifyEmailError from "@/pages/VerifyEmail/utils/extractVerifyEmailError.ts";
import EmailForVerificationResponse from "@/pages/VerifyEmail/types/RequestEmailVerificationCodeResponse.ts";

export async function loader(): Promise<VerifyEmailLoaderData | Response> {
    try {
        const response = await api.get<EmailForVerificationResponse>("api/email-for-verification");

        return { email: response.data.email };
    } catch {
        return redirect("/signup");
    }
}

export async function action({ request }: any): Promise<FeedbackMessage | Response> {
    return await baseAction(
        request,
        5,
        "api/verify-email",
        "/add-phone-number",
        extractVerifyEmailError,
    );
}

export default function VerifyEmailPage() {
    const { email } = useLoaderData() as VerifyEmailLoaderData;

    return (
        <BaseAuthentication image={signupPrimaryImage} data-testid="VerifyEmailPage">
            <VerifyCodeForm
                goBackRoute="/signup"
                goBackButtonText="Back to signup"
                resendCodeEndpoint="api/request-email-verification-code"
                contactDetail="Email"
                contactValue={email}
                codeLength={5}
                onSubmitActionRoute="/verify-email"
                maxSeconds={60}
            />
        </BaseAuthentication>
    );
}
