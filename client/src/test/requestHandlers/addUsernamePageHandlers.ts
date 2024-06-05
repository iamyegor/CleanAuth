import {http, HttpResponse} from "msw";

const canAddLoginEndpoint = "*/can-add-login";
const addLoginEndpoint = "*/add-login";

export const failCanAddLoginHandler = http.get(canAddLoginEndpoint, async () =>
    HttpResponse.json({}, { status: 400 }),
);

export const successCanAddLoginHandler = http.get(canAddLoginEndpoint, async () =>
    HttpResponse.json({}, { status: 200 }),
);

export const successAddLoginHandler = http.post(addLoginEndpoint, async () =>
    HttpResponse.json({}, { status: 200 }),
);

