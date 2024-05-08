import BaseLoginPage from "@/pages/BaseLoginPage/BaseLoginPage.tsx";
import signupPrimaryImage from "@/pages/SignupPage/images/signup_image.jpg";
import EmailVerificationForm from "@/pages/EmailVerificationPage/components/EmailVerificationForm.tsx";
import { SignupSessionInfo } from "@/pages/EmailVerificationPage/types/SignupSessionInfo.ts";
import { redirect, useLoaderData } from "react-router-dom";

export async function loader(): Promise<string | Response> {
    const signupDetailsString: string | null = localStorage.getItem("signupSessionInfo");

    if (!signupDetailsString) {
        return redirect("/signup");
    }

    const signupDetails: SignupSessionInfo = JSON.parse(signupDetailsString);
    if (signupDetails.isSigningUp) {
        return signupDetails.email;
    } else {
        return redirect("/signup");
    }
}

export default function EmailVerificationPage() {
    const email = useLoaderData() as string;

    return (
        <BaseLoginPage image={signupPrimaryImage}>
            <EmailVerificationForm email={email} />
        </BaseLoginPage>
    );
}
