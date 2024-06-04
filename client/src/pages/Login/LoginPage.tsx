import loginPrimaryImage from "@/pages/Login/images/login-image.jpg";
import LoginForm from "@/pages/Login/components/LoginForm.tsx";
import { useNavigate } from "react-router-dom";
import BaseAuthentication from "@/components/ui/basePages/BaseAuthentication.tsx";
import React, { useEffect, useState } from "react";
import LoginPageSkeleton from "@/components/ui/skeletons/LoginPageSkeleton.tsx";
import checkAuth from "@/utils/checkAuth.ts";

export default function LoginPage() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => await checkAuth(navigate, setLoading))();
    }, []);

    return (
        <BaseAuthentication image={loginPrimaryImage} data-testid="LoginPage">
            {loading ? (
                <LoginPageSkeleton />
            ) : (
                <>
                    <h2 className="mb-3 text-4xl font-bold text-gray-900">Hello Again!</h2>
                    <p className="mb-10 text-lg text-gray-600">Welcome back you've been missed!</p>
                    <LoginForm />
                </>
            )}
        </BaseAuthentication>
    );
}
