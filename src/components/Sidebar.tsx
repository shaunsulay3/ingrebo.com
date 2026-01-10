import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Bookmark, Carrot, Compass, SquarePlus, User as UserIcon, Utensils } from "lucide-react";
import { useEffect, useState } from "react";

function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [profileIsOpen, setProfileIsOpen] = useState<boolean>(false);
    useEffect(() => {
        console.log("testtest", location);
    }, [location]);
    return (
        <div className="bg-white h-full text-xl  border-gray-200 py-2 pl-4 flex flex-col justify-between">
            <div>
                <Link
                    to="/"
                    className={`${
                        location.pathname === "/" ? "bg-gray-100 font-semibold" : ""
                    } p-2 hover:bg-gray-100 flex items-center !no-underline rounded-2xl`}
                >
                    <div className="min-w-10 flex justify-start">
                        <Compass />
                    </div>
                    <span className="!no-underline">Explore</span>
                </Link>
                <Link
                    to="/saved"
                    className={`${
                        location.pathname === "/saved" ? "bg-gray-100 font-semibold" : ""
                    } p-2 hover:bg-gray-100 flex items-center !no-underline rounded-2xl`}
                >
                    <div className="min-w-10 flex justify-start">
                        <Bookmark />
                    </div>
                    <span className="!no-underline">Saved</span>
                </Link>
                <Link
                    to="/my-ingredients"
                    className={`${
                        location.pathname === "/my-ingredients" ? "bg-gray-100 font-semibold" : ""
                    } p-2 hover:bg-gray-100 flex items-center !no-underline rounded-2xl`}
                >
                    <div className="min-w-10 flex justify-start">
                        <Carrot />
                    </div>
                    <span className="!no-underline">My Ingredients</span>
                </Link>
                <Link
                    to={user ? user.slug : "/login"}
                    className={`${
                        location.pathname === `/${user?.slug}` ? "bg-gray-100 font-semibold" : ""
                    } p-2 hover:bg-gray-100 flex items-center !no-underline rounded-2xl`}
                >
                    <div className="min-w-10 flex justify-start">
                        <Utensils />
                    </div>
                    <span className="!no-underline">My Recipes</span>
                </Link>
                <Link
                    to="/create"
                    className={`${
                        location.pathname === "/create" ? "bg-gray-100 font-semibold" : ""
                    } p-2 hover:bg-gray-100 flex items-center !no-underline rounded-2xl`}
                >
                    <div className="min-w-10 flex justify-start">
                        <SquarePlus />
                    </div>
                    <span className="!no-underline">Create</span>
                </Link>
            </div>
            <div className="relative mb-2 ml-2">
                <div
                    className={` p-4 hover:bg-gray-100 flex items-center !no-underline rounded-2xl max-w-full truncate bg-gray-100  ${
                        user ? "hover:bg-gray-200 cursor-pointer" : ""
                    }`}
                    onClick={() => {
                        if (user) {
                            setProfileIsOpen((prev) => !prev);
                        }
                    }}
                >
                    <div className={`flex justify-start ${user ? "text-green-900" : ""}`}>
                        <UserIcon />
                    </div>
                    <div className="text-base ml-2 w-full truncate flex justify-center">
                        {user ? (
                            <span className="text-green-900 truncate">{user?.username}</span>
                        ) : (
                            <span>
                                <span className="hover:underline cursor-pointer hover:text-green-700">
                                    <Link to="/login">Login</Link>
                                </span>
                                <span> / </span>
                                <span className="hover:underline cursor-pointer hover:text-green-700">
                                    <Link to="/signup">Signup</Link>
                                </span>
                            </span>
                        )}
                    </div>
                </div>
                {profileIsOpen && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-full rounded-2xl border-2 border-gray-200 overflow-hidden">
                        <button
                            className="w-full hover:bg-gray-100 p-2 hover-pointer cursor-pointer"
                            onClick={async () => await logout()}
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
