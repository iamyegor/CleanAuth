import RootLayout from "@/components/ui/RootLayout.tsx";
import HomePage, { loader as homePageLoader } from "@/pages/Home/HomePage.tsx";
import LoginPage, { loader as loginLoader } from "@/pages/Login/LoginPage.tsx";
import { action as loginAction } from "@/pages/Login/components/LoginForm.tsx";
import { action as signupAction } from "@/pages/Signup/components/SignupForm.tsx";
import VerifyEmailPage, {
    action as verifyEmailAction,
    loader as verifyEmailLoader,
} from "@/pages/VerifyEmail/VerifyEmailPage.tsx";
import SignupPage, { loader as signupPageLoader } from "@/pages/Signup/SignupPage.tsx";
import AddPhoneNumberPage, {
    loader as addPhoneNumberLoader,
} from "@/pages/AddPhoneNumber/AddPhoneNumberPage.tsx";
import { action as addPhoneNumberAction } from "@/pages/AddPhoneNumber/components/AddPhoneNumberForm.tsx";
import VerifyPhoneNumberPage, {
    action as verifyPhoneNumberAction,
    loader as verifyPhoneNumberLoader,
} from "@/pages/VerifyPhoneNumber/VerifyPhoneNumberPage.tsx";
import PasswordResetPage, {
    loader as resetPasswordLoader,
} from "@/pages/PasswordReset/PasswordResetPage.tsx";
import RequestPasswordResetPage, {
    loader as requestPasswordResetLoader,
} from "@/pages/RequestPasswordReset/RequestPasswordResetPage.tsx";
import { action as requestPasswordResetAction } from "@/pages/RequestPasswordReset/components/RequestPasswordResetForm.tsx";
import { action as resetPasswordAction } from "@/pages/PasswordReset/components/PasswordResetForm.tsx";
import AddUsernamePage, {
    loader as addUsernameLoader,
} from "@/pages/AddUsername/AddUsernamePage.tsx";
import { action as addUsernameAction } from "@/pages/AddUsername/components/AddUsernameForm.tsx";
import VkAuthRedirectPage, {
    loader as vkAuthRedirectLoader,
} from "@/pages/VkAuthRedirect/VkAuthRedirectPage.tsx";
import AddUsernameAndEmailPage, {
    loader as addUsernameAndEmailLoader,
} from "@/pages/AddUsernameAndEmail/AddUsernameAndEmailPage.tsx";
import { action as addUsernameAndEmailAction } from "@/pages/AddUsernameAndEmail/components/AddUsernameAndEmailForm.tsx";
import ErrorPage from "@/pages/ErrorPage/ErrorPage.tsx";
import OdnoklassnikiAuthRedirectPage, {
    loader as odnoklassnikiAuthRedirectLoader,
} from "@/pages/OdnoklassnikiAuthRedirect/OdnoklassnikiAuthRedirectPage.tsx";

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
                loader: loginLoader,
            },
            {
                path: "signup",
                element: <SignupPage />,
                action: signupAction,
                loader: signupPageLoader,
            },
            {
                path: "verify-email",
                element: <VerifyEmailPage />,
                loader: verifyEmailLoader,
                action: verifyEmailAction,
            },
            {
                path: "add-phone-number",
                element: <AddPhoneNumberPage />,
                action: addPhoneNumberAction,
                loader: addPhoneNumberLoader,
            },
            {
                path: "verify-phone-number",
                element: <VerifyPhoneNumberPage />,
                action: verifyPhoneNumberAction,
                loader: verifyPhoneNumberLoader,
            },
            {
                path: "request-password-reset",
                element: <RequestPasswordResetPage />,
                action: requestPasswordResetAction,
                loader: requestPasswordResetLoader,
            },
            {
                path: "reset-password",
                element: <PasswordResetPage />,
                loader: resetPasswordLoader,
                action: resetPasswordAction,
            },
            {
                path: "add-username",
                element: <AddUsernamePage />,
                loader: addUsernameLoader,
                action: addUsernameAction,
            },
            {
                path: "vk-auth-redirect",
                element: <VkAuthRedirectPage />,
                loader: vkAuthRedirectLoader,
            },
            {
                path: "add-username-and-email",
                element: <AddUsernameAndEmailPage />,
                loader: addUsernameAndEmailLoader,
                action: addUsernameAndEmailAction,
            },
            {
                path: "odnoklassniki-auth-redirect",
                element: <OdnoklassnikiAuthRedirectPage />,
                loader: odnoklassnikiAuthRedirectLoader,
            },
        ],
    },
];

export default routes;
