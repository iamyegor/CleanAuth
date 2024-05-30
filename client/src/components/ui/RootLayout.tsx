import { Outlet } from "react-router-dom";
import {useEffect} from "react";

export default function RootLayout() {
    
    return (
        <>
            <Outlet />
        </>
    );
}
