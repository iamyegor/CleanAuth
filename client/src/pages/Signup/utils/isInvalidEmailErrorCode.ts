export default function isInvalidEmailErrorCode(errorCode: string): boolean {
    return (
        errorCode === "email.is.required" ||
        errorCode === "email.invalid.signature" ||
        errorCode === "email.too.long"
    );
}
