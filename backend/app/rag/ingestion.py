import hashlib
import logging
from typing import Any
from supabase import create_client, Client
from app.config import settings
from app.rag.embeddings import generate_embedding

logger = logging.getLogger(__name__)

def get_supabase_client() -> Client:
    """Initialize Supabase client using privileged service role key."""
    return create_client(settings.supabase_url, settings.supabase_service_role_key)

def compute_hash(text: str) -> str:
    """Compute SHA-256 hash of text for idempotent duplicate prevention."""
    return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()

# Comprehensive raw portfolio source documents
RAW_PORTFOLIO_DOCUMENTS = [
    {
        "title": "Sarweshwar Buddolla - Professional Overview & Bio",
        "source": "portfolio",
        "document_type": "bio",
        "metadata": {
            "section": "about",
            "category": "biography",
            "topics": ["introduction", "bio", "strengths", "hobbies", "contact"]
        },
        "content": (
            "Name: Sarweshwar Buddolla (often known as Sarweshwar).\n"
            "Role: Aspiring AI Engineer, GenAI Learner, and Agentic AI Enthusiast based in Hyderabad, Telangana, India.\n"
            "Summary: A passionate developer focused on building scalable, intelligent systems, RAG architectures, and agentic workflows. "
            "Passionate about bridging theoretical AI and real-world production utility through clean, logical code.\n"
            "Strengths: Relentless focus once committed. Maintains deep uninterrupted work sessions, refines systems meticulously, and solves complex architectural issues.\n"
            "Active Development / Work in Progress: Continuously improving starting momentum and task-initiation speed.\n"
            "Hobbies: Creative sketching and drawing; playing online games to recharge.\n"
            "Contact: Email: b.sarweshwar445@gmail.com | Phone: +91 7661831324 | Location: Hyderabad, India.\n"
            "Profiles: GitHub: https://github.com/sarweshwargoud | LinkedIn: https://www.linkedin.com/in/sarweshwar-buddolla-25673b312/ | "
            "LeetCode: https://leetcode.com/u/sarweshwar_goud/ | HackerRank: https://www.hackerrank.com/profile/b_sarweshwar445"
        )
    },
    {
        "title": "Academic Education & Qualifications",
        "source": "portfolio",
        "document_type": "education",
        "metadata": {
            "section": "education",
            "category": "academics",
            "topics": ["degrees", "college", "schooling"]
        },
        "content": (
            "Education Details:\n"
            "1. Bachelor of Technology - B.Tech in Computer Science & Engineering (AI & ML)\n"
            "   Institution: Malla Reddy College of Engineering & Technology (MRCET), Hyderabad\n"
            "   Period: August 2024 - May 2027\n"
            "   Specialization: Artificial Intelligence and Machine Learning, deep learning, algorithms, and intelligent systems.\n\n"
            "2. Diploma of Education (Mechanical Engineering)\n"
            "   Institution: Government Polytechnic Masab Tank, Hyderabad\n"
            "   Period: August 2021 - April 2024\n"
            "   Focus: Core engineering principles, mechanical engineering, analytical problem solving.\n\n"
            "3. High School / Secondary School Certificate (SSC)\n"
            "   Institution: Noble High School\n"
            "   Period: June 2013 - April 2021\n"
            "   Focus: Mathematics and physical sciences."
        )
    },
    {
        "title": "Professional Experience & Internships",
        "source": "portfolio",
        "document_type": "experience",
        "metadata": {
            "section": "experience",
            "category": "work_history",
            "topics": ["internships", "flyrank", "sure trust", "uptoskills", "1m1b", "thesmartbridge", "elevate labs"]
        },
        "content": (
            "Work Experience and Internships:\n"
            "1. Backend AI Engineering Intern at FlyRank.ai (FlyRank Corp.) (July 2026 - September 2026, ~2.5 months):\n"
            "   Completed Backend AI Engineering internship program at FlyRank.ai.\n"
            "   Demonstrated technical competency in backend AI architecture, AI engineering pipelines, and collaborative engineering contribution.\n"
            "   Certificate of Completion ID: FR-D11-C6946-B9F28, Issued: September 9, 2026 by Alen Malkoc, Founder & CEO, FlyRank Corp.\n"
            "   Technologies: Backend AI, AI Engineering, Python, FastAPI, LLMs.\n\n"
            "2. Gen AI Intern at SURE TRUST (February 2026 - Present, 6 months):\n"
            "   Researched and implemented LLMs, vector similarity search, RAG architectures, and agentic workflows. "
            "   Built Family Health Concierge AI: a document-aware agentic healthcare assistant.\n"
            "   Technologies: Generative AI, LLMs, RAG, Agentic Workflows.\n\n"
            "3. AI/ML Intern at UPTOSKILLS (December 2025 - March 2026, 3 months):\n"
            "   Built CodeSkills: a LeetCode-style platform for applied AI and coding practice using FastAPI backend and React.js frontend. "
            "   Engineered an LLM-powered question generation pipeline, fine-tuning language models to auto-generate domain-specific coding practice problems at scale.\n"
            "   Technologies: Generative AI, Fine-Tuning, FastAPI, React.js.\n\n"
            "4. AI for Sustainability Virtual Intern at 1M1B (1 Million for 1 Billion) (December 2025 - January 2026, 2 months):\n"
            "   Applied AI and ML workflows to impactful tech solutions focused on sustainability metrics.\n"
            "   Technologies: AI/ML, Data Analytics, Sustainability.\n\n"
            "5. Google Cloud Generative AI Virtual Intern at TheSmartBridge (November 2025 - January 2026, 3 months):\n"
            "   Mastered Gemini, NotebookLM, Vertex AI, Prompt Engineering, RAG architectures, and Responsible AI guidelines on Google Cloud Platform.\n"
            "   Technologies: Google Cloud, Gemini, Vertex AI, RAG.\n\n"
            "6. Web Developer at Elevate Labs (November 2025 - December 2025, 2 months):\n"
            "   Collaborated on modern web development projects, ensuring responsive UI and smooth transitions.\n"
            "   Technologies: React, HTML5, JavaScript, CSS3."
        )
    },
    {
        "title": "Featured AI Projects - Wayzen AI, Carbon Footprint Agent, SkillWeave AI",
        "source": "portfolio",
        "document_type": "projects",
        "metadata": {
            "section": "projects",
            "category": "ai_agents_and_rag",
            "topics": ["wayzen ai", "carbon footprint agent", "skillweave ai"]
        },
        "content": (
            "Key AI Projects (Part 1):\n"
            "1. Wayzen AI:\n"
            "   Description: An agentic career intelligence platform leveraging RAG, FAISS vector storage, and LLaMA-3 to analyze salary trends, "
            "   automation risk assessments, and future career path projections.\n"
            "   Tech Stack: Agentic AI, LLaMA-3, FAISS, Python, React.\n"
            "   Live Demo: https://wayzen-ai.vercel.app/ | GitHub: https://github.com/sarweshwargoud/Wayzen-AI.git\n\n"
            "2. Carbon Footprint Agent:\n"
            "   Description: An offline-first Agentic AI system leveraging RAG to analyze lifestyle habits and provide personalized carbon reduction strategies.\n"
            "   Tech Stack: Agentic AI, RAG, Sustainability, Streamlit, Python.\n"
            "   Live Demo: https://sarweshwargoud-carbon-footprint-agent-appapp-jlyr6u.streamlit.app/ | GitHub: https://github.com/sarweshwargoud/Carbon-footprint-agent.git\n\n"
            "3. SkillWeave AI:\n"
            "   Description: An AI-powered learning curriculum platform that generates personalized learning syllabi and dynamically ranked YouTube playlist rankings using Gemini API.\n"
            "   Tech Stack: AI, Education, React, Gemini API.\n"
            "   Live Demo: https://skill-weave-ai.vercel.app/ | GitHub: https://github.com/sarweshwargoud/SkillWeave-AI"
        )
    },
    {
        "title": "Featured Projects - Healthcare Chatbot, LLM-Safety-Evaluator, Product Recommender, Interview Guru",
        "source": "portfolio",
        "document_type": "projects",
        "metadata": {
            "section": "projects",
            "category": "llm_and_ml_systems",
            "topics": ["healthcare chatbot", "llm safety evaluator", "product recommender", "interview guru", "family health concierge"]
        },
        "content": (
            "Key AI Projects (Part 2):\n"
            "4. LLM-Safety-Evaluator:\n"
            "   Description: A security-focused evaluation platform for detecting prompt injection and jailbreaking attacks targeting Large Language Models using custom trained models.\n"
            "   Tech Stack: LLM, ML, Model Training, Python.\n"
            "   Live Demo: https://llm-safety-evaluator.vercel.app/ | GitHub: https://github.com/sarweshwargoud/llmSafetyEvaluator\n\n"
            "5. Healthcare Chatbot:\n"
            "   Description: A safety-first generative AI conversational agent utilizing Gemini API with context-aware NLP for empathetic, supportive mental health conversations.\n"
            "   Tech Stack: Generative AI, Gemini API, NLP, Python.\n"
            "   GitHub: https://github.com/sarweshwargoud/Mental-health-care-chatbot\n\n"
            "6. Product Recommendation System:\n"
            "   Description: A hybrid recommendation engine combining collaborative filtering and content-based filtering algorithms for personalized product discovery.\n"
            "   Tech Stack: Machine Learning, Recommender Systems, Python, Scikit-Learn.\n"
            "   GitHub: https://github.com/sarweshwargoud/Product-Recommendation-system\n\n"
            "7. Interview Guru & Family Health Concierge AI:\n"
            "   Description: Interview Guru is an interactive AI mock interview platform; Family Health Concierge AI is a multi-agent RAG system built to parse and reason over family health records."
        )
    },
    {
        "title": "Technical Skills & Competencies",
        "source": "portfolio",
        "document_type": "skills",
        "metadata": {
            "section": "skills",
            "category": "technical_stack",
            "topics": ["languages", "ai", "machine learning", "frontend", "tools"]
        },
        "content": (
            "Technical Skills Breakdown:\n"
            "• Programming Languages: Python, Java, C++, C, SQL, TypeScript, JavaScript.\n"
            "• AI & Machine Learning: Agentic AI, Retrieval-Augmented Generation (RAG), LLMs (Gemini, LLaMA-3), Model Fine-Tuning, "
            "  Vector Databases (Supabase pgvector, FAISS), Computer Vision (YOLO), Natural Language Processing (NLP), Data Analytics, Pandas, Scikit-Learn.\n"
            "• Frontend & Web Frameworks: React.js, TypeScript, Next.js, Tailwind CSS, GSAP (GreenSock Animation Platform), HTML5, CSS3, FastAPI.\n"
            "• Developer Tools & Cloud: Git, GitHub, VS Code, Jupyter Notebooks, Linux, Docker, Postman, Google Cloud Platform (Vertex AI)."
        )
    },
    {
        "title": "Certifications & Industry Credentials",
        "source": "portfolio",
        "document_type": "certifications",
        "metadata": {
            "section": "certifications",
            "category": "credentials",
            "topics": ["oracle", "agentic ai", "flyrank", "aws", "udemy", "uptoskills", "coursera", "microsoft", "hack2skill", "freecodecamp"]
        },
        "content": (
            "Verified Industry Certifications:\n"
            "1. Agentic AI Certified Foundations Associate (Oracle University, 2026)\n"
            "   Covers first-principles AI agents, LangChain, OpenAI Agents SDK, Model Context Protocol (MCP) servers, OCI Enterprise AI Agents service, and Oracle AI Database agentic features.\n"
            "   Credential Link: https://catalog-education.oracle.com/ords/certview/sharebadge?id=C7FB8D23CC99AB62AD50154B42011DB744068E632E4FE7662C0A5189D9B98FED\n\n"
            "2. Certificate of Completion - Backend AI Engineering (FlyRank.ai / FlyRank Corp., September 2026)\n"
            "   Demonstrated excellence in technical competency, professional conduct, and collaborative contribution in Backend AI Engineering.\n"
            "   Credential ID: FR-D11-C6946-B9F28. Issued by Alen Malkoc, Founder & CEO, FlyRank Corp.\n\n"
            "3. Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate (Oracle University, February 2026)\n"
            "   Certificate of Recognition awarded by Oracle Corporation. Covers foundational AI, ML concepts, and OCI AI infrastructure. Credential ID: 103395933OCI25AICFA.\n\n"
            "4. AWS Cloud Practitioner Essentials (AWS Training & Certification, March 2026)\n"
            "   Completed comprehensive cloud fundamentals, AWS architecture, core cloud services, and security practices. Issued by Michelle Vaz, Director, AWS Training & Certification.\n\n"
            "5. Full Stack AI Engineer 2026 - Generative AI & LLMs III (Udemy • School of AI, March 2026)\n"
            "   In-depth engineering curriculum on Generative AI, Large Language Models (LLMs), prompt engineering, and intelligent application deployment. Certificate ID: UC-dc863384-9a13-44a9-85d5-944c925dd3fd.\n\n"
            "6. AI/ML Intern Certificate of Appreciation (UptoSkills, March 2026)\n"
            "   Honored for dedicated contributions and engineering excellence as AI/ML Intern from December 2025 to March 2026 at UptoSkills Company.\n\n"
            "7. Retrieval-Augmented Generation (RAG) (Coursera, 2025)\n"
            "   Comprehensive coursework on vector databases, semantic search, dense embeddings, chunking strategies, and RAG architectures.\n\n"
            "8. Career Essentials in Generative AI (Microsoft & LinkedIn, 2024)\n"
            "   Covers enterprise generative AI, ethical and responsible AI practices, prompt engineering, and LLM applications.\n\n"
            "9. Building Agentic Workflows in Python (Hack2skill, 2025)\n"
            "   Covers multi-agent orchestration, tool use, autonomous planning, and python agentic design patterns.\n\n"
            "10. Responsive Web Design (freeCodeCamp, 2023)\n"
            "   Covers modern responsive layouts, CSS Flexbox, CSS Grid, and web accessibility."
        )
    },
    {
        "title": "Coding Profiles & Problem Solving Track Record",
        "source": "portfolio",
        "document_type": "coding_profiles",
        "metadata": {
            "section": "coding_profiles",
            "category": "competitive_programming",
            "topics": ["leetcode", "hackerrank", "github"]
        },
        "content": (
            "Competitive Programming and Open Source Stats:\n"
            "• LeetCode: https://leetcode.com/u/sarweshwar_goud/\n"
            "  Total Solved: 84 problems across all difficulty tiers (39 Easy, 33 Medium, 12 Hard).\n\n"
            "• HackerRank: https://www.hackerrank.com/profile/b_sarweshwar445\n"
            "  Badges: 🥇 Gold in Problem Solving, 🥇 Gold in Python, 🥈 Silver in SQL (3 total badges).\n\n"
            "• GitHub: https://github.com/sarweshwargoud\n"
            "  Stats: 39 public repositories, active since 2023. Top starred repo: AI-Roadmap-Zero2Hero with 29 stars."
        )
    }
]

