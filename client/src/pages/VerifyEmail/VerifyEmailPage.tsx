import BaseAuthentication from "@/components/ui/basePages/BaseAuthentication.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api.ts";
import VerifyCodeForm, { baseAction } from "@/components/VerifyCodeForm/VerifyCodeForm.tsx";
import FeedbackMessage from "@/utils/FeedbackMessage.ts";
import extractVerifyEmailError from "@/pages/VerifyEmail/utils/extractVerifyEmailError.ts";
import EmailForVerificationResponse from "@/pages/VerifyEmail/types/RequestEmailVerificationCodeResponse.ts";
import { useEffect, useState } from "react";
import VerifyCodePageSkeleton from "@/components/ui/skeletons/VerifyCodePageSkeleton.tsx";

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
    const [email, setEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get<EmailForVerificationResponse>(
                    "api/email-for-verification",
                );

                setEmail(response.data.email);
                setIsLoading(false);
            } catch {
                navigate("/signup");
            }
        })();
    }, []);

    return (
        <BaseAuthentication image={signupPrimaryImage} data-testid="VerifyEmailPage">
            {isLoading ? (
                <VerifyCodePageSkeleton inputsNumber={5} />
            ) : (
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
            )}
        </BaseAuthentication>
    );
}
