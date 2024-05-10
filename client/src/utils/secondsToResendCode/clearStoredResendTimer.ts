export default function clearStoredResendTimer(): void {
    sessionStorage.removeItem("secondsToResendCode");
}
