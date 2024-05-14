import { useRouteError } from "react-router-dom";
import { RouteError } from "@/types/RouteError.ts";
import sadRobotImage from "@/pages/ErrorPage/images/sad_robot.png";
import Image from "@/components/ui/Image.tsx";
import { useEffect, useState } from "react";
import BaseRoundedPage from "@/components/ui/BaseRoundedPage.tsx";

export default function ErrorPage() {
    const error = useRouteError() as RouteError;
    const [message, setMessage] = useState<string>();
    const [title, setTitle] = useState<string>();

    useEffect(() => {
        if (error.code === "server.error") {
            setTitle("500");
        } else if (error.code === "unexpected") {
            setTitle("Oops!");
        } else {
            throw new Error("Unexpected error code");
        }
    }, [error]);

    useEffect(() => {
        if (error.code === "server.error") {
            setMessage(
                "It seems there is an issue with our server. Please try again later or contact support if the problem persists.",
            );
        } else if (error.code === "unexpected") {
            setMessage(
                "An unexpected error has occurred. Please try again or contact support if the issue continues.",
            );
        } else {
            throw new Error("Unexpected error code");
        }
    }, [error]);

    function reloadPage() {
        window.location.reload();
    }

    return (
        <BaseRoundedPage>
            <div className="h-full flex items-center">
                <Image src={sadRobotImage} alt="Error" className="w-[350px] mb-8 mr-8" />
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-8xl font-bold mb-8">{title}</h1>
                    <div className="text-lg max-w-[500px] mb-10 ">{message}</div>
                    <div className="flex space-x-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 
                            rounded mr-5"
                            onClick={reloadPage}
                        >
                            Reload Page
                        </button>
                        <button className="text-gray-700 font-bold underline">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </BaseRoundedPage>
    );
}
