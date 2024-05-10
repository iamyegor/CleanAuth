export default function storeResendTimer(seconds: number): void {
    sessionStorage.setItem("secondsToResendCode", seconds.toString());
}
