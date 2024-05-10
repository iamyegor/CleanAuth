export default function storeSecondsToResendCode(seconds: number): void {
    sessionStorage.setItem("secondsToResendCode", seconds.toString());
}
