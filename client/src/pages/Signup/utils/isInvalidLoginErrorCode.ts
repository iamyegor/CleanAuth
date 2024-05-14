export default function isInvalidLoginErrorCode(errorCode: string): boolean {
    return (
        errorCode === "login.is.required" ||
        errorCode === "login.invalid.symbols" ||
        errorCode === "login.invalid.length"
    );
}
