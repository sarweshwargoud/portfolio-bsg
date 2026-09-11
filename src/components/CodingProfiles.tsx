import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitBranch, Star, ArrowSquareOut, Code, Trophy, ArrowRight } from 'phosphor-react';
import { SiLeetcode, SiHackerrank, SiGithub } from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
interface GitHubStats {
    public_repos: number;
    followers: number;
    following: number;
    name: string;
    bio: string;
    location: string;
    created_at: string;
}

// ─── Static fallback data (pre-fetched from GitHub API) ───────────────────────
const GITHUB_USERNAME = 'sarweshwargoud';
const LEETCODE_USERNAME = 'sarweshwar_goud';
const HACKERRANK_USERNAME = 'b_sarweshwar445';

const pinnedRepos = [
    {
        name: 'AI-Roadmap-Zero2Hero',
        description: 'A comprehensive roadmap for learning AI from scratch to hero.',
        stars: 29,
        lang: 'Markdown',
        langColor: '#e34c26',
        url: 'https://github.com/sarweshwargoud/AI-Roadmap-Zero2Hero',
    },
    {
        name: 'Family-AI-Health-Concierge',
        description: 'AI-powered family healthcare platform using OCR, RAG, embeddings & Gemini.',
        stars: 0,
        lang: 'TypeScript',
        langColor: '#3178c6',
        url: 'https://github.com/sarweshwargoud/Family-AI-Health-Concierge',
    },
    {
        name: 'llmSafetyEvaluator',
        description: 'Hybrid AI security tool detecting adversarial inputs in LLM apps in real time.',
        stars: 0,
        lang: 'Python',
        langColor: '#3572A5',
        url: 'https://github.com/sarweshwargoud/llmSafetyEvaluator',
    },
];