def chunk_text(text: str, chunk_size: int = 600, overlap: int = 100) -> list[str]:
    """
    Split text into logical, readable chunks with overlap.
    Prefers splitting on paragraph breaks or line breaks.
    """
    cleaned = text.strip()
    paragraphs = [p.strip() for p in cleaned.split("\n\n") if p.strip()]

    chunks = []
    current_chunk = ""

    for p in paragraphs:
        if len(current_chunk) + len(p) + 2 <= chunk_size:
            current_chunk = f"{current_chunk}\n\n{p}" if current_chunk else p
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            # If a single paragraph is longer than chunk_size, split by lines
            if len(p) > chunk_size:
                lines = p.split("\n")
                sub_chunk = ""
                for line in lines:
                    if len(sub_chunk) + len(line) + 1 <= chunk_size:
                        sub_chunk = f"{sub_chunk}\n{line}" if sub_chunk else line
                    else:
                        if sub_chunk:
                            chunks.append(sub_chunk.strip())
                        sub_chunk = line
                if sub_chunk:
                    current_chunk = sub_chunk
                else:
                    current_chunk = ""
            else:
                current_chunk = p

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks if chunks else [cleaned]

def ingest_portfolio_knowledge() -> dict[str, Any]:
    """
    Main ingestion pipeline:
    1. Reads raw portfolio documents.
    2. Computes hashes for duplicate prevention.
    3. Generates 768-dimensional embeddings.
    4. Upserts documents and document_chunks into Supabase PostgreSQL + pgvector.
    Returns a summary report of ingested items.
    """
    supabase = get_supabase_client()
    total_docs = 0
    total_chunks = 0
    skipped_docs = 0

    logger.info("Starting portfolio knowledge ingestion into Supabase...")

    for raw_doc in RAW_PORTFOLIO_DOCUMENTS:
        title = raw_doc["title"]
        source = raw_doc["source"]
        doc_type = raw_doc["document_type"]
        metadata = raw_doc["metadata"]
        content = raw_doc["content"]

        content_hash = compute_hash(content)

        # Check if document already exists with identical content_hash
        existing_doc_res = (
            supabase.table("documents")
            .select("id, content_hash")
            .eq("content_hash", content_hash)
            .execute()
        )

        if existing_doc_res.data:
            doc_id = existing_doc_res.data[0]["id"]
            # Check if chunks are already present
            existing_chunks = (
                supabase.table("document_chunks")
                .select("id")
                .eq("document_id", doc_id)
                .execute()
            )
            if existing_chunks.data:
                logger.info(f"Document '{title}' already exists with {len(existing_chunks.data)} chunks. Skipping duplicate.")
                skipped_docs += 1
                total_docs += 1
                total_chunks += len(existing_chunks.data)
                continue

        # Insert or retrieve document record
        doc_record = {
            "title": title,
            "source": source,
            "document_type": doc_type,
            "content_hash": content_hash,
            "metadata": metadata
        }

        inserted_doc = (
            supabase.table("documents")
            .upsert(doc_record, on_conflict="content_hash")
            .execute()
        )

        doc_id = inserted_doc.data[0]["id"]
        total_docs += 1

        # Chunk content
        chunks = chunk_text(content)

        for idx, chunk_content in enumerate(chunks):
            chunk_hash = compute_hash(f"{doc_id}:{idx}:{chunk_content}")

            # Generate 768-dim embedding
            embedding = generate_embedding(chunk_content)

            chunk_metadata = {
                **metadata,
                "document_title": title,
                "chunk_index": idx,
                "total_chunks": len(chunks)
            }

            chunk_record = {
                "document_id": doc_id,
                "content": chunk_content,
                "chunk_index": idx,
                "chunk_hash": chunk_hash,
                "metadata": chunk_metadata,
                "embedding": embedding
            }

            supabase.table("document_chunks").upsert(
                chunk_record,
                on_conflict="chunk_hash"
            ).execute()

            total_chunks += 1
            logger.info(f"Ingested chunk {idx + 1}/{len(chunks)} for '{title}'")

    summary = {
        "status": "success",
        "total_documents": total_docs,
        "total_chunks": total_chunks,
        "skipped_unmodified": skipped_docs
    }
    logger.info(f"Ingestion complete: {summary}")
    return summary
