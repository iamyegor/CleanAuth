import { test, describe, expect } from "vitest";
import throwRouteErrorOnInvalidResponse from "@/utils/throwRouteErrorOnInvalidResponse";
import { RouteError } from "@/types/RouteError";

const createMockError = (response: any) => ({
    response,
});

describe("throwRouteErrorOnInvalidResponse", () => {
    test("1. Throws unexpected error for no response", () => {
        const error = createMockError(null);

        expect(() => throwRouteErrorOnInvalidResponse(error)).toThrow(RouteError.unexpected());
    });

    test("2. Throws unexpected error for missing data in response", () => {
        const error = createMockError({ status: 200 });

        expect(() => throwRouteErrorOnInvalidResponse(error)).toThrow(RouteError.unexpected());
    });

    test("3. Throws server error for 500 status code", () => {
        const error = createMockError({ status: 500, data: {} });

        expect(() => throwRouteErrorOnInvalidResponse(error)).toThrow(RouteError.serverError());
    });
});
