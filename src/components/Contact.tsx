import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  GithubLogo,
  LinkedinLogo,
  Envelope,
  MapPin,
  Phone,
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
  ArrowClockwise,
} from 'phosphor-react';
import { useToast } from './ui/use-toast';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  hp_field: string;
}

const initialFormState: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  hp_field: '',
};

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successCardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ContactFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const heading = containerRef.current?.querySelector('h2');
    const description = containerRef.current?.querySelector('.intro-text');
    const formSide = containerRef.current?.querySelector('.form-side');
    const contactInfo = containerRef.current?.querySelectorAll('.contact-info-item');
    const leftContent = containerRef.current?.querySelector('.left-content');

    // Animate heading
    if (heading) {
      gsap.fromTo(
        heading,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Animate description
    if (description) {
      gsap.fromTo(
        description,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: description,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Animate left content heading
    if (leftContent) {
      gsap.fromTo(
        leftContent,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: leftContent,
            start: 'top bottom-=50',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Animate contact info items individually
    contactInfo?.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom-=30',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Animate form side
    if (formSide) {
      gsap.fromTo(
        formSide,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formSide,
            start: 'top bottom-=50',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation checks
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (trimmedMessage.length < 2) {
      setErrorMessage('Message must be at least 2 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: formData.phone.trim() || undefined,
          subject: trimmedSubject,
          message: trimmedMessage,
          hp_field: formData.hp_field.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setSubmitSuccess(true);
        setFormData(initialFormState);
        toast({
          title: 'Message Sent! 🚀',
          description: data.message || "Thanks for reaching out. I'll get back to you soon.",
        });

        // Animate success card entrance
        setTimeout(() => {
          if (successCardRef.current) {
            gsap.fromTo(
              successCardRef.current,
              { opacity: 0, scale: 0.95, y: 15 },
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
            );
          }
        }, 50);
      } else {
        const errorText =
          data.message ||
          data.detail ||
          'Unable to send your message right now. Please try again.';
        setErrorMessage(errorText);
        toast({
          title: 'Submission Failed',
          description: errorText,
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      const fallbackMsg =
        'Unable to connect to the contact server. Please verify your internet connection or email directly at b.sarweshwar445@gmail.com.';
      setErrorMessage(fallbackMsg);
      toast({
        title: 'Connection Error',
        description: fallbackMsg,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setErrorMessage(null);
    setFormData(initialFormState);
  };

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-12 bg-background relative overflow-hidden border-t border-white/5"
    >
      <div ref={containerRef} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Get In{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Touch
            </span>
          </h2>
          <p className="intro-text text-muted-foreground/80 max-w-2xl mx-auto text-sm md:text-base">
            Have a project in mind, an opportunity to discuss, or just want to say
            hello? Drop me a message and let's create something amazing together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div className="left-content">
              <h3 className="text-3xl md:text-4xl font-semibold mb-6 leading-tight">
                Let's <span className="text-secondary">Connect</span>
              </h3>
              <p className="text-muted-foreground/80 leading-relaxed mb-8 font-light">
                I'm always excited to collaborate on Generative AI, LLM systems,
                Agentic workflows, and cutting-edge software engineering. Reach out
                directly or submit the form — I reply promptly!
              </p>
            </div>

            {/* Contact Details Cards */}
            <div className="space-y-4">
              <div className="contact-info-item flex items-start gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all duration-300 group">
                <div className="p-3 bg-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <Envelope size={22} weight="duotone" />
                </div>
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider text-muted-foreground mb-1">
                    Direct Email
                  </p>
                  <a
                    href="mailto:b.sarweshwar445@gmail.com"
                    className="text-white font-medium hover:text-primary transition-colors text-sm sm:text-base"
                  >
                    b.sarweshwar445@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-info-item flex items-start gap-4 p-4 rounded-2xl bg-secondary/5 border border-secondary/10 hover:border-secondary/30 transition-all duration-300 group">
                <div className="p-3 bg-secondary/20 rounded-xl text-secondary group-hover:scale-110 transition-transform">
                  <Phone size={22} weight="duotone" />
                </div>
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider text-muted-foreground mb-1">
                    Phone / WhatsApp
                  </p>
                  <a
                    href="tel:+917661831324"
                    className="text-white font-medium hover:text-secondary transition-colors text-sm sm:text-base"
                  >
                    +91 7661831324
                  </a>
                </div>
              </div>

              <div className="contact-info-item flex items-start gap-4 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                  <MapPin size={22} weight="duotone" />
                </div>
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider text-muted-foreground mb-1">
                    Location
                  </p>
                  <p className="text-white font-medium text-sm sm:text-base">
                    Hyderabad, Telangana, India
                  </p>
                </div>
              </div>
            </div>

            {/* Social Profiles */}
            <div className="pt-4">
              <p className="text-xs uppercase font-mono tracking-wider text-muted-foreground mb-3">
                Social Profiles
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/sarweshwargoud"
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 hover:text-primary transition-all duration-300 border border-white/10 hover:border-primary/50 hover:scale-105"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                >
                  <GithubLogo size={22} weight="fill" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sarweshwar-buddolla-25673b312/"
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 hover:text-secondary transition-all duration-300 border border-white/10 hover:border-secondary/50 hover:scale-105"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinLogo size={22} weight="fill" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Form or Success State */}
          <div className="form-side bg-card/30 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl hover:border-white/20 transition-all relative">
            {submitSuccess ? (
              /* Success Feedback Card */
              <div
                ref={successCardRef}
                className="py-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle size={44} weight="fill" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Message sent successfully! 🚀
                  </h4>
                  <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                    Thanks for reaching out. I've received your note and a confirmation
                    has been dispatched to your inbox. I'll get back to you soon!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 max-w-sm mx-auto">
                  <span>💡 You can also reply directly to the confirmation email once received.</span>
                </div>

                <Button
                  onClick={handleResetForm}
                  variant="outline"
                  className="border-white/20 hover:border-primary text-white hover:bg-white/10 gap-2 rounded-xl text-sm"
                >
                  <ArrowClockwise size={16} weight="bold" />
                  <span>Send Another Message</span>
                </Button>
              </div>
            ) : (
              /* Interactive Contact Form */
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot field (hidden from real users, traps automated bots) */}
                <input
                  type="text"
                  name="hp_field"
                  value={formData.hp_field}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                  style={{ display: 'none' }}
                />

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
                    <WarningCircle size={18} weight="fill" className="shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Name <span className="text-primary">*</span>
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="bg-background/60 border-white/10 focus:border-primary/50 h-11 text-sm rounded-xl"
                      required
                      maxLength={100}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email <span className="text-primary">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="bg-background/60 border-white/10 focus:border-primary/50 h-11 text-sm rounded-xl"
                      required
                      maxLength={255}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Phone & Subject Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone <span className="text-white/30 text-[11px] font-normal">(Optional)</span>
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXXXXXXX"
                      className="bg-background/60 border-white/10 focus:border-primary/50 h-11 text-sm rounded-xl"
                      maxLength={30}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Subject <span className="text-primary">*</span>
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. AI Project, Job, Collaboration"
                      className="bg-background/60 border-white/10 focus:border-primary/50 h-11 text-sm rounded-xl"
                      required
                      maxLength={200}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Message <span className="text-primary">*</span>
                    </label>
                    <span className="text-[11px] text-white/30 font-mono">
                      {formData.message.length} / 5000
                    </span>
                  </div>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, idea, or opportunity..."
                    className="bg-background/60 border-white/10 focus:border-primary/50 min-h-[140px] resize-none text-sm rounded-xl leading-relaxed"
                    required
                    maxLength={5000}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl shadow-glow-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group h-12"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2 text-white">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending message...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Send Message</span>
                      <PaperPlaneTilt
                        size={18}
                        weight="bold"
                        className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </section>
  );
};

export default Contact;