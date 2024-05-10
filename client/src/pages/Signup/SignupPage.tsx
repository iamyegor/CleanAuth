import SignupForm from "@/pages/Signup/components/SignupForm.tsx";
import BaseLoginPage from "@/pages/BaseLogin/BaseLoginPage.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import api from "@/lib/api.ts";
import { redirect } from "react-router-dom";

export async function loader(): Promise<string | null | Response> {
    try {
        await api.get("api/is-authenticated");
        return redirect("/");
    } catch {
        const signupDataString = sessionStorage.getItem("signupData");
        if (signupDataString) {
            return JSON.parse(signupDataString);
        }

        return null;
    }
}

export default function SignupPage() {
    return (
        <BaseLoginPage image={signupPrimaryImage}>
            <SignupForm />
        </BaseLoginPage>
    );
}
