import React from "react";
import BaseRoundedPage from "@/components/ui/basePages/BaseRoundedPage.tsx";

interface BaseResetPasswordPageProps {
    children: React.ReactNode;
    "data-testid"?: string;
}

export default function BasePasswordReset({
    children,
    "data-testid": dataTestId,
}: BaseResetPasswordPageProps) {
    return (
        <BaseRoundedPage data-testid={dataTestId}>
            <div
                className="h-full w-full max-w-[410px] px-4 flex flex-col justify-center 
            items-center"
            >
                <div className="w-full text-center">{children}</div>
            </div>
        </BaseRoundedPage>
    );
}
