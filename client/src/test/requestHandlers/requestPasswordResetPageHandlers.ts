import { http, HttpResponse } from "msw";

export const failedRequestPasswordResetHandler = http.post(
    `*/request-password-reset`,
    async () =>
        HttpResponse.json(
            {
                errorCode: "user.not.exists.with.login.or.email",
                errorMessage: "User with this login or email does not exist.",
            },
            { status: 400 },
        ),
);

export const successRequestPasswordResetHandler = http.post(
    `*/request-password-reset`,
    async () => new HttpResponse(),
);
