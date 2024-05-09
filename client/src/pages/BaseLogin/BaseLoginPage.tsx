import PrimaryImage from "@/pages/Signup/components/PrimaryImage.tsx";
import abstractFormImage from "@/assets/abstract_3d_form.png";
import { ReactElement } from "react";

interface BaseLoginPage {
    children: ReactElement;
    image: string;
}

export default function BaseLoginPage({ children, image }: BaseLoginPage) {
    return (
        <div className="flex min-h-screen bg-white">
            <PrimaryImage src={image} alt="Login Page" />
            <div
                className="flex-1 flex justify-center items-center relative m-3 ml-0 rounded-2xl 
            bg-neutral-100"
            >
                <img
                    src={abstractFormImage}
                    alt="Decorative background"
                    className="absolute h-1/2 w-1/2 bottom-40 opacity-10 z-10 blur-xl select-none"
                />
                {children}
            </div>
        </div>
    );
}
