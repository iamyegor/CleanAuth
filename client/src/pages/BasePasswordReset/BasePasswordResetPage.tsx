import React from "react";

interface BaseResetPasswordPageProps {
    children: React.ReactNode;
}

export default function BasePasswordResetPage({ children }: BaseResetPasswordPageProps) {
    return (
        <div className="flex items-center justify-center h-screen p-4">
            <div className="h-full w-full bg-neutral-100 rounded-lg flex flex-col items-center">
                <div className="h-full w-[410px] flex flex-col justify-center">{children}</div>
            </div>
        </div>
    );
}
