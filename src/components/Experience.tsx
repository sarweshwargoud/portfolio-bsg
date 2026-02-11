import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const experience = [
    {
        title: "AI/ML Intern",
        company: "UPTOSKILLS",
        period: "December 2025 - Present (3 months)",
        description: "Working and contributing in building AI-driven projects.",
        stack: ["Generative Ai", "FineTuning"]
    },

    {
        title: "Gen AI Intern",
        company: "SURE TRUST",
        period: "December 2025 - Present (3 months)",
        description: "Assisting in generative AI initiatives and contributing to AI-driven projects.",
        stack: ["Generative AI", "LLMs", "RAG", "Agentic Workflows"]
    },
    {
        title: "Artificial intelligencce and machine learning Intern",
        company: "Edunet Foundation",
        period: "December 2025 - January 2026 (2 months)",
        description: "Intensive internship focused on generative AI applications and development.",
        stack: ["Artificial intelligence", "Machine learning"]
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
        title: "Artificial Intelligence and Machine Learning Intern",
        company: "Elevate Labs",
        period: "November 2025 - December 2025 (2 months)",
        description: "Hands-on internship developing AI/ML models and integrating them into real-world applications.",
        stack: ["Python", "TensorFlow", "Scikit-learn"]
    },
    {
        title: "Web Developer",
        company: "Elevate Labs",
        period: "November 2025 - December 2025 (2 months)",
        description: "Collaborated on web development projects, ensuring responsive design and seamless user experiences.",
        stack: ["React", "Html", "JavaScript", "CSS"]
    },
    {
        title: "AI Developer",
        company: "VISWAM.AI",
        period: "Project-based",
        description: "Contributed my experiance in Helping to Build TELUGU LLM.",
        stack: ["LLM", "Data science"]
    }
];

const Experience = () => {
    const timelineRef = useRef<HTMLDivElement>(null);

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

        items?.forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom-=50",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

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

                                <div className="flex flex-wrap gap-2">
                                    {exp.stack.map((tech, i) => (
                                        <span key={i} className="text-xs font-mono text-secondary/80 bg-secondary/10 px-2 py-1 rounded">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
        </section>
    );
};

export default Experience;
