import React, { useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import "./AIAssistant.css";

import {


  ChevronRight,

  ExternalLink,

  Mic,

  Pause,

  Play,

  Send,

  Sparkles,

  Volume2,

  VolumeX,

  X,

} from "lucide-react";

import { portfolioKnowledge } from "../data/portfolioKnowledge";
import { BotAvatar } from "bot-avatars";

const QUICK_PROMPTS = [

  // About Deepshik
  "Who is Deepshik?",
  "What does Deepshik do?",
  "What is Deepshik's role?",
  "What does his portfolio focus on?",

  // Education
  "What is Deepshik's education?",
  "Where did Deepshik study?",
  "What degree does he have?",
  "What did he study?",

  // Skills
  "What are Deepshik's skills?",
  "What is his tech stack?",
  "What are his data engineering skills?",
  "What programming languages does he know?",
  "What tools and technologies does he use?",

  // Experience
  "What is Deepshik's work experience?",
  "Where did he intern?",
  "What did he do at EvoAstra?",
  "Tell me about his Captionize internship project.",

  // Projects
  "What projects has Deepshik built?",
  "Tell me about the IoT project.",
  "What datasets were used in the IoT project?",
  "What methods were used in the IoT project?",
  "How was the IoT project deployed?",
  "Tell me about the CAC Data Engineering Platform.",
  "What is the CAC project pipeline?",
  "What technologies does the CAC project use?",
  "Tell me about Captionize.",
  "What technologies does Captionize use?",
  "Tell me about NAV-Aisle Superstore.",
  "What does NAV-Aisle do?",

  // Research
  "Tell me about Deepshik's research paper.",
  "What is the IoT research about?",
  "What are SHAP, FGSM and PGD used for?",
  "Where was the research presented?",

  // Certifications
  "What certifications does Deepshik have?",
  "What Snowflake workshops has he completed?",
  "Does he have an AI certification?",

  // Achievements
  "What are Deepshik's achievements?",
  "What awards has he won?",
  "Tell me about his filmmaking achievements.",

  // Portfolio overview
  "What are Deepshik's main focus areas?",
  "What kinds of projects has he worked on?",
  "What are his core technologies?",

];

function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text = "") {
  return normalize(text)
    .split(" ")
    .filter(Boolean);
}

function scoreMatch(question, candidates = []) {
  const q = normalize(question);
  const qTokens = new Set(tokenize(question));
  let score = 0;

  for (const candidate of candidates) {
    const normalizedCandidate = normalize(candidate);
    if (!normalizedCandidate) continue;

    if (q.includes(normalizedCandidate)) {
      score += normalizedCandidate.split(" ").length * 8;
    }

    for (const token of tokenize(normalizedCandidate)) {
      if (qTokens.has(token)) {
        score += token.length >= 4 ? 2 : 1;
      }
    }
  }

  return score;
}

function getProjectSearchText(project) {
  return [
    project?.id,
    project?.name,
    project?.fullTitle,
    project?.tag,
    project?.type,
    project?.description,
    project?.purpose,
    ...(project?.technologies || []),
    ...(project?.datasets || []),
    ...(project?.methods || []),
    ...(project?.capabilities || []),
    ...(project?.pipeline || []),
    ...(project?.keywords || []),
  ]
    .filter(Boolean)
    .join(" ");
}

