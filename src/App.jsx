import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import Matter from "matter-js";
import * as faceapi from "face-api.js";
import { BloomEffect, ChromaticAberrationEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import {
  Menu,
  X,
  Sun,
  Moon,
  Mail,
  UserRound,
  BriefcaseBusiness,
  FolderKanban,
  Camera,
  Phone,
  FileText,
  MapPin,
  ExternalLink,
  GraduationCap,
  Award,
  Video,
} from "lucide-react";

/* ============================================================
   EDIT ME
   ============================================================ */

const CONTENT = {
  name: "Deepshik Kodam",
  initials: "DK",

  role: "Data Engineer · Developer · Designer",
  roleCompany: null,

  tagline:
    "Building scalable data platforms, applications & digital experiences with Snowflake, SQL, Python & design.",

  bio: [
    {
      text:
        "Computer Science graduate (B.Tech, Data Science) based in Hyderabad, India. I work across ",
    },
    {
      text: "data engineering, software development, UI/UX design, and web development ",
      strong: true,
    },
    {
      text:
        " , combining analytical thinking with technical and creative problem-solving. From building scalable data platforms and applications to designing clean, intuitive digital experiences, Experienced with ",
    },
    {
      text: "Snowflake, SQL, Python, Talend, Figma, React and Tableau",
      strong: true,
    },
    {
      text:
        " , with a strong interest in transforming ideas into reliable, functional, and visually engaging solutions.",
    },
  ],

  location: "Hyderabad, India",

  photoCaption: "me_01.jpeg",
  photoUrl: "/me_01.jpeg",

  resumeUrl: "/Deepshik_s_Resume_DATA_ENGINEER.docx.pdf",

  socials: [
    {
      label: "GitHub",
      icon: ExternalLink,
      url: "https://github.com/just-deepshik",
    },
    {
      label: "LinkedIn",
      icon: ExternalLink,
      url: "https://www.linkedin.com/in/deepshik-kodam/",
    },
    {
      label: "Email",
      icon: Mail,
      url: "mailto:deepshikkodam@gmail.com",
    },
        {
      label: "Instagram",
      icon: ExternalLink,
      url: "https://www.instagram.com/just.deepshik?stkn=MW5lYWxvazlxYjVtYw%3D%3D&utm_source=qr",
    },
    {
      label: "Twitter",
      icon: ExternalLink,
      url: "https://x.com/just_deepshik",
    },
    {
      label: "Phone",
      icon: Phone,
      url: "tel:+918374831773",
    },
  ],

  /* ABOUT */

  storyParagraphs: [
    "It started with curiosity — wanting to understand not just how things work, but how they could work better. During my Computer Science journey, that curiosity led me across data engineering, software & web development, and UI/UX design, where I found myself equally drawn to solving technical problems and creating meaningful digital experiences.",

    "I've worked on building a Snowflake-based data platform, designing ETL pipelines with Talend, SQL, and Python, and turning raw, inconsistent data into reliable insights through Tableau. Along the way, I've also explored software development through a computer vision application and worked on a machine learning project focused on IoT security that evolved into a published research paper.",

    "Today, I enjoy working at the intersection of data, technology, and design — whether that's building reliable data systems, developing applications, or designing clean and intuitive experiences. I'm still learning, still experimenting, and always looking for better ways to turn ideas into something useful.",
  ],

storyTldr: [
  "Got hooked on data while cleaning up a messy dataset in college.",

  "Built a full ETL pipeline (Talend → Snowflake) and saw the impact firsthand.",

  "Interned as a Data Science Intern, shipping a computer vision web app.",

  "Published a research paper on explainable ML for IoT security (ICT4SD 2026).",

  "Exploring the intersection of data, development, and design to build useful digital experiences.",

  "Currently deepening my Snowflake & data engineering skills through their Hands-On Essentials series.",
],

timeline: [
  {
    year: "2022",
    label:
      "Started B.Tech in Computer Science & Engineering (Data Science)",
  },
  {
    year: "2023",
    label:
      "Won 'Best Young Filmmaker' & 'Best Short Film' —  Sony Cinematica Expo",
  },
  {
    year: "2024",
    label:
      "Built projects across Python, SQL, data engineering & software development",
  },
  {
    year: "2025",
    label:
      "Data Science Intern at EvoAstra Ventures — shipped Captionize, a computer vision web app",
  },
  {
    year: "2026",
    label:
      "Paper accepted at ICT4SD 2026 (Springer Nature proceedings)",
  },
  {
    year: "2026",
    label:
      "Graduated — deepening Snowflake & data engineering skills while exploring development and design",
  },
  
],

  /* PHOTO COLLAGE */

  photoCollage: [
    {
      url: "/Graduation_day.jpeg",
      caption: "Graduation day, final year",
    },
        {
      url: "/tedex.jpeg",
      caption: "TEDx talk,@2026",
    },
    {
      url: "/first_hackathon.jpeg",
      caption: "Hackathon,@2025",
    },
    {
      url:"/friends.jpeg" ,
      caption: "The OG's ",
    },
    {
      url: "/weekend_build.jpeg",
      caption: "Weekend build session",
    },
         {
      url: "/cinematica.jpeg",
      caption: "Shortfilm Awards 2023 ",
    },
  ],

  /* NARRATIVE */

 narrativeOne: {
  headline: "Sometimes, I zoom out.",
  subtext:
    "I like stepping back, seeing the bigger picture, and bringing data, code, and design together to build things that work.",
},
 narrativeTwo: {
  headline: "Then I bring it back down.",
  subhead: "And keep it simple.",
  subtext:
    "Good work doesn't need to be complicated. Whether it's a data platform, an application, or a digital experience, I believe the best solutions are reliable, intuitive, and effortless to use.",
},

  /* PHOTOGRAPHY */

  showPhotography: true,

  photographyHeading:
    "And outside of data, I love Photography...",

  photography: [
    "leaf.jpeg",
    "art.jpeg",
    "expo.jpeg",
    "car.jpeg",
    "hyd.jpeg",
    "habibo.jpeg",
    
  ],

  /* VIDEO & AUDIO EDITS */
  // Add videos just like the photography list.
  // Use captionPosition: "below" for text under the media,
  // or captionPosition: "overlay" for text over the media.
  videoEdits: [
    {
      url: "edit-01.mp4",
      caption: "The Weeknd - Hajime Sorayama",
      captionPosition: "below"
    },
     {
      url: "edit-07.mp4",
      caption: "Blade Runner 2049",
      captionPosition: "below"
    },
     {
      url: "edit-04.mp4",
      caption: "Babylon Brewery & Club",
      captionPosition: "below"
    },
     {
      url: "edit-02.mp4",
      caption: "Project Hail Mary",
      captionPosition: "below"
    },



        {
      url: "edit-03.mp4",
      caption: "Project Hail Mary",
      captionPosition: "below"
    },
             {
      url: "edit-10.mp4",
      caption: "DAWN FM",
      captionPosition: "below"
    },
         {
      url: "edit-06.mp4",
      caption: "The Weeknd - Evan Larsen",
      captionPosition: "below"
    },

     {
      url: "edit-05.mp4",
      caption: "Behind The Scenes",
      captionPosition: "below"
    },
            {
      url: "edit-09.mp4",
      caption: "Matthew McConaughey",
      captionPosition: "below"
    },
    // 
    //   url: "edit-02.mp4",
    //   caption: "Your video caption here",
    //   captionPosition: "overlay",
    // },
  ],

  /* EXPERIENCE */

  experience: [
    {
      company: "EvoAstra Ventures Pvt. Ltd.",
      role: "Data Science Intern",
      period: "Jul 2025 — Aug 2025 · Hyderabad",
      description:
        "Designed and deployed an end-to-end computer vision web app (Captionize) to generate automated text descriptions from images. Structured and validated data ingestion pipelines for unstructured image data and flat files, and built a real-time upload + caption display interface.",
        
    },
  ],

  /* PROJECTS */

  projects: [
    {
      name: "Beyond Accuracy: Robust & Explainable IoT IDS",
      tag: "Research Paper · Accepted · Presented · Deployed",
      description:
        "Built a machine learning model to detect cyber-attacks in IoT network traffic, trained and evaluated on the TON-IoT and BoT-IoT datasets. Used SHAP for model explainability. Paper presented at ICT4SD 2026 and accepted for publication in ICT Analysis and Applications, Vol. 9 (Springer Nature).",
      url: "https://github.com/just-deepshik/beyond-accuracy-iot-ids",
    },
    {
      name: "CAC-Data-Engineering-and-Analytics-Platform",
      tag: "Data Engineering Pipeline · Talend ETL · Snowflake · SQL · Python · Tableau",
      description:
      "Built an end-to-end Customer Acquisition Cost (CAC) data engineering pipeline using Talend, Snowflake, SQL, Python, and Tableau. Automated data ingestion and validation from CSV, transformed data through RAW, STAGING, and ANALYTICS layers in Snowflake, and delivered interactive Tableau dashboards for business insights.",
        
      url: "https://github.com/just-deepshik/CAC-Data-Engineering-and-Analytics-Platform",
    },
    {
      name: "Captionize",
      tag: "Automatic Image Caption Generator with Attention-Internship Project",
      description:
        "A deep learning project that generates captions for images automatically. It combines Computer Vision (CNN) and Natural Language Processing (RNN + Attention) to describe what is in an image using natural language.",
      url: "https://github.com/just-deepshik/Captionize",
    },
    {
      name: "NAV-Aisle Superstore",
      tag: "Personal project",
      description:
        "A web-based 3D indoor navigation system for retail stores to optimize product discovery, with search indexing and route optimization for shortest paths through store aisles.",
      url: "#",
    },
  ],

  /* SKILLS */

  skills: [
    "Python",
    "SQL",
    "C",
    "Pandas",
    "NumPy",
    "Snowflake",
    "MySQL",
    "Firebase",
    "ETL Pipeline Development",
    "Data Modeling",
    "Data Validation",
    "ETL Testing",
    "Talend",
    "Tableau",
    "Git",
    "GitHub",
    "Flask",
    "React",
  ],

  /* EDUCATION */

  education: [
    {
      school: "CMR College of Engineering & Technology",
      degree:
        "B.Tech, Computer Science & Engineering (Data Science)",
      period: "2022 — 2026",
    },
  ],

  /* CERTIFICATIONS */

certifications: [
  {
    title: "Snowflake Hands-On Essentials: Data Warehousing Workshop (Aug 2026) 🔗",
    link: "https://achieve.snowflake.com/e4a90303-36a7-465e-82c9-bdb0065693c9#acc.cuDavYE6",
  },
    {
    title: "AI Advanced — Python, Machine Learning, Deep Learning, Neural Networks (Hexart.In)",
    link: "",
  },
  {
    title: "Snowflake Hands-On Essentials: Collaboration, Marketplace & Cost Estimation Workshop 🔗",
    link: "https://achieve.snowflake.com/e49ee574-b498-4786-99c0-4cad28fd250f#acc.tJuGq6A4",
  },

],

achievements: [
{
  title: 'Awarded "Best Young Filmmaker" at the Sony Cinematica Expo 2023.',
},
{
  title: 'Won “Best Short Film” at an event organized by the Clicktalks Film Club',
},
  {
    title: "Special Mention — Techknowthon '24",
  },
  {
    title: "Participant — MAD Future Tech Expo 2.0 (VIT-AP)",
  },
],

  /* QUOTES */

  quotes: [
    {
    text:
      "The most valuable commodity I know of is information.",
    author: "Gordon Gekko",
    },
      {
    text:
      "Data-driven decision-making is not about replacing human judgment. It is about making that judgment better informed.",
    author: "Unknown",
    },
    {
      text: "In God we trust. All others must bring data.",
      author: "W. Edwards Deming",
    },
      {
    text: "Your first 10,000 photographs are your worst.",
    author: "Henri Cartier-Bresson",
      },
    {
      text:
        "Without data, you're just another person with an opinion.",
      author: "W. Edwards Deming",
    },
    {
      text:
        "The goal is to turn data into information, and information into insight.",
      author: "Carly Fiorina",
    },
  ],
};

/* ============================================================
   NAVIGATION
   ============================================================ */

const NAV_LINKS = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Experience",
    href: "#experience",
  },
  {
    label: "Work",
    href: "#work",
  },
  ...(CONTENT.showPhotography
    ? [
        {
          label: "Creative",
          href: "#creative",
        },
      ]
    : []),
];

/* ============================================================
   CLOCK
   ============================================================ */

function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000 * 30);

    return () => clearInterval(id);
  }, []);

  return now;
}

/* ============================================================
   TIME GREETING
   ============================================================ */

function greeting(hour) {
  if (hour < 5) {
    return "Burning the midnight oil? Hope it's going well.";
  }

  if (hour < 12) {
    return "Good morning! Hope your day is off to a good start.";
  }

  if (hour < 17) {
    return "Good afternoon! Hope your day is going great.";
  }

  if (hour < 21) {
    return "Good evening! Thanks for stopping by.";
  }

  return "Late one, huh? Thanks for stopping by.";
}

/* ============================================================
   MOBILE HOOK
   ============================================================ */

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < breakpoint
      : false
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [breakpoint]);

  return isMobile;
}

/* ============================================================
   SPECULAR BUTTON
   ============================================================ */

const SPECULAR_PAD = 20;

const SPECULAR_VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const SPECULAR_FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

