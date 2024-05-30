export default interface GoogleSignInResponse {
    status: "completely_authenticated" | "needs_phone_number_verification" | "needs_username";
}
