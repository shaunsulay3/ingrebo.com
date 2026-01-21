import { useNavigate, useSearchParams } from "react-router-dom";
import ContinueWithGoogle from "../../components/ContinueWithGoogle";
import { useAuth } from "../../contexts/AuthContext";
import InputBox from "../../components/InputBox";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changeUsername } from "../../api/user-api";
export default function WelcomePage() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const newUser = searchParams.get("newUser");
    const [username, setUsername] = useState<string>("");
    const mutation = useMutation({
        mutationFn: changeUsername,
        onSuccess: () => {
            navigate("/");
        },
    });

    useEffect(() => {
        if (user?.username) {
            setUsername(user.username);
        }
    }, [user]);
    console.log("User in WelcomePage:", user);
    return (
        <div className="relative h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-[url('/wallpaper.png')] bg-[length:200%] bg-center w-full"
                style={{ backgroundAttachment: "fixed" }}
            ></div>
            <div className="absolute inset-0 bg-white/70"></div>
            <div className="relative z-10 w-full max-w-3xl mx-auto p-8 bg-white text-green-800 overflow-y-auto max-h-screen">
                <div className="w-full flex flex-col items-center my-30">
                    <span className=" text-2xl">Welcome to</span>{" "}
                    <img src="/logo.svg" alt="Logo" className="w-50" />
                </div>
                <div className="mt-4 mb-8 mx-8">
                    <h3>about</h3>
                    <p>
                        Ever stare into your fridge and wonder,
                        <i>“What can I cook with all of this?”</i> Ingrebo is here to solve that
                        problem. Our website is designed to help you keep track of the ingredients
                        you have at home and remember the recipes you’ve made before — all in one
                        simple, intuitive recipe logging platform.
                    </p>
                    <p>
                        Ingrebo is designed to make logging a recipe effortless. No unnecessary
                        buttons, dropdown lists, or selection just to input ingredients unlike other
                        apps. Just type it down the way you normally would, and{" "}
                        <u>
                            Ingrebo will automatically detect the ingredients and quantities for you
                        </u>
                        . From there, we help you:
                    </p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>Match your available ingredients to your past recipes</li>
                        <li>
                            Discover new recipes that other users have tried if you’re feeling
                            adventurous
                        </li>
                        <li>
                            See the nutrient information of your recipes automatically, without the
                            hassle of manually clicking each ingredient like other health apps
                        </li>
                    </ul>
                    <p>
                        {" "}
                        Ingrebo does this all while making sure you don’t need to run to the grocery
                        store to buy those one or two extra ingredients you don't have, since{" "}
                        <span className="font-semibold">
                            Ingrebo recommends recipes based on the ingredients you already have
                        </span>
                        .
                    </p>
                    <p>
                        Ingrebo was built to foster a community of practical home chefs looking to
                        make the most of the ingredients they already have. Give feedback on other
                        users’ dishes, share tips, and receive feedback on your own creations. It’s
                        not just about cooking — it’s about learning, experimenting, and connecting
                        with fellow food lovers.
                    </p>{" "}
                    <p>
                        With Ingrebo, never waste ingredients, never forget a recipe, and always
                        find something delicious to cook. Start logging, start experimenting, and
                        make the most of your kitchen!
                    </p>
                </div>
                <div className="my-4 mx-8">
                    {!user && (
                        <div>
                            <h3>begin your journey</h3>
                            <div className="px-4 flex flex-col gap-4">
                                <div>
                                    Create an account or log in to an existing one with Google.
                                </div>
                                <ContinueWithGoogle className="mx-8" />
                                <div>Or explore ingrebo right now, and make an account later</div>
                                <a
                                    className="mx-8 py-2 border rounded-xl border-gray-200 text-center w-full"
                                    href="/"
                                >
                                    Explore now
                                </a>
                            </div>
                        </div>
                    )}
                    {user && !newUser && (
                        <div>
                            <h3>continue your journey</h3>
                        </div>
                    )}
                    {user && newUser && (
                        <div>
                            <h3>begin your journey with a name!</h3>
                            <div className="px-4 flex flex-col gap-4">
                                <div>Make it a memorable one!</div>
                                <div className="flex justify-between px-8">
                                    <InputBox
                                        className="border-gray-200"
                                        maxChars={24}
                                        value={username}
                                        onChange={(val) => setUsername(val)}
                                    />
                                    <div
                                        className="border-1 rounded-xl border-gray-200 px-4 py-2 cursor-pointer hover:bg-green-800 hover:text-white duration-200"
                                        onClick={() => {
                                            mutation.mutate(username);
                                        }}
                                    >
                                        Confirm username and begin
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="h-50" />
            </div>
        </div>
    );
}