function SpecularButton({
  children = "Get Started",
  size = "md",
  radius = 18,
  tint = "#ffffff",
  tintOpacity = 0,
  blur = 0,
  textColor = "#f5f5f5",
  lineColor = "#ffffff",
  baseColor = "#525252",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = "",
  type = "button",
}) {
  const btnRef = useRef(null);
  const fxRef = useRef(null);
  const propsRef = useRef({});

  propsRef.current = {
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  };

  useEffect(() => {
    const btn = btnRef.current;
    const fx = fxRef.current;
    if (!btn || !fx) return;

    const dpr = window.devicePixelRatio || 1;
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: SPECULAR_VERT,
      fragment: SPECULAR_FRAG,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: 0 },
        uAngle: { value: 2.4 },
        uPx: { value: dpr },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [0.32, 0.32, 0.32] },
        uIntensity: { value: 1 },
        uShineSize: { value: 0.17 },
        uShineFade: { value: 0.7 },
        uThickness: { value: 1 },
        uBaseWidth: { value: dpr },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    fx.appendChild(gl.canvas);

    const sizeRef = { w: 1, h: 1 };
    const resize = () => {
      const rect = btn.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      sizeRef.w = w;
      sizeRef.h = h;
      renderer.setSize(w + SPECULAR_PAD * 2, h + SPECULAR_PAD * 2);
      program.uniforms.uCenter.value = [
        (SPECULAR_PAD + w / 2) * dpr,
        (SPECULAR_PAD + h / 2) * dpr,
      ];
      program.uniforms.uHalfSize.value = [
        (w / 2) * dpr,
        (h / 2) * dpr,
      ];
    };

    const ro = new ResizeObserver(resize);
    ro.observe(btn);
    resize();

    let pointerAngle = null;
    let proximityT = 0;

    const onPointerMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      if (dist === 0) {
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (cy - e.clientY) / (rect.height / 2);
        pointerAngle =
          Math.atan2(2 / rect.height, -2 / rect.width) +
          nx * 0.3 +
          ny * 0.15;
      } else {
        pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
      }

      const t = Math.max(
        0,
        1 - dist / Math.max(propsRef.current.proximity, 1)
      );
      proximityT = t * t * (3 - 2 * t);
    };

    window.addEventListener("pointermove", onPointerMove);

    let angle = 2.4;
    let idleAngle = 2.4;
    let bright = 0;
    let last = performance.now();
    let raf = 0;

    const lineC = new Color();
    const baseC = new Color();

    const update = (now) => {
      raf = requestAnimationFrame(update);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const p = propsRef.current;

      idleAngle += p.speed * dt;
      const steer =
        p.followMouse &&
        pointerAngle != null &&
        (!p.autoAnimate || proximityT > 0);
      const target = steer ? pointerAngle : idleAngle;
      const diff =
        ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += diff * (1 - Math.exp(-dt * 7));

      const brightTarget = p.autoAnimate ? 1 : proximityT;
      bright +=
        (brightTarget - bright) * (1 - Math.exp(-dt * 8));

      lineC.set(p.lineColor);
      baseC.set(p.baseColor);
      program.uniforms.uAngle.value = angle;
      program.uniforms.uRadius.value =
        Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr;
      program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b];
      program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b];
      program.uniforms.uIntensity.value = p.intensity * bright;
      program.uniforms.uShineSize.value =
        (p.shineSize * Math.PI) / 180;
      program.uniforms.uShineFade.value =
        (p.shineFade * Math.PI) / 180;
      program.uniforms.uThickness.value = p.thickness * dpr;
      renderer.render({ scene: mesh });
    };

    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (gl.canvas.parentNode === fx) {
        fx.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ""}`}
      style={{
        "--sb-radius": `${radius}px`,
        "--sb-tint": tint,
        "--sb-tint-opacity": tintOpacity,
        "--sb-blur": `${blur}px`,
        "--sb-text-color": textColor,
      }}
    >
      <span
        ref={fxRef}
        className="specular-button__fx"
        aria-hidden="true"
      />
      <span className="specular-button__label">{children}</span>
    </button>
  );
}

const MAX_COLORS = 8;

const hexToRGB = hex => {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const prepColors = input => {
  const base = (input && input.length ? input : ['#A6C8FF', '#5227FF', '#FF9FFC']).slice(0, MAX_COLORS);
  const count = base.length;
  const arr = [];
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
  const avg = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0];
    avg[1] += arr[i][1];
    avg[2] += arr[i][2];
  }
  avg[0] /= count;
  avg[1] /= count;
  avg[2] /= count;
  return { arr, count, avg };
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uBgColor;
uniform vec3  uMouseColor;
uniform float uSpeed;
uniform int   uStreakCount;
uniform float uStreakWidth;
uniform float uStreakLength;
uniform float uGlow;
uniform float uDensity;
uniform float uTwinkle;
uniform float uZoom;
uniform float uBgGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uLightMode;

varying vec2 vUv;

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}

vec2 sceneC(vec2 frag, vec2 r) {
  vec2 P = (frag + frag - r) / r.x;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < 39; k++) {
    if (d <= 1e-4) break;
    O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(length(O * O));
    z += d;
  }
  return vec2(O.x, atan(O.z, O.y));
}

void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;
  vec2 uv0 = (C + C - r) / r.x;
  float T = 0.1 * iTime * uSpeed + 9.0;
  float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
  vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

  vec2 c0 = sceneC(C, r);
  vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
  vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
  vec2 dCx = cdx - c0;
  vec2 dCy = cdy - c0;
  dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
  dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
  vec2 fw = abs(dCx) + abs(dCy);
  C = c0;

  vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
  vec4 O = uLightMode > 0.5
    ? vec4(0.0)
    : vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / r.x;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
    O.rgb += uMouseColor * mGlow * 0.25;
  }

  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);

  for (int m = 0; m < 16; m++) {
    if (m >= uStreakCount) break;
    float jf = float(m) + 1.0;
    float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
    Pp -= floor(Pp / Y + 0.5) * Y;
    float h = fract(8663.0 * ic);
    vec3 col = palette(h);
    float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
    weight *= (1.0 + mGlow * 2.0);
    vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
    vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
    O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
    C.x += Y.x / 8.0;
  }

  vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
if (uLightMode > 0.5) {
  float peak = max(colr.r, max(colr.g, colr.b));
  float coverage = smoothstep(0.035, 0.58, peak) * uOpacity;
  vec3 chroma = clamp(colr / max(peak, 1e-4), 0.0, 1.0);
  chroma = pow(chroma, vec3(1.35));
  float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
  chroma /= max(chromaPeak, 1e-4);
  o = vec4(mix(vec3(1.0), chroma, coverage * 0.94), 1.0);
} else {
    o = vec4(colr, uOpacity);
  }
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

const Lightfall = ({
  className,
  dpr,
  paused = false,
  colors = ['#A6C8FF', '#5227FF', '#1451b7'],
  backgroundColor = '#0A29FF',
  speed = 0.5,
  streakCount = 2,
  streakWidth = 1,
  streakLength = 1,
  glow = 1,
  density = 0.6,
  twinkle = 1,
  zoom = 3,
  backgroundGlow = 0.5,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 0.5,
  mouseRadius = 1,
  mouseDampening = 0.15,
  lightMode = false,
  mixBlendMode
}) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const geometryRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseTargetRef = useRef([0, 0]);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
      alpha: true,
      antialias: true
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const { arr, count, avg } = prepColors(colors);

    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uColor0: { value: arr[0] },
      uColor1: { value: arr[1] },
      uColor2: { value: arr[2] },
      uColor3: { value: arr[3] },
      uColor4: { value: arr[4] },
      uColor5: { value: arr[5] },
      uColor6: { value: arr[6] },
      uColor7: { value: arr[7] },
      uColorCount: { value: count },
      uBgColor: { value: hexToRGB(backgroundColor) },
      uMouseColor: { value: avg },
      uSpeed: { value: speed },
      uStreakCount: { value: Math.max(1, Math.min(16, Math.round(streakCount))) },
      uStreakWidth: { value: streakWidth },
      uStreakLength: { value: streakLength },
      uGlow: { value: glow },
      uDensity: { value: density },
      uTwinkle: { value: twinkle },
      uZoom: { value: zoom },
      uBgGlow: { value: backgroundGlow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius },
      uLightMode: { value: lightMode ? 1 : 0 }
    };

    const program = new Program(gl, { vertex, fragment, uniforms });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = e => {
      const rect = canvas.getBoundingClientRect();
      const scale = renderer.dpr || 1;
      const x = (e.clientX - rect.left) * scale;
      const y = (rect.height - (e.clientY - rect.top)) * scale;
      mouseTargetRef.current = [x, y];
      if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    if (mouseInteraction) {
      canvas.addEventListener('pointermove', onPointerMove);
    }

    const loop = t => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;
      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value;
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }
      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mouseInteraction) canvas.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj, key) => {
        if (obj && typeof obj[key] === 'function') {
          obj[key].call(obj);
        }
      };
      callIfFn(programRef.current, 'remove');
      callIfFn(geometryRef.current, 'remove');
      callIfFn(meshRef.current, 'remove');
      callIfFn(rendererRef.current, 'destroy');
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr,
    paused,
    colors,
    backgroundColor,
    speed,
    streakCount,
    streakWidth,
    streakLength,
    glow,
    density,
    twinkle,
    zoom,
    backgroundGlow,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    mouseDampening,
    lightMode
  ]);

  return (
    <div
      ref={containerRef}
      className={`lightfall-container ${className ?? ''}`}
      style={{
        ...(mixBlendMode && { mixBlendMode })
      }}
    />
  );
};

/* ============================================================
   PORTFOLIO
   ============================================================ */


/* ============================================================
   INTERACTIVE POLAROID CAMERA
   ============================================================ */

function PolaroidCamera({ isMobile }) {
  const [stage, setStage] = useState("camera");
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedAt, setCapturedAt] = useState(null);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCameraFlow = () => {
    setCameraError("");
    setStage("access");
  };

  const requestCameraAccess = async () => {
    setCameraError("");

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraError(
        "Camera access is not supported by this browser."
      );
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
          audio: false,
        });

      streamRef.current = stream;
      setStage("live");
    } catch (error) {
      if (error?.name === "NotAllowedError") {
        setCameraError(
          "Camera permission was denied. Allow camera access in your browser and try again."
        );
      } else if (error?.name === "NotFoundError") {
        setCameraError(
          "No camera was found on this device."
        );
      } else {
        setCameraError(
          "We couldn't access your camera. Please try again."
        );
      }
    }
  };

  useEffect(() => {
    if (
      stage !== "live" ||
      !streamRef.current ||
      !videoRef.current
    ) {
      return;
    }

    const video = videoRef.current;
    video.srcObject = streamRef.current;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // The browser may delay playback until interaction.
      }
    };

    playVideo();

    return () => {
      if (stage !== "live") {
        stopCamera();
      }
    };
  }, [stage]);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) {
      return;
    }

    const size = Math.min(
      video.videoWidth,
      video.videoHeight
    );

    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");

    const sourceX =
      (video.videoWidth - size) / 2;
    const sourceY =
      (video.videoHeight - size) / 2;

    // Mirror the captured selfie to match the live preview.
    context.save();
    context.translate(size, 0);
    context.scale(-1, 1);

    context.drawImage(
      video,
      sourceX,
      sourceY,
      size,
      size,
      0,
      0,
      size,
      size
    );

    context.restore();

    const image = canvas.toDataURL(
      "image/jpeg",
      0.92
    );

    setCapturedImage(image);
    setCapturedAt(new Date());
    stopCamera();
    setStage("result");
  };

  const retake = () => {
    setCapturedImage(null);
    setCapturedAt(null);
    setCameraError("");
    setStage("access");
  };

  const closeCamera = () => {
    stopCamera();
    setCameraError("");
    setStage("camera");
  };

  const downloadPhoto = () => {
    if (!capturedImage) return;

    const link = document.createElement("a");
    link.href = capturedImage;
    link.download =
      `deepshik-polaroid-${Date.now()}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const formattedDate = capturedAt
    ? capturedAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedTime = capturedAt
    ? capturedAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className="polaroid-camera-wrap"
      style={{
        width: "100%",
        maxWidth: isMobile ? 350 : 560,
        margin: "0 auto",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      {/* ----------------------------------------------------
          CAMERA BODY
          ---------------------------------------------------- */}

      {stage === "camera" && (
        <div
          className="reference-polaroid-camera"
          aria-label="Photorealistic illustration of a Polaroid camera"
        >
          <div className="reference-camera-top">
            <div className="reference-camera-flash" />
            <div className="reference-camera-timer" />
            <div className="reference-camera-sensor" />

            <button
              type="button"
              className="reference-camera-lens is-clickable"
              onClick={startCameraFlow}
              aria-label="Start camera"
            >
              <div className="reference-camera-glass">
                <div className="reference-lens-label">
                  <Camera
                    size={26}
                    strokeWidth={1.5}
                  />
                  <span>TAP LENS</span>
                </div>
              </div>
            </button>

            <button
              type="button"
              className="reference-camera-shutter disabled"
              disabled
              aria-label="Take photo"
            >
              <span className="reference-shutter-label">
                Click
              </span>
            </button>

            <div className="reference-camera-viewfinder">
              <div className="reference-camera-glass">
                <div className="reference-viewfinder-back" />
              </div>
            </div>

            <div className="reference-camera-toggle-container">
              <div className="reference-camera-toggle" />
            </div>

            <div className="reference-camera-power" />
          </div>

          <div className="reference-camera-bottom">
            <div className="reference-bottom-toggle-container">
              <div className="reference-bottom-toggle">
                <div className="reference-bottom-handle" />
              </div>
            </div>

            <div className="reference-camera-printer" />
            <div className="reference-print-track" />

            <div className="reference-camera-labels">
              <div className="reference-camera-rainbow">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>

              <div className="reference-camera-logo">
                Polaroid
              </div>

              <div className="reference-camera-type" />
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          CAMERA ACCESS
          ---------------------------------------------------- */}

      {stage === "access" && (
        <div className="polaroid-access-card">
          <button
            type="button"
            className="polaroid-close-button"
            onClick={closeCamera}
            aria-label="Close camera"
          >
            <X size={18} />
          </button>

          <div className="polaroid-access-icon">
            <Camera size={27} />
          </div>

          <h3>Camera access</h3>

          <p>
            Allow camera access to take your
            Polaroid photo.
          </p>

          {cameraError && (
            <div className="polaroid-camera-error">
              {cameraError}
            </div>
          )}

          <button
            type="button"
            className="polaroid-primary-button"
            onClick={requestCameraAccess}
          >
            Allow Camera Access
          </button>

          <button
            type="button"
            className="polaroid-secondary-button"
            onClick={closeCamera}
          >
            Not now
          </button>
        </div>
      )}

      {/* ----------------------------------------------------
          LIVE CAMERA
          ---------------------------------------------------- */}

      {stage === "live" && (
        <div className="polaroid-live-card">
          <div className="polaroid-live-header">
            <span>Polaroid Camera</span>

            <button
              type="button"
              onClick={closeCamera}
              aria-label="Close camera"
            >
              <X size={18} />
            </button>
          </div>

          <div className="polaroid-live-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="polaroid-live-video"
            />

            <div className="polaroid-focus-frame" />
          </div>

          <button
            type="button"
            className="polaroid-live-shutter"
            onClick={takePhoto}
          >
            <span />
            Tap to Click
          </button>
        </div>
      )}

      {/* ----------------------------------------------------
          CAPTURED POLAROID
          ---------------------------------------------------- */}

      {stage === "result" && capturedImage && (
        <div className="polaroid-result-wrap">
          <div className="captured-polaroid">
            <div className="captured-polaroid-image">
              <img
                src={capturedImage}
                alt="Captured Polaroid"
              />
            </div>

            <div className="captured-polaroid-date">
              {formattedDate} · {formattedTime}
            </div>
          </div>

          <div className="polaroid-result-actions">
            <button
              type="button"
              className="polaroid-retake"
              onClick={retake}
            >
              Retake
            </button>

            <button
              type="button"
              className="polaroid-download"
              onClick={downloadPhoto}
            >
              Download ↓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



const { Bodies, Body, Composite, Engine } = Matter;

const DEFAULT_ITEMS = ['Try a warmer palette', 'Tighten the spacing', 'Logo feels small', 'Love the new hero'];
const PAD = 28;
const CHAR = 6.8;
const GAP = 12;
const ROW = 52;
const DRAG_MIN = 4;
const ZONE_PAD = 8;

const jitter = i => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

const layout = (list, spread, lift, tilt, sizes) => {
  const rows = [];
  let row = [];
  let width = 0;
  list.forEach((item, i) => {
    const pw = sizes[i]?.w ?? PAD + item.label.length * CHAR;
    if (row.length && width + GAP + pw > spread * 2) {
      rows.push({ items: row, width });
      row = [];
      width = 0;
    }
    row.push({ i, pw });
    width += (row.length > 1 ? GAP : 0) + pw;
  });
  if (row.length) rows.push({ items: row, width });
  const pos = [];
  rows.forEach((r, ri) => {
    let x = -r.width / 2;
    const shift = (ri % 2 ? 1 : -1) * Math.min(16, spread * 0.1);
    r.items.forEach(({ i, pw }) => {
      const j = jitter(i);
      pos[i] = { x: x + pw / 2 + shift + (j - 0.5) * 6, y: -lift - ri * ROW - j * 6, r: tilt * (j * 2 - 1) };
      x += pw + GAP;
    });
  });
  return pos;
};

function FolderFloat({
  items = DEFAULT_ITEMS,
  label = '',
  sublabel = '',
  trigger = 'hover',
  defaultOpen = false,
  closeOnSelect = true,
  physics = true,
  drift = 0.5,
  onSelect,
  onOpenChange,
  folderColor = '#3f3f46',
  frontColor = '#52525b',
  paperColor = '#f5f5f5',
  itemColor = '#f5f5f5',
  itemTextColor = '#18181b',
  labelColor = '#f5f5f5',
  width = 200,
  height = 148,
  radius = 14,
  spread = 180,
  lift = 26,
  tilt = 8,
  flapAngle = 34,
  restAngle = 16,
  openDuration = 520,
  stagger = 45,
  bounce = 0.3,
  className = ''
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [popped, setPopped] = useState(-1);
  const [live, setLive] = useState(false);
  const [sizes, setSizes] = useState([]);
  const anchorRef = useRef(null);
  const pillRefs = useRef([]);
  const world = useRef({
    engine: null,
    bodies: [],
    sizes: [],
    raf: 0,
    last: 0,
    t0: 0,
    drag: null,
    zone: null,
    live: false
  });
  const latest = useRef({});
  latest.current = { onSelect, onOpenChange, drift, reduce: false };
  const popTimer = useRef(undefined);
  const liveTimer = useRef(undefined);
  const list = items.map(item => (typeof item === 'string' ? { label: item, value: item } : item));
  const n = list.length;
  const sub = sublabel || `${n} ${n === 1 ? 'note' : 'notes'}`;
  const pos = layout(list, spread, lift, tilt, sizes);

  const labelsKey = list.map(item => item.label).join('|');
  useLayoutEffect(() => {
    const measure = () => {
      const next = pillRefs.current.slice(0, n).map(el => (el ? { w: el.offsetWidth, h: el.offsetHeight } : null));
      if (next.some(s => !s)) return;
      setSizes(prev =>
        prev.length === next.length && prev.every((s, i) => s.w === next[i].w && s.h === next[i].h) ? prev : next
      );
    };
    measure();
    document.fonts?.ready.then(measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, labelsKey]);

  const stopPhysics = useCallback(() => {
    const w = world.current;
    clearTimeout(liveTimer.current);
    cancelAnimationFrame(w.raf);
    w.raf = 0;
    if (w.engine) {
      w.bodies.forEach((b, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - w.sizes[i].h / 2).toFixed(1)}px`);
      });
      Composite.clear(w.engine.world, false, true);
      Engine.clear(w.engine);
      w.engine = null;
    }
    w.bodies = [];
    w.drag = null;
    w.live = false;
    setLive(false);
  }, []);

  const startPhysics = useCallback(() => {
    const w = world.current;
    if (w.engine) return;
    const els = pillRefs.current.slice(0, n);
    if (els.some(el => !el)) return;
    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    engine.enableSleeping = false;
    w.engine = engine;
    w.sizes = els.map(el => ({ w: el.offsetWidth, h: el.offsetHeight }));
    const ys = pos.map(p => p.y);
    const zone = {
      left: -spread - ZONE_PAD,
      right: spread + ZONE_PAD,
      top: Math.min(...ys) - ZONE_PAD,
      bottom: -lift + Math.max(...w.sizes.map(s => s.h))
    };
    w.zone = zone;
    w.bodies = els.map((el, i) => {
      const { w: bw, h: bh } = w.sizes[i];
      const b = Bodies.rectangle(pos[i].x, pos[i].y + bh / 2, bw, bh, {
        chamfer: { radius: Math.min(bh / 2 - 1, 16) },
        restitution: 0.55,
        friction: 0,
        frictionAir: 0.08,
        inertia: Infinity
      });
      b.plugin = { phase: jitter(i) * Math.PI * 2 };
      return b;
    });
    const T = 80;
    const walls = [
      Bodies.rectangle((zone.left + zone.right) / 2, zone.top - T / 2, zone.right - zone.left + 2 * T, T, {
        isStatic: true
      }),
      Bodies.rectangle((zone.left + zone.right) / 2, zone.bottom + T / 2, zone.right - zone.left + 2 * T, T, {
        isStatic: true
      }),
      Bodies.rectangle(zone.left - T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
        isStatic: true
      }),
      Bodies.rectangle(zone.right + T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
        isStatic: true
      })
    ];
    Composite.add(engine.world, [...w.bodies, ...walls]);
    w.live = true;
    w.last = 0;
    w.t0 = performance.now();
    setLive(true);
    const tick = now => {
      const s = world.current;
      if (!s.engine) return;
      const dt = s.last ? Math.min(32, now - s.last) : 16;
      s.last = now;
      const t = (now - s.t0) / 1000;
      const k = latest.current.drift * 0.00005 * Math.min(1, t / 2);
      s.bodies.forEach((b, i) => {
        if (s.drag && s.drag.i === i) return;
        const ph = b.plugin.phase;
        Body.applyForce(b, b.position, {
          x: Math.sin(t * 0.9 + ph) * k * b.mass,
          y: Math.cos(t * 1.3 + ph * 1.7) * k * b.mass
        });
      });
      Engine.update(s.engine, dt);
      s.bodies.forEach((b, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - s.sizes[i].h / 2).toFixed(1)}px`);
      });
      s.raf = requestAnimationFrame(tick);
    };
    w.raf = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, spread, lift, pos.map(p => `${p.x},${p.y}`).join('|')]);

  const set = useCallback(
    next => {
      if (!next) stopPhysics();
      setOpen(prev => {
        if (prev === next) return prev;
        latest.current.onOpenChange?.(next);
        return next;
      });
    },
    [stopPhysics]
  );

  useEffect(() => {
    clearTimeout(liveTimer.current);
    if (!open || !physics || latest.current.reduce) {
      if (!open) stopPhysics();
      else if (!physics) stopPhysics();
      return undefined;
    }
    liveTimer.current = setTimeout(startPhysics, openDuration + (n - 1) * stagger + 80);
    return () => clearTimeout(liveTimer.current);
  }, [open, physics, openDuration, stagger, n, startPhysics, stopPhysics]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      latest.current.reduce = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(popTimer.current);
      stopPhysics();
    },
    [stopPhysics]
  );

  const pick = (item, i) => {
    latest.current.onSelect?.(item.value, i);
    clearTimeout(popTimer.current);
    setPopped(i);
    popTimer.current = setTimeout(() => setPopped(-1), 320);
    if (closeOnSelect) set(false);
  };

  const pointerAt = e => {
    const r = anchorRef.current?.getBoundingClientRect();
    return r ? { x: e.clientX - r.left, y: e.clientY - r.top } : { x: 0, y: 0 };
  };
  const down = (e, i) => {
    const w = world.current;
    if (!w.live || e.button !== 0) return;
    const b = w.bodies[i];
    if (!b) return;
    const p = pointerAt(e);
    w.drag = {
      i,
      id: e.pointerId,
      dx: b.position.x - p.x,
      dy: b.position.y - p.y,
      sx: e.clientX,
      sy: e.clientY,
      moved: false
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };
  const move = (e, i) => {
    const w = world.current;
    const d = w.drag;
    if (!d || d.i !== i || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= DRAG_MIN) {
      d.moved = true;
      e.currentTarget.setAttribute('data-drag', '');
    }
    if (!d.moved) return;
    const b = w.bodies[i];
    const { w: bw, h: bh } = w.sizes[i];
    const z = w.zone;
    const p = pointerAt(e);
    const x = Math.min(z.right - bw / 2, Math.max(z.left + bw / 2, p.x + d.dx));
    const y = Math.min(z.bottom - bh / 2, Math.max(z.top + bh / 2, p.y + d.dy));
    Body.setVelocity(b, { x: (x - b.position.x) * 0.6, y: (y - b.position.y) * 0.6 });
    Body.setPosition(b, { x, y });
  };
  const up = (e, i, item) => {
    const w = world.current;
    const d = w.drag;
    if (!d || d.i !== i || d.id !== e.pointerId) return;
    w.drag = null;
    e.currentTarget.removeAttribute('data-drag');
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (!d.moved && e.type === 'pointerup') pick(item, i);
  };

  const hover = trigger === 'hover';

  return (
    <div
      className={`folder-float${className ? ` ${className}` : ''}`}
      data-open={open ? '' : undefined}
      data-live={live ? '' : undefined}
      data-physics={physics ? '' : undefined}
      data-trigger={trigger}
      onPointerEnter={hover ? () => set(true) : undefined}
      onPointerLeave={
        hover
          ? () => {
              if (!world.current.drag) set(false);
            }
          : undefined
      }
      onKeyDown={e => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          set(false);
        }
      }}
      style={{
        '--ff-w': `${width}px`,
        '--ff-h': `${height}px`,
        '--ff-r': `${radius}px`,
        '--ff-back': folderColor,
        '--ff-front': frontColor,
        '--ff-paper': paperColor,
        '--ff-item': itemColor,
        '--ff-item-ink': itemTextColor,
        '--ff-label': labelColor,
        '--ff-spread': `${spread}px`,
        '--ff-lift': `${lift}px`,
        '--ff-angle': `${flapAngle}deg`,
        '--ff-rest': `${restAngle}deg`,
        '--ff-open': `${openDuration}ms`,
        '--ff-close': `${Math.round(openDuration * 0.6)}ms`,
        '--ff-stagger': `${stagger}ms`,
        '--ff-n': n,
        '--ff-spring': `cubic-bezier(0.34, ${(1 + bounce * 1.9).toFixed(2)}, 0.64, 1)`
      }}
    >
      <div ref={anchorRef} className="folder-float__items">
        {list.map((item, i) => {
          const p = pos[i];
          return (
            <button
              key={`${item.value}-${i}`}
              ref={el => {
                pillRefs.current[i] = el;
              }}
              type="button"
              className="folder-float__item"
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
              data-pop={popped === i ? '' : undefined}
              style={{
                '--i': i,
                '--x': `${p.x.toFixed(1)}px`,
                '--y': `${p.y.toFixed(1)}px`,
                '--r': `${p.r.toFixed(2)}deg`
              }}
              onPointerDown={e => down(e, i)}
              onPointerMove={e => move(e, i)}
              onPointerUp={e => up(e, i, item)}
              onPointerCancel={e => up(e, i, item)}
              onClick={e => {
                if (!world.current.live || e.detail === 0) pick(item, i);
              }}
            >
              <span className="folder-float__drift">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="folder-float__folder">
        <span className="folder-float__back" aria-hidden="true" />
        <span className="folder-float__paper" aria-hidden="true" />
        <span className="folder-float__front" aria-hidden="true">
          <span className="folder-float__label">{label}</span>
          <span className="folder-float__sub">{sub}</span>
        </span>
        <button
          type="button"
          className="folder-float__trigger"
          aria-expanded={open}
          aria-label={`${label}, ${sub}`}
          onClick={() => set(!open)}
        />
      </div>
    </div>
  );
}


/* ============================================================
   STL / 3D MODEL VIEWER
   ============================================================ */

function STLModelViewer({ isMobile }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const animationRef = useRef(null);

  const pointerRef = useRef({
    down: false,
    x: 0,
    y: 0,
    moved: false,
  });

  const rotationRef = useRef({
    x: -0.18,
    y: 0.55,
  });

  const zoomRef = useRef(1);
  const initialCameraZRef = useRef(5);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState("");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0d1115");

    const camera = new THREE.PerspectiveCamera(
      35,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.01,
      10000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setSize(
      mount.clientWidth,
      mount.clientHeight,
      false
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    mount.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    /* Lighting */
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      1.9
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      0xffffff,
      3.0
    );
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(
      0x8ed8ff,
      1.8
    );
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(
      0xffffff,
      1.2
    );
    rimLight.position.set(0, -2, 5);
    scene.add(rimLight);

    /* Subtle floor grid */
    const grid = new THREE.GridHelper(
      8,
      32,
      0x3a4650,
      0x202830
    );
    grid.position.y = -1.45;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    scene.add(grid);

    const loader = new STLLoader();

    loader.load(
      "/sorayamachest.stl",
      (geometry) => {
        if (disposed) {
          geometry.dispose();
          return;
        }

        geometry.computeVertexNormals();
        geometry.center();

        const box = new THREE.Box3().setFromBufferAttribute(
          geometry.attributes.position
        );

        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(
          size.x,
          size.y,
          size.z,
          0.001
        );

        const scale = 2.7 / maxDimension;

        const material = new THREE.MeshPhysicalMaterial({
          color: 0x8fb7c9,
          metalness: 0.48,
          roughness: 0.28,
          clearcoat: 0.65,
          clearcoatRoughness: 0.2,
        });

        const mesh = new THREE.Mesh(
          geometry,
          material
        );

        mesh.scale.setScalar(scale);
        mesh.rotation.x = rotationRef.current.x;
        mesh.rotation.y = rotationRef.current.y;

        scene.add(mesh);
        modelRef.current = mesh;

        /* Put the model slightly above the grid. */
        const scaledBox = new THREE.Box3().setFromObject(mesh);
        const center = scaledBox.getCenter(
          new THREE.Vector3()
        );
        mesh.position.y -=
          center.y - 0.15;

        const scaledSize = scaledBox.getSize(
          new THREE.Vector3()
        );

        const maxScaledDimension = Math.max(
          scaledSize.x,
          scaledSize.y,
          scaledSize.z,
          0.001
        );

        camera.position.z =
          maxScaledDimension * 2.15;
        initialCameraZRef.current =
          camera.position.z;

        camera.near =
          Math.max(0.001, maxScaledDimension / 100);
        camera.far =
          Math.max(100, maxScaledDimension * 20);
        camera.updateProjectionMatrix();

        setModelLoaded(true);
      },
      undefined,
      () => {
        if (!disposed) {
          setModelError(
            "Couldn't load sorayamachest.stl. Make sure the file is inside your public folder."
          );
        }
      }
    );

    const resize = () => {
      if (!mount || !camera || !renderer) return;

      const width = mount.clientWidth;
      const height = Math.max(
        mount.clientHeight,
        1
      );

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height,
        false
      );
    };

    const resizeObserver =
      new ResizeObserver(resize);

    resizeObserver.observe(mount);
    resize();

    const animate = () => {
      if (disposed) return;

      animationRef.current =
        requestAnimationFrame(animate);

      const model = modelRef.current;

      if (model) {
        model.rotation.x =
          rotationRef.current.x;

        model.rotation.y =
          rotationRef.current.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      disposed = true;

      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      resizeObserver.disconnect();

      if (modelRef.current) {
        modelRef.current.geometry?.dispose();
        modelRef.current.material?.dispose();
        scene.remove(modelRef.current);
        modelRef.current = null;
      }

      renderer.dispose();

      if (
        renderer.domElement &&
        mount.contains(renderer.domElement)
      ) {
        mount.removeChild(
          renderer.domElement
        );
      }

      scene.clear();
    };
  }, []);

  const handlePointerDown = (event) => {
    pointerRef.current = {
      down: true,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    );
  };

  const handlePointerMove = (event) => {
    if (!pointerRef.current.down) return;

    const dx =
      event.clientX -
      pointerRef.current.x;

    const dy =
      event.clientY -
      pointerRef.current.y;

    if (
      Math.abs(dx) > 2 ||
      Math.abs(dy) > 2
    ) {
      pointerRef.current.moved = true;
    }

    rotationRef.current.y +=
      dx * 0.012;

    rotationRef.current.x +=
      dy * 0.009;

    rotationRef.current.x = Math.max(
      -1.45,
      Math.min(
        1.45,
        rotationRef.current.x
      )
    );

    pointerRef.current.x =
      event.clientX;
    pointerRef.current.y =
      event.clientY;
  };

  const handlePointerUp = (event) => {
    pointerRef.current.down = false;

    event.currentTarget.releasePointerCapture?.(
      event.pointerId
    );
  };

  const handleWheel = (event) => {
    event.preventDefault();

    const camera = cameraRef.current;
    if (!camera) return;

    zoomRef.current *=
      event.deltaY > 0 ? 1.08 : 0.92;

    zoomRef.current = Math.max(
      0.55,
      Math.min(2.4, zoomRef.current)
    );

    camera.position.z *=
      event.deltaY > 0 ? 1.08 : 0.92;
  };

  const resetView = () => {
    rotationRef.current = {
      x: -0.18,
      y: 0.55,
    };

    zoomRef.current = 1;

    const camera = cameraRef.current;
    if (camera) {
      camera.position.z =
        initialCameraZRef.current;
    }
  };

  const downloadSTL = () => {
    window.location.href =
      "https://www.cgtrader.com/free-3d-print-models/hobby-diy/robotics/sexyrobot";
  };

  return (
    <div className="stl-viewer-shell">
      <div
        className="stl-viewer"
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        role="application"
        aria-label="Interactive 3D STL model viewer"
      >
        {!modelLoaded && !modelError && (
          <div className="stl-viewer-status">
            <span className="stl-loading-dot" />
            Loading 3D model…
          </div>
        )}

        {modelError && (
          <div className="stl-viewer-status stl-viewer-error">
            {modelError}
          </div>
        )}

        <div className="stl-viewer-hint">
          {isMobile
            ? "Drag to rotate · Scroll to zoom"
            : "Drag to rotate · Scroll to zoom"}
        </div>

        <div
          className="stl-viewer-controls"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerMove={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
          onPointerCancel={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={resetView}
            className="stl-control-button specular-border-target"
          >
            Reset
          </button>

          <a
            href="https://www.cgtrader.com/free-3d-print-models/hobby-diy/robotics/sexyrobot"
            target="_blank"
            rel="noopener noreferrer"
            className="stl-control-button stl-download-button specular-border-target"
          >
            Source ↗
          </a>
        </div>
      </div>

      <div className="stl-model-meta">
        <div>
          <div className="stl-model-kicker">
            Source:{" "}
      <a
        href="https://www.cgtrader.com/free-3d-print-models/hobby-diy/robotics/sexyrobot"
        target="_blank"
        rel="noopener noreferrer"
      >
        CGTrader ↗
      </a>
      {" | "}
            <a
        href="https://www.cgtrader.com/designers/robert-ho"
        target="_blank"
        rel="noopener noreferrer"
      >
        Original creator: robert-ho ↗
      </a>
      
            
          </div>

          <h3 className="stl-model-title">
            Sorayama Chest 
          </h3>
        </div>

        <div className="stl-model-file">
          Model ID: #4621003
        </div>
      </div>
    </div>
  );
}

const vert = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const frag = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt;
uniform float uYaw;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineStyle;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanDirection;
uniform float uNoise;
uniform float uBloomOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uPhaseTaper;
uniform float uScanDuration;
uniform float uScanDelay;
uniform float uLightMode;
varying vec2 vUv;

uniform float uScanStarts[8];
uniform float uScanCount;

const int MAX_SCANS = 8;

float smoother01(float a, float b, float x){
  float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

    vec3 ro = vec3(0.0);
    vec3 rd = normalize(vec3(p, 2.0));

    float cR = cos(uTilt), sR = sin(uTilt);
    rd.xy = mat2(cR, -sR, sR, cR) * rd.xy;

    float cY = cos(uYaw), sY = sin(uYaw);
    rd.xz = mat2(cY, -sY, sY, cY) * rd.xz;

    vec2 skew = clamp(uSkew, vec2(-0.7), vec2(0.7));
    rd.xy += skew * rd.z;

    vec3 color = vec3(0.0);
  float minT = 1e20;
  float gridScale = max(1e-5, uGridScale);
    float fadeStrength = 2.0;
    vec2 gridUV = vec2(0.0);

  float hitIsY = 1.0;
    for (int i = 0; i < 4; i++)
    {
        float isY = float(i < 2);
        float pos = mix(-0.2, 0.2, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
        float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
        float den = isY * rd.y + (1.0 - isY) * rd.x;
        float t = num / den;
        vec3 h = ro + rd * t;

        float depthBoost = smoothstep(0.0, 3.0, h.z);
        h.xy += skew * 0.15 * depthBoost;

    bool use = t > 0.0 && t < minT;
    gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
    minT = use ? t : minT;
    hitIsY = use ? isY : hitIsY;
    }

    vec3 hit = ro + rd * minT;
    float dist = length(hit - ro);

  float jitterAmt = clamp(uLineJitter, 0.0, 1.0);
  if (jitterAmt > 0.0) {
    vec2 j = vec2(
      sin(gridUV.y * 2.7 + iTime * 1.8),
      cos(gridUV.x * 2.3 - iTime * 1.6)
    ) * (0.15 * jitterAmt);
    gridUV += j;
  }
  float fx = fract(gridUV.x);
  float fy = fract(gridUV.y);
  float ax = min(fx, 1.0 - fx);
  float ay = min(fy, 1.0 - fy);
  float wx = fwidth(gridUV.x);
  float wy = fwidth(gridUV.y);
  float halfPx = max(0.0, uLineThickness) * 0.5;

  float tx = halfPx * wx;
  float ty = halfPx * wy;

  float aax = wx;
  float aay = wy;

  float lineX = 1.0 - smoothstep(tx, tx + aax, ax);
  float lineY = 1.0 - smoothstep(ty, ty + aay, ay);
  if (uLineStyle > 0.5) {
    float dashRepeat = 4.0;
    float dashDuty = 0.5;
    float vy = fract(gridUV.y * dashRepeat);
    float vx = fract(gridUV.x * dashRepeat);
    float dashMaskY = step(vy, dashDuty);
    float dashMaskX = step(vx, dashDuty);
    if (uLineStyle < 1.5) {
      lineX *= dashMaskY;
      lineY *= dashMaskX;
    } else {
      float dotRepeat = 6.0;
      float dotWidth = 0.18;
      float cy = abs(fract(gridUV.y * dotRepeat) - 0.5);
      float cx = abs(fract(gridUV.x * dotRepeat) - 0.5);
      float dotMaskY = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.y * dotRepeat), cy);
      float dotMaskX = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.x * dotRepeat), cx);
      lineX *= dotMaskY;
      lineY *= dotMaskX;
    }
  }
  float primaryMask = max(lineX, lineY);

  vec2 gridUV2 = (hitIsY > 0.5 ? hit.xz : hit.zy) / gridScale;
  if (jitterAmt > 0.0) {
    vec2 j2 = vec2(
      cos(gridUV2.y * 2.1 - iTime * 1.4),
      sin(gridUV2.x * 2.5 + iTime * 1.7)
    ) * (0.15 * jitterAmt);
    gridUV2 += j2;
  }
  float fx2 = fract(gridUV2.x);
  float fy2 = fract(gridUV2.y);
  float ax2 = min(fx2, 1.0 - fx2);
  float ay2 = min(fy2, 1.0 - fy2);
  float wx2 = fwidth(gridUV2.x);
  float wy2 = fwidth(gridUV2.y);
  float tx2 = halfPx * wx2;
  float ty2 = halfPx * wy2;
  float aax2 = wx2;
  float aay2 = wy2;
  float lineX2 = 1.0 - smoothstep(tx2, tx2 + aax2, ax2);
  float lineY2 = 1.0 - smoothstep(ty2, ty2 + aay2, ay2);
  if (uLineStyle > 0.5) {
    float dashRepeat2 = 4.0;
    float dashDuty2 = 0.5;
    float vy2m = fract(gridUV2.y * dashRepeat2);
    float vx2m = fract(gridUV2.x * dashRepeat2);
    float dashMaskY2 = step(vy2m, dashDuty2);
    float dashMaskX2 = step(vx2m, dashDuty2);
    if (uLineStyle < 1.5) {
      lineX2 *= dashMaskY2;
      lineY2 *= dashMaskX2;
    } else {
      float dotRepeat2 = 6.0;
      float dotWidth2 = 0.18;
      float cy2 = abs(fract(gridUV2.y * dotRepeat2) - 0.5);
      float cx2 = abs(fract(gridUV2.x * dotRepeat2) - 0.5);
      float dotMaskY2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.y * dotRepeat2), cy2);
      float dotMaskX2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.x * dotRepeat2), cx2);
      lineX2 *= dotMaskY2;
      lineY2 *= dotMaskX2;
    }
  }
    float altMask = max(lineX2, lineY2);

    float edgeDistX = min(abs(hit.x - (-0.5)), abs(hit.x - 0.5));
    float edgeDistY = min(abs(hit.y - (-0.2)), abs(hit.y - 0.2));
    float edgeDist = mix(edgeDistY, edgeDistX, hitIsY);
    float edgeGate = 1.0 - smoothstep(gridScale * 0.5, gridScale * 2.0, edgeDist);
    altMask *= edgeGate;

  float lineMask = max(primaryMask, altMask);

    float fade = exp(-dist * fadeStrength);

    float dur = max(0.05, uScanDuration);
    float del = max(0.0, uScanDelay);
    float scanZMax = 2.0;
    float widthScale = max(0.1, uScanGlow);
    float sigma = max(0.001, 0.18 * widthScale * uScanSoftness);
    float sigmaA = sigma * 2.0;

    float combinedPulse = 0.0;
    float combinedAura = 0.0;

    float cycle = dur + del;
    float tCycle = mod(iTime, cycle);
    float scanPhase = clamp((tCycle - del) / dur, 0.0, 1.0);
    float phase = scanPhase;
    if (uScanDirection > 0.5 && uScanDirection < 1.5) {
      phase = 1.0 - phase;
    } else if (uScanDirection > 1.5) {
      float t2 = mod(max(0.0, iTime - del), 2.0 * dur);
      phase = (t2 < dur) ? (t2 / dur) : (1.0 - (t2 - dur) / dur);
    }
    float scanZ = phase * scanZMax;
    float dz = abs(hit.z - scanZ);
    float lineBand = exp(-0.5 * (dz * dz) / (sigma * sigma));
    float taper = clamp(uPhaseTaper, 0.0, 0.49);
    float headW = taper;
    float tailW = taper;
    float headFade = smoother01(0.0, headW, phase);
    float tailFade = 1.0 - smoother01(1.0 - tailW, 1.0, phase);
    float phaseWindow = headFade * tailFade;
    float pulseBase = lineBand * phaseWindow;
    combinedPulse += pulseBase * clamp(uScanOpacity, 0.0, 1.0);
    float auraBand = exp(-0.5 * (dz * dz) / (sigmaA * sigmaA));
    combinedAura += (auraBand * 0.25) * phaseWindow * clamp(uScanOpacity, 0.0, 1.0);

    for (int i = 0; i < MAX_SCANS; i++) {
      if (float(i) >= uScanCount) break;
      float tActiveI = iTime - uScanStarts[i];
      float phaseI = clamp(tActiveI / dur, 0.0, 1.0);
      if (uScanDirection > 0.5 && uScanDirection < 1.5) {
        phaseI = 1.0 - phaseI;
      } else if (uScanDirection > 1.5) {
        phaseI = (phaseI < 0.5) ? (phaseI * 2.0) : (1.0 - (phaseI - 0.5) * 2.0);
      }
      float scanZI = phaseI * scanZMax;
      float dzI = abs(hit.z - scanZI);
      float lineBandI = exp(-0.5 * (dzI * dzI) / (sigma * sigma));
      float headFadeI = smoother01(0.0, headW, phaseI);
      float tailFadeI = 1.0 - smoother01(1.0 - tailW, 1.0, phaseI);
      float phaseWindowI = headFadeI * tailFadeI;
      combinedPulse += lineBandI * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
      float auraBandI = exp(-0.5 * (dzI * dzI) / (sigmaA * sigmaA));
      combinedAura += (auraBandI * 0.25) * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
    }

  float lineVis = lineMask;
  vec3 gridCol = uLinesColor * lineVis * fade;
  vec3 scanCol = uScanColor * combinedPulse;
  vec3 scanAura = uScanColor * combinedAura;

    color = gridCol + scanCol + scanAura;

  float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
  color += (n - 0.5) * uNoise;
  color = clamp(color, 0.0, 1.0);
  float alpha = clamp(max(lineVis, combinedPulse), 0.0, 1.0);
  float gx = 1.0 - smoothstep(tx * 2.0, tx * 2.0 + aax * 2.0, ax);
  float gy = 1.0 - smoothstep(ty * 2.0, ty * 2.0 + aay * 2.0, ay);
  float halo = max(gx, gy) * fade;
  alpha = max(alpha, halo * clamp(uBloomOpacity, 0.0, 1.0));
  if (uLightMode > 0.5) {
    float energy = max(max(color.r, color.g), color.b);
    float coverage = clamp(max(alpha, smoothstep(0.0, 0.55, energy) * 0.82), 0.0, 0.9);
    coverage *= smoothstep(0.015, 0.12, energy);
    vec3 chroma = clamp(color / max(energy, 0.0001), 0.0, 1.0);
    chroma = pow(chroma, vec3(1.2));
    fragColor = vec4(mix(vec3(1.0), chroma, coverage * 0.94), 1.0);
  } else {
    fragColor = vec4(color, alpha);
  }
}

