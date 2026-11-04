import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/button';
import { ArrowUpRight, GithubLogo } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Family Health Concierge AI",
    description: "An AI-powered family healthcare platform using OCR, RAG, embeddings, and Gemini to securely index, retrieve, and summarize medical records for entire families.",
    tags: ["Agentic AI", "Healthcare", "RAG", "FastAPI"],
    image: "/Images/family-health-concierge.webp",
    link: "",
    github: "https://github.com/sarweshwargoud/Family-AI-Health-Concierge"
  },
  {
    title: "SkillWeave AI",
    description: "Intelligent AI/ML platform that transforms scattered educational content into structured syllabi and ranked YouTube playlists with accent & style matching.",
    tags: ["Gen AI", "Gemini", "FastAPI", "React"],
    image: "/Images/Skillweave.webp",
    link: "https://skill-weave-ai.vercel.app/",
    github: "https://github.com/sarweshwargoud/SkillWeave-AI"
  },
  {
    title: "LLM Safety Evaluator",
    description: "Advanced real-time prompt injection & jailbreak detection system combining Random Forest classifiers and Isolation Forest anomaly detection to safeguard LLMs.",
    tags: ["LLM Security", "Machine Learning", "Python", "Scikit-Learn"],
    image: "/Images/llm-safety-evaluator.webp",
    link: "https://llmsafetyevaluator.onrender.com/",
    github: "https://github.com/sarweshwargoud/llmSafetyEvaluator"
  },
  {
    title: "LLM Usage Metering & Billing Engine",
    description: "Production-grade usage metering, quota enforcement, and billing engine for LLM APIs with micro-cent token pricing, TOCTOU-free atomic quotas, and Stripe webhooks.",
    tags: ["FastAPI", "PostgreSQL", "Stripe", "System Design"],
    image: "/Images/llm-metering-billing.webp",
    link: "",
    github: "https://github.com/sarweshwargoud/LLM-Usage-Metering-Billing-Engine"
  },
  {
    title: "Interview Guru AI",
    description: "AI-powered mock interview platform that generates tailored technical and behavioral questions and scores answers with real-time feedback and radar analytics via Gemini.",
    tags: ["Next.js", "Gemini AI", "FastAPI", "Clerk"],
    image: "/Images/interview-guru.webp",
    link: "https://interview-guru-pi.vercel.app",
    github: "https://github.com/sarweshwargoud/student-mock-interview-ai"
  },
  {
    title: "GEOlytics",
    description: "An AI-powered intelligence platform combining traditional technical SEO analysis with GEO (Generative Engine Optimization) and AI-search visibility tracking.",
    tags: ["AI Search", "GEO", "SEO Analytics", "Supabase"],
    image: "/Images/geolytics.webp",
    link: "",
    github: "https://github.com/sarweshwargoud/GEOlytics"
  }
];

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.project-card');
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
            toggleActions: "play none none none",
            once: true
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
            toggleActions: "play none none none",
            once: true
          }
        }
      );
    }

    // Animate project cards with gentle upward slide (no sideways jumping)
    cards?.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=80",
            toggleActions: "play none none none",
            once: true
          }
        }
      );
    });
  }, []);

  return (
    <section id="projects" className="py-24 px-6 md:px-12 bg-background relative border-t border-white/10">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-center tracking-tight text-white">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Projects</span>
        </h2>
        <p className="section-description text-center text-zinc-300 mb-16 max-w-3xl mx-auto text-sm md:text-base">
          A curated collection of full-stack projects demonstrating my expertise in building modern, scalable web applications — from intuitive frontends to robust backend systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="project-card group relative bg-zinc-900/95 rounded-2xl overflow-hidden border border-white/15 hover:border-primary/60 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.4)] hover:-translate-y-2 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

              {/* Image Area */}
              <div className="relative h-48 overflow-hidden bg-slate-900/60">
                <img
                  src={project.image}
                  alt={`${project.title} Preview`}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="450"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-primary-glow transition-colors">{project.title}</h3>
                <p className="text-zinc-200 text-sm leading-relaxed mb-4 flex-grow font-normal">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-medium text-purple-300 bg-purple-950/70 px-2.5 py-1 rounded border border-purple-500/40">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} source code on GitHub`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    <GithubLogo size={18} /> Code
                  </a>
                  {project.link && project.link !== "#" && project.link !== "" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit live demo for ${project.title}`}
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary-glow transition-colors font-medium"
                    >
                      Live Demo <ArrowUpRight size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
