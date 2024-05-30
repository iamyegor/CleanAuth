import React from "react";
import { NavLink, redirect } from "react-router-dom";
import api from "@/lib/api.ts";
import returnImage from "@/pages/RequestPasswordReset/images/return.png";
import Image from "@/components/ui/Image.tsx";
import BasePasswordReset from "@/components/ui/BasePasswordReset.tsx";
import RequestPasswordResetForm from "@/pages/RequestPasswordReset/components/RequestPasswordResetForm.tsx";
import GoBackButton from "@/components/ui/GoBackButton.tsx";

export async function loader(): Promise<Response | null> {
    try {
        await api.get("api/is-authenticated");
        return redirect("/");
    } catch {
        return null;
    }
}

export default function RequestPasswordResetPage() {
    return (
        <BasePasswordReset data-testid="RequestPasswordResetPage">
            <div>
                <h2 className="text-center text-4xl font-bold text-gray-900 mb-3">
                    Reset your password
                </h2>
                <p className=" text-center text-lg text-gray-600 mb-8">
                    If we find your account, we will send you email message with instructions
                </p>
            </div>
            <RequestPasswordResetForm />
            <GoBackButton route="/login" text="Go back to login" />
        </BasePasswordReset>
    );
}
