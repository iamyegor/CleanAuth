import "@testing-library/jest-dom";

import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";

export const server = setupServer();

beforeAll(() => {
    if (server) {
        server.listen();
    }
});

afterEach(() => {
    cleanup();
    if (server) {
        server.resetHandlers();
    }
});

afterAll(() => {
    if (server) {
        server.close();
    }
});
