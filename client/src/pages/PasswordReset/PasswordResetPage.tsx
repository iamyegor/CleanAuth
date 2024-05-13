import api from "@/lib/api.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import { useLoaderData } from "react-router-dom";
import getQueryParam from "@/utils/getQueryParam.ts";
import BasePasswordResetPage from "@/pages/BasePasswordReset/BasePasswordResetPage.tsx";
import React from "react";
import ResetPasswordLoaderData from "@/pages/PasswordReset/types/ResetPasswordLoaderData.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import PasswordResetErrorMessage from "@/pages/PasswordReset/components/PasswordResetErrorMessage.tsx";
import PasswordResetForm from "@/pages/PasswordReset/components/PasswordResetForm.tsx";

export async function loader({ request }: any): Promise<ErrorMessage | ResetPasswordLoaderData> {
    const token: string | null = getQueryParam(request.url, "token");
    const uid: string | null = getQueryParam(request.url, "uid");
    if (!token || !uid) {
        return ErrorMessage.create("Invalid link.");
    }

    try {
        await api.head(`api/need-to-reset-password?userId=${uid}&token=${token}`);
        return { userId: uid, token };
    } catch (err) {
        const error = err as AxiosError<ServerErrorResponse>;

        if (error.response?.data) {
            const { errorCode } = error.response.data;
            if (errorCode === "restore.password.token.expired") {
                return ErrorMessage.create("The link has expired. Please request a new one.");
            } else {
                return ErrorMessage.create("Invalid link.");
            }
        }

        throw new Error("No response was received");
    }
}

export default function PasswordResetPage() {
    const loaderData = useLoaderData() as ErrorMessage | ResetPasswordLoaderData;

    return (
        <BasePasswordResetPage>
            {loaderData instanceof ErrorMessage ? (
                <PasswordResetErrorMessage errorMessage={loaderData.errorMessage} />
            ) : (
                <PasswordResetForm />
            )}
        </BasePasswordResetPage>
    );
}
