import SignupForm from "@/pages/Signup/components/SignupForm.tsx";
import BaseLoginPage from "@/pages/BaseLogin/BaseLoginPage.tsx";
import signupPrimaryImage from "@/pages/Signup/images/signup_image.jpg";

export default function SignupPage() {
    return (
        <BaseLoginPage image={signupPrimaryImage}>
            <SignupForm />
        </BaseLoginPage>
    );
}
