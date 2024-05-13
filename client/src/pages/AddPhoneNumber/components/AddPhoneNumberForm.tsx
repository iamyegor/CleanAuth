import React, { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import ErrorMessageComponent from "@/components/ui/ErrorMessageComponent.tsx";
import SubmittingButton from "@/components/SubmittingButton/SubmittingButton.tsx";
import PhoneInput from "@/pages/AddPhoneNumber/components/PhoneInput.tsx";
import Country from "@/pages/AddPhoneNumber/types/Country.ts";
import countries from "@/pages/AddPhoneNumber/data/countries.ts";
import validator from "validator";
import { keepOnlyDigits } from "@/pages/AddPhoneNumber/utils/keepOnlyDigits.ts";
import api from "@/lib/api.ts";
import { AxiosError } from "axios";
import ServerErrorResponse from "@/types/ServerErrorResponse.ts";
import usePhoneNumber from "@/pages/AddPhoneNumber/hooks/usePhoneNumber.ts";
import storePhoneNumber from "@/utils/phoneNumberData/storePhoneNumber.ts";
import storeCountryCodeIndex from "@/utils/phoneNumberData/storeCountryCode.ts";
import useCountryCode from "@/pages/AddPhoneNumber/hooks/useCountryCode.ts";
import ErrorMessage from "@/utils/ErrorMessage.ts";

export async function action({ request }: any): Promise<ErrorMessage | Response> {
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
            return ErrorMessage.create(error.response.data.errorMessage);
        }

        throw new Error("No response was received");
    }
}

export default function AddPhoneNumberForm() {
    const { country, setCountry } = useCountryCode();
    const { phoneNumber, setPhoneNumber } = usePhoneNumber();
    const [isErrorShown, setIsErrorShown] = useState(false);
    const errorMessage = useActionData() as ErrorMessage;
    const { state } = useNavigation();

    function getCountryIndex(country: Country): number {
        return countries.findIndex((c) => c.name === country.name);
    }

    return (
        <Form
            method="post"
            action={"/add-phone-number"}
            className={isErrorShown ? "space-y-6" : "space-y-8"}
        >
            <div className="space-y-4">
                <PhoneInput
                    country={country}
                    phoneNumber={phoneNumber}
                    setCountry={setCountry}
                    setPhoneNumber={setPhoneNumber}
                />
                <ErrorMessageComponent
                    errorMessage={errorMessage}
                    setIsErrorShown={setIsErrorShown}
                />
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
    );
}
