import loginPrimaryImage from "@/pages/LoginPage/images/login-image.jpg";
import LoginForm from "@/pages/LoginPage/components/LoginForm.tsx";
import { redirect } from "react-router-dom";
import api from "@/lib/api.ts";
import BaseLoginPage from "@/pages/BaseLoginPage/BaseLoginPage.tsx";

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