const hackerRankBadges = [
    { name: 'Problem Solving', level: 'Gold', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/25' },
    { name: 'Python', level: 'Gold', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/25' },
    { name: 'SQL', level: 'Silver', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/25' },
];

// ─── Stat pill ────────────────────────────────────────────────────────────────
const StatPill = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
    <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-white/60 border border-slate-200/60 backdrop-blur-sm min-w-[80px]">
        <span className={`text-xl font-bold ${color}`}>{value}</span>
        <span className="text-xs text-slate-500 mt-0.5 font-medium">{label}</span>
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const CodingProfiles = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [ghStats, setGhStats] = useState<GitHubStats | null>(null);

    // Live-fetch GitHub profile (public, no auth needed)
    useEffect(() => {
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
            .then(r => r.json())
            .then((data: GitHubStats) => setGhStats(data))
            .catch(() => {}); // silently fall back
    }, []);

    // Scroll entrance animations
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        gsap.fromTo(section.querySelector('.cp-header'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
              scrollTrigger: { trigger: section, start: 'top bottom-=120', toggleActions: 'play none none reverse' } }
        );

        const cards = section.querySelectorAll('.profile-block');
        cards.forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, y: 50, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.65, delay: i * 0.1, ease: 'power2.out',
                  scrollTrigger: { trigger: card, start: 'top bottom-=60', toggleActions: 'play none none reverse' } }
            );
        });
    }, []);

    // 3D tilt handlers
    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const { left, top, width, height } = el.getBoundingClientRect();
        const rx = -((e.clientY - top - height / 2) / 14);
        const ry = (e.clientX - left - width / 2) / 14;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    };
    const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    };

    const repos = ghStats ? ghStats.public_repos : 39;
    const followers = ghStats ? ghStats.followers : 2;

    return (
        <section
            id="coding-profiles"
            ref={sectionRef}
            className="py-24 px-6 md:px-12 bg-transparent relative overflow-hidden border-t border-slate-200/30"
        >
            {/* Ambient glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* ── Header ── */}
                <div className="cp-header text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
                        Coding{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Profiles
                        </span>
                    </h2>
                    <p className="text-slate-500 max-w-xl mx-auto text-base font-light leading-relaxed">
                        Sharpening problem-solving skills through competitive programming and open-source contributions.
                    </p>
                </div>

                {/* ── Cards Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ───────────────── GITHUB ───────────────── */}
                    <div
                        className="profile-block lg:col-span-2 rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/60 shadow-sm overflow-hidden"
                        style={{ transition: 'transform 0.12s ease-out', transformStyle: 'preserve-3d' }}
                        onMouseMove={onMove}
                        onMouseLeave={onLeave}
                    >
                        {/* Header bar */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-900/5 border border-slate-200/60">
                                    <SiGithub size={22} className="text-slate-800" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">@{GITHUB_USERNAME}</p>
                                    <p className="text-xs text-slate-400">Building AI systems that turn data into decisions</p>
                                </div>
                            </div>
                            <a
                                href={`https://github.com/${GITHUB_USERNAME}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                View Profile <ArrowSquareOut size={13} />
                            </a>
                        </div>

                        {/* Stats row */}
                        <div className="flex flex-wrap gap-3 px-6 py-5 border-b border-slate-100">
                            <StatPill label="Repositories" value={repos} color="text-slate-800" />
                            <StatPill label="Followers" value={followers} color="text-slate-800" />
                            <StatPill label="Top Stars" value="29 ⭐" color="text-yellow-500" />
                            <StatPill label="Since" value="2023" color="text-primary" />
                        </div>

                        {/* GitHub Contribution Graph (official SVG embed) */}
                        <div className="px-6 pt-4 pb-2">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <GitBranch size={11} /> Contribution Activity
                            </p>
                            <div className="rounded-xl overflow-hidden border border-slate-100 bg-white">
                                <img
                                    src={`https://ghchart.rshah.org/6d28d9/${GITHUB_USERNAME}`}
                                    alt="GitHub Contribution Chart"
                                    className="w-full"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Pinned repos */}
                        <div className="px-6 py-5">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Star size={11} /> Pinned Repositories
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {pinnedRepos.map((repo) => (
                                    <a
                                        key={repo.name}
                                        href={repo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col gap-2 p-3 rounded-xl border border-slate-200/70 hover:border-primary/40 bg-white/80 hover:shadow-sm transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors truncate pr-1">
                                                {repo.name}
                                            </span>
                                            <ArrowRight size={12} className="text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{repo.description}</p>
                                        <div className="flex items-center justify-between mt-auto pt-1">
                                            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                    style={{ background: repo.langColor }}
                                                />
                                                {repo.lang}
                                            </span>
                                            {repo.stars > 0 && (
                                                <span className="flex items-center gap-0.5 text-[10px] text-yellow-500 font-bold">
                                                    <Star size={10} weight="fill" /> {repo.stars}
                                                </span>
                                            )}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ───────────────── RIGHT COLUMN ───────────────── */}
                    <div className="flex flex-col gap-6">

                        {/* LEETCODE */}
                        <div
                            className="profile-block rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/60 shadow-sm overflow-hidden"
                            style={{ transition: 'transform 0.12s ease-out', transformStyle: 'preserve-3d' }}
                            onMouseMove={onMove}
                            onMouseLeave={onLeave}
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-[#FFA116]/10 border border-[#FFA116]/25">
                                        <SiLeetcode size={18} className="text-[#FFA116]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">LeetCode</p>
                                        <p className="text-[11px] text-slate-400">@{LEETCODE_USERNAME}</p>
                                    </div>
                                </div>
                                <a
                                    href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#FFA116] hover:text-[#FFA116]/70 transition-colors"
                                >
                                    <ArrowSquareOut size={15} />
                                </a>
                            </div>

                            {/* LeetCode stats card via github-readme-stats style */}
                            <div className="p-4">
                                <img
                                    src={`https://leetcard.jacoblin.cool/${LEETCODE_USERNAME}?theme=light&font=Outfit&ext=contest&border=0`}
                                    alt="LeetCode Stats"
                                    className="w-full rounded-xl border border-slate-100"
                                    loading="lazy"
                                    onError={(e) => {
                                        // fallback static info if image fails
                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                {/* Fallback pills shown always as supplement */}
                                <div className="flex gap-2 mt-3">
                                    <div className="flex-1 text-center py-2 rounded-lg bg-green-500/8 border border-green-500/15">
                                        <p className="text-xs font-bold text-green-600">Easy</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Solved</p>
                                    </div>
                                    <div className="flex-1 text-center py-2 rounded-lg bg-yellow-500/8 border border-yellow-500/15">
                                        <p className="text-xs font-bold text-yellow-600">Medium</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Solved</p>
                                    </div>
                                    <div className="flex-1 text-center py-2 rounded-lg bg-red-500/8 border border-red-500/15">
                                        <p className="text-xs font-bold text-red-500">Hard</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Solved</p>
                                    </div>
                                </div>
                                <a
                                    href="https://github.com/sarweshwargoud/leetcode"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-[#FFA116] transition-colors"
                                >
                                    <Code size={12} /> View solutions on GitHub
                                </a>
                            </div>
                        </div>

                        {/* HACKERRANK */}
                        <div
                            className="profile-block rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/60 shadow-sm overflow-hidden"
                            style={{ transition: 'transform 0.12s ease-out', transformStyle: 'preserve-3d' }}
                            onMouseMove={onMove}
                            onMouseLeave={onLeave}
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-[#2EC866]/10 border border-[#2EC866]/25">
                                        <SiHackerrank size={18} className="text-[#2EC866]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">HackerRank</p>
                                        <p className="text-[11px] text-slate-400">@{HACKERRANK_USERNAME}</p>
                                    </div>
                                </div>
                                <a
                                    href={`https://www.hackerrank.com/profile/${HACKERRANK_USERNAME}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#2EC866] hover:text-[#2EC866]/70 transition-colors"
                                >
                                    <ArrowSquareOut size={15} />
                                </a>
                            </div>

                            <div className="p-5">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <Trophy size={11} /> Earned Badges
                                </p>
                                <div className="flex flex-col gap-2.5">
                                    {hackerRankBadges.map((badge) => (
                                        <div
                                            key={badge.name}
                                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${badge.bg} ${badge.border}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Trophy size={14} weight="fill" className={badge.color} />
                                                <span className="text-sm font-semibold text-slate-700">{badge.name}</span>
                                            </div>
                                            <span className={`text-xs font-bold ${badge.color}`}>{badge.level}</span>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href={`https://www.hackerrank.com/profile/${HACKERRANK_USERNAME}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#2EC866]/8 border border-[#2EC866]/20 text-[#2EC866] text-sm font-semibold hover:bg-[#2EC866]/15 transition-colors"
                                >
                                    View Profile <ArrowRight size={13} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── GitHub Stats Banner (github-readme-stats) ── */}
                <div className="mt-6 profile-block rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                        <SiGithub size={16} className="text-slate-600" />
                        <span className="text-sm font-semibold text-slate-600">GitHub Stats Overview</span>
                    </div>
                    <div className="p-5 flex flex-wrap gap-4 justify-center">
                        <img
                            src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=default&hide_border=true&bg_color=ffffff00&title_color=6d28d9&text_color=475569&icon_color=0ea5e9&include_all_commits=true`}
                            alt="GitHub Stats"
                            className="h-[160px] rounded-xl"
                            loading="lazy"
                        />
                        <img
                            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&hide_border=true&bg_color=ffffff00&title_color=6d28d9&text_color=475569&langs_count=6`}
                            alt="Top Languages"
                            className="h-[160px] rounded-xl"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CodingProfiles;
