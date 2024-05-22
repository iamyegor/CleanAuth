import { getSignupData } from "@/pages/Signup/utils/getSignupData";

const createForm = (fields: Record<string, string | undefined>) => ({
    get: (field: string) => fields[field],
});

describe("getSignupData", () => {
    test("1. Returns correct signup data from form", () => {
        const form = createForm({
            username: "testuser",
            email: "test@example.com",
            password: "testPassword",
            repeatedPassword: "testPassword",
        });

        const result = getSignupData(form);

        expect(result).toEqual({
            username: "testuser",
            email: "test@example.com",
            password: "testPassword",
            repeatedPassword: "testPassword",
        });
    });
});
