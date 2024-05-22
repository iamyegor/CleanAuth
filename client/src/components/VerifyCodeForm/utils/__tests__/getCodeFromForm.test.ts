import { test, describe, expect } from "vitest";
import getCodeFromForm from "@/components/VerifyCodeForm/utils/getCodeFromForm.ts";
import { RouteError } from "@/types/RouteError.ts";

function createMockRequest(formData: Record<string, string>) {
    return {
        formData: async () => {
            const form = new FormData();
            for (const key in formData) {
                form.append(key, formData[key]);
            }
            return form;
        },
    };
}

describe("getCodeFromForm", () => {
    test("1. Returns concatenated code from form inputs", async () => {
        const mockRequest = createMockRequest({
            "code-0": "6",
            "code-1": "2",
            "code-2": "4",
            "code-3": "9",
        });

        const code = await getCodeFromForm(mockRequest, 4);

        expect(code).toBe("6249");
    });

});
