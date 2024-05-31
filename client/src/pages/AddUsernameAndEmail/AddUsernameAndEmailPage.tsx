import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import GoBackButtonVariant1 from "@/components/ui/GoBackButton.tsx";
import BaseAuthentication from "@/components/ui/BaseAuthentication.tsx";
import React from "react";
import AddUsernameAndEmailForm from "@/pages/AddUsernameAndEmail/components/AddUsernameAndEmailForm.tsx";
import { redirect } from "react-router-dom";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import api from "@/lib/api.ts";

export async function loader(): Promise<Response | null> {
    try {
        await api.get("api/can-add-login-and-email");
        return null;
    } catch (err) {
        throwRouteErrorOnInvalidResponse(err);
        return redirect("/signup");
    }
}

export default function AddUsernameAndEmailPage() {
    return (
        <BaseAuthentication image={signupPrimaryImage} data-testid="SignupPage">
            <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
                <h2 className="mb-3 text-4xl font-bold text-gray-900">
                    Add Your Username And Email
                </h2>
                <p className="mb-8 text-lg text-gray-600">
                    This information will be used to identify you
                </p>
                <AddUsernameAndEmailForm />
                <GoBackButtonVariant1 route="/login" text="Go back to login" />
            </div>
        </BaseAuthentication>
    );
}
