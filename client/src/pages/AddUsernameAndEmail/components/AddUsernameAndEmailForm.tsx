import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import Input from "@/components/ui/Input.tsx";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import validateUsernameAndEmail from "@/pages/AddUsernameAndEmail/utils/validateUsernameAndEmail.ts";
import { ResultOr } from "@/utils/resultOfT.ts";
import FieldError from "@/utils/FieldError.ts";
import getFieldErrorMessage from "@/utils/getFieldErrorMessage.ts";
import extractAddUsernameAndEmailError from "@/pages/AddUsernameAndEmail/utils/extractAddUsernameAndEmailError.ts";

export async function action({ request }: any): Promise<FieldError | Response> {
    const data = await request.formData();
    const username: string = data.get("username");
    const email: string = data.get("email");

    const validationResult: ResultOr<FieldError> = validateUsernameAndEmail(username, email);

    if (validationResult.isFailure) {
        return validationResult.error!;
    }

    try {
        await api.post("api/add-login-and-email", {
            login: data.get("username"),
            email: data.get("email"),
        });

        return redirect("/verify-email");
    } catch (err) {
        return extractAddUsernameAndEmailError(err as AxiosError<ServerErrorResponse>);
    }
}

export default function AddUsernameAndEmailForm() {
    const fieldError = useActionData() as FieldError | null;
    const { state } = useNavigation();

    const usernameError = fieldError?.isField("username");
    const emailError = fieldError?.isField("email");

    return (
        <Form method="post" data-testid="AddUsernameAndEmailForm">
            <div className={`space-y-4 ${emailError ? "mb-6" : "mb-8"}`}>
                <div className={usernameError ? "space-y-6 mb-2" : ""}>
                    <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        isInvalid={usernameError}
                    />
                    <ErrorMessageComponent
                        errorMessage={getFieldErrorMessage("username", fieldError)}
                    />
                </div>
                <div className={emailError ? "space-y-6" : ""}>
                    <Input type="text" name="email" placeholder="Email" isInvalid={emailError} />
                    <ErrorMessageComponent
                        errorMessage={getFieldErrorMessage("email", fieldError)}
                    />
                </div>
            </div>
            <SubmittingButton loading={state == "loading" || state == "submitting"} text="Submit" />
        </Form>
    );
}