void main(){
  vec4 c;
  mainImage(c, vUv * iResolution.xy);
  gl_FragColor = c;
}
`;

const GridScan = ({
  enableWebcam = false,
  showPreview = false,
  modelsPath = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights',
  sensitivity = 0.55,
  lineThickness = 1,
  linesColor = '#2F293A',
  scanColor = '#FF9FFC',
  scanOpacity = 0.4,
  gridScale = 0.1,
  lineStyle = 'solid',
  lineJitter = 0.1,
  scanDirection = 'pingpong',
  enablePost = true,
  bloomIntensity = 0,
  bloomThreshold = 0,
  bloomSmoothing = 0,
  chromaticAberration = 0.002,
  noiseIntensity = 0.01,
  scanGlow = 0.5,
  scanSoftness = 2,
  scanPhaseTaper = 0.9,
  scanDuration = 2.0,
  scanDelay = 2.0,
  enableGyro = false,
  scanOnClick = false,
  snapBackDelay = 250,
  lightMode = false,
  className,
  style
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const composerRef = useRef(null);
  const bloomRef = useRef(null);
  const chromaRef = useRef(null);
  const rafRef = useRef(null);

  const [modelsReady, setModelsReady] = useState(false);
  const [uiFaceActive, setUiFaceActive] = useState(false);

  const lookTarget = useRef(new THREE.Vector2(0, 0));
  const tiltTarget = useRef(0);
  const yawTarget = useRef(0);

  const lookCurrent = useRef(new THREE.Vector2(0, 0));
  const lookVel = useRef(new THREE.Vector2(0, 0));
  const tiltCurrent = useRef(0);
  const tiltVel = useRef(0);
  const yawCurrent = useRef(0);
  const yawVel = useRef(0);

  const MAX_SCANS = 8;
  const scanStartsRef = useRef([]);

  const pushScan = t => {
    const arr = scanStartsRef.current.slice();
    if (arr.length >= MAX_SCANS) arr.shift();
    arr.push(t);
    scanStartsRef.current = arr;
    if (materialRef.current) {
      const u = materialRef.current.uniforms;
      const buf = new Array(MAX_SCANS).fill(0);
      for (let i = 0; i < arr.length && i < MAX_SCANS; i++) buf[i] = arr[i];
      u.uScanStarts.value = buf;
      u.uScanCount.value = arr.length;
    }
  };

  const bufX = useRef([]);
  const bufY = useRef([]);
  const bufT = useRef([]);
  const bufYaw = useRef([]);

  const s = THREE.MathUtils.clamp(sensitivity, 0, 1);
  const skewScale = THREE.MathUtils.lerp(0.06, 0.2, s);
  const tiltScale = THREE.MathUtils.lerp(0.12, 0.3, s);
  const yawScale = THREE.MathUtils.lerp(0.1, 0.28, s);
  const depthResponse = THREE.MathUtils.lerp(0.25, 0.45, s);
  const smoothTime = THREE.MathUtils.lerp(0.45, 0.12, s);
  const maxSpeed = Infinity;

  const yBoost = THREE.MathUtils.lerp(1.2, 1.6, s);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const interactionEl = el.parentElement || el;
    let leaveTimer = null;
    const onMove = e => {
      if (uiFaceActive) return;
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      lookTarget.current.set(nx, ny);
    };
    const onClick = async () => {
      const nowSec = performance.now() / 1000;
      if (scanOnClick) pushScan(nowSec);
      if (
        enableGyro &&
        typeof window !== 'undefined' &&
        window.DeviceOrientationEvent &&
        DeviceOrientationEvent.requestPermission
      ) {
        try {
          await DeviceOrientationEvent.requestPermission();
        } catch {
          // noop
        }
      }
    };
    const onEnter = () => {
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
    };
    const onLeave = () => {
      if (uiFaceActive) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(
        () => {
          lookTarget.current.set(0, 0);
          tiltTarget.current = 0;
          yawTarget.current = 0;
        },
        Math.max(0, snapBackDelay || 0)
      );
    };
    interactionEl.addEventListener('mousemove', onMove);
    interactionEl.addEventListener('mouseenter', onEnter);
    if (scanOnClick) el.addEventListener('click', onClick);
    interactionEl.addEventListener('mouseleave', onLeave);
    return () => {
      interactionEl.removeEventListener('mousemove', onMove);
      interactionEl.removeEventListener('mouseenter', onEnter);
      interactionEl.removeEventListener('mouseleave', onLeave);
      if (scanOnClick) el.removeEventListener('click', onClick);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [uiFaceActive, snapBackDelay, scanOnClick, enableGyro]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const uniforms = {
      iResolution: {
        value: new THREE.Vector3(container.clientWidth, container.clientHeight, renderer.getPixelRatio())
      },
      iTime: { value: 0 },
      uSkew: { value: new THREE.Vector2(0, 0) },
      uTilt: { value: 0 },
      uYaw: { value: 0 },
      uLineThickness: { value: lineThickness },
      uLinesColor: { value: srgbColor(linesColor) },
      uScanColor: { value: srgbColor(scanColor) },
      uGridScale: { value: gridScale },
      uLineStyle: { value: lineStyle === 'dashed' ? 1 : lineStyle === 'dotted' ? 2 : 0 },
      uLineJitter: { value: Math.max(0, Math.min(1, lineJitter || 0)) },
      uScanOpacity: { value: scanOpacity },
      uNoise: { value: noiseIntensity },
      uBloomOpacity: { value: bloomIntensity },
      uScanGlow: { value: scanGlow },
      uScanSoftness: { value: scanSoftness },
      uPhaseTaper: { value: scanPhaseTaper },
      uScanDuration: { value: scanDuration },
      uScanDelay: { value: scanDelay },
      uScanDirection: { value: scanDirection === 'backward' ? 1 : scanDirection === 'pingpong' ? 2 : 0 },
      uScanStarts: { value: new Array(MAX_SCANS).fill(0) },
      uScanCount: { value: 0 },
      uLightMode: { value: lightMode ? 1 : 0 }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    materialRef.current = material;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    let composer = null;
    if (enablePost) {
      composer = new EffectComposer(renderer);
      composerRef.current = composer;
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      const bloom = new BloomEffect({
        intensity: 1.0,
        luminanceThreshold: bloomThreshold,
        luminanceSmoothing: bloomSmoothing
      });
      bloom.blendMode.opacity.value = Math.max(0, bloomIntensity);
      bloomRef.current = bloom;

      const chroma = new ChromaticAberrationEffect({
        offset: new THREE.Vector2(chromaticAberration, chromaticAberration),
        radialModulation: true,
        modulationOffset: 0.0
      });
      chromaRef.current = chroma;

      const effectPass = new EffectPass(camera, bloom, chroma);
      effectPass.renderToScreen = true;
      composer.addPass(effectPass);
    }

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      material.uniforms.iResolution.value.set(container.clientWidth, container.clientHeight, renderer.getPixelRatio());
      if (composerRef.current) composerRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let last = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
      last = now;

      lookCurrent.current.copy(
        smoothDampVec2(lookCurrent.current, lookTarget.current, lookVel.current, smoothTime, maxSpeed, dt)
      );

      const tiltSm = smoothDampFloat(
        tiltCurrent.current,
        tiltTarget.current,
        { v: tiltVel.current },
        smoothTime,
        maxSpeed,
        dt
      );
      tiltCurrent.current = tiltSm.value;
      tiltVel.current = tiltSm.v;

      const yawSm = smoothDampFloat(
        yawCurrent.current,
        yawTarget.current,
        { v: yawVel.current },
        smoothTime,
        maxSpeed,
        dt
      );
      yawCurrent.current = yawSm.value;
      yawVel.current = yawSm.v;

      const skew = new THREE.Vector2(lookCurrent.current.x * skewScale, -lookCurrent.current.y * yBoost * skewScale);
      material.uniforms.uSkew.value.set(skew.x, skew.y);
      material.uniforms.uTilt.value = tiltCurrent.current * tiltScale;
      material.uniforms.uYaw.value = THREE.MathUtils.clamp(yawCurrent.current * yawScale, -0.6, 0.6);

      material.uniforms.iTime.value = now / 1000;
      renderer.clear(true, true, true);
      if (composerRef.current) {
        composerRef.current.render(dt);
      } else {
        renderer.render(scene, camera);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      material.dispose();
      quad.geometry.dispose();

      if (composerRef.current) {
        composerRef.current.dispose();
        composerRef.current = null;
      }
      renderer.dispose();
      renderer.forceContextLoss();
      container.removeChild(renderer.domElement);
    };
  }, [
    sensitivity,
    lineThickness,
    linesColor,
    scanColor,
    scanOpacity,
    gridScale,
    lineStyle,
    lineJitter,
    scanDirection,
    enablePost,
    noiseIntensity,
    bloomIntensity,
    scanGlow,
    scanSoftness,
    scanPhaseTaper,
    scanDuration,
    scanDelay,
    bloomThreshold,
    bloomSmoothing,
    chromaticAberration,
    smoothTime,
    maxSpeed,
    skewScale,
    yBoost,
    tiltScale,
    yawScale,
    lightMode
  ]);

  useEffect(() => {
    const m = materialRef.current;
    if (m) {
      const u = m.uniforms;
      u.uLineThickness.value = lineThickness;
      u.uLinesColor.value.copy(srgbColor(linesColor));
      u.uScanColor.value.copy(srgbColor(scanColor));
      u.uGridScale.value = gridScale;
      u.uLineStyle.value = lineStyle === 'dashed' ? 1 : lineStyle === 'dotted' ? 2 : 0;
      u.uLineJitter.value = Math.max(0, Math.min(1, lineJitter || 0));
      u.uBloomOpacity.value = Math.max(0, bloomIntensity);
      u.uNoise.value = Math.max(0, noiseIntensity);
      u.uScanGlow.value = scanGlow;
      u.uScanOpacity.value = Math.max(0, Math.min(1, scanOpacity));
      u.uScanDirection.value = scanDirection === 'backward' ? 1 : scanDirection === 'pingpong' ? 2 : 0;
      u.uScanSoftness.value = scanSoftness;
      u.uPhaseTaper.value = scanPhaseTaper;
      u.uScanDuration.value = Math.max(0.05, scanDuration);
      u.uScanDelay.value = Math.max(0.0, scanDelay);
      u.uLightMode.value = lightMode ? 1 : 0;
    }
    if (bloomRef.current) {
      bloomRef.current.blendMode.opacity.value = Math.max(0, bloomIntensity);
      bloomRef.current.luminanceMaterial.threshold = bloomThreshold;
      bloomRef.current.luminanceMaterial.smoothing = bloomSmoothing;
    }
    if (chromaRef.current) {
      chromaRef.current.offset.set(chromaticAberration, chromaticAberration);
    }
  }, [
    lineThickness,
    linesColor,
    scanColor,
    gridScale,
    lineStyle,
    lineJitter,
    bloomIntensity,
    bloomThreshold,
    bloomSmoothing,
    chromaticAberration,
    noiseIntensity,
    scanGlow,
    scanOpacity,
    scanDirection,
    scanSoftness,
    scanPhaseTaper,
    scanDuration,
    scanDelay,
    lightMode
  ]);

  useEffect(() => {
    if (!enableGyro) return;
    const handler = e => {
      if (uiFaceActive) return;
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;
      const nx = THREE.MathUtils.clamp(gamma / 45, -1, 1);
      const ny = THREE.MathUtils.clamp(-beta / 30, -1, 1);
      lookTarget.current.set(nx, ny);
      tiltTarget.current = THREE.MathUtils.degToRad(gamma) * 0.4;
    };
    window.addEventListener('deviceorientation', handler);
    return () => {
      window.removeEventListener('deviceorientation', handler);
    };
  }, [enableGyro, uiFaceActive]);

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelsPath)
        ]);
        if (!canceled) setModelsReady(true);
      } catch {
        if (!canceled) setModelsReady(false);
      }
    };
    load();
    return () => {
      canceled = true;
    };
  }, [modelsPath]);

  useEffect(() => {
    let stop = false;
    let lastDetect = 0;
    const video = videoRef.current;

    const start = async () => {
      if (!enableWebcam || !modelsReady) return;
      if (!video) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        video.srcObject = stream;
        await video.play();
      } catch {
        return;
      }

      const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 });

      const detect = async ts => {
        if (stop) return;

        if (ts - lastDetect >= 33) {
          lastDetect = ts;
          try {
            const res = await faceapi.detectSingleFace(video, opts).withFaceLandmarks(true);
            if (res && res.detection) {
              const det = res.detection;
              const box = det.box;
              const vw = video.videoWidth || 1;
              const vh = video.videoHeight || 1;

              const cx = box.x + box.width * 0.5;
              const cy = box.y + box.height * 0.5;
              const nx = (cx / vw) * 2 - 1;
              const ny = (cy / vh) * 2 - 1;
              medianPush(bufX.current, nx, 5);
              medianPush(bufY.current, ny, 5);
              const nxm = median(bufX.current);
              const nym = median(bufY.current);

              const look = new THREE.Vector2(Math.tanh(nxm), Math.tanh(nym));

              const faceSize = Math.min(1, Math.hypot(box.width / vw, box.height / vh));
              const depthScale = 1 + depthResponse * (faceSize - 0.25);
              lookTarget.current.copy(look.multiplyScalar(depthScale));

              const leftEye = res.landmarks.getLeftEye();
              const rightEye = res.landmarks.getRightEye();
              const lc = centroid(leftEye);
              const rc = centroid(rightEye);
              const tilt = Math.atan2(rc.y - lc.y, rc.x - lc.x);
              medianPush(bufT.current, tilt, 5);
              tiltTarget.current = median(bufT.current);

              const nose = res.landmarks.getNose();
              const tip = nose[nose.length - 1] || nose[Math.floor(nose.length / 2)];
              const jaw = res.landmarks.getJawOutline();
              const leftCheek = jaw[3] || jaw[2];
              const rightCheek = jaw[13] || jaw[14];
              const dL = dist2(tip, leftCheek);
              const dR = dist2(tip, rightCheek);
              const eyeDist = Math.hypot(rc.x - lc.x, rc.y - lc.y) + 1e-6;
              let yawSignal = THREE.MathUtils.clamp((dR - dL) / (eyeDist * 1.6), -1, 1);
              yawSignal = Math.tanh(yawSignal);
              medianPush(bufYaw.current, yawSignal, 5);
              yawTarget.current = median(bufYaw.current);

              setUiFaceActive(true);
            } else {
              setUiFaceActive(false);
            }
          } catch {
            setUiFaceActive(false);
          }
        }

        if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
          video.requestVideoFrameCallback(() => detect(performance.now()));
        } else {
          requestAnimationFrame(detect);
        }
      };

      requestAnimationFrame(detect);
    };

    start();

    return () => {
      stop = true;
      if (video) {
        const stream = video.srcObject;
        if (stream) stream.getTracks().forEach(t => t.stop());
        video.pause();
        video.srcObject = null;
      }
    };
  }, [enableWebcam, modelsReady, depthResponse]);

  return (
    <div ref={containerRef} className={`gridscan${className ? ` ${className}` : ''}`} style={style}>
      {showPreview && (
        <div className="gridscan__preview">
          <video ref={videoRef} muted playsInline autoPlay className="gridscan__video" />
          <div className="gridscan__badge">
            {enableWebcam
              ? modelsReady
                ? uiFaceActive
                  ? 'Face: tracking'
                  : 'Face: searching'
                : 'Loading models'
              : 'Webcam disabled'}
          </div>
        </div>
      )}
    </div>
  );
};

function srgbColor(hex) {
  const c = new THREE.Color(hex);
  return c.convertSRGBToLinear();
}

function smoothDampVec2(current, target, currentVelocity, smoothTime, maxSpeed, deltaTime) {
  const out = current.clone();
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  let change = current.clone().sub(target);
  const originalTo = target.clone();

  const maxChange = maxSpeed * smoothTime;
  if (change.length() > maxChange) change.setLength(maxChange);

  target = current.clone().sub(change);
  const temp = currentVelocity.clone().addScaledVector(change, omega).multiplyScalar(deltaTime);
  currentVelocity.sub(temp.clone().multiplyScalar(omega));
  currentVelocity.multiplyScalar(exp);

  out.copy(target.clone().add(change.add(temp).multiplyScalar(exp)));

  const origMinusCurrent = originalTo.clone().sub(current);
  const outMinusOrig = out.clone().sub(originalTo);
  if (origMinusCurrent.dot(outMinusOrig) > 0) {
    out.copy(originalTo);
    currentVelocity.set(0, 0);
  }
  return out;
}

function smoothDampFloat(current, target, velRef, smoothTime, maxSpeed, deltaTime) {
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

  let change = current - target;
  const originalTo = target;

  const maxChange = maxSpeed * smoothTime;
  change = Math.sign(change) * Math.min(Math.abs(change), maxChange);

  target = current - change;
  const temp = (velRef.v + omega * change) * deltaTime;
  velRef.v = (velRef.v - omega * temp) * exp;

  let out = target + (change + temp) * exp;

  const origMinusCurrent = originalTo - current;
  const outMinusOrig = out - originalTo;
  if (origMinusCurrent * outMinusOrig > 0) {
    out = originalTo;
    velRef.v = 0;
  }
  return { value: out, v: velRef.v };
}

function medianPush(buf, v, maxLen) {
  buf.push(v);
  if (buf.length > maxLen) buf.shift();
}

function median(buf) {
  if (buf.length === 0) return 0;
  const a = [...buf].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) * 0.5;
}

function centroid(points) {
  let x = 0,
    y = 0;
  const n = points.length || 1;
  for (const p of points) {
    x += p.x;
    y += p.y;
  }
  return { x: x / n, y: y / n };
}

function dist2(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export default function Portfolio() {
  const [dark, setDark] = useState(false);
  const [narrativeBringDownActive, setNarrativeBringDownActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [aboutTab, setAboutTab] = useState("story");
  const [activeNav, setActiveNav] = useState("#about");
  const [videoMuted, setVideoMuted] = useState(true);

  const videoRef = useRef(null);

  /* ==========================================================
     RESET NARRATIVE VIDEO SOUND WHEN LEAVING THE SECTION
     ========================================================== */

  useEffect(() => {
    const section = document.getElementById("narrative-zoom-out");

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the user leaves the narrative video section,
        // always return the sound to the default muted state.
        if (!entry.isIntersecting) {
          setVideoMuted(true);

          // Also update the actual video element immediately.
          if (videoRef.current) {
            videoRef.current.muted = true;
          }
        }
      },
      {
        root: null,
        threshold: 0.15,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /* ==========================================================
     ROTATING HELLO / NAMASTE
     ========================================================== */

  const greetings = [
"Hello",       // English
"Namaskaram",  // Telugu
"Bonjour",     // French
"Hola",        // Spanish
"Namaste",     // Hindi
"Salve",       // Italian
"Ola",         // Portuguese
"Hallo",       // German
"Salaam",      // Arabic
"Konnichiwa",  // Japanese
"Annyeong",    // Korean 
  ];

  const [greetingIndex, setGreetingIndex] = useState(0);
  const [modeHintVisible, setModeHintVisible] = useState(false);
  const [modeHintText, setModeHintText] = useState(
    "Click here to change the mode to Aquatic Mist Dark Mode "
  );
  const modeHintTimerRef = useRef(null);
  const modeHintHideTimerRef = useRef(null);

  const scheduleModeHint = (nextDark) => {
    clearTimeout(modeHintTimerRef.current);
    clearTimeout(modeHintHideTimerRef.current);
    setModeHintVisible(false);

    setModeHintText(
      nextDark
        ? "Incase if you wanna switch back to the original Crystal Ice Mode, Click here"
        : "Click here to change the mode to Aquatic Mist Dark Mode"
    );

    modeHintTimerRef.current = setTimeout(() => {
      setModeHintVisible(true);
      modeHintHideTimerRef.current = setTimeout(() => {
        setModeHintVisible(false);
      }, 5000);
    }, 2500);
  };

  useEffect(() => {
    scheduleModeHint(false);
    return () => {
      clearTimeout(modeHintTimerRef.current);
      clearTimeout(modeHintHideTimerRef.current);
    };
  }, []);

  const handleThemeToggle = () => {
    const nextDark = !dark;
    setDark(nextDark);
    scheduleModeHint(nextDark);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setGreetingIndex(
        (i) => (i + 1) % greetings.length
      );
    }, 2000);

    return () => clearInterval(id);
  }, []);

  /* ==========================================================
     CLOCK / MOBILE
     ========================================================== */

  const now = useClock();

  const hour = now.getHours();

  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isMobile = useIsMobile();

  /* ==========================================================
     NARRATIVE NAV CONTRAST
     ========================================================== */

  useEffect(() => {
    const bringDownSection =
      document.getElementById("narrative-bring-down");

    if (!bringDownSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNarrativeBringDownActive(entry.isIntersecting);
      },
      {
        root: null,
        // Activate when the "Then I bring it back down"
        // section occupies the central part of the viewport.
        rootMargin: "-24% 0px -52% 0px",
        threshold: [0.05, 0.15, 0.35, 0.6],
      }
    );

    observer.observe(bringDownSection);

    return () => observer.disconnect();
  }, []);

  /* ==========================================================
     CINEMATIC NARRATIVE TRANSITION
     ----------------------------------------------------------
     The two narrative sections are treated as one visual scene.
     Scroll progress drives a gentle cross-fade, depth shift, and
     a soft fog layer peaking at the hand-off between them.
     No timers and no React state updates are used during scroll.
     ========================================================== */

  const narrativeFogRef = useRef(null);
  const photoNarrativeTransitionRef = useRef(null);

  useEffect(() => {
    const fog = narrativeFogRef.current;
    const firstSection =
      document.getElementById("narrative-zoom-out");
    const secondSection =
      document.getElementById("narrative-bring-down");

    if (!fog || !firstSection || !secondSection) return;

    let rafId = null;

    const clamp01 = (value) =>
      Math.max(0, Math.min(1, value));

    // Smoothstep keeps the beginning/end of the transition calm
    // instead of making the effect feel tied to scroll ticks.
    const smoothstep = (value) =>
      value * value * (3 - 2 * value);

    const updateTransition = () => {
      rafId = null;

      const vh = Math.max(window.innerHeight || 1, 1);
      const first = firstSection.getBoundingClientRect();
      const second = secondSection.getBoundingClientRect();

      /*
       * The transition deliberately has a long overlap. The first
       * scene begins changing while it is still readable; the second
       * scene starts resolving before it reaches the middle of the
       * viewport. This is what makes the hand-off feel cinematic
       * rather than like a section-to-section fade.
       */
      const start = vh * 0.86;
      const end = -vh * 0.18;
      const raw = clamp01((start - second.top) / Math.max(start - end, 1));
      const progress = smoothstep(raw);

      // Bell-shaped fog density: zero -> dense -> zero.
      const fogProgress = Math.sin(progress * Math.PI);

      // First scene: very subtle lift/softening as it disappears.
      const firstOpacity = 1 - fogProgress * 0.78;
      const firstScale = 1 - fogProgress * 0.025;
      const firstBlur = fogProgress * 3.5;
      const firstY = -fogProgress * 14;

      // Second scene: it is already underneath the hand-off and
      // resolves from a soft, slightly distant state.
      const secondOpacity = 0.22 + progress * 0.78;
      const secondScale = 1.025 - progress * 0.025;
      const secondBlur = (1 - progress) * 5;
      const secondY = (1 - progress) * 18;

      firstSection.style.setProperty("--narrative-opacity", firstOpacity.toFixed(3));
      firstSection.style.setProperty("--narrative-scale", firstScale.toFixed(4));
      firstSection.style.setProperty("--narrative-blur", `${firstBlur.toFixed(2)}px`);
      firstSection.style.setProperty("--narrative-y", `${firstY.toFixed(1)}px`);

      secondSection.style.setProperty("--narrative-opacity", secondOpacity.toFixed(3));
      secondSection.style.setProperty("--narrative-scale", secondScale.toFixed(4));
      secondSection.style.setProperty("--narrative-blur", `${secondBlur.toFixed(2)}px`);
      secondSection.style.setProperty("--narrative-y", `${secondY.toFixed(1)}px`);

      // Fog has a little lateral drift so it feels like atmosphere
      // rather than a flat white overlay.
      const drift = (progress - 0.5) * 52;
      const lift = (0.5 - progress) * 28;

      fog.style.setProperty("--fog-opacity", (fogProgress * 0.72).toFixed(3));
      fog.style.setProperty("--fog-blur", `${(6 + fogProgress * 13).toFixed(1)}px`);
      fog.style.setProperty("--fog-scale", (1 + fogProgress * 0.07).toFixed(3));
      fog.style.setProperty("--fog-x", `${drift.toFixed(1)}px`);
      fog.style.setProperty("--fog-y", `${lift.toFixed(1)}px`);
      fog.style.setProperty("--fog-progress", progress.toFixed(3));
    };

    const requestUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateTransition);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (rafId !== null) window.cancelAnimationFrame(rafId);

      [firstSection, secondSection].forEach((section) => {
        section.style.removeProperty("--narrative-opacity");
        section.style.removeProperty("--narrative-scale");
        section.style.removeProperty("--narrative-blur");
        section.style.removeProperty("--narrative-y");
      });
    };
  }, []);

  /* ==========================================================
     LIGHT -> DARK TRANSITION INTO THE FIRST NARRATIVE
     ----------------------------------------------------------
     The photo collage lives on the light page surface while the
     first narrative is a dark cinematic video. Instead of a hard
     section boundary, a scroll-scrubbed dark atmospheric veil
     gradually bridges the two.
     ========================================================== */

  useEffect(() => {
    const transition = photoNarrativeTransitionRef.current;
    const narrative = document.getElementById("narrative-zoom-out");
    const collage = document.getElementById("photo-collage");

    if (!transition || !narrative || !collage) return;

    let rafId = null;

    const clamp01 = (value) => Math.max(0, Math.min(1, value));
    const smoothstep = (value) => value * value * (3 - 2 * value);

    const updateTransition = () => {
      rafId = null;

      const vh = Math.max(window.innerHeight || 1, 1);
      const narrativeRect = narrative.getBoundingClientRect();
      const collageRect = collage.getBoundingClientRect();

      // Start while the collage is still clearly visible and finish
      // after the first narrative has settled into the viewport.
      const start = vh * 0.92;
      const end = -vh * 0.10;
      const raw = clamp01(
        (start - narrativeRect.top) /
          Math.max(start - end, 1)
      );
      const progress = smoothstep(raw);

      // A gentle peak around the hand-off keeps the transition
      // atmospheric instead of looking like a black overlay.
      const darkness = Math.sin(progress * Math.PI);
      const settled = smoothstep(clamp01((progress - 0.52) / 0.48));

      transition.style.setProperty(
        "--light-dark-opacity",
        (darkness * 0.72).toFixed(3)
      );
      transition.style.setProperty(
        "--light-dark-blur",
        `${(darkness * 7).toFixed(2)}px`
      );
      transition.style.setProperty(
        "--light-dark-scale",
        (1 + darkness * 0.035).toFixed(4)
      );

      // The collage gently loses brightness/contrast as the dark
      // narrative approaches, then returns to its normal state once
      // the narrative has fully taken over.
      const collageFade = smoothstep(
        clamp01((vh * 0.82 - narrativeRect.top) / (vh * 0.72))
      );
      collage.style.setProperty(
        "--collage-darkness",
        (collageFade * 0.34).toFixed(3)
      );
      collage.style.setProperty(
        "--collage-blur",
        `${(collageFade * 2.2).toFixed(2)}px`
      );
      collage.style.setProperty(
        "--collage-y",
        `${(-collageFade * 10).toFixed(1)}px`
      );
    };

    const requestUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateTransition);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (rafId !== null) window.cancelAnimationFrame(rafId);

      transition.style.removeProperty("--light-dark-opacity");
      transition.style.removeProperty("--light-dark-blur");
      transition.style.removeProperty("--light-dark-scale");
      collage.style.removeProperty("--collage-darkness");
      collage.style.removeProperty("--collage-blur");
      collage.style.removeProperty("--collage-y");
    };
  }, []);

  // In dark mode the nav is normally dark. While the
  // "Then I bring it back down" section is visible, switch
  // only the navigation to its light glass treatment so it
  // remains readable against that light section. As soon as
  // the next section takes over, the nav returns to dark.
  const navDark = dark && !narrativeBringDownActive;

  /* ==========================================================
     NAVIGATION SCROLL
     ========================================================== */

  const scrollToSection = (href) => {
    const id = href.replace("#", "");

    const section = document.getElementById(id);

    if (!section) return;

    const nav = document.querySelector(".liquid-nav");

    const target =
      section.querySelector("h2") || section;

    const navHeight = nav
      ? nav.getBoundingClientRect().height
      : 0;

    const extraGap = 18;

    const targetY =
      target.getBoundingClientRect().top +
      window.scrollY -
      navHeight -
      extraGap;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth",
    });

    setActiveNav(href);

    window.history.replaceState(
      null,
      "",
      href
    );
  };

  /* ==========================================================
     ACTIVE NAVIGATION OBSERVER
     ========================================================== */

  useEffect(() => {
    const sectionIds = NAV_LINKS
      .map((link) =>
        link.href.replace("#", "")
      )
      .filter((id) =>
        document.getElementById(id)
      );

    const sections = sectionIds
      .map((id) =>
        document.getElementById(id)
      )
      .filter(Boolean);

    if (!sections.length) return;

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter(
              (entry) =>
                entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            );

          if (visible[0]) {
            setActiveNav(
              `#${visible[0].target.id}`
            );
          }
        },
        {
          root: null,
          rootMargin:
            "-30% 0px -55% 0px",
          threshold: [
            0,
            0.15,
            0.35,
            0.6,
          ],
        }
      );

    sections.forEach((section) =>
      observer.observe(section)
    );

    return () =>
      observer.disconnect();
  }, []);

  /* ==========================================================
     THEME
     ========================================================== */

  const theme = dark
    ? {
        bg: "#171512",
        card: "#211E1A",
        ink: "#F4F1EA",
        sub: "#a79f91",
        pill: "#102A43",
        border: "#234A68",
      }
    : {
        bg: "#FAF9F6",
        card: "#FFFFFF",
        ink: "#173A5E",
        sub: "#5F7183",
        pill: "#E0F2FE",
        border: "#E7E2D8",
      };

  const accent = "#0284C7";

  return (
    <div
      className="portfolio-root"
      data-dark={dark ? "true" : "false"}
      style={{
        background: "transparent",
        "--page-bg": theme.bg,
        color: theme.ink,
        minHeight: "100vh",
        fontFamily:
          "'Inter', ui-sans-serif, system-ui, sans-serif",
        transition:
          "background 0.4s ease, color 0.4s ease",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap');

        html {
          scroll-behavior: smooth;
          width: 100%;
          min-width: 100%;
          margin: 0;
          padding: 0;
        }

        body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-width: 100%;
          min-height: 100vh;
          background: #FAF9F6;
          overflow-x: hidden;
        }

        #root {
          width: 100%;
          min-width: 100%;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }

        /* ============================================================
           FULL-PAGE ENGINEERING / GRAPH PAPER BACKGROUND
           ============================================================ */
        .portfolio-root {
          position: relative;
          isolation: isolate;
          width: 100%;
          min-width: 100%;
          max-width: none;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background-color: var(--page-bg);
          background-image:
            linear-gradient(
              to right,
              rgba(145, 145, 145, 0.24) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(145, 145, 145, 0.24) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
          background-position: 0 0;
          transition:
            background-color 0.4s ease,
            color 0.4s ease;
        }

        /* Keep the graph fixed to the viewport while the page scrolls. */
        .portfolio-root::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
        }


        .font-display {
          font-family: 'Fraunces', serif;
        }

        /* ============================
           GENERAL BUTTONS
           ============================ */

        .pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
          cursor: pointer;
          border: none;
        }

        .pill-btn:hover {
          transform: translateY(-1px);
        }

        .pill-btn:active {
          transform: translateY(0);
        }

        /* ============================
           FLOAT IN
           ============================ */

        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .float-in {
          animation:
            floatIn 0.7s ease both;
        }

        /* ============================
           GREETING MODE HINT
           ============================ */

        .greeting-container-wrap {
          position: relative;
          width: 100%;
          margin-bottom: 28px;
          overflow: visible;
        }

        .greeting-mode-hint {
          position: absolute;
          z-index: 30;
          top: 50%;
          /* Keep the hint completely OUTSIDE the left edge of the greeting card. */
          right: calc(100% + 12px);
          width: min(200px, calc(100vw - 40px));
          max-width: 276px;
          box-sizing: border-box;
          padding: 8px 12px;
          border: 1px solid var(--greeting-hint-border);
          border-radius: 11px;
          background: var(--greeting-hint-bg);
          color: var(--greeting-hint-text);
          font-size: 10.5px;
          font-weight: 500;
          line-height: 1.35;
          letter-spacing: 0.01em;
          text-align: left;
          backdrop-filter: blur(16px) saturate(155%);
          -webkit-backdrop-filter: blur(16px) saturate(155%);
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.10),
            inset 0 1px 0 rgba(255, 255, 255, 0.34);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(-50%) translateX(8px);
          transition:
            opacity 0.55s ease,
            transform 0.55s ease,
            visibility 0s linear 0.55s;
        }

        .greeting-mode-hint.is-visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
          transition:
            opacity 0.55s ease,
            transform 0.55s ease,
            visibility 0s linear 0s;
        }

        /* At narrower widths, keep the hint outside the card while ensuring
           its full width remains inside the viewport. */
        @media (max-width: 900px) {
          .greeting-mode-hint {
            right: auto;
            left: max(8px, calc(-1 * (100vw - 40px) / 2));
            width: min(250px, calc(100vw - 40px));
          }
        }

        @media (max-width: 640px) {
          .greeting-mode-hint {
            /* On very narrow screens, remain left of the greeting card but
               shift just enough to keep the entire bubble on-screen. */
            left: 8px;
            top: calc(100% + 10px);
            width: min(250px, calc(100vw - 40px));
            padding: 7px 10px;
            font-size: 9.5px;
            border-radius: 10px;
            transform: translateY(-4px);
          }

          .greeting-mode-hint.is-visible {
            transform: translateY(0);
          }

        }

        @media (prefers-reduced-motion: reduce) {
          .greeting-mode-hint {
            transition:
              opacity 0.25s ease,
              visibility 0s linear 0.25s;
          }

          .greeting-mode-hint.is-visible {
            transition:
              opacity 0.25s ease,
              visibility 0s linear 0s;
            transform: none;
          }
        }

        /* ============================
           HELLO / NAMASTE
           ============================ */

        @keyframes greetingIn {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .greeting-word {
          display: inline-block;
          will-change:
            transform,
            opacity;
        }

        /* ============================
           NAME CHARACTER WAVE
           ============================ */

        .hero-main-text {
          display: inline-block;
          cursor: pointer;
          overflow: hidden;
          padding-bottom: 0.15em;
          margin-bottom: -0.15em;
          vertical-align: bottom;
          white-space: nowrap;
        }

        .hero-main-text > span {
          display: inline-block;
          white-space: pre;
          will-change: transform;
        }

        .hero-main-text:hover > span {
          animation: waveChar 0.6s ease-in-out;
        }

        .hero-main-text:hover > span:nth-child(1) { animation-delay: 0s; }
        .hero-main-text:hover > span:nth-child(2) { animation-delay: 0.03s; }
        .hero-main-text:hover > span:nth-child(3) { animation-delay: 0.06s; }
        .hero-main-text:hover > span:nth-child(4) { animation-delay: 0.09s; }
        .hero-main-text:hover > span:nth-child(5) { animation-delay: 0.12s; }
        .hero-main-text:hover > span:nth-child(6) { animation-delay: 0.15s; }
        .hero-main-text:hover > span:nth-child(7) { animation-delay: 0.18s; }
        .hero-main-text:hover > span:nth-child(8) { animation-delay: 0.21s; }
        .hero-main-text:hover > span:nth-child(9) { animation-delay: 0.24s; }
        .hero-main-text:hover > span:nth-child(10) { animation-delay: 0.27s; }
        .hero-main-text:hover > span:nth-child(11) { animation-delay: 0.30s; }
        .hero-main-text:hover > span:nth-child(12) { animation-delay: 0.33s; }
        .hero-main-text:hover > span:nth-child(13) { animation-delay: 0.36s; }
        .hero-main-text:hover > span:nth-child(14) { animation-delay: 0.39s; }

        @keyframes waveChar {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }

        /* ============================
           COMPACT LIQUID GLASS ROLE
           ============================ */

        .hero-role-glass {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.1px;
          color: inherit;

          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.32),
              rgba(255,255,255,0.12)
            );

          border:
            1px solid
            rgba(255,255,255,0.30);

          backdrop-filter:
            blur(16px)
            saturate(160%);

          -webkit-backdrop-filter:
            blur(16px)
            saturate(160%);

          box-shadow:
            0 5px 16px
            rgba(0,0,0,0.08),
            inset 0 1px 0
            rgba(255,255,255,0.45);

          white-space: nowrap;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .hero-role-glass:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 7px 20px
            rgba(0,0,0,0.11),
            inset 0 1px 0
            rgba(255,255,255,0.55);
        }

        /* ============================
           BIRDS
           ============================ */

        .portfolio-birds {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .portfolio-bird-container {
          position: absolute;
          top: 10%;
          left: -12%;
          width: 88px;
          height: 125px;

          transform:
            translateX(-10vw)
            scale(0.3);

          will-change: transform;

          animation-name:
            portfolioFlyRightOne;

          animation-timing-function:
            linear;

          animation-iteration-count:
            infinite;
        }

        .portfolio-bird {
          background-image:
            url('/bird-cells-new.svg');

          background-repeat:
            no-repeat;

          background-size:
            auto 100%;

          width: 88px;
          height: 125px;

          will-change:
            background-position;

          animation-name:
            portfolioFlyCycle;

          animation-timing-function:
            steps(10);

          animation-iteration-count:
            infinite;
        }

        @keyframes portfolioFlyCycle {
          from {
            background-position:
              0 0;
          }

          to {
            background-position:
              -900px 0;
          }
        }

        @keyframes portfolioFlyRightOne {
          0% {
            transform:
              translate(-15vw, 0)
              scale(0.3);
            opacity: 0;
          }

          8% {
            opacity: 1;
          }

          20% {
            transform:
              translate(10vw, 25px)
              scale(0.35);
          }

          40% {
            transform:
              translate(30vw, -20px)
              scale(0.45);
          }

          60% {
            transform:
              translate(50vw, 20px)
              scale(0.55);
          }

          80% {
            transform:
              translate(70vw, -15px)
              scale(0.65);
          }

          92% {
            opacity: 1;
          }

          100% {
            transform:
              translate(115vw, -30px)
              scale(0.8);
            opacity: 0;
          }
        }

        .portfolio-bird-container-1 {
          animation-duration: 18s;
          animation-delay: 0s;
          top: 12%;
        }

        .portfolio-bird-1 {
          animation-duration: 0.9s;
          animation-delay: 0s;
        }

        .portfolio-bird-container-2 {
          animation-duration: 22s;
          animation-delay: -7s;
          top: 20%;
        }

        .portfolio-bird-2 {
          animation-duration: 1.05s;
          animation-delay: -0.25s;
        }

        .portfolio-bird-container-3 {
          animation-duration: 25s;
          animation-delay: -13s;
          top: 8%;
        }

        .portfolio-bird-3 {
          animation-duration: 1.15s;
          animation-delay: -0.5s;
        }

        .portfolio-bird-container-4 {
          animation-duration: 20s;
          animation-delay: -17s;
          top: 30%;
        }

        .portfolio-bird-4 {
          animation-duration: 0.82s;
          animation-delay: -0.15s;
        }

        /* ============================
           MOUNTAIN
           ============================ */

        .mountain-background {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 100%;
          min-width: 100%;
          height: auto;
          max-width: none;
          transform: translateX(-50%);
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .mountain-sky-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.05),
              rgba(255,255,255,0)
            );
          pointer-events: none;
          z-index: 2;
        }

        /* ============================
           PHOTO COLLAGE -> NARRATIVE LIGHT/DARK TRANSITION
           ============================ */

        #photo-collage {
          --collage-darkness: 0;
          --collage-blur: 0px;
          --collage-y: 0px;
          position: relative;
          filter: brightness(calc(1 - var(--collage-darkness)))
            blur(var(--collage-blur));
          transform: translate3d(0, var(--collage-y), 0);
          will-change: filter, transform;
          isolation: isolate;
        }

        .photo-narrative-dark-transition {
          --light-dark-opacity: 0;
          --light-dark-blur: 0px;
          --light-dark-scale: 1;

          position: fixed;
          inset: -10vh -12vw;
          z-index: 79;
          pointer-events: none;
          opacity: var(--light-dark-opacity);
          transform: scale(var(--light-dark-scale));
          filter: blur(var(--light-dark-blur));
          will-change: opacity, transform, filter;
          contain: paint;
          isolation: isolate;
        }

        .photo-narrative-dark-transition::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse 76% 62% at 50% 56%,
              rgba(3, 12, 24, 0.96) 0%,
              rgba(5, 18, 31, 0.82) 35%,
              rgba(7, 25, 39, 0.56) 62%,
              rgba(7, 19, 31, 0.10) 88%,
              transparent 100%
            ),
            linear-gradient(
              180deg,
              rgba(3, 12, 22, 0.12) 0%,
              rgba(3, 13, 24, 0.76) 52%,
              rgba(3, 10, 19, 0.94) 100%
            );
        }

        .photo-narrative-dark-transition::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              transparent 0%,
              rgba(7, 22, 36, 0.18) 34%,
              rgba(2, 10, 18, 0.46) 70%,
              rgba(1, 7, 13, 0.72) 100%
            );
          mix-blend-mode: multiply;
        }

        /* ============================
           CINEMATIC NARRATIVE TRANSITION
           ============================ */

        #narrative-zoom-out,
        #narrative-bring-down {
          --narrative-opacity: 1;
          --narrative-scale: 1;
          --narrative-blur: 0px;
          --narrative-y: 0px;

          opacity: var(--narrative-opacity);
          transform: translate3d(0, var(--narrative-y), 0) scale(var(--narrative-scale));
          filter: blur(var(--narrative-blur));
          transform-origin: center center;
          will-change: transform, opacity, filter;
          backface-visibility: hidden;
        }

        .narrative-fog-transition {
          --fog-opacity: 0;
          --fog-blur: 6px;
          --fog-scale: 1;
          --fog-x: 0px;
          --fog-y: 0px;

          position: fixed;
          inset: -18vh -14vw;
          z-index: 80;
          pointer-events: none;
          overflow: hidden;
          opacity: var(--fog-opacity);
          transform: translate3d(var(--fog-x), var(--fog-y), 0) scale(var(--fog-scale));
          will-change: transform, opacity;
          contain: paint;
          isolation: isolate;
        }

        .narrative-fog-layer {
          position: absolute;
          inset: -12%;
          pointer-events: none;
          background-repeat: no-repeat;
          will-change: transform, opacity;
        }

        /* Main soft veil — bright enough to bridge the dark video
           and pale-blue mountain scene without looking like a flash. */
        .narrative-fog-layer-a {
          background:
            radial-gradient(ellipse 72% 52% at 50% 50%,
              rgba(255,255,255,0.94) 0%,
              rgba(247,250,252,0.78) 28%,
              rgba(235,243,248,0.40) 54%,
              rgba(235,243,248,0) 78%);
          filter: blur(var(--fog-blur));
          transform: scale(1.08);
        }

        /* Offset cloud gives the fog a natural hand-off instead of a
           single centered radial gradient. */
        .narrative-fog-layer-b {
          background:
            radial-gradient(ellipse 45% 28% at 26% 55%,
              rgba(255,255,255,0.72) 0%,
              rgba(250,252,253,0.36) 48%,
              transparent 76%),
            radial-gradient(ellipse 48% 30% at 76% 43%,
              rgba(255,255,255,0.66) 0%,
              rgba(250,252,253,0.30) 46%,
              transparent 78%);
          filter: blur(calc(var(--fog-blur) * 1.25));
          transform: translate3d(calc(var(--fog-x) * -0.45), 2vh, 0) scale(1.12);
        }

        /* Very soft outer haze. This makes the edges disappear first
           and the center disappear last, like moving into mist. */
        .narrative-fog-layer-c {
          background:
            radial-gradient(ellipse 82% 68% at 50% 50%,
              transparent 20%,
              rgba(255,255,255,0.24) 58%,
              rgba(255,255,255,0.46) 100%);
          filter: blur(calc(var(--fog-blur) * 1.55));
          transform: translate3d(calc(var(--fog-x) * 0.3), -1vh, 0) scale(1.16);
        }

        @media (max-width: 640px) {
          #narrative-zoom-out,
          #narrative-bring-down {
            filter: blur(min(var(--narrative-blur), 3px));
          }

          .narrative-fog-transition {
            inset: -10vh -22vw;
          }

          .narrative-fog-layer-a {
            filter: blur(calc(var(--fog-blur) * 0.8));
          }

          .narrative-fog-layer-b,
          .narrative-fog-layer-c {
            filter: blur(calc(var(--fog-blur) * 1.05));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          #narrative-zoom-out,
          #narrative-bring-down {
            filter: none !important;
            transform: none !important;
          }

          .narrative-fog-transition {
            opacity: 0 !important;
            transform: none !important;
          }
        }

        /* ============================
           CARDS / PHOTOS
           ============================ */

        .card-hover {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .card-hover:hover {
          transform:
            translateY(-3px);
        }

        .polaroid {
          transition:
            transform 0.25s ease;
        }

        .polaroid:hover {
          transform:
            translateY(-4px)
            scale(1.02) !important;
        }

        .photo-tile {
          transition:
            transform 0.25s ease,
            filter 0.25s ease;
        }

        .photo-tile:hover {
          transform:
            scale(1.03);
          filter:
            brightness(1.08);
        }

        /* Preserve each edit's native aspect ratio when the browser opens it in fullscreen. */
        video:fullscreen {
          width: auto !important;
          height: auto !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          object-fit: contain !important;
          display: block !important;
          margin: 0 auto;
        }

        video:-webkit-full-screen {
          width: auto !important;
          height: auto !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          object-fit: contain !important;
          display: block !important;
          margin: 0 auto;
        }

        .creative-media-caption {
          font-size: 11px;
          line-height: 1.45;
          color: rgba(244, 241, 234, 0.82);
          letter-spacing: 0.01em;
        }

        .creative-media-caption-below {
          margin-top: 7px;
          padding: 0 3px;
        }

        .creative-media-caption-overlay {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 38px;
          z-index: 3;
          padding: 7px 9px;
          border-radius: 7px;
          background: rgba(0, 0, 0, 0.52);
          color: #ffffff;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          pointer-events: none;
        }

        .creative-category-card {
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }

        .creative-category-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.30) !important;
          box-shadow: 0 12px 28px rgba(0,0,0,0.14);
        }



        /* ============================================================
           GRIDSCAN — STL / 3D MODEL SECTION BACKGROUND
           ============================================================ */

        .stl-model-section {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .stl-gridscan-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .stl-gridscan-bg .gridscan {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .stl-gridscan-bg .gridscan canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        .stl-model-container {
          position: relative;
          z-index: 1;
        }

        .gridscan {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .gridscan__preview {
          position: absolute;
          right: 12px;
          bottom: 12px;
          width: 220px;
          height: 132px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          background: #000;
          color: #fff;
          font:
            12px/1.2 system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            sans-serif;
          pointer-events: none;
        }

        .gridscan__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }

        .gridscan__badge {
          position: absolute;
          left: 8px;
          top: 8px;
          padding: 2px 6px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 6px;
          backdrop-filter: blur(4px);
        }

        /* ============================
           STL / 3D MODEL
           ============================ */

        .stl-model-section {
          position: relative;
          padding: 72px 20px 86px;
          background: #141210;
          overflow: hidden;
        }

        .stl-model-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .stl-model-heading {
          max-width: 620px;
          margin: 0 auto 28px;
          text-align: center;
        }

        .stl-model-eyebrow {
          display: inline-block;
          margin-bottom: 10px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: rgb(239, 239, 241);
        }

        .stl-model-heading h2 {
          margin: 0;
          color: #eaf0f4;
          font-size: 28px;
          font-style: italic;
          line-height: 1.15;
        }

        .stl-model-heading p {
          max-width: 500px;
          margin: 12px auto 0;
          color: rgba(244,241,234,0.60);
          font-size: 12px;
          line-height: 1.7;
        }

        .stl-model-heading strong {
          color: rgba(16, 143, 234, 0.86);
          font-weight: 600;
        }

        .stl-viewer-shell {
          width: 100%;
          margin: 0 auto;
        }

        .stl-viewer {
          position: relative;
          width: 100%;
          height: 540px;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.12);
          background:
            radial-gradient(
              circle at 50% 38%,
              rgba(143,183,201,0.12),
              rgba(13,17,21,0.96) 62%
            );
          box-shadow:
            0 18px 48px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.08);
          cursor: grab;
          touch-action: none;
        }

        .stl-viewer:active {
          cursor: grabbing;
        }

        .stl-viewer canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        .stl-viewer-status {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 5;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(0,0,0,0.40);
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(244,241,234,0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          font-size: 11px;
          white-space: nowrap;
          pointer-events: none;
        }

        .stl-loading-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #269bd1;
          box-shadow: 0 0 12px rgba(143,183,201,0.7);
          animation: stlPulse 1.2s ease-in-out infinite;
        }

        @keyframes stlPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .stl-viewer-error {
          max-width: calc(100% - 40px);
          text-align: center;
          white-space: normal;
          color: rgba(255,210,210,0.88);
        }

        .stl-viewer-hint {
          position: absolute;
          left: 18px;
          bottom: 17px;
          z-index: 4;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(94, 117, 186, 0.28);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(244,241,234,0.48);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-size: 10px;
          pointer-events: none;
        }

        .stl-viewer-controls {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 5;
          display: flex;
          gap: 7px;
          pointer-events: auto;
        }

        .stl-control-button {
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 999px;
          padding: 7px 11px;
          background: rgba(45, 171, 196, 0.3);
          color: rgba(244,241,234,0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          font-family: inherit;
          font-size: 10px;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }


        .stl-control-button {
          text-decoration: none;
        }

        .stl-control-button:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.24);
        }

        .stl-download-button {
          color: rgba(241, 244, 247, 0.92);
        }

        .stl-model-meta {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          padding: 15px 3px 0;
        }

        .stl-model-kicker {
          margin-bottom: 4px;
          color: rgba(17, 203, 244, 0.81);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.13em;
        }

        .stl-model-title {
          margin: 0;
          color: #F4F1EA;
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-style: italic;
          font-weight: 500;
          
        }

        .stl-model-file {
          color: rgba(244,241,234,0.40);
          font-size: 10px;
          text-align: right;
          word-break: break-all;
        }

        @media (max-width: 640px) {
          .stl-model-section {
            padding:
              54px 16px 68px;
          }

          .stl-model-heading {
            margin-bottom: 22px;
          }

          .stl-model-heading h2 {
            font-size: 23px;
          }

          .stl-model-heading p {
            font-size: 11px;
          }

          .stl-viewer {
            height: 390px;
            border-radius: 20px;
          }

          .stl-viewer-hint {
            left: 12px;
            bottom: 12px;
            font-size: 9px;
          }

          .stl-viewer-controls {
            top: 12px;
            right: 12px;
          }

          .stl-model-meta {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
          }

          .stl-model-file {
            text-align: left;
          }
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        /* ============================
           LIQUID GLASS CONTENT SECTIONS
           ============================ */

        .content-glass-section {
          position: relative;
          isolation: isolate;
          padding: 22px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.34);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.36) 0%,
            rgba(255,255,255,0.14) 100%
          );
          backdrop-filter: blur(22px) saturate(175%);
          -webkit-backdrop-filter: blur(22px) saturate(175%);
          box-shadow:
            0 14px 38px rgba(0,0,0,0.075),
            0 4px 14px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,0.64),
            inset 0 -1px 0 rgba(255,255,255,0.10);
          overflow: hidden;
        }

        .content-glass-section::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            125deg,
            rgba(255,255,255,0.25),
            rgba(255,255,255,0.02) 44%,
            rgba(255,255,255,0.10)
          );
          z-index: -1;
        }

        .project-glass-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.48) 0%,
            rgba(255,255,255,0.22) 100%
          ) !important;
          border-color: rgba(255,255,255,0.48) !important;
          backdrop-filter: blur(16px) saturate(165%);
          -webkit-backdrop-filter: blur(16px) saturate(165%);
          box-shadow:
            0 7px 20px rgba(0,0,0,0.055),
            inset 0 1px 0 rgba(255,255,255,0.62);
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }

        .project-glass-card:hover {
          border-color: rgba(255,255,255,0.64) !important;
          box-shadow:
            0 13px 30px rgba(0,0,0,0.09),
            inset 0 1px 0 rgba(255,255,255,0.78);
        }

        .project-tag-glass {
          position: relative;
          display: inline-flex;
          align-items: center;
          max-width: 100%;
          box-sizing: border-box;
          padding: 5px 11px;
          margin-bottom: 10px;
          border-radius: 999px;
          border: 1px solid rgba(125,211,252,0.40);
          background: linear-gradient(
            180deg,
            rgba(186,230,253,0.58) 0%,
            rgba(125,211,252,0.25) 100%
          );
          color: #0369A1;
          backdrop-filter: blur(14px) saturate(175%);
          -webkit-backdrop-filter: blur(14px) saturate(175%);
          box-shadow:
            0 4px 12px rgba(2,132,199,0.08),
            inset 0 1px 0 rgba(255,255,255,0.68),
            inset 0 -1px 0 rgba(255,255,255,0.10);
          font-size: 10.5px;
          font-weight: 600;
          line-height: 1.25;
        }

        .skill-glass-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(125,211,252,0.38);
          background: linear-gradient(
            180deg,
            rgba(186,230,253,0.55) 0%,
            rgba(125,211,252,0.22) 100%
          );
          color: #174A70;
          backdrop-filter: blur(14px) saturate(170%);
          -webkit-backdrop-filter: blur(14px) saturate(170%);
          box-shadow:
            0 4px 12px rgba(2,132,199,0.06),
            inset 0 1px 0 rgba(255,255,255,0.66);
          font-size: 13px;
          font-weight: 500;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .skill-glass-pill:hover {
          transform: translateY(-1px);
          background: linear-gradient(
            180deg,
            rgba(186,230,253,0.68) 0%,
            rgba(125,211,252,0.30) 100%
          );
          box-shadow:
            0 7px 16px rgba(2,132,199,0.10),
            inset 0 1px 0 rgba(255,255,255,0.78);
        }

        .education-glass-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.48) 0%,
            rgba(255,255,255,0.20) 100%
          ) !important;
          border-color: rgba(255,255,255,0.48) !important;
          backdrop-filter: blur(16px) saturate(165%);
          -webkit-backdrop-filter: blur(16px) saturate(165%);
          box-shadow:
            0 7px 20px rgba(0,0,0,0.055),
            inset 0 1px 0 rgba(255,255,255,0.62);
        }

        /* ============================
           DARK MODE — BLUE GLASS PALETTE
           ============================ */

        [data-dark="true"] .content-glass-section {
          border-color: rgba(125,211,252,0.30);
          background: linear-gradient(
            180deg,
            rgba(83,129,158,0.34) 0%,
            rgba(27,67,94,0.26) 100%
          );
          box-shadow:
            0 16px 40px rgba(0,18,35,0.42),
            0 3px 12px rgba(2,132,199,0.10),
            inset 0 1px 0 rgba(191,232,255,0.34),
            inset 0 -1px 0 rgba(8,44,68,0.22);
        }

        [data-dark="true"] .content-glass-section::before {
          background: linear-gradient(
            125deg,
            rgba(186,230,253,0.18),
            rgba(56,189,248,0.04) 44%,
            rgba(125,211,252,0.10)
          );
        }

        /* Certifications container stays white in dark mode */
        [data-dark="true"] .certifications-glass-section {
          background: #ffffff !important;
          border-color: rgba(255,255,255,0.65) !important;
          box-shadow:
            0 14px 38px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.9),
            inset 0 -1px 0 rgba(0,0,0,0.04) !important;
        }

        [data-dark="true"] .certifications-glass-section::before {
          background: transparent !important;
        }

        [data-dark="true"] .project-glass-card,
        [data-dark="true"] .education-glass-card {
          background: linear-gradient(
            180deg,
            rgba(178,210,228,0.44) 0%,
            rgba(104,151,178,0.30) 100%
          ) !important;
          border-color: rgba(191,225,242,0.58) !important;
          box-shadow:
            0 8px 24px rgba(0,18,35,0.30),
            inset 0 1px 0 rgba(255,255,255,0.64),
            inset 0 -1px 0 rgba(13,61,88,0.16);
        }

        [data-dark="true"] .project-glass-card:hover,
        [data-dark="true"] .education-glass-card:hover {
          border-color: rgba(191,232,255,0.78) !important;
          box-shadow:
            0 13px 30px rgba(0,18,35,0.38),
            0 4px 14px rgba(2,132,199,0.12),
            inset 0 1px 0 rgba(255,255,255,0.78);
        }

        /* ============================
           DARK MODE — GLASS READABILITY
           ============================ */

        /*
         * The glass surfaces intentionally stay light/translucent in
         * dark mode. Use dark ink on those surfaces instead of the
         * global light theme ink so text does not disappear into the
         * white highlight of the glass.
         */

        .portfolio-root[data-dark="true"] .content-glass-section > h2 {
          color: #262626 !important;
          text-shadow: none;
        }

        .portfolio-root[data-dark="true"] .project-glass-card {
          color: #292929 !important;
        }

        .portfolio-root[data-dark="true"] .project-glass-card > div > span:first-child {
          color: #242424 !important;
        }

        .portfolio-root[data-dark="true"] .project-glass-card p {
          color: #5A5A5A !important;
        }

        .portfolio-root[data-dark="true"] .project-glass-card svg {
          color: #686868 !important;
          stroke: #686868 !important;
        }

        .portfolio-root[data-dark="true"] .project-tag-glass {
          color: #075985 !important;
          text-shadow: none;
        }

        .portfolio-root[data-dark="true"] .skill-glass-pill {
          color: #174A70 !important;
          text-shadow: none;
        }

        .portfolio-root[data-dark="true"] .education-glass-card {
          color: #292929 !important;
        }

        .portfolio-root[data-dark="true"] .education-glass-card > div:first-child > span:first-child {
          color: #242424 !important;
        }

        .portfolio-root[data-dark="true"] .education-glass-card > div:first-child > span:last-child {
          color: #626262 !important;
        }

        .portfolio-root[data-dark="true"] .education-glass-card > div:last-child {
          color: #5A5A5A !important;
        }

        .portfolio-root[data-dark="true"] .skills-glass-section .skill-glass-pill:hover {
          color: #123E5F !important;
        }

        /* Keep the active About-tab text readable on its light glass
           surface when dark mode is enabled. */
        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn {
          color: #303030 !important;
        }

        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn:hover,
        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn[aria-selected="true"] {
          color: #202020 !important;
        }

        [data-dark="true"] .project-tag-glass,
        [data-dark="true"] .skill-glass-pill {
          color: #063B5C !important;
          border-color: rgba(56,189,248,0.58);
          background: linear-gradient(
            180deg,
            rgba(186,230,253,0.76) 0%,
            rgba(125,211,252,0.48) 100%
          );
          box-shadow:
            0 4px 14px rgba(0,52,82,0.18),
            inset 0 1px 0 rgba(255,255,255,0.82),
            inset 0 -1px 0 rgba(14,116,144,0.12);
        }

        [data-dark="true"] .project-tag-glass:hover,
        [data-dark="true"] .skill-glass-pill:hover {
          color: #042F49 !important;
          background: linear-gradient(
            180deg,
            rgba(224,242,254,0.86) 0%,
            rgba(125,211,252,0.58) 100%
          );
        }

        @media (max-width: 640px) {
          .content-glass-section {
            padding: 16px;
            border-radius: 20px;
          }

          .project-glass-card,
          .education-glass-card {
            border-radius: 16px !important;
            padding: 17px !important;
          }

          .project-tag-glass {
            font-size: 9.5px;
            padding: 4px 9px;
          }

          .skill-glass-pill {
            padding: 7px 12px;
            font-size: 12px;
          }
        }

        /* ============================================================
           LIGHTFALL — FULL SOCIAL / FOOTER BACKGROUND
           ============================================================ */

        .socials-footer-lightfall {
          position: relative;
          width: 100%;
          min-height: 448px;
          margin: 0;
          overflow: hidden;
          isolation: isolate;
          background: #07131D;
        }

        .socials-footer-lightfall > .lightfall-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .socials-footer-lightfall > .lightfall-container canvas {
          position: absolute;
          inset: 0;
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        .socials-footer-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
          padding: 56px 20px 80px;
          box-sizing: border-box;
        }

        .socials-lightfall-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
          max-width: 320px;
          margin: 0 auto 18px;
        }

        @media (max-width: 640px) {
          .socials-footer-lightfall {
            min-height: auto;
          }

          .socials-footer-content {
            padding: 44px 20px 64px;
          }
        }

        /* ============================
           LIQUID GLASS SOCIAL LINKS
           ============================ */

        .social-glass-pill {
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 54px;
          box-sizing: border-box;
          padding: 12px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.34);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.38) 0%,
            rgba(255,255,255,0.16) 100%
          );
          color: inherit;
          backdrop-filter: blur(20px) saturate(175%);
          -webkit-backdrop-filter: blur(20px) saturate(175%);
          box-shadow:
            0 10px 28px rgba(0,0,0,0.08),
            0 3px 10px rgba(0,0,0,0.045),
            inset 0 1px 0 rgba(255,255,255,0.62),
            inset 0 -1px 0 rgba(255,255,255,0.12);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          overflow: hidden;
          transition:
            transform 0.22s ease,
            background 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }

        .social-glass-pill::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            125deg,
            rgba(255,255,255,0.28),
            rgba(255,255,255,0.02) 48%,
            rgba(255,255,255,0.12)
          );
          z-index: -1;
        }

        .social-glass-pill:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.48);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.48) 0%,
            rgba(255,255,255,0.20) 100%
          );
          box-shadow:
            0 14px 34px rgba(0,0,0,0.11),
            0 4px 12px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.76);
        }

        .social-glass-pill:active {
          transform: translateY(0) scale(0.985);
        }

        .location-glass-pill {
          position: relative;
          isolation: isolate;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          max-width: 100%;
          box-sizing: border-box;
          padding: 11px 20px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.34);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.34) 0%,
            rgba(255,255,255,0.14) 100%
          );
          color: inherit;
          backdrop-filter: blur(20px) saturate(175%);
          -webkit-backdrop-filter: blur(20px) saturate(175%);
          box-shadow:
            0 9px 26px rgba(0,0,0,0.075),
            inset 0 1px 0 rgba(255,255,255,0.58),
            inset 0 -1px 0 rgba(255,255,255,0.10);
          font-size: 13px;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
        }

        .location-glass-pill::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            125deg,
            rgba(255,255,255,0.22),
            transparent 50%
          );
          z-index: -1;
        }

        .location-glass-pill svg {
          flex-shrink: 0;
        }

        [data-dark="true"] .social-glass-pill,
        [data-dark="true"] .location-glass-pill {
          border-color: rgba(255,255,255,0.18);
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.16) 0%,
            rgba(255,255,255,0.065) 100%
          );
          box-shadow:
            0 12px 30px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.20),
            inset 0 -1px 0 rgba(255,255,255,0.06);
        }

        [data-dark="true"] .social-glass-pill:hover {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.22) 0%,
            rgba(255,255,255,0.09) 100%
          );
          border-color: rgba(255,255,255,0.26);
        }

        /* Crystal Ice Mode — keep Socials text/icons white over Lightfall */
        [data-dark="false"] .social-glass-pill {
          color: #ffffff !important;
        }

        [data-dark="false"] .social-glass-pill svg {
          color: #ffffff !important;
          stroke: currentColor;
        }

        /* Crystal Ice Mode — keep the location text/icon white too */
        [data-dark="false"] .location-glass-pill {
          color: #ffffff !important;
        }

        [data-dark="false"] .location-glass-pill svg {
          color: #ffffff !important;
          stroke: currentColor;
        }

        @media (max-width: 640px) {
          .social-glass-pill {
            min-height: 50px;
            padding: 10px 14px;
            font-size: 13px;
          }

          .location-glass-pill {
            max-width: calc(100vw - 40px);
            padding: 10px 16px;
            font-size: 12px;
          }
        }

        /* ============================
           ABOUT TABS
           ============================ */

     .tab-btn {
  position: relative;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  background: transparent;
  color: inherit;

  transition:
    background 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    transform 0.2s ease;

  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
}

