import BaseLoginPage from "@/pages/BaseLogin/BaseLoginPage.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";
import AddPhoneNumberForm from "@/pages/AddPhoneNumber/components/AddPhoneNumberForm.tsx";
import "@/pages/AddPhoneNumber/add-phone-number.css";
import api from "@/lib/api.ts";
import { redirect } from "react-router-dom";

export async function loader(): Promise<Response | null> {
    try {
        await api.head("api/get-unverified-phone-number");
        return null;
    } catch (err) {
        return redirect("/signup");
    }
}

export default function AddPhoneNumberPage() {
    return (
        <BaseLoginPage image={signupPrimaryImage}>
            <AddPhoneNumberForm />
        </BaseLoginPage>
    );
}
