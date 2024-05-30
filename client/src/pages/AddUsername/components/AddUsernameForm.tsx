import Input from "@/components/ui/Input.tsx";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import api from "@/lib/api.ts";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import { AxiosError } from "axios";
import extractAddUsernameError from "@/pages/AddUsername/utils/extractAddUsernameError.ts";
import validateUsername from "@/pages/AddUsername/utils/validateUsername.ts";
import { Result } from "@/utils/result.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";

export async function action({ request }: any): Promise<ErrorMessage | Response> {
    const data = await request.formData();
    const username: string = data.get("username");

    const validationResult: Result = validateUsername(username);
    if (validationResult.isFailure) {
        return ErrorMessage.create(validationResult.errorMessage!);
    }

    try {
        await api.post("api/add-login", { login: data.get("username") });
        return redirect("/add-phone-number");
    } catch (err) {
        return extractAddUsernameError(err as AxiosError<ServerErrorResponse>);
    }
}

export default function AddUsernameForm() {
    const { state } = useNavigation();
    const errorMessage = useActionData() as ErrorMessage | null;

    return (
        <Form
            className={errorMessage ? "space-y-6" : "space-y-8"}
            method="post"
            data-testid="AddUsernameForm"
        >
            <Input
                type="text"
                name="username"
                placeholder="Username"
                isInvalid={errorMessage != null}
            />
            <ErrorMessageComponent errorMessage={errorMessage} />
            <SubmittingButton
                loading={state == "loading" || state == "submitting"}
                text="Submit username"
            />
        </Form>
    );
}
