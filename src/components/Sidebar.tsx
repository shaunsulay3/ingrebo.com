import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Bookmark, Carrot, Compass, SquarePlus, User as UserIcon, Utensils } from "lucide-react";
import { useEffect, useState } from "react";

function Sidebar({ className, collapsed }: { className?: string; collapsed: boolean }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [profileIsOpen, setProfileIsOpen] = useState(false);

    const menuItems = [
        { label: "Explore", icon: <Compass />, path: "/" },
        { label: "Saved", icon: <Bookmark />, path: "/saved" },
        { label: "My Ingredients", icon: <Carrot />, path: "/my-ingredients" },
        { label: "My Recipes", icon: <Utensils />, path: user ? `/${user.slug}` : "/login" },
        { label: "Create", icon: <SquarePlus />, path: "/create" },
    ];

    return (
        <div
            className={`${className} pl-2 pr-4 pb-4
        bg-white h-full  flex flex-col justify-between
        transition-all duration-300
        ${collapsed ? "w-16" : "w-56"}
      `}
        >
            <div>
                <a
                    href="/"
                    className={`flex gap-x-2 items-center h-18 max-h-18 ${
                        collapsed ? "justify-center" : ""
                    }`}
                >
                    <img src="/logo-character.svg" alt="Logo" className="h-8" />
                    {!collapsed && <img src="/logo.svg" alt="Logo" className="h-10" />}
                </a>
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`
              p-2 hover:bg-gray-100 flex items-center gap-3 rounded-2xl
              ${location.pathname === item.path ? "bg-gray-100 font-semibold" : ""}
            ${collapsed ? "justify-center" : ""}`}
                    >
                        <div className="min-w-6 flex justify-center">{item.icon}</div>
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </div>

            {/* Bottom section: user profile / login */}
            {user ? (
                <div className="relative mb-2 flex flex-col items-center">
                    <div
                        className={`
              px-4 py-2 hover:bg-gray-100 flex items-center justify-between w-full
              rounded-2xl cursor-pointer bg-gray-100 truncate
            `}
                        onClick={() => setProfileIsOpen((prev) => !prev)}
                    >
                        <UserIcon />
                        {!collapsed && <div className="truncate">{user.username}</div>}
                    </div>
                    {profileIsOpen && !collapsed && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 rounded-2xl border-2 border-gray-200 overflow-hidden bg-white z-10">
                            <button
                                className="w-full hover:bg-gray-100 p-2 cursor-pointer"
                                onClick={async () => await logout()}
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link
                    to="/login"
                    className={`
            text-center w-full border-gray-300 py-3 px-3 rounded-2xl cursor-pointer text-gray-600 flex items-center gap-3 hover:bg-gray-100
          `}
                >
                    <UserIcon />
                    {!collapsed && <span>Log in</span>}
                </Link>
            )}
        </div>
    );
}

export default Sidebar;
