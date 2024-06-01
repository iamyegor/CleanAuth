import { useLoaderData } from "react-router-dom";
import ErrorMessage from "@/utils/ErrorMessage.ts";
import BaseRoundedPage from "@/components/ui/BaseRoundedPage.tsx";
import Image from "@/components/ui/Image.tsx";
import GoBackButtonVariant1 from "@/components/ui/GoBackButton.tsx";
import React from "react";

interface BaseAuthRedirectPage {
    logo: string;
}

export default function BaseAuthRedirectPage({ logo }: BaseAuthRedirectPage) {
    const errorMessage = useLoaderData() as ErrorMessage;
    
    return (
        <div>
            <BaseRoundedPage>
                <div className="flex h-full w-full justify-center items-center flex-col">
                    <Image src={logo} alt="Logotype" className="w-20 h-20 mb-8" />
                    <p className="text-2xl font-semibold text-center">{errorMessage.value}</p>
                    <GoBackButtonVariant1 route="/login" text="Go back to login" />
                </div>
            </BaseRoundedPage>
        </div>
    );
}