function findBestProject(question) {
  const projects = portfolioKnowledge.projects || [];
  if (!projects.length) return null;

  const q = normalize(question);

  // Require a project-specific identifier. The generic word "project" is
  // intentionally not enough because many non-project questions contain it.
  const specificAnchors = [
    "captionize",
    "nav-aisle", "nav aisle", "superstore",
    "iot", "iot ids", "beyond accuracy", "ton-iot", "bot-iot",
    "cac", "customer acquisition cost", "data engineering platform",
    "image caption", "intrusion detection", "retail navigation",
    "indoor navigation"
  ];

  if (!specificAnchors.some((anchor) => q.includes(normalize(anchor)))) {
    return null;
  }

  const scored = projects
    .map((project) => ({
      project,
      score: scoreMatch(question, [
        project.id,
        project.name,
        project.fullTitle,
        project.tag,
        project.type,
        ...(project.keywords || []),
      ]),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score >= 3 ? scored[0].project : null;
}

function detectIntent(question) {
  const q = normalize(question);

  // Specific intents are deliberately checked before broad intents.
  // This prevents words such as "project", "technology", "work", or
  // "research" from accidentally routing a project question to identity.
  const intents = {
    education: [
      "education", "degree", "college", "university", "studied", "study",
      "btech", "b tech", "computer science", "data science", "graduation",
      "academic background", "where did he study", "where did deepshik study",
      "what did he study", "which college", "which university"
    ],
    certifications: [
      "certification", "certifications", "certificate", "certificates",
      "snowflake badge", "snowflake certification", "workshop", "workshops"
    ],
    achievements: [
      "achievement", "achievements", "award", "awards", "won", "filmmaker",
      "short film", "techknowthon", "cinematica"
    ],
    experience: [
      "experience", "work experience", "professional experience", "internship",
      "intern", "worked at", "work history", "company", "companies", "evoastra",
      "responsibilities", "where did he work", "where has he worked"
    ],
    research: [
      "research paper", "research", "publication", "published", "iot research", "where was the research presented",
      "intrusion detection", "concept drift", "adversarial attacks", "shap",
      "fgsm", "pgd"
    ],
    projects: [
      "projects", "project", "portfolio projects", "what has he built",
      "what did he build", "his work", "show me his work", "what projects has he done"
    ],
    skills: [
      "skills", "technical skills", "tech stack", "programming languages",
      "tools", "what can he work with", "what technologies does he know",
      "what are his skills", "data engineering skills"
    ],
    portfolio: [
      "main focus areas", "focus areas", "focus on", "portfolio focus",
      "kinds of projects", "types of projects", "project areas",
      "core technologies", "core technology", "portfolio overview",
      "what does the portfolio focus on", "what is the portfolio about"
    ],
    contact: [
      "contact", "email", "reach", "reach him", "get in touch", "social media",
      "linkedin", "github"
    ],
    identity: [
      "who is deepshik", "who is deepshik kodam", "who is he",
      "tell me about deepshik", "tell me about him", "about deepshik",
      "about him", "what does deepshik do", "what does he do", "what is his role",
      "what kind of engineer", "what is deepshik s role", "person behind this portfolio"
    ]
  };

  let bestIntent = "unknown";
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(intents)) {
    let score = 0;

    for (const keyword of keywords) {
      const k = normalize(keyword);
      if (!k) continue;

      // Exact phrase matches are much stronger than individual word overlap.
      if (q === k) score += 100;
      else if (q.includes(k)) score += k.split(" ").length * 12;
    }

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  return bestIntent;
}

function getLocalAnswer(question) {
  const q = normalize(question);

  const {
    identity,
    about,
    education,
    skills,
    skillsByCategory,
    experience,
    projects,
    certifications,
    achievements,
    research,
    portfolio,
  } = portfolioKnowledge;

  const intent = detectIntent(question);

  // Explicit research wording should never be swallowed by the broad
  // identity intent (for example, "Tell me about Deepshik's research paper").
  const asksAboutResearch = [
    "research paper", "research publication", "iot research",
    "tell me about deepshik s research", "research presented",
    "where was the research presented"
  ].some((phrase) => q.includes(phrase));

  if (asksAboutResearch && !["projects", "skills", "certifications", "achievements", "experience"].includes(intent)) {
    const datasets = research?.datasets?.join(" and ") || "the listed datasets";
    const methods = research?.methods?.join(", ") || "the listed methods";

    return {
      text: `${research.title}. The research uses the ${datasets} datasets and includes ${methods}. ${research.publication} ${research.deployment}`,
      source: "Research",
      section: "work",
      link: projects.find((project) => project.id === "iot-ids")?.url || null,
    };
  }

  // DIRECT PORTFOLIO-OVERVIEW QUESTIONS
  if (intent === "portfolio") {
    const qFocus = ["focus", "focus areas", "main focus", "portfolio focus"].some((x) => q.includes(x));
    const qProjectAreas = ["kinds of projects", "types of projects", "project areas", "what projects", "areas has he worked"].some((x) => q.includes(x));
    const qCoreTech = ["core technologies", "core technology"].some((x) => q.includes(x));

    if (qFocus) {
      return {
        text: `${identity.name}'s main focus areas are: ${portfolio.focusAreas.join(", ")}.`,
        source: "Portfolio Overview",
        section: "about",
      };
    }

    if (qCoreTech) {
      return {
        text: `${identity.name}'s core technologies are: ${portfolio.coreTechnologies.join(", ")}.`,
        source: "Portfolio Overview",
        section: "skills",
      };
    }

    if (qProjectAreas) {
      return {
        text: `${identity.name} has worked across: ${portfolio.projectAreas.join(", ")}.`,
        source: "Portfolio Overview",
        section: "work",
      };
    }
  }

  // DIRECT RESEARCH-QUESTION HANDLERS
  if (intent === "research") {
    const asksMethods = ["shap", "fgsm", "pgd"].some((x) => q.includes(x)) &&
      ["used for", "use", "what are", "what is", "purpose", "why"].some((x) => q.includes(x));
    const asksPresentation = ["where was", "presented", "presentation", "conference", "ict4sd"].some((x) => q.includes(x));

    if (asksMethods) {
      return {
        text: `The research uses MLP, SHAP, FGSM, PGD, and concept drift. SHAP is used for explainability, while FGSM and PGD are used for adversarial attack evaluation; MLP is the machine-learning model, and concept drift addresses changes in data behavior over time.`,
        source: "Research",
        section: "work",
        link: projects.find((project) => project.id === "iot-ids")?.url || null,
      };
    }

    if (asksPresentation) {
      return {
        text: `The research was presented at ICT4SD 2026 (Goa). It was also accepted for Springer Nature conference proceedings.`,
        source: "Research",
        section: "work",
        link: projects.find((project) => project.id === "iot-ids")?.url || null,
      };
    }
  }

  // PROJECT-SPECIFIC QUESTIONS MUST WIN over generic intents.
  // Example: "What technologies does Captionize use?" should resolve to
  // Captionize, not to the generic skills/about response.
  const project = ["skills", "certifications", "achievements", "experience"].includes(intent) ? null : findBestProject(question);

  if (project) {
    const qHasTech = [
      "technology", "technologies", "tech", "stack", "tools", "built with", "used", "use"
    ].some((word) => q.includes(word));

    const qHasDataset = [
      "dataset", "datasets", "data used", "trained on", "training data"
    ].some((word) => q.includes(word));

    const qHasPurpose = [
      "why", "purpose", "what is it", "what does it do", "what is the project", "explain", "about"
    ].some((word) => q.includes(word));

    const qHasPipeline = [
      "pipeline", "flow", "architecture", "process", "raw", "staging", "analytics"
    ].some((word) => q.includes(word));

    const qHasMethods = [
      "method", "methods", "approach", "technique", "techniques", "model"
    ].some((word) => q.includes(word));

    const qHasCapabilities = [
      "capability", "capabilities", "feature", "features", "can it", "does it"
    ].some((word) => q.includes(word));

    const qHasDeployment = [
      "deployment", "deployed", "deploy", "api", "swagger", "live"
    ].some((word) => q.includes(word));

    const qHasPublication = [
      "publication", "published", "presented", "paper", "springer", "ict4sd"
    ].some((word) => q.includes(word));

    const qHasLink = [
      "github", "repo", "repository", "link", "source code", "see the project"
    ].some((word) => q.includes(word));

    let text = "";

    if (qHasDataset && project.datasets?.length) {
      text = `${project.name} used the following datasets: ${project.datasets.join(", ")}.`;
    } else if (qHasMethods && project.methods?.length) {
      text = `${project.name} uses these methods: ${project.methods.join(", ")}.`;
    } else if (qHasTech && project.technologies?.length) {
      text = `${project.name} uses: ${project.technologies.join(", ")}.`;
    } else if (qHasPipeline && project.pipeline?.length) {
      text = `${project.name}'s pipeline is: ${project.pipeline.join(" → ")}.`;
    } else if (qHasDeployment && project.deployment) {
      text = `${project.name}: ${project.deployment}`;
    } else if (qHasPublication && project.id === "iot-ids") {
      text = `${project.name}: ${project.publication}`;
    } else if (qHasCapabilities && project.capabilities?.length) {
      text = `${project.name} includes:

${project.capabilities.map((item) => `• ${item}`).join("\n")}`;
    } else if (qHasLink && project.url && project.url !== "#") {
      text = `${project.name}: ${project.url}`;
    } else if (qHasPurpose && project.purpose) {
      text = `${project.name}: ${project.purpose}`;
    } else {
      text = `${project.name}: ${project.description}`;
    }

    return {
      text,
      source: project.name,
      link: project.url,
      section: project.section,
    };
  }

  // IDENTITY / ABOUT
  if (intent === "identity") {
    return {
      text:
        `${identity.name} is a ${identity.role} based in ${identity.location}. ` +
        `${identity.tagline} ` +
        `${about.focus}`,
      source: "About",
      section: "about",
    };
  }

  // EDUCATION
  if (intent === "education") {
    return {
      text:
        `${identity.name} completed a ${education.degree} in ` +
        `${education.field} at ${education.institution} ` +
        `(${education.period}).`,
      source: "Education",
      section: "education",
    };
  }

  // SKILLS
  if (intent === "skills") {
    const programming =
      skillsByCategory?.programming?.length
        ? skillsByCategory.programming.join(", ")
        : "";

    const dataEngineering =
      skillsByCategory?.dataEngineering?.length
        ? skillsByCategory.dataEngineering.join(", ")
        : "";

    const development =
      skillsByCategory?.development?.length
        ? skillsByCategory.development.join(", ")
        : "";

    const analytics =
      skillsByCategory?.analytics?.length
        ? skillsByCategory.analytics.join(", ")
        : "";

    const parts = [];

    if (programming) {
      parts.push(`Programming: ${programming}`);
    }

    if (dataEngineering) {
      parts.push(`Data & data engineering: ${dataEngineering}`);
    }

    if (analytics) {
      parts.push(`Analytics: ${analytics}`);
    }

    if (development) {
      parts.push(`Development: ${development}`);
    }

    if (!parts.length) {
      parts.push(`His skills include ${skills.join(", ")}.`);
    }

    return {
      text: `${identity.name}'s technical toolkit includes:\n\n${parts.join(
        "\n"
      )}`,
      source: "Tools & Skills",
      section: "skills",
    };
  }

  // EXPERIENCE
  if (intent === "experience") {
    if (!experience?.length) {
      return {
        text:
          "I don't currently have detailed professional experience information in Deepshik's portfolio knowledge base.",
        source: "Experience",
      };
    }

    const job = experience[0];

    return {
      text:
        `${job.role} at ${job.company} (${job.period}). ` +
        `${job.description}`,
      source: "Experience",
      section: "experience",
    };
  }

  // CERTIFICATIONS
  if (intent === "certifications") {
    if (!certifications?.length) {
      return {
        text:
          "I don't currently have certification information in Deepshik's portfolio knowledge base.",
        source: "Certifications",
      };
    }

    const certificationText = certifications
      .map((cert, index) => {
        if (typeof cert === "string") {
          return `${index + 1}. ${cert}`;
        }

        return `${index + 1}. ${cert.name}${
          cert.provider ? ` — ${cert.provider}` : ""
        }${cert.date ? ` (${cert.date})` : ""}`;
      })
      .join("\n");

    return {
      text:
        `${identity.name}'s portfolio lists ${certifications.length} ` +
        `certifications/workshops:\n\n${certificationText}`,
      source: "Certifications",
      section: "certifications",
    };
  }

  // ACHIEVEMENTS
  if (intent === "achievements") {
    if (!achievements?.length) {
      return {
        text:
          "I don't currently have achievement information in Deepshik's portfolio knowledge base.",
        source: "Achievements",
      };
    }

    const achievementText = achievements
      .map((achievement, index) => {
        if (typeof achievement === "string") {
          return `${index + 1}. ${achievement}`;
        }

        return `${index + 1}. ${
          achievement.description || achievement.title
        }`;
      })
      .join("\n");

    return {
      text:
        `${identity.name}'s listed achievements include:\n\n${achievementText}`,
      source: "Achievements",
      section: "achievements",
    };
  }

  // RESEARCH
  if (intent === "research") {
    const datasets =
      research?.datasets?.join(" and ") || "the listed datasets";

    const methods =
      research?.methods?.join(", ") || "the listed methods";

    return {
      text:
        `${research.title}. ` +
        `The research uses the ${datasets} datasets and includes ` +
        `${methods}. ` +
        `${research.publication} ` +
        `${research.deployment}`,
      source: "Research",
      section: "work",
      link:
        projects.find((project) => project.id === "iot-ids")?.url || null,
    };
  }


  // GENERAL PROJECT LIST
  if (intent === "projects") {
    return {
      text:
        `Deepshik currently has ${projects.length} featured projects:\n\n` +
        projects
          .map((project, index) => `${index + 1}. ${project.name}`)
          .join("\n") +
        `\n\nAsk me about any specific project and I can explain it.`,
      source: "Selected Work",
      section: "work",
    };
  }

  // CONTACT
  if (intent === "contact") {
    return {
      text:
        "You can use the portfolio's Get in touch/contact area or the social links in the footer to reach Deepshik.",
      source: "Contact",
    };
  }

  // UNKNOWN / FALLBACK
  return {
    text:
      "I can help you explore Deepshik's portfolio, including his " +
      "about information, education, skills, experience, projects, " +
      "research, certifications, achievements, and creative work. " +
      "Ask me something specific about him or his work.",
    source: "Portfolio",
  };
}

export default function AIAssistant() {

  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");

  const [showTemplates, setShowTemplates] = useState(true);

  const [messages, setMessages] = useState([

    {

      id: 1,

      role: "assistant",

      text: "Hi — I'm BLUE., Deepshik's personal assistant. Ask me about his work, skills, projects, research, or experience.",

      source: "Portfolio",

    },

  ]);

  const [typing, setTyping] = useState(false);

  const [isCrystalIce, setIsCrystalIce] = useState(false);

  const [isPageScrolling, setIsPageScrolling] = useState(false);

  const [isListening, setIsListening] = useState(false);

  const [voiceSupported, setVoiceSupported] = useState(true);

  const [speakingId, setSpeakingId] = useState(null);

  const [speechPaused, setSpeechPaused] = useState(false);

  const [speechHintId, setSpeechHintId] = useState(null);

  const [isStoppingVoice, setIsStoppingVoice] = useState(false);

  const speechHintTimerRef = useRef(null);

  const inputRef = useRef(null);

  const recognitionRef = useRef(null);

  const voiceTranscriptRef = useRef("");

  const voiceLiveTranscriptRef = useRef("");

  const shouldSubmitVoiceRef = useRef(false);

  const submitRef = useRef(null);
  const scrollStopTimerRef = useRef(null);
  const responseTimerRef = useRef(null);
  const focusTimerRef = useRef(null);
  const speechRequestIdRef = useRef(0);
  const speechUtteranceRef = useRef(null);
  const voicesRef = useRef([]);
  const recognitionActiveRef = useRef(false);
  const pageScrollStateRef = useRef(false);

  // Detect main-page scrolling only for the launcher.
  // React state changes only when the scrolling state actually changes.
  useEffect(() => {
    if (open) {
      window.clearTimeout(scrollStopTimerRef.current);
      pageScrollStateRef.current = false;
      return undefined;
    }

    const handlePageScroll = () => {
      if (!pageScrollStateRef.current) {
        pageScrollStateRef.current = true;
        setIsPageScrolling(true);
      }

      window.clearTimeout(scrollStopTimerRef.current);
      scrollStopTimerRef.current = window.setTimeout(() => {
        pageScrollStateRef.current = false;
        setIsPageScrolling(false);
      }, 180);
    };

    window.addEventListener("scroll", handlePageScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handlePageScroll);
      window.clearTimeout(scrollStopTimerRef.current);
      pageScrollStateRef.current = false;
    };
  }, [open]);

  // Lock the portfolio page while B.L.U.E. is open.
  // The assistant's own .dk-ai-body remains independently scrollable.
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    if (!open) {
      return undefined;
    }

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscrollBehavior = html.style.overscrollBehavior;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscrollBehavior = body.style.overscrollBehavior;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyTouchAction = body.style.touchAction;

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.touchAction = "none";

    setIsPageScrolling(false);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscrollBehavior;

      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscrollBehavior;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.touchAction = previousBodyTouchAction;

      window.scrollTo(0, scrollY);
    };
  }, [open]);

    useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      recognitionActiveRef.current = true;
      setIsListening(true);
      setIsStoppingVoice(false);
      voiceTranscriptRef.current = "";
      voiceLiveTranscriptRef.current = "";
    };

    recognition.onresult = (event) => {
      let finalTranscript = voiceTranscriptRef.current;
      let interimTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;

        if (event.results[index].isFinal) {
          finalTranscript += `${transcript} `;
        } else {
          interimTranscript += transcript;
        }
      }

      voiceTranscriptRef.current = finalTranscript;
      voiceLiveTranscriptRef.current = `${finalTranscript}${interimTranscript}`.trim();
      setInput(voiceLiveTranscriptRef.current);
    };

    recognition.onerror = (event) => {
      recognitionActiveRef.current = false;
      setIsStoppingVoice(false);
      if (event.error !== "aborted") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      recognitionActiveRef.current = false;
      setIsListening(false);
      setIsStoppingVoice(false);

      const transcript =
        voiceTranscriptRef.current.trim() || voiceLiveTranscriptRef.current.trim();

      if (shouldSubmitVoiceRef.current) {
        shouldSubmitVoiceRef.current = false;

        if (transcript) {
          setInput("");
          submitRef.current?.(transcript);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldSubmitVoiceRef.current = false;
      recognitionActiveRef.current = false;
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      try {
        recognition.abort();
      } catch {
        // Ignore cleanup errors.
      }

      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return undefined;

    const updateVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  // The portfolio already exposes its authoritative theme on .portfolio-root[data-dark].
  // Observe only that attribute instead of watching the entire document.
  useEffect(() => {
    const portfolioRoot = document.querySelector(".portfolio-root");

    const detectTheme = () => {
      const darkValue = portfolioRoot?.getAttribute("data-dark");

      if (darkValue === "false") {
        setIsCrystalIce(true);
      } else if (darkValue === "true") {
        setIsCrystalIce(false);
      }
    };

    detectTheme();

    if (!portfolioRoot) return undefined;

    const observer = new MutationObserver(detectTheme);
    observer.observe(portfolioRoot, {
      attributes: true,
      attributeFilter: ["data-dark"],
    });

    return () => observer.disconnect();
  }, []);

  const messagesRef = useRef(null);

  useEffect(() => {
    window.clearTimeout(focusTimerRef.current);

    if (!open) return undefined;

    focusTimerRef.current = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 180);

    return () => window.clearTimeout(focusTimerRef.current);
  }, [open]);

  useEffect(() => {
    const node = messagesRef.current;
    if (!node) return undefined;

    const frame = window.requestAnimationFrame(() => {
      node.scrollTo({
        top: node.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, typing]);

  // B.L.U.E. owns the speech lifecycle. Whenever the assistant closes,
  // speech must be cancelled immediately so it can never continue in the
  // background after the UI has disappeared. The request-id increment also
  // invalidates any stale SpeechSynthesis callbacks.
  useEffect(() => {
    if (open) return undefined;

    speechRequestIdRef.current += 1;
    speechUtteranceRef.current = null;
    window.clearTimeout(speechHintTimerRef.current);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore browser speech-synthesis cleanup errors.
      }
    }

    setSpeakingId(null);
    setSpeechPaused(false);
    setSpeechHintId(null);

    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open && recognitionRef.current) {
      shouldSubmitVoiceRef.current = false;

      recognitionActiveRef.current = false;
      shouldSubmitVoiceRef.current = false;
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore cleanup errors.
      }

      setIsListening(false);
      setIsStoppingVoice(false);
    }
  }, [open]);

  const closeAssistant = () => {
    // Stop speech synchronously before hiding the assistant.
    speechRequestIdRef.current += 1;
    speechUtteranceRef.current = null;
    window.clearTimeout(speechHintTimerRef.current);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore browser speech-synthesis cleanup errors.
      }
    }

    setSpeakingId(null);
    setSpeechPaused(false);
    setSpeechHintId(null);
    setOpen(false);
  };

  const navigateTo = (section) => {
    if (!section) return;

    const target = document.getElementById(section);
    if (!target) return;

    // Release the page lock first, then scroll after the fixed-body cleanup
    // has restored the document's normal scroll context.
    closeAssistant();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  const submit = (preset) => {

    const question = (preset ?? input).trim();

    if (!question || typing) return;

    setShowTemplates(false);

    setInput("");

    const userMessage = {

      id: Date.now(),

      role: "user",

      text: question,

    };

    setMessages((current) => [...current, userMessage]);

    setTyping(true);

    window.clearTimeout(responseTimerRef.current);
    responseTimerRef.current = window.setTimeout(() => {

      const answer = getLocalAnswer(question);

      setMessages((current) => [

        ...current,

        {

          id: Date.now() + 1,

          role: "assistant",

          ...answer,

        },

      ]);

      setTyping(false);
    }, 450);

  };

  submitRef.current = submit;

  const startListening = () => {
    if (!voiceSupported || typing || isListening || recognitionActiveRef.current) return;

    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      voiceTranscriptRef.current = "";
      voiceLiveTranscriptRef.current = "";
      shouldSubmitVoiceRef.current = false;
      recognitionActiveRef.current = true;
      setIsStoppingVoice(false);
      setInput("");
      setShowTemplates(false);
      recognition.start();
    } catch {
      recognitionActiveRef.current = false;
    }
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition || isStoppingVoice || !recognitionActiveRef.current) return;

    setIsStoppingVoice(true);
    shouldSubmitVoiceRef.current = true;

    try {
      recognition.stop();
    } catch {
      recognitionActiveRef.current = false;
      setIsListening(false);
      setIsStoppingVoice(false);
    }
  };

  const toggleSpeech = (message) => {
    if (
      !message?.text ||
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    const synth = window.speechSynthesis;

    if (speakingId === message.id) {
      if (speechPaused || synth.paused) {
        try {
          synth.resume();
          setSpeechPaused(false);
        } catch {
          // Ignore browser speech-synthesis resume errors.
        }
        return;
      }

      try {
        synth.pause();
        setSpeechPaused(true);
      } catch {
        // Ignore browser speech-synthesis pause errors.
      }
      return;
    }

    const requestId = ++speechRequestIdRef.current;
    synth.cancel();
    speechUtteranceRef.current = null;
    window.clearTimeout(speechHintTimerRef.current);
    setSpeechPaused(false);
    setSpeechHintId(null);

    const voices = voicesRef.current;
    const preferredVoice =
      voices.find((voice) => {
        const name = voice.name.toLowerCase();
        return (
          /microsoft.*(aria|jenny|guy|davis)/i.test(name) ||
          /google us english/i.test(name) ||
          /samantha/i.test(name)
        ) && voice.lang.toLowerCase().startsWith("en-us");
      }) ||
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en-us")
      );

    const spokenText = message.text
      .replace(/\s+/g, " ")
      .replace(/\s+([,.!?;:])/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = "en-US";
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.15;
    utterance.pitch = 0.98;
    utterance.volume = 1;

    speechUtteranceRef.current = utterance;
    setSpeakingId(message.id);

    const isCurrentSpeech = () =>
      speechRequestIdRef.current === requestId &&
      speechUtteranceRef.current === utterance;

    utterance.onstart = () => {
      if (!isCurrentSpeech()) return;

      setSpeakingId(message.id);
      setSpeechPaused(false);
      setSpeechHintId(message.id);

      window.clearTimeout(speechHintTimerRef.current);
      speechHintTimerRef.current = window.setTimeout(() => {
        if (isCurrentSpeech()) setSpeechHintId(null);
      }, 2600);
    };

    utterance.onend = () => {
      if (!isCurrentSpeech()) return;

      speechUtteranceRef.current = null;
      setSpeakingId(null);
      setSpeechPaused(false);
      setSpeechHintId(null);
    };

    utterance.onerror = () => {
      if (!isCurrentSpeech()) return;

      speechUtteranceRef.current = null;
      setSpeakingId(null);
      setSpeechPaused(false);
      setSpeechHintId(null);
    };

    synth.speak(utterance);
  };
  useEffect(() => {
    return () => {
      responseTimerRef.current && window.clearTimeout(responseTimerRef.current);
      focusTimerRef.current && window.clearTimeout(focusTimerRef.current);
      scrollStopTimerRef.current && window.clearTimeout(scrollStopTimerRef.current);
      window.clearTimeout(speechHintTimerRef.current);
      speechRequestIdRef.current += 1;
      speechUtteranceRef.current = null;

      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      if (recognitionRef.current) {
        recognitionActiveRef.current = false;
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors.
        }
      }
    };
  }, []);

  const endConversation = () => {

    speechRequestIdRef.current += 1;
    speechUtteranceRef.current = null;
    window.clearTimeout(speechHintTimerRef.current);
    window.clearTimeout(responseTimerRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setSpeechPaused(false);
    setSpeechHintId(null);

    if (typing) return;

    setShowTemplates(true);

    setInput("");

    setMessages((current) => [

      ...current,

      {

        id: `end-${Date.now()}`,

        role: "system",

        type: "conversation-end",

        text: "Conversation ended",

      },

      {

        id: `new-${Date.now() + 1}`,

        role: "assistant",

        text: "Hi — I'm BLUE, Deepshik's portfolio assistant. Ask me about his work, skills, projects, research, or experience.",

        source: "Portfolio",

        newConversation: true,

      },

    ]);

    window.clearTimeout(focusTimerRef.current);
    focusTimerRef.current = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

  };

  const clearChat = () => {

    speechRequestIdRef.current += 1;
    speechUtteranceRef.current = null;
    window.clearTimeout(speechHintTimerRef.current);
    window.clearTimeout(responseTimerRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setSpeechPaused(false);
    setSpeechHintId(null);

    if (typing) return;

    setShowTemplates(true);

    setInput("");

    setMessages([

      {

        id: Date.now(),

        role: "assistant",

        text: "Hi — I'm BLUE, Deepshik's portfolio assistant. Ask me about his work, skills, projects, research, or experience.",

        source: "Portfolio",

      },

    ]);

    window.clearTimeout(focusTimerRef.current);
    focusTimerRef.current = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

  };

  const onKeyDown = (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

      event.preventDefault();

      submit();

    }

  };

  const assistantUI = (

    <div className="dk-ai-root">

      

      {!open && (

        <button

          type="button"

          className={`dk-ai-launcher ${

            isCrystalIce ? "dk-ai-crystal-mobile" : ""

          } ${

            isCrystalIce ? "dk-ai-specular-border-target" : ""

          } ${isPageScrolling ? "dk-ai-scroll-hidden" : ""}`}

          onClick={() => setOpen(true)}

          aria-label="Open B.L.U.E. portfolio assistant"

        >

          <span className="dk-ai-launcher-icon dk-ai-launcher-bot">

            <BotAvatar
              type="droid"
              face="eyes"
              state="default"
              size={32}
              color="#0ac9df"
              shading="fabric"
              theme={isCrystalIce ? "light" : "auto"}
              interactive={false}
              speed={0.8}
              seed={0.42}
            />

          </span>

          <span className="dk-ai-launcher-label">

            Ask to B.L.U.E

          </span>

        </button>

      )}

      {open && (

        <section

          className="dk-ai-panel"

          aria-label="B.L.U.E. portfolio assistant"

        >

          <header className="dk-ai-header">

            <div className="dk-ai-title-wrap">

              <div className="dk-ai-avatar">

                <BotAvatar
                  type="droid"
                  face="mouth"
                  state={typing ? "working" : "default"}
                  size={42}
                  color="#0ac9df"
                  shading="fabric"
                  theme={isCrystalIce ? "light" : "auto"}
                  interactive
                  speed={0.9}
                  seed={0.42}
                />

              </div>

              <div>

                <div className="dk-ai-title">B.L.U.E.</div>

                <div className="dk-ai-status">

                  Bot for Learning, Understanding & Engagement

                </div>

              </div>

            </div>

            <button

              type="button"

              className="dk-ai-close"

              onClick={closeAssistant}

              aria-label="Close B.L.U.E. assistant"

            >

              <X size={16} />

            </button>

          </header>

          <div

            ref={messagesRef}

            className="dk-ai-body"

          >

            {messages.map((message) => {

if (message.type === "conversation-end") {

                return (

                  <div

                    key={message.id}

                    className="dk-ai-conversation-end"

                  >

                    <span />

                    <small>Conversation ended</small>

                    <span />

                  </div>

                );

              }

              return (

                <React.Fragment key={message.id}>

                  <div

                    className={`dk-ai-message-row ${message.role}`}

                  >

                    <div

                      className={`dk-ai-message ${message.role}`}

                    >

                      {message.text}

                      {message.role === "assistant" && (
                        <button
                          type="button"
                          className={`dk-ai-speaker ${
                            speakingId === message.id ? "speaking" : ""
                          } ${speechHintId === message.id ? "show-hint" : ""}`}
                          onClick={() => toggleSpeech(message)}
                          aria-label={
                            speakingId === message.id
                              ? speechPaused
                                ? "Resume speaking"
                                : "Pause speaking"
                              : "Read this response aloud"
                          }
                          title={
                            speakingId === message.id
                              ? speechPaused
                                ? "Click here to resume speaking"
                                : "Click here to pause speaking"
                              : "Read aloud"
                          }
                          data-tooltip={
                            speakingId === message.id
                              ? speechPaused
                                ? "Click here to resume speaking"
                                : "Click here to pause speaking"
                              : "Click to hear this response"
                          }
                        >
                          {speakingId === message.id ? (
                            speechPaused ? <Play size={11} fill="currentColor" /> : <VolumeX size={12} />
                          ) : (
                            <Volume2 size={12} />
                          )}
                        </button>
                      )}

                      {message.role === "assistant" &&
                        message.source && (


                          <div className="dk-ai-source">

                            <Sparkles size={10} />

                            Based on {message.source}

                          </div>

                        )}

                      {message.role === "assistant" &&

                        message.section && (

                          <button

                            type="button"

                            className="dk-ai-action"

                            onClick={() =>

                              navigateTo(message.section)

                            }

                          >

                            View in portfolio

                            <ChevronRight size={11} />

                          </button>

                        )}

                      {message.role === "assistant" &&

                        message.link && (

                          <a

                            className="dk-ai-action"

                            href={message.link}

                            target="_blank"

                            rel="noreferrer"

                          >

                            Open project

                            <ExternalLink size={10} />

                          </a>

                        )}

                    </div>

                  </div>

                </React.Fragment>

              );

            })}

            {showTemplates && !typing && (

              <div className="dk-ai-quick">

                {QUICK_PROMPTS.map((prompt) => (

                  <button

                    key={prompt}

                    type="button"

                    onClick={() => submit(prompt)}

                  >

                    {prompt}

                  </button>

                ))}

              </div>

            )}

            {typing && (

              <div className="dk-ai-message-row assistant">

                <div
                  className="dk-ai-typing dk-ai-typing-avatar"
                  aria-label="B.L.U.E. is working"
                >
                  <BotAvatar
                    type="droid"
                    face="mouth"
                    state="working"
                    size={30}
                    color="#0ac9df"
                    shading="fabric"
                    theme={isCrystalIce ? "light" : "auto"}
                    interactive={false}
                    speed={1.15}
                    seed={0.42}
                  />
                </div>

              </div>

            )}

          </div>

          <footer className="dk-ai-footer">

            <div className="dk-ai-chat-actions">

              <button

                type="button"

                className="dk-ai-template-toggle"

                onClick={() => setShowTemplates((visible) => !visible)}

                disabled={typing}

                aria-expanded={showTemplates}

              >

                {showTemplates ? "Hide templates" : "Templates"}

              </button>

              <button

                type="button"

                className="dk-ai-clear-chat"

                onClick={clearChat}

                disabled={typing}

              >

                Clear chat

              </button>

              <button

                type="button"

                className="dk-ai-end-conversation"

                onClick={endConversation}

                disabled={typing}

              >

                End conversation

              </button>

            </div>

            <div className="dk-ai-input-wrap">
              {isListening ? (
                <>
                  <div className="dk-ai-voice-state" aria-live="polite">
                    <span className="dk-ai-voice-orb" />
                    <span>
                      {input.trim() ? input : "Speak now…"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="dk-ai-voice-stop"
                    onClick={stopListening}
                    disabled={isStoppingVoice}
                    aria-label="Pause listening and send question"
                    title={isStoppingVoice ? "Stopping…" : "Click here to pause listening"}
                  >
                    <Pause size={14} fill="currentColor" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="dk-ai-mic"
                    onClick={startListening}
                    disabled={!voiceSupported || typing}
                    aria-label={
                      voiceSupported
                        ? "Speak to B.L.U.E."
                        : "Voice input is not supported in this browser"
                    }
                    title={
                      voiceSupported
                        ? "Speak to B.L.U.E."
                        : "Voice input is not supported in this browser"
                    }
                  >
                    <Mic size={15} />
                  </button>

                  <textarea
                    ref={inputRef}
                    className="dk-ai-input"
                    value={input}
                    onChange={(event) =>
                      setInput(event.target.value)
                    }
                    onKeyDown={onKeyDown}
                    placeholder="Ask B.L.U.E. about Deepshik..."
                    rows={1}
                    aria-label="Ask B.L.U.E."
                  />

                  <button
                    type="button"
                    className="dk-ai-send"
                    onClick={() => submit()}
                    disabled={!input.trim() || typing}
                    aria-label="Send question to B.L.U.E."
                  >
                    <Send size={15} />
                  </button>
                </>
              )}
            </div>

            <div className="dk-ai-note">

            </div>

          </footer>

        </section>

      )}

    </div>

  );

  if (typeof document === "undefined") return null;

  return createPortal(assistantUI, document.body);

}
