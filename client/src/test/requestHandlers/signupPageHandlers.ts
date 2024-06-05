import { http, HttpResponse } from "msw";

export const successSignupHandler = http.post("*/signup", async () =>
    HttpResponse.json({}, { status: 200 }),
);

export const failedSignupHandler = http.post(`*/signup`, async () =>
    HttpResponse.json(
        { errorCode: "email.already.taken", errorMessage: "Email already taken" },
        { status: 400 },
    ),
);
