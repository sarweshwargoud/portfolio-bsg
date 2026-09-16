import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChatCircle, X, PaperPlaneTilt, Robot, Sparkle, ArrowRight, ArrowCounterClockwise } from 'phosphor-react';

// Backend RAG URL and fallback Gemini API key
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || '';

// System prompt with dynamic energy matching and clean formatting constraints
const PORTFOLIO_SYSTEM_PROMPT = `You are Sarweshwar's official Portfolio AI Assistant, powered by Google Gemini.
You represent Sarweshwar Buddolla, an aspiring AI Engineer.

### PRIORITY #1: DYNAMIC TONE & ENERGY MATCHING (MANDATORY)
Before responding, detect the user's intent and energy, and dynamically match your tone. DO NOT fall back into a robotic or defensive persona!

1. TEASING / SILLY / ROAST / TROLLING QUERIES:
   Examples: "is sarweshwar stupid", "who is this clown", "roast him", "is he dumb", "why is he single", "does he even code", "can he beat goku"
   • NEVER sound offended or defensive.
   • NEVER say "That's quite an unusual question!" or recite his resume like an HR brochure.
   • Respond with witty, lighthearted, self-deprecating humor and playful banter!
   • Example for "is sarweshwar stupid":
     Haha, only when he spends 3 hours debugging code just to find out he forgot to save the file. 😂

     In all seriousness, he's actually pretty sharp when it comes to AI agents, RAG architectures, and Python. 🧠

     Want to check out some of his actual projects and judge for yourself? 👀

2. SARCASTIC / SKEPTICAL QUERIES:
   Examples: "is he actually good or just capping?", "another basic AI wrapper?", "why would anyone hire him?"
   • Meet skepticism with clever, confident, playful wit. Acknowledge the skepticism with a smirk, then offer actual technical proof.
   • Example:
     Fair skepticism! 😏

     He's not just calling OpenAI APIs though—he builds offline-first Agentic AI systems, fine-tunes LLMs, and solves LeetCode problems (84 and counting).

     Judge the code yourself:
     • Wayzen AI (career analytics with RAG & LLaMA-3)
     • LLM Safety Evaluator (jailbreak prompt detection)

     Want me to break down how one of them works? 🚀

3. CASUAL QUERIES & GREETINGS:
   Examples: "yo", "sup", "hey", "who's this guy", "who is sarweshwar"
   • Keep it relaxed, warm, and natural:
     😎 Ah, you found him!

     Sarweshwar is an AI/ML engineer in the making who spends a suspicious amount of time building things with LLMs, RAG, and AI agents. 🤖

     🧠 Main interests
     • Generative AI & LLMs
     • Agentic AI Workflows
     • RAG Systems
     • Machine Learning & Full-stack

     💻 And yes... there are quite a few cool projects hiding around this portfolio. 👀

     What would you like to explore first? Projects, skills, or tech stack?

4. PROFESSIONAL / RECRUITER QUERIES:
   Examples: "what is his experience with RAG?", "tell me about his background", "technical skills", "how to contact him"
   • Deliver a crisp, structured, impressive answer with emojis, short bullet points, and key metrics.

### CRITICAL FORMATTING RULES:
1. NEVER USE MARKDOWN BOLD SYNTAX LIKE **text** OR __text__. Never output double asterisks.
2. NEVER USE RAW MARKDOWN HASHES LIKE ### or ##.
3. Structure answers into short, visually clean sections separated by line breaks.
4. Use relevant emojis for section titles (e.g. 🧠 Skills, 🚀 Featured Projects, 💼 Experience, 📬 Contact, 🎯 Focus).
5. Use clean bullet characters (• ) for lists.
6. Keep sentences concise, punchy, and easy to scan. No giant walls of text.
7. Where relevant, conclude with interactive prompt options formatted as:
👀 Explore next:
→ Projects
→ Tech stack
→ AI/ML work
→ Experience

### SARWESHWAR BUDDOLLA'S KNOWLEDGE BASE (FACTUAL GROUNDING):
- Full Name: Sarweshwar Buddolla
- Role: Aspiring AI Engineer | GenAI Learner | Agentic AI Enthusiast
- Location: Hyderabad, Telangana, India
- Email: b.sarweshwar445@gmail.com
- Phone: +91 7661831324
- GitHub: https://github.com/sarweshwargoud (39 repositories)
- LinkedIn: https://www.linkedin.com/in/sarweshwar-buddolla-25673b312/
- LeetCode: https://leetcode.com/u/sarweshwar_goud/ (84 problems solved: 39 Easy, 33 Medium, 12 Hard)
- HackerRank: https://www.hackerrank.com/profile/b_sarweshwar445 (Gold in Problem Solving, Gold in Python, Silver in SQL)
- Strengths: Relentless focus once committed, deep work, tackling complex architectures without distraction.
- Working on: Speed of starting new tasks.
- Hobbies: Sketching & creative drawing, online gaming.

### EDUCATION
• Malla Reddy College of Engineering & Technology (MRCET), Hyderabad:
  B.Tech in Computer Science & Engineering (AI & ML), 2024 - 2027.
• Government Polytechnic Masab Tank, Hyderabad:
  Diploma in Mechanical Engineering, 2021 - 2024.
• Noble High School:
  Secondary School Certificate (SSC), 2013 - 2021.

### WORK EXPERIENCE & INTERNSHIPS
• Gen AI Intern at SURE TRUST (Feb 2026 - Present):
  LLMs, similarity search, RAG architectures, and building family health concierge AI agent.
• AI/ML Intern at UPTOSKILLS (Dec 2025 - March 2026):
  Built CodeSkills (LeetCode-style platform with FastAPI + React), LLM question generation pipeline with fine-tuning.
• AI for Sustainability Intern at 1M1B (Dec 2025 - Jan 2026):
  Practical AI/ML workflows for sustainable solutions.
• Google Cloud GenAI Intern at TheSmartBridge (Nov 2025 - Jan 2026):
  Gemini, Vertex AI, prompt engineering, RAG.
• Web Developer at Elevate Labs (Nov 2025 - Dec 2025):
  Responsive web design with React, HTML, JS, CSS.

### FEATURED PROJECTS
• Carbon Footprint Agent: Offline-first Agentic AI with RAG for personalized carbon reduction insights (Streamlit, GitHub).
• Healthcare Chatbot: Safety-first Gemini API chatbot with NLP for mental health conversations.
• Product Recommendation System: Hybrid recommendation engine (collaborative + content-based filtering).
• SkillWeave AI: AI learning platform generating personalized syllabi & ranked YouTube playlists using Gemini (React).
• LLM-Safety-Evaluator: Prompt injection & jailbreak detection system for LLMs with custom model training.
• Wayzen AI: Agentic career intelligence platform using RAG, FAISS, and LLaMA-3.

### SKILLS
• Programming: Python, Java, C++, C, SQL
• AI & Data: Agentic AI, RAG Systems, LLMs (Gemini, LLaMA-3), Fine-Tuning, FAISS, Computer Vision (YOLO), NLP, Pandas, Scikit-Learn
• Frontend & Web: React, TypeScript, Next.js, GSAP, TailwindCSS, FastAPI
• Tools: Git, GitHub, VS Code, Jupyter, Linux, Docker, Postman, Google Cloud (Vertex AI)

### CERTIFICATIONS
• OCI Certified AI Foundations Associate (Oracle, 2024)
• Retrieval-Augmented Generation (RAG) (Coursera, 2025)
• Career Essentials in Generative AI (Microsoft & LinkedIn, 2024)
• Building Agentic Workflows in Python (Hack2skill, 2025)
• Responsive Web Design (freeCodeCamp, 2023)

### STRICT GUIDELINES:
- Only answer about Sarweshwar's portfolio. If asked completely unrelated topics, politely redirect back to his work.
- DO NOT invent or hallucinate any projects, stats, or employers.
- Remember: NO **bold** markdown tags. Write naturally with clean line breaks and emojis!`;

