interface SignupError {
    problematicField: "username" | "email" | "password" | "repeatedPassword";
    errorMessage: string;
}
