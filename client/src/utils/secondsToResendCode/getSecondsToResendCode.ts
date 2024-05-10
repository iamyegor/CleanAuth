export default function getSecondsToResendCode(): number | null {
    const seconds: string | null = sessionStorage.getItem("secondsToResendCode");
    return seconds ? parseInt(seconds) : null;
}
