import loginPrimaryImage from "@/pages/Login/images/login-image.jpg";
import LoginForm from "@/pages/Login/components/LoginForm.tsx";
import { redirect } from "react-router-dom";
import api from "@/lib/api.ts";
import BaseLoginPage from "@/pages/BaseLogin/BaseLoginPage.tsx";

export async function loader(): Promise<any> {
    try {
        await api.get("api/is-authenticated");
        return redirect("/");
    } catch {
        return null;
    }
}

export default function LoginPage() {
    return (
        <BaseLoginPage image={loginPrimaryImage}>
            <LoginForm />
        </BaseLoginPage>
    );
}
