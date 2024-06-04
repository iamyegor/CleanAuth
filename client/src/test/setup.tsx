import "@testing-library/jest-dom";

import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";

export const server = setupServer();

beforeAll(() => {
    // We need to mock the skeleton because it's not a good friend to the testing environment.
    mockSkeleton();

    if (server) {
        server.listen();
    }

    (global as any).google = {
        accounts: {
            id: {
                initialize: vi.fn(),
                renderButton: vi.fn(),
            },
        },
    };
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

function mockSkeleton() {
    vi.mock("react-loading-skeleton", () => {
        const OriginalModule = vi.importActual("react-loading-skeleton");
        return {
            __esModule: true,
            ...OriginalModule,
            default: () => <div data-testid="skeleton">Mocked Skeleton</div>,
        };
    });
}
