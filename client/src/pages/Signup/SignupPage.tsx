import SignupForm from "@/pages/Signup/components/SignupForm.tsx";
import BaseAuthenticationPage from "@/pages/BaseAuthentication/BaseAuthenticationPage.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import api from "@/lib/api.ts";
import { redirect } from "react-router-dom";

export async function loader(): Promise<string | null | Response> {
    try {
        await api.get("api/is-authenticated");
        return redirect("/");
    } catch {
        return null;
    }
}

export default function SignupPage() {
    return (
        <BaseAuthenticationPage image={signupPrimaryImage}>
            <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
                <h2 className="mb-3 text-4xl font-bold text-gray-900">Create account</h2>
                <p className="mb-10 text-lg text-gray-600">To get you started!</p>
                <SignupForm />
            </div>
        </BaseAuthenticationPage>
    );
}
