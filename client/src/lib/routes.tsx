import RootLayout from "@/components/ui/RootLayout.tsx";
import HomePage, { loader as homePageLoader } from "@/pages/Home/HomePage.tsx";
import LoginPage from "@/pages/Login/LoginPage.tsx";
import { action as loginAction } from "@/pages/Login/components/LoginForm.tsx";
import { action as signupAction } from "@/pages/Signup/components/SignupForm.tsx";
import VerifyEmailPage, {
    action as verifyEmailAction,
} from "@/pages/VerifyEmail/VerifyEmailPage.tsx";
import SignupPage from "@/pages/Signup/SignupPage.tsx";
import AddPhoneNumberPage from "@/pages/AddPhoneNumber/AddPhoneNumberPage.tsx";
import { action as addPhoneNumberAction } from "@/pages/AddPhoneNumber/components/AddPhoneNumberForm.tsx";
import VerifyPhoneNumberPage, {
    action as verifyPhoneNumberAction,
} from "@/pages/VerifyPhoneNumber/VerifyPhoneNumberPage.tsx";
import PasswordResetPage from "@/pages/PasswordReset/PasswordResetPage.tsx";
import RequestPasswordResetPage from "@/pages/RequestPasswordReset/RequestPasswordResetPage.tsx";
import { action as requestPasswordResetAction } from "@/pages/RequestPasswordReset/components/RequestPasswordResetForm.tsx";
import { action as resetPasswordAction } from "@/pages/PasswordReset/components/PasswordResetForm.tsx";
import AddUsernamePage from "@/pages/AddUsername/AddUsernamePage.tsx";
import { action as addUsernameAction } from "@/pages/AddUsername/components/AddUsernameForm.tsx";
import VkAuthRedirectPage from "@/pages/VkAuthRedirect/VkAuthRedirectPage.tsx";
import AddUsernameAndEmailPage from "@/pages/AddUsernameAndEmail/AddUsernameAndEmailPage.tsx";
import { action as addUsernameAndEmailAction } from "@/pages/AddUsernameAndEmail/components/AddUsernameAndEmailForm.tsx";
import ErrorPage from "@/pages/ErrorPage/ErrorPage.tsx";
import OdnoklassnikiAuthRedirectPage from "@/pages/OdnoklassnikiAuthRedirect/OdnoklassnikiAuthRedirectPage.tsx";
import PasswordResetPageSkeleton from "@/components/ui/skeletons/PasswordResetPageSkeleton.tsx";

const routes = [
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
                loader: homePageLoader,
            },
            {
                path: "login",
                element: <LoginPage />,
                action: loginAction,
            },
            {
                path: "signup",
                element: <SignupPage />,
                action: signupAction,
            },
            {
                path: "verify-email",
                element: <VerifyEmailPage />,
                action: verifyEmailAction,
            },
            {
                path: "add-phone-number",
                element: <AddPhoneNumberPage />,
                action: addPhoneNumberAction,
            },
            {
                path: "verify-phone-number",
                element: <VerifyPhoneNumberPage />,
                action: verifyPhoneNumberAction,
            },
            {
                path: "request-password-reset",
                element: <RequestPasswordResetPage />,
                action: requestPasswordResetAction,
            },
            {
                path: "reset-password",
                element: <PasswordResetPage />,
                action: resetPasswordAction,
            },
            {
                path: "add-username",
                element: <AddUsernamePage />,
                action: addUsernameAction,
            },
            {
                path: "vk-auth-redirect",
                element: <VkAuthRedirectPage />,
            },
            {
                path: "add-username-and-email",
                element: <AddUsernameAndEmailPage />,
                action: addUsernameAndEmailAction,
            },
            {
                path: "odnoklassniki-auth-redirect",
                element: <OdnoklassnikiAuthRedirectPage />,
            },
            {
                path: "skeleton-test",
                element: <PasswordResetPageSkeleton />,
            },
        ],
    },
];

export default routes;
