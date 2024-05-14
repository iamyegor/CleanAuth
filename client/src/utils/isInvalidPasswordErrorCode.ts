export default function isInvalidPasswordErrorCode(errorCode: string): boolean {
    return (
        errorCode === "password.is.required" ||
        errorCode === "password.invalid.signature" ||
        errorCode === "password.invalid.length"
    );
}
