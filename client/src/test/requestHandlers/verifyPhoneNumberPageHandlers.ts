import { http, HttpResponse } from "msw";

const phoneNumberForVerificationEndpoint = "*/phone-number-for-verification";

export const failPhoneNumberForVerificationHandler = http.get(
    phoneNumberForVerificationEndpoint,
    async () => HttpResponse.json({}, { status: 400 }),
);

export const successPhoneNumberForVerificationHandler = http.get(
    phoneNumberForVerificationEndpoint,
    async () => HttpResponse.json("123-456-7890", { status: 200 }),
);

export const successVerifyPhoneNumberHandler = http.post("*/verify-phone-number", async () =>
    HttpResponse.json({}, { status: 200 }),
);
