import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Student, Cpu, Lightning, Target, GameController, GraduationCap } from 'phosphor-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.about-card');
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

    // Animate cards with gentle fade + scale (no sideways jumping)
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
    <section ref={containerRef} className="py-24 px-6 md:px-12 bg-background relative overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-semibold mb-16 text-center tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Me</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Card 1: Who Am I */}
          <div className="about-card p-8 rounded-2xl bg-card/10 backdrop-blur-md border border-white/5 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                <Student size={32} weight="duotone" />
              </div>
              <h3 className="text-2xl font-bold text-foreground group-hover:text-blue-400 transition-colors">Who Am I</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              I am an <strong className="text-white">Aspiring AI Engineer</strong> with a strong focus on building intelligent, scalable applications.
              My passion lies in bridging the gap between theoretical AI models and real-world utility. I enjoy solving complex problems
              by combining logical thinking with clean, efficient code.
            </p>
          </div>

          {/* Card 2: Technical Strength */}
          <div className="about-card p-8 rounded-2xl bg-card/10 backdrop-blur-md border border-white/5 hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                <Cpu size={32} weight="duotone" />
              </div>
              <h3 className="text-2xl font-bold text-foreground group-hover:text-green-400 transition-colors">Technical Strength</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I specialize in building <strong className="text-white">data-driven AI systems</strong> using Python, GenAI, and RAG architectures.
              My arsenal includes:
            </p>
            <div className="flex flex-wrap gap-2 text-sm font-mono text-green-400/80">
              <span className="bg-green-500/10 px-2 py-1 rounded">Python</span>
              <span className="bg-green-500/10 px-2 py-1 rounded">C++</span>
              <span className="bg-green-500/10 px-2 py-1 rounded">Java</span>
              <span className="bg-green-500/10 px-2 py-1 rounded">Agentic AI</span>
              <span className="bg-green-500/10 px-2 py-1 rounded">Data Analytics</span>
            </div>
          </div>

          {/* Card 3: Academic Excellence */}
          <div className="about-card p-8 rounded-2xl bg-card/10 backdrop-blur-md border border-white/5 hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
                <GraduationCap size={32} weight="duotone" />
              </div>
              <h3 className="text-2xl font-bold text-foreground group-hover:text-yellow-400 transition-colors">Academic Excellence</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Currently pursuing B.Tech in <strong className="text-white">AI & ML</strong> at Malla Reddy College of Engineering & Technology.
              My academic journey is marked by consistent performance and a deep dive into emerging technologies.
              I actively participate in hackathons and coding competitions to sharpen my skills.
            </p>
          </div>

          {/* Card 4: Strength */}
          <div className="about-card p-8 rounded-2xl bg-card/10 backdrop-blur-md border border-white/5 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
                <Lightning size={32} weight="duotone" />
              </div>
              <h3 className="text-2xl font-bold text-foreground group-hover:text-orange-400 transition-colors">Strength</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-3">
              <strong className="text-white">Relentless Focus Once Committed.</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm">
              When I decide to build something, I don't leave it halfway. Once I start, I work consistently with full intensity until completion.
              I can maintain long focused sessions, refine systems deeply, Never distracts and push through complexity without losing direction.
            </p>
          </div>

          {/* Card 5: Weakness */}
          <div className="about-card p-8 rounded-2xl bg-card/10 backdrop-blur-md border border-white/5 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                <Target size={32} weight="duotone" />
              </div>
              <h3 className="text-2xl font-bold text-foreground group-hover:text-red-400 transition-colors">Weakness</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-3">
              <strong className="text-white">Delayed Momentum at the Starting Line.</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm">
              I sometimes struggle with initiating tasks due to overthinking and Laziness. However, once I take the first step, my energy shifts completely—I become deeply disciplined and unstoppable in execution.
              <br />
              - So I'm actively working on improving my starting speed.
            </p>
          </div>

          {/* Card 6: Hobbies */}
          <div className="about-card p-8 rounded-2xl bg-card/10 backdrop-blur-md border border-white/5 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                <GameController size={32} weight="duotone" />
              </div>
              <h3 className="text-2xl font-bold text-foreground group-hover:text-purple-400 transition-colors">Hobbies</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">

              In my free time, I enjoy <strong className="text-white">sketching and drawing</strong> to express creativity.
              For relaxation, I play <strong className="text-white">online games</strong> to unwind and recharge.
            </p>
          </div>

        </div>
      </div>

      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

    </section>
  );
};

export default About;
