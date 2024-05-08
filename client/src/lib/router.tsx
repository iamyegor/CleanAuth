import { createBrowserRouter } from "react-router-dom";
import WelcomePage, { loader as welcomePageLoader } from "@/pages/WelcomePage/WelcomePage.tsx";
import LoginPage, { loader as loginLoader } from "@/pages/LoginPage/LoginPage.tsx";
import { action as loginAction } from "@/pages/LoginPage/components/LoginForm.tsx";
import { action as signupAction } from "@/pages/SignupPage/components/SignupForm.tsx";
import { loader as emailVerificationLoader } from "@/pages/EmailVerificationPage/EmailVerificationPage.tsx";
import { action as emailVerificationAction } from "@/pages/EmailVerificationPage/components/EmailVerificationForm.tsx";
import SignupPage from "@/pages/SignupPage/SignupPage.tsx";
import EmailVerificationPage from "@/pages/EmailVerificationPage/EmailVerificationPage.tsx";

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
        element: <EmailVerificationPage />,
        loader: emailVerificationLoader,
        action: emailVerificationAction,
    },
]);

export default router;
