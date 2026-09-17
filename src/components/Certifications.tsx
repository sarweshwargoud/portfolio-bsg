import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Medal, Eye, ArrowRight, X, ArrowUpRight } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const certifications = [
    {
        title: "Backend AI Engineering",
        issuer: "FlyRank.ai",
        date: "2026",
        gradient: "from-emerald-500 to-teal-500",
        accentBg: "bg-emerald-500/10",
        accentBorder: "border-emerald-500/20",
        accentText: "text-emerald-500",
        categories: ["AI & ML", "Engineering"],
        certificateUrl: "/Images/FlyRank-Internship-Certificate.png"
    },
    {
        title: "Agentic AI Certified Foundations Associate",
        issuer: "Oracle",
        date: "2026",
        gradient: "from-red-600 via-orange-500 to-amber-500",
        accentBg: "bg-red-500/10",
        accentBorder: "border-red-500/20",
        accentText: "text-red-500",
        categories: ["Agentic AI", "AI & ML"],
        certificateUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=C7FB8D23CC99AB62AD50154B42011DB744068E632E4FE7662C0A5189D9B98FED"
    },
    {
        title: "OCI Certified AI Foundations Associate",
        issuer: "Oracle University",
        date: "2026",
        gradient: "from-red-500 to-orange-500",
        accentBg: "bg-red-500/10",
        accentBorder: "border-red-500/20",
        accentText: "text-red-500",
        categories: ["AI & ML", "Cloud"],
        certificateUrl: "/Images/Oracle-AI-Foundations-Certificate.png"
    },
    {
        title: "AWS Cloud Practitioner Essentials",
        issuer: "AWS Training & Certification",
        date: "2026",
        gradient: "from-amber-500 to-orange-600",
        accentBg: "bg-orange-500/10",
        accentBorder: "border-orange-500/20",
        accentText: "text-orange-500",
        categories: ["Cloud", "AWS"],
        certificateUrl: "/Images/AWS-Cloud-Practitioner-Certificate.png"
    },
    {
        title: "Full Stack AI Engineer 2026 - Generative AI & LLMs",
        issuer: "Udemy • School of AI",
        date: "2026",
        gradient: "from-purple-600 to-indigo-600",
        accentBg: "bg-purple-500/10",
        accentBorder: "border-purple-500/20",
        accentText: "text-purple-500",
        categories: ["Generative AI", "LLMs"],
        certificateUrl: "/Images/Udemy-Full-Stack-AI-Engineer-Certificate.png"
    },
    {
        title: "AI/ML Intern Recognition",
        issuer: "UptoSkills",
        date: "2026",
        gradient: "from-teal-600 to-cyan-500",
        accentBg: "bg-teal-500/10",
        accentBorder: "border-teal-500/20",
        accentText: "text-teal-500",
        categories: ["AI & ML", "Internship"],
        certificateUrl: "/Images/UptoSkills-AIML-Internship-Certificate.png"
    },
    {
        title: "Retrieval-Augmented Generation (RAG)",
        issuer: "Coursera",
        date: "2025",
        gradient: "from-blue-500 to-cyan-500",
        accentBg: "bg-blue-500/10",
        accentBorder: "border-blue-500/20",
        accentText: "text-blue-500",
        categories: ["AI & ML"],
        certificateUrl: "https://www.coursera.org/account/accomplishments/verify/4Q4HJVBV0UW7"
    },
    {
        title: "Career Essentials in Generative AI",
        issuer: "Microsoft & LinkedIn",
        date: "2024",
        gradient: "from-blue-600 to-indigo-500",
        accentBg: "bg-indigo-500/10",
        accentBorder: "border-indigo-500/20",
        accentText: "text-indigo-500",
        categories: ["AI & ML"],
        certificateUrl: "https://www.linkedin.com/learning/certificates/00f9b1c363487a4d2bfc214af9264ba89f00fdb266824381d42399253156a723/"
    },
    {
        title: "Building Agentic Workflows in Python",
        issuer: "Hack2skill",
        date: "2025",
        gradient: "from-green-500 to-emerald-500",
        accentBg: "bg-emerald-500/10",
        accentBorder: "border-emerald-500/20",
        accentText: "text-emerald-500",
        categories: ["AI & ML", "Development"],
        certificateUrl: "https://certificate.hack2skill.com/user/awsworkshop4/2025H2S11AB-W400088"
    },
    {
        title: "Responsive Web Design",
        issuer: "freeCodeCamp",
        date: "2023",
        gradient: "from-yellow-500 to-orange-500",
        accentBg: "bg-yellow-500/10",
        accentBorder: "border-yellow-500/20",
        accentText: "text-yellow-500",
        categories: ["Development"],
        certificateUrl: "https://www.freecodecamp.org/certification/Sarweshwar/responsive-web-design"
    }
];

