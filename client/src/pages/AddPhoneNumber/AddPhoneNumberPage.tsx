import BaseAuthentication from "@/components/ui/basePages/BaseAuthentication.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import AddPhoneNumberForm from "@/pages/AddPhoneNumber/components/AddPhoneNumberForm.tsx";
import "@/pages/AddPhoneNumber/styles/add-phone-number.css";
import api from "@/lib/api.ts";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AddPhoneNumberPageSkeleton from "@/components/ui/skeletons/AddPhoneNumberPageSkeleton.tsx";

export default function AddPhoneNumberPage() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await api.get("api/need-to-add-phone-number");
                setIsLoading(false);
            } catch (err) {
                navigate("/signup");
            }
        })();
    }, []);

    return (
        <BaseAuthentication image={signupPrimaryImage} data-testid="AddPhoneNumberPage">
            {isLoading ? (
                <AddPhoneNumberPageSkeleton />
            ) : (
                <>
                    <h2 className="mb-3 text-4xl font-bold text-gray-900">
                        Verify Your Phone Number
                    </h2>
                    <p className="mb-8 text-lg text-gray-600">
                        Please enter your phone number below, you'll receive a code
                    </p>
                    <AddPhoneNumberForm />
                </>
            )}
        </BaseAuthentication>
    );
}
