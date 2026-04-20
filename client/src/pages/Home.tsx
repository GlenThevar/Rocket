import api from "@/config/axios";
import { authClient } from "@/lib/auth-client";
import { Loader2Icon } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import TextScramble from "@/components/gsap/scrambleText";


const Home = () => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { data: session } = authClient.useSession();
    const navigate = useNavigate();

    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (!session?.user) {
                return toast.error("Please sign in to create a project.");
            } else if (!input.trim()) {
                return toast.error("Please enter a message.");
            }

            setLoading(true);

            const { data } = await api.post("/api/user/project", {
                initial_prompt: input,
            });

            setLoading(false);

            navigate(`/projects/${data.projectId}`);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong"
            );
            console.error(error);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-[calc(100vh-93px)] text-white text-sm pb-20 px-4 font-poppins">
            <h1 className="text-center text-[40px] leading-12 md:text-6xl md:leading-[70px] font-semibold max-w-3xl">
                Turn thoughts into websites instantly, with AI.
            </h1>
            <TextScramble />
            <form
                onSubmit={onSubmitHandler}
                className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-base-300 focus-within:ring-1 ring-white transition-all"
            >
                <textarea
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-transparent outline-none text-gray-300 resize-none w-full"
                    rows={4}
                    placeholder="Describe your presentation in detail"
                    required
                />
                <button className="ml-auto flex items-center gap-2 bg-linear-to-r from-[#00FFC6] to-[#009E7F] rounded-md px-4 py-2 text-black">
                    {!loading ? (
                        "Create with AI"
                    ) : (
                        <>
                            Creating{" "}
                            <Loader2Icon className="animate-spin size-4 text-white" />
                        </>
                    )}
                </button>
            </form>
        </section>
    );
};

export default Home;
