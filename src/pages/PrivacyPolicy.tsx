import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Envelope, Globe, CheckCircle } from 'phosphor-react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

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
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
            <ShieldCheck size={14} weight="fill" />
            <span>Official Policy • sarweshwarr.com</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-4xl mx-auto px-6 py-12 sm:py-16">
        <div className="space-y-4 mb-10 pb-8 border-b border-white/10">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
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
              1. Overview & Scope
            </h2>
            <p>
              This Privacy Policy explains how <strong>Sarweshwar Buddolla</strong> ("we", "our", or "us") collects, uses, and safeguards information when you visit the personal portfolio website located at <a href="https://sarweshwarr.com" className="text-cyan-400 hover:underline">https://sarweshwarr.com</a> ("Website"), including its interactive AI chatbot and contact inquiry features.
            </p>
            <p>
              We are committed to protecting your privacy and ensuring transparency regarding how your data is handled.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Lock size={22} className="text-secondary" />
              2. Information We Collect
            </h2>
            <p>We collect only the minimal information necessary to respond to your inquiries and operate the website:</p>
            <ul className="list-disc list-inside space-y-2 text-white/70 pl-2">
              <li>
                <strong>Contact Form Data:</strong> When you submit a message through our Contact Me forms, we collect your <em>Name</em>, <em>Email Address</em>, optional <em>Phone Number</em>, <em>Subject</em>, and <em>Message</em>.
              </li>
              <li>
                <strong>AI Chatbot Conversations:</strong> Queries submitted to Sarweshwar's AI Portfolio Assistant are processed to generate contextual answers about skills, projects, and experience.
              </li>
              <li>
                <strong>Technical Metadata:</strong> For rate-limiting, security, and spam prevention, we may log hashed IP addresses (one-way SHA-256) and browser User-Agent strings. We do not track visitors across third-party websites.
              </li>
            </ul>
          </section>

          {/* Section 3 - Google API Specifics */}
          <section className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/30">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck size={24} className="text-primary" weight="fill" />
              3. Google API Services & OAuth 2.0 Compliance
            </h2>
            <p>
              Our application utilizes Google OAuth 2.0 and the Google Gmail API (specifically restricted scope: <code className="text-xs bg-black/40 px-2 py-1 rounded text-cyan-300">https://www.googleapis.com/auth/gmail.send</code>) strictly to:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm">
                <strong className="text-white block mb-1">Owner Notifications</strong>
                Deliver notifications of incoming inquiries from the website directly to Sarweshwar's verified Gmail inbox.
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm">
                <strong className="text-white block mb-1">Visitor Greeting Emails</strong>
                Send an automated, personalized thank-you confirmation email to the visitor from Sarweshwar's verified Gmail address.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs sm:text-sm space-y-2 text-cyan-200">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <CheckCircle size={16} weight="fill" className="text-cyan-400" />
                Google API Services User Data Policy Compliance
              </div>
              <p>
                Our application strictly adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="underline font-medium text-white hover:text-cyan-300">Google API Services User Data Policy</a>, including the <strong>Limited Use</strong> requirements:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>We do <strong>not</strong> read, scan, or analyze emails from your Gmail inbox.</li>
                <li>We do <strong>not</strong> use Google Workspace or Gmail user data to develop, train, or fine-tune generalized AI or machine learning models.</li>
                <li>We do <strong>not</strong> sell, transfer, or disclose Google user data to any advertising platforms, data brokers, or information resellers.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              4. Data Storage and Security
            </h2>
            <p>
              Inquiries submitted through the website are stored securely in a dedicated PostgreSQL database hosted on Supabase, protected by enterprise-grade Row-Level Security (RLS) policies. Only authenticated server-side services possess authorized access to process submissions.
            </p>
            <p>
              All communication between your browser and our servers is encrypted using industry-standard Transport Layer Security (TLS/HTTPS).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              5. Your Rights and Data Deletion Requests
            </h2>
            <p>
              You maintain full rights regarding your personal information. You may request to review, update, or permanently delete any contact information or past inquiry records submitted through this website.
            </p>
            <p>
              To exercise these rights, please contact us directly via email at: <a href="mailto:b.sarweshwar445@gmail.com" className="text-cyan-400 hover:underline">b.sarweshwar445@gmail.com</a>. We will process your deletion request within 48 hours.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Envelope size={22} className="text-primary" />
              6. Contact Information
            </h2>
            <p>For any questions or inquiries concerning this Privacy Policy or data handling practices, please contact:</p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm space-y-1">
              <p><strong className="text-white">Developer / Owner:</strong> Sarweshwar Buddolla</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:b.sarweshwar445@gmail.com" className="text-cyan-400 hover:underline">b.sarweshwar445@gmail.com</a></p>
              <p><strong className="text-white">Website:</strong> <a href="https://sarweshwarr.com" className="text-cyan-400 hover:underline">https://sarweshwarr.com</a></p>
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
            to="/terms"
            className="text-xs sm:text-sm text-cyan-400 hover:underline"
          >
            View Terms of Service →
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
