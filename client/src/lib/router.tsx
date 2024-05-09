import { createBrowserRouter } from "react-router-dom";
import WelcomePage, { loader as welcomePageLoader } from "@/pages/Welcome/WelcomePage.tsx";
import LoginPage, { loader as loginLoader } from "@/pages/Login/LoginPage.tsx";
import { action as loginAction } from "@/pages/Login/components/LoginForm.tsx";
import { action as signupAction } from "@/pages/Signup/components/SignupForm.tsx";
import VerifyEmailPage, {
    action as verifyEmailAction,
    loader as verifyEmailLoader,
} from "@/pages/VerifyEmail/VerifyEmailPage.tsx";
import SignupPage from "@/pages/Signup/SignupPage.tsx";
import AddPhoneNumberPage, {
    loader as addPhoneNumberLoader,
} from "@/pages/AddPhoneNumber/AddPhoneNumberPage.tsx";
import { action as addPhoneNumberAction } from "@/pages/AddPhoneNumber/components/AddPhoneNumberForm.tsx";
import VerifyPhoneNumberPage, {
    action as verifyPhoneNumberAction,
} from "@/pages/VerifyPhoneNumber/VerifyPhoneNumberPage.tsx";

const router = createBrowserRouter([
    { path: "/", element: <WelcomePage />, loader: welcomePageLoader },
    {
        path: "/login",
        element: <LoginPage />,
        action: loginAction,
        loader: loginLoader,
    },
    { path: "/signup", element: <SignupPage />, action: signupAction },
    {
        path: "/verify-email",
        element: <VerifyEmailPage />,
        loader: verifyEmailLoader,
        action: verifyEmailAction,
    },
    {
        path: "/add-phone-number",
        element: <AddPhoneNumberPage />,
        action: addPhoneNumberAction,
        loader: addPhoneNumberLoader,
    },
    {
        path: "/verify-phone-number",
        element: <VerifyPhoneNumberPage />,
        action: verifyPhoneNumberAction,
    },
]);

export default router;
