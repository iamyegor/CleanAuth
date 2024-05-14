import React from "react";

interface BaseRoundedPageProps {
    children: React.ReactNode;
}

export default function BaseRoundedPage({ children }: BaseRoundedPageProps) {
    return (
        <div className="flex items-center justify-center h-screen p-4">
            <div className="h-full w-full bg-neutral-100 rounded-lg flex flex-col items-center">
                {children}
            </div>
        </div>
    );
}
