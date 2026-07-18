import { Outlet } from "react-router-dom";
import SideBar from "../layouts/SideBar";

export default function AppLayout() {
    return (
        <div className="app-layout">
            <SideBar />

            <main className="app-content">
                <Outlet />
            </main>
        </div>
    );
}