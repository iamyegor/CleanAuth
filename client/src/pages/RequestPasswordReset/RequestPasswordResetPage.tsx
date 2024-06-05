import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api.ts";
import BasePasswordReset from "@/components/ui/basePages/BasePasswordReset.tsx";
import RequestPasswordResetForm from "@/pages/RequestPasswordReset/components/RequestPasswordResetForm.tsx";
import GoBackButton from "@/components/ui/GoBackButton.tsx";
import RequestPasswordResetPageSkeleton from "@/components/ui/skeletons/RequestPasswordResetPageSkeleton.tsx";

export default function RequestPasswordResetPage() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await api.get("is-authenticated");
                navigate("/");
            } catch {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <BasePasswordReset data-testid="RequestPasswordResetPage">
            {isLoading ? (
                <RequestPasswordResetPageSkeleton />
            ) : (
                <>
                    <div>
                        <h2 className="text-center text-4xl font-bold text-gray-900 mb-3">
                            Reset your password
                        </h2>
                        <p className=" text-center text-lg text-gray-600 mb-8">
                            If we find your account, we will send you email message with
                            instructions
                        </p>
                    </div>
                    <RequestPasswordResetForm />
                    <GoBackButton route="/login" text="Go back to login" />
                </>
            )}
        </BasePasswordReset>
    );
}
