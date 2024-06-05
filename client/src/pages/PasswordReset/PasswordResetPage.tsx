import api from "@/lib/api.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import getQueryParam from "@/utils/getQueryParam.ts";
import BasePasswordReset from "@/components/ui/basePages/BasePasswordReset.tsx";
import React, { useEffect, useState } from "react";
import PasswordResetError from "@/pages/PasswordReset/components/PasswordResetError.tsx";
import PasswordResetForm from "@/pages/PasswordReset/components/PasswordResetForm.tsx";
import extractPasswordResetLoadingError from "@/pages/PasswordReset/utils/extractPasswordResetLoadingError.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { AxiosError } from "axios";
import PasswordResetPageSkeleton from "@/components/ui/skeletons/PasswordResetPageSkeleton.tsx";
import useThrownError from "@/hooks/useThrownError.ts";

export default function PasswordResetPage() {
    const [isLoading, setIsLoading] = useState(true);
    const { setThrownError } = useThrownError();
    const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);

    useEffect(() => {
        canResetPassword()
            .then((errorMessage) => {
                if (errorMessage) {
                    setErrorMessage(errorMessage);
                }

                setIsLoading(false);
            })
            .catch((error) => setThrownError(error));

        async function canResetPassword() {
            const token: string | null = getQueryParam(window.location.href, "token");
            const uid: string | null = getQueryParam(window.location.href, "uid");
            if (!token || !uid) {
                return ErrorMessage.create("Invalid link.");
            }

            try {
                await api.get(`need-to-reset-password?userId=${uid}&token=${token}`);
            } catch (err) {
                return extractPasswordResetLoadingError(err as AxiosError<ServerErrorResponse>);
            }
        }
    }, []);

    if (isLoading) {
        return (
            <BasePasswordReset>
                <PasswordResetPageSkeleton />
            </BasePasswordReset>
        );
    }

    if (errorMessage) {
        return (
            <BasePasswordReset>
                <PasswordResetError errorMessage={errorMessage} />
            </BasePasswordReset>
        );
    }

    return (
        <BasePasswordReset>
            <>
                <div>
                    <h2 className="text-center text-4xl font-bold text-gray-900 mb-3">
                        Set your new password
                    </h2>
                    <p className="text-center text-lg text-gray-600 mb-8">
                        Please enter your new password below
                    </p>
                </div>
                <PasswordResetForm />
            </>
        </BasePasswordReset>
    );
}
