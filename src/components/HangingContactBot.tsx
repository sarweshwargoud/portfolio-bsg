import { useState, useEffect, useRef } from 'react';
import {
  Robot,
  X,
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
  Sparkle,
} from 'phosphor-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
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

export const HangingContactBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Periodic cute eye-blink animation for the robot
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal is open on small screens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

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

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

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
          description:
            data.message || "Thanks for reaching out! I'll get back to you soon.",
        });
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
        'Unable to connect to the contact server. Please verify connection or email directly at b.sarweshwar445@gmail.com.';
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
    setFormData(initialFormState);
    setErrorMessage(null);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* HANGING ROBOT ON THE RIGHT SIDE EDGE */}
      {/* ============================================================ */}
      {!isOpen && (
        <div
          className="fixed right-0 top-[48%] -translate-y-1/2 z-40 flex items-center cursor-pointer group select-none"
          onClick={() => setIsOpen(true)}
          title="Wanna contact?! Send message..."
          aria-label="Open contact form"
        >
          {/* Speech Bubble attached to the left of the hanging robot */}
          <div className="relative mr-2 sm:mr-3 flex items-center gap-2 bg-zinc-950/90 backdrop-blur-xl border border-cyan-500/40 hover:border-cyan-400 px-3.5 py-2 rounded-2xl shadow-[0_10px_35px_rgba(6,182,212,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:-translate-x-1">
            {/* Pulsing indicator light */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>

            <div className="flex flex-col text-left">
              <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide flex items-center gap-1 leading-tight whitespace-nowrap">
                Wanna contact?! <Sparkle size={12} weight="fill" className="text-cyan-400 animate-pulse" />
              </span>
              <span className="text-[10px] sm:text-[11px] text-cyan-300 font-medium leading-tight whitespace-nowrap">
                Send message... 💬
              </span>
            </div>

            {/* Speech bubble pointer pointing towards the robot on the right */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-950 border-r border-t border-cyan-500/40 rotate-45" />
          </div>

          {/* Hanging Robot Body */}
          <div className="relative transition-transform duration-300 group-hover:translate-x-[-4px]">
            {/* Hanging Cable / Wall Attachment */}
            <div className="absolute -top-6 right-3 w-1.5 h-6 bg-gradient-to-b from-cyan-500 to-primary/80 rounded-full opacity-75" />
            <div className="absolute -bottom-6 right-3 w-1.5 h-6 bg-gradient-to-t from-cyan-500 to-primary/80 rounded-full opacity-75" />

            {/* Robot Container with subtle sway animation */}
            <div className="relative w-14 h-16 sm:w-16 sm:h-18 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <svg
                viewBox="0 0 100 110"
                className="w-full h-full transform transition-all duration-300 group-hover:scale-110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Wall Gripper Claw / Hand hanging sideways */}
                <path
                  d="M92 40 C97 45, 97 60, 92 65 L84 62 L84 43 Z"
                  fill="#06b6d4"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />

                {/* Left side peeking arm */}
                <path
                  d="M16 52 C10 50, 6 60, 12 65 C16 68, 20 62, 22 56 Z"
                  fill="#06b6d4"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />

                {/* Antenna */}
                <line x1="50" y1="20" x2="50" y2="8" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="7" r="5" fill="#38bdf8" className="animate-pulse">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Ears / Side Bolts */}
                <rect x="18" y="32" width="6" height="12" rx="3" fill="#3b82f6" />
                <rect x="76" y="32" width="6" height="12" rx="3" fill="#3b82f6" />

                {/* Head Shell */}
                <rect
                  x="22"
                  y="20"
                  width="56"
                  height="44"
                  rx="12"
                  fill="#121216"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />

                {/* Visor Screen */}
                <rect
                  x="28"
                  y="27"
                  width="44"
                  height="22"
                  rx="7"
                  fill="#09090b"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />

                {/* Eyes */}
                {isBlinking ? (
                  // Blinking Line Eyes
                  <>
                    <line x1="36" y1="38" x2="44" y2="38" stroke="#00ffff" strokeWidth="3" strokeLinecap="round" />
                    <line x1="56" y1="38" x2="64" y2="38" stroke="#00ffff" strokeWidth="3" strokeLinecap="round" />
                  </>
                ) : (
                  // Normal Glowing Cyan Eyes
                  <>
                    <circle cx="40" cy="38" r="4.5" fill="#00ffff" filter="drop-shadow(0 0 4px #00ffff)" />
                    <circle cx="60" cy="38" r="4.5" fill="#00ffff" filter="drop-shadow(0 0 4px #00ffff)" />
                    {/* Pupil spark */}
                    <circle cx="41.5" cy="36.5" r="1.5" fill="#ffffff" />
                    <circle cx="61.5" cy="36.5" r="1.5" fill="#ffffff" />
                  </>
                )}

                {/* Smile / Mouth */}
                <path
                  d="M44 45 Q50 49 56 45"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Robot Body / Torso hanging */}
                <rect
                  x="28"
                  y="67"
                  width="44"
                  height="30"
                  rx="8"
                  fill="#18181b"
                  stroke="#7c3aed"
                  strokeWidth="2"
                />

                {/* Chest Glow Light */}
                <rect x="38" y="75" width="24" height="12" rx="4" fill="#09090b" stroke="#06b6d4" strokeWidth="1" />
                <circle cx="45" cy="81" r="2.5" fill="#38bdf8" />
                <circle cx="55" cy="81" r="2.5" fill="#a855f7" className="animate-pulse" />

                {/* Cute hanging feet dangling */}
                <ellipse cx="38" cy="100" rx="6" ry="4" fill="#06b6d4" />
                <ellipse cx="62" cy="100" rx="6" ry="4" fill="#06b6d4" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* RIGHT SIDE MIDDLE CONTACT MODAL */}
      {/* ============================================================ */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-3 sm:p-6 md:p-8">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container: Right Side Middle */}
          <div
            ref={modalRef}
            className="relative z-50 w-full max-w-[480px] max-h-[92vh] flex flex-col bg-zinc-950/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden animate-in slide-in-from-right-8 fade-in duration-300"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-primary/20 via-cyan-500/10 to-transparent flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-primary rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <Robot size={22} weight="fill" className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                      Send a Message
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-medium flex items-center gap-1">
                      <Sparkle size={10} weight="fill" /> Direct Contact
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    Reach Sarweshwar Buddolla directly
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title="Close"
                aria-label="Close contact modal"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-75px)]">
              {submitSuccess ? (
                // Success Confirmation Screen
                <div className="py-6 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle size={36} weight="fill" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xl font-bold text-white tracking-tight">
                      Message Sent Successfully! 🚀
                    </h4>
                    <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto leading-relaxed">
                      Thanks for reaching out! Your message has been saved and dispatched to Sarweshwar's inbox. A confirmation email has also been sent to you.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5 w-full">
                    <Button
                      onClick={handleResetForm}
                      variant="outline"
                      className="flex-1 border-white/15 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs sm:text-sm h-11"
                    >
                      Send Another Message
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white rounded-xl text-xs sm:text-sm h-11 font-medium"
                    >
                      Close Window
                    </Button>
                  </div>
                </div>
              ) : (
                // Contact Form
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot anti-spam */}
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

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                      <WarningCircle size={16} weight="fill" className="shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Name <span className="text-primary">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="bg-background/60 border-white/10 focus:border-cyan-400/50 h-10 text-xs sm:text-sm rounded-xl"
                        required
                        maxLength={100}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Email <span className="text-primary">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="bg-background/60 border-white/10 focus:border-cyan-400/50 h-10 text-xs sm:text-sm rounded-xl"
                        required
                        maxLength={255}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Phone & Subject */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Phone <span className="text-white/30 text-[10px] font-normal">(Optional)</span>
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXXXXXXX"
                        className="bg-background/60 border-white/10 focus:border-cyan-400/50 h-10 text-xs sm:text-sm rounded-xl"
                        maxLength={30}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Subject <span className="text-primary">*</span>
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Project, job, or greeting"
                        className="bg-background/60 border-white/10 focus:border-cyan-400/50 h-10 text-xs sm:text-sm rounded-xl"
                        required
                        maxLength={200}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Message <span className="text-primary">*</span>
                      </label>
                      <span className="text-[10px] text-white/30 font-mono">
                        {formData.message.length} / 5000
                      </span>
                    </div>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your note or project inquiry..."
                      className="bg-background/60 border-white/10 focus:border-cyan-400/50 min-h-[110px] resize-none text-xs sm:text-sm rounded-xl leading-relaxed"
                      required
                      maxLength={5000}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-sm font-semibold bg-gradient-to-r from-primary via-blue-600 to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 text-white rounded-xl shadow-glow-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group h-11"
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
                          size={16}
                          weight="bold"
                          className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </span>
                    )}
                  </Button>

                  {/* Quick Note */}
                  <p className="text-[11px] text-center text-white/40 pt-1">
                    Directly connected to Sarweshwar's verified Gmail & Supabase
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HangingContactBot;
