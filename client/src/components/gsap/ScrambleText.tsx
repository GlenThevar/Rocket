import { useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(TextPlugin);

const TextScramble = () => {
    const textRef = useRef<HTMLHeadingElement>(null);
    const container = useRef<HTMLDivElement>(null);

    const marketingCopy = [
        "Design, build, and deploy at lightning speed with AI-driven intelligence.",
        "Harness the power of AI to create, tailor, and launch your content in record time.",
        "Elevate your workflow: build, tweak, and go live instantly using smart AI design.",
        "Experience effortless creation, customization, and publishing with our advanced AI engine.",
        "Bring your vision to life faster with AI-powered tools for seamless design and deployment.",
        "Streamline your creative process—from initial design to final publish, powered by AI.",
        "Unleash your productivity, create, edit, and share faster with intelligent, AI-assisted design.",
        "Smart design, faster results: automate your creative workflow from concept to publication.",
        "Accelerate your project lifecycle: design, adapt, and publish at the speed of AI.",
        "Transform your ideas into reality instantly with AI-enhanced design and publishing capabilities."
    ];

    useGSAP(() => {
        let index = 0;

        const interval = setInterval(() => {
            index = (index + 1) % marketingCopy.length;

            gsap.to(textRef.current, {
                duration: 0.8,
                text: {
                    value: marketingCopy[index],
                    delimiter: "",
                },
                ease: "power2.inOut",
            });
        }, 3000);
        return () => clearInterval(interval);
    }, { scope: container });

    return (
        <div ref={container}>
            <h1 ref={textRef} className="text-center text-base max-w-md mt-2"> Create, customize and publish faster than ever with intelligent design powered by AI.</h1>
        </div>
    );
};

export default TextScramble;