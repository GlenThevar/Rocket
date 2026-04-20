import { useState } from "react";
import { toast } from "sonner";

import { appPlans } from "../assets/assets";
import Footer from "../components/Footer";
import { authClient } from "@/lib/auth-client";
import api from "@/config/axios";

interface Plan {
    id: string;
    name: string;
    price: string;
    credits: number;
    description: string;
    features: string[];
}

const Pricing = () => {
    const { data: session } = authClient.useSession();
    const [plans] = useState<Plan[]>(appPlans);

    const handlePurchase = async (planId: string) => {
        try {
            if (!session?.user)
                return toast.info("Please sign in to purchase a plan");
            const { data } = await api.post("/api/user/purchase-credits", {
                planId,
            });
            if (!data?.payment_link) {
                throw new Error("Invalid payment link received");
            }
            window.location.href = data.payment_link;
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
            console.error(error);
        }
    };

    return (
        <>
            <div className="w-full max-w-5xl mx-auto z-20 max-md:px-4 min-h-[80vh]">
                <div className="text-center mt-16">
                    <h2 className="text-gray-100 text-3xl font-medium">
                        Choose Your Plan
                    </h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto mt-2">
                        Start for free and scale up as you grow. Find the
                        perfect plan for your content creation needs.
                    </p>
                </div>

                <div className="pt-14 py-4 px-4 ">
                    <div className="grid grid-cols-1 md:grid-cols-3 flex-wrap gap-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className="p-6 bg-black/20  mx-auto w-full max-w-sm rounded-lg text-white shadow-lg hover:ring-1 hover:ring-white transition-all duration-400"
                            >
                                <h3 className="text-xl font-bold">
                                    {plan.name}
                                </h3>
                                <div className="my-2">
                                    <span className="text-4xl font-bold">
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-300">
                                        {" "}
                                        / {plan.credits} credits
                                    </span>
                                </div>

                                <p className="text-gray-300 mb-6">
                                    {plan.description}
                                </p>

                                <ul className="space-y-1.5 mb-6 text-sm">
                                    {plan.features.map((feature, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center"
                                        >
                                            <svg
                                                className="h-5 w-5 text-indigo-300 mr-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="text-gray-400">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handlePurchase(plan.id)}
                                    className="px-6 py-1.5 max-sm:text-sm text-black font-medium
               bg-linear-to-r from-[#00FFC6] to-[#009E7F]
               rounded-md
               shadow-[0_0_20px_rgba(0,255,198,0.4)]
               hover:shadow-[0_0_30px_rgba(0,255,198,0.7)]
               hover:scale-105 active:scale-95
               transition-all duration-200"
                                >
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="mx-auto text-center text-sm max-w-md mt-10 text-white/60 font-light">
                    Project{" "}
                    <span className="text-white">Creation / Revision</span>{" "}
                    consumes <span className="text-white">5 credits</span>. You
                    can purchase more credits to create more projects.
                </p>
            </div>

            <Footer />
        </>
    );
};

export default Pricing;
