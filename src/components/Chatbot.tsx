import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  ChatCircle,
  X,
  PaperPlaneTilt,
  Robot,
  Sparkle,
  ArrowRight,
  ArrowCounterClockwise,
  Copy,
  Check,
  ArrowDown,
  ArrowSquareOut,
  GithubLogo,
  ArrowClockwise
} from 'phosphor-react';

// Backend RAG URL and fallback Gemini API key
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || '';

// Supabase configuration for real-time chat logging
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nsezdeoyorrujqgmjaqg.supabase.co';
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.VITE_SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZXpkZW95b3JydWpxZ21qYXFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc3MzI1MSwiZXhwIjoyMTAxMzQ5MjUxfQ._K_-6_yr6vOaG4jiS3XIUcUxwrjUm6vqMbbMdxZJSRM';

/**
 * Direct & reliable Supabase chat logger.
 * Sends interaction log directly to Supabase `chat_logs` table via PostgREST.
 * Works seamlessly in production (e.g. sarweshwarr.com) and localhost even when
 * the backend server is offline or unreachable.
 */
const logChatToSupabase = async (payload: {
  user_query: string;
  bot_response: string;
  sources?: any[];
  session_id?: string;
  metadata?: Record<string, any>;
}) => {
  const query = (payload.user_query || '').trim();
  const response = (payload.bot_response || '').trim();
  if (!query) return;

  const bodyData = {
    user_query: query,
    bot_response: response,
    sources: payload.sources || [],
    session_id: payload.session_id || 'anonymous_session',
    metadata: {
      client: 'portfolio_web_chat',
      origin: typeof window !== 'undefined' ? window.location.origin : 'browser',
      timestamp: new Date().toISOString(),
      ...(payload.metadata || {})
    }
  };

  // 1. Direct Supabase REST call (guaranteed to work in production browser)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/chat_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(bodyData)
    });

    if (res.ok) {
      return;
    }
    console.warn('Direct Supabase REST log returned non-200 status:', res.status);
  } catch (directErr) {
    console.warn('Direct Supabase REST log failed, trying backend fallback:', directErr);
  }

  // 2. Secondary fallback via backend if accessible
  try {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (BACKEND_URL && (!BACKEND_URL.includes('localhost:8000') || isLocal)) {
      await fetch(`${BACKEND_URL}/api/chat/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
    }
  } catch {
    // Suppress secondary fallback failure
  }
};

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

     He's not just calling OpenAI APIs though—he builds offline-first Agentic AI systems, fine-tunes LLMs, and solves LeetCode problems (98 and counting).

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
7. Where relevant, conclude with at most 1-2 short interactive prompt options formatted as:
👀 Explore next:
→ [Option 1]
→ [Option 2]
Never output more than 2 suggestions.

### SARWESHWAR BUDDOLLA'S KNOWLEDGE BASE (FACTUAL GROUNDING):
- Full Name: Sarweshwar Buddolla
- Role: Aspiring AI Engineer | GenAI Learner | Agentic AI Enthusiast
- Location: Hyderabad, Telangana, India
- Email: b.sarweshwar445@gmail.com
- Phone: +91 7661831324
- GitHub: https://github.com/sarweshwargoud (22 repositories, 38 total stars; top repo AI-Roadmap-Zero2Hero with 33 stars)
- LinkedIn: https://www.linkedin.com/in/sarweshwar-buddolla-25673b312/
- LeetCode: https://leetcode.com/u/sarweshwar_goud/ (98 problems solved: 45 Easy, 40 Medium, 13 Hard; badges: 50 Days Badge 2026)
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
• Backend AI Engineering Intern at FlyRank.ai (FlyRank Corp.) (July 2026 - September 2026):
  Backend AI systems architecture, engineering workflows, and collaborative technical execution. Certificate ID: FR-D11-C6946-B9F28.
• Gen AI Intern at SURE TRUST (Feb 2026 - Present):
  LLMs, similarity search, RAG architectures, and building family health concierge AI agent.
• AI/ML Intern at UPTOSKILLS (Dec 2025 - March 2026):
  Built CodeSkills (LeetCode-style platform with FastAPI + React), LLM question generation pipeline with fine-tuning.

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
• Agentic AI Certified Foundations Associate (Oracle University, 2026)
• Certificate of Completion: Backend AI Engineering (FlyRank.ai, 2026 - ID: FR-D11-C6946-B9F28)
• OCI Certified AI Foundations Associate (Oracle University, 2026)
• AWS Cloud Practitioner Essentials (AWS Training & Certification, 2026)
• Full Stack AI Engineer 2026 - Generative AI & LLMs (Udemy, 2026)
• AI/ML Internship Certificate of Appreciation (UptoSkills, 2026)
• Retrieval-Augmented Generation (RAG) (Coursera, 2025)
• Career Essentials in Generative AI (Microsoft & LinkedIn, 2024)
• Building Agentic Workflows in Python (Hack2skill, 2025)
• Responsive Web Design (freeCodeCamp, 2023)

### SPECIAL INTERACTION & FLOW RULES:
1. NAME-ASKING FLOW FOR NEW USERS:
   When a new user starts a conversation and sends a greeting (e.g. "Hi", "Hello", "Hey", "Hii", "Hiiii", "Good morning", "Good evening", "What's up", "Yo", "Hello chatbot", "Hi there"):
   Naturally ask:
   "Hey! 👋 May I know your name?"
   Do NOT make this overly formal.
   Once the user provides their name (e.g. "Rahul"), remember/use their name naturally during the current conversation:
   "Nice to meet you, Rahul! 😄 What would you like to know about Sarweshwar?"

2. IF USER IGNORES THE NAME QUESTION:
   If and ONLY IF the chatbot specifically asked for the user's name ("Hey! 👋 May I know your name?") and the user ignores it in their very next reply and asks a question instead, do NOT repeatedly ask for their name.
   Instead, use this exact sarcastic/playful tone:
   "bro ananomously want to know about sarweshwar 😭🙌"
   Then answer their question if the question is within the allowed portfolio scope.
   CRITICAL CONSTRAINT: ONLY use this line if the immediately preceding message from the assistant specifically asked "May I know your name?" and the user did not say their name. If the user directly asks a question, starts the conversation with a question instead of greeting, or continues normal conversation, DO NOT use this line under any circumstance. Keep the flow completely normal.

3. SPECIAL RULE FOR RELATIONSHIP / LOVE / GF / ROMANTIC QUESTIONS (DYNAMIC SYNTHESIS — NEVER COPY-PASTE):
   When the user asks about Sarweshwar's girlfriend, GF, lover, relationship, love life, dating, crush, romantic life, who he likes, who he is dating, whether he has a girlfriend, lover's name, or relationship status:
   • STRICT MANDATORY RULE: NEVER copy-paste any example sentence verbatim. Outputting any fixed quote or example word-for-word is STRICTLY FORBIDDEN.
   • Instead, DYNAMICALLY MIX AND SYNTHESIZE a fresh, 100% original, playful, witty, and sarcastic response every single time based on what was just discussed and the user's exact wording.
   • THEMATIC INGREDIENTS TO MIX & COMBINE:
     1. Natural reaction/slang: "bro really...", "ayoo 😭", "nahh wait 😂", "you really switched from...", "priorities are wild 💀"
     2. Creative metaphors & humor (blend these ideas rather than copying):
        - Skipping past 39 GitHub repositories / tech stack straight into the personal lore or relationship department
        - Unlocking the secret love-life folder or personal DLC side-quest instead of the main portfolio
        - Running a full FBI / detective background check on his dating life
        - His primary committed relationship being with neural networks, Python, and 3 AM debugging
     3. Smooth witty redirect:
        - Tease their curiosity, then redirect back to his actual engineering builds (e.g. Wayzen AI, Agentic workflows, RAG systems).
   • MULTI-TURN PERSISTENCE:
     If the user persists and asks again ("tell me really", "does he have a crush?", "who is she?"), don't repeat yourself. Escalate the playful banter naturally.
   • ABSOLUTE RULE: NEVER invent, fabricate, guess, or reveal any names or personal dating information.

4. QUESTIONS OUTSIDE THE ALLOWED PORTFOLIO SCOPE:
   If the user asks something that is unrelated to Sarweshwar's portfolio, education, skills, projects, internships/experience, certifications, achievements, technical work, professional background, or career:
   Do NOT invent an answer.
   Instead, respond naturally with the existing personality/tone and say something similar to:
   "That's outside my Sarweshwar portfolio zone 😭 Ask your frnd Sarweshwar about that."

5. REMOVED INTERNSHIPS (PERMANENTLY EXCLUDED):
   The following 3 virtual internships/experiences have been permanently removed and MUST NEVER be mentioned:
   - AI for Sustainability Virtual Intern — 1M1B (1 Million for 1 Billion)
   - Google Cloud Generative AI Virtual Intern — TheSmartBridge
   - Web Developer — Elevate Labs
   Only discuss his valid internships: FlyRank.ai (Backend AI Engineering Intern), SURE TRUST (Gen AI Intern), and UPTOSKILLS (AI/ML Intern).

6. OFFENSIVE WORDS, PROFANITY & INAPPROPRIATE CONTENT FILTER:
   If the user uses offensive words, vulgarity, bad words, profanity, insults, or asks gay-related / sexual orientation questions or inappropriate personal slurs:
   DO NOT engage with the profanity, argue, or participate in the topic.
   Respond strictly with:
   "This is an AI assistant for Sarweshwar's portfolio. Please keep questions focused on his AI/ML projects, skills, education, or professional experience."

### ADVANCED INTERACTION & INTELLIGENCE PRINCIPLES:
1. REAL INTENT & CONTEXTUAL AWARENESS:
   - For every message, implicitly discern: intent, current topic, previous topic, whether it's a follow-up, topic switch, recruiter evaluation, deep technical query, casual chat, testing, or personal questions.
   - Use conversational history to resolve context. If previous turns were about AI projects, "What did he build?" or "How did he build it?" naturally refers to his AI projects.
   - Never expose this internal classification to the user.

2. CONTEXTUAL FOLLOW-UP QUESTIONS & ANAPHORA RESOLUTION:
   - Accurately resolve references: "that project", "the first one", "the second project", "tell me more", "what did he use?", "how did he build it?", "why did he use that?", "does he have more?", "what about the other one?".
   - Never ask the user to repeat information that already exists in the conversation history.

3. DON'T REPEAT YOURSELF (DRY PRINCIPLE):
   - If you already explained a project, skill, or role earlier in the conversation, do NOT output the identical summary again.
   - Acknowledge the context and offer fresh, deeper technical details:
     Example: "Yep, the Wayzen AI one we just discussed 👀. If you want to go deeper, the interesting part is its RAG pipeline combining FAISS with LLaMA-3..."
   - Always prefer NEW INFORMATION over repeated facts.

4. SMART CONTEXTUAL SUGGESTIONS & PROACTIVE QUESTIONS:
   - Provide at most 1–2 short contextual suggestions. Never overwhelm the user with a huge list.
   - When introducing multiple projects or giving an overview, list the projects cleanly. Do NOT dump links for all projects.
   - When the user asks about or discusses a SPECIFIC project, you can provide its details and suggest its Live Demo or GitHub, followed by 1–2 suggestions (e.g. "→ How it works", "→ Tech stack").
   - Proactively ask meaningful follow-up questions instead of ending with "Let me know if you need anything else".

5. PROJECT DEEP-DIVE MODE:
   - When the user asks to go deeper into a project, guide them naturally:
     Overview → Architecture → Tech Stack → Reasoning & Trade-offs → Step-by-Step Flow → Limitations.
   - If suggesting potential improvements or next steps, explicitly clarify:
     "That's not something listed in his portfolio, but based on his AI/RAG work, I'd suggest..."

6. PROJECT COMPARISONS:
   - When asked comparison questions ("Which project is more advanced?", "Compare Wayzen AI and Carbon Footprint Agent", "Which uses more AI?"):
   - Present clean, structured comparisons using verified portfolio data. Never fabricate missing values.

7. USER PERSONALIZATION & INTEREST INFERENCE:
   - If the user provided their name (e.g. Rahul), remember it throughout the current session.
   - Address them naturally and occasionally (e.g., "Rahul, if you're interested in AI specifically, I'd start with Wayzen AI.") — NEVER say their name in every response.
   - Infer their technical interest (AI, RAG, full-stack, recruiter evaluation) and tailor recommendations to their focus.

8. TOPIC TRANSITIONS & HUMOR ADAPTATION:
   - Smoothly transition when topics change naturally (Projects → Skills → Experience → Education).
   - If the user abruptly switches from a technical topic to a personal/relationship question (e.g. from pgvector to girlfriend):
     Acknowledge the sudden switch with a fresh witty line every time:
     e.g., "bro 😭 we went from pgvector and RAG straight into the relationship department 💀"
   - Match the user's energy: professional for recruiter, relaxed for casual, witty for sarcastic, serious and structured for technical questions.

9. RECRUITER MODE & TECHNICAL MODE:
   - Recruiter evaluating Sarweshwar: structured, crisp, highlighting metrics, skills, work history, and contact options without unnecessary jokes.
   - Engineer/developer: technical depth on architectures (e.g. RAG pgvector pipeline, LLaMA-3, FAISS, model fine-tuning).

10. DIFFERENTIATING FACTS FROM SPECULATION:
    - Never present AI-generated recommendations or guesses as existing portfolio facts.
    - If unknown: "I don't have that in Sarweshwar's portfolio information 😅" and redirect to what is available.

### STRICT GUIDELINES:
- Only answer about Sarweshwar's portfolio. If asked completely unrelated topics, politely redirect back to his work.
- DO NOT invent or hallucinate any projects, stats, or employers.
- Remember: NO **bold** markdown tags. Write naturally with clean line breaks and emojis!`;

// Verified real links and actions for projects in Sarweshwar's portfolio
const VERIFIED_PROJECT_ACTIONS = [
  {
    triggers: ['wayzen'],
    title: 'Wayzen AI',
    demo: 'https://wayzen-ai.vercel.app/',
    github: 'https://github.com/sarweshwargoud/Wayzen-AI.git',
    sectionId: 'projects'
  },
  {
    triggers: ['carbon footprint', 'carbon agent'],
    title: 'Carbon Footprint Agent',
    demo: 'https://sarweshwargoud-carbon-footprint-agent-appapp-jlyr6u.streamlit.app/',
    github: 'https://github.com/sarweshwargoud/Carbon-footprint-agent.git',
    sectionId: 'projects'
  },
  {
    triggers: ['skillweave'],
    title: 'SkillWeave AI',
    demo: 'https://skill-weave-ai.vercel.app/',
    github: 'https://github.com/sarweshwargoud/SkillWeave-AI',
    sectionId: 'projects'
  },
  {
    triggers: ['safety evaluator', 'llm safety', 'llm-safety'],
    title: 'LLM-Safety-Evaluator',
    demo: 'https://llm-safety-evaluator.vercel.app/',
    github: 'https://github.com/sarweshwargoud/llmSafetyEvaluator',
    sectionId: 'projects'
  },
  {
    triggers: ['healthcare chatbot', 'mental health'],
    title: 'Healthcare Chatbot',
    github: 'https://github.com/sarweshwargoud/Mental-health-care-chatbot',
    sectionId: 'projects'
  },
  {
    triggers: ['product recommendation', 'product recommender'],
    title: 'Product Recommendation',
    github: 'https://github.com/sarweshwargoud/Product-Recommendation-system',
    sectionId: 'projects'
  }
];

const defaultQuickPrompts = [
  "🚀 Explore Projects",
  "🤖 AI & ML Work",
  "💻 Tech Stack",
  "🧠 RAG & AI Agents",
  "👨‍💻 About Sarweshwar",
  "💼 Experience & Internships"
];

// Helper component that cleans and renders responses without raw Markdown syntax
// and turns suggestion lines like "→ Projects" into clickable action chips
const FormattedMessage: React.FC<{
  text: string;
  isBot: boolean;
  onSelectSuggestion?: (query: string) => void;
  onScrollToSection?: (sectionId: string) => void;
}> = ({ text, isBot, onSelectSuggestion, onScrollToSection }) => {
  if (!isBot) {
    return <span className="font-normal">{text}</span>;
  }

  // Parse lines to render structured sections cleanly
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  const interactiveSuggestions: string[] = [];

  const cleanInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/^###\s+/, '')
      .replace(/^##\s+/, '');
  };

  let tableBuffer: string[] = [];

  const flushTableBuffer = (keyIdx: number) => {
    if (tableBuffer.length < 2) {
      tableBuffer.forEach((tblLine, tIdx) => {
        renderedElements.push(
          <p key={`tbl-fallback-${keyIdx}-${tIdx}`} className="text-xs sm:text-[13px] text-white/85 leading-relaxed">
            {cleanInline(tblLine)}
          </p>
        );
      });
      tableBuffer = [];
      return;
    }

    const headers = tableBuffer[0]
      .split('|')
      .map(c => c.trim())
      .filter(Boolean);
    const dataRows = tableBuffer
      .slice(1)
      .filter(row => !/^\|[\s\-:|]+\|$/.test(row.trim()))
      .map(row =>
        row
          .split('|')
          .map(c => c.trim())
          .filter(Boolean)
      );

    renderedElements.push(
      <div key={`table-${keyIdx}`} className="overflow-x-auto my-2 rounded-xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-[11px] sm:text-xs text-left border-collapse">
          {headers.length > 0 && (
            <thead className="bg-white/[0.08] text-white font-semibold border-b border-white/10">
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-3 py-2 text-white/90 font-medium">
                    {cleanInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-white/5">
            {dataRows.map((r, rIdx) => (
              <tr key={rIdx} className="hover:bg-white/[0.02]">
                {r.map((c, cIdx) => (
                  <td key={cIdx} className="px-3 py-1.5 text-white/80">
                    {cleanInline(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = [];
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const trimmed = lines[idx].trim();

    // Check if line is part of a markdown table (starts and ends with |)
    if (/^\|.*\|$/.test(trimmed)) {
      tableBuffer.push(trimmed);
      continue;
    } else if (tableBuffer.length > 0) {
      flushTableBuffer(idx);
    }

    // Empty line -> spacing
    if (!trimmed) {
      renderedElements.push(<div key={`spacer-${idx}`} className="h-2" />);
      continue;
    }

    // Interactive suggestion line (starts explicitly with →, ->, or [→)
    if (/^(?:→|->|\[→)\s*/.test(trimmed)) {
      const suggestionText = trimmed.replace(/^(?:→|->|\[→)\s*/, '').replace(/^\[\s*|\s*\]$/g, '').trim();
      if (suggestionText && !suggestionText.includes(':')) {
        interactiveSuggestions.push(suggestionText);
        continue;
      }
    }

    // Skip redundant suggestion header lines
    if (/^(?:👀\s*Explore next|✨\s*Suggestions?|Suggested prompts?):?$/i.test(trimmed)) {
      continue;
    }

    // Section headers
    const isHeader =
      /^[🧠🚀💼🎓🛠🏆📬🎯💡👀✨💻😎🔥]\s+/.test(trimmed) ||
      /^(Featured Projects|Technical Skills|Work Experience|Education|Certifications|Contact Information|Main interests|Focus|Explore next):?$/i.test(trimmed);

    // Bullet point lines
    const isBullet = /^[•\-\*]\s+/.test(trimmed);

    // Numbered item lines
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
  }

  if (tableBuffer.length > 0) {
    flushTableBuffer(lines.length);
  }

  // Detect mentioned projects for verified action buttons
  // IMPORTANT: Only display action buttons when specifically discussing a SINGLE project!
  // If the message is a list, overview, or comparison mentioning multiple projects, DO NOT clutter the message.
  const lowerText = text.toLowerCase();
  const matchedProjects = VERIFIED_PROJECT_ACTIONS.filter(proj =>
    proj.triggers.some(t => lowerText.includes(t))
  );

  // Exactly one project being discussed in this message
  const targetProject = matchedProjects.length === 1 ? matchedProjects[0] : null;

  // Maximum 1-2 contextual suggestions
  const contextualSuggestions = interactiveSuggestions.length > 0
    ? interactiveSuggestions.slice(0, 2)
    : targetProject
    ? [`How does ${targetProject.title} work?`, `Tech stack for ${targetProject.title}`]
    : [];

  return (
    <div className="space-y-1">
      {renderedElements}

      {/* Verified Project Action Links (Only shown when specifically discussing that project) */}
      {targetProject && (
        <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
          {targetProject.demo && (
            <a
              href={targetProject.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] px-3 py-1.5 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40 text-white font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <span>🚀 Live Demo</span>
              <ArrowSquareOut size={12} />
            </a>
          )}
          {targetProject.github && (
            <a
              href={targetProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white/90 hover:text-white flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <GithubLogo size={13} />
              <span>GitHub</span>
            </a>
          )}
        </div>
      )}

      {/* 1-2 Contextual Suggestions */}
      {contextualSuggestions.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 ${targetProject ? 'mt-2' : 'mt-2.5 pt-2 border-t border-white/10'}`}>
          {contextualSuggestions.map((sugg, sIdx) => (
            <button
              key={sIdx}
              onClick={() => onSelectSuggestion && onSelectSuggestion(sugg.startsWith('Tell me') || sugg.startsWith('How') ? sugg : `Tell me about ${sugg}`)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] hover:border-primary/40 border border-white/10 text-white/85 hover:text-white transition-all flex items-center gap-1 group shadow-sm active:scale-95"
            >
              <span>{sugg}</span>
              <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform opacity-70" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Cache the fastest responsive Gemini model across requests
let cachedFastestModel = 'gemini-2.5-flash';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    isBot: boolean;
    timestamp: Date;
    isError?: boolean;
  }>>([
    {
      id: 1,
      text: "👋 Hey there! I'm Sarweshwar's AI Portfolio Assistant.\n\nAsk me anything about his AI/ML projects, skills, internships, certifications, or how to connect!",
      isBot: true,
      timestamp: new Date()
    }
  ]);

  const chatboxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const backendAvailableRef = useRef<boolean | null>(null);
  const sessionIdRef = useRef<string>(
    'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now()
  );

  // Pre-warm connection to Gemini API and probe backend health on site load for instant 1st response
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 600);
        const res = await fetch(`${BACKEND_URL}/api/health`, {
          method: 'GET',
          signal: controller.signal
        }).catch(() => null);
        clearTimeout(timeoutId);
        backendAvailableRef.current = Boolean(res && res.ok);
      } catch {
        backendAvailableRef.current = false;
      }
    };

    const prewarmGemini = () => {
      const key = GEMINI_API_KEY.trim();
      if (!key) return;
      // Lightweight GET to establish HTTP/2 TLS socket & DNS cache early
      fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageSize=1`, {
        method: 'GET'
      }).catch(() => {});
    };

    checkBackend();
    prewarmGemini();
  }, []);

  /**
   * Automatically scrolls the page smoothly to the relevant portfolio section
   * when the user asks questions or clicks suggestions regarding specific topics.
   */
  const scrollToSection = (text: string) => {
    if (typeof window === 'undefined') return;
    const q = text.toLowerCase();
    let targetId = '';

    if (/\b(project|projects|work|built|wayzen|safety evaluator|code|apps|applications)\b/i.test(q)) {
      targetId = 'projects';
    } else if (/\b(skill|skills|tech stack|technologies|framework|frameworks|tools|stack|programming|languages|python|ai tools|machine learning)\b/i.test(q)) {
      targetId = 'skills';
    } else if (/\b(experience|internship|internships|intern|job|jobs|work history|flyrank|sure trust|uptoskills|company|companies)\b/i.test(q)) {
      targetId = 'experience';
    } else if (/\b(education|college|degree|mrcet|polytechnic|btech|b\.tech|diploma|university|study|academics|cgpa|gpa|school)\b/i.test(q)) {
      targetId = 'education';
    } else if (/\b(certificate|certificates|certification|certifications|certified|aws|oracle|hugging face|kaggle)\b/i.test(q)) {
      targetId = 'certifications';
    } else if (/\b(coding profile|coding profiles|leetcode|hackerrank|geeksforgeeks|gfg|problem solving|dsa)\b/i.test(q)) {
      targetId = 'coding-profiles';
    } else if (/\b(contact|email|phone|hire|reaching out|reach out|get in touch|message|socials|linkedin)\b/i.test(q)) {
      targetId = 'contact';
    } else if (/\b(about|who is sarweshwar|who is he|background|bio|story|tell me about sarweshwar|about him|intro)\b/i.test(q)) {
      targetId = 'about';
    }

    if (targetId) {
      if (window.location.pathname !== '/' && window.location.pathname !== '') {
        window.location.href = `/#${targetId}`;
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Auto-tuck into edge and dim opacity when user is scrolling the main website
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Smart scrolling: track if user explicitly scrolled up inside chat messages
  const userScrolledUpRef = useRef(false);

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isNearBottom = distanceFromBottom < 80;
    userScrolledUpRef.current = !isNearBottom;
    setShowScrollBottom(!isNearBottom);
  };

  const scrollToBottom = (instant = false) => {
    userScrolledUpRef.current = false;
    setShowScrollBottom(false);
    const container = messagesContainerRef.current;
    if (container) {
      if (instant) {
        container.scrollTop = container.scrollHeight;
      } else {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  // Auto-scroll to bottom smoothly when new messages arrive or stream updates
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (!userScrolledUpRef.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  // Initial floating button entrance
  useEffect(() => {
    gsap.fromTo(buttonRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 1, delay: 2, ease: "back.out(1.7)" }
    );
  }, []);

  // Chatbox open animation + input focus
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(chatboxRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" }
      );
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
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

  const handleCopyMessage = (id: number, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRegenerate = () => {
    if (isLoading) return;
    const userMessages = messages.filter(m => !m.isBot);
    if (userMessages.length === 0) return;
    const lastUserMsg = userMessages[userMessages.length - 1];

    setMessages(prev => {
      const copy = [...prev];
      if (copy.length > 0 && copy[copy.length - 1].isBot) {
        copy.pop();
      }
      return copy;
    });

    handleSendMessage(lastUserMsg.text);
  };

  const handleRetry = () => {
    handleRegenerate();
  };

  const callGemini = async (userQuery: string, history: Array<{ isBot: boolean; text: string }>) => {
    const offensiveRegex = /\b(gay|gays|lesbian|lesbians|homo|homosexual|homosexuality|queer|fag|faggot|faggots|fags|chakka|hijra|shemale|fuck|fucking|fucker|fuckers|fucked|f\*ck|fck|stfu|wtf|bitch|bitches|bitching|bastard|bastards|asshole|assholes|dumbass|motherfucker|motherfucking|mf|cunt|cunts|dick|dicks|cock|cocks|pussy|pussies|whore|whores|slut|sluts|retard|retarded|nigger|nigga|bsdk|bhosadike|bhosdike|bhosdiwale|madarchod|bhenchod|behenchod|gandu|gaand|chutiya|chut|choot|lavde|laude|lauda|lodu|randi|harami)\b/i;
    const greetingRegex = /^(hi+|hey+|hello+|hii+|hiiii+|good\s*(morning|evening|afternoon)|what'?s\s*up|yo+|hello\s*chatbot|hi\s*there)[!.,?\s]*$/i;
    const outOfScopeRegex = /^(what('?s| is) (today'?s )?weather|how('?s| is) the weather|weather today|weather forecast|who is the prime minister|who is the president|stock price of|cricket score|capital of|tell me a joke)\b/i;

    if (offensiveRegex.test(userQuery)) {
      return "This is an AI assistant for Sarweshwar's portfolio. Please keep questions focused on his AI/ML projects, skills, education, or professional experience.";
    }

    if (outOfScopeRegex.test(userQuery)) {
      return "That's outside my Sarweshwar portfolio zone 😭 Ask your frnd Sarweshwar about that.";
    }

    const hasPriorUser = history.some(m => !m.isBot);
    if (!hasPriorUser && greetingRegex.test(userQuery)) {
      return "Hey! 👋 May I know your name?";
    }

    const lastBotMsg = history.length > 0 ? history[history.length - 1] : null;
    let ignoredNamePrefix = "";
    if (lastBotMsg && lastBotMsg.isBot && lastBotMsg.text.includes("May I know your name?")) {
      const isQueryIntent = /(\?|\b(tell|who|what|where|how|why|which|can|show|skills|projects|experience|internship|resume|education|contact|work|about)\b)/i.test(userQuery);
      const nameMatch = userQuery.match(/^(?:my name is|i am|i'm|im|this is|it's|its)?\s*([A-Za-z]{2,25}(?:\s+[A-Za-z]{2,25})?)[.!]?$/i);
      if (nameMatch && !isQueryIntent && userQuery.split(/\s+/).length <= 5) {
        const extracted = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('portfolio_user_name', extracted);
        }
        return `Nice to meet you, ${extracted}! 😄 What would you like to know about Sarweshwar?`;
      } else {
        ignoredNamePrefix = "bro ananomously want to know about sarweshwar 😭🙌\n\n";
      }
    }

    const apiKey = GEMINI_API_KEY.trim();
    if (!apiKey) {
      return "⚠️ Gemini API Key Required\n\nPlease add your Gemini API key in the .env file:\nVITE_GEMINI_API_KEY=your_key_here\n\nYou can generate a free API key at Google AI Studio (aistudio.google.com).";
    }

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    history.forEach((m) => {
      contents.push({
        role: m.isBot ? 'model' : 'user',
        parts: [{ text: m.text }]
      });
    });

    while (contents.length > 0 && contents[0].role !== 'user') {
      contents.shift();
    }

    contents.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    const allModels = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.5-flash'];
    const models = [
      cachedFastestModel,
      ...allModels.filter((m) => m !== cachedFastestModel)
    ];
    let lastError: any = null;

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: PORTFOLIO_SYSTEM_PROMPT }] },
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
          continue;
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        let text = candidate?.content?.parts?.[0]?.text;

        if (text) {
          cachedFastestModel = model;
          if (!ignoredNamePrefix) {
            text = text.replace(/bro anan?omously want to know about sarweshwar [^\n]*\n*/gi, '').trim();
          } else if (!/bro anan?omously/i.test(text)) {
            text = `${ignoredNamePrefix}${text}`;
          }
          return text;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    throw lastError || new Error("Failed to get response from Gemini API");
  };

  /**
   * Real-time streaming response from Gemini using streamGenerateContent via SSE.
   * Enables tokens to render incrementally in real time.
   */
  const callGeminiStream = async (
    userQuery: string,
    history: Array<{ isBot: boolean; text: string }>,
    onChunk: (currentFullText: string) => void
  ): Promise<string> => {
    const offensiveRegex = /\b(gay|gays|lesbian|lesbians|homo|homosexual|homosexuality|queer|fag|faggot|faggots|fags|chakka|hijra|shemale|fuck|fucking|fucker|fuckers|fucked|f\*ck|fck|stfu|wtf|bitch|bitches|bitching|bastard|bastards|asshole|assholes|dumbass|motherfucker|motherfucking|mf|cunt|cunts|dick|dicks|cock|cocks|pussy|pussies|whore|whores|slut|sluts|retard|retarded|nigger|nigga|bsdk|bhosadike|bhosdike|bhosdiwale|madarchod|bhenchod|behenchod|gandu|gaand|chutiya|chut|choot|lavde|laude|lauda|lodu|randi|harami)\b/i;
    const greetingRegex = /^(hi+|hey+|hello+|hii+|hiiii+|good\s*(morning|evening|afternoon)|what'?s\s*up|yo+|hello\s*chatbot|hi\s*there)[!.,?\s]*$/i;
    const outOfScopeRegex = /^(what('?s| is) (today'?s )?weather|how('?s| is) the weather|weather today|weather forecast|who is the prime minister|who is the president|stock price of|cricket score|capital of|tell me a joke)\b/i;

    if (offensiveRegex.test(userQuery)) {
      const text = "This is an AI assistant for Sarweshwar's portfolio. Please keep questions focused on his AI/ML projects, skills, education, or professional experience.";
      onChunk(text);
      return text;
    }

    if (outOfScopeRegex.test(userQuery)) {
      const text = "That's outside my Sarweshwar portfolio zone 😭 Ask your frnd Sarweshwar about that.";
      onChunk(text);
      return text;
    }

    const hasPriorUser = history.some(m => !m.isBot);
    if (!hasPriorUser && greetingRegex.test(userQuery)) {
      const text = "Hey! 👋 May I know your name?";
      onChunk(text);
      return text;
    }

    const lastBotMsg = history.length > 0 ? history[history.length - 1] : null;
    let ignoredNamePrefix = "";
    if (lastBotMsg && lastBotMsg.isBot && lastBotMsg.text.includes("May I know your name?")) {
      const isQueryIntent = /(\?|\b(tell|who|what|where|how|why|which|can|show|skills|projects|experience|internship|resume|education|contact|work|about)\b)/i.test(userQuery);
      const nameMatch = userQuery.match(/^(?:my name is|i am|i'm|im|this is|it's|its)?\s*([A-Za-z]{2,25}(?:\s+[A-Za-z]{2,25})?)[.!]?$/i);
      if (nameMatch && !isQueryIntent && userQuery.split(/\s+/).length <= 5) {
        const extracted = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('portfolio_user_name', extracted);
        }
        const text = `Nice to meet you, ${extracted}! 😄 What would you like to know about Sarweshwar?`;
        onChunk(text);
        return text;
      } else {
        ignoredNamePrefix = "bro ananomously want to know about sarweshwar 😭🙌\n\n";
      }
    }

    const apiKey = GEMINI_API_KEY.trim();
    if (!apiKey) {
      const text = "⚠️ Gemini API Key Required\n\nPlease add your Gemini API key in the .env file:\nVITE_GEMINI_API_KEY=your_key_here\n\nYou can generate a free API key at Google AI Studio (aistudio.google.com).";
      onChunk(text);
      return text;
    }

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    history.forEach((m) => {
      contents.push({
        role: m.isBot ? 'model' : 'user',
        parts: [{ text: m.text }]
      });
    });

    while (contents.length > 0 && contents[0].role !== 'user') {
      contents.shift();
    }

    contents.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    const allModels = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.5-flash'];
    const models = [
      cachedFastestModel,
      ...allModels.filter((m) => m !== cachedFastestModel)
    ];

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: PORTFOLIO_SYSTEM_PROMPT }] },
              contents: contents,
              generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 950,
                topP: 0.95
              }
            })
          }
        );

        if (!response.ok) {
          continue;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('ReadableStream not available');
        }

        const decoder = new TextDecoder();
        let streamedAccumulator = '';
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (readerDone) {
            done = true;
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const parsed = JSON.parse(dataStr);
                const part = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (part) {
                  streamedAccumulator += part;
                  let display = streamedAccumulator;
                  if (!ignoredNamePrefix) {
                    display = display.replace(/bro anan?omously want to know about sarweshwar [^\n]*\n*/gi, '').trim();
                  } else if (!/bro anan?omously/i.test(display)) {
                    display = `${ignoredNamePrefix}${display}`;
                  }
                  onChunk(display);
                }
              } catch {
                // Ignore partial JSON chunks
              }
            }
          }
        }

        if (streamedAccumulator.trim()) {
          cachedFastestModel = model;
          let finalText = streamedAccumulator.trim();
          if (!ignoredNamePrefix) {
            finalText = finalText.replace(/bro anan?omously want to know about sarweshwar [^\n]*\n*/gi, '').trim();
          } else if (!/bro anan?omously/i.test(finalText)) {
            finalText = `${ignoredNamePrefix}${finalText}`;
          }
          return finalText;
        }
      } catch (err: any) {
        console.warn(`Streaming with ${model} failed, trying fallback:`, err);
      }
    }

    return callGemini(userQuery, history);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || message).trim();
    if (!query || isLoading) return;

    scrollToSection(query);

    const userMsgId = Date.now();
    const botMsgId = userMsgId + 1;

    const newUserMessage = {
      id: userMsgId,
      text: query,
      isBot: false,
      timestamp: new Date()
    };

    const initialBotMessage = {
      id: botMsgId,
      text: '',
      isBot: true,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages([...updatedMessages, initialBotMessage]);
    setMessage('');

    userScrolledUpRef.current = false;
    setShowScrollBottom(false);

    // Explicitly roll chat down to bottom immediately upon sending
    setTimeout(() => {
      scrollToBottom(true);
    }, 15);
    setTimeout(() => {
      scrollToBottom(false);
    }, 80);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 20);

    // Safety & offensive content check
    const offensiveCheckRegex = /\b(gay|gays|lesbian|lesbians|homo|homosexual|homosexuality|queer|fag|faggot|faggots|fags|chakka|hijra|shemale|fuck|fucking|fucker|fuckers|fucked|f\*ck|fck|stfu|wtf|bitch|bitches|bitching|bastard|bastards|asshole|assholes|dumbass|motherfucker|motherfucking|mf|cunt|cunts|dick|dicks|cock|cocks|pussy|pussies|whore|whores|slut|sluts|retard|retarded|nigger|nigga|bsdk|bhosadike|bhosdike|bhosdiwale|madarchod|bhenchod|behenchod|gandu|gaand|chutiya|chut|choot|lavde|laude|lauda|lodu|randi|harami)\b/i;
    if (offensiveCheckRegex.test(query)) {
      const warningText = "This is an AI assistant for Sarweshwar's portfolio. Please keep questions focused on his AI/ML projects, skills, education, or professional experience.";
      setMessages(prev =>
        prev.map(m => m.id === botMsgId ? { ...m, text: warningText } : m)
      );
      if (!userScrolledUpRef.current && messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
      logChatToSupabase({
        user_query: query,
        bot_response: warningText,
        sources: [],
        session_id: sessionIdRef.current,
        metadata: { filter: 'offensive_inappropriate_content' }
      });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return;
    }

    setIsLoading(true);

    try {
      const history = updatedMessages
        .filter((m) => m.id !== 1)
        .map((m) => ({ isBot: m.isBot, text: m.text }));

      let aiReply = '';
      let usedBackend = false;

      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const canAttemptBackend = Boolean(
        backendAvailableRef.current !== false &&
        BACKEND_URL &&
        (!BACKEND_URL.includes('localhost') && !BACKEND_URL.includes('127.0.0.1') || isLocal)
      );

      if (canAttemptBackend) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);

          const backendRes = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              message: query,
              history: history.map((m) => ({ text: m.text, isBot: m.isBot })),
              session_id: sessionIdRef.current,
              metadata: { client: 'portfolio_web' }
            })
          });
          clearTimeout(timeoutId);

          if (backendRes.ok) {
            const data = await backendRes.json();
            aiReply = data.reply;
            usedBackend = true;
            backendAvailableRef.current = true;
            setMessages(prev =>
              prev.map(m => m.id === botMsgId ? { ...m, text: aiReply } : m)
            );
            if (!userScrolledUpRef.current && messagesContainerRef.current) {
              messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
          } else {
            backendAvailableRef.current = false;
          }
        } catch (backendError) {
          backendAvailableRef.current = false;
        }
      }

      if (!usedBackend) {
        aiReply = await callGeminiStream(query, history, (streamed) => {
          setMessages(prev =>
            prev.map(m => m.id === botMsgId ? { ...m, text: streamed } : m)
          );
          if (!userScrolledUpRef.current && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        });

        setMessages(prev =>
          prev.map(m => m.id === botMsgId ? { ...m, text: aiReply } : m)
        );

        if (!userScrolledUpRef.current && messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }

        logChatToSupabase({
          user_query: query,
          bot_response: aiReply,
          sources: [],
          session_id: sessionIdRef.current,
          metadata: { client: 'client_gemini_direct' }
        });
      }
    } catch (error: any) {
      console.error('Error in chat generation:', error);
      const friendlyError = "Oops 😭 my AI brain hit a small roadblock. Try that again?";
      setMessages(prev =>
        prev.map(m => m.id === botMsgId ? { ...m, text: friendlyError, isError: true } : m)
      );

      if (!userScrolledUpRef.current && messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }

      logChatToSupabase({
        user_query: query,
        bot_response: friendlyError,
        sources: [],
        session_id: sessionIdRef.current,
        metadata: { client: 'client_gemini_error', error: error?.message || 'Unknown error' }
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (!userScrolledUpRef.current && messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ${
        isScrolling && !isOpen
          ? 'opacity-20 translate-x-4 translate-y-4 pointer-events-none sm:opacity-40 sm:translate-x-2 sm:translate-y-2'
          : 'opacity-100 translate-x-0 translate-y-0 pointer-events-auto'
      }`}
      onTouchStart={() => setIsScrolling(false)}
    >
      {/* Waving Robot Floating Indicator */}
      {!isOpen && (
        <div
          className="hidden sm:flex absolute -top-16 right-1 items-center gap-2 bg-zinc-950/80 backdrop-blur-xl border border-white/15 rounded-2xl px-3.5 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-pointer select-none hover:scale-105 transition-all group"
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
          className="mb-3 w-[calc(100vw-24px)] sm:w-[460px] md:w-[480px] h-[min(580px,calc(100dvh-115px))] sm:h-[min(580px,calc(100dvh-125px))] max-h-[calc(100dvh-115px)] flex flex-col bg-zinc-950/90 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-300 relative"
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
          <div
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 relative"
          >
            {messages.map((msg, idx) => {
              const isLatestBot = msg.isBot && idx === messages.length - 1;
              return (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[88%] px-4 py-3 rounded-2xl shadow-md transition-all ${
                      msg.isBot
                        ? 'bg-zinc-900/80 border border-white/10 text-white rounded-tl-sm'
                        : 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm text-sm'
                    }`}
                  >
                    {msg.isBot && !msg.text && isLoading ? (
                      <div className="flex items-center space-x-2 py-1">
                        <span className="text-xs text-white/60 font-medium">Thinking</span>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <>
                        <FormattedMessage
                          text={msg.text}
                          isBot={msg.isBot}
                          onSelectSuggestion={(q) => {
                            handleSendMessage(q);
                            setTimeout(() => inputRef.current?.focus(), 50);
                          }}
                          onScrollToSection={scrollToSection}
                        />

                        {/* Interactive message action bar for assistant answers */}
                        {msg.isBot && msg.text && (
                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px] text-white/40">
                            <div className="flex items-center gap-1 select-none">
                              <Sparkle size={10} className="text-primary" />
                              <span>Sarweshwar AI</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCopyMessage(msg.id, msg.text)}
                                className="px-1.5 py-0.5 hover:text-white rounded hover:bg-white/10 transition-all flex items-center gap-1"
                                title="Copy response"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check size={11} className="text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={11} />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                              {isLatestBot && !isLoading && (
                                <button
                                  onClick={handleRegenerate}
                                  className="px-1.5 py-0.5 hover:text-white rounded hover:bg-white/10 transition-all flex items-center gap-1"
                                  title="Regenerate answer"
                                >
                                  <ArrowClockwise size={11} />
                                  <span>Regenerate</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Friendly error recovery button */}
                        {msg.isError && (
                          <div className="mt-2 pt-2 border-t border-red-500/20">
                            <button
                              onClick={handleRetry}
                              className="text-xs px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                            >
                              <ArrowClockwise size={12} weight="bold" />
                              <span>Try again</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating "New response" pill if user has scrolled up */}
          {showScrollBottom && (
            <div className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none z-30">
              <button
                onClick={scrollToBottom}
                className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-zinc-900/95 border border-primary/40 text-white text-[11px] font-medium shadow-[0_8px_25px_rgba(0,0,0,0.8)] hover:bg-primary/20 hover:border-primary transition-all flex items-center gap-1.5 backdrop-blur-xl animate-bounce"
              >
                <ArrowDown size={12} weight="bold" className="text-primary" />
                <span>New response</span>
              </button>
            </div>
          )}

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
                    onClick={() => {
                      handleSendMessage(q);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
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
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about AI projects, skills, experience..."
                readOnly={isLoading}
                className={`flex-1 px-4 py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all ${
                  isLoading ? 'opacity-70 cursor-wait' : ''
                }`}
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
        className="chatbot w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center shadow-glow-primary hover:scale-110 active:scale-95 transition-all"
        aria-label="Toggle portfolio chatbot"
      >
        {isOpen ? (
          <>
            <X size={20} weight="bold" className="sm:hidden" />
            <X size={26} weight="bold" className="hidden sm:block" />
          </>
        ) : (
          <>
            <ChatCircle size={22} weight="fill" className="sm:hidden" />
            <ChatCircle size={28} weight="fill" className="hidden sm:block" />
          </>
        )}
      </button>
    </div>
  );
};

export default Chatbot;