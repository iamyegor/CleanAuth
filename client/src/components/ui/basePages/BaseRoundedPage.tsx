import React from "react";

interface BaseRoundedPageProps {
    children: React.ReactNode;
    "data-testid"?: string;
}

export default function BaseRoundedPage({
    children,
    "data-testid": dataTestId,
}: BaseRoundedPageProps) {
    return (
        <div className="flex items-center justify-center h-screen p-4" data-testid={dataTestId}>
            <div className="h-full w-full bg-neutral-100 rounded-lg flex flex-col items-center">
                {children}
            </div>
        </div>
    );
}
