export default interface LoginError {
    problematicField: "loginOrEmail" | "password";
    errorMessage: string;
}
