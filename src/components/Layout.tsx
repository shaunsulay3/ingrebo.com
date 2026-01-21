import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(224); // 56 * 4 = 224px (w-56)

    // auto-collapse sidebar on small screens
    useEffect(() => {
        const handleResize = () => {
            const shouldCollapse = window.innerWidth < 768; // sm breakpoint
            setCollapsed(shouldCollapse);
            setSidebarWidth(shouldCollapse ? 64 : 224); // collapsed 16rem vs expanded 56rem
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="h-screen">
            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                className="fixed top-0 left-0 h-full transition-all duration-300 z-20"
            />

            {/* Navbar */}
            <div
                className="fixed top-0 left-0 bg-white z-10 transition-all duration-300"
                style={{ width: `calc(100% - ${sidebarWidth}px)`, marginLeft: sidebarWidth }}
            >
                <Navbar />
            </div>

            {/* Main Content */}
            <div
                className="pt-18 transition-all duration-300 pr-8"
                style={{ marginLeft: sidebarWidth }}
            >
                <Outlet />
            </div>
        </div>
    );
}
