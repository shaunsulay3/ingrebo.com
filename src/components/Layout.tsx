import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
    return (
        <div className="flex h-screen">
            <Navbar />
            <div className="fixed top-18 left-0 h-[calc(100vh-4.5rem)] w-56">
                <Sidebar />
            </div>
            <div className="flex-1 mt-18 ml-56 w-full bg-white">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;
