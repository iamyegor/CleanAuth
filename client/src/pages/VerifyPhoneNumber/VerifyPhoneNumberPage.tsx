import BaseLoginPage from "@/pages/BaseLogin/BaseLoginPage.tsx";

import primaryImage from "@/pages/Signup/images/signup_image.jpg";
import VerifyCodeForm, { baseAction } from "@/components/VerifyCodeForm/VerifyCodeForm.tsx";
import { redirect, useLoaderData } from "react-router-dom";
import api from "@/lib/api.ts";
import DisplayedMessage from "@/components/VerifyCodeForm/utils/DisplayedMessage.ts";

export async function action({ request }: any): Promise<DisplayedMessage | Response> {
    return await baseAction(request, 4, "api/verify-phone-number", "/");
}

export async function loader(): Promise<string | Response> {
    try {
        const response = await api.get<string>("api/phone-number-for-verification");
        return response.data;
    } catch {
        return redirect("/signup");
    }
}

export default function VerifyPhoneNumberPage() {
    const phoneNumber = useLoaderData() as string;

    return (
        <BaseLoginPage image={primaryImage}>
            <VerifyCodeForm
                goBackRoute="/add-phone-number"
                goBackButtonText="Change number"
                resendCodeEndpoint="api/resend-phone-number-code"
                contactDetail="Phone Number"
                contactValue={phoneNumber}
                codeLength={4}
                onSubmitActionRoute="/verify-phone-number"
            />
        </BaseLoginPage>
    );
}
