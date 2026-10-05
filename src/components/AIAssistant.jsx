import React, { useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";







import {



  Bot,



  ChevronRight,



  ExternalLink,



  Mic,



  Pause,



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



  // Hide B.L.U.E. while the main page is moving, then bring it back

  // with an iOS-style spring once scrolling has actually stopped.

  useEffect(() => {

    let stopTimer;



    const handlePageScroll = () => {

      setIsPageScrolling(true);

      window.clearTimeout(stopTimer);



      stopTimer = window.setTimeout(() => {

        setIsPageScrolling(false);

      }, 360);

    };



    window.addEventListener("scroll", handlePageScroll, { passive: true });



    return () => {

      window.removeEventListener("scroll", handlePageScroll);

      window.clearTimeout(stopTimer);

    };

  }, []);



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
      setIsStoppingVoice(false);
      if (event.error !== "aborted") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
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

  const getLuminance = (rgb) => {

      const match = rgb?.match(/rgba?\(([^)]+)\)/i);

      if (!match) return null;

      const values = match[1]

        .split(",")

        .slice(0, 3)

        .map((v) => Number.parseFloat(v.trim()));



      if (values.length !== 3 || values.some(Number.isNaN)) return null;



      const [r, g, b] = values.map((v) => v / 255);

      const linear = (v) =>

        v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;



      return (

        0.2126 * linear(r) +

        0.7152 * linear(g) +

        0.0722 * linear(b)

      );

    };



    const detectTheme = () => {

      const root = document.documentElement;

      const body = document.body;



      // The portfolio stores its actual theme state on .portfolio-root:

      // data-dark="false" = Crystal Ice

      // data-dark="true"  = Aquatic Mist Dark

      const portfolioRoot = document.querySelector(".portfolio-root");



      if (portfolioRoot?.getAttribute("data-dark") === "false") {

        setIsCrystalIce(true);

        return;

      }



      if (portfolioRoot?.getAttribute("data-dark") === "true") {

        setIsCrystalIce(false);

        return;

      }



      const signature = `${root.className} ${body.className} ${

        root.getAttribute("data-theme") || ""

      } ${body.getAttribute("data-theme") || ""}`.toLowerCase();



      if (

        signature.includes("aquatic") ||

        signature.includes("dark") ||

        signature.includes("mist")

      ) {

        setIsCrystalIce(false);

        return;

      }



      if (

        signature.includes("crystal") ||

        signature.includes("ice") ||

        signature.includes("light")

      ) {

        setIsCrystalIce(true);

        return;

      }



      const bodyLum = getLuminance(getComputedStyle(body).backgroundColor);

      const rootLum = getLuminance(getComputedStyle(root).backgroundColor);

      const luminance = bodyLum ?? rootLum;



      setIsCrystalIce(luminance != null && luminance > 0.45);

    };



    detectTheme();



    const observer = new MutationObserver(detectTheme);



    observer.observe(document.documentElement, {

      attributes: true,

      attributeFilter: ["class", "data-theme"],

    });



    observer.observe(document.body, {

      attributes: true,

      attributeFilter: ["class", "data-theme"],

    });



    const portfolioRoot = document.querySelector(".portfolio-root");

    if (portfolioRoot) {

      observer.observe(portfolioRoot, {

        attributes: true,

        attributeFilter: ["data-dark"],

      });

    }



    return () => observer.disconnect();

  }, []);



  const messagesRef = useRef(null);

