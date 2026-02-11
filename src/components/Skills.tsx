import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
    {
        title: "Programming Languages",
        skills: ["Python", "Java", "C++", "C"],
        color: "text-blue-400"
    },
    {
        title: "AI & Data Science",
        skills: ["Agentic AI", "RAG Systems", "LLMs (Llama-3, Gemini)", "Data Analytics", "Computer Vision (YOLO)", "NLP", "Pandas", "Scikit Learn"],
        color: "text-purple-400"
    },
    {
        title: "Frontend Development",
        skills: ["React", "TypeScript", "Next.js", "GSAP", "TailwindCSS", "HTML5", "CSS3"],
        color: "text-cyan-400"
    },
    {
        title: "Tools & Platforms",
        skills: ["Git", "GitHub", "VS Code", "Jupyter", "Linux", "Docker", "Postman"],
        color: "text-green-400"
    }
];

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const skills = containerRef.current?.querySelectorAll('.skill-card');
        const heading = containerRef.current?.querySelector('h2');

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

        // Animate skill cards with gentle fade + scale (no sideways jumping)
        skills?.forEach((skill, i) => {
            gsap.fromTo(skill,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: skill,
                        start: "top bottom-=80",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }, []);

    return (
        <section id="skills" ref={containerRef} className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <h2 className="text-4xl md:text-5xl font-semibold mb-16 text-center tracking-tight">
                    Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Skills</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {skillCategories.map((category, index) => (
                        <div key={index} className="skill-card space-y-6 p-6 rounded-2xl bg-card/20 backdrop-blur-sm border border-white/5 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:bg-card/30 group">

                            <h3 className={`text-2xl font-semibold mb-4 border-b border-white/10 pb-2 ${category.color}`}>
                                {category.title}
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill, i) => (
                                    <span key={i} className="inline-block px-3 py-1 rounded-md text-sm font-medium bg-white/5 text-muted-foreground group-hover:text-white group-hover:bg-white/10 transition-all duration-300 cursor-default hover:scale-105">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
    );
};

export default Skills;
