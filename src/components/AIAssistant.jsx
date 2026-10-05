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

  return text.toLowerCase().replace(/[^\w\s]/g, " ");

}

function findBestProject(question) {

  const q = normalize(question);

  if (

    q.includes("iot") ||

    q.includes("intrusion") ||

    q.includes("security")

  ) {

    return portfolioKnowledge.projects.find((p) =>

      p.name.includes("IoT")

    );

  }

  if (

    q.includes("data engineering") ||

    q.includes("snowflake") ||

    q.includes("talend") ||

    q.includes("etl") ||

    q.includes("pipeline") ||

    q.includes("cac")

  ) {

    return portfolioKnowledge.projects.find((p) =>

      p.name.includes("CAC")

    );

  }

  if (

    q.includes("caption") ||

    q.includes("computer vision") ||

    q.includes("internship") ||

    q.includes("intern")

  ) {

    return portfolioKnowledge.projects.find(

      (p) => p.name === "Captionize"

    );

  }

  return null;

}

function getLocalAnswer(question) {

  const q = normalize(question);

  const {

    about,

    skills,

    experience,

    projects,

    certifications,

    research,

  } = portfolioKnowledge;

  if (

    q.includes("who") ||

    q.includes("about deepshik") ||

    q.includes("about him") ||

    q.includes("introduce")

  ) {

    return {

      text: `${about.name} is a ${about.role} based in ${about.location}. He is a B.Tech Computer Science & Engineering (Data Science) graduate from CMR College of Engineering & Technology. His work spans data engineering, software development, machine learning, and digital design.`,

      source: "About",

    };

  }

  if (

    q.includes("skill") ||

    q.includes("technology") ||

    q.includes("tech stack") ||

    q.includes("know")

  ) {

    return {

      text: `His core toolkit includes ${skills

        .slice(0, 12)

        .join(", ")}, along with ${skills

        .slice(12)

        .join(", ")}.`,

      source: "Tools & Skills",

    };

  }

  if (

    q.includes("experience") ||

    q.includes("internship") ||

    q.includes("intern")

  ) {

    const job = experience[0];

    return {

      text: `${job.role} at ${job.company} (${job.period}). ${job.description}`,

      source: "Experience",

    };

  }

  if (

    q.includes("cert") ||

    q.includes("snowflake badge") ||

    q.includes("snowflake workshop")

  ) {

    return {

      text: `The portfolio lists ${certifications.length} certifications/workshops, including ${certifications.join(

        "; "

      )}.`,

      source: "Certifications",

    };

  }

  if (

    q.includes("research") ||

    q.includes("paper") ||

    q.includes("publication")

  ) {

    return {

      text: `${research.title}. It uses the ${research.datasets.join(

        " and "

      )} datasets, with ${research.methods.join(

        ", "

      )}. The project was presented at ICT4SD 2026 and has a FastAPI deployment.`,

      source: "Research",

    };

  }

  const project = findBestProject(question);

  if (project) {

    return {

      text: `${project.name}: ${project.description}`,

      source: project.name,

      link: project.url,

      section: project.section,

    };

  }

  if (

    q.includes("project") ||

    q.includes("work") ||

    q.includes("portfolio")

  ) {

    return {

      text: `There are ${projects.length} featured projects: ${projects

        .map((p) => p.name)

        .join(

          ", "

        )}. Ask me about any one of them and I can take you to the Work section.`,

      source: "Selected Work",

      section: "work",

    };

  }

  if (

    q.includes("contact") ||

    q.includes("email") ||

    q.includes("reach")

  ) {

    return {

      text: "You can use the portfolio's Get in touch/contact area or the social links in the footer to reach Deepshik.",

      source: "Contact",

    };

  }

  return {

    text: `I can help you explore Deepshik's projects, skills, experience, research, certifications, education, and creative work. Try asking “Tell me about the IoT project” or “Show me his data engineering work.”`,

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