useEffect(() => {



    if (open) {



      window.setTimeout(() => {



        inputRef.current?.focus();



      }, 180);



    }



  }, [open]);







  useEffect(() => {



    const node = messagesRef.current;







    if (!node) return;







    node.scrollTo({



      top: node.scrollHeight,



      behavior: "smooth",



    });



  }, [messages, typing]);







  useEffect(() => {
    if (!open && recognitionRef.current) {
      shouldSubmitVoiceRef.current = false;

      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore cleanup errors.
      }

      setIsListening(false);
    }
  }, [open]);

  const navigateTo = (section) => {



    if (!section) return;







    const target = document.getElementById(section);







    if (!target) return;







    target.scrollIntoView({



      behavior: "smooth",



      block: "start",



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







    window.setTimeout(() => {



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
    if (!voiceSupported || typing || isListening) return;

    const recognition = recognitionRef.current;

    if (!recognition) return;

    try {
      voiceTranscriptRef.current = "";
      voiceLiveTranscriptRef.current = "";
      shouldSubmitVoiceRef.current = false;
      setIsStoppingVoice(false);
      setInput("");
      setShowTemplates(false);
      recognition.start();
    } catch {
      // Speech recognition can throw if it is already running.
    }
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition || isStoppingVoice) return;

    // Lock the control immediately so one click can only trigger one stop.
    setIsStoppingVoice(true);
    shouldSubmitVoiceRef.current = true;

    try {
      recognition.stop();
    } catch {
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
      if (synth.paused) {
        synth.resume();
        setSpeechPaused(false);
        return;
      }

      synth.pause();
      setSpeechPaused(true);
      return;
    }

    synth.cancel();
    setSpeechPaused(false);

    // Use a natural English voice when the browser exposes one, then
    // fall back to the browser's default voice. A slightly faster rate
    // keeps B.L.U.E. conversational without becoming rushed.
    const voices = synth.getVoices();
    const preferredVoice = voices.find((voice) => {
      const name = voice.name.toLowerCase();
      return (
        /microsoft.*(aria|jenny|guy|davis)/i.test(name) ||
        /google us english/i.test(name) ||
        /samantha/i.test(name)
      ) && voice.lang.toLowerCase().startsWith("en-us");
    }) || voices.find((voice) =>
      voice.lang.toLowerCase().startsWith("en-us")
    );

    const spokenText = message.text
      .replace(/\s+/g, " ")
      .replace(/\s+([,.!?;:])/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = "en-US";
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.12;
    utterance.pitch = 0.98;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeakingId(message.id);
      setSpeechPaused(false);
      setSpeechHintId(message.id);

      window.clearTimeout(speechHintTimerRef.current);
      speechHintTimerRef.current = window.setTimeout(() => {
        setSpeechHintId(null);
      }, 2600);
    };

    utterance.onend = () => {
      setSpeakingId(null);
      setSpeechPaused(false);
      setSpeechHintId(null);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
      setSpeechPaused(false);
      setSpeechHintId(null);
    };

    setSpeakingId(message.id);
    synth.speak(utterance);
  };
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      window.clearTimeout(speechHintTimerRef.current);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors.
        }
      }
    };
  }, []);

  const endConversation = () => {

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

        text: "Hi — I'm B.L.U.E., Deepshik's portfolio assistant. Ask me about his work, skills, projects, research, or experience.",

        source: "Portfolio",

        newConversation: true,

      },

    ]);



    window.setTimeout(() => {

      inputRef.current?.focus();

    }, 100);

  };



  const clearChat = () => {

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

        text: "Hi — I'm B.L.U.E., Deepshik's portfolio assistant. Ask me about his work, skills, projects, research, or experience.",

        source: "Portfolio",

      },

    ]);



    window.setTimeout(() => {

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

      <style>{`

        .dk-ai-root,

        .dk-ai-root *,

        .dk-ai-root *::before,

        .dk-ai-root *::after {

          box-sizing: border-box;

        }



        .dk-ai-root {

          all: initial;

          position: relative;

          z-index: 2147483647;

          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,

            "Segoe UI", sans-serif;

          color: #f4fbff;

          line-height: 1.4;

        }



        .dk-ai-root button,

        .dk-ai-root textarea {

          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,

            "Segoe UI", sans-serif;

        }



        /* =========================

           LAUNCHER

           ========================= */



        .dk-ai-launcher {

          all: unset;

          position: fixed !important;

          right: 26px !important;

          bottom: 26px !important;

          z-index: 2147483647 !important;



          display: flex !important;

          align-items: center !important;

          justify-content: center !important;

          gap: 7px;



          min-width: 94px;

          min-height: 42px;

          padding: 7px 12px 7px 8px;



          border: 1px solid rgba(255, 255, 255, 0.72) !important;

          border-radius: 999px !important;



          color: #eaf7ff !important;

          background:

            radial-gradient(

              circle at 18% 0%,

              rgba(255, 255, 255, 0.18),

              transparent 42%

            ),

            linear-gradient(

              145deg,

              rgba(30, 58, 76, 0.96),

              rgba(8, 30, 45, 0.96)

            ) !important;



          box-shadow:

            0 18px 45px rgba(0, 0, 0, 0.34),

            0 4px 12px rgba(3, 35, 55, 0.18),

            inset 0 1px 0 rgba(255, 255, 255, 0.28) !important;



          backdrop-filter: blur(24px) saturate(180%);

          -webkit-backdrop-filter: blur(24px) saturate(180%);



          cursor: pointer !important;

          pointer-events: auto !important;

          user-select: none;

          appearance: none !important;



          font: 600 10px/1 Inter, system-ui, sans-serif !important;



          transition:

            transform 0.22s ease,

            box-shadow 0.22s ease;

        }



        .dk-ai-launcher:hover {

          transform: translateY(-4px) !important;

          box-shadow:

            0 24px 55px rgba(0, 0, 0, 0.38),

            0 5px 14px rgba(3, 35, 55, 0.2),

            inset 0 1px 0 rgba(255, 255, 255, 0.38) !important;

        }



        .dk-ai-launcher:active {

          transform: translateY(-1px) scale(0.98) !important;

        }



        .dk-ai-launcher-icon {

          width: 26px;

          height: 26px;

          flex: 0 0 auto;



          display: grid;

          place-items: center;



          border-radius: 50%;

          background: linear-gradient(145deg, #e0f2fe, #7dd3fc);

          color: #062b43;



          box-shadow:

            inset 0 1px 0 rgba(255, 255, 255, 0.8),

            0 3px 10px rgba(6, 43, 67, 0.18);

        }



        .dk-ai-launcher-label {

          display: block;

          white-space: nowrap;

          letter-spacing: 0.02em;

        }



        /* =========================

           IOS-LIKE SCROLL AUTO-HIDE

           ========================= */



        .dk-ai-launcher,

        .dk-ai-panel {

          will-change: transform, opacity;

        }



        .dk-ai-launcher.dk-ai-scroll-hidden {

          opacity: 0 !important;

          pointer-events: none !important;

          transform: translate3d(0, calc(100% + 22px), 0) scale(0.94) !important;

          transition:

            transform 0.46s cubic-bezier(0.22, 1, 0.36, 1),

            opacity 0.24s ease !important;

        }



        .dk-ai-panel.dk-ai-scroll-hidden {

          opacity: 0 !important;

          pointer-events: none !important;

          transform: translate3d(0, calc(100% + 30px), 0) scale(0.94) !important;

          transition:

            transform 0.46s cubic-bezier(0.22, 1, 0.36, 1),

            opacity 0.24s ease !important;

        }



        .dk-ai-launcher:not(.dk-ai-scroll-hidden),

        .dk-ai-panel:not(.dk-ai-scroll-hidden) {

          transition:

            transform 0.58s cubic-bezier(0.16, 1, 0.3, 1),

            opacity 0.30s ease !important;

        }



        /* =========================

           PANEL — DARK IN BOTH MODES

           ========================= */



        .dk-ai-panel {

          position: fixed !important;

          right: 26px !important;

          bottom: 88px !important;

          z-index: 2147483646 !important;



          width: min(390px, calc(100vw - 32px));

          height: min(610px, calc(100svh - 112px));



          display: flex;

          flex-direction: column;

          overflow: hidden;



          border: 1px solid rgba(255, 255, 255, 0.48) !important;

          border-radius: 26px !important;



          background:

            radial-gradient(

              circle at 15% 0%,

              rgba(255, 255, 255, 0.18),

              transparent 34%

            ),

            linear-gradient(

              145deg,

              rgba(25, 49, 64, 0.92),

              rgba(6, 27, 41, 0.97)

            ) !important;



          color: #f4fbff !important;



          box-shadow:

            0 28px 90px rgba(0, 0, 0, 0.34),

            0 8px 30px rgba(3, 35, 55, 0.2),

            inset 0 1px 0 rgba(255, 255, 255, 0.42) !important;



          backdrop-filter: blur(34px) saturate(165%);

          -webkit-backdrop-filter: blur(34px) saturate(165%);



          animation: dkAiIn 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);

          pointer-events: auto !important;

          isolation: isolate;

        }



        .dk-ai-root button,

        .dk-ai-root textarea {

          -webkit-tap-highlight-color: transparent;

        }



        @keyframes dkAiIn {

          from {

            opacity: 0;

            transform: translateY(12px) scale(0.97);

          }



          to {

            opacity: 1;

            transform: translateY(0) scale(1);

          }

        }



        /* =========================

           HEADER

           ========================= */



        .dk-ai-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 12px;

          padding: 16px 16px 14px;

          border-bottom: 1px solid rgba(255, 255, 255, 0.14);

        }



        .dk-ai-title-wrap {

          display: flex;

          align-items: center;

          gap: 11px;

          min-width: 0;

        }



        .dk-ai-avatar {

          width: 38px;

          height: 38px;

          flex: 0 0 auto;



          display: grid;

          place-items: center;



          border-radius: 13px;

          color: #062b43;

          background: linear-gradient(145deg, #e0f2fe, #7dd3fc);



          box-shadow:

            inset 0 1px 0 rgba(255, 255, 255, 0.8),

            0 3px 12px rgba(3, 35, 55, 0.1);

        }



        .dk-ai-title {

          font: 700 14px/1.1 Inter, system-ui, sans-serif;

          letter-spacing: -0.01em;

        }



        .dk-ai-status {

          margin-top: 4px;

          color: #d9edf8;

          opacity: 0.7;

          font: 10px/1.2 Inter, system-ui, sans-serif;

        }



        .dk-ai-close {

          all: unset;

          width: 34px;

          height: 34px;

          flex: 0 0 auto;



          display: grid;

          place-items: center;



          border: 1px solid rgba(255, 255, 255, 0.24) !important;

          border-radius: 50% !important;

          background: rgba(255, 255, 255, 0.08) !important;

          color: #f4fbff !important;



          cursor: pointer !important;

          appearance: none !important;

        }



        .dk-ai-close:hover {

          background: rgba(125, 211, 252, 0.12) !important;

          border-color: rgba(125, 211, 252, 0.38) !important;

        }



        /* =========================

           BODY / MESSAGES

           ========================= */



        .dk-ai-body {

          flex: 1;

          min-height: 0;

          overflow-y: auto;

          padding: 16px;



          scrollbar-width: thin;

          scrollbar-color: rgba(125, 211, 252, 0.28) transparent;

        }



        .dk-ai-body::-webkit-scrollbar {

          width: 5px;

        }



        .dk-ai-body::-webkit-scrollbar-thumb {

          background: rgba(125, 211, 252, 0.25);

          border-radius: 999px;

        }



        .dk-ai-message-row {

          display: flex;

          margin-bottom: 10px;

        }



        .dk-ai-message-row.user {

          justify-content: flex-end;

        }



        .dk-ai-message {

          max-width: 84%;

          padding: 10px 12px;

          border-radius: 16px;



          font: 12px/1.55 Inter, system-ui, sans-serif;

          white-space: pre-wrap;

        }



        .dk-ai-message.assistant {

          position: relative;
          padding-right: 42px;
          padding-bottom: 34px;
          border: 1px solid rgba(255, 255, 255, 0.12);

          background: rgba(255, 255, 255, 0.075);

          color: #f4fbff;

          border-bottom-left-radius: 5px;

        }



        .dk-ai-message.user {

          color: #062b43;

          background: linear-gradient(145deg, #e0f2fe, #bae6fd);

          border-bottom-right-radius: 5px;

        }



        .dk-ai-source {

          display: flex;

          align-items: center;

          gap: 5px;

          margin-top: 8px;



          color: #d8edf8;

          opacity: 0.58;

          font: 9px/1 Inter, system-ui, sans-serif;

        }



        .dk-ai-action {

          all: unset;

          display: inline-flex;

          align-items: center;

          gap: 5px;



          margin-top: 9px;

          padding: 6px 9px;



          border: 1px solid rgba(125, 211, 252, 0.35) !important;

          border-radius: 999px !important;

          background: rgba(125, 211, 252, 0.09) !important;

          color: #bdeaff !important;



          cursor: pointer !important;

          font: 600 10px/1 Inter, system-ui, sans-serif !important;

          text-decoration: none !important;

        }



        .dk-ai-action:hover {

          background: rgba(125, 211, 252, 0.16) !important;

          border-color: rgba(125, 211, 252, 0.5) !important;

        }



        .dk-ai-quick {

          display: flex;

          flex-wrap: wrap;

          gap: 7px;

          margin-top: 12px;

          margin-bottom: 14px;

        }



        .dk-ai-quick button {

          all: unset;

          display: inline-flex;

          align-items: center;

          justify-content: center;



          border: 1px solid rgba(255, 255, 255, 0.16) !important;

          border-radius: 999px !important;

          padding: 7px 9px;



          background: rgba(255, 255, 255, 0.06) !important;

          color: #f4fbff !important;



          cursor: pointer !important;

          font: 600 10px/1.2 Inter, system-ui, sans-serif !important;



          transition:

            background 0.2s ease,

            border-color 0.2s ease;

        }



        .dk-ai-quick button:hover {

          background: rgba(125, 211, 252, 0.12) !important;

          border-color: rgba(125, 211, 252, 0.3) !important;

        }



        .dk-ai-quick button:disabled {

          opacity: 0.45;

          cursor: default !important;

        }



        .dk-ai-conversation-end {

          display: flex;

          align-items: center;

          gap: 9px;

          margin: 18px 0 14px;



          color: #dceff8;

          opacity: 0.42;



          font: 9px/1 Inter, system-ui, sans-serif;

          text-transform: uppercase;

          letter-spacing: 0.08em;

        }



        .dk-ai-conversation-end span {

          flex: 1;

          height: 1px;

          background: currentColor;

          opacity: 0.3;

        }



        .dk-ai-conversation-end small {

          white-space: nowrap;

        }



        /* =========================

           TYPING

           ========================= */



        .dk-ai-typing {

          display: inline-flex;

          gap: 4px;

          align-items: center;



          padding: 11px 13px;

          border-radius: 15px;



          background: rgba(255, 255, 255, 0.075);

          border: 1px solid rgba(255, 255, 255, 0.12);

        }



        .dk-ai-typing span {

          width: 5px;

          height: 5px;

          border-radius: 50%;

          background: currentColor;

          opacity: 0.5;

          animation: dkAiDot 1s infinite ease-in-out;

        }



        .dk-ai-typing span:nth-child(2) {

          animation-delay: 0.13s;

        }



        .dk-ai-typing span:nth-child(3) {

          animation-delay: 0.26s;

        }



        @keyframes dkAiDot {

          0%,

          60%,

          100% {

            transform: translateY(0);

            opacity: 0.35;

          }



          30% {

            transform: translateY(-3px);

            opacity: 0.9;

          }

        }



        /* =========================

           FOOTER / ACTIONS / INPUT

           ========================= */



        .dk-ai-footer {

          padding: 11px;

          border-top: 1px solid rgba(255, 255, 255, 0.14);

        }



        .dk-ai-chat-actions {

          display: flex;

          gap: 7px;

          margin-bottom: 8px;

        }



        .dk-ai-chat-actions button {

          flex: 1;

        }



        .dk-ai-template-toggle,

        .dk-ai-clear-chat,

        .dk-ai-end-conversation {

          all: unset;



          display: flex;

          align-items: center;

          justify-content: center;



          min-height: 28px;

          padding: 6px 10px;



          border: 1px solid rgba(255, 255, 255, 0.12) !important;

          border-radius: 10px !important;

          background: rgba(255, 255, 255, 0.035) !important;

          color: #e6f4fb !important;



          cursor: pointer !important;

          font: 500 9px/1 Inter, system-ui, sans-serif !important;

          letter-spacing: 0.04em;



          opacity: 0.52;



          transition:

            opacity 0.2s ease,

            background 0.2s ease,

            border-color 0.2s ease;

        }



        .dk-ai-template-toggle:hover,

        .dk-ai-clear-chat:hover,

        .dk-ai-end-conversation:hover {

          opacity: 0.9;

          background: rgba(125, 211, 252, 0.08) !important;

          border-color: rgba(125, 211, 252, 0.25) !important;

        }



        .dk-ai-template-toggle:disabled,

        .dk-ai-clear-chat:disabled,

        .dk-ai-end-conversation:disabled {

          opacity: 0.2;

          cursor: default !important;

        }



        .dk-ai-input-wrap {

          display: flex;

          align-items: flex-end;

          gap: 8px;



          padding: 7px 7px 7px 12px;



          border: 1px solid rgba(255, 255, 255, 0.2) !important;

          border-radius: 17px !important;

          background: rgba(255, 255, 255, 0.07) !important;

        }



        .dk-ai-mic {
          all: unset;
          width: 34px;
          height: 34px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 12px !important;
          background: rgba(255, 255, 255, 0.055) !important;
          color: #dff5ff !important;
          cursor: pointer !important;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .dk-ai-mic:hover {
          background: rgba(125, 211, 252, 0.12) !important;
          border-color: rgba(125, 211, 252, 0.32) !important;
          transform: translateY(-1px);
        }

        .dk-ai-mic:active {
          transform: scale(0.95);
        }

        .dk-ai-mic.listening {
          color: #062b43 !important;
          background: #7dd3fc !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          box-shadow:
            0 0 0 5px rgba(125, 211, 252, 0.08),
            0 5px 18px rgba(125, 211, 252, 0.18);
          animation: dkAiMicPulse 1.5s ease-in-out infinite;
        }

        .dk-ai-mic:disabled {
          opacity: 0.35;
          cursor: default !important;
        }

        @keyframes dkAiMicPulse {
          0%, 100% {
            box-shadow:
              0 0 0 0 rgba(125, 211, 252, 0.16),
              0 5px 18px rgba(125, 211, 252, 0.12);
          }
          50% {
            box-shadow:
              0 0 0 7px rgba(125, 211, 252, 0.045),
              0 5px 22px rgba(125, 211, 252, 0.22);
          }
        }

        .dk-ai-voice-state {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
          color: #e8f8ff;
          font: 600 11px/1 Inter, system-ui, sans-serif;
          letter-spacing: 0.01em;
        }

        .dk-ai-voice-state > span:last-child {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dk-ai-voice-orb {
          width: 7px;
          height: 7px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #7dd3fc;
          box-shadow: 0 0 0 5px rgba(125, 211, 252, 0.08);
          animation: dkAiVoiceOrb 1.2s ease-in-out infinite;
        }

        @keyframes dkAiVoiceOrb {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .dk-ai-voice-stop {
          all: unset;
          width: 34px;
          height: 34px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 12px !important;
          background: #7dd3fc !important;
          color: #062b43 !important;
          cursor: pointer !important;
          box-shadow: 0 5px 16px rgba(125, 211, 252, 0.14);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .dk-ai-voice-stop:hover {
          background: #a5e2fa !important;
          transform: scale(1.03);
        }

        .dk-ai-voice-stop:disabled {
          opacity: 0.55;
          cursor: default !important;
          transform: none;
        }

        .dk-ai-speaker {
          all: unset;
          position: absolute;
          right: 9px;
          bottom: 9px;
          width: 23px;
          height: 23px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(125, 211, 252, 0.18) !important;
          border-radius: 8px !important;
          background: rgba(125, 211, 252, 0.055) !important;
          color: #aee5fb !important;
          cursor: pointer !important;
          opacity: 0.68;
          transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            background 0.2s ease;
        }

        .dk-ai-speaker::after {
          content: attr(data-tooltip);
          position: absolute;
          right: 0;
          bottom: calc(100% + 7px);
          width: max-content;
          max-width: 190px;
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 8px;
          background: rgba(7, 27, 41, 0.92);
          color: #eaf7ff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          font: 500 9px/1.2 Inter, system-ui, sans-serif;
          pointer-events: none;
          opacity: 0;
          transform: translateY(4px) scale(0.97);
          transform-origin: bottom right;
          transition: opacity 0.16s ease, transform 0.16s ease;
          z-index: 20;
        }

        .dk-ai-speaker:hover::after,
        .dk-ai-speaker:focus-visible::after,
        .dk-ai-speaker.show-hint::after {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .dk-ai-speaker:hover {
          opacity: 1;
          background: rgba(125, 211, 252, 0.12) !important;
          transform: translateY(-1px);
        }

        .dk-ai-speaker.speaking {
          opacity: 1;
          color: #062b43 !important;
          background: #7dd3fc !important;
          animation: dkAiSpeakerPulse 1s ease-in-out infinite;
        }

        @keyframes dkAiSpeakerPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        .dk-ai-input {

          all: unset;



          flex: 1;

          min-width: 0;

          max-height: 80px;



          resize: none;



          background: transparent !important;

          color: #f4fbff !important;



          font: 12px/1.5 Inter, system-ui, sans-serif !important;

        }



        .dk-ai-input::placeholder {

          color: #dceef7 !important;

          opacity: 0.46;

        }



        .dk-ai-send {

          all: unset;



          width: 34px;

          height: 34px;

          flex: 0 0 auto;



          display: grid;

          place-items: center;



          border: 0 !important;

          border-radius: 12px !important;



          background: #7dd3fc !important;

          color: #062b43 !important;



          cursor: pointer !important;

        }



        .dk-ai-send:hover {

          background: #a5e2fa !important;

        }



        .dk-ai-send:disabled {

          opacity: 0.35;

          cursor: default !important;

        }



        .dk-ai-note {

          margin: 7px 2px 0;

          text-align: center;

          color: #d7ebf5;



          font: 9px/1.2 Inter, system-ui, sans-serif;

          opacity: 0.4;

        }



        /* =========================

           MOBILE

           ========================= */



        @media (max-width: 640px) {

          /* Mobile B.L.U.E. launcher — nav-like width, but thinner. */

          .dk-ai-launcher {

            left: max(14px, env(safe-area-inset-left)) !important;

            right: max(14px, env(safe-area-inset-right)) !important;

            bottom: max(10px, env(safe-area-inset-bottom)) !important;



            width: auto !important;

            min-width: 0 !important;

            min-height: 28px !important;

            height: 28px !important;

            padding: 2px 12px !important;



            gap: 6px;

            border-radius: 999px !important;

            /* Subtle floating separation from the mobile background. */
            border: 1px solid rgba(255, 255, 255, 0.24) !important;
            box-shadow:
              0 5px 16px rgba(0, 0, 0, 0.16),
              0 1px 4px rgba(0, 0, 0, 0.10),
              inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
            backdrop-filter: blur(20px) saturate(145%);
            -webkit-backdrop-filter: blur(20px) saturate(145%);

          }



          .dk-ai-launcher-icon {

            width: 19px;

            height: 19px;

          }



          .dk-ai-launcher-label {

            font-size: 9px !important;

          }



          /* Crystal Ice mobile: liquid-glass treatment matching

             the portfolio's Get in touch / Send message control. */

          .dk-ai-launcher.dk-ai-crystal-mobile {

            /* Same dimensions as the current mobile launcher.

               Only the visual treatment changes to match the supplied pill. */

            border: 1px solid rgba(255, 255, 255, 0.82) !important;

            background:

              radial-gradient(

                circle at 28% 0%,

                rgba(255, 255, 255, 0.78),

                transparent 48%

              ),

              linear-gradient(

                180deg,

                rgba(247, 252, 255, 0.92),

                rgba(218, 232, 239, 0.78)

              ) !important;

            color: #173c5c !important;

            box-shadow:

              0 9px 18px rgba(41, 63, 76, 0.18),

              0 2px 5px rgba(41, 63, 76, 0.08),

              inset 0 1px 0 rgba(255, 255, 255, 0.95),

              inset 0 -1px 0 rgba(255, 255, 255, 0.48) !important;

            backdrop-filter: blur(24px) saturate(135%);

            -webkit-backdrop-filter: blur(24px) saturate(135%);

          }



          .dk-ai-launcher.dk-ai-crystal-mobile .dk-ai-launcher-icon {

            background: rgba(255, 255, 255, 0.30);

            color: #173c5c;

            box-shadow:

              inset 0 1px 0 rgba(255, 255, 255, 0.88),

              0 2px 7px rgba(41, 63, 76, 0.08);

          }



          .dk-ai-launcher.dk-ai-crystal-mobile .dk-ai-launcher-label {

            color: #173c5c !important;

            text-shadow: 0 1px 0 rgba(255, 255, 255, 0.65);

          }



          .dk-ai-panel {

            top: max(10px, env(safe-area-inset-top)) !important;

            right: max(10px, env(safe-area-inset-right)) !important;

            bottom: max(10px, env(safe-area-inset-bottom)) !important;

            left: max(10px, env(safe-area-inset-left)) !important;



            width: auto !important;

            height: auto !important;

            max-height: none !important;

            min-height: 0 !important;



            border-radius: 22px !important;

          }



          .dk-ai-header {

            flex: 0 0 auto;

            padding: 14px 13px 12px;

          }



          .dk-ai-title-wrap {

            gap: 9px;

          }



          .dk-ai-avatar {

            width: 36px;

            height: 36px;

            border-radius: 12px;

          }



          .dk-ai-title {

            font-size: 13px;

          }



          .dk-ai-status {

            max-width: calc(100vw - 135px);

            font-size: 9px;

            line-height: 1.25;

          }



          .dk-ai-close {

            width: 33px;

            height: 33px;

          }



          .dk-ai-body {

            padding: 13px 12px;

            overscroll-behavior: contain;

            -webkit-overflow-scrolling: touch;

          }



          .dk-ai-message {

            max-width: 91%;

            padding: 10px 11px;

            font-size: 11.5px;

            line-height: 1.5;

          }



          .dk-ai-quick {

            gap: 6px;

            margin-top: 10px;

            margin-bottom: 12px;

          }



          .dk-ai-quick button {

            max-width: 100%;

            padding: 7px 9px;

            font-size: 9.5px !important;

            line-height: 1.25 !important;

            white-space: normal;

            text-align: center;

          }



          .dk-ai-footer {

            flex: 0 0 auto;

            padding: 9px;

            padding-bottom: max(9px, env(safe-area-inset-bottom));

          }



          .dk-ai-chat-actions {

            gap: 5px;

          }



          .dk-ai-chat-actions button {

            min-width: 0;

            padding: 6px 5px;

            font-size: 8px !important;

            letter-spacing: 0.01em;

          }



          .dk-ai-input-wrap {

            min-height: 48px;

            padding: 6px 6px 6px 11px;

            border-radius: 15px !important;

          }
          .dk-ai-mic {
            width: 34px;
            height: 34px;
            border-radius: 11px !important;
          }

          .dk-ai-voice-stop {
            width: 34px;
            height: 34px;
            border-radius: 11px !important;
          }

          .dk-ai-voice-state {
            font-size: 10px;
          }

          .dk-ai-speaker {
            width: 22px;
            height: 22px;
          }





          .dk-ai-input {

            font-size: 11.5px !important;

            line-height: 1.4;

          }



          .dk-ai-send {

            width: 34px;

            height: 34px;

            border-radius: 11px !important;

          }



          .dk-ai-note {

            font-size: 8px;

            margin-top: 6px;

          }

        }



        /* Small phones */

        @media (max-width: 380px) {

          .dk-ai-launcher {

            left: max(12px, env(safe-area-inset-left)) !important;

            right: max(12px, env(safe-area-inset-right)) !important;

            bottom: max(8px, env(safe-area-inset-bottom)) !important;



            min-width: 0 !important;

            min-height: 26px !important;

            height: 26px !important;

            padding: 2px 10px !important;

          }



          .dk-ai-launcher-icon {

            width: 18px;

            height: 18px;

          }



          .dk-ai-panel {

            border-radius: 19px !important;

          }



          .dk-ai-header {

            padding-left: 11px;

            padding-right: 11px;

          }



          .dk-ai-status {

            max-width: calc(100vw - 125px);

            font-size: 8.5px;

          }



          .dk-ai-quick button {

            font-size: 9px !important;

            padding: 6px 8px;

          }



          .dk-ai-chat-actions button {

            font-size: 7.5px !important;

          }

        }



        /* Short mobile screens / landscape */

        @media (max-width: 640px) and (max-height: 600px) {

          .dk-ai-panel {

            top: 8px !important;

            bottom: 8px !important;

          }



          .dk-ai-header {

            padding-top: 9px;

            padding-bottom: 8px;

          }



          .dk-ai-body {

            padding-top: 9px;

            padding-bottom: 9px;

          }



          .dk-ai-footer {

            padding-top: 7px;

          }



          .dk-ai-note {

            display: none;

          }

        }

      `}</style>



      {!open && (

        <button

          type="button"

          className={`dk-ai-launcher ${

            isCrystalIce ? "dk-ai-crystal-mobile" : ""

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

          className={`dk-ai-panel ${

            isPageScrolling ? "dk-ai-scroll-hidden" : ""

          }`}

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

              onClick={() => setOpen(false)}

              aria-label="Close B.L.U.E. assistant"

            >

              <X size={16} />

            </button>

          </header>



          <div

            ref={messagesRef}

            className="dk-ai-body"

          >

            {messages.map((message, messageIndex) => {

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
                              ? "Stop speaking"
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



  return createPortal(assistantUI, document.body);

}
