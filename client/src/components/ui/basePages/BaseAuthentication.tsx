import PrimaryImage from "@/components/ui/PrimaryImage.tsx";
import abstractFormImage from "@/assets/abstract_3d_form.png";
import { ReactElement } from "react";
import Image from "@/components/ui/Image.tsx";

interface BaseLoginPage {
    children: ReactElement;
    image: string;
    "data-testid"?: string;
}

export default function BaseAuthentication({
    children,
    image,
    "data-testid": dataTestId,
}: BaseLoginPage) {
    return (
        <div
            className="flex min-h-screen bg-white"
            data-testid={dataTestId ?? "BaseAuthentication"}
        >
            <PrimaryImage src={image} alt="Login Page" />
            <div
                className="flex-1 flex justify-center items-center relative m-3 rounded-2xl 
            bg-neutral-100 lg:ml-0"
            >
                <Image
                    src={abstractFormImage}
                    alt="Decorative background"
                    className="absolute h-1/2 w-1/2 bottom-40 opacity-10 z-10 blur-xl select-none"
                    data-testid="BaseAuthentication.DecorativeBackground"
                />
                <div className="w-full max-w-md text-center rounded-lg p-6 z-20">{children}</div>
            </div>
        </div>
    );
}
