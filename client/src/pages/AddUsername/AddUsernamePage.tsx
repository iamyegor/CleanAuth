import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import BaseAuthentication from "@/components/ui/basePages/BaseAuthentication.tsx";
import AddUsernameForm from "@/pages/AddUsername/components/AddUsernameForm.tsx";
import React, { useEffect, useState } from "react";
import GoBackButtonVariant1 from "@/components/ui/GoBackButton.tsx";
import api from "@/lib/api.ts";
import AddUsernamePageSkeleton from "@/components/ui/skeletons/AddUsernamePageSkeleton.tsx";
import { useNavigate } from "react-router-dom";

export default function AddUsernamePage() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await api.get("can-add-login");
                setIsLoading(false);
            } catch {
                navigate("/signup");
            }
        })();
    }, []);

    return (
        <BaseAuthentication image={signupPrimaryImage} data-testid="AddUsernamePage">
            {isLoading ? (
                <AddUsernamePageSkeleton />
            ) : (
                <>
                    <h2 className="mb-3 text-4xl font-bold text-gray-900">Create Username</h2>
                    <p className="mb-8 text-lg text-gray-600">
                        This name will be visible to everybody
                    </p>
                    <AddUsernameForm />
                    <GoBackButtonVariant1 route="/login" text="Go back to login" />
                </>
            )}
        </BaseAuthentication>
    );
}
