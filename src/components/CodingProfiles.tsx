import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowSquareOut } from 'phosphor-react';
import { SiLeetcode, SiHackerrank, SiGithub } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

const profiles = [
    {
        id: 'github',
        name: 'GitHub',
        url: 'https://github.com/sarweshwargoud',
        Icon: SiGithub,
        color: '#ffffff',
        accentBg: 'bg-white/5',
        accentBorder: 'border-white/15',
        accentHover: 'hover:border-white/40',
        iconColor: 'text-white',
        stats: [
            { label: 'Public Repos', value: '20' },
            { label: 'Top Stars', value: '29 ⭐' },
            { label: 'Languages', value: 'Python · TS' },
            { label: 'Active Since', value: '2023' },
        ],
        highlight: 'AI-Roadmap-Zero2Hero has 29 stars',
    },
    {
        id: 'leetcode',
        name: 'LeetCode',
        url: 'https://leetcode.com/u/sarweshwar_goud/',
        Icon: SiLeetcode,
        color: '#FFA116',
        accentBg: 'bg-[#FFA116]/10',
        accentBorder: 'border-[#FFA116]/30',
        accentHover: 'hover:border-[#FFA116]/60',
        iconColor: 'text-[#FFA116]',
        stats: [
            { label: 'Easy', value: '39' },
            { label: 'Medium', value: '33' },
            { label: 'Hard', value: '12' },
            { label: 'Total Solved', value: '84' },
        ],
        highlight: '84 problems solved across all difficulties',
    },
    {
        id: 'hackerrank',
        name: 'HackerRank',
        url: 'https://www.hackerrank.com/profile/b_sarweshwar445',
        Icon: SiHackerrank,
        color: '#2EC866',
        accentBg: 'bg-[#2EC866]/10',
        accentBorder: 'border-[#2EC866]/30',
        accentHover: 'hover:border-[#2EC866]/60',
        iconColor: 'text-[#2EC866]',
        stats: [
            { label: 'Problem Solving', value: '🥇 Gold' },
            { label: 'Python', value: '🥇 Gold' },
            { label: 'SQL', value: '🥈 Silver' },
            { label: 'Badges', value: '3' },
        ],
        highlight: 'Gold badge in Problem Solving & Python',
    },
];

const CodingProfiles = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        const cards = containerRef.current?.querySelectorAll('.profile-card');
        const heading = containerRef.current?.querySelector('h2');
        const description = containerRef.current?.querySelector('.section-description');

        if (heading) {
            gsap.fromTo(heading,
                { opacity: 0, y: -30 },
                {
                    opacity: 1, y: 0, duration: 0.8,
                    scrollTrigger: { trigger: heading, start: 'top bottom-=100', toggleActions: 'play none none reverse' }
                }
            );
        }

        if (description) {
            gsap.fromTo(description,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 0.8, delay: 0.2,
                    scrollTrigger: { trigger: description, start: 'top bottom-=100', toggleActions: 'play none none reverse' }
                }
            );
        }

        cards?.forEach((card) => {
            gsap.fromTo(card,
                { opacity: 0, y: 40, scale: 0.96 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out',
                    scrollTrigger: { trigger: card, start: 'top bottom-=80', toggleActions: 'play none none reverse' }
                }
            );
        });
    }, []);

    return (
        <section id="coding-profiles" className="pt-24 pb-48 md:pb-56 px-6 md:px-12 bg-transparent relative border-t border-white/5">
            {/* Background glows isolated so they don't trigger horizontal scrollbar, without clipping tooltips */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div ref={containerRef} className="max-w-4xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        Coding{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Profiles
                        </span>
                    </h2>
                    <p className="section-description text-white/60 max-w-xl mx-auto text-base font-light">
                        Sharpening problem-solving skills through competitive programming and open-source contributions.
                    </p>
                </div>

                {/* Profile Cards */}
                <div className="flex flex-wrap justify-center gap-6 relative z-20">
                    {profiles.map((profile) => {
                        const isHovered = hoveredId === profile.id;
                        return (
                            <div
                                key={profile.id}
                                className="profile-card relative flex flex-col items-center"
                                onMouseEnter={() => setHoveredId(profile.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Main button */}
                                <a
                                    href={profile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3.5 px-8 py-5 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 group
                                        ${profile.accentBg} ${profile.accentBorder} ${profile.accentHover}
                                        ${isHovered ? 'shadow-lg -translate-y-1 scale-[1.03]' : 'shadow-sm'}
                                    `}
                                >
                                    <profile.Icon size={28} className={`${profile.iconColor} transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                                    <span className="text-lg font-bold text-white">{profile.name}</span>
                                    <ArrowSquareOut
                                        size={14}
                                        className={`text-slate-400 transition-all duration-200 ${isHovered ? 'opacity-100 translate-x-0.5 -translate-y-0.5' : 'opacity-0'}`}
                                    />
                                </a>

                                {/* Hover info panel */}
                                <div
                                    className={`absolute top-full mt-3 left-1/2 -translate-x-1/2 w-72 sm:w-80 z-30 transition-all duration-200 origin-top pointer-events-none ${isHovered
                                            ? 'opacity-100 scale-100 translate-y-0'
                                            : 'opacity-0 scale-95 -translate-y-2'
                                        }`}
                                >
                                    <div className="bg-[#0e1017]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-4 relative">
                                        {/* Arrow pointer */}
                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0e1017] border-l border-t border-white/15 rotate-45" />

                                        {/* Stats grid */}
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            {profile.stats.map((stat) => (
                                                <div
                                                    key={stat.label}
                                                    className="text-center py-2 px-2 rounded-xl bg-white/[0.04] border border-white/10"
                                                >
                                                    <p className="text-sm font-bold text-white tracking-tight">{stat.value}</p>
                                                    <p className="text-[10px] text-white/50 font-medium mt-0.5 uppercase tracking-wider">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Highlight note */}
                                        <div className="flex items-center justify-center gap-2 px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/10">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                                            <p className="text-[11px] text-center font-medium text-white/80">
                                                {profile.highlight}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CodingProfiles;
