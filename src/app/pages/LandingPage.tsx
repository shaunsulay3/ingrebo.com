import { useNavigate } from "react-router-dom";
import ContinueWithGoogle from "../../components/ContinueWithGoogle";

export default function LandingPage() {
    const navigate = useNavigate();
    const handleContinueWithoutAccount = () => {
        navigate("/explore");
    };
    return (
        <div className="">
            <div className="h-screen flex flex-col">
                {/* HERO */}
                <div className="flex flex-1 min-h-0">
                    <div className="px-20 flex flex-col justify-center min-w-140">
                        <img src="/logo.svg" className="w-80" />

                        <h1 className="!font-light !text-5xl !my-2">
                            Where there's <span className="font-bold text-green-800">always</span>
                            <br />
                            something you can cook.
                        </h1>

                        <h2 className="!font-light text-gray-800">
                            A community for resourceful homecooks<br></br>
                        </h2>
                        <button
                            onClick={() =>
                                window.scrollTo({
                                    top: document.body.scrollHeight,
                                    behavior: "smooth",
                                })
                            }
                            className="border w-fit py-2 px-4 rounded-2xl cursor-pointer text-green-800"
                        >
                            Get started
                        </button>
                    </div>

                    <div className="overflow-hidden relative">
                        <img
                            src="explore-snapshot.png"
                            className="h-full w-full object-left object-cover z-20"
                        />
                    </div>
                </div>

                {/* PEEK SECTION */}
                <div className="h-12 flex items-center justify-center bg-green-900 text-white">
                    Here's how it works ↓
                </div>
            </div>
            <div className="px-5 sm:px-20">
                <div className="border-b-3 border-gray-200 py-20 flex flex-col gap-10">
                    <div className="flex flex-wrap items-center justify-center gap-10">
                        <div className="w-80">
                            <h3 className="text-green-900">Log your ingredients</h3>
                            <div>
                                Ingrebo will save and categorize your ingredients for you.<br></br>{" "}
                                You can also use this during your next grocery run!
                            </div>
                        </div>
                        <div className="w-170">
                            <img src="/my-ingredients-snapshot.png" />
                        </div>
                    </div>
                </div>
                <div className="border-b-3 border-gray-200 py-20 flex flex-col gap-x-10 gap-y-20">
                    <div className="flex flex-wrap-reverse items-center justify-center gap-20">
                        <div className="w-130">
                            <img src="/show-matches-snapshot.png" />
                        </div>
                        <div className="w-100">
                            <h3 className="text-green-900">Ingrebo recommends</h3>
                            <div>
                                Based on your ingredients, ingrebo will find recipes that you can
                                cook.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap-reverse items-center justify-center gap-20">
                        <div className="w-130">
                            <img src="/recipe-ingredients-snapshot.png" />
                        </div>
                        <div className="w-100">
                            <h3 className="text-green-900">Matching Ingredients</h3>
                            <div>
                                Ingrebo shows you what ingredients you have, and what ingredient's
                                you don't have.{" "}
                                <span className="text-green-800 font-bold">Green</span> means you
                                have it, <span className="text-red-800 font-bold">red</span> means
                                you don't, and{" "}
                                <span className="text-yellow-600 font-bold">yellow</span> means you
                                have a possible alternative. <b>Click</b> the ingredient to learn
                                more.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap-reverse items-center justify-center gap-20">
                        <div className="w-130">
                            <img src="/add-ingredient-snapshot.png" />
                            <img src="/ingredient-added-snapshot.png" />
                        </div>
                        <div className="w-100">
                            <h3 className="text-green-900">Forgot you have an ingredient?</h3>
                            <div>Add or remove ingredients to your list as you go!</div>
                        </div>
                    </div>
                </div>
                <div className="border-b-3 border-gray-200 py-20 flex flex-col gap-20">
                    <div className="flex flex-wrap items-center justify-center gap-20">
                        <div className="w-100">
                            <h3 className="text-green-900">Nutrition</h3>
                            <div>
                                For those nutrient curious or counting calories, Ingrebo calculates
                                nutrition for recipes provided with exact amounts.
                            </div>
                        </div>
                        <div className="w-160">
                            <img src="/nutrition-snapshot.png" />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-20">
                        <div className="w-100">
                            <h3 className="text-green-900">
                                Curious to know the nutrition of your recipes?
                            </h3>
                            <div>
                                Ingrebo makes nutrition calculation easier than any other app. No
                                manual searching, no dropdown menus for amounts, no hassle.{" "}
                                <br></br>
                                <br></br>Write ingredients and amounts how you normally would, and
                                get instant, automatic nutrition—no work required.{" "}
                            </div>
                        </div>
                        <div className="w-160">
                            <img src="/recipe-ingredient-input-snapshot.png" />
                        </div>
                    </div>
                </div>
                <div className="py-20 flex flex-col gap-20">
                    <div>
                        <h2 className="text-center text-green-900">
                            Remember, food tastes better shared!
                        </h2>
                        <div className="text-center text-xl">
                            Share your beloved recipes with friends, family, and the world of
                            homecooking.
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-5 sm:px-20 py-5 h-60 relative z-10">
                {" "}
                <div className="max-w-150 bg-white p-20 rounded-2xl border-2 border-gray-200 text-green-800">
                    <img src="/logo.svg" alt="Logo" className="w-50" />
                    <div className="text-2xl mb-5 ">
                        Create an account or log into an existing one with Google.
                    </div>
                    <ContinueWithGoogle className="h-20 w-[70%] text-4xl mb-4" />
                    <div
                        className="h-15 border rounded-md border-gray-300 flex items-center justify-center text-sm cursor-pointer"
                        onClick={handleContinueWithoutAccount}
                    >
                        <div className="text-center">Continue without an account</div>
                    </div>
                </div>
            </div>
            <div className="bg-green-950 h-100 relative z-0 flex items-end justify-end p-20">
                <div className="flex flex-col items-center">
                    <img src="/logo.svg" alt="Logo" className="w-50 text-white" />
                    <div className="text-green-800">Created by shaunsulay</div>
                </div>
            </div>
        </div>
    );
}
