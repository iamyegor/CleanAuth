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
    return baseAction(request, 5, "api/verify-email", "/add-phone-number");
}

export default function VerifyEmailPage() {
    const email = useLoaderData() as string;

    return (
        <BaseLoginPage image={signupPrimaryImage}>
            <VerifyCodeForm
                contactDetail="Email"
                contactValue={email}
                codeLength={5}
                onSubmitActionRoute="/verify-email"
            />
        </BaseLoginPage>
    );
}
