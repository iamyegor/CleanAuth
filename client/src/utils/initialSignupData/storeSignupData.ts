export default function storeSignupData(initialSignupData: SignupData): void {
    sessionStorage.setItem("signupData", JSON.stringify(initialSignupData));
}
