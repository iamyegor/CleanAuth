import api from "@/lib/api.ts";
import { NavigateFunction } from "react-router-dom";

export default async function checkAuth(
    navigate: NavigateFunction,
    setLoading: (loading: boolean) => void,
) {
    try {
        await api.get("is-authenticated");
        navigate("/");
    } catch {
        setLoading(false);
    }
}
