import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputBox from "./InputBox";
import { Search } from "lucide-react";
import { useByMatch } from "../contexts/ByMatchContext";
export default function Navbar({ className }: { className?: string }) {
    const navigate = useNavigate();
    const { byMatch, setByMatch } = useByMatch();
    const [searchInput, setSearchInput] = useState<string>("");
    return (
        <nav className="h-18 bg-white text-green-900 z-40 flex items-center justify-between pl-4 pr-6 py-2">
            <div className={`w-full flex justify-between items-stretch rounded-2xl mr-5`}>
                <InputBox
                    className="w-full border-1 border-gray-100 rounded-l-2xl z-50"
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
                } rounded-2xl w-50 items-center flex h-11 justify-center  cursor-pointer transition-colors duration-300`}
                onClick={() => {
                    setByMatch(!byMatch);
                }}
            >
                {byMatch ? "Show Matches" : "Show Any"}
            </div>
        </nav>
    );
}
