import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { GithubLogo, LinkedinLogo, Envelope, MapPin, Phone } from 'phosphor-react';
import { useToast } from './ui/use-toast';

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const heading = containerRef.current?.querySelector('h2');
    const description = containerRef.current?.querySelector('.intro-text');
    const formSide = containerRef.current?.querySelector('.form-side');
    const contactInfo = containerRef.current?.querySelectorAll('.contact-info-item');
    const leftContent = containerRef.current?.querySelector('.left-content');

    // Animate heading
    if (heading) {
      gsap.fromTo(heading,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
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
          ease: "power2.out",
          scrollTrigger: {
            trigger: description,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animate left content heading
    if (leftContent) {
      gsap.fromTo(leftContent,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: leftContent,
            start: "top bottom-=50",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animate contact info items individually
    contactInfo?.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top bottom-=30",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animate form
    if (formSide) {
      gsap.fromTo(formSide,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formSide,
            start: "top bottom-=50",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(formRef.current!);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Create mailto link
    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    const mailtoLink = `mailto:b.sarweshwar445@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success toast
    toast({
      title: "Opening email client...",
      description: "Your message will be sent via your default email application.",
    });

    // Reset form
    formRef.current?.reset();
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-background relative overflow-hidden border-t border-white/5">
      <div ref={containerRef} className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Touch</span>
          </h2>
          <p className="intro-text text-muted-foreground/80 max-w-2xl mx-auto text-sm md:text-base">
            Have a project in mind or just want to say hello? Drop me a message and let's create something amazing together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">

          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div className="left-content">
              <h3 className="text-3xl md:text-4xl font-semibold mb-6 leading-tight">
                Let's <span className="text-secondary">Connect</span>
              </h3>
              <p className="text-muted-foreground/80 leading-relaxed mb-8">
                I'm always excited to work on new projects and collaborate with amazing people. Whether you have a specific project in mind or just want to explore possibilities, I'd love to hear from you.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="contact-info-item flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all duration-300 group">
                <div className="p-3 bg-primary/20 rounded-lg text-primary group-hover:scale-110 transition-transform">
                  <Envelope size={24} weight="duotone" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a href="mailto:b.sarweshwar445@gmail.com" className="text-white font-medium hover:text-primary transition-colors">
                    b.sarweshwar445@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-info-item flex items-start gap-4 p-4 rounded-xl bg-secondary/5 border border-secondary/10 hover:border-secondary/30 transition-all duration-300 group">
                <div className="p-3 bg-secondary/20 rounded-lg text-secondary group-hover:scale-110 transition-transform">
                  <Phone size={24} weight="duotone" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="text-white font-medium">+91 7661831324</p>
                </div>
              </div>

              <div className="contact-info-item flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                  <MapPin size={24} weight="duotone" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="text-white font-medium">Hyderabad, India</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">Follow Me</p>
              <div className="flex gap-4">
                <a href="https://github.com/sarweshwargoud" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-primary transition-all duration-300 border border-white/5 hover:border-primary/50 hover:scale-110" target='_blank' rel="noopener noreferrer">
                  <GithubLogo size={24} weight="fill" />
                </a>
                <a href="https://www.linkedin.com/in/sarweshwar-buddolla-25673b312/" className="p-3 bg-white/5 rounded-full hover:bg-white/10 hover:text-secondary transition-all duration-300 border border-white/5 hover:border-secondary/50 hover:scale-110" target='_blank' rel="noopener noreferrer">
                  <LinkedinLogo size={24} weight="fill" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="form-side bg-card/30 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-2xl hover:border-white/10 transition-colors">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <Input
                  name="name"
                  placeholder="Your name"
                  className="bg-background/50 border-white/10 focus:border-primary/50 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="bg-background/50 border-white/10 focus:border-primary/50 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <Textarea
                  name="message"
                  placeholder="Tell me about your project..."
                  className="bg-background/50 border-white/10 focus:border-primary/50 min-h-[150px] resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full text-lg font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl shadow-glow-primary group"
              >
                <span className="flex items-center justify-center gap-2">
                  Send Message
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Button>
            </form>
          </div>

        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
};

export default Contact;