import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import BaseAuthentication from "@/components/ui/BaseAuthentication.tsx";
import AddUsernameForm from "@/pages/AddUsername/components/AddUsernameForm.tsx";
import React from "react";
import GoBackButtonVariant1 from "@/components/ui/GoBackButton.tsx";
import api from "@/lib/api.ts";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse.ts";
import { redirect } from "react-router-dom";

export async function loader(): Promise<Response | null> {
    try {
        await api.get("api/can-add-login");
        return null;
    } catch (err) {
        throwRouteErrorOnInvalidResponse(err);
        return redirect("/signup");
    }
}

export default function AddUsernamePage() {
    return (
        <BaseAuthentication image={signupPrimaryImage} data-testid="SignupPage">
            <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
                <h2 className="mb-3 text-4xl font-bold text-gray-900">Create Username</h2>
                <p className="mb-8 text-lg text-gray-600">This name will be visible to everybody</p>
                <AddUsernameForm />
                <GoBackButtonVariant1 route="/login" text="Go back to login" />
            </div>
        </BaseAuthentication>
    );
}
