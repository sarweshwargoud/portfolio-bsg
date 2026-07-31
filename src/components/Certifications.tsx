import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Medal, Code, Trophy, Eye } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const certifications = [
    {
        title: "OCI Certified AI Foundations Associate",
        issuer: "Oracle",
        date: "2024",
        color: "from-red-500 to-orange-500",
        categories: ["AI & ML", "Cloud"],
        certificateUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=7B2DAB82A42F90A2C510796C3D98681EC8B8C94632C5230C439225C3F08717EF"
    },
    {
        title: "Retrieval-Augmented Generation (RAG)",
        issuer: "Coursera",
        date: "2025",
        color: "from-blue-500 to-cyan-500",
        categories: ["AI & ML"],
        certificateUrl: "https://www.coursera.org/account/accomplishments/verify/4Q4HJVBV0UW7"
    },
    {
        title: "Career Essentials in Generative AI",
        issuer: "Microsoft & LinkedIn",
        date: "2024",
        color: "from-blue-600 to-blue-400",
        categories: ["AI & ML"],
        certificateUrl: "https://www.linkedin.com/learning/certificates/00f9b1c363487a4d2bfc214af9264ba89f00fdb266824381d42399253156a723/"
    },
    {
        title: "Building Agentic Workflows in Python",
        issuer: "Hack2skill",
        date: "2025",
        color: "from-green-500 to-emerald-500",
        categories: ["AI & ML", "Development"],
        certificateUrl: "https://certificate.hack2skill.com/user/awsworkshop4/2025H2S11AB-W400088"
    },
    {
        title: "Responsive Web Design",
        issuer: "freeCodeCamp",
        date: "2023",
        color: "from-yellow-500 to-orange-500",
        categories: ["Development"],
        certificateUrl: "https://www.freecodecamp.org/certification/Sarweshwar/responsive-web-design"
    }
];

const Certifications = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const cardInner = card.querySelector('.cert-card-inner') as HTMLDivElement;
        if (!cardInner) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = -(y - centerY) / 12;
        const rotateY = (x - centerX) / 12;
        
        cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const cardInner = card.querySelector('.cert-card-inner') as HTMLDivElement;
        if (cardInner) {
            cardInner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
    };

    // Stagger animation on cards when category filter changes
    useEffect(() => {
        const cards = containerRef.current?.querySelectorAll('.cert-card');
        if (cards && cards.length > 0) {
            gsap.fromTo(cards,
                { opacity: 0, scale: 0.92, y: 15 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out",
                    overwrite: "auto"
                }
            );
        }
    }, [selectedCategory]);

    useEffect(() => {
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
    }, []);

    const filteredCerts = selectedCategory === "All"
        ? certifications
        : certifications.filter(cert => cert.categories.includes(selectedCategory));

    return (
        <section id="certifications" className="py-24 px-6 md:px-12 bg-background relative overflow-hidden border-t border-white/5">
            <div ref={containerRef} className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                        Certifications <span className="text-primary">&</span> <span className="text-secondary">Achievements</span>
                    </h2>
                    <p className="section-description text-muted-foreground/80 max-w-2xl mx-auto text-sm md:text-base">
                        Validating skills through industry-recognized certifications and competitive coding.
                    </p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-16 relative z-10">
                    {["All", "AI & ML", "Cloud", "Development"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                                selectedCategory === cat
                                    ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-[0_0_15px_rgba(124,58,237,0.25)] scale-105"
                                    : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 premium-3d-container">
                    {filteredCerts.map((cert, index) => (
                        <div 
                            key={index} 
                            className="cert-card group relative p-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-primary/40 hover:to-secondary/40 transition-all duration-500"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="cert-card-inner premium-3d-card shine-sweep relative h-full bg-card/25 backdrop-blur-xl p-8 rounded-[23px] overflow-hidden border border-white/5 group-hover:border-transparent transition-all flex flex-col justify-between">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cert.color} blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity`} />

                                <div>
                                    <div className="flex items-center justify-between mb-6 translate-z-md">
                                        <Medal size={32} className="text-secondary" weight="duotone" />
                                        <div className="flex flex-wrap gap-1.5 justify-end">
                                            {cert.categories.map((cat, i) => (
                                                <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-white/5 rounded-full text-white/70">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary-glow transition-all translate-z-md">
                                        {cert.title}
                                    </h3>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5 translate-z-sm">
                                        <span className="text-sm text-muted-foreground">{cert.issuer}</span>
                                        <span className="text-xs font-mono px-2 py-1 bg-white/5 rounded text-white/60">{cert.date}</span>
                                    </div>

                                    {/* View Certificate Button */}
                                    {cert.certificateUrl && (
                                        <a
                                            href={cert.certificateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 rounded-xl text-primary text-sm font-medium transition-all duration-300 group/btn translate-z-sm"
                                        >
                                            <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            View Certificate
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] animate-pulse" />
            </div>
        </section>
    );
};

export default Certifications;
