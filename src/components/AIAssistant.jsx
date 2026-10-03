import React, { useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import "./AIAssistant.css";

import {

  Bot,

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

const QUICK_PROMPTS = [

  "Tell me about Deepshik",

  "What are his main skills?",

  "Show me his data engineering work",

  "Tell me about the IoT project",

];

function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text = "") {
  return normalize(text).split(" ").filter(Boolean);
}

function scoreMatch(question, candidates = []) {
  const q = normalize(question);
  const qTokens = new Set(tokenize(question));
  let score = 0;

  for (const candidate of candidates) {
    const normalizedCandidate = normalize(candidate);
    if (!normalizedCandidate) continue;

    if (q === normalizedCandidate) score += 100;
    if (q.includes(normalizedCandidate)) {
      score += normalizedCandidate.split(" ").length * 8;
    }

    for (const token of tokenize(normalizedCandidate)) {
      if (qTokens.has(token)) score += token.length >= 4 ? 2 : 1;
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
    project?.deployment,
    project?.publication,
    ...(project?.technologies || []),
    ...(project?.datasets || []),
    ...(project?.methods || []),
    ...(project?.capabilities || []),
    ...(project?.pipeline || []),
    ...(project?.keywords || []),
  ].filter(Boolean).join(" ");
}

function getQueryMapCandidates(category) {
  return portfolioKnowledge?.queryMap?.[category] || [];
}

function findBestProject(question, preferredProjectId = null) {
  const projects = portfolioKnowledge.projects || [];
  if (!projects.length) return null;

  const q = normalize(question);

  if (preferredProjectId) {
    const contextual = projects.find((project) => project.id === preferredProjectId);
    if (contextual) {
      const contextualWords = [
        "this project", "that project", "this", "that",
        "it", "the project", "its", "it use", "it used",
        "what about it", "tell me more"
      ];
      if (contextualWords.some((phrase) => q.includes(phrase))) {
        return contextual;
      }
    }
  }

  const categoryScores = Object.entries(portfolioKnowledge.queryMap || {})
    .filter(([category]) => projects.some((project) => {
      if (category === "iot") return project.id === "iot-ids";
      if (category === "cac") return project.id === "cac-data-engineering";
      if (category === "captionize") return project.id === "captionize";
      if (category === "navAisle") return project.id === "nav-aisle";
      return false;
    }))
    .map(([category, phrases]) => ({
      category,
      score: scoreMatch(question, phrases),
    }))
    .sort((a, b) => b.score - a.score);

  const categoryToId = {
    iot: "iot-ids",
    cac: "cac-data-engineering",
    captionize: "captionize",
    navAisle: "nav-aisle",
  };

  if (categoryScores[0]?.score > 0) {
    const project = projects.find(
      (item) => item.id === categoryToId[categoryScores[0].category]
    );
    if (project) return project;
  }

  const scored = projects
    .map((project) => ({
      project,
      score: scoreMatch(question, [
        project.name,
        project.fullTitle,
        project.tag,
        project.type,
        project.description,
        project.purpose,
        project.deployment,
        project.publication,
        ...(project.technologies || []),
        ...(project.datasets || []),
        ...(project.methods || []),
        ...(project.capabilities || []),
        ...(project.pipeline || []),
        ...(project.keywords || []),
        getProjectSearchText(project),
      ]),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score >= 5 ? scored[0].project : null;
}

function detectIntent(question) {
  const q = normalize(question);

  const categories = [
    "identity",
    "education",
    "skills",
    "experience",
    "projects",
    "certifications",
    "achievements",
  ];

  let bestIntent = "unknown";
  let bestScore = 0;

  for (const intent of categories) {
    const score = scoreMatch(question, [
      ...getQueryMapCandidates(intent),
      ...(portfolioKnowledge?.[intent]?.keywords || []),
    ]);

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  const researchScore = scoreMatch(question, [
    ...getQueryMapCandidates("iot"),
    ...(portfolioKnowledge?.research?.keywords || []),
    "research",
    "paper",
    "publication",
    "dataset",
    "method",
    "deployment",
  ]);

  if (researchScore > bestScore) {
    bestIntent = "research";
    bestScore = researchScore;
  }

  if (scoreMatch(question, ["contact", "email", "reach", "get in touch", "linkedin", "github"]) > bestScore) {
    bestIntent = "contact";
    bestScore = scoreMatch(question, ["contact", "email", "reach", "get in touch", "linkedin", "github"]);
  }

  if (scoreMatch(question, [
    "complete overview",
    "everything about him",
    "tell me everything",
    "full profile",
    "complete profile",
    "portfolio overview",
    "all about deepshik",
  ]) > bestScore) {
    bestIntent = "overview";
  }

  // Prevent a generic word such as "project" from winning over a
  // clearly project-specific query.
  if (q.includes("project") && bestScore < 10) bestIntent = "projects";

  return bestIntent;
}

function isFollowUpQuestion(question) {
  const q = normalize(question);
  return [
    "this", "that", "it", "its", "he", "his", "they", "them",
    "what about", "and what", "how about", "tell me more",
    "more about it", "what did he use", "what technologies did he use",
    "what dataset did he use", "which dataset", "what tools did he use",
    "where can i see it", "show me it", "show it"
  ].some((phrase) => q === phrase || q.startsWith(`${phrase} `) || q.includes(` ${phrase} `));
}

function getContextProject(history = []) {
  const recentAssistantMessages = [...history]
    .reverse()
    .filter((message) => message?.role === "assistant");

  for (const message of recentAssistantMessages) {
    if (message.projectId) {
      return portfolioKnowledge.projects?.find(
        (project) => project.id === message.projectId
      ) || null;
    }
    if (message.source) {
      const sourceMatch = portfolioKnowledge.projects?.find(
        (project) => project.name === message.source
      );
      if (sourceMatch) return sourceMatch;
    }
  }

  return null;
}

function formatList(items = []) {
  return items.filter(Boolean).join(", ");
}

function getProjectAnswer(question, project) {
  if (!project) return null;

  const q = normalize(question);

  const asksTech = [
    "technology", "technologies", "tech", "stack", "tools",
    "built with", "built using", "used", "use", "framework",
    "library", "libraries"
  ].some((word) => q.includes(word));

  const asksDataset = [
    "dataset", "datasets", "data used", "trained on",
    "training data", "data set"
  ].some((word) => q.includes(word));

  const asksPurpose = [
    "why", "purpose", "what is it", "what does it do",
    "what is the project", "explain", "what does this do"
  ].some((word) => q.includes(word));

  const asksPipeline = [
    "pipeline", "flow", "architecture", "process", "raw",
    "staging", "analytics", "etl", "ingestion", "transformation"
  ].some((word) => q.includes(word));

  const asksMethods = [
    "method", "methods", "algorithm", "model", "approach",
    "attack", "explainability", "robustness"
  ].some((word) => q.includes(word));

  const asksCapabilities = [
    "feature", "features", "capability", "capabilities",
    "can it", "does it support", "what can it do"
  ].some((word) => q.includes(word));

  const asksDeployment = [
    "deploy", "deployment", "live", "api", "swagger"
  ].some((word) => q.includes(word));

  const asksPublication = [
    "publication", "published", "paper", "presented",
    "springer", "ict4sd"
  ].some((word) => q.includes(word));

  const asksLink = [
    "link", "github", "repo", "repository", "source code",
    "see it", "view it", "open it"
  ].some((word) => q.includes(word));

  let text = "";

  if (asksLink && project.url) {
    text = `${project.name} is available here: ${project.url}`;
  } else if (asksDataset && project.datasets?.length) {
    text = `${project.name} used: ${formatList(project.datasets)}.`;
  } else if (asksMethods && project.methods?.length) {
    text = `${project.name} uses these methods/models: ${formatList(project.methods)}.`;
  } else if (asksTech && project.technologies?.length) {
    text = `${project.name} uses: ${formatList(project.technologies)}.`;
  } else if (asksPipeline && project.pipeline?.length) {
    text = `${project.name}'s pipeline is: ${project.pipeline.join(" → ")}.`;
  } else if (asksCapabilities && project.capabilities?.length) {
    text = `${project.name} supports: ${formatList(project.capabilities)}`;
  } else if (asksDeployment && project.deployment) {
    text = `${project.name}: ${project.deployment}`;
  } else if (asksPublication && project.publication) {
    text = `${project.name}: ${project.publication}`;
  } else if (asksPurpose && project.purpose) {
    text = `${project.name}: ${project.purpose}`;
  } else {
    text = `${project.name}: ${project.description || project.purpose || ""}`;

    if (project.technologies?.length) {
      text += ` Technologies include ${formatList(project.technologies)}.`;
    }
  }

  return {
    text,
    source: project.name,
    link: project.url && project.url !== "#" ? project.url : null,
    section: project.section,
    projectId: project.id,
  };
}

function getOverviewAnswer() {
  const { identity, education, portfolio, skills, experience, projects, certifications, achievements } =
    portfolioKnowledge;

  const experienceText = experience?.length
    ? experience.map((item) => `${item.role} at ${item.company}`).join("; ")
    : "the portfolio's listed experience";

  return {
    text:
      `${identity.name} is a ${identity.role} based in ${identity.location}. ` +
      `${identity.summary || portfolio?.focusAreas?.join(", ")} ` +
      `He studied ${education.degree} in ${education.field} at ${education.institution} (${education.period}). ` +
      `His portfolio covers ${formatList(portfolio.focusAreas)}. ` +
      `It currently lists ${projects?.length || 0} featured projects, ` +
      `${experienceText}, ${certifications?.length || 0} certifications/workshops, ` +
      `and ${achievements?.length || 0} listed achievements. ` +
      `His core technologies include ${formatList(portfolio.coreTechnologies || skills)}.`,
    source: "Portfolio Overview",
    section: "about",
  };
}

function getLocalAnswer(question, history = []) {
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

  const contextualProject = getContextProject(history);
  const project = findBestProject(question, contextualProject?.id);

  // Follow-up questions inherit the most recent project context.
  if (contextualProject && isFollowUpQuestion(question)) {
    const contextualAnswer = getProjectAnswer(question, contextualProject);
    if (contextualAnswer) return contextualAnswer;
  }

  const intent = detectIntent(question);

  if (intent === "overview") return getOverviewAnswer();

  if (intent === "identity") {
    return {
      text:
        `${identity.name} is a ${identity.role} based in ${identity.location}. ` +
        `${identity.summary || about.summary} ` +
        `His portfolio focuses on ${formatList(portfolio.focusAreas?.slice(0, 6))}.`,
      source: "About",
      section: "about",
    };
  }

  if (intent === "education") {
    return {
      text:
        `${identity.name} completed a ${education.degree} in ${education.field} ` +
        `at ${education.institution} (${education.period}).`,
      source: "Education",
      section: "education",
    };
  }

  if (intent === "skills") {
    const categoryLabels = [
      ["Programming", skillsByCategory?.programming],
      ["Data", skillsByCategory?.data],
      ["Data Engineering", skillsByCategory?.dataEngineering],
      ["Analytics", skillsByCategory?.analytics],
      ["Development", skillsByCategory?.development],
      ["Version control", skillsByCategory?.versionControl],
    ];

    const parts = categoryLabels
      .filter(([, values]) => values?.length)
      .map(([label, values]) => `${label}: ${formatList(values)}`);

    return {
      text: `${identity.name}'s technical toolkit includes:\n\n${parts.join("\n") || formatList(skills)}.`,
      source: "Tools & Skills",
      section: "skills",
    };
  }

  if (intent === "experience") {
    if (!experience?.length) {
      return {
        text: "The portfolio knowledge base does not currently contain detailed professional experience.",
        source: "Experience",
        section: "experience",
      };
    }

    const text = experience.map((job) => {
      const responsibilities = job.responsibilities?.length
        ? ` Responsibilities: ${formatList(job.responsibilities)}`
        : "";
      return `${job.role} at ${job.company} (${job.period}). ${job.description}${responsibilities}`;
    }).join("\n\n");

    return {
      text,
      source: "Experience",
      section: "experience",
    };
  }

  if (intent === "certifications") {
    if (!certifications?.length) {
      return {
        text: "The portfolio knowledge base does not currently contain certification information.",
        source: "Certifications",
        section: "certifications",
      };
    }

    const certificationText = certifications.map((cert, index) => {
      const name = typeof cert === "string" ? cert : cert.name;
      const provider = typeof cert === "object" && cert.provider ? ` — ${cert.provider}` : "";
      const date = typeof cert === "object" && cert.date ? ` (${cert.date})` : "";
      return `${index + 1}. ${name}${provider}${date}`;
    }).join("\n");

    return {
      text: `${identity.name}'s portfolio lists ${certifications.length} certifications/workshops:\n\n${certificationText}`,
      source: "Certifications",
      section: "certifications",
    };
  }

  if (intent === "achievements") {
    if (!achievements?.length) {
      return {
        text: "The portfolio knowledge base does not currently contain achievement information.",
        source: "Achievements",
        section: "achievements",
      };
    }

    const achievementText = achievements.map((achievement, index) =>
      `${index + 1}. ${achievement.title || achievement.description}: ${achievement.description || ""}`
    ).join("\n");

    return {
      text: `${identity.name}'s listed achievements include:\n\n${achievementText}`,
      source: "Achievements",
    };
  }

  if (intent === "research") {
    const datasets = research?.datasets?.length ? formatList(research.datasets) : "the listed datasets";
    const methods = research?.methods?.length ? formatList(research.methods) : "the listed methods";

    return {
      text:
        `${research.title}. ` +
        `The research uses ${datasets} and includes ${methods}. ` +
        `${research.publication} ${research.deployment}`,
      source: "Research",
      section: "work",
      link: projects.find((item) => item.id === "iot-ids")?.url || null,
      projectId: "iot-ids",
    };
  }

  if (project) {
    return getProjectAnswer(question, project);
  }

  if (intent === "projects") {
    return {
      text:
        `Deepshik currently has ${projects.length} featured projects:\n\n` +
        projects.map((item, index) => `${index + 1}. ${item.name} — ${item.description}`).join("\n\n") +
        `\n\nAsk me about a specific project and I can explain its purpose, technologies, data, methods, capabilities, pipeline, deployment, or link.`,
      source: "Selected Work",
      section: "work",
    };
  }

  if (intent === "contact") {
    return {
      text:
        "The knowledge base does not contain a specific email address or social URL. " +
        "You can use the portfolio's Get in touch/contact area or its social links in the footer to reach Deepshik.",
      source: "Contact",
    };
  }

  // A final knowledge-base-only retrieval pass. This lets B.L.U.E. answer
  // questions about fields that do not have a dedicated intent without
  // inventing information.
  const searchableEntries = [
    ["Identity", identity],
    ["About", about],
    ["Education", education],
    ["Skills", skills],
    ["Experience", experience],
    ["Research", research],
    ["Certifications", certifications],
    ["Achievements", achievements],
    ["Portfolio", portfolio],
    ["Projects", projects],
  ];

  let bestEntry = null;
  let bestScore = 0;

  for (const [source, data] of searchableEntries) {
    const serialized = JSON.stringify(data);
    const score = scoreMatch(question, [
      source,
      ...(data?.keywords || []),
      serialized,
    ]);

    if (score > bestScore) {
      bestScore = score;
      bestEntry = { source, data };
    }
  }

  if (bestEntry && bestScore >= 6) {
    const data = bestEntry.data;
    if (Array.isArray(data)) {
      return {
        text: `${bestEntry.source} information in the portfolio knowledge base:\n\n` +
          data.map((item, index) =>
            `${index + 1}. ${typeof item === "string" ? item : item.name || item.title || item.description || JSON.stringify(item)}`
          ).join("\n"),
        source: bestEntry.source,
      };
    }

    return {
      text: `${bestEntry.source} information available in the portfolio knowledge base: ` +
        Object.entries(data || {})
          .filter(([key, value]) => !["keywords"].includes(key) && value !== undefined && value !== null)
          .slice(0, 8)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? formatList(value) : typeof value === "object" ? JSON.stringify(value) : value}`)
          .join(" | "),
      source: bestEntry.source,
    };
  }

  return {
    text:
      "I can answer questions about Deepshik using the portfolio knowledge base, including his identity, education, skills, experience, projects, research, certifications, achievements, and portfolio focus. " +
      "If a specific fact is not contained in that knowledge base, I won't guess.",
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

      text: "Hi — I'm BLUE., Deepshik's portfolio assistant. Ask me about his work, skills, projects, research, or experience.",

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

      const answer = getLocalAnswer(question, messages);

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

          <span className="dk-ai-launcher-icon">

            <Sparkles size={15} />

          </span>

          <span className="dk-ai-launcher-label">

            Ask to B.L.U.E.

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

                <Bot size={19} />

              </div>

              <div>

                <div className="dk-ai-title">B.L.U.E.</div>

                <div className="dk-ai-status">

                  Bridging Learning, Understanding & Experience

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

                  className="dk-ai-typing"

                  aria-label="B.L.U.E. is typing"

                >

                  <span />

                  <span />

                  <span />

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
