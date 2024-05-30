import { http, HttpResponse } from "msw";

const loginEndpoint = "*/api/login";

export const successGetUsernameHandler = http.get("*/api/username", async () =>
    HttpResponse.json("yegor", { status: 200 }),
);

export const successLoginHandler = http.post(loginEndpoint, async () =>
    HttpResponse.json({}, { status: 200 }),
);

export const failedLoginHandler = http.post(loginEndpoint, async () =>
    HttpResponse.json(
        { errorCode: "invalid.credentials", errorMessage: "Invalid login or password" },
        { status: 400 },
    ),
);
