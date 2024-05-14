import React from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import InputField from "@/components/ui/InputField.tsx";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import FeedbackMessageComponent from "@/components/ui/FeedbackMessageComponent.tsx";
import FeedbackMessage from "@/utils/FeedbackMessage.ts";
import api from "@/lib/api.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { AxiosError } from "axios";
import extractRequestPasswordResetError from "@/pages/RequestPasswordReset/utils/extractRequestPasswordResetError.ts";

export async function action({ request }: any): Promise<FeedbackMessage> {
    const data = await request.formData();

    const emailOrUsername = data.get("emailOrUsername");
    if (!emailOrUsername) {
        return FeedbackMessage.createError("The field must not be empty");
    }

    try {
        await api.post("api/request-password-reset", { emailOrUsername });
        return FeedbackMessage.createSuccess("Password reset link sent successfully.");
    } catch (err) {
        return extractRequestPasswordResetError(err as AxiosError<ServerErrorResponse>);
    }
}

export default function RequestPasswordResetForm() {
    const { state } = useNavigation();
    const feedbackMessage = useActionData() as FeedbackMessage | null;

    return (
        <Form
            method="post"
            action={"/request-password-reset"}
            className={feedbackMessage ? "space-y-6" : "space-y-8"}
        >
            <InputField type="text" name="emailOrUsername" placeholder="Enter email or username" />
            <FeedbackMessageComponent feedback={feedbackMessage} />
            <SubmittingButton
                loading={state === "loading" || state === "submitting"}
                text="Request password reset"
            />
        </Form>
    );
}
