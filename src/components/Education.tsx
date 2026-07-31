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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const cardInner = card.querySelector('.premium-3d-card') as HTMLDivElement;
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
        const cardInner = card.querySelector('.premium-3d-card') as HTMLDivElement;
        if (cardInner) {
            cardInner.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
    };

    useEffect(() => {
        const items = containerRef.current?.querySelectorAll('.edu-item');
        const heading = containerRef.current?.querySelector('h2');
        const line = containerRef.current?.querySelector('.timeline-line');

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

        // Animate the vertical line drawing itself
        if (line) {
            gsap.fromTo(line,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".edu-timeline-container",
                        start: "top center+=150",
                        end: "bottom center+=100",
                        scrub: true
                    }
                }
            );
        }

        // Animate dots popping in
        const dots = containerRef.current?.querySelectorAll('.edu-dot');
        dots?.forEach((dot) => {
            gsap.fromTo(dot,
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: dot,
                        start: "top bottom-=120",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Animate education cards with alternating slide-in from left and right
        items?.forEach((item, i) => {
            const card = item.querySelector('.edu-card-inner');
            const isEven = i % 2 === 0;
            const xOffset = isEven ? 100 : -100;
            
            gsap.fromTo(card,
                { opacity: 0, x: xOffset },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: "power3.out",
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
        <section id="education" className="py-24 px-6 md:px-12 bg-background relative border-t border-white/5 overflow-hidden">
            <div ref={containerRef} className="max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                        Education
                    </h2>
                </div>

                <div className="edu-timeline-container relative space-y-16">
                    {/* Centered line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent -translate-x-1/2 timeline-line origin-top" />

                    {education.map((edu, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div 
                                key={index} 
                                className="edu-item relative flex flex-col md:flex-row items-center justify-between w-full group"
                            >
                                {/* Connector Dot */}
                                <div className="edu-dot absolute left-4 md:left-1/2 top-8 md:top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-background border-4 border-primary group-hover:border-secondary transition-all duration-300 shadow-[0_0_10px_rgba(124,58,237,0.3)]" />

                                {/* Card Container */}
                                <div 
                                    className={`w-full md:w-[45%] pl-10 md:pl-0 ${
                                        isEven ? 'md:ml-auto' : 'md:mr-auto'
                                    }`}
                                >
                                    <div 
                                        className="edu-card-inner"
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <div 
                                            className="premium-3d-card relative p-8 rounded-3xl bg-card/25 border border-white/5 hover:border-primary/40 transition-all duration-300 hover:bg-card/30 backdrop-blur-md"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-3xl" />

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 translate-z-md">
                                                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary-glow transition-colors">
                                                    {edu.school}
                                                </h3>
                                                <span className="text-sm font-mono text-primary/80 bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                                                    {edu.period}
                                                </span>
                                            </div>

                                            <h4 className="text-lg text-secondary font-medium mb-2 translate-z-sm">{edu.degree}</h4>
                                            <p className="text-muted-foreground translate-z-sm font-light">{edu.description}</p>
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

export default Education;
