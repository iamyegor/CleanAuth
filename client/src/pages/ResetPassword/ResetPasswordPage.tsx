import api from "@/lib/api.ts";
import getServerErrorMessageOrThrow from "@/utils/getServerErrorMessageOrThrow.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import { useLoaderData } from "react-router-dom";
import BaseLoginPage from "@/pages/BaseLogin/BaseLoginPage.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";

export async function loader({ params }: any): Promise<ErrorMessage | null> {
    try {
        await api.get(`api/need-to-reset-password/${params.token}`);
        return null;
    } catch (err) {
        return ErrorMessage.create(getServerErrorMessageOrThrow(err));
    }
}

export default function ResetPasswordPage() {
    const errorMessage = useLoaderData() as ErrorMessage | null;
    console.log(errorMessage);

    return (
        <div>
            <BaseLoginPage image={signupPrimaryImage}>
                <div>Reset password</div>
            </BaseLoginPage>
        </div>
    );
}
