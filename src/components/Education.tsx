import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const education = [
    {
        school: "Malla Reddy College of Engineering & Technology",
        degree: "Bachelor of Technology - BTech, CSE(AI&ML)",
        period: "August 2024 - May 2027",
        description: "Specializing in Artificial Intelligence and Machine Learning."
    },
    {
        school: "GOVERNMENT POLYTECHNIC MASAB TANK, HYDERABAD",
        degree: "Diploma of Education",
        period: "August 2021 - April 2024",
        description: "Completed diploma in Mechanical engineering."
    },
    {
        school: "Noble High School",
        degree: "High School/Secondary Certificate Programs",
        period: "June 2013 - April 2021",
        description: "Completed schooling with focus on science and mathematics."
    }
];

const Education = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const items = containerRef.current?.querySelectorAll('.edu-item');
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

        // Animate education items with gentle upward slide (no sideways jumping)
        items?.forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom-=80",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, []);

    return (
        <section id="education" className="py-24 px-6 md:px-12 bg-background relative border-t border-white/5">
            <div ref={containerRef} className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                        Education
                    </h2>
                </div>

                <div className="space-y-8">
                    {education.map((edu, index) => (
                        <div key={index} className="edu-item group relative p-8 rounded-2xl bg-card/30 border border-white/5 hover:border-primary/20 transition-all duration-300 hover:bg-card/50">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary-glow transition-colors">
                                    {edu.school}
                                </h3>
                                <span className="text-sm font-mono text-primary/80 bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                                    {edu.period}
                                </span>
                            </div>

                            <h4 className="text-lg text-secondary font-medium mb-2">{edu.degree}</h4>
                            <p className="text-muted-foreground">{edu.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
