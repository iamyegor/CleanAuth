import { http, HttpResponse } from "msw";

const needToResetPasswordEndpoint = "*/need-to-reset-password";

export const failNeedToResetPasswordHandler = http.get(needToResetPasswordEndpoint, async () =>
    HttpResponse.json(
        {
            errorCode: "password.reset.token.invalid",
            errorMessage: "Message from the server that will be overwritten",
        },
        { status: 400 },
    ),
);

export const successNeedToResetPasswordHandler = http.get(needToResetPasswordEndpoint, async () =>
    HttpResponse.json({}, { status: 200 }),
);

export const successResetPasswordHandler = http.post(`*/reset-password`, async () =>
    HttpResponse.json(),
);

export const failedPasswordResetHandler = http.post(`*/reset-password`, async () =>
    HttpResponse.json(
        { errorCode: "password.same.as.current", errorMessage: "Password same as current" },
        { status: 400 },
    ),
);
