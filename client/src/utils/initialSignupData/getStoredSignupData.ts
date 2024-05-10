export default function getStoredSignupData(): SignupData | null {
    const storedSignupData = sessionStorage.getItem("signupData");

    if (storedSignupData) {
        return JSON.parse(storedSignupData);
    }

    return null;
}
