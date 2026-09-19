import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Medal, Eye, ArrowRight, X, ArrowUpRight, CaretLeft, CaretRight } from 'phosphor-react';

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
        issuer: "Oracle University",
        date: "2026",
        gradient: "from-red-600 via-orange-500 to-amber-500",
        accentBg: "bg-red-500/10",
        accentBorder: "border-red-500/20",
        accentText: "text-red-500",
        categories: ["Agentic AI", "AI & ML"],
        certificateUrl: "/Images/Oracle-Agentic-AI-Foundations-Certificate.png",
        verificationUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=C7FB8D23CC99AB62AD50154B42011DB744068E632E4FE7662C0A5189D9B98FED"
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
    const [previewModal, setPreviewModal] = useState<{ title: string; issuer: string; imageUrl: string; verificationUrl?: string } | null>(null);

    const sidePreviewRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isUserInteractingRef = useRef<boolean>(false);
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isDraggingRef = useRef<boolean>(false);
    const dragStartXRef = useRef<number>(0);
    const dragStartScrollLeftRef = useRef<number>(0);

    // Close modal on Escape key press or click outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreviewModal(null);
        };
        const handleClickOutside = (e: MouseEvent) => {
            if (sidePreviewRef.current && !sidePreviewRef.current.contains(e.target as Node)) {
                setPreviewModal(null);
            }
        };
        if (previewModal) {
            window.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [previewModal]);

    // Combined smooth auto-scroll + infinite wrapping loop
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let animId: number;
        let lastTime = performance.now();

        const loop = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            if (!isPaused && !isUserInteractingRef.current) {
                // ~80px per second for smooth, pleasant cruising speed
                const step = (80 * Math.min(delta, 100)) / 1000;
                container.scrollLeft += step;

                const oneThird = container.scrollWidth / 3;
                if (oneThird > 0) {
                    if (container.scrollLeft >= oneThird * 2) {
                        container.scrollLeft -= oneThird;
                    } else if (container.scrollLeft <= 5) {
                        container.scrollLeft += oneThird;
                    }
                }
            }

            animId = requestAnimationFrame(loop);
        };

        animId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animId);
    }, [isPaused]);

    // Handle sideways trackpad gesture or mouse wheel scroll
    const handleWheel = (e: React.WheelEvent) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        isUserInteractingRef.current = true;

        // Support horizontal wheel (deltaX) as well as vertical wheel (deltaY) over the track
        const delta = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
        container.scrollLeft += delta;

        const oneThird = container.scrollWidth / 3;
        if (oneThird > 0) {
            if (container.scrollLeft >= oneThird * 2) {
                container.scrollLeft -= oneThird;
            } else if (container.scrollLeft <= 5) {
                container.scrollLeft += oneThird;
            }
        }

        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => {
            isUserInteractingRef.current = false;
        }, 1200);
    };

    // Native scroll event - handle seamless infinite wrap-around
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const oneThird = container.scrollWidth / 3;
        if (oneThird > 0) {
            if (container.scrollLeft >= oneThird * 2) {
                container.scrollLeft -= oneThird;
            } else if (container.scrollLeft <= 5) {
                container.scrollLeft += oneThird;
            }
        }
    };

    const handleTouchStart = () => {
        isUserInteractingRef.current = true;
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    };

    const handleTouchEnd = () => {
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => {
            isUserInteractingRef.current = false;
        }, 1200);
    };

    // Mouse drag to scroll sideways
    const handleMouseDown = (e: React.MouseEvent) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        if ((e.target as HTMLElement).closest('button, a')) return;

        isDraggingRef.current = true;
        isUserInteractingRef.current = true;
        dragStartXRef.current = e.pageX;
        dragStartScrollLeftRef.current = container.scrollLeft;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;
        const container = scrollContainerRef.current;
        if (!container) return;
        e.preventDefault();
        const dx = e.pageX - dragStartXRef.current;
        container.scrollLeft = dragStartScrollLeftRef.current - dx;
    };

    const handleMouseUpOrLeave = () => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
        }
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => {
            isUserInteractingRef.current = false;
        }, 1200);
    };

    const scrollByDelta = (dir: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;
        isUserInteractingRef.current = true;
        const offset = dir === 'left' ? -380 : 380;
        container.scrollBy({ left: offset, behavior: 'smooth' });
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => {
            isUserInteractingRef.current = false;
        }, 2000);
    };

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

            {/* ── Marquee & Horizontal Scroll Track ── */}
            <div className="relative group/carousel">
                {/* Left fade mask */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none hidden sm:block"
                    style={{ background: 'linear-gradient(to right, rgba(9,9,11,0.95) 0%, transparent 100%)' }}
                />
                {/* Right fade mask */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none hidden sm:block"
                    style={{ background: 'linear-gradient(to left, rgba(9,9,11,0.95) 0%, transparent 100%)' }}
                />

                {/* Left Arrow Button */}
                <button
                    type="button"
                    onClick={() => scrollByDelta('left')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/20 text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/carousel:opacity-100 backdrop-blur-md cursor-pointer"
                    aria-label="Scroll left"
                >
                    <CaretLeft size={22} weight="bold" />
                </button>

                {/* Right Arrow Button */}
                <button
                    type="button"
                    onClick={() => scrollByDelta('right')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/20 text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/carousel:opacity-100 backdrop-blur-md cursor-pointer"
                    aria-label="Scroll right"
                >
                    <CaretRight size={22} weight="bold" />
                </button>

                {/* Outer horizontally scrollable container */}
                <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto py-4 px-2 select-none cursor-grab active:cursor-grabbing scrollbar-none"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                    }}
                    onWheel={handleWheel}
                    onScroll={handleScroll}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => {
                        setIsPaused(false);
                        setHoveredIndex(null);
                        handleMouseUpOrLeave();
                    }}
                >
                    {/* Scrolling track */}
                    <div className="flex gap-6 w-max">
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
                                                                setPreviewModal({
                                                                    title: cert.title,
                                                                    issuer: cert.issuer,
                                                                    imageUrl: cert.certificateUrl,
                                                                    verificationUrl: (cert as any).verificationUrl
                                                                });
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
                <p className="text-xs font-medium flex items-center gap-2 text-white/50">
                    <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            isPaused ? 'bg-primary animate-pulse' : 'bg-emerald-400'
                        }`}
                    />
                    <span>
                        {isPaused
                            ? 'Paused — swipe sideways, drag, or use arrows'
                            : 'Auto-scrolling • Swipe, drag, or scroll sideways to explore'}
                    </span>
                </p>
            </div>

            {/* Bigger Side Preview Card at Middle-Right (does NOT occupy whole window, clear of bottom chat button) */}
            {previewModal && (
                <div 
                    ref={sidePreviewRef}
                    className="fixed top-1/2 -translate-y-1/2 right-3 sm:right-6 md:right-8 z-50 w-[calc(100vw-24px)] sm:w-[540px] md:w-[620px] lg:w-[680px] bg-zinc-950/95 border border-white/20 rounded-2xl p-4 sm:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-right-8 flex flex-col max-h-[88vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
                        <div className="pr-3 min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block mb-1">
                                Certificate Preview
                            </span>
                            <h4 className="text-base font-bold text-white tracking-tight leading-snug truncate">
                                {previewModal.title}
                            </h4>
                            <p className="text-xs text-white/50 truncate">{previewModal.issuer}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <a
                                href={previewModal.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Open full view in new tab"
                            >
                                <ArrowUpRight size={18} weight="bold" />
                            </a>
                            <button
                                onClick={() => setPreviewModal(null)}
                                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                aria-label="Close preview"
                            >
                                <X size={20} weight="bold" />
                            </button>
                        </div>
                    </div>

                    {/* Image Preview Container (Larger & Clearer) */}
                    <div className="rounded-xl overflow-hidden bg-black/70 border border-white/10 flex items-center justify-center p-2.5 group flex-1 min-h-0">
                        <img
                            src={previewModal.imageUrl}
                            alt={previewModal.title}
                            className="w-full h-auto max-h-[56vh] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-3 mt-3 pb-1 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
                        {previewModal.verificationUrl ? (
                            <a
                                href={previewModal.verificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-primary hover:text-primary-glow font-medium transition-colors"
                            >
                                <span>Verify official badge</span>
                                <ArrowUpRight size={13} weight="bold" />
                            </a>
                        ) : (
                            <span className="text-white/40 text-[11px]">Click outside or press Esc to close</span>
                        )}
                        <a
                            href={previewModal.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-secondary hover:text-white font-medium transition-colors"
                        >
                            <span>Open full size</span>
                            <ArrowUpRight size={13} weight="bold" />
                        </a>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Certifications;
