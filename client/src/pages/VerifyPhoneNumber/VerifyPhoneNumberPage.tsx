import BaseLoginPage from "@/pages/BaseLogin/BaseLoginPage.tsx";

import primaryImage from "@/pages/Signup/images/signup_image.jpg";
import VerifyCodeForm, { baseAction } from "@/components/VerifyCodeForm/VerifyCodeForm.tsx";
import { useLoaderData } from "react-router-dom";

export async function action({ request }: any): Promise<string | Response> {
    return await baseAction(request, 4, "api/verify-phone-number", "/");
}

export default function VerifyPhoneNumberPage() {
    const phoneNumber = useLoaderData() as string;

    return (
        <BaseLoginPage image={primaryImage}>
            <VerifyCodeForm
                contactDetail="Phone Number"
                contactValue={phoneNumber}
                codeLength={4}
                onSubmitActionRoute="/verify-phone-number"
            />
        </BaseLoginPage>
    );
}
