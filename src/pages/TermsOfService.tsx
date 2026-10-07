import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, WarningCircle, Envelope, Globe } from 'phosphor-react';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/15 via-background to-background" />

      {/* Header bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-primary font-mono bg-primary/10 border border-primary/30 px-3 py-1 rounded-full">
            <FileText size={14} weight="fill" />
            <span>Terms of Service • sarweshwarr.com</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto px-6 py-12 sm:py-16">
        <div className="space-y-4 mb-10 pb-8 border-b border-white/10">
          <span className="text-xs uppercase tracking-widest text-secondary font-bold">
            Legal & Terms
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Last Updated: October 7, 2026 • Effective Date: October 7, 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm sm:text-base text-white/80 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Globe size={22} className="text-primary" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and utilizing the personal portfolio website located at <a href="https://sarweshwarr.com" className="text-cyan-400 hover:underline">https://sarweshwarr.com</a> ("Website"), you agree to be bound by these Terms of Service ("Terms") and our <Link to="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>. If you do not agree to these terms, please do not use this Website.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <CheckCircle size={22} className="text-secondary" />
              2. Description of the Website
            </h2>
            <p>
              This Website is the personal engineering portfolio of <strong>Sarweshwar Buddolla</strong>. The site showcases professional projects, software architectures, educational background, certifications, technical articles, an interactive AI Chatbot assistant, and contact messaging systems for recruitment, collaboration, and professional networking.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              3. Permitted & Acceptable Use
            </h2>
            <p>You agree to use this Website solely for lawful, legitimate professional purposes. You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 pl-2">
              <li>Submit abusive, defamatory, harassing, obscene, or fraudulent messages through the Contact forms or AI Chatbot.</li>
              <li>Attempt to compromise, probe, or vulnerability-scan the application, server infrastructure, or APIs.</li>
              <li>Inject malicious scripts, SQL injections, prompt injection jailbreaks designed to cause harm, or automated bot traffic.</li>
              <li>Scrape or bulk harvest content without prior written permission.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              4. Intellectual Property
            </h2>
            <p>
              All original content, designs, animations, written text, graphics, and demonstrations hosted on <a href="https://sarweshwarr.com" className="text-cyan-400 hover:underline">sarweshwarr.com</a> are the intellectual property of <strong>Sarweshwar Buddolla</strong> unless otherwise specified or attributed to open-source licenses.
            </p>
            <p>
              Open-source project repositories linked on GitHub are governed by their respective repository licenses (e.g., MIT, Apache 2.0).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <WarningCircle size={22} className="text-yellow-400" />
              5. AI Chatbot Disclaimer
            </h2>
            <p>
              The AI Portfolio Companion featured on this website uses Generative AI (Google Gemini) and Retrieval-Augmented Generation (RAG) to provide automated, interactive responses about Sarweshwar's background. While designed to be accurate, AI responses are provided for informational and demonstration purposes on an "as-is" basis.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              6. Limitation of Liability
            </h2>
            <p>
              In no event shall Sarweshwar Buddolla be liable for any indirect, incidental, consequential, or punitive damages arising out of your access to, use of, or inability to use this Website or any content provided herein.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Envelope size={22} className="text-primary" />
              7. Contact & Inquiries
            </h2>
            <p>If you have any questions or require clarification regarding these Terms of Service, please contact:</p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm space-y-1">
              <p><strong className="text-white">Owner:</strong> Sarweshwar Buddolla</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:b.sarweshwar445@gmail.com" className="text-cyan-400 hover:underline">b.sarweshwar445@gmail.com</a></p>
              <p><strong className="text-white">Domain:</strong> <a href="https://sarweshwarr.com" className="text-cyan-400 hover:underline">https://sarweshwarr.com</a></p>
            </div>
          </section>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all"
          >
            <ArrowLeft size={16} />
            <span>Return to Portfolio</span>
          </Link>
          <Link
            to="/privacy"
            className="text-xs sm:text-sm text-cyan-400 hover:underline"
          >
            View Privacy Policy →
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
