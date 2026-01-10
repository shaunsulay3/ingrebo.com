import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputBox from "./InputBox";
import { Search } from "lucide-react";
import { useByMatch } from "../contexts/ByMatchContext";
export default function Navbar() {
    const navigate = useNavigate();
    const { byMatch, setByMatch } = useByMatch();
    const [searchInput, setSearchInput] = useState<string>("");
    return (
        <nav className="fixed top-0 left-0 right-0 h-18 bg-white text-green-900 z-40 flex items-center justify-between pl-4 pr-6  py-2">
            <div className="min-w-50 mr-10">
                <a href="/" className="items-center flex gap-x-2">
                    <img src="/logo-character.svg" alt="Logo" className="h-8" />
                    <img src="/logo.svg" alt="Logo" className="h-10" />
                </a>
            </div>
            <div className={`w-full flex justify-between items-stretch rounded-2xl mr-5`}>
                <InputBox
                    className="w-full border-1 border-gray-100 rounded-l-2xl z-50 h-11"
                    placeholder="   Search"
                    focus={true}
                    value={searchInput}
                    onChange={(value) => setSearchInput(value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && searchInput.trim() !== "") {
                            navigate(`/search?q=${searchInput}`);
                        }
                    }}
                />
                <div className="px-4 bg-gray-100 h-auto flex items-center rounded-r-2xl hover:bg-gray-200 cursor-pointer">
                    <Search />
                </div>
            </div>
            <div
                className={`${
                    byMatch
                        ? "bg-green-800 text-white "
                        : "bg-gray-100 text-gray-400 hover:bg-green-100"
                } rounded-2xl w-50 mr-4 items-center flex h-11 justify-center  cursor-pointer transition-colors duration-300`}
                onClick={() => {
                    setByMatch(!byMatch);
                }}
            >
                {byMatch ? "Show Matches" : "Show Any"}
            </div>
        </nav>
    );
}
