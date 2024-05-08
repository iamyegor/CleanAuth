import SignupForm from "@/pages/SignupPage/components/SignupForm.tsx";
import BaseLoginPage from "@/pages/BaseLoginPage/BaseLoginPage.tsx";
import signupPrimaryImage from "@/pages/SignupPage/images/signup_image.jpg";

export default function SignupPage() {
    return (
        <BaseLoginPage image={signupPrimaryImage}>
            <SignupForm />
        </BaseLoginPage>
    );
}
