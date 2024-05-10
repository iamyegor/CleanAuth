export default function getStoredResendTimer(): number | null {
    const seconds: string | null = sessionStorage.getItem("secondsToResendCode");
    return seconds ? parseInt(seconds) : null;
}
