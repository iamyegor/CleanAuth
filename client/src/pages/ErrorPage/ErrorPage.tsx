import { NavLink, useRouteError } from "react-router-dom";
import { RouteError } from "@/types/RouteError.ts";
import sadRobotImage from "@/pages/ErrorPage/images/sad_robot.png";
import Image from "@/components/ui/Image.tsx";
import { useEffect, useState } from "react";
import BaseRoundedPage from "@/components/ui/basePages/BaseRoundedPage.tsx";

export default function ErrorPage() {
    const error = useRouteError() as RouteError;
    const [message, setMessage] = useState<string>();
    const [title, setTitle] = useState<string>();

    useEffect(() => {
        if (error.code === "server.error") {
            setTitle("500");
        } else if (error.code === "unexpected") {
            setTitle("Oops!");
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
        }
    }, [error]);

    function reloadPage() {
        window.location.reload();
    }

    const buttonClasses =
        "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 sm:px-6 rounded";

    return (
        <BaseRoundedPage>
            <div className="h-full flex flex-col md:flex-row items-center justify-center">
                <Image
                    src={sadRobotImage}
                    alt="Error"
                    className="w-[220px] md:w-[350px] mb-4 mr-0 md:mb-8 md:mr-8"
                />
                <div className="flex flex-col items-center md:items-start">
                    <h1 className="text-8xl font-bold mb-8" data-testid="ErrorPage.Title">
                        {title}
                    </h1>
                    <div
                        className="text-lg max-w-[500px] mb-10 text-center md:text-left mx-4 
                    md:mx-0"
                        data-testid="ErrorMessage.Message"
                    >
                        {message}
                    </div>
                    <div className="flex justify-center items-center space-x-4">
                        <NavLink to="/" className={buttonClasses}>
                            Go home
                        </NavLink>
                        <p>or</p>
                        <button
                            onClick={reloadPage}
                            data-testid="ErrorPage.ReloadButton"
                            className={buttonClasses}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        </BaseRoundedPage>
    );
}