.tab-btn:hover {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.08)
  );

  border-color: rgba(255, 255, 255, 0.28);

  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);

  transform: translateY(-1px);
}

.about-tabs-glass {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.38),
    rgba(255, 255, 255, 0.14)
  );

  border: 1px solid rgba(255, 255, 255, 0.35);

  backdrop-filter: blur(18px) saturate(170%);
  -webkit-backdrop-filter: blur(18px) saturate(170%);

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    inset 0 -1px 0 rgba(255, 255, 255, 0.12);

  position: relative;
}

.about-tabs-glass::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  pointer-events: none;

  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.20),
    transparent 45%
  );
}

.about-tabs-glass .tab-btn {
  position: relative;
  z-index: 1;
}

@media (max-width: 640px) {
  .about-tabs-glass {
    width: 100%;
    justify-content: space-between;
  }

  .about-tabs-glass .tab-btn {
    flex: 1;
    padding: 8px 10px;
    font-size: 12px;
  }
}

        /* ============================
           LIQUID GLASS NAV
           ============================ */

        .liquid-nav {
          position: fixed;
          top: 16px;
          left: 50%;
          transform:
            translateX(-50%);

          z-index: 9999;

          width:
            min(
              900px,
              calc(100vw - 32px)
            );

          max-width:
            calc(100vw - 32px);

          box-sizing:
            border-box;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap: 12px;

          padding: 8px;

          border:
            1px solid
            rgba(255,255,255,0.28);

          border-radius:
            999px;

          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.34) 0%,
              rgba(255,255,255,0.14) 100%
            );

          backdrop-filter:
            blur(24px)
            saturate(180%)
            brightness(1.08);

          -webkit-backdrop-filter:
            blur(24px)
            saturate(180%)
            brightness(1.08);

          box-shadow:
            0 14px 40px
            rgba(0,0,0,0.12),
            0 4px 14px
            rgba(0,0,0,0.07),
            inset 0 1px 0
            rgba(255,255,255,0.42),
            inset 0 -1px 0
            rgba(255,255,255,0.10);

          isolation:
            isolate;

          transition:
            background 0.45s ease,
            border-color 0.45s ease,
            box-shadow 0.45s ease,
            color 0.45s ease;
        }

        .liquid-nav::before {
          content: "";

          position: absolute;

          inset: 1px;

          border-radius:
            inherit;

          pointer-events:
            none;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.3),
              rgba(255,255,255,0.02) 45%,
              rgba(255,255,255,0.12)
            );

          opacity:
            0.75;

          z-index:
            -1;
        }

        .liquid-nav-brand {
          display:
            flex;

          align-items:
            center;

          gap: 10px;

          flex-shrink:
            0;

          padding-left:
            8px;
        }

        .liquid-nav-initials {
          font-weight:
            700;

          font-size:
            14px;

          letter-spacing:
            0.5px;

          font-family:
            inherit;

          color:
            inherit;

          background:
            transparent;

          border:
            none;

          padding:
            0;

          margin:
            0;

          cursor:
            pointer;

          appearance:
            none;

          -webkit-appearance:
            none;
        }

        .liquid-nav-time {
          display:
            flex;

          align-items:
            center;

          gap: 6px;

          padding:
            6px 11px;

          border-radius:
            999px;

          background:
            rgba(229,226,238,0.16);

          border:
            1px solid
            rgba(3,3,16,0.18);

          box-shadow:
            inset 0 1px 0
            rgba(255,255,255,0.18);

          font-size:
            12px;

          color:
            inherit;

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);
        }

        .liquid-tabs {
          position:
            relative;

          display:
            flex;

          align-items:
            stretch;

          justify-content:
            stretch;

          flex:
            1 1 0;

          min-width:
            0;

          max-width:
            640px;

          padding:
            3px;

          border-radius:
            999px;

          background:
            rgba(26,14,89,0.1);

          flex-shrink:
            1;
        }

        .liquid-active-indicator {
          position:
            absolute;

          box-sizing:
            border-box;

          top:
            3px;

          bottom:
            3px;

          left:
            3px;

          width:
            calc(
              (100% - 6px) / 4
            );

          border-radius:
            999px;

          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.72),
              rgba(255,255,255,0.38)
            );

          border:
            1px solid
            rgba(255,255,255,0.52);

          box-shadow:
            0 3px 10px
            rgba(0,0,0,0.09),
            inset 0 1px 0
            rgba(255,255,255,0.78),
            inset 0 -1px 0
            rgba(255,255,255,0.16);

          transition:
            transform 0.42s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            ),
            opacity 0.22s ease;

          pointer-events:
            none;

          z-index:
            0;
        }

        /* Each desktop tab occupies exactly one quarter of the
           navigation segment. This keeps the glass indicator
           perfectly aligned even when labels have different widths. */
        .liquid-tab {
          position:
            relative;

          box-sizing:
            border-box;

          z-index:
            1;

          display:
            flex;

          flex:
            1 1 0;

          min-width:
            0;

          align-items:
            center;

          justify-content:
            center;

          padding:
            9px 15px;

          border:
            0;

          border-radius:
            999px;

          background:
            transparent;

          color:
            inherit;

          font-size:
            13px;

          font-weight:
            500;

          cursor:
            pointer;

          white-space:
            nowrap;

          transition:
            transform 0.22s ease,
            opacity 0.22s ease,
            color 0.22s ease;
        }

        .liquid-tab:hover {
          transform:
            translateY(-1px)
            scale(1.015);

          opacity:
            1;
        }

        .liquid-tab:active {
          transform:
            scale(0.98);
        }

        .liquid-tab:not(.is-active) {
          opacity:
            0.72;
        }

        .liquid-tab.is-active {
          opacity:
            1;

          font-weight:
            600;
        }

        .liquid-tab:focus-visible {
          outline:
            2px solid
            rgba(56,189,248,0.85);

          outline-offset:
            2px;
        }

        .liquid-action {
          display:
            flex;

          align-items:
            center;

          gap: 7px;

          flex-shrink:
            0;
        }

        .liquid-get-in-touch {
          padding:
            9px 16px;

          border-radius:
            999px;

          border:
            1px solid
            rgba(18,7,81,0.14);

          background:
            rgba(237,237,244,0.11);

          color:
            inherit;

          box-shadow:
            inset 0 1px 0
            rgba(34,12,156,0.2);

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);

          transition:
            transform 0.22s ease,
            background 0.22s ease,
            box-shadow 0.22s ease;
        }

        .liquid-get-in-touch:hover {
          transform:
            translateY(-1px);

          background:
            rgba(244,238,238,0.2);

          box-shadow:
            0 5px 16px
            rgba(254,249,249,0.1),
            inset 0 1px 0
            rgba(223,221,235,0.34);
        }

        .liquid-menu-button {
          width:
            36px;

          height:
            36px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid
            rgba(28,10,66,0.16);

          border-radius:
            50%;

          background:
            rgba(255,255,255,0.14);

          color:
            inherit;

          cursor:
            pointer;

          backdrop-filter:
            blur(12px);

          -webkit-backdrop-filter:
            blur(12px);

          transition:
            transform 0.22s ease,
            background 0.22s ease;
        }

        .liquid-menu-button:hover {
          transform:
            scale(1.05);

          background:
            rgba(255,255,255,0.22);
        }

        /* ============================
           LIGHT NAV
           ============================ */

        /* The light navbar must remain readable even when the
           portfolio itself is still in dark mode. */
        .liquid-nav[data-dark="false"] {
          color: #173A5E;
          border-color: rgba(23,58,94,0.16);
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.78),
              rgba(235,248,255,0.58)
            );
          box-shadow:
            0 16px 42px rgba(17,52,74,0.18),
            0 5px 16px rgba(17,52,74,0.10),
            inset 0 1px 0 rgba(255,255,255,0.88),
            inset 0 -1px 0 rgba(23,58,94,0.06);
        }

        .liquid-nav[data-dark="false"] .liquid-nav-time {
          color: #173A5E;
          border-color: rgba(23,58,94,0.18);
          background: rgba(255,255,255,0.34);
        }

        .liquid-nav[data-dark="false"] .liquid-tab {
          color: #173A5E;
        }

        .liquid-nav[data-dark="false"] .liquid-get-in-touch,
        .liquid-nav[data-dark="false"] .liquid-menu-button {
          color: #173A5E;
          border-color: rgba(23,58,94,0.18);
          background: rgba(255,255,255,0.28);
        }

        /* Keep the clock text dark when only the navbar switches to light mode. */
        .liquid-nav[data-dark="false"] .liquid-nav-time > span:first-child {
          color: #173A5E !important;
        }

        .liquid-nav[data-dark="false"] .liquid-tabs {
          background: rgba(71,122,153,0.13);
        }

        .liquid-nav[data-dark="false"] .liquid-active-indicator {
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.88),
              rgba(255,255,255,0.58)
            );
          border-color: rgba(255,255,255,0.90);
          box-shadow:
            0 4px 14px rgba(23,58,94,0.12),
            inset 0 1px 0 rgba(255,255,255,0.95),
            inset 0 -1px 0 rgba(23,58,94,0.05);
        }

        /* ============================
           DARK NAV
           ============================ */

        .liquid-nav[data-dark="true"] {
          border-color:
            rgba(255,255,255,0.12);

          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.13),
              rgba(255,255,255,0.055)
            );

          box-shadow:
            0 16px 42px
            rgba(0,0,0,0.38),
            0 5px 16px
            rgba(0,0,0,0.22),
            inset 0 1px 0
            rgba(255,255,255,0.18);
        }

        .liquid-nav[data-dark="true"] {
          color: #F8FAFC;
        }

        .liquid-nav[data-dark="true"] .liquid-nav-time {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.10);
        }

        .liquid-nav[data-dark="true"] .liquid-get-in-touch,
        .liquid-nav[data-dark="true"] .liquid-menu-button {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.10);
          color: #F8FAFC;
        }

        .liquid-nav[data-dark="true"]
        .liquid-active-indicator {
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.24),
              rgba(255,255,255,0.11)
            );

          border-color:
            rgba(255,255,255,0.22);

          box-shadow:
            0 4px 14px
            rgba(0,0,0,0.22),
            inset 0 1px 0
            rgba(255,255,255,0.22);
        }

        /* ============================
           MOBILE
           ============================ */

        /* Desktop navigation above remains unchanged.
           Mobile navigation is intentionally compact and
           follows the reference liquid-glass layout. */

        .mobile-liquid-tabs {
          display: none;
        }

        .mobile-contact-button {
          display: none;
        }

        @media (max-width: 760px) {
          .liquid-nav {
            width: calc(100% - 28px);
            max-width: 540px;
            min-height: 58px;
            padding: 5px;
            gap: 5px;
            justify-content: flex-start;
            border-radius: 999px;
          }

          /* Compact DK + time group */
          .liquid-nav-brand {
            padding-left: 5px;
            gap: 5px;
            flex: 0 0 auto;
            min-width: 0;
          }

          .liquid-nav-initials {
            font-size: 13px;
            letter-spacing: 0.2px;
          }

          .liquid-nav-time {
            gap: 0;
            padding: 6px 8px;
            min-height: 32px;
            box-sizing: border-box;
            font-size: 10.5px;
            white-space: nowrap;
          }

          /* The desktop emoji remains untouched. On mobile
             it is hidden so the time group stays compact. */
          .liquid-nav-time > span:last-child {
            display: none;
          }

          /* Main mobile icon segment */
          .mobile-liquid-tabs {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: stretch;
            flex: 1 1 auto;
            min-width: 0;
            height: 42px;
            padding: 3px;
            border-radius: 999px;
            background: rgba(26, 14, 89, 0.10);
            overflow: hidden;
          }

          .mobile-liquid-active-indicator {
            --active-size: 42px;
            position: absolute;
            top: 50%;
            left: calc(
              3px +
              (var(--active-index, 0) * ((100% - 6px) / 4)) +
              ((((100% - 6px) / 4) - var(--active-size)) / 2)
            );
            width: var(--active-size);
            height: 36px;
            transform: translateY(-50%);
            border-radius: 999px;
            background: linear-gradient(
              180deg,
              rgba(255,255,255,0.72),
              rgba(255,255,255,0.38)
            );
            border: 1px solid rgba(255,255,255,0.52);
            box-shadow:
              0 3px 10px rgba(0,0,0,0.09),
              inset 0 1px 0 rgba(255,255,255,0.78),
              inset 0 -1px 0 rgba(255,255,255,0.16);
            transition:
              transform 0.42s cubic-bezier(0.22,1,0.36,1),
              opacity 0.22s ease;
            pointer-events: none;
            z-index: 0;
          }

          .mobile-liquid-tab {
            position: relative;
            z-index: 1;
            flex: 1 1 0;
            min-width: 0;
            height: 36px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 999px;
            background: transparent;
            color: inherit;
            cursor: pointer;
            opacity: 0.68;
            transition:
              transform 0.22s ease,
              opacity 0.22s ease,
              color 0.22s ease;
            -webkit-tap-highlight-color: transparent;
          }

          .mobile-liquid-tab svg {
            width: 20px;
            height: 20px;
            stroke-width: 2.15;
            flex-shrink: 0;
            filter: drop-shadow(0 1px 1px rgba(0,0,0,0.08));
          }

          .mobile-liquid-tab:hover {
            transform: translateY(-1px) scale(1.03);
            opacity: 1;
          }

          .mobile-liquid-tab:active {
            transform: scale(0.94);
          }

          .mobile-liquid-tab.is-active {
            opacity: 1;
          }

          .mobile-liquid-tab:focus-visible,
          .mobile-contact-button:focus-visible,
          .liquid-menu-button:focus-visible {
            outline: 2px solid rgba(56,189,248,0.85);
            outline-offset: 2px;
          }

          /* Email is deliberately outside the icon segment,
             matching the separate hamburger treatment. */
          .mobile-contact-button {
            width: 40px;
            height: 40px;
            flex: 0 0 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border: 1px solid rgba(28,10,66,0.16);
            border-radius: 50%;
            background: rgba(255,255,255,0.14);
            color: inherit;
            cursor: pointer;
            text-decoration: none;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.20),
              0 2px 8px rgba(0,0,0,0.06);
            transition:
              transform 0.22s ease,
              background 0.22s ease,
              box-shadow 0.22s ease;
          }

          .mobile-contact-button:hover {
            transform: scale(1.05);
            background: rgba(255,255,255,0.22);
          }

          .mobile-contact-button:active {
            transform: scale(0.95);
          }

          .mobile-contact-button svg {
            width: 19px;
            height: 19px;
            stroke-width: 2.1;
          }

          .liquid-action {
            gap: 5px;
            flex-shrink: 0;
          }

          .liquid-action .liquid-get-in-touch {
            display: none;
          }

          .liquid-menu-button {
            width: 40px;
            height: 40px;
            flex: 0 0 40px;
          }

          .liquid-menu-button svg {
            width: 19px;
            height: 19px;
            stroke-width: 2;
          }

          .portfolio-root[data-dark="true"]
          .mobile-liquid-tabs {
            background: rgba(8, 27, 44, 0.18);
          }

          .portfolio-root[data-dark="true"]
          .mobile-liquid-active-indicator {
            background: linear-gradient(
              180deg,
              rgba(255,255,255,0.24),
              rgba(255,255,255,0.11)
            );
            border-color: rgba(255,255,255,0.22);
            box-shadow:
              0 4px 14px rgba(0,0,0,0.22),
              inset 0 1px 0 rgba(255,255,255,0.22);
          }

          .portfolio-root[data-dark="true"]
          .mobile-contact-button {
            border-color: rgba(255,255,255,0.16);
            background: rgba(255,255,255,0.10);
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.18),
              0 2px 8px rgba(0,0,0,0.16);
          }

          .portfolio-root[data-dark="true"]
          .mobile-contact-button:hover {
            background: rgba(255,255,255,0.18);
          }

          .portfolio-bird-container {
            top: 12%;
          }

          .portfolio-bird {
            width: 70px;
            height: 100px;
          }

          .hero-role-glass {
            font-size: 10px;
            padding: 5px 9px;
          }
        }

        @media (max-width: 430px) {
          .liquid-nav {
            width: calc(100% - 20px);
            min-height: 56px;
            padding: 4px;
            gap: 4px;
          }

          .liquid-nav-brand {
            gap: 4px;
            padding-left: 4px;
          }

          .liquid-nav-initials {
            font-size: 12.5px;
          }

          .liquid-nav-time {
            padding: 6px 7px;
            font-size: 10px;
          }

          .mobile-liquid-tabs {
            height: 40px;
            padding: 2px;
          }

          .mobile-liquid-active-indicator {
            --active-size: 40px;
            height: 35px;
          }

          .mobile-liquid-tab {
            height: 35px;
          }

          .mobile-liquid-tab svg {
            width: 18px;
            height: 18px;
          }

          .mobile-contact-button,
          .liquid-menu-button {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }

          .mobile-contact-button svg,
          .liquid-menu-button svg {
            width: 18px;
            height: 18px;
          }
        }

        /* ============================
           REFERENCE POLAROID CAMERA
           ============================ */

        .polaroid-camera-wrap {
          position: relative;
        }

        .reference-polaroid-camera {
          position: relative;
          width: 100%;
          aspect-ratio: 1.38 / 1;
          overflow: hidden;
          border-radius: 28px;
          background:
            linear-gradient(
              180deg,
              #fbfbfd 0%,
              #e9e8eb 70%,
              #3b393b 70%,
              #252426 100%
            );
          box-shadow:
            0 26px 55px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.96);
          isolation: isolate;
        }

        .reference-camera-top {
          position: absolute;
          inset: 0 0 30% 0;
        }

        .reference-camera-bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 30%;
        }

        .reference-camera-flash {
          position: absolute;
          left: 7%;
          top: 9%;
          width: 14%;
          height: 53%;
          border-radius: 15px;
          border: 3px solid #444247;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(30,30,30,0.18) 0 2px,
              rgba(255,255,255,0.72) 2px 4px
            ),
            linear-gradient(
              90deg,
              #d2d2d2,
              #ffffff,
              #c9c9c9
            );
          box-shadow:
            inset 0 0 0 2px rgba(255,255,255,0.72),
            0 5px 10px rgba(0,0,0,0.18);
        }

        .reference-camera-timer {
          position: absolute;
          left: 25%;
          top: 14%;
          width: 4.5%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #f4f4f4;
          border: 1px solid #a9a9ab;
          box-shadow: 0 2px 4px rgba(0,0,0,0.18);
        }

        .reference-camera-sensor {
          position: absolute;
          left: 25.5%;
          top: 25%;
          width: 3.4%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #121214;
          border: 3px solid #303033;
          box-shadow: 0 2px 4px rgba(0,0,0,0.25);
        }

        .reference-camera-lens {
          position: absolute;
          left: 50%;
          top: 43%;
          width: 39%;
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
          padding: 0;
          border: 12px solid #111113;
          border-radius: 50%;
          background:
            repeating-radial-gradient(
              circle,
              #29292c 0 2px,
              #101012 2px 4px
            );
          box-shadow:
            0 18px 32px rgba(0,0,0,0.35),
            inset 0 0 0 4px #050507;
          cursor: pointer;
          overflow: hidden;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .reference-camera-lens:hover {
          transform:
            translate(-50%, -50%)
            scale(1.025);
          box-shadow:
            0 20px 38px rgba(0,0,0,0.40),
            inset 0 0 0 4px #050507;
        }

        .reference-camera-lens:active {
          transform:
            translate(-50%, -50%)
            scale(0.985);
        }

        .reference-camera-glass {
          position: absolute;
          inset: 18%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at 45% 38%,
              #536b63 0 7%,
              #17171b 20%,
              #070709 55%,
              #151519 100%
            );
          box-shadow:
            inset 0 0 0 2px rgba(255,255,255,0.08),
            inset 0 0 20px rgba(0,0,0,0.5);
        }

        .reference-lens-label {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          color: #e5e5e5;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.45px;
        }

        .reference-camera-shutter {
          position: absolute;
          left: 7%;
          top: 70%;
          width: 11%;
          aspect-ratio: 1;
          border: 0;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 35% 30%,
              #e99a96,
              #c76f6c
            );
          color: #fff;
          box-shadow:
            0 5px 0 #995956,
            0 8px 15px rgba(0,0,0,0.20);
          cursor: not-allowed;
        }

        .reference-shutter-label {
          font-size: 12px;
          font-weight: 600;
        }

        .reference-camera-viewfinder {
          position: absolute;
          right: 7%;
          top: 10%;
          width: 19%;
          aspect-ratio: 1;
          border-radius: 18px;
          border: 3px solid #3d3b3f;
          background:
            linear-gradient(
              145deg,
              #111112,
              #3c3a3d 50%,
              #09090a
            );
          box-shadow:
            inset 0 0 0 3px rgba(255,255,255,0.08),
            0 6px 12px rgba(0,0,0,0.25);
          overflow: hidden;
        }

        .reference-camera-viewfinder .reference-camera-glass {
          inset: 20%;
          background:
            linear-gradient(
              145deg,
              #f5f5f7,
              #cfcfd2
            );
          border-radius: 10px;
          box-shadow:
            inset 0 2px 4px rgba(0,0,0,0.22);
        }

        .reference-viewfinder-back {
          width: 100%;
          height: 100%;
          border-radius: inherit;
        }

        .reference-camera-toggle-container {
          position: absolute;
          right: 10%;
          top: 50%;
          width: 9%;
          height: 5%;
          border-radius: 999px;
          background: #c77f00;
        }

        .reference-camera-toggle {
          position: absolute;
          left: 45%;
          top: 0;
          width: 55%;
          height: 100%;
          border-radius: 50%;
          background: #ffcc35;
          box-shadow: 0 1px 2px rgba(0,0,0,0.20);
        }

        .reference-camera-power {
          position: absolute;
          right: 27%;
          top: 69%;
          width: 5%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #08080a;
          border: 4px solid #2e2e31;
          box-shadow: 0 3px 5px rgba(0,0,0,0.25);
        }

        .reference-bottom-toggle-container {
          position: absolute;
          left: 50%;
          top: -5%;
          transform: translateX(-50%);
          width: 26%;
          height: 26%;
        }

        .reference-bottom-toggle {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 0 0 15px 15px;
          background:
            linear-gradient(
              180deg,
              #6d6b6d,
              #353336 48%,
              #1e1d1f
            );
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.22);
        }

        .reference-bottom-handle {
          position: absolute;
          right: 7%;
          top: 18%;
          width: 22%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #4a484b;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.35);
        }

        .reference-camera-printer {
          position: absolute;
          left: 9%;
          right: 9%;
          top: 36%;
          height: 28%;
          border-radius: 4px;
          border: 5px solid #4c4a4d;
          background:
            linear-gradient(
              180deg,
              #4c4a4d,
              #151416 35%,
              #28272a 70%,
              #111112
            );
          box-shadow:
            inset 0 0 0 2px #080809;
        }

        .reference-print-track {
          position: absolute;
          left: 13%;
          right: 13%;
          top: 44%;
          height: 8%;
          border-radius: 2px;
          background: #151416;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12);
        }

        .reference-camera-labels {
          position: absolute;
          left: 13%;
          right: 13%;
          bottom: 7%;
          height: 30%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reference-camera-rainbow {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 8%;
          height: 85%;
          display: flex;
          flex-direction: column;
        }

        .reference-camera-rainbow i {
          flex: 1;
        }

        .reference-camera-rainbow i:nth-child(1) {
          background: #14a8e5;
        }

        .reference-camera-rainbow i:nth-child(2) {
          background: #0dbb72;
        }

        .reference-camera-rainbow i:nth-child(3) {
          background: #ffd11a;
        }

        .reference-camera-rainbow i:nth-child(4) {
          background: #ff8a00;
        }

        .reference-camera-rainbow i:nth-child(5) {
          background: #e73532;
        }

        .reference-camera-logo {
          color: #dddadd;
          font-size: clamp(18px, 3vw, 30px);
          font-weight: 700;
          letter-spacing: -0.6px;
        }

        .reference-camera-type {
          position: absolute;
          right: 0;
          width: 13%;
          height: 10%;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
        }

        /* ============================
           CAMERA ACCESS / LIVE / RESULT
           ============================ */

        .polaroid-access-card,
        .polaroid-live-card {
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
          box-sizing: border-box;
          border-radius: 24px;
          background:
            linear-gradient(
              180deg,
              rgba(255,255,255,0.14),
              rgba(255,255,255,0.06)
            );
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow:
            0 24px 50px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.12);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          color: #f4f1ea;
        }

        .polaroid-access-card {
          position: relative;
          padding: 42px 28px 28px;
          text-align: center;
        }

        .polaroid-close-button {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .polaroid-access-icon {
          width: 58px;
          height: 58px;
          margin: 0 auto 16px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .polaroid-access-card h3 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .polaroid-access-card p {
          margin: 0 auto 20px;
          max-width: 310px;
          color: rgba(244,241,234,0.65);
          font-size: 13px;
          line-height: 1.6;
        }

        .polaroid-camera-error {
          margin: 0 auto 14px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(220,70,70,0.13);
          border: 1px solid rgba(255,120,120,0.20);
          color: #ffc9c9;
          font-size: 11px;
          line-height: 1.5;
        }

        .polaroid-primary-button,
        .polaroid-secondary-button,
        .polaroid-live-shutter,
        .polaroid-retake,
        .polaroid-download {
          border: 0;
          font-family: inherit;
          cursor: pointer;
        }

        .polaroid-primary-button {
          width: 100%;
          padding: 13px 18px;
          border-radius: 999px;
          background: #f4f1ea;
          color: #171512;
          font-size: 13px;
          font-weight: 600;
        }

        .polaroid-secondary-button {
          margin-top: 11px;
          background: transparent;
          color: rgba(244,241,234,0.68);
          font-size: 12px;
        }

        .polaroid-live-card {
          padding: 14px;
        }

        .polaroid-live-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2px 4px 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .polaroid-live-header button {
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .polaroid-live-preview {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: 18px;
          background: #09090a;
          border: 1px solid rgba(255,255,255,0.12);
        }

        .polaroid-live-video {
          width: 100%;
          height: 100%;
          
          display: block;
          object-fit: cover;
          transform: scaleX(-1);
        }

        .polaroid-focus-frame {
          position: absolute;
          inset: 11%;
          border: 1px solid rgba(255,255,255,0.40);
          border-radius: 18px;
          pointer-events: none;
        }

        .polaroid-live-shutter {
          width: 100%;
          margin-top: 14px;
          padding: 13px 18px;
          border-radius: 999px;
          background: #f4f1ea;
          color: #171512;
          font-size: 13px;
          font-weight: 600;
        }

        .polaroid-live-shutter span {
          display: inline-block;
          width: 9px;
          height: 9px;
          margin-right: 7px;
          border-radius: 50%;
          background: #c96f6f;
          box-shadow:
            0 0 0 3px rgba(201,111,111,0.16);
        }

        .polaroid-result-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .captured-polaroid {
          width: min(340px, 82vw);
          padding: 14px 14px 42px;
          background: #fff;
          border-radius: 2px;
          box-shadow:
            0 20px 42px rgba(0,0,0,0.34);
          transform: rotate(-1.2deg);
          animation:
            polaroidPrintIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }

        .captured-polaroid-image {
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background: #ddd;
        }

        .captured-polaroid-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .captured-polaroid-date {
          margin-top: 11px;
          text-align: center;
          color: #3e3934;
          font-family: "Fraunces", serif;
          font-size: 12px;
          font-style: italic;
        }

        .polaroid-result-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 28px;
        }

        .polaroid-retake,
        .polaroid-download {
          padding: 11px 20px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .polaroid-retake {
          background: #39373a;
          color: #fff;
          box-shadow:
            0 6px 14px rgba(0,0,0,0.20);
        }

        .polaroid-download {
          background: #fff;
          color: #242224;
          box-shadow:
            0 6px 14px rgba(0,0,0,0.12);
        }

        @keyframes polaroidPrintIn {
          from {
            opacity: 0;
            transform:
              translateY(-24px)
              rotate(-1.2deg);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              rotate(-1.2deg);
          }
        }

        @media (max-width: 640px) {
          /* =====================================================
             POLAROID CAMERA — MOBILE ONLY
             Keep desktop completely unchanged.
             ===================================================== */
          #polaroid-camera {
            /* A phone-friendly 9:16 section, but never shorter than
               the visible mobile viewport. */
            min-height: max(177.7778vw, 100svh);
            height: max(177.7778vw, 100svh);
            box-sizing: border-box;
            padding: 30px 16px 34px !important;
            margin: 0 !important;
            scroll-margin-top: 0 !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          #polaroid-camera > div {
            width: 100%;
            max-width: 720px;
            height: 100%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            box-sizing: border-box;
          }

          #polaroid-camera h2 {
            flex: 0 0 auto;
            margin-top: 0 !important;
            margin-bottom: 8px !important;
          }

          #polaroid-camera p {
            flex: 0 0 auto;
            margin-bottom: 18px !important;
            max-width: min(330px, 88vw) !important;
          }

          #polaroid-camera .polaroid-camera-wrap {
            width: min(100%, 350px);
            max-width: 350px;
            flex: 0 0 auto;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .reference-polaroid-camera {
            width: 100%;
            border-radius: 22px;
          }

          .reference-camera-lens {
            border-width: 9px;
          }

          .reference-lens-label {
            font-size: 6px;
          }

          .reference-shutter-label {
            font-size: 9px;
          }

          .reference-camera-logo {
            font-size: 19px;
          }

          .polaroid-access-card {
            width: min(100%, 350px);
            max-height: min(68svh, 430px);
            overflow-y: auto;
            padding: 30px 18px 22px;
            box-sizing: border-box;
            margin: 0 auto;
          }

          .polaroid-live-card {
            width: min(100%, 350px);
            max-height: min(72svh, 470px);
            margin: 0 auto;
          }

          .polaroid-result-wrap {
            width: 100%;
            max-width: 350px;
            margin: 0 auto;
          }

          .captured-polaroid {
            width: min(300px, 82vw);
            max-width: 100%;
          }
        }

        /* ============================================================
           MOBILE FULL-SCREEN SECTION FIT — STL + SOCIALS
           ============================================================ */

        @media (max-width: 640px) {
          /*
           * Keep these sections visually self-contained on phones.
           * Desktop sizing is not changed.
           */
          .stl-model-section {
            min-height: max(100svh, calc(100vw * 16 / 9));
            height: auto;
            box-sizing: border-box;
            padding: 44px 16px 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .stl-model-container {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
          }

          .stl-model-heading {
            margin: 0 auto 20px;
            max-width: 100%;
          }

          .stl-model-heading h2 {
            font-size: clamp(24px, 7vw, 30px);
          }

          .stl-model-heading p {
            max-width: 92%;
            margin-left: auto;
            margin-right: auto;
            font-size: 11px;
            line-height: 1.55;
          }

          /*
           * The existing 390px mobile viewer is replaced with a
           * responsive viewer that fits the 9:16 section cleanly.
           */
          .stl-viewer-shell {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
          }

          .stl-viewer {
            width: 100%;
            height: min(52vw, 360px);
            min-height: 270px;
            max-height: 360px;
            border-radius: 20px;
          }

          .stl-viewer-hint {
            left: 10px;
            bottom: 10px;
            max-width: calc(100% - 20px);
            font-size: 9px;
            padding: 6px 8px;
          }

          .stl-viewer-controls {
            transform: scale(0.88);
            transform-origin: bottom right;
          }

          /*
           * SOCIALS / FOOTER
           * Full mobile viewport with centered content and
           * enough top/bottom space to hide neighboring sections.
           */
          .socials-footer-lightfall {
            min-height: max(100svh, calc(100vw * 16 / 9));
            height: auto;
            box-sizing: border-box;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .socials-footer-content {
            width: 100%;
            max-width: 100%;
            min-height: max(100svh, calc(100vw * 16 / 9));
            padding: 54px 18px 54px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .socials-lightfall-grid {
            width: 100%;
            max-width: 320px;
            margin: 0 auto 18px;
            gap: 9px;
          }

          .social-glass-pill {
            min-height: 48px;
            padding: 10px 12px;
            font-size: 12px;
          }
        }

        /* ============================
           REDUCED MOTION
           ============================ */

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior:
              auto;
          }

          .portfolio-bird-container,
          .portfolio-bird,
          .name-wobble,
          .float-in,
          .greeting-word,
          .captured-polaroid {
            animation:
              none !important;
          }

          .liquid-active-indicator,
          .liquid-tab,
          .liquid-get-in-touch,
          .liquid-menu-button,
          .reference-camera-lens {
            transition:
              none !important;
          }
        }
        /* ============================
           FINAL DARK-MODE BLUE CONTRAST
           ============================ */

        .portfolio-root[data-dark="true"] .content-glass-section h2 {
          color: #0B2E49 !important;
          text-shadow: none !important;
        }

        .portfolio-root[data-dark="true"] .project-glass-card {
          color: #102F47 !important;
        }

        .portfolio-root[data-dark="true"] .project-glass-card span {
          color: #102F47 !important;
        }

        .portfolio-root[data-dark="true"] .project-glass-card p {
          color: #F4F8FB !important;
          opacity: 1 !important;
          text-shadow: 0 1px 2px rgba(0,18,35,0.22);
        }

        .portfolio-root[data-dark="true"] .project-glass-card svg {
          color: #28556F !important;
          stroke: #28556F !important;
          opacity: 1 !important;
        }

        .portfolio-root[data-dark="true"] .project-glass-card .project-tag-glass {
          color: #063B5C !important;
        }

        .portfolio-root[data-dark="true"] .skills-glass-section {
          color: #123A55 !important;
        }

        .portfolio-root[data-dark="true"] .skills-glass-section h2 {
          color: #0B2E49 !important;
        }

        .portfolio-root[data-dark="true"] .skill-glass-pill {
          color: #063B5C !important;
        }

        .portfolio-root[data-dark="true"] .education-glass-section {
          color: #123A55 !important;
        }

        .portfolio-root[data-dark="true"] .education-glass-section h2 {
          color: #0B2E49 !important;
        }

        .portfolio-root[data-dark="true"] .education-glass-card {
          color: #102F47 !important;
        }

        .portfolio-root[data-dark="true"] .education-glass-card span {
          color: #102F47 !important;
        }

        .portfolio-root[data-dark="true"] .education-glass-card > div:first-child > span:last-child {
          color: #315A70 !important;
        }

        .portfolio-root[data-dark="true"] .education-glass-card > div:last-child {
          color: #F4F8FB !important;
          opacity: 1 !important;
          text-shadow: 0 1px 2px rgba(0,18,35,0.22);
        }

        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn {
          color: #0B2E49 !important;
        }

        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn:hover {
          color: #062B43 !important;
        }

        .portfolio-root[data-dark="true"] {
          background-color: #07131D !important;
          background-image:
            radial-gradient(
              circle at 50% 0%,
              rgba(14,72,105,0.20),
              transparent 42%
            ),
            linear-gradient(
              to right,
              rgba(137, 178, 202, 0.12) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(137, 178, 202, 0.12) 1px,
              transparent 1px
            ) !important;
          background-size: auto, 40px 40px, 40px 40px !important;
          background-position: center top, 0 0, 0 0 !important;
        }
        /* Requested dark-mode labels — crisp and readable on blue glass. */
        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn,
        .portfolio-root[data-dark="true"] .content-glass-section > h2,
        .portfolio-root[data-dark="true"] .education-period {
          color: #040a0f !important;
          opacity: 1 !important;
          text-shadow: 0 1px 2px rgba(0,18,35,0.22);
        }

        /* High-contrast white body text on blue glass in dark mode. */
        .portfolio-root[data-dark="true"] .project-description {
          color: #F4F8FB !important;
          opacity: 1 !important;
          text-shadow: 0 1px 2px rgba(0,18,35,0.22);
        }

        .portfolio-root[data-dark="true"] .education-degree {
          color: #F4F8FB !important;
          opacity: 1 !important;
          text-shadow: 0 1px 2px rgba(0,18,35,0.22);
        }
\n        /* ============================================================\n           ABOUT TABS — SINGLE LIQUID-GLASS BAR\n           Inactive tabs are transparent. Only the selected tab pops.\n           ============================================================ */\n\n        .about-tabs-glass {\n          position: relative;\n          isolation: isolate;\n          overflow: hidden;\n          background: linear-gradient(\n            180deg,\n            rgba(255, 255, 255, 0.18) 0%,\n            rgba(255, 255, 255, 0.08) 48%,\n            rgba(10, 25, 40, 0.18) 100%\n          ) !important;\n          border: 1px solid rgba(255, 255, 255, 0.28) !important;\n          box-shadow:\n            0 8px 26px rgba(0, 0, 0, 0.18),\n            inset 0 1px 0 rgba(255, 255, 255, 0.38),\n            inset 0 -1px 0 rgba(255, 255, 255, 0.08) !important;\n          backdrop-filter: blur(22px) saturate(165%);\n          -webkit-backdrop-filter: blur(22px) saturate(165%);\n        }\n\n        .about-tabs-glass::before {\n          content: "";\n          position: absolute;\n          inset: 1px;\n          z-index: -1;\n          border-radius: inherit;\n          pointer-events: none;\n          background: linear-gradient(\n            120deg,\n            rgba(255, 255, 255, 0.14),\n            transparent 42%,\n            rgba(56, 189, 248, 0.07)\n          );\n        }\n\n        .about-tabs-glass .tab-btn {\n          position: relative;\n          z-index: 1;\n          flex: 0 0 auto;\n          background: transparent !important;\n          border: 1px solid transparent !important;\n          box-shadow: none !important;\n          transform: none !important;\n          color: inherit;\n          backdrop-filter: none;\n          -webkit-backdrop-filter: none;\n          transition:\n            background 0.25s ease,\n            border-color 0.25s ease,\n            box-shadow 0.25s ease,\n            transform 0.25s ease;\n        }\n\n        .about-tabs-glass .tab-btn:hover {\n          background: transparent !important;\n          border-color: transparent !important;\n          box-shadow: none !important;\n          transform: none !important;\n        }\n\n        .about-tabs-glass .tab-btn.is-active,\n        .about-tabs-glass .tab-btn[aria-selected="true"] {\n          background: linear-gradient(\n            180deg,\n            rgba(224, 242, 254, 0.34) 0%,\n            rgba(125, 211, 252, 0.16) 100%\n          ) !important;\n          border-color: rgba(224, 242, 254, 0.34) !important;\n          box-shadow:\n            0 4px 14px rgba(0, 0, 0, 0.18),\n            inset 0 1px 0 rgba(255, 255, 255, 0.50),\n            inset 0 -1px 0 rgba(255, 255, 255, 0.10) !important;\n          transform: translateY(-1px) !important;\n        }\n\n        .portfolio-root[data-dark="true"] .about-tabs-glass {\n          background: linear-gradient(\n            180deg,\n            rgba(56, 189, 248, 0.15) 0%,\n            rgba(30, 64, 175, 0.10) 50%,\n            rgba(2, 18, 31, 0.28) 100%\n          ) !important;\n          border-color: rgba(125, 211, 252, 0.28) !important;\n          box-shadow:\n            0 9px 28px rgba(0, 0, 0, 0.32),\n            0 2px 10px rgba(14, 116, 144, 0.10),\n            inset 0 1px 0 rgba(255, 255, 255, 0.28),\n            inset 0 -1px 0 rgba(125, 211, 252, 0.08) !important;\n        }\n\n        .portfolio-root[data-dark="true"] .about-tabs-glass::before {\n          background: linear-gradient(\n            120deg,\n            rgba(255, 255, 255, 0.10),\n            transparent 42%,\n            rgba(56, 189, 248, 0.08)\n          );\n        }\n\n        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn,\n        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn:hover {\n          color: #F4F8FB !important;\n          background: transparent !important;\n          border-color: transparent !important;\n          box-shadow: none !important;\n          transform: none !important;\n          text-shadow: 0 1px 2px rgba(0, 18, 35, 0.30);\n        }\n\n        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn.is-active,\n        .portfolio-root[data-dark="true"] .about-tabs-glass .tab-btn[aria-selected="true"] {\n          color: #FFFFFF !important;\n          background: linear-gradient(\n            180deg,\n            rgba(224, 242, 254, 0.32) 0%,\n            rgba(56, 189, 248, 0.18) 100%\n          ) !important;\n          border-color: rgba(224, 242, 254, 0.32) !important;\n          box-shadow:\n            0 5px 16px rgba(0, 0, 0, 0.24),\n            0 0 14px rgba(56, 189, 248, 0.08),\n            inset 0 1px 0 rgba(255, 255, 255, 0.46),\n            inset 0 -1px 0 rgba(125, 211, 252, 0.10) !important;\n          transform: translateY(-1px) !important;\n        }\n\n        @media (max-width: 640px) {\n          .about-tabs-glass {\n            width: 100%;\n            justify-content: space-between;\n          }\n\n          .about-tabs-glass .tab-btn {\n            flex: 1;\n            padding: 8px 10px;\n            font-size: 12px;\n          }\n        }\n

        /* ============================
           FOLDER FLOAT — SELECTED WORK
           ============================ */

        .folder-float {
          --ff-w: 200px;
          --ff-h: 148px;
          --ff-r: 14px;
          --ff-tab: 14px;
          --ff-back: #3f3f46;
          --ff-front: #52525b;
          --ff-paper: #f5f5f5;
          --ff-item: #f5f5f5;
          --ff-item-ink: #18181b;
          --ff-label: #f5f5f5;
          --ff-spread: 180px;
          --ff-lift: 26px;
          --ff-angle: 34deg;
          --ff-rest: 16deg;
          --ff-open: 520ms;
          --ff-close: 312ms;
          --ff-stagger: 45ms;
          --ff-n: 6;
          --ff-spring: cubic-bezier(0.34, 1.57, 0.64, 1);
          --ff-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
          display: inline-block;
          width: var(--ff-w);
          padding-top: var(--ff-tab);
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          line-height: 1;
        }

        .folder-float__folder { position: relative; width: var(--ff-w); height: var(--ff-h); }
        .folder-float__back { position: absolute; inset: 0; z-index: 0; border-radius: var(--ff-r); background: var(--ff-back); transform: perspective(600px) rotateX(8deg); transform-origin: 50% 100%; }
        .folder-float__back::before { content: ''; position: absolute; top: calc(-1 * var(--ff-tab)); left: 0; width: 42%; height: calc(var(--ff-tab) + var(--ff-r)); border-radius: var(--ff-r) var(--ff-r) 0 0; background: inherit; }
        .folder-float__paper { position: absolute; top: 10%; z-index: 1; right: 8%; left: 8%; height: 50%; border-radius: 6px; background: var(--ff-paper); opacity: 0; transform: translateY(10px); transition: transform var(--ff-close) var(--ff-ease-out), opacity var(--ff-close) ease; }
        .folder-float__front { position: absolute; right: 0; bottom: 0; left: 0; z-index: 2; display: flex; flex-direction: column; justify-content: flex-end; gap: 5px; height: 76%; padding: 14px 16px; box-sizing: border-box; border-radius: var(--ff-r); background: linear-gradient(180deg, color-mix(in srgb, var(--ff-front) 92%, #fff), var(--ff-front) 60%); color: var(--ff-label); box-shadow: 0 -10px 24px rgba(0,0,0,0.28); transform: perspective(600px) rotateX(calc(-1 * var(--ff-rest))); transform-origin: 50% 100%; transition: transform var(--ff-open) var(--ff-ease-out); }
        .folder-float__label { font-size: 13px; font-weight: 500; }
        .folder-float__sub { font-size: 11px; opacity: 0.55; }
        .folder-float__trigger { position: absolute; right: 0; bottom: 0; left: 0; z-index: 3; height: 76%; margin: 0; padding: 0; border: 0; border-radius: var(--ff-r); background: transparent; cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent; }
        .folder-float[data-open] .folder-float__front { transform: perspective(600px) rotateX(calc(-1 * var(--ff-angle))); }
        .folder-float[data-open] .folder-float__paper { opacity: 1; transform: translateY(0); transition: transform var(--ff-open) var(--ff-ease-out), opacity 200ms ease; }
        .folder-float__items { position: absolute; top: var(--ff-tab); left: 50%; z-index: 1; width: 0; height: 0; }
        .folder-float[data-open] .folder-float__items::before { content: ''; position: absolute; top: calc(-1 * (var(--ff-lift) + 120px)); left: calc(-1 * (var(--ff-spread) + 100px)); width: calc(2 * var(--ff-spread) + 200px); height: calc(var(--ff-lift) + 120px); }
        .folder-float__item { position: absolute; top: 0; left: 50%; margin: 0; padding: 0 14px; height: 34px; border: 0; border-radius: 17px; background: var(--ff-item); color: var(--ff-item-ink); font: inherit; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.14); cursor: pointer; outline: none; opacity: 0; transform: translate(-50%, 44px) scale(0.6); transform-origin: 50% 50%; pointer-events: none; -webkit-tap-highlight-color: transparent; transition: transform var(--ff-close) var(--ff-ease-out) calc((var(--ff-n) - 1 - var(--i)) * var(--ff-stagger) * 0.5), opacity 160ms ease calc((var(--ff-n) - 1 - var(--i)) * var(--ff-stagger) * 0.5 + var(--ff-close) * 0.45), scale 160ms var(--ff-ease-out); }
        .folder-float[data-open] .folder-float__item { opacity: 1; transform: translate(calc(-50% + var(--x)), var(--y)) rotate(var(--r)) scale(1); pointer-events: auto; transition: transform var(--ff-open) var(--ff-spring) calc(var(--i) * var(--ff-stagger)), opacity 160ms ease calc(var(--i) * var(--ff-stagger)), scale 160ms var(--ff-ease-out); }
        .folder-float[data-live] .folder-float__item { cursor: grab; transition: scale 160ms var(--ff-ease-out); }
        .folder-float__item[data-drag] { cursor: grabbing; }
        @media (hover: hover) and (pointer: fine) { .folder-float[data-open] .folder-float__item:hover { scale: 1.05; } }
        .folder-float[data-open] .folder-float__item:active { scale: 0.97; }
        .folder-float__item[data-pop] { animation: folder-float-pop 320ms var(--ff-ease-out); }
        .folder-float__drift { display: block; animation: folder-float-drift 3.2s ease-in-out infinite; animation-delay: calc(var(--i) * -0.7s); animation-play-state: paused; }
        .folder-float[data-open] .folder-float__drift { animation-play-state: running; }
        .folder-float[data-physics] .folder-float__drift, .folder-float[data-live] .folder-float__drift { animation: none; }
        @keyframes folder-float-drift { 0%,100% { translate: 0 0; } 50% { translate: 0 -3px; } }
        @keyframes folder-float-pop { 30% { scale: 1.1; } 100% { scale: 1; } }
        @media (prefers-reduced-motion: reduce) { .folder-float__front, .folder-float__paper { transition: opacity 200ms ease; } .folder-float[data-open] .folder-float__front { transform: perspective(600px) rotateX(calc(-1 * var(--ff-rest))); } .folder-float__paper { transform: none !important; } .folder-float__item { transition: opacity 200ms ease; } .folder-float[data-open] .folder-float__item { transition: opacity 200ms ease calc(var(--i) * var(--ff-stagger)); } .folder-float__drift { animation: none; } }
        @media (max-width: 640px) {
          /* CERTIFICATIONS / FOLDER FLOAT — MOBILE ONLY */
          .certifications-glass-section {
            overflow: visible !important;
          }

          .certifications-glass-section .certifications-folder-stage {
            width: 100%;
            min-height: 390px;
            position: relative;
            display: flex !important;
            align-items: flex-end !important;
            justify-content: center !important;
            padding: 0 0 18px !important;
            box-sizing: border-box;
            overflow: visible !important;
          }

          .certifications-glass-section .folder-float {
            --ff-w: min(180px, 48vw);
            --ff-h: min(136px, 36vw);
            --ff-spread: min(108px, 29vw);
            --ff-lift: 8px;
            --ff-tab: 12px;
            width: var(--ff-w);
            flex: 0 0 auto;
            margin: 0 auto;
          }

          .certifications-glass-section .folder-float__folder {
            width: var(--ff-w);
            height: var(--ff-h);
          }

          .certifications-glass-section .folder-float__item {
            width: min(86vw, 270px);
            max-width: min(86vw, 270px);
            min-height: 30px;
            height: auto;
            padding: 6px 9px;
            border-radius: 12px;
            font-size: 9.5px;
            line-height: 1.22;
            white-space: normal;
            overflow-wrap: anywhere;
            text-align: center;
            box-sizing: border-box;
          }

          .certifications-glass-section .folder-float__drift {
            display: block;
            width: 100%;
          }

          .certifications-glass-section .folder-float__items {
            top: var(--ff-tab);
          }
        }

        /* ============================
           SPECULAR GET-IN-TOUCH BUTTON
           ============================ */
        .specular-button {
          --sb-radius: 18px;
          --sb-tint: #ffffff;
          --sb-tint-opacity: 0;
          --sb-blur: 0px;
          --sb-text-color: #f5f5f5;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          margin: 0;
          font-family: inherit;
          font-weight: 500;
          letter-spacing: 0.01em;
          line-height: 1;
          color: var(--sb-text-color);
          background: color-mix(in srgb, var(--sb-tint) calc(var(--sb-tint-opacity) * 100%), transparent);
          border-radius: var(--sb-radius);
          backdrop-filter: blur(var(--sb-blur));
          -webkit-backdrop-filter: blur(var(--sb-blur));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 8px 24px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          outline: none;
          transition: transform 0.15s ease;
        }

        .specular-button:active {
          transform: scale(0.97);
        }

        .specular-button:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--sb-text-color) 60%, transparent);
          outline-offset: 3px;
        }

        .specular-button:disabled {
          opacity: 0.55;
          cursor: default;
        }

        .specular-button:disabled:active {
          transform: none;
        }

        .specular-button--sm {
          font-size: 0.85rem;
          padding: 10px 22px;
        }

        .specular-button--md {
          font-size: 1rem;
          padding: 14px 30px;
        }

        .specular-button--lg {
          font-size: 1.15rem;
          padding: 18px 40px;
        }

        .specular-button__fx {
          position: absolute;
          inset: -20px;
          pointer-events: none;
          z-index: 1;
        }

        .specular-button__fx canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        .specular-button__label {
          position: relative;
          z-index: 2;
        }

        .specular-nav-contact {
          padding: 9px 20px !important;
          min-height: 38px;
          box-sizing: border-box;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            0 6px 18px rgba(0, 0, 0, 0.12);
        }

        .specular-nav-contact:hover {
          transform: translateY(-1px);
        }

        /* ============================================================
           SPECULAR BORDER TREATMENT
           ------------------------------------------------------------
           A border-only animated highlight for existing elements. It
           never adds a surrounding glow, never changes layout, and
           inherits the element's exact dimensions and border radius.
           ============================================================ */
        @property --specular-border-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .specular-border-target {
          --specular-border-color: rgba(255,255,255,0.96);
          --specular-border-accent: rgba(125,211,252,0.82);
          --specular-border-opacity: 0.78;
          --specular-border-angle: 0deg;
          position: relative;
          isolation: isolate;
        }

        .specular-border-target::after {
          content: "";
          position: absolute;
          inset: 0;
          box-sizing: border-box;
          border-radius: inherit;
          padding: 1px;
          pointer-events: none;
          z-index: 20;
          opacity: var(--specular-border-opacity);
          background: conic-gradient(
            from var(--specular-border-angle),
            transparent 0deg,
            transparent 286deg,
            var(--specular-border-accent) 326deg,
            var(--specular-border-color) 344deg,
            rgba(255,255,255,0.20) 352deg,
            transparent 360deg
          );
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          animation: specularBorderSweep 4.8s linear infinite;
          will-change: transform;
        }

        .specular-border-target:hover::after {
          opacity: min(0.96, calc(var(--specular-border-opacity) + 0.12));
        }

        .portfolio-root[data-dark="true"] .specular-border-target {
          --specular-border-color: rgba(255,255,255,0.98);
          --specular-border-accent: rgba(103,232,249,0.88);
        }

        .portfolio-root[data-dark="false"] .specular-border-target {
          --specular-border-color: rgba(255,255,255,0.96);
          --specular-border-accent: rgba(14,165,233,0.68);
        }

        @keyframes specularBorderSweep {
          from {
            --specular-border-angle: 0deg;
          }
          to {
            --specular-border-angle: 360deg;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .specular-border-target::after {
            animation: none;
            opacity: 0.62;
          }
        }

        @media (max-width: 640px) {
          .specular-nav-contact {
            padding: 9px 16px !important;
          }
        }
      `}</style>

      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "96px 20px 0",
        }}
      >
        {/* ====================================================
            NAVIGATION
            ==================================================== */}

        <nav
          className="liquid-nav"
          data-dark={
            navDark ? "true" : "false"
          }
          aria-label="Primary navigation"
        >
          <div className="liquid-nav-brand">
            <button
              type="button"
              className="liquid-nav-initials"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                setActiveNav("#about");
              }}
              aria-label="Go to top of page"
              title="Go to top"
            >
              {CONTENT.initials}
            </button>

            <span className="liquid-nav-time">
              <span
                style={{
                  color: theme.ink,
                  fontWeight: 500,
                }}
              >
                {timeStr}
              </span>

              <span>
                {hour < 18 && hour >= 6
                  ? "☀️"
                  : "🌙"}
              </span>
            </span>
          </div>

          {isMobile && (
            <>
              <div
                className="mobile-liquid-tabs"
                role="tablist"
                aria-label="Portfolio sections"
              >
                <span
                  className="mobile-liquid-active-indicator"
                  style={{
                    "--active-index": Math.max(
                      0,
                      NAV_LINKS.findIndex(
                        (link) => link.href === activeNav
                      )
                    ),
                  }}
                  aria-hidden="true"
                />

                {[
                  { ...NAV_LINKS[0], icon: UserRound },
                  { ...NAV_LINKS[1], icon: BriefcaseBusiness },
                  { ...NAV_LINKS[2], icon: FolderKanban },
                  { ...NAV_LINKS[3], icon: Camera },
                ].map((link) => {
                  const Icon = link.icon;
                  const isActive = activeNav === link.href;

                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`mobile-liquid-tab ${
                        isActive ? "is-active" : ""
                      }`}
                      role="tab"
                      aria-label={link.label}
                      aria-selected={isActive}
                      aria-current={isActive ? "page" : undefined}
                      title={link.label}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection(link.href);
                      }}
                    >
                      <Icon aria-hidden="true" />
                    </a>
                  );
                })}
              </div>

              <a
                href={
                  CONTENT.socials.find(
                    (s) => s.label === "Email"
                  )?.url || "mailto:deepshikkodam@gmail.com"
                }
                className="mobile-contact-button"
                aria-label="Get in Touch"
                title="Get in Touch"
              >
                <Mail aria-hidden="true" />
              </a>
            </>
          )}

          {!isMobile && (
            <div
              className="liquid-tabs"
              role="tablist"
              aria-label="Portfolio sections"
            >
              <span
                className="liquid-active-indicator"
                style={{
                  transform:
                    `translateX(${
                      Math.max(
                        0,
                        NAV_LINKS.findIndex(
                          (link) =>
                            link.href ===
                            activeNav
                        )
                      ) * 100
                    }%)`,
                }}
                aria-hidden="true"
              />

              {NAV_LINKS.map((link) => {
                const isActive =
                  activeNav ===
                  link.href;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={
                      `liquid-tab ${
                        isActive
                          ? "is-active"
                          : ""
                      }`
                    }
                    role="tab"
                    aria-selected={
                      isActive
                    }
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault();

                      scrollToSection(
                        link.href
                      );
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          )}

          <div className="liquid-action">
            {!isMobile && (
              <SpecularButton
                size="md"
                radius={18}
                tint="#ffffff"
                tintOpacity={0}
                blur={0}
                textColor={navDark ? "#F5F5F5" : "#1F2937"}
                lineColor="#ffffff"
                baseColor={navDark ? "#315B73" : "#525252"}
                intensity={1}
                shineSize={10}
                shineFade={40}
                thickness={1}
                speed={0.35}
                followMouse
                proximity={250}
                autoAnimate={false}
                className="liquid-get-in-touch specular-nav-contact"
                onClick={() => {
                  const email =
                    CONTENT.socials.find(
                      (s) => s.label === "Email"
                    )?.url || "mailto:deepsikkodam@gmail.com";
                  window.location.href = email;
                }}
              >
                Get in Touch
              </SpecularButton>
            )}

      <button
  onClick={() => {
    // On mobile, opening the menu inserts a block below the sticky nav.
    // Some mobile browsers preserve/restore the previous scroll position
    // after that layout change, which can cancel the immediate scrollTo(0).
    // Toggle the menu first, then force the top position after React commits
    // the menu to the DOM. This keeps the desktop behavior unchanged.
    setMenuOpen((v) => !v);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });

        // Explicitly reset both scrolling roots for mobile Safari/Chrome
        // cases where the visual viewport and document root differ.
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    });
  }}
  className="liquid-menu-button specular-border-target"
  aria-label={
    menuOpen
      ? "Close menu"
      : "Open menu"
  }
  aria-expanded={menuOpen}
>
  {menuOpen ? (
    <X size={16} />
  ) : (
    <Menu size={16} />
  )}
</button>
          </div>
        </nav>

        {/* ====================================================
            MOBILE MENU
            ==================================================== */}

        {menuOpen && (
          <div
            className="float-in"
            style={{
              background: theme.card,
              border:
                `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(event) => {
                  event.preventDefault();

                  setMenuOpen(false);

                  scrollToSection(
                    l.href
                  );
                }}
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "8px 4px",
                }}
              >
                {l.label}
              </a>
            ))}

            <a
              href={
                CONTENT.socials.find(
                  (s) =>
                    s.label === "Email"
                )?.url || "mailto:deepshikkodam@gmail.com"
              }
              style={{
                fontSize: 15,
                fontWeight: 500,
                padding: "8px 4px",
              }}
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Get in Touch
            </a>

            <button
              onClick={() =>
                setDark((v) => !v)
              }
              className="pill-btn specular-border-target"
              style={{
                background: theme.pill,
                color: theme.ink,
                alignSelf:
                  "flex-start",
                marginTop: 8,
              }}
            >
              {dark ? (
                <Sun size={15} />
              ) : (
                <Moon size={15} />
              )}

              {dark
                ? "Aquatic Mist Dark Mode"
                : "Crystal Ice Mode"}
            </button>
          </div>
        )}

        {/* ====================================================
            GREETING Aquadark Interstellar Teal Mode
            ==================================================== */}

        <div className="greeting-container-wrap">
          <div
            className={`greeting-mode-hint${
              modeHintVisible ? " is-visible" : ""
            }`}
            style={{
              "--greeting-hint-bg": dark
                ? "rgba(33, 30, 26, 0.84)"
                : "rgba(255, 255, 255, 0.84)",
              "--greeting-hint-border": dark
                ? "rgba(103, 232, 249, 0.34)"
                : "rgba(14, 165, 233, 0.24)",
              "--greeting-hint-text": dark
                ? "#F4F1EA"
                : "#173A5E",
            }}
            role="status"
            aria-live="polite"
            aria-hidden={!modeHintVisible}
          >
            <span>{modeHintText}</span>
          </div>

          <div
            className="float-in"
            style={{
              background: theme.card,
              border:
                `1px solid ${theme.border}`,
              borderRadius: 20,
              padding: "14px 18px",
              fontSize: 14,
              color: theme.sub,
              marginBottom: 0,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <button
              onClick={handleThemeToggle}
              style={{
                background: theme.pill,
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                cursor: "pointer",
                flexShrink: 0,
                color: theme.ink,
              }}
              aria-label="Toggle theme"
            >
              {dark ? (
                <Moon size={14} />
              ) : (
                <Sun size={14} />
              )}
            </button>

            {greeting(hour)}
          </div>
        </div>

        {/* ====================================================
            HERO
            ==================================================== */}

        <section
          style={{
            marginBottom: 64,
            display: "flex",
            flexDirection:
              isMobile
                ? "column"
                : "row",
            alignItems: "center",
            gap: 32,
          }}
        >
          <div
            style={{
              flex: 1,
              order:
                isMobile ? 2 : 1,
            }}
          >
            {/* ROTATING GREETING */}

            <div
              className="font-display"
              style={{
                fontStyle: "italic",
                fontSize: 22,
                color: theme.sub,
                textAlign:
                  isMobile
                    ? "center"
                    : "left",
                minHeight: "1.25em",
                marginBottom: 2,
                overflow: "hidden",
              }}
              aria-live="polite"
            >
              <span
                key={greetingIndex}
                className="greeting-word"
                style={{
                  display:
                    "inline-block",
                  animation:
                    "greetingIn 0.5s ease both",
                }}
              >
                {
                  greetings[
                    greetingIndex
                  ]
                },
              </span>
            </div>

            {/* NAME */}

            <h1
              className="font-display"
              style={{
                fontSize:
                  isMobile
                    ? 32
                    : 35,
                fontWeight: 600,
                textAlign:
                  isMobile
                    ? "center"
                    : "left",
                margin:
                  "4px 0 14px",
                lineHeight: 1.15,
                color: dark
                  ? "#F4F1EA"
                  : "#173A5E",
              }}
            >
              I am{" "}

              <span
                className="hero-main-text"
                style={{
                  fontStyle: "italic",
                }}
              >
                {CONTENT.name.split("").map((char, i) => (
                  <span key={i}>{char}</span>
                ))}
              </span>

              {" "}👋
            </h1>

            {/* LIQUID GLASS ROLE */}

            <div
              className="hero-role-glass specular-border-target"
              style={{
                marginBottom: 12,
              }}
            >
              {CONTENT.roleCompany
                ? `${CONTENT.role} at ${CONTENT.roleCompany}`
                : CONTENT.role}
            </div>

            {/* TAGLINE */}

            {CONTENT.tagline && (
              <p
                style={{
                  textAlign:
                    isMobile
                      ? "center"
                      : "left",
                  color: accent,
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 14,
                }}
              >
                {CONTENT.tagline}
              </p>
            )}

            {/* BIO */}

            <p
              style={{
                textAlign:
                  isMobile
                    ? "center"
                    : "left",
                color: theme.sub,
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 460,
                margin:
                  isMobile
                    ? "0 auto 26px"
                    : "0 0 26px",
              }}
            >
              {CONTENT.bio.map(
                (chunk, i) =>
                  chunk.strong ? (
                    <strong
                      key={i}
                      style={{
                        color: theme.ink,
                        fontWeight: 600,
                      }}
                    >
                      {chunk.text}
                    </strong>
                  ) : (
                    <span key={i}>
                      {chunk.text}
                    </span>
                  )
              )}
            </p>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  isMobile
                    ? "center"
                    : "flex-start",
                gap: 12,
              }}
            >
              <a
                href={
                  CONTENT.socials.find(
                    (s) =>
                      s.label ===
                      "Email"
                  )?.url || "mailto:deepshikkodam@gmail.com"
                }
                className="pill-btn"
                style={{
                  background:
                    theme.pill,
                  color:
                    theme.ink,
                }}
              >
                Say hi 👋
              </a>

              <a
                href={CONTENT.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn"
                style={{
                  background:
                    theme.ink,
                  color:
                    theme.bg,
                }}
              >
                Resume{" "}
                <FileText size={15} />
              </a>
            </div>
          </div>

          {/* PROFILE PHOTO */}

          <div
            style={{
              order:
                isMobile ? 1 : 2,
              flexShrink: 0,
            }}
          >
            <div
              className="float-in polaroid"
              style={{
                background:
                  dark
                    ? "#102A43"
                    : "#fff",
                border:
                  `1px solid ${theme.border}`,
                borderRadius: 6,
                padding:
                  "14px 14px 36px",
                width:
                  isMobile
                    ? 200
                    : 240,
                transform:
                  "rotate(-3deg)",
                boxShadow: dark
                  ? "0 12px 30px rgba(0,0,0,0.4)"
                  : "0 12px 30px rgba(0,0,0,0.12)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: 2,
                  background:
                    CONTENT.photoUrl
                      ? `url(${CONTENT.photoUrl}) center/cover`
                      : `linear-gradient(135deg, #38BDF8, #0284C7)`,
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  color: "#ffffff",
                  fontSize: 42,
                  fontWeight: 700,
                  fontFamily:
                    "'Fraunces', serif",
                }}
              >
                {!CONTENT.photoUrl &&
                  CONTENT.initials}
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontFamily:
                    "'Fraunces', serif",
                  fontStyle: "italic",
                  color: "#6b6558",
                  fontSize: 12,
                }}
              >
                {CONTENT.photoCaption}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            ABOUT
            ==================================================== */}

        <section
          id="about"
          style={{
            marginBottom: 40,
            scrollMarginTop: 110,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 22,
            }}
          >
            <h2
              style={{
                fontSize: 30,
                fontWeight: 600,
                color: theme.sub,
              }}
            >
              About
            </h2>

       <div
  className="about-tabs-glass"
  style={{
    display: "flex",
    gap: 5,
    borderRadius: 999,
    padding: 4,
  }}
