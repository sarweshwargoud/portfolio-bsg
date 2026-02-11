import { useEffect, useRef } from 'react';
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
        certificateUrl: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=7B2DAB82A42F90A2C510796C3D98681EC8B8C94632C5230C439225C3F08717EF" // Add your certificate URL here
    },
    {
        title: "Retrieval-Augmented Generation (RAG)",
        issuer: "Coursera",
        date: "2025",
        color: "from-blue-500 to-cyan-500",
        certificateUrl: "https://www.coursera.org/account/accomplishments/verify/4Q4HJVBV0UW7" // Add your certificate URL here
    },
    {
        title: "Career Essentials in Generative AI",
        issuer: "Microsoft & LinkedIn",
        date: "2024",
        color: "from-blue-600 to-blue-400",
        certificateUrl: "linkedin.com/learning/certificates/00f9b1c363487a4d2bfc214af9264ba89f00fdb266824381d42399253156a723/" // Add your certificate URL here
    },
    {
        title: "Building Agentic Workflows in Python",
        issuer: "Hack2skill",
        date: "2025",
        color: "from-green-500 to-emerald-500",
        certificateUrl: "https://certificate.hack2skill.com/user/awsworkshop4/2025H2S11AB-W400088" // Add your certificate URL here
    },
    {
        title: "Responsive Web Design",
        issuer: "freeCodeCamp",
        date: "2023",
        color: "from-yellow-500 to-orange-500",
        certificateUrl: "https://www.freecodecamp.org/certification/Sarweshwar/responsive-web-design" // Add your certificate URL here
    }
];

const Certifications = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cards = containerRef.current?.querySelectorAll('.cert-card');
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

        // Animate certification cards with gentle fade + scale (no sideways jumping)
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
        <section id="certifications" className="py-24 px-6 md:px-12 bg-background relative overflow-hidden">
            <div ref={containerRef} className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                        Certifications <span className="text-primary">&</span> <span className="text-secondary">Achievements</span>
                    </h2>
                    <p className="section-description text-muted-foreground/80 max-w-2xl mx-auto text-sm md:text-base">
                        Validating skills through industry-recognized certifications and competitive coding.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {certifications.map((cert, index) => (
                        <div key={index} className="cert-card group relative p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent hover:from-primary/50 hover:to-secondary/50 transition-all duration-500">
                            <div className="relative h-full bg-card/40 backdrop-blur-xl p-8 rounded-xl overflow-hidden border border-white/5 group-hover:border-transparent transition-all">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cert.color} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />

                                <Medal size={32} className="text-white mb-6" />

                                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                                    {cert.title}
                                </h3>

                                <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                                    <span className="text-sm text-muted-foreground">{cert.issuer}</span>
                                    <span className="text-xs font-mono px-2 py-1 bg-white/5 rounded text-white/60">{cert.date}</span>
                                </div>

                                {/* View Certificate Button */}
                                {cert.certificateUrl && (
                                    <a
                                        href={cert.certificateUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 rounded-lg text-primary text-sm font-medium transition-all duration-300 group/btn"
                                    >
                                        <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
                                        View Certificate
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* 3D Floating Elements */}
            <div className="absolute top-1/2 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] animate-pulse" />
            </div>
        </section>
    );
};

export default Certifications;
