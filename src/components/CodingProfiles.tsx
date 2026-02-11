import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Trophy } from 'phosphor-react';
import { SiLeetcode, SiHackerrank, SiGithub } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const profiles = [
    {
        name: "LeetCode",
        url: "https://leetcode.com/u/sarweshwar_goud/",
        icon: <Code size={32} />,
        bg: "bg-[#FFA116]/10",
        text: "text-[#FFA116]",
        border: "border-[#FFA116]/30 hover:border-[#FFA116]/60"
    },
    {
        name: "HackerRank",
        url: "https://www.hackerrank.com/profile/b_sarweshwar445",
        icon: <Trophy size={32} />,
        bg: "bg-[#2EC866]/10",
        text: "text-[#2EC866]",
        border: "border-[#2EC866]/30 hover:border-[#2EC866]/60"
    },
    {
        name: "GitHub",
        url: "https://github.com/sarweshwargoud",
        icon: <Code size={32} />,
        bg: "bg-white/10",
        text: "text-white",
        border: "border-white/30 hover:border-white/60"
    }
];

const CodingProfiles = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cards = containerRef.current?.querySelectorAll('.profile-card');
        const heading = containerRef.current?.querySelector('h2');
        const description = containerRef.current?.querySelector('.section-description');

        // Animate heading
        if (heading) {
            gsap.fromTo(heading,
                { opacity: 0, y: -30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: heading,
                        start: "top bottom-=100",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate description
        if (description) {
            gsap.fromTo(description,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: description,
                        start: "top bottom-=100",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate profile cards with gentle fade + scale (no sideways jumping)
        cards?.forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom-=80",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }, []);

    return (
        <section id="coding-profiles" className="py-24 px-6 md:px-12 bg-background relative overflow-hidden border-t border-white/5">
            <div ref={containerRef} className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                        Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Profiles</span>
                    </h2>
                    <p className="section-description text-muted-foreground/80 max-w-2xl mx-auto text-sm md:text-base">
                        Sharpening problem-solving skills through competitive programming and open-source contributions.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {profiles.map((profile, i) => (
                        <a
                            key={i}
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`profile-card flex items-center gap-4 px-8 py-6 rounded-xl border ${profile.border} hover:scale-105 transition-all duration-300 ${profile.bg} backdrop-blur-sm group`}
                        >
                            <span className={`${profile.text} group-hover:scale-110 transition-transform`}>{profile.icon}</span>
                            <span className="text-lg font-bold text-white">{profile.name}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
};

export default CodingProfiles;
