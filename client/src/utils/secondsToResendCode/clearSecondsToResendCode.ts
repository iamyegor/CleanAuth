export default function clearSecondsToResendCode(): void {
    sessionStorage.removeItem("secondsToResendCode");
}
