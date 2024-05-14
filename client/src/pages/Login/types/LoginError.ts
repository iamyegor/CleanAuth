export default interface LoginError {
    problematicField: "loginOrEmail" | "password" | "both";
    errorMessage: string;
}
