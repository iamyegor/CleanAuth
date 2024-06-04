import SignupForm from "@/pages/Signup/components/SignupForm.tsx";
import BaseAuthentication from "@/components/ui/basePages/BaseAuthentication.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import checkAuth from "@/utils/checkAuth.ts";
import SignupPageSkeleton from "@/components/ui/skeletons/SignupPageSkeleton.tsx";

export default function SignupPage() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => await checkAuth(navigate, setLoading))();
    }, []);

    return (
        <BaseAuthentication image={signupPrimaryImage} data-testid="SignupPage">
            {loading ? (
                <SignupPageSkeleton />
            ) : (
                <>
                    <h2 className="mb-3 text-4xl font-bold text-gray-900">Create account</h2>
                    <p className="mb-10 text-lg text-gray-600">To get you started!</p>
                    <SignupForm />
                </>
            )}
        </BaseAuthentication>
    );
}