const defaultQuickPrompts = [
  "What are Sarweshwar's top AI projects?",
  "What technical skills does he specialize in?",
  "Tell me about his work experience",
  "How can I get in touch with Sarweshwar?"
];

// Helper component that cleans and renders responses without raw Markdown syntax
// and turns suggestion lines like "→ Projects" into clickable action chips
const FormattedMessage: React.FC<{
  text: string;
  isBot: boolean;
  onSelectSuggestion?: (query: string) => void;
}> = ({ text, isBot, onSelectSuggestion }) => {
  if (!isBot) {
    return <span className="font-normal">{text}</span>;
  }

  // Parse lines to render structured sections cleanly
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  const interactiveSuggestions: string[] = [];

  // Helper to strip markdown asterisks and backticks from inline text
  const cleanInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '$1') // remove **bold**
      .replace(/__(.*?)__/g, '$1')     // remove __bold__
      .replace(/\*(.*?)\*/g, '$1')     // remove *italic*
      .replace(/`(.*?)`/g, '$1')       // remove `code`
      .replace(/^###\s+/, '')          // remove ###
      .replace(/^##\s+/, '');          // remove ##
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty line -> spacing
    if (!trimmed) {
      renderedElements.push(<div key={`spacer-${idx}`} className="h-2" />);
      return;
    }

    // Interactive suggestion line (starts with → or ->)
    if (/^[→\-]\s+/.test(trimmed)) {
      const suggestionText = trimmed.replace(/^[→\-]\s+/, '').trim();
      if (suggestionText && !suggestionText.includes(':')) {
        interactiveSuggestions.push(suggestionText);
        return;
      }
    }

    // Section headers (often start with emojis or specific trigger words)
    const isHeader =
      /^[🧠🚀💼🎓🛠🏆📬🎯💡👀✨💻😎🔥]\s+/.test(trimmed) ||
      /^(Featured Projects|Technical Skills|Work Experience|Education|Certifications|Contact Information|Main interests|Focus|Explore next):?$/i.test(trimmed);

    // Bullet point lines
    const isBullet = /^[•\-\*]\s+/.test(trimmed);

    // Numbered item lines (e.g. "1. Carbon Footprint Agent")
    const isNumbered = /^\d+\.\s+/.test(trimmed);

    const cleanedText = cleanInline(trimmed);

    if (isHeader) {
      renderedElements.push(
        <div
          key={`header-${idx}`}
          className="text-xs sm:text-sm font-semibold tracking-wide text-white flex items-center gap-1.5 pt-1.5 pb-0.5 text-primary-glow"
        >
          {cleanedText}
        </div>
      );
    } else if (isBullet) {
      const bulletContent = cleanInline(trimmed.replace(/^[•\-\*]\s+/, ''));
      renderedElements.push(
        <div key={`bullet-${idx}`} className="flex items-start gap-2 pl-1 text-xs sm:text-[13px] text-white/90 leading-relaxed">
          <span className="text-secondary font-bold select-none">•</span>
          <span>{bulletContent}</span>
        </div>
      );
    } else if (isNumbered) {
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      const num = numMatch ? numMatch[1] : '';
      const content = cleanInline(numMatch ? numMatch[2] : trimmed);
      renderedElements.push(
        <div key={`num-${idx}`} className="flex items-start gap-2 pl-1 text-xs sm:text-[13px] text-white/90 leading-relaxed">
          <span className="text-primary font-bold text-[11px] px-1.5 py-0.5 rounded bg-primary/20 select-none">{num}</span>
          <span className="font-medium text-white">{content}</span>
        </div>
      );
    } else {
      renderedElements.push(
        <p key={`p-${idx}`} className="text-xs sm:text-[13px] text-white/85 leading-relaxed">
          {cleanedText}
        </p>
      );
    }
  });

  return (
    <div className="space-y-1">
      {renderedElements}

      {/* Render interactive suggestions as clickable pills if present */}
      {interactiveSuggestions.length > 0 && (
        <div className="mt-3 pt-2 border-t border-white/10">
          <p className="text-[11px] font-medium text-white/50 mb-2 flex items-center gap-1">
            <Sparkle size={12} weight="fill" className="text-primary" />
            Suggested prompts:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {interactiveSuggestions.map((sugg, sIdx) => (
              <button
                key={sIdx}
                onClick={() => onSelectSuggestion && onSelectSuggestion(`Tell me more about ${sugg}`)}
                className="text-[11px] px-3 py-1 rounded-full bg-white/[0.08] hover:bg-gradient-to-r hover:from-primary hover:to-secondary border border-white/15 text-white/90 hover:text-white transition-all flex items-center gap-1 group shadow-sm active:scale-95"
              >
                <span>{sugg}</span>
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform opacity-70" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hey there! I'm Sarweshwar's AI Portfolio Assistant.\n\nAsk me anything about his AI/ML projects, skills, internships, certifications, or how to connect!",
      isBot: true,
      timestamp: new Date()
    }
  ]);

  const chatboxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom smoothly when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initial floating button entrance
  useEffect(() => {
    gsap.fromTo(buttonRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 1, delay: 2, ease: "back.out(1.7)" }
    );
  }, []);

  // Chatbox open animation
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(chatboxRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  // Waving robot badge animation
  useEffect(() => {
    if (robotRef.current) {
      gsap.to(robotRef.current, {
        rotation: 15,
        duration: 0.35,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        transformOrigin: "bottom center"
      });
    }
  }, []);

  const toggleChat = () => {
    if (isOpen) {
      gsap.to(chatboxRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setIsOpen(false)
      });
    } else {
      setIsOpen(true);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "✨ Chat cleared! What would you like to explore about Sarweshwar?",
        isBot: true,
        timestamp: new Date()
      }
    ]);
  };

  const callGemini = async (userQuery: string, history: Array<{ isBot: boolean; text: string }>) => {
    const apiKey = GEMINI_API_KEY.trim();

    if (!apiKey) {
      return "⚠️ Gemini API Key Required\n\nPlease add your Gemini API key in the .env file:\nVITE_GEMINI_API_KEY=your_key_here\n\nYou can generate a free API key at Google AI Studio (aistudio.google.com).";
    }

    // Build multi-turn conversation history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    history.forEach((m) => {
      contents.push({
        role: m.isBot ? 'model' : 'user',
        parts: [{ text: m.text }]
      });
    });

    // Make sure contents starts with a 'user' turn as required by Gemini
    while (contents.length > 0 && contents[0].role !== 'user') {
      contents.shift();
    }

    // Append the current query
    contents.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    // Support gemini-2.5-flash, gemini-2.0-flash, and gemini-1.5-flash fallback
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError: any = null;

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: PORTFOLIO_SYSTEM_PROMPT }]
              },
              contents: contents,
              generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 900,
                topP: 0.95
              }
            })
          }
        );

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          const errMsg = errBody.error?.message || `HTTP ${response.status}`;
          lastError = new Error(errMsg);
          console.warn(`Gemini (${model}) failed:`, errMsg);
          continue; // Try next model fallback
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;

        if (text) {
          return text;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error("Failed to get response from Gemini API");
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || message).trim();
    if (!query || isLoading) return;

    const newUserMessage = {
      id: Date.now(),
      text: query,
      isBot: false,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setMessage('');
    setIsLoading(true);

    try {
      const history = updatedMessages
        .filter((m) => m.id !== 1)
        .map((m) => ({ isBot: m.isBot, text: m.text }));

      history.pop(); // Pop current query as it's passed separately

      let aiReply = '';
      try {
        // Primary: Call FastAPI backend with Supabase pgvector RAG
        const backendRes = await fetch(`${BACKEND_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            history: history.map((m) => ({ text: m.text, isBot: m.isBot }))
          })
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          aiReply = data.reply;
        } else {
          throw new Error(`Backend returned HTTP ${backendRes.status}`);
        }
      } catch (backendError) {
        console.warn('FastAPI RAG backend not reachable, using direct client fallback:', backendError);
        aiReply = await callGemini(query, history);
      }

      const botResponse = {
        id: Date.now() + 1,
        text: aiReply,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);

      const errorResponse = {
        id: Date.now() + 1,
        text: `⚠️ Error connecting to Gemini:\n${error.message || 'Please check your API key in the .env file.'}\n\nPlease check that your VITE_GEMINI_API_KEY in .env is valid.`,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50">
      {/* Waving Robot Floating Indicator */}
      {!isOpen && (
        <div
          className="absolute -top-16 right-1 flex items-center gap-2 bg-zinc-950/80 backdrop-blur-xl border border-white/15 rounded-2xl px-3.5 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer select-none hover:scale-105 transition-all group"
          onClick={toggleChat}
        >
          <div ref={robotRef} className="text-2xl group-hover:scale-110 transition-transform">
            👋
          </div>
          <span className="text-white font-semibold text-sm tracking-wide flex items-center gap-1.5">
            Chat with AI <Sparkle size={14} weight="fill" className="text-primary animate-pulse" />
          </span>
        </div>
      )}

      {/* Enlarged Premium Chat Window */}
      {isOpen && (
        <div
          ref={chatboxRef}
          className="mb-3 w-[calc(100vw-24px)] sm:w-[460px] md:w-[480px] h-[min(580px,calc(100dvh-115px))] sm:h-[min(580px,calc(100dvh-125px))] max-h-[calc(100dvh-115px)] flex flex-col bg-zinc-950/90 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-300"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-primary/15 via-secondary/10 to-transparent flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-tr from-primary to-secondary rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                  <Robot size={22} weight="fill" className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">Sarweshwar AI</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary font-medium flex items-center gap-1">
                    <Sparkle size={10} weight="fill" /> RAG • pgvector
                  </span>
                </div>
                <p className="text-xs text-white/50 font-light">Interactive Portfolio Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleResetChat}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <ArrowCounterClockwise size={16} />
              </button>
              <button
                onClick={toggleChat}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[88%] px-4 py-3 rounded-2xl shadow-md transition-all ${
                    msg.isBot
                      ? 'bg-zinc-900/80 border border-white/10 text-white rounded-tl-sm'
                      : 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm text-sm'
                  }`}
                >
                  <FormattedMessage
                    text={msg.text}
                    isBot={msg.isBot}
                    onSelectSuggestion={(q) => handleSendMessage(q)}
                  />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-zinc-900/80 border border-white/10 text-white rounded-tl-sm shadow-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips (when conversation is fresh) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 sm:px-5 pb-3 shrink-0">
              <p className="text-[11px] font-medium text-white/40 mb-2 flex items-center gap-1">
                <Sparkle size={12} weight="fill" className="text-secondary" /> Popular questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {defaultQuickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] active:scale-95 border border-white/10 text-white/80 hover:text-white transition-all text-left shadow-sm hover:border-primary/40"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-white/10 bg-black/50 backdrop-blur-xl shrink-0">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about AI projects, skills, experience..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !message.trim()}
                className="p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-primary shrink-0"
                aria-label="Send message"
              >
                <PaperPlaneTilt size={18} weight="fill" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        ref={buttonRef}
        onClick={toggleChat}
        className="chatbot w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center shadow-glow-primary hover:scale-110 active:scale-95 transition-transform"
        aria-label="Toggle portfolio chatbot"
      >
        {isOpen ? (
          <X size={26} weight="bold" />
        ) : (
          <ChatCircle size={28} weight="fill" />
        )}
      </button>
    </div>
  );
};

export default Chatbot;