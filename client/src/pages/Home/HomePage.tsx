import api from "@/lib/api.ts";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";

export async function loader() {
    try {
        const response = await api.get<string>("username");
        return response.data;
    } catch (error) {
        return redirect("/login");
    }
}

export default function HomePage() {
    const username = useLoaderData() as string;
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await api.post("logout");
        } catch (e) {
            console.log(e);
        }

        navigate("/login");
    }

    return (
        <div
            className="flex items-center justify-center h-screen animated-gradient bg-neutral-700"
            data-testid="HomePage"
        >
            <div className="p-8 space-y-4 text-4xl sm:text-5xl md:text-6xl">
                <h1
                    className="font-bold bg-clip-text text-transparent bg-gradient-to-r 
                    from-purple-200 to-sky-300 leading-[1.25] -mb-3"
                >
                    Hello, {username}.
                </h1>
                <p className="font-semibold text-white">Do you want to exit?</p>
                <button
                    type="button"
                    className="px-6 py-3 bg-white bg-opacity-20 rounded-full 
                    font-bold text-white hover:bg-opacity-30 transition-opacity 
                    duration-300 ease-in-out text-base"
                    onClick={handleLogout}
                >
                    Exit!
                </button>
            </div>
        </div>
    );
}
