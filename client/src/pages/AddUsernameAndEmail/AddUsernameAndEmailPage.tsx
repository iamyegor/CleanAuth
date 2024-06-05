import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import GoBackButtonVariant1 from "@/components/ui/GoBackButton.tsx";
import BaseAuthentication from "@/components/ui/basePages/BaseAuthentication.tsx";
import React, { useEffect, useState } from "react";
import AddUsernameAndEmailForm from "@/pages/AddUsernameAndEmail/components/AddUsernameAndEmailForm.tsx";
import api from "@/lib/api.ts";
import AddUsernameAndEmailPageSkeleton from "@/components/ui/skeletons/AddUsernameAndEmailPageSkeleton.tsx";
import useThrownError from "@/hooks/useThrownError.ts";

export default function AddUsernameAndEmailPage() {
    const [isLoading, setIsLoading] = useState(true);
    const { setThrownError } = useThrownError();

    useEffect(() => {
        canAddLoginAndEmail().catch((error) => setThrownError(error));

        async function canAddLoginAndEmail() {
            await api.get("can-add-login-and-email");
            setIsLoading(false);
        }
    }, []);

    return (
        <BaseAuthentication image={signupPrimaryImage} data-testid="AddUsernameAndEmailPage">
            {isLoading ? (
                <AddUsernameAndEmailPageSkeleton />
            ) : (
                <>
                    <h2 className="mb-3 text-4xl font-bold text-gray-900">
                        Add Username And Email
                    </h2>
                    <p className="mb-8 text-lg text-gray-600">
                        This information will be used to identify you
                    </p>
                    <AddUsernameAndEmailForm />
                    <GoBackButtonVariant1 route="/login" text="Go back to login" />
                </>
            )}
        </BaseAuthentication>
    );
}
