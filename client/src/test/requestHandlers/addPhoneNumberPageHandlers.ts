import { http, HttpResponse } from "msw";

const needToAddPhoneNumberEndpoint = "*/need-to-add-phone-number";
const addPhoneNumberEndpoint = "*/add-phone-number";

export const successNeedToAddPhoneNumberHandler = http.get(needToAddPhoneNumberEndpoint, async () =>
    HttpResponse.json({}, { status: 200 }),
);

export const failNeedToAddPhoneNumberHandler = http.get(needToAddPhoneNumberEndpoint, async () =>
    HttpResponse.json({}, { status: 400 }),
);

export const successAddPhoneNumberHandler = http.post(addPhoneNumberEndpoint, async () => {
    return HttpResponse.json({}, { status: 200 });
});

export const successGetPhoneNumberForVerificationHandler = http.get(
    "*/phone-number-for-verification",
    async () => HttpResponse.json("1234567890", { status: 200 }),
);

export const failAddPhoneNumberHandler = http.post(addPhoneNumberEndpoint, async () => {
    return HttpResponse.json(
        {
            errorCode: "phone.number.already.taken",
            errorMessage: "Error message that isn't used anyway",
        },
        { status: 400 },
    );
});
