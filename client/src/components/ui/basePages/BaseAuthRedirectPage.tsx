import ErrorMessage from "@/utils/ErrorMessage.ts";
import BaseRoundedPage from "@/components/ui/basePages/BaseRoundedPage.tsx";
import Image from "@/components/ui/Image.tsx";
import GoBackButtonVariant1 from "@/components/ui/GoBackButton.tsx";
import React from "react";
import Spinner from "@/components/ui/Spinner.tsx";

interface BaseAuthRedirectPage {
    logo: string;
    isLoading: boolean;
    errorMessage: ErrorMessage | null | undefined;
    spinnerHighlightColor: string;
    spinnerBaseColor: string;
}

export default function BaseAuthRedirectPage({
    logo,
    isLoading,
    errorMessage,
    spinnerHighlightColor,
    spinnerBaseColor,
}: BaseAuthRedirectPage) {
    function showError() {
        return (
            errorMessage && (
                <>
                    <Image src={logo} alt="Logotype" className="w-20 h-20 mb-8" />
                    <p className="text-2xl font-semibold text-center">{errorMessage.value}</p>
                    <GoBackButtonVariant1 route="/login" text="Go back to login" />
                </>
            )
        );
    }

    return (
        <BaseRoundedPage>
            <div className="flex h-full w-full justify-center items-center flex-col">
                {isLoading ? (
                    <div className="relative flex justify-center items-center">
                        <Spinner
                            size={110}
                            color={spinnerHighlightColor}
                            secondaryColor={spinnerBaseColor}
                        />
                        <Image src={logo} alt="Logotype" className="absolute w-12 h-12" />
                    </div>
                ) : (
                    showError()
                )}
            </div>
        </BaseRoundedPage>
    );
}
