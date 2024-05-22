import React from "react";

interface CountdownDisplayProps {
    secondsLeft: number;
}

export default function CountdownDisplay({ secondsLeft }: CountdownDisplayProps) {
    function getFormattedTime() {
        const minutes: number = Math.floor(secondsLeft / 60);
        const seconds: number = secondsLeft % 60;

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    return (
        <>
            {secondsLeft > 0 && (
                <div className="mb-8 text-neutral-500 space-x-1 flex justify-center">
                    <span className="text-neutral-500" data-testid="CountdownDisplay.Text">
                        You will be able resend code in {getFormattedTime()}
                    </span>
                </div>
            )}
        </>
    );
}
