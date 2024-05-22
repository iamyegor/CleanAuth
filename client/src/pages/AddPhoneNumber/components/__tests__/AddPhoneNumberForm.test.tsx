import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import AddPhoneNumberForm, {
    action,
} from "@/pages/AddPhoneNumber/components/AddPhoneNumberForm.tsx";
import { server } from "@/test/setup.ts";
import { http, HttpResponse } from "msw";
import getStoredPhoneNumber from "@/utils/phoneNumberData/getStoredPhoneNumber.ts";
import getStoredCountryCodeIndex from "@/utils/phoneNumberData/getStoredCountryCodeIndex.ts";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import countries from "@/pages/AddPhoneNumber/data/countries.ts";

const successAddPhoneNumberHandler = http.post("*/api/add-phone-number", async () => {
    return HttpResponse.json({
        errorCode: "invalid.phone.number",
        errorMessage: "Phone number is invalid.",
    });
});

const failAddPhoneNumberHandler = http.post("*/api/add-phone-number", async () => {
    return HttpResponse.json(
        {
            errorCode: "phone.number.already.taken",
            errorMessage: "Error message that isn't used anyway",
        },
        { status: 400 },
    );
});

const AddPhoneNumberFormDefault = () => {
    const router = createMemoryRouter([
        { path: "*", element: <AddPhoneNumberForm />, action: action },
        {
            path: "verify-phone-number",
            element: <div data-testid="VerifyPhoneNumberPage">Mock verify phone number page</div>,
        },
    ]);
    return <RouterProvider router={router} />;
};

const addPhoneNumberForm = {
    get form() {
        return screen.getByTestId("AddPhoneNumberForm");
    },
    get phoneInput() {
        return screen.getByTestId("PhoneInput.Input");
    },
    get errorMessage() {
        return screen.queryByTestId("ErrorMessageComponent.Message");
    },
    get submittingButton() {
        return screen.getByTestId("SubmittingButton");
    },
    countryCodeElements: {
        get button() {
            return screen.getByTestId("CountryCodeButton.Button");
        },
        get flag() {
            return screen.getByTestId("CountryCodeButton.Flag");
        },
        get dialCode() {
            return screen.getByTestId("CountryCodeButton.DialCode");
        },
    },
    get countryOptions() {
        return screen.getAllByTestId("CountryDropdownOption");
    },
};

describe("<AddPhoneNumberForm />", () => {
    test("1. Correctly changes country", async () => {
        render(<AddPhoneNumberFormDefault />);

        await userEvent.click(addPhoneNumberForm.countryCodeElements.button);
        await userEvent.click(addPhoneNumberForm.countryOptions[1]);

        expect(addPhoneNumberForm.countryCodeElements.flag).toHaveTextContent(countries[1].flag);
        expect(addPhoneNumberForm.countryCodeElements.dialCode).toHaveTextContent(
            countries[1].dialCode,
        );
    });

    test("2. Disables submit button when phone number is invalid", async () => {
        render(<AddPhoneNumberFormDefault />);

        await userEvent.type(addPhoneNumberForm.phoneInput, "123");
        await userEvent.click(addPhoneNumberForm.submittingButton);

        expect(addPhoneNumberForm.submittingButton).toBeDisabled();
    });

    test("3. Enables submit button when phone number is valid", async () => {
        render(<AddPhoneNumberFormDefault />);

        await userEvent.type(addPhoneNumberForm.phoneInput, "1234567890");

        expect(addPhoneNumberForm.submittingButton).not.toBeDisabled();
    });

    test("4. Successfully submits phone number to the server", async () => {
        server.use(successAddPhoneNumberHandler);
        render(<AddPhoneNumberFormDefault />);

        await userEvent.type(addPhoneNumberForm.phoneInput, "1234567890");
        await userEvent.click(addPhoneNumberForm.submittingButton);

        await waitFor(() => {
            expect(screen.getByTestId("VerifyPhoneNumberPage")).toBeInTheDocument();
            expect(getStoredPhoneNumber()).toBe("1234567890");
            expect(getStoredCountryCodeIndex()).toBe(0); // default country code index
        });
    });

    test("5. Displays error message when server invalidates phone number", async () => {
        server.use(failAddPhoneNumberHandler);
        render(<AddPhoneNumberFormDefault />);

        await userEvent.type(addPhoneNumberForm.phoneInput, "1234567890");
        await userEvent.click(addPhoneNumberForm.submittingButton);

        await waitFor(() => {
            expect(addPhoneNumberForm.errorMessage).toHaveTextContent(
                "Phone number is already taken.",
            );
        });
    });
});
