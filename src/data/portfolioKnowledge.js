export const portfolioKnowledge = {
  about: {
    name: "Deepshik Kodam",
    role: "Data Engineer · Developer · Designer",
    location: "Hyderabad, India",
    education: "B.Tech, Computer Science & Engineering (Data Science), CMR College of Engineering & Technology, 2022 — 2026",
    tagline:
      "Building scalable data platforms, applications & digital experiences with Snowflake, SQL, Python & design.",
  },

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

  experience: [
    {
      company: "EvoAstra Ventures Pvt. Ltd.",
      role: "Data Science Intern",
      period: "Jul 2025 — Aug 2025 · Hyderabad",
      description:
        "Designed and deployed an end-to-end computer vision web app (Captionize) to generate automated text descriptions from images. Structured and validated data ingestion pipelines for unstructured image data and flat files, and built a real-time upload + caption display interface.",
    },
  ],

  projects: [
    {
      name: "Beyond Accuracy: Robust & Explainable IoT IDS",
      tag: "Research Paper · Accepted · Presented · Deployed",
      description:
        "Built a machine learning model to detect cyber-attacks in IoT network traffic, trained and evaluated on the TON-IoT and BoT-IoT datasets. Used SHAP for model explainability. Paper presented at ICT4SD 2026 and accepted for publication in ICT Analysis and Applications, Vol. 9 (Springer Nature).",
      url: "https://github.com/just-deepshik/beyond-accuracy-iot-ids",
      section: "work",
    },
    {
      name: "CAC-Data-Engineering-and-Analytics-Platform",
      tag: "Data Engineering Pipeline · Talend ETL · Snowflake · SQL · Python · Tableau",
      description:
        "Built an end-to-end Customer Acquisition Cost (CAC) data engineering pipeline using Talend, Snowflake, SQL, Python, and Tableau. Automated data ingestion and validation from CSV, transformed data through RAW, STAGING, and ANALYTICS layers in Snowflake, and delivered interactive Tableau dashboards for business insights.",
      url: "https://github.com/just-deepshik/CAC-Data-Engineering-and-Analytics-Platform",
      section: "work",
    },
    {
      name: "Captionize",
      tag: "Automatic Image Caption Generator with Attention · Internship Project",
      description:
        "A deep learning project that generates captions for images automatically. It combines Computer Vision (CNN) and Natural Language Processing (RNN + Attention) to describe what is in an image using natural language.",
      url: "https://github.com/just-deepshik/Captionize",
      section: "work",
    },
    {
      name: "NAV-Aisle Superstore",
      tag: "Personal project",
      description:
        "A web-based 3D indoor navigation system for retail stores to optimize product discovery, with search indexing and route optimization for shortest paths through store aisles.",
      url: "#",
      section: "work",
    },
  ],

  certifications: [
    "Snowflake Hands-On Essentials: Data Warehousing Workshop (Aug 2026)",
    "AI Advanced — Python, Machine Learning, Deep Learning, Neural Networks (Hexart.In)",
    "Snowflake Hands-On Essentials: Collaboration, Marketplace & Cost Estimation Workshop",
  ],

  achievements: [
    "Awarded Best Young Filmmaker at the Sony Cinematica Expo 2023.",
    "Won Best Short Film at an event organized by the Clicktalks Film Club.",
    "Special Mention — Techknowthon '24.",
    "Participant — MAD Future Tech Expo 2.0 (VIT-AP).",
  ],

  research: {
    title: "Beyond Accuracy: Robust and Explainable Performance Evaluation of Intrusion Detection Systems for Internet of Things Networks",
    datasets: ["TON-IoT", "BoT-IoT"],
    methods: ["MLP", "SHAP", "FGSM", "PGD", "concept drift"],
    deployment: "FastAPI deployment with a live Swagger API.",
  },
};
