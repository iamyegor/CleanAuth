import React from "react";
import BaseRoundedPage from "@/components/ui/BaseRoundedPage.tsx";

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
            <div className="h-full max-w-[410px] px-4 flex flex-col justify-center">{children}</div>
        </BaseRoundedPage>
    );
}
