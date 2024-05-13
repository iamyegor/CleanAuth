import React from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import DisplayedErrorMessage from "@/components/ui/DisplayedErrorMessage.tsx";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import PhoneInput from "@/pages/AddPhoneNumber/components/PhoneInput.tsx";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import countries from "@/pages/AddPhoneNumber/utils/countries.ts";
import validator from "validator";
import { keepOnlyDigits } from "@/pages/AddPhoneNumber/utils/keepOnlyDigits.ts";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import usePhoneNumber from "@/pages/AddPhoneNumber/hooks/usePhoneNumber.ts";
import storePhoneNumber from "@/utils/phoneNumberData/storePhoneNumber.ts";
import storeCountryCodeIndex from "@/utils/phoneNumberData/storeCountryCode.ts";
import useCountryCode from "@/pages/AddPhoneNumber/hooks/useCountryCode.ts";

export async function action({ request }: any): Promise<string | Response> {
    const data = await request.formData();

    const countryCodeIndex: number = parseInt(data.get("countryCodeIndex"));
    const countryCode: string = countries[countryCodeIndex].dialCode;
    const phoneNumberWithoutCode: string = keepOnlyDigits(data.get("phoneNumber"));

    try {
        await api.post("api/add-phone-number", {
            phoneNumber: countryCode + phoneNumberWithoutCode,
        });

        storePhoneNumber(phoneNumberWithoutCode);
        storeCountryCodeIndex(countryCodeIndex);

        return redirect("/verify-phone-number");
    } catch (err) {
        const error = err as AxiosError<ServerErrorResponse>;
        if (error.response?.data) {
            return error.response.data.errorMessage;
        }

        throw new Error("No response was received");
    }
}

export default function AddPhoneNumberForm() {
    const { country, setCountry } = useCountryCode();
    const { phoneNumber, setPhoneNumber } = usePhoneNumber();
    const errorMessage = useActionData() as string;
    const { state } = useNavigation();

    function getCountryIndex(country: Country): number {
        return countries.findIndex((c) => c.name === country.name);
    }

    return (
        <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
            <h2 className="mb-3 text-4xl font-bold text-gray-900">Verify Your Phone Number</h2>
            <p className="mb-8 text-lg text-gray-600">
                Please enter your phone number below, you'll receive a code
            </p>
            <Form
                method="post"
                action={"/add-phone-number"}
                className={errorMessage ? "space-y-4" : "space-y-8"}
            >
                <div className="space-y-4">
                    <PhoneInput
                        country={country}
                        phoneNumber={phoneNumber}
                        setCountry={setCountry}
                        setPhoneNumber={setPhoneNumber}
                    />
                    {errorMessage && <DisplayedErrorMessage errorMessage={errorMessage} />}
                </div>
                <SubmittingButton
                    disabled={!validator.isMobilePhone(keepOnlyDigits(phoneNumber))}
                    loading={state === "loading"}
                    text="Request code"
                />
                <input
                    name="countryCodeIndex"
                    value={getCountryIndex(country)}
                    className="hidden"
                    readOnly
                />
            </Form>
        </div>
    );
}
