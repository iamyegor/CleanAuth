import BaseAuthentication from "@/components/ui/basePages/BaseAuthentication.tsx";
import primaryImage from "@/pages/Signup/images/signup_image.jpg";
import VerifyCodeForm, { baseAction } from "@/components/VerifyCodeForm/VerifyCodeForm.tsx";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api.ts";
import FeedbackMessage from "@/utils/FeedbackMessage.ts";
import extractVerifyPhoneNumberError from "@/pages/VerifyPhoneNumber/utils/extractVerifyPhoneNumberError.ts";
import { useEffect, useState } from "react";
import VerifyCodePageSkeleton from "@/components/ui/skeletons/VerifyCodePageSkeleton.tsx";

export async function action({ request }: any): Promise<FeedbackMessage | Response> {
    return await baseAction(
        request,
        4,
        "api/verify-phone-number",
        "/",
        extractVerifyPhoneNumberError,
    );
}

export default function VerifyPhoneNumberPage() {
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await api.get<string>("api/phone-number-for-verification");
                setPhoneNumber(response.data);
                setIsLoading(false);
            } catch {
                navigate("/signup");
            }
        })();
    }, []);

    if (isLoading) {
        return (
            <BaseAuthentication image={primaryImage} data-testid="VerifyPhoneNumberPage">
                <VerifyCodePageSkeleton inputsNumber={4} />
            </BaseAuthentication>
        );
    }

    return (
        <BaseAuthentication image={primaryImage} data-testid="VerifyPhoneNumberPage">
            <VerifyCodeForm
                goBackRoute="/add-phone-number"
                goBackButtonText="Change number"
                resendCodeEndpoint="api/resend-phone-number-code"
                contactDetail="Phone Number"
                contactValue={phoneNumber}
                codeLength={4}
                onSubmitActionRoute="/verify-phone-number"
                maxSeconds={60}
            />
        </BaseAuthentication>
    );
}
