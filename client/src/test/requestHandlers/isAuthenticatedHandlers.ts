import { http, HttpResponse } from "msw";

const isAuthenticatedEndpoint = "*/is-authenticated";

export const successIsAuthenticatedHandler = http.get(isAuthenticatedEndpoint, async () =>
    HttpResponse.json({}, { status: 200 }),
);

export const failIsAuthenticatedHandler = http.get(isAuthenticatedEndpoint, async () =>
    HttpResponse.json({}, { status: 400 }),
);
