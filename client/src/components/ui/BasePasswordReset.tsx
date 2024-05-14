import React from "react";
import BaseRoundedPage from "@/components/ui/BaseRoundedPage.tsx";

interface BaseResetPasswordPageProps {
    children: React.ReactNode;
}

export default function BasePasswordReset({ children }: BaseResetPasswordPageProps) {
    return (
        <BaseRoundedPage>
            <div className="h-full w-[410px] flex flex-col justify-center">{children}</div>
        </BaseRoundedPage>
    );
}
