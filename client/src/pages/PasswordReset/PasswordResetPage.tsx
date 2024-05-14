import api from "@/lib/api.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import { useLoaderData } from "react-router-dom";
import getQueryParam from "@/utils/getQueryParam.ts";
import BasePasswordReset from "@/components/ui/BasePasswordReset.tsx";
import React from "react";
import ResetPasswordLoaderData from "@/pages/PasswordReset/types/ResetPasswordLoaderData.ts";
import PasswordResetErrorMessage from "@/pages/PasswordReset/components/PasswordResetErrorMessage.tsx";
import PasswordResetForm from "@/pages/PasswordReset/components/PasswordResetForm.tsx";
import extractPasswordResetLoadingError from "@/pages/PasswordReset/utils/extractPasswordResetLoadingError.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { AxiosError } from "axios";

export async function loader({ request }: any): Promise<ErrorMessage | ResetPasswordLoaderData> {
    const token: string | null = getQueryParam(request.url, "token");
    const uid: string | null = getQueryParam(request.url, "uid");
    if (!token || !uid) {
        return ErrorMessage.create("Invalid link.");
    }

    try {
        await api.get(`api/need-to-reset-password?userId=${uid}&token=${token}`);
        return { userId: uid, token };
    } catch (err) {
        return extractPasswordResetLoadingError(err as AxiosError<ServerErrorResponse>);
    }
}

export default function PasswordResetPage() {
    const loaderData = useLoaderData() as ErrorMessage | ResetPasswordLoaderData;

    return (
        <BasePasswordReset>
            {loaderData instanceof ErrorMessage ? (
                <PasswordResetErrorMessage errorMessage={loaderData} />
            ) : (
                <div>
                    <div>
                        <h2 className="text-center text-4xl font-bold text-gray-900 mb-3">
                            Set your new password
                        </h2>
                        <p className="text-center text-lg text-gray-600 mb-8">
                            Please enter your new password below
                        </p>
                    </div>
                    <PasswordResetForm />
                </div>
            )}
        </BasePasswordReset>
    );
}
