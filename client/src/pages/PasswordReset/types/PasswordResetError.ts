import ErrorMessage from "@/utils/ErrorMessage.ts";

export default interface PasswordResetError {
    field: "password" | "confirmPassword";
    errorMessage: ErrorMessage;
}
