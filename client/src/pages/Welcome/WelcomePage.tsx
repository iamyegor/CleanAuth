import api from "@/lib/api.ts";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";

export async function loader() {
    try {
        const response = await api.get<string>("api/user");
        return response.data;
    } catch (error) {
        return redirect("/login");
    }
}

export default function WelcomePage() {
    const username = useLoaderData() as string;
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await api.post("api/logout");
        } catch (e) {
            console.log(e);
        }

        navigate("/login");
    }

    return (
        <div className="flex h-screen animated-gradient bg-neutral-500">
            <div className="m-auto">
                <div className={"relative h-16"}>
                    <h1
                        className="text-[3.75rem] font-bold bg-clip-text text-transparent 
                        bg-gradient-to-r from-purple-200 to-sky-300 absolute top-0 left-0"
                    >
                        Hello, <span>{username}</span>.
                    </h1>
                </div>
                <p className="text-6xl mt-4 font-semibold text-white">Do you want to exit?</p>
                <button
                    type="button"
                    className="mt-8 px-6 py-3 bg-white bg-opacity-20 rounded-full 
                    font-bold text-white hover:bg-opacity-30 transition-opacity 
                    duration-300 ease-in-out"
                    onClick={handleLogout}
                >
                    Exit!
                </button>
            </div>
        </div>
    );
}