// Triple the cards so the loop has no visible seam
const marqueeCards = [...certifications, ...certifications, ...certifications];

const Certifications = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [previewModal, setPreviewModal] = useState<{ title: string; issuer: string; imageUrl: string } | null>(null);

    // Header entrance animation
    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse',
            },
        });

        tl.fromTo(
            header.querySelector('.cert-eyebrow'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
        .fromTo(
            header.querySelector('h2'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
            '-=0.3'
        )
        .fromTo(
            header.querySelector('.cert-subtitle'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
        );

        return () => { tl.kill(); };
    }, []);

    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = -(y - cy) / 14;
        const rotateY = (x - cx) / 14;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04,1.04,1.04)`;
    };

    const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform =
            'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    };

    return (
        <section
            id="certifications"
            ref={sectionRef}
            className="py-24 bg-transparent relative overflow-hidden border-t border-slate-200/30"
        >
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            {/* ── Section Header ── */}
            <div ref={headerRef} className="max-w-4xl mx-auto px-6 text-center mb-16 relative z-10">
                <div className="cert-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
                    <Medal size={14} weight="fill" />
                    Credentials
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                    Certifications{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        &amp; Achievements
                    </span>
                </h2>

                <p className="cert-subtitle text-white/60 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
                    Continuous learning, validated.{' '}
                    <span className="text-white/40">
                        Industry-recognized credentials from Oracle, Microsoft, Coursera, and more.
                    </span>
                </p>
            </div>

            {/* ── Marquee Track ── */}
            <div className="relative">
                {/* Left fade mask */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to right, #FCFCFD 0%, transparent 100%)' }}
                />
                {/* Right fade mask */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to left, #FCFCFD 0%, transparent 100%)' }}
                />

                {/* Outer clipping box */}
                <div className="overflow-hidden py-4 px-2">
                    {/* Scrolling track — animation-play-state controls pause/resume without resetting position */}
                    <div
                        className="flex gap-6 w-max"
                        style={{
                            animation: 'certMarquee 45s linear infinite',
                            animationPlayState: isPaused ? 'paused' : 'running',
                            willChange: 'transform',
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => {
                            setIsPaused(false);
                            setHoveredIndex(null);
                        }}
                    >
                        {marqueeCards.map((cert, index) => {
                            const isHovered = hoveredIndex === index;
                            return (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-[320px] md:w-[360px]"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={(e) => {
                                        setHoveredIndex(null);
                                        handleCardMouseLeave(e);
                                    }}
                                    onMouseMove={handleCardMouseMove}
                                    style={{
                                        transition: 'transform 0.12s ease-out',
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    {/* Gradient border wrapper */}
                                    <div
                                        className="p-[1.5px] rounded-2xl transition-all duration-300"
                                        style={{
                                            background: isHovered
                                                ? `linear-gradient(135deg, var(--tw-gradient-stops))`
                                                : 'rgba(203,213,225,0.6)',
                                        }}
                                    >
                                        <div
                                            className={`p-[1.5px] rounded-2xl transition-all duration-300 ${
                                                isHovered
                                                    ? `bg-gradient-to-br ${cert.gradient}`
                                                    : 'bg-slate-200/60'
                                            }`}
                                        >
                                            <div className="relative bg-white/95 backdrop-blur-xl rounded-[14px] p-6 flex flex-col gap-4 min-h-[210px]">
                                                {/* Ambient colour blob */}
                                                <div
                                                    className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${cert.gradient} rounded-[14px] blur-[55px] transition-opacity duration-300 ${
                                                        isHovered ? 'opacity-15' : 'opacity-0'
                                                    }`}
                                                />

                                                {/* Top row */}
                                                <div className="flex items-start justify-between relative z-10">
                                                    <div
                                                        className={`p-2.5 rounded-xl border ${cert.accentBg} ${cert.accentBorder} transition-all duration-300 ${isHovered ? 'shadow-sm scale-110' : ''}`}
                                                    >
                                                        <Medal size={20} weight="fill" className={cert.accentText} />
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg">
                                                            {cert.date}
                                                        </span>
                                                        <div className="flex flex-wrap gap-1 justify-end">
                                                            {cert.categories.map((cat, ci) => (
                                                                <span
                                                                    key={ci}
                                                                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cert.accentBg} ${cert.accentText}`}
                                                                >
                                                                    {cat}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Title + issuer */}
                                                <div className="flex-1 relative z-10">
                                                    <h3
                                                        className={`text-[15px] font-bold leading-snug transition-colors duration-200 ${
                                                            isHovered ? cert.accentText : 'text-slate-800'
                                                        }`}
                                                    >
                                                        {cert.title}
                                                    </h3>
                                                    <p className="text-slate-400 text-sm mt-1 font-medium">
                                                        {cert.issuer}
                                                    </p>
                                                </div>

                                                {/* CTA */}
                                                <div className="border-t border-slate-100 pt-3 relative z-10">
                                                    {cert.certificateUrl.startsWith('/Images/') ? (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPreviewModal({ title: cert.title, issuer: cert.issuer, imageUrl: cert.certificateUrl });
                                                            }}
                                                            className={`flex items-center justify-between w-full text-sm font-semibold transition-all duration-200 group/btn ${
                                                                isHovered
                                                                    ? `${cert.accentText} opacity-100`
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                <Eye size={14} />
                                                                View Certificate
                                                            </span>
                                                            <ArrowRight
                                                                size={14}
                                                                className="transition-transform duration-200 group-hover/btn:translate-x-1"
                                                            />
                                                        </button>
                                                    ) : (
                                                        <a
                                                            href={cert.certificateUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className={`flex items-center justify-between w-full text-sm font-semibold transition-all duration-200 group/btn ${
                                                                isHovered
                                                                    ? `${cert.accentText} opacity-100`
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                <Eye size={14} />
                                                                Verify Credential
                                                            </span>
                                                            <ArrowRight
                                                                size={14}
                                                                className="transition-transform duration-200 group-hover/btn:translate-x-1"
                                                            />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* State hint */}
            <div className="mt-5 flex items-center justify-center">
                <p
                    className={`text-xs font-medium flex items-center gap-2 transition-all duration-300 ${
                        isPaused ? 'text-primary' : 'text-slate-400'
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            isPaused ? 'bg-primary animate-pulse' : 'bg-slate-300'
                        }`}
                    />
                    {isPaused ? 'Paused — move mouse away to resume' : 'Hover any card to pause'}
                </p>
            </div>

            {/* Certificate Image Lightbox Modal */}
            {previewModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
                    onClick={() => setPreviewModal(null)}
                >
                    <div 
                        className="relative max-w-4xl w-full bg-zinc-950 border border-white/15 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">{previewModal.title}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">{previewModal.issuer}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={previewModal.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-secondary hover:text-white px-3 py-1.5 rounded-lg border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 transition-all"
                                >
                                    <span>Open Full View</span>
                                    <ArrowUpRight size={13} weight="bold" />
                                </a>
                                <button
                                    onClick={() => setPreviewModal(null)}
                                    className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto flex items-center justify-center rounded-xl bg-black/40 p-2 border border-white/5">
                            <img
                                src={previewModal.imageUrl}
                                alt={previewModal.title}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Certifications;
