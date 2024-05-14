import BaseAuthentication from "@/components/ui/BaseAuthentication.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import AddPhoneNumberForm from "@/pages/AddPhoneNumber/components/AddPhoneNumberForm.tsx";
import "@/pages/AddPhoneNumber/styles/add-phone-number.css";
import api from "@/lib/api.ts";
import { redirect } from "react-router-dom";
import React from "react";

export async function loader(): Promise<Response | null> {
    try {
        await api.get("api/need-to-add-phone-number");
        return null;
    } catch (err) {
        return redirect("/signup");
    }
}

export default function AddPhoneNumberPage() {
    return (
        <BaseAuthentication image={signupPrimaryImage}>
            <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
                <h2 className="mb-3 text-4xl font-bold text-gray-900">Verify Your Phone Number</h2>
                <p className="mb-8 text-lg text-gray-600">
                    Please enter your phone number below, you'll receive a code
                </p>
                <AddPhoneNumberForm />
            </div>
        </BaseAuthentication>
    );
}
