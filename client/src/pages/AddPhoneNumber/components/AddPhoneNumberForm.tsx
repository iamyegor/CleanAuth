import React, { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import ErrorMessage from "@/components/ui/ErrorMessage.tsx";
import SubmittingButton from "@/components/ui/SubmittingButton.tsx";
import PhoneInput from "@/pages/AddPhoneNumber/components/PhoneInput.tsx";
import Country from "@/pages/AddPhoneNumber/types/CountryCode.ts";
import countryCodes from "@/pages/AddPhoneNumber/utils/countryCodes.ts";
import validator from "validator";
import { keepOnlyDigits } from "@/pages/AddPhoneNumber/utils/keepOnlyDigits.ts";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";

export async function action({ request }: any): Promise<string | Response> {
    const data = await request.formData();

    const countryCode: string = data.get("countryCode");
    const phoneNumberWithCode: string = keepOnlyDigits(data.get("phoneNumber"));

    try {
        await api.post("api/add-phone-number", { phoneNumber: countryCode + phoneNumberWithCode });
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
    const [selectedCountry, setSelectedCountry] = useState<Country>(countryCodes[0]);
    const [phoneNumber, setPhoneNumber] = useState("");
    const errorMessage = useActionData() as string;
    const { state } = useNavigation();

    return (
        <div className="w-full max-w-md text-center rounded-lg p-6 z-20">
            <h2 className="mb-3 text-4xl font-bold text-gray-900">Verify Your Phone Number</h2>
            <p className="mb-8 text-lg text-gray-600">Please enter your phone number below</p>
            <Form method="post" action={"/add-phone-number"}>
                <div className="mb-8">
                    <PhoneInput
                        country={selectedCountry}
                        phoneNumber={phoneNumber}
                        setCountry={setSelectedCountry}
                        setPhoneNumber={setPhoneNumber}
                    />
                    {errorMessage && (
                        <ErrorMessage errorMessage={errorMessage} additionalClasses="mt-8" />
                    )}
                </div>
                <input
                    name="countryCode"
                    value={selectedCountry.dialCode}
                    className="hidden"
                    readOnly
                />
                <SubmittingButton
                    disabled={!validator.isMobilePhone(keepOnlyDigits(phoneNumber))}
                    loading={state === "loading"}
                    text="Verify Phone"
                    additionalClasses="bg-red-500 hover:bg-red-600"
                />
            </Form>
        </div>
    );
}
