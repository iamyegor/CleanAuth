import { http, HttpResponse } from "msw";

const emailForVerificationEndpoint = "*/email-for-verification";

export const failEmailForVerificationHandler = http.get(emailForVerificationEndpoint, async () =>
    HttpResponse.json({}, { status: 400 }),
);

export const successEmailForVerificationHandler = http.get(emailForVerificationEndpoint, async () =>
    HttpResponse.json("test@example.com", { status: 200 }),
);

export const successVerifyEmailHandler = http.post("*/verify-email", async () =>
    HttpResponse.json({}, { status: 200 }),
);
