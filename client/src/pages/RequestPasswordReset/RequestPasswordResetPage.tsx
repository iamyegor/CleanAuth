import React from "react";
import { Form, NavLink, redirect, useActionData, useNavigation } from "react-router-dom";
import getServerErrorMessageOrThrow from "@/utils/getServerErrorMessageOrThrow.ts";
import api from "@/lib/api.ts";
import DisplayedMessage from "@/DisplayedMessage.ts";
import SuccessOrErrorMessage from "@/components/ui/SuccessOrErrorMessage.tsx";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import InputField from "@/components/Inputs/InputField.tsx";
import returnImage from "@/pages/RequestPasswordReset/images/return.png";
import Image from "@/components/ui/Image.tsx";
import BasePasswordResetPage from "@/pages/BasePasswordReset/BasePasswordResetPage.tsx";

export async function loader(): Promise<Response | null> {
    try {
        await api.get("api/is-authenticated");
        return redirect("/");
    } catch {
        return null;
    }
}

export async function action({ request }: any): Promise<DisplayedMessage> {
    const data = await request.formData();

    const emailOrUsername = data.get("emailOrUsername");
    if (!emailOrUsername) {
        return DisplayedMessage.createError("The field must not be empty");
    }

    try {
        await api.post("api/request-password-reset", { emailOrUsername });
        return DisplayedMessage.createSuccess("Password reset link sent successfully.");
    } catch (err) {
        return DisplayedMessage.createError(getServerErrorMessageOrThrow(err));
    }
}

export default function RequestPasswordResetPage() {
    const { state } = useNavigation();
    console.log({ state });
    const displayedMessage = useActionData() as DisplayedMessage | null;

    return (
        <BasePasswordResetPage>
            <div>
                <h2 className="text-center text-4xl font-bold text-gray-900 mb-3">
                    Reset your password
                </h2>
                <p className=" text-center text-lg text-gray-600 mb-8">
                    If we find your account, we will send you email message with instructions
                </p>
            </div>
            <Form
                method="post"
                action={"/request-password-reset"}
                className={displayedMessage ? "space-y-6" : "space-y-8"}
            >
                <InputField
                    type="text"
                    name="emailOrUsername"
                    placeholder="Enter email or username"
                />
                {displayedMessage && (
                    <div className="w-full flex justify-start">
                        <SuccessOrErrorMessage message={displayedMessage} />
                    </div>
                )}
                <SubmittingButton
                    loading={state === "loading" || state === "submitting"}
                    text="Request password reset"
                />
            </Form>
            <div className="flex justify-center mt-8">
                <NavLink
                    to={"/login"}
                    className="flex items-center space-x-1 
                        hover:underline"
                >
                    <Image src={returnImage} alt="Return" className="w-5 h-5 mx-auto" />
                    <span>Go back to login</span>
                </NavLink>
            </div>
        </BasePasswordResetPage>
    );
}
