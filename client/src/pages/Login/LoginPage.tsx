import loginPrimaryImage from "@/pages/Login/images/login-image.jpg";
import LoginForm from "@/pages/Login/components/LoginForm.tsx";
import { redirect } from "react-router-dom";
import api from "@/lib/api.ts";
import BaseAuthentication from "@/components/ui/BaseAuthentication.tsx";

export async function loader(): Promise<Response | null> {
    try {
        await api.get("api/is-authenticated");
        return redirect("/");
    } catch {
        return null;
    }
}

export default function LoginPage() {
    return (
        <BaseAuthentication image={loginPrimaryImage}>
            <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
                <h2 className="mb-3 text-4xl font-bold text-gray-900">Hello Again!</h2>
                <p className="mb-10 text-lg text-gray-600">Welcome back you've been missed!</p>
                <LoginForm />
            </div>
        </BaseAuthentication>
    );
}
