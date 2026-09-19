import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Medal, ArrowUpRight, Eye, X } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const experience = [
    {
        title: "Backend AI Engineering Intern",
        company: "FlyRank.ai",
        period: "July 2026 - September 2026 (2.5 months)",
        description: "Completed Backend AI Engineering internship program at FlyRank.ai (FlyRank Corp.). Demonstrated excellence in backend AI systems, technical competency, and collaborative engineering. (Credential ID: FR-D11-C6946-B9F28)",
        stack: ["Backend AI", "AI Engineering", "Python", "FastAPI", "LLMs"],
        certificateUrl: "/Images/FlyRank-Internship-Certificate.png"
    },
    {
        title: "Gen AI Intern",
        company: "SURE TRUST",
        period: "February 2026 - Present (6 months)",
        description: "Learned about  LLMs, similarity search, RAG and ai agents and building family health concierge ai agent",
        stack: ["Generative AI", "LLMs", "RAG", "Agentic Workflows"]
    },
    {
        title: "AI/ML Intern",
        company: "UPTOSKILLS",
        period: "December 2025 - March 2026 (3 months)",
        description: "Built CodeSkills, a LeetCode-style platform for practicing coding problems and applied AI skills (model fine-tuning), using a FastAPI backend and React.js frontend. Developed an LLM-powered question generation pipeline, fine-tuning models to auto-generate domain-specific coding practice problems at scale. (Verified at hr@uptoskills.com)",
        stack: ["Generative AI", "FineTuning", "FastAPI", "React.js"],
        certificateUrl: "/Images/UptoSkills-AIML-Internship-Certificate.png"
    },
    {
        title: "AI for Sustainabilty virtual Intern",
        company: "1M1B (1 Million for 1 Billion)",
        period: "December 2025 - January 2026 (2 months)",
        description: "Gained practical experience in AI and ML workflows, contributing to impactful tech solutions.",
        stack: ["AI/ML", "Sustainability"]
    },
    {
        title: "Google Cloud Generative AI Virtual Intern",
        company: "TheSmartBridge",
        period: "November 2025 - January 2026 (3 months)",
        description: "Completed a comprehensive virtual internship on Google Cloud Gen AI. Worked with Gemini, NotebookLM, and Vertex AI. Mastered prompt engineering, RAG, and responsible AI concepts.",
        stack: ["Google Cloud", "Gemini", "Vertex AI", "RAG"]
    },
    {
        title: "Web Developer",
        company: "Elevate Labs",
        period: "November 2025 - December 2025 (2 months)",
        description: "Collaborated on web development projects, ensuring responsive design and seamless user experiences.",
        stack: ["React", "Html", "JavaScript", "CSS"]
    }
];

const Experience = () => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const sidePreviewRef = useRef<HTMLDivElement>(null);
    const [previewModal, setPreviewModal] = useState<{ title: string; company: string; imageUrl: string } | null>(null);

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

    useEffect(() => {
        const items = timelineRef.current?.querySelectorAll('.timeline-item');
        const heading = timelineRef.current?.parentElement?.querySelector('h2');
        const description = timelineRef.current?.parentElement?.querySelector('.section-description');

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
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate description
        if (description) {
            gsap.fromTo(description,
                { opacity: 0, y: -20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: description,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate timeline items
        items?.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };

    }, []);

    return (
        <section id="experience" className="py-24 px-6 md:px-12 bg-background relative overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                        Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Experience</span>
                    </h2>
                    <p className="section-description text-muted-foreground/80 max-w-2xl mx-auto text-sm md:text-base">
                        A journey through impactful internships and collaborations, building AI-driven solutions and gaining hands-on experience in cutting-edge technologies.
                    </p>
                </div>

                <div ref={timelineRef} className="relative border-l-2 border-white/10 ml-4 md:ml-12 space-y-12">
                    {experience.map((exp, index) => (
                        <div key={index} className="timeline-item relative pl-8 md:pl-16 group">
                            {/* Connector Dot */}
                            <div className="absolute left-[-9px] top-6 w-4 h-4 rounded-full bg-background border-2 border-secondary group-hover:bg-secondary group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.3)]" />

                            <div className="p-6 md:p-8 rounded-2xl bg-card/20 border border-white/5 hover:border-secondary/30 transition-all duration-300 hover:bg-card/40 backdrop-blur-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-secondary-glow transition-colors">
                                            {exp.title}
                                        </h3>
                                        <h4 className="text-lg text-primary font-medium">{exp.company}</h4>
                                    </div>
                                    <span className="text-sm font-mono text-muted-foreground bg-white/5 px-3 py-1 rounded-md whitespace-nowrap border border-white/5">
                                        {exp.period}
                                    </span>
                                </div>

                                <p className="text-muted-foreground/90 leading-relaxed mb-4 font-light">
                                    {exp.description}
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {exp.stack.map((tech, i) => (
                                            <span key={i} className="text-xs font-mono text-secondary/80 bg-secondary/10 px-2 py-1 rounded">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    {(exp as any).certificateUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setPreviewModal({
                                                title: exp.title,
                                                company: exp.company,
                                                imageUrl: (exp as any).certificateUrl
                                            })}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400 px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer active:scale-95"
                                        >
                                            <Medal size={15} weight="bold" />
                                            <span>View Certificate</span>
                                            <Eye size={14} weight="bold" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Bigger Internship Certificate Side Preview at Middle-Right (does NOT occupy whole window, clear of bottom chat button) */}
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
                                Internship Certificate
                            </span>
                            <h4 className="text-base font-bold text-white tracking-tight leading-snug truncate">
                                {previewModal.title}
                            </h4>
                            <p className="text-xs text-primary font-medium truncate">{previewModal.company}</p>
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

                    {/* Image Container (Larger & Clearer) */}
                    <div className="rounded-xl overflow-hidden bg-black/70 border border-white/10 flex items-center justify-center p-2.5 group flex-1 min-h-0">
                        <img
                            src={previewModal.imageUrl}
                            alt={previewModal.title}
                            className="w-full h-auto max-h-[56vh] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-3 mt-3 pb-1 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
                        <span className="text-white/40 text-[11px]">Click outside or press Esc to close</span>
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

export default Experience;