>
              {[
                {
                  key: "story",
                  label: "☰ Story",
                },
                {
                  key: "tldr",
                  label: " ⁝☰ TL;DR",
                },
                {
                  key: "timeline",
                  label: "⏱ Timeline",
                },
              ].map((t) => (
                <button
                  key={t.key}
                  className={`tab-btn ${
                    aboutTab === t.key ? "is-active" : ""
                  }`}
                  aria-selected={aboutTab === t.key}
                  onClick={() =>
                    setAboutTab(
                      t.key
                    )
                  }
                  style={{
                    color: theme.ink,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {aboutTab ===
            "story" && (
            <div
              className="float-in"
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 16,
              }}
            >
              {CONTENT.storyParagraphs.map(
                (p, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: 15,
                      lineHeight: 1.8,
                      color:
                        theme.sub,
                      maxWidth: 560,
                    }}
                  >
                    {p}
                  </p>
                )
              )}
            </div>
          )}

          {aboutTab ===
            "tldr" && (
            <ul
              className="float-in"
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 12,
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {CONTENT.storyTldr.map(
                (point, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color:
                        theme.sub,
                    }}
                  >
                    <span
                      style={{
                        color: accent,
                        flexShrink: 0,
                      }}
                    >
                      ●
                    </span>

                    <span>
                      {point}
                    </span>
                  </li>
                )
              )}
            </ul>
          )}

          {aboutTab ===
            "timeline" && (
            <div
              className="float-in"
              style={{
                display: "flex",
                flexDirection:
                  "column",
              }}
            >
              {CONTENT.timeline.map(
                (item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 16,
                      paddingBottom: 20,
                      position:
                        "relative",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        alignItems:
                          "center",
                        width: 60,
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color:
                            accent,
                        }}
                      >
                        {item.year}
                      </span>

                      {i <
                        CONTENT
                          .timeline
                          .length -
                          1 && (
                        <span
                          style={{
                            width: 1,
                            flex: 1,
                            background:
                              theme.border,
                            marginTop: 6,
                          }}
                        />
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color:
                          theme.sub,
                        paddingBottom: 4,
                      }}
                    >
                      {item.label}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* ====================================================
            PHOTO COLLAGE
            ==================================================== */}

        <section
          id="photo-collage"
          style={{
            marginBottom: 8,
            display: "flex",
            gap:
              isMobile
                ? 14
                : 20,
            justifyContent:
              "center",
            flexWrap: "wrap",
            padding:
              "20px 0 40px",
          }}
        >
          {CONTENT.photoCollage.map(
            (photo, i) => (
              <div
                key={i}
                className="polaroid"
                style={{
                  background:
                    dark
                      ? "#102A43"
                      : "#fff",
                  border:
                    `1px solid ${theme.border}`,
                  borderRadius: 4,
                  padding: 8,
                  paddingBottom: 28,
                  width:
                    isMobile
                      ? 130
                      : 160,
                  transform:
                    `rotate(${
                      (i % 2 === 0
                        ? -1
                        : 1) *
                      (3 + i)
                    }deg)`,
                  boxShadow: dark
                    ? "0 10px 24px rgba(0,0,0,0.35)"
                    : "0 10px 24px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 2,
                    background:
                      photo.url
                        ? `url(${photo.url}) center/cover`
                        : `linear-gradient(150deg, ${theme.pill}, ${theme.border})`,
                  }}
                />

                <div
                  style={{
                    textAlign:
                      "center",
                    marginTop: 8,
                    fontSize: 10,
                    color:
                      theme.sub,
                    fontFamily:
                      "'Fraunces', serif",
                    fontStyle:
                      "italic",
                  }}
                >
                  {photo.caption}
                </div>
              </div>
            )
          )}
        </section>
      </div>

      {/* ======================================================
          LIGHT -> DARK TRANSITION INTO NARRATIVE ONE
          ====================================================== */}

      <div
        ref={photoNarrativeTransitionRef}
        className="photo-narrative-dark-transition"
        aria-hidden="true"
      />

      {/* ======================================================
          NARRATIVE VIDEO
          ====================================================== */}

      <section
        id="narrative-zoom-out"
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight:
            isMobile
              ? 420
              : 520,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding:
            isMobile
              ? "80px 24px"
              : "140px 24px",
          textAlign: "center",
          color: "#eceaf4",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={videoMuted}
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source
            src="/zoom-background.MP4"
            type="video/mp4"
          />
        </video>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <h2
            className="font-display"
            style={{
              fontStyle: "italic",
              fontSize:
                isMobile
                  ? 28
                  : 42,
              fontWeight: 500,
              margin:
                "0 auto 18px",
              lineHeight: 1.25,
            }}
          >
            {
              CONTENT.narrativeOne
                .headline
            }
          </h2>

          <p
            style={{
              fontSize: 14,
              color: "#E5E7EB",
              maxWidth: 460,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {
              CONTENT.narrativeOne
                .subtext
            }
          </p>

          <button
            onClick={() => {
              const newMuted =
                !videoMuted;

              setVideoMuted(
                newMuted
              );

              if (
                videoRef.current
              ) {
                videoRef.current.muted =
                  newMuted;

                if (!newMuted) {
                  videoRef.current
                    .play()
                    .catch(
                      () => {}
                    );
                }
              }
            }}
            style={{
              marginTop: 24,
              background:
                "rgba(255,255,255,0.15)",
              color: "#ffffff",
              border:
                "1px solid rgba(255,255,255,0.35)",
              borderRadius: 999,
              padding:
                "9px 16px",
              cursor: "pointer",
              backdropFilter:
                "blur(8px)",
              fontSize: 13,
            }}
          >
            {videoMuted
              ? "🔇 Sound off"
              : "🔊 Sound on"}
          </button>
        </div>
      </section>

      {/* ======================================================
          SCROLL-DRIVEN FOG BETWEEN THE TWO NARRATIVES
          ====================================================== */}

      <div
        ref={narrativeFogRef}
        className="narrative-fog-transition"
        aria-hidden="true"
      >
        <div className="narrative-fog-layer narrative-fog-layer-a" />
        <div className="narrative-fog-layer narrative-fog-layer-b" />
        <div className="narrative-fog-layer narrative-fog-layer-c" />
      </div>

      {/* ======================================================
          NARRATIVE TWO / BIRDS
          ====================================================== */}

      <section
        id="narrative-bring-down"
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)",
          color: "#173A5E",
          padding:
            isMobile
              ? "80px 24px"
              : "140px 24px",
          textAlign: "center",
          minHeight:
            isMobile
              ? 420
              : 520,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* MOUNTAIN BACKGROUND */}

        <img
          src="/mountains.webp"
          alt=""
          aria-hidden="true"
          className="mountain-background"
        />

        <div className="mountain-sky-overlay" />

        {/* ==================================================
            BIRDS — ONLY IN THIS SECTION
            ================================================== */}

        <div
          className="portfolio-birds"
          aria-hidden="true"
        >
          <div
            className="
              portfolio-bird-container
              portfolio-bird-container-1
            "
          >
            <div
              className="
                portfolio-bird
                portfolio-bird-1
              "
            />
          </div>

          <div
            className="
              portfolio-bird-container
              portfolio-bird-container-2
            "
          >
            <div
              className="
                portfolio-bird
                portfolio-bird-2
              "
            />
          </div>

          <div
            className="
              portfolio-bird-container
              portfolio-bird-container-3
            "
          >
            <div
              className="
                portfolio-bird
                portfolio-bird-3
              "
            />
          </div>

          <div
            className="
              portfolio-bird-container
              portfolio-bird-container-4
            "
          >
            <div
              className="
                portfolio-bird
                portfolio-bird-4
              "
            />
          </div>
        </div>

        {/* SECTION CONTENT */}

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <h2
  style={{
    fontSize: isMobile ? 22 : 30,
    fontWeight: 600,
    marginBottom: 6,
    color: "#000000",
  }}
>
  {CONTENT.narrativeTwo.headline}
</h2>

          <p
            className="font-display"
            style={{
              fontStyle: "italic",
              fontSize:
                isMobile
                  ? 20
                  : 26,
              marginBottom: 18,
            }}
          >
            {
              CONTENT.narrativeTwo
                .subhead
            }
          </p>

          <p
            style={{
              fontSize: 13,
              color: "#3B6380",
              maxWidth: 420,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {
              CONTENT.narrativeTwo
                .subtext
            }
          </p>
        </div>
      </section>

      {/* ======================================================
          EXPERIENCE / WORK
          ====================================================== */}

      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "56px 20px 0",
        }}
      >
        {/* EXPERIENCE */}

        <section
          id="experience"
          style={{
            marginBottom: 80,
            scrollMarginTop: 110,
          }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.sub,
              marginBottom: 18,
            }}
          >
            Experience
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: 4,
            }}
          >
            {CONTENT.experience.map(
              (job, i) => (
                <div
                  key={i}
                  style={{
                    padding:
                      "18px 0",
                    borderBottom:
                      i <
                      CONTENT
                        .experience
                        .length -
                        1
                        ? `1px solid ${theme.border}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "baseline",
                      gap: 12,
                      marginBottom: 6,
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {job.company}
                    </span>

                    <span
                      style={{
                        fontSize: 12,
                        color:
                          theme.sub,
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {job.period}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      color:
                        theme.sub,
                      marginBottom: 6,
                    }}
                  >
                    {job.role}
                  </div>

                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color:
                        theme.sub,
                    }}
                  >
                    {job.description}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* PROJECTS */}

        <section
          id="work"
          className="content-glass-section"
          style={{
            marginBottom: 56,
            scrollMarginTop: 110,
          }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.sub,
              marginBottom: 18,
            }}
          >
            Selected Work
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: 14,
            }}
          >
            {CONTENT.projects.map(
              (p, i) => (
                <a
                  key={i}
                  href={p.url}
                  className="card-hover project-glass-card"
                  style={{
                    display: "block",
                    background:
                      theme.card,
                    border:
                      `1px solid ${theme.border}`,
                    borderRadius: 18,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      marginBottom: 8,
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 17,
                      }}
                    >
                      {p.name}
                    </span>

                    <ExternalLink
                      size={15}
                      color={
                        theme.sub
                      }
                      style={{
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                  </div>

                  <span className="project-tag-glass">
                    {p.tag}
                  </span>

                  <p
                    className="project-description"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color:
                        theme.sub,
                    }}
                  >
                    {p.description}
                  </p>
                </a>
              )
            )}
          </div>
        </section>

        {/* SKILLS */}

        <section
          className="content-glass-section skills-glass-section"
          style={{
            marginBottom: 56,
          }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.sub,
              marginBottom: 18,
            }}
          >
            Tools &amp; Skills
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {CONTENT.skills.map(
              (s) => (
                <span
                  key={s}
                  className="skill-glass-pill"
                >
                  {s}
                </span>
              )
            )}
          </div>
        </section>

        {/* EDUCATION */}

        <section
          className="content-glass-section education-glass-section"
          style={{
            marginBottom: 56,
          }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: theme.sub,
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <GraduationCap
              size={15}
            />
            Education
          </h2>

          {CONTENT.education.map(
            (edu, i) => (
              <div
                key={i}
                className="education-glass-card"
                style={{
                  background:
                    theme.card,
                  border:
                    `1px solid ${theme.border}`,
                  borderRadius: 18,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "baseline",
                    gap: 12,
                    marginBottom: 6,
                    flexWrap:
                      "wrap",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                    }}
                  >
                    {edu.school}
                  </span>

                  <span
                    className="education-period"
                    style={{
                      fontSize: 12,
                      color:
                        theme.sub,
                    }}
                  >
                    {edu.period}
                  </span>
                </div>

                <div
                  className="education-degree"
                  style={{
                    fontSize: 14,
                    color:
                      theme.sub,
                  }}
                >
                  {edu.degree}
                </div>
              </div>
            )
          )}
        </section>

        {/* ACHIEVEMENTS */}

        <section
          className="content-glass-section achievements-glass-section"
          style={{
            marginBottom: 56,
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: theme.sub,
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Award size={15} />
            Achievements
          </h2>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {CONTENT.achievements.map((a, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: theme.sub,
                }}
              >
                <span
                  style={{
                    color: accent,
                    flexShrink: 0,
                  }}
                >
                  ●
                </span>
                <span>{a.title}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CERTIFICATIONS */}

        <section
          className="content-glass-section certifications-glass-section"
          style={{
            marginBottom: 56,
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: theme.sub,
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Award size={15} />
           Certifications
          </h2>

          <div
            className="certifications-folder-stage"
            style={{
              minHeight: isMobile ? 390 : 270,
              display: "flex",
              alignItems: isMobile ? "flex-end" : "flex-start",
              justifyContent: "center",
              padding: isMobile ? "0 0 18px" : "160px 0 0",
              boxSizing: "border-box",
              overflow: "visible",
            }}
          >
            <FolderFloat
              items={CONTENT.certifications.map((cert) => ({
                label: cert.title,
                value: cert,
              }))}
              
              sublabel={`${CONTENT.certifications.length} certifications`}
              trigger={isMobile ? "click" : "hover"}
              closeOnSelect={false}
              physics
              drift={0.5}
              onSelect={(cert) => {
                if (!cert?.link) return;
                window.open(cert.link, "_blank", "noopener,noreferrer");
              }}
              folderColor={dark ? "#173B54" : "#3f3f46"}
              frontColor={dark ? "#28556F" : "#52525b"}
              paperColor={dark ? "#EAF4F8" : "#f5f5f5"}
              itemColor={dark ? "#F4F8FB" : "#f5f5f5"}
              itemTextColor={dark ? "#102F47" : "#18181b"}
              labelColor="#f5f5f5"
              width={200}
              height={148}
              radius={14}
spread={isMobile ? 130 : 220}
lift={isMobile ? 12 : 30}
              tilt={8}
              flapAngle={34}
              restAngle={16}
              openDuration={520}
              stagger={45}
              bounce={0.3}
            />
          </div>
        </section>
      </div>

      {/* ======================================================
          CREATIVE
          ====================================================== */}

      {CONTENT.showPhotography && (
        <section
          id="creative"
          style={{
            background: "#141210",
            padding: isMobile ? "48px 20px" : "64px 20px",
            marginBottom: 0,
            scrollMarginTop: 110,
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            <h2
              className="font-display"
              style={{
                fontStyle: "italic",
                fontSize: isMobile ? 20 : 24,
                color: "#F4F1EA",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Camera size={18} />
              {CONTENT.photographyHeading}
            </h2>

            <h3
              className="font-display"
              style={{
                fontSize: isMobile ? 28 : 34,
                color: "#F4F1EA",
                margin: "0 0 22px",
                fontWeight: 500,
              }}
            >
              Frames &amp; Cuts
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 28,
                width: "100%",
              }}
            >
              {/* PHOTOGRAPHY */}
              <div
                className="creative-category-card"
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.045))",
                  backdropFilter: "blur(18px) saturate(150%)",
                  WebkitBackdropFilter: "blur(18px) saturate(150%)",
                  padding: isMobile ? 18 : 20,
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <Camera size={19} />
                  <span
                    style={{
                      color: "#F4F1EA",
                      fontSize: 17,
                      fontWeight: 600,
                    }}
                  >
                    Gallery
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "repeat(2, minmax(0, 1fr))"
                      : "repeat(3, minmax(0, 1fr))",
                    gap: 10,
                  }}
                >
                  {CONTENT.photography.map((item, i) => {
                    const media =
                      typeof item === "string"
                        ? { url: item, caption: "", captionPosition: "below" }
                        : item;

                    const url = media?.url || "";
                    const caption = media?.caption || "";
                    const isOverlay = media?.captionPosition === "overlay";

                    return (
                      <div key={i} style={{ minWidth: 0 }}>
                        <div
                          className="photo-tile specular-border-target"
                          style={{
                            position: "relative",
                            aspectRatio: "9/16",
                            borderRadius: 10,
                            overflow: "hidden",
                            background: url
                              ? `url(${url}) center/cover`
                              : `linear-gradient(${135 + i * 20}deg, #102A43, #173A5E)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#66605A",
                            fontSize: 11,
                          }}
                        >
                          {!url && "Add photo"}

                          {caption && isOverlay && (
                            <div className="creative-media-caption creative-media-caption-overlay">
                              {caption}
                            </div>
                          )}
                        </div>

                        {caption && !isOverlay && (
                          <div className="creative-media-caption creative-media-caption-below">
                            {caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* VIDEO & AUDIO EDITS */}
              <div
                className="creative-category-card"
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.045))",
                  backdropFilter: "blur(18px) saturate(150%)",
                  WebkitBackdropFilter: "blur(18px) saturate(150%)",
                  padding: isMobile ? 18 : 20,
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <Video size={19} />
                  <span
                    style={{
                      color: "#F4F1EA",
                      fontSize: 17,
                      fontWeight: 600,
                    }}
                  >
                    Edits
                  </span>
                </div>

                <p
                  style={{
                    color: "rgba(244,241,234,0.72)",
                    fontSize: 13,
                    lineHeight: 1.7,
                    margin: "0 0 16px",
                    maxWidth: 500,
                  }}
                >
                  Short-form visual work, video edits, remixes and related
                  projects.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "repeat(2, minmax(0, 1fr))"
                      : "repeat(3, minmax(0, 1fr))",
                    gap: 10,
                  }}
                >
                  {CONTENT.videoEdits.map((item, i) => {
                    const media =
                      typeof item === "string"
                        ? { url: item, caption: "", captionPosition: "below" }
                        : item;

                    const url = media?.url || "";
                    const caption = media?.caption || "";
                    const isOverlay = media?.captionPosition === "overlay";

                    return (
                      <div key={i} style={{ minWidth: 0 }}>
                        <div
                          className="photo-tile specular-border-target"
                          style={{
                            position: "relative",
                           
                            borderRadius: 10,
                            overflow: "hidden",
                            background: "rgba(255,255,255,0.045)",
                          }}
                        >
                          <video
                            src={url}
                            controls
                            playsInline
                            preload="metadata"
                            style={{
                              width: "100%",
                              height: "100%",
                              
                              objectFit: "cover",
                              display: "block",
                            }}
                          />

                          {caption && isOverlay && (
                            <div className="creative-media-caption creative-media-caption-overlay">
                              {caption}
                            </div>
                          )}
                        </div>

                        {caption && !isOverlay && (
                          <div className="creative-media-caption creative-media-caption-below">
                            {caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* ======================================================
          POLAROID CAMERA
          ====================================================== */}

      {CONTENT.showPhotography && (
        <section
          id="polaroid-camera"
          className="polaroid-camera-section"
          style={{
            background: "#141210",
            padding: isMobile
              ? "48px 20px 70px"
              : "70px 20px 90px",
            marginBottom: 0,
            scrollMarginTop: 110,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              className="font-display"
              style={{
                fontStyle: "italic",
                fontSize: isMobile ? 20 : 24,
                color: "#F4F1EA",
                marginBottom: 10,
              }}
            >
              Make a frame.
            </h2>

            <p
              style={{
                color: "rgba(244,241,234,0.62)",
                fontSize: 12,
                lineHeight: 1.6,
                margin: "0 auto 30px",
                maxWidth: 420,
              }}
            >
              Tap the lens, allow camera access,
              and take a Polaroid.
            </p>

            <PolaroidCamera isMobile={isMobile} />
          </div>
        </section>
      )}




      {/* ======================================================
          STL / 3D MODEL
          ====================================================== */}

      <section
        id="stl-model"
        className="stl-model-section"
      >
        <div className="stl-gridscan-bg" aria-hidden="true">
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#234A68"
            gridScale={0.1}
            scanColor="#38BDF8"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
            lineJitter={0.1}
            scanGlow={0.5}
            scanSoftness={2}
            enableWebcam={false}
            showPreview={false}
          />
        </div>

        <div className="stl-model-container">
          <div className="stl-model-heading">
            <span className="stl-model-eyebrow">
              INTERACTIVE 3D MODEL (PLAYGROUND)
            </span>

            <h2 className="font-display">
              Meshes &amp; forms . 
            </h2>

            <p>
              A small detour into 3D  — an interactive
              look at <strong>sorayamachest.stl,</strong> a concept inspired by the futuristic aesthetic of <strong>Hajime Sorayama.</strong> An STL model I’ve included for visual exploration and interaction only. Model credit belongs to the original creator.
            </p>
          </div>

          <STLModelViewer isMobile={isMobile} />
        </div>
      </section>

      {/* ======================================================
          FOOTER
          ====================================================== */}

      <div className="socials-footer-lightfall">
        <Lightfall
          colors={["#A6C8FF", "#5227FF", "#1451B7"]}
          backgroundColor="#07131D"
          speed={0.5}
          streakCount={2}
          streakWidth={1}
          streakLength={1}
          glow={1}
          density={0.6}
          twinkle={1}
          zoom={3}
          backgroundGlow={0.5}
          opacity={1}
          mouseInteraction
          mouseStrength={0.5}
          mouseRadius={1}
        />

        <div className="socials-footer-content">
          <section
            style={{
              textAlign: "center",
              marginBottom: 32,
            }}
          >
          {/* QUOTE */}

          <div
            onClick={() =>
              setQuoteIndex(
                (i) =>
                  (i + 1) %
                  CONTENT.quotes
                    .length
              )
            }
            style={{
              cursor: "pointer",
              margin:
                "0 auto 28px",
              width: 200,
              userSelect:
                "none",
            }}
            title="Click for another quote"
          >
            <div
              style={{
                background:
                  dark
                    ? "#102A43"
                    : "#173A5E",
                borderRadius: 8,
                padding: 8,
                boxShadow:
                  "0 16px 36px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  background:
                    theme.card,
                  borderRadius: 4,
                  padding:
                    "18px 14px",
                  minHeight: 120,
                  display: "flex",
                  flexDirection:
                    "column",
                  justifyContent:
                    "center",
                }}
              >
                <p
                  className="font-display"
                  style={{
                    fontStyle:
                      "italic",
                    fontSize: 14,
                    lineHeight: 1.6,
                    marginBottom: 10,
                  }}
                >
                  "
                  {
                    CONTENT
                      .quotes[
                        quoteIndex
                      ].text
                  }
                  "
                </p>

                <span
                  style={{
                    fontSize: 11,
                    color:
                      theme.sub,
                  }}
                >
                  —
                  {
                    CONTENT
                      .quotes[
                        quoteIndex
                      ].author
                  }
                </span>
              </div>
            </div>
          </div>

          {/* SOCIALS */}

          <div className="socials-lightfall-grid">
              {CONTENT.socials.map(
                (s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    className={`social-glass-pill ${
                      ["GitHub", "LinkedIn", "Email", "Instagram", "Twitter"].includes(s.label)
                        ? "specular-border-target"
                        : ""
                    }`}
                  >
                    <s.icon size={18} />
                    <span>{s.label}</span>
                  </a>
                )
              )}
            </div>

          {/* LOCATION */}

          <span className="location-glass-pill">
            <MapPin size={15} />
            <span>{CONTENT.location}</span>
          </span>
        </section>
        </div>
      </div>
    </div>
  );
}
