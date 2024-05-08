export function getSignupData(form: any): SignupData {
    return {
        username: form.get("username"),
        email: form.get("email"),
        password: form.get("password"),
        repeatedPassword: form.get("repeatedPassword"),
    };
}
