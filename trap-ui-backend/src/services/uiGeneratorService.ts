import type {
  AnalyticsResult,
  GeneratedSiteContent,
  GeneratedUiBlueprint,
  LandingPageContent,
  MetricGapInsight,
  ScoreBreakdown,
  UiMotionLevel,
  UiStylePreset
} from "../types.js";

type IndustryTag = "FinTech" | "AI SaaS" | "EdTech" | null;
type BreakdownKey = keyof ScoreBreakdown;
type GenerationOptions = {
  stylePreset?: UiStylePreset | null;
  motionLevel?: UiMotionLevel | null;
};

type StylePresetConfig = {
  label: string;
  visualDirection: string;
  primaryFallback: string;
  secondaryFallback: string;
  accentFallback: string;
  background: string;
  surface: string;
  text: string;
  radius: string;
  spacing: string;
  fontFamily: string;
  navBackground: string;
  navBorder: string;
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  finalGradient: string;
  glass?: boolean;
};

type MotionPresetConfig = {
  label: string;
  animationBudget: string;
  floatDuration: number;
  floatDistance: number;
  revealDuration: number;
  marqueeDuration: number;
  cardStaggerMs: number;
};

const IDEAL_BREAKDOWN: ScoreBreakdown = {
  colorTrustIndex: 10,
  layoutEfficiency: 10,
  ctaOptimization: 10,
  conversionIndicators: 10,
  mobileResponsiveness: 10
};

const METRIC_WEIGHTS: Record<BreakdownKey, number> = {
  colorTrustIndex: 0.2,
  layoutEfficiency: 0.25,
  ctaOptimization: 0.25,
  conversionIndicators: 0.2,
  mobileResponsiveness: 0.1
};

const METRIC_LABELS: Record<BreakdownKey, string> = {
  colorTrustIndex: "Color Trust",
  layoutEfficiency: "Layout Efficiency",
  ctaOptimization: "CTA Optimization",
  conversionIndicators: "Conversion Indicators",
  mobileResponsiveness: "Mobile Responsiveness"
};

const STYLE_PRESETS: Record<UiStylePreset, StylePresetConfig> = {
  "conversion-max": {
    label: "Conversion Max",
    visualDirection: "High-clarity SaaS with strong hierarchy, trust framing, and focused CTAs.",
    primaryFallback: "#0f172a",
    secondaryFallback: "#334155",
    accentFallback: "#f97316",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    radius: "14px",
    spacing: "8pt scale",
    fontFamily: "Satoshi, Inter, system-ui, sans-serif",
    navBackground: "rgba(255, 255, 255, 0.74)",
    navBorder: "rgba(148, 163, 184, 0.3)",
    cardBackground: "#ffffff",
    cardBorder: "rgba(148, 163, 184, 0.24)",
    cardShadow: "0 14px 38px rgba(15,23,42,.06)",
    finalGradient: "radial-gradient(circle at 14% 0%, rgba(255,255,255,.16), transparent 45%), linear-gradient(135deg, #0f172a 0%, #1e293b 54%, #0f172a 100%)"
  },
  "glass-lux": {
    label: "Glass Lux",
    visualDirection: "Premium glassmorphism with soft glow layers and elegant spacing rhythm.",
    primaryFallback: "#0ea5e9",
    secondaryFallback: "#7c3aed",
    accentFallback: "#22c55e",
    background: "#ecfeff",
    surface: "rgba(255,255,255,0.72)",
    text: "#0f172a",
    radius: "18px",
    spacing: "10pt scale",
    fontFamily: "General Sans, Satoshi, Inter, system-ui, sans-serif",
    navBackground: "rgba(255,255,255,0.62)",
    navBorder: "rgba(14, 165, 233, 0.26)",
    cardBackground: "linear-gradient(155deg, rgba(255,255,255,.88), rgba(240,249,255,.72))",
    cardBorder: "rgba(125, 211, 252, .44)",
    cardShadow: "0 20px 46px rgba(14,165,233,.13)",
    finalGradient: "radial-gradient(circle at 10% 0%, rgba(255,255,255,.42), transparent 46%), linear-gradient(140deg, #082f49 0%, #1e3a8a 52%, #312e81 100%)",
    glass: true
  },
  "neo-bold": {
    label: "Neo Bold",
    visualDirection: "Neo-brutalist composition with high contrast blocks and punchy accents.",
    primaryFallback: "#111827",
    secondaryFallback: "#f59e0b",
    accentFallback: "#ef4444",
    background: "#fff7ed",
    surface: "#ffffff",
    text: "#111827",
    radius: "8px",
    spacing: "6pt scale",
    fontFamily: "Clash Display, Satoshi, Inter, system-ui, sans-serif",
    navBackground: "#ffffff",
    navBorder: "#111827",
    cardBackground: "#ffffff",
    cardBorder: "#111827",
    cardShadow: "8px 8px 0 rgba(17,24,39,.24)",
    finalGradient: "linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)"
  },
  "luxury-minimal": {
    label: "Luxury Minimal",
    visualDirection: "High-end editorial with generous whitespace and serif typography.",
    primaryFallback: "#1a1a1a",
    secondaryFallback: "#d4af37",
    accentFallback: "#f4e1c1",
    background: "#ffffff",
    surface: "#f9f9f9",
    text: "#1a1a1a",
    radius: "0px",
    spacing: "12pt scale",
    fontFamily: "Playfair Display, serif",
    navBackground: "#ffffff",
    navBorder: "transparent",
    cardBackground: "#ffffff",
    cardBorder: "#eaeaea",
    cardShadow: "0 4px 12px rgba(0,0,0,0.05)",
    finalGradient: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)"
  },
  "cyber-dim": {
    label: "Cyber Dim",
    visualDirection: "Dark mode with neon accents and futuristic grid layouts.",
    primaryFallback: "#00ff9d",
    secondaryFallback: "#ff00ff",
    accentFallback: "#00d4ff",
    background: "#0a0a0a",
    surface: "#1a1a1a",
    text: "#e0e0e0",
    radius: "4px",
    spacing: "8pt scale",
    fontFamily: "Space Grotesk, monospace",
    navBackground: "rgba(10, 10, 10, 0.8)",
    navBorder: "#333333",
    cardBackground: "#1a1a1a",
    cardBorder: "#333333",
    cardShadow: "0 0 10px rgba(0, 255, 157, 0.1)",
    finalGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
    glass: true
  },
  "saas-clean": {
    label: "SaaS Clean",
    visualDirection: "Modern, clean SaaS interface with soft shadows and rounded corners.",
    primaryFallback: "#3b82f6",
    secondaryFallback: "#64748b",
    accentFallback: "#10b981",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#1e293b",
    radius: "8px",
    spacing: "8pt scale",
    fontFamily: "Inter, sans-serif",
    navBackground: "#ffffff",
    navBorder: "#e2e8f0",
    cardBackground: "#ffffff",
    cardBorder: "#e2e8f0",
    cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    finalGradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
  },
  "corporate-trust": {
    label: "Corporate Trust",
    visualDirection: "Established, trustworthy corporate design with strong blues and greys.",
    primaryFallback: "#1e3a8a",
    secondaryFallback: "#475569",
    accentFallback: "#ea580c",
    background: "#ffffff",
    surface: "#f1f5f9",
    text: "#0f172a",
    radius: "4px",
    spacing: "8pt scale",
    fontFamily: "Roboto, sans-serif",
    navBackground: "#ffffff",
    navBorder: "#cbd5e1",
    cardBackground: "#ffffff",
    cardBorder: "#cbd5e1",
    cardShadow: "0 1px 3px rgba(0,0,0,0.1)",
    finalGradient: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)"
  }
};

const MOTION_PRESETS: Record<UiMotionLevel, MotionPresetConfig> = {
  minimal: {
    label: "Minimal Motion",
    animationBudget: "Low motion for enterprise readability and accessibility-first feel.",
    floatDuration: 16,
    floatDistance: 10,
    revealDuration: 0.45,
    marqueeDuration: 36,
    cardStaggerMs: 45
  },
  balanced: {
    label: "Balanced Motion",
    animationBudget: "Moderate motion tuned for clarity with premium interaction rhythm.",
    floatDuration: 12,
    floatDistance: 24,
    revealDuration: 0.65,
    marqueeDuration: 24,
    cardStaggerMs: 90
  },
  cinematic: {
    label: "Cinematic Motion",
    animationBudget: "High-impact motion for bold brand storytelling and launch pages.",
    floatDuration: 9,
    floatDistance: 34,
    revealDuration: 0.82,
    marqueeDuration: 16,
    cardStaggerMs: 140
  }
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function asTitle(text: string): string {
  return text
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function platformNameFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const root = hostname.split(".")[0] || "Platform";
    return asTitle(root);
  } catch {
    return "Platform";
  }
}

function toIndustryLabel(industry: IndustryTag): GeneratedUiBlueprint["industry"] {
  if (industry === "FinTech" || industry === "AI SaaS" || industry === "EdTech") return industry;
  return "General";
}

function safeHex(hex: string | undefined, fallback: string): string {
  if (!hex) return fallback;
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : fallback;
}

function resolveGenerationOptions(options?: GenerationOptions): {
  stylePreset: UiStylePreset;
  motionLevel: UiMotionLevel;
} {
  const stylePreset = options?.stylePreset && options.stylePreset in STYLE_PRESETS ? options.stylePreset : "conversion-max";
  const motionLevel = options?.motionLevel && options.motionLevel in MOTION_PRESETS ? options.motionLevel : "balanced";
  return {
    stylePreset,
    motionLevel
  };
}

function lossToPriority(scoreLoss: number): MetricGapInsight["priority"] {
  if (scoreLoss >= 10) return "high";
  if (scoreLoss >= 5) return "medium";
  return "low";
}

function metricAdvice(metric: BreakdownKey, result: AnalyticsResult): { why: string; suggestions: string[] } {
  switch (metric) {
    case "colorTrustIndex":
      return {
        why: "Low contrast and weak color hierarchy reduce readability and trust.",
        suggestions: [
          "Set body text contrast to WCAG-friendly values and keep button contrast above 4.5:1.",
          "Use one dominant brand color, one accent, and neutral surfaces for clean hierarchy.",
          "Reserve accent color for primary CTA only."
        ]
      };
    case "layoutEfficiency":
      return {
        why: "Layout confusion increases cognitive load and hurts first-impression clarity.",
        suggestions: [
          `Adopt a ${result.layout.type === "Centered Hero" ? "Split Hero" : "Centered Hero"} above-fold structure with one clear message block.`,
          "Keep headline, proof, and primary CTA visible without heavy scrolling.",
          "Reduce competing panels in the first screen."
        ]
      };
    case "ctaOptimization":
      return {
        why: "Unclear or overloaded CTAs reduce action intent and conversion rate.",
        suggestions: [
          "Use one primary CTA above fold and one supporting secondary CTA.",
          "Make CTA text action-oriented (for example: Start Free Trial, Book Demo).",
          "Repeat primary CTA after social proof and before footer."
        ]
      };
    case "conversionIndicators":
      return {
        why: "Missing trust, proof, and urgency signals lowers conversion confidence.",
        suggestions: [
          "Add customer logos, testimonials, and quantified outcomes near the hero.",
          "Add pricing clarity, FAQ, and guarantees close to the final CTA.",
          "Use one tight benefits grid with concrete value statements."
        ]
      };
    case "mobileResponsiveness":
      return {
        why: "Poor mobile prioritization causes drop-off before users reach CTA.",
        suggestions: [
          "Use mobile-first spacing and typography for 360px and 390px breakpoints.",
          "Ensure CTA is visible in first viewport without pinch-zoom.",
          "Avoid dense multi-column blocks on small screens."
        ]
      };
    default:
      return {
        why: "This metric requires optimization.",
        suggestions: ["Audit and optimize this area."]
      };
  }
}

function buildMetricGaps(result: AnalyticsResult): MetricGapInsight[] {
  const breakdown = result.score.breakdown;
  const entries = Object.keys(IDEAL_BREAKDOWN) as BreakdownKey[];

  return entries
    .map((metricKey) => {
      const current = Number(breakdown[metricKey] || 0);
      const target = 10;
      const gap = Number((target - current).toFixed(2));
      const scoreLoss = Number((gap * METRIC_WEIGHTS[metricKey] * 10).toFixed(2));
      const advice = metricAdvice(metricKey, result);

      return {
        metricKey,
        label: METRIC_LABELS[metricKey],
        current,
        target,
        gap,
        scoreLoss,
        priority: lossToPriority(scoreLoss),
        whyItMatters: advice.why,
        suggestions: advice.suggestions
      };
    })
    .sort((a, b) => b.scoreLoss - a.scoreLoss);
}

function sectionPlan(layout: AnalyticsResult["layout"]["type"], recommendedComponents: string[]): GeneratedUiBlueprint["sections"] {
  const base: GeneratedUiBlueprint["sections"] = [
    {
      id: "hero",
      title: "Hero + Positioning",
      purpose: "Immediate value proposition with one clear conversion action.",
      components: ["headline", "supporting copy", "primary CTA", "secondary CTA", "trust bar"],
      targetMetric: "CTA optimization + layout efficiency"
    },
    {
      id: "proof",
      title: "Trust Proof Block",
      purpose: "Build confidence quickly with social and performance signals.",
      components: ["logo strip", "testimonial cards", "impact metrics"],
      targetMetric: "Conversion indicators"
    },
    {
      id: "features",
      title: "Feature Narrative",
      purpose: "Explain capability in a scannable structure with benefit-led copy.",
      components: ["feature cards", "visual preview", "microcopy"],
      targetMetric: "Layout efficiency + mobile responsiveness"
    },
    {
      id: "faq",
      title: "Objection Handling",
      purpose: "Resolve doubts before final action.",
      components: ["faq accordion", "risk-reduction bullets", "support assurance"],
      targetMetric: "Conversion indicators"
    },
    {
      id: "final-cta",
      title: "Closing Conversion Block",
      purpose: "End with one clear action and minimal friction.",
      components: ["final value summary", "primary CTA", "secondary CTA"],
      targetMetric: "CTA optimization"
    }
  ];

  if (layout === "Dashboard Layout") {
    base.splice(2, 0, {
      id: "product-preview",
      title: "Product Preview",
      purpose: "Show real workflow to prove product value quickly.",
      components: ["dashboard shot", "kpi highlights", "insight rail"],
      targetMetric: "Layout efficiency + conversion indicators"
    });
  }

  if (recommendedComponents.length) {
    base[2].components = Array.from(new Set([...base[2].components, ...recommendedComponents])).slice(0, 8);
  }

  return base;
}

function toComponentName(platformName: string): string {
  const cleaned = platformName.replace(/[^a-zA-Z0-9]/g, "");
  const normalized = cleaned.length ? cleaned : "Platform";
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}LandingPage`;
}

function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeText(s: string): string {
  return String(s || "").replace(/[<>{}`]/g, "").replace(/\s+/g, " ").trim();
}

function trimSentence(text: string, max = 200): string {
  const t = safeText(text);
  if (!t) return t;
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "\u2026";
}

function heroVariantFromLayout(layout: string): GeneratedSiteContent["heroVariant"] {
  switch (layout) {
    case "Split Hero":
      return "split";
    case "Sidebar Layout":
      return "sidebar";
    case "Dashboard Layout":
      return "dashboard";
    case "Card Grid Layout":
      return "card-grid";
    default:
      return "centered";
  }
}

function industryHeadline(
  platform: string,
  industry: GeneratedUiBlueprint["industry"],
  topIssue: string
): string {
  switch (industry) {
    case "FinTech":
      return `${platform}: a financial product users open, trust, and act on`;
    case "AI SaaS":
      return `${platform}: an AI workspace teams adopt instead of abandon`;
    case "EdTech":
      return `${platform}: learning experiences students actually finish`;
    default:
      return `${platform}, redesigned for clarity and conversion \u2014 fixing ${topIssue.toLowerCase()} first`;
  }
}

function buildLandingPage(
  result: AnalyticsResult,
  prediction: NonNullable<AnalyticsResult["prediction"]>,
  blueprint: GeneratedUiBlueprint
): LandingPageContent {
  const platform = blueprint.platformName;
  const industry = blueprint.industry;
  const heroEyebrow = `${industry.toUpperCase()} \u2022 ${platform.toUpperCase()}`;

  if (industry === "FinTech") {
    return {
      heroEyebrow,
      navLinks: ["Products", "Pricing", "Developers", "Security", "Customers"],
      heroTagline: `Pay anyone. Anywhere. Instantly with ${platform}.`,
      heroValueProp: `${platform} is the modern financial backbone for fast-moving teams \u2014 move money, run reconciliation, and stay compliant without the legacy stack.`,
      primaryCta: "Open an account",
      secondaryCta: "Talk to sales",
      logoStrip: ["NorthbankX", "FerryPay", "Vaultly", "CashLane", "Moneta", "TrustCircle"],
      productFeatures: [
        { emoji: "\u{1F4B8}", title: "Instant payouts", body: `Send money in seconds via ${platform}'s clearing rails. ACH, RTP and SEPA in one API.` },
        { emoji: "\u{1F6E1}", title: "Bank-grade security", body: "SOC 2 Type II, PCI-DSS Level 1, and hardware-backed key management out of the box." },
        { emoji: "\u{1F4CA}", title: "Realtime ledger", body: "Every transaction reconciled live with double-entry accuracy and audit-ready exports." }
      ],
      stats: [
        { value: "$12B+", label: "Processed last year" },
        { value: "99.99%", label: "Uptime across regions" },
        { value: "180+", label: "Countries supported" }
      ],
      testimonial: {
        quote: `${platform} cut our settlement time from 3 days to 90 seconds and reduced compliance reviews by 60%.`,
        author: "Alex Carter",
        role: "CFO at NorthbankX"
      },
      pricing: [
        { name: "Starter", price: "$0", period: "/mo", perks: ["100 transactions / mo", "Email support", "Sandbox API"] },
        { name: "Growth", price: "$249", period: "/mo", perks: ["50,000 transactions", "Priority support", "Dedicated webhooks"], highlight: true },
        { name: "Scale", price: "Custom", period: "", perks: ["Unlimited volume", "SLA + dedicated AM", "Audit-ready reports"] }
      ],
      footerColumns: [
        { heading: "Product", items: ["Payments", "Cards", "Treasury", "Reporting"] },
        { heading: "Developers", items: ["API docs", "SDKs", "Status", "Changelog"] },
        { heading: "Company", items: ["Customers", "Pricing", "Security", "Careers"] },
        { heading: "Resources", items: ["Blog", "Guides", "Webinars", "Support"] }
      ],
      finalCtaTitle: `Move money the modern way with ${platform}.`,
      finalCtaBody: "Open an account in minutes. No legacy contracts, no hidden fees."
    };
  }

  if (industry === "AI SaaS") {
    return {
      heroEyebrow,
      navLinks: ["Platform", "Models", "Pricing", "Docs", "Customers"],
      heroTagline: `Ship AI products in days, not quarters with ${platform}.`,
      heroValueProp: `${platform} is the AI workspace product teams actually adopt \u2014 build, evaluate, and ship language and vision features without rewriting your stack.`,
      primaryCta: "Start building free",
      secondaryCta: "Book a demo",
      logoStrip: ["LumenAI", "Forge Studio", "Tessera", "Zenith Labs", "Pulse", "QuantumOps"],
      productFeatures: [
        { emoji: "\u{1F9E0}", title: "Any model, one API", body: `Switch between OpenAI, Anthropic, and OSS models without code changes. ${platform} handles auth, retries, and fallbacks.` },
        { emoji: "\u{1F9EA}", title: "Eval that ships", body: "Built-in golden sets, drift alerts, and side-by-side comparisons so you can promote with confidence." },
        { emoji: "\u{1F501}", title: "Deterministic workflows", body: "Compose chains, retrieval, and tools as versioned graphs. Revert any change in one click." }
      ],
      stats: [
        { value: "10x", label: "Faster prompt iteration" },
        { value: "47ms", label: "Median routing latency" },
        { value: "300+", label: "Teams shipping in production" }
      ],
      testimonial: {
        quote: `We replaced a homegrown LLM stack with ${platform} and cut our AI engineering bench from 9 people to 3.`,
        author: "Priya Shah",
        role: "Head of AI at LumenAI"
      },
      pricing: [
        { name: "Hobby", price: "$0", period: "/mo", perks: ["1 project", "Community support", "Public templates"] },
        { name: "Team", price: "$99", period: "/seat/mo", perks: ["Unlimited projects", "Audit logs", "Eval suite"], highlight: true },
        { name: "Enterprise", price: "Custom", period: "", perks: ["Private cloud", "SSO + SCIM", "Dedicated success"] }
      ],
      footerColumns: [
        { heading: "Product", items: ["Platform", "Models", "Workflows", "Eval"] },
        { heading: "Developers", items: ["Docs", "API ref", "Templates", "Open source"] },
        { heading: "Company", items: ["Customers", "Pricing", "Security", "Careers"] },
        { heading: "Resources", items: ["Blog", "Changelog", "Webinars", "Guides"] }
      ],
      finalCtaTitle: `Start shipping AI with ${platform} today.`,
      finalCtaBody: "Free to start. Bring your own keys. No credit card required."
    };
  }

  if (industry === "EdTech") {
    return {
      heroEyebrow,
      navLinks: ["Courses", "For schools", "For learners", "Pricing", "Stories"],
      heroTagline: `Learning that students actually finish on ${platform}.`,
      heroValueProp: `${platform} blends adaptive practice, mastery tracking, and human-grade feedback to help every learner reach the next level.`,
      primaryCta: "Start learning free",
      secondaryCta: "Talk to your school",
      logoStrip: ["Northwood Academy", "Bridgewater High", "RiseLearn", "AcademyX", "TutorLoop", "PrimeSchool"],
      productFeatures: [
        { emoji: "\u{1F4DA}", title: "Adaptive courses", body: `${platform} tunes each lesson to the learner's pace, surfacing the right challenge at the right time.` },
        { emoji: "\u270F\uFE0F", title: "Practice that sticks", body: "Spaced repetition, instant hints, and structured feedback keep learners moving forward." },
        { emoji: "\u{1F4C8}", title: "Mastery dashboards", body: "Teachers and parents see exactly what a learner has mastered and what they need to revisit." }
      ],
      stats: [
        { value: "92%", label: "Course completion rate" },
        { value: "1.4x", label: "Faster mastery vs. baseline" },
        { value: "200+", label: "Schools onboarded" }
      ],
      testimonial: {
        quote: `${platform} doubled our completion rate and gave our teachers their evenings back.`,
        author: "James Reed",
        role: "Principal, Northwood Academy"
      },
      pricing: [
        { name: "Learner", price: "$0", period: "/mo", perks: ["Free courses", "Daily practice", "Progress tracking"] },
        { name: "Family", price: "$15", period: "/mo", perks: ["Up to 4 learners", "Detailed reports", "Live tutor sessions"], highlight: true },
        { name: "School", price: "Custom", period: "", perks: ["LMS integration", "Admin dashboards", "Dedicated success"] }
      ],
      footerColumns: [
        { heading: "Learn", items: ["Subjects", "Levels", "Tutors", "Stories"] },
        { heading: "For schools", items: ["LMS integration", "Pricing", "Case studies", "Support"] },
        { heading: "Company", items: ["About", "Careers", "Press", "Contact"] },
        { heading: "Resources", items: ["Blog", "Help center", "Research", "Community"] }
      ],
      finalCtaTitle: `Help every learner finish strong with ${platform}.`,
      finalCtaBody: "Free for individual learners. Roll out across your school in days."
    };
  }

  // General fallback
  const ctaCount = result.cta?.count ?? 0;
  const contrast = (result.color?.contrastRatio || 4.5).toFixed(1);
  return {
    heroEyebrow,
    navLinks: ["Product", "Pricing", "Customers", "Docs", "Company"],
    heroTagline: `${platform} \u2014 a faster, clearer experience for every visitor.`,
    heroValueProp: `${platform} is built around a ${blueprint.layoutTemplate.toLowerCase()} that puts the most important action front and center, with brand colors derived from your live palette.`,
    primaryCta: blueprint.ctaPlan.primary,
    secondaryCta: blueprint.ctaPlan.secondary,
    logoStrip: ["Acme", "Globex", "Initech", "Hooli", "Stark", "Wayne Industries"],
    productFeatures: [
      { emoji: "\u26A1", title: "Built for speed", body: `${platform} loads in under a second and gets users to value without the noise.` },
      { emoji: "\u{1F3A8}", title: "Accessible by default", body: `Color contrast averages ${contrast}:1 \u2014 readable for every visitor, on every device.` },
      { emoji: "\u{1F4F1}", title: "Mobile-first", body: "Designed for the 360px screen first, then scaled up gracefully to desktop." }
    ],
    stats: [
      { value: `+${Math.max(0, blueprint.projectedScoreRange.max - blueprint.scoreGapSummary.currentScore).toFixed(0)}`, label: `Projected TRAP score gain on ${platform}` },
      { value: ctaCount > 0 ? `${ctaCount}\u21922` : "2", label: "CTAs streamlined above the fold" },
      { value: `${contrast}:1`, label: "Average color contrast ratio" }
    ],
    testimonial: {
      quote: `The new ${platform} is faster, clearer, and converts visitors I would have lost before. Our team shipped it in two sprints.`,
      author: "Jamie Lee",
      role: `Founder, ${platform}`
    },
    pricing: [
      { name: "Starter", price: "$0", period: "/mo", perks: ["Core features", "Community support", "1 project"] },
      { name: "Pro", price: "$29", period: "/mo", perks: ["All features", "Priority support", "Unlimited projects"], highlight: true },
      { name: "Team", price: "$99", period: "/mo", perks: ["Team workspaces", "SSO", "Dedicated success"] }
    ],
    footerColumns: [
      { heading: "Product", items: ["Features", "Pricing", "Changelog", "Roadmap"] },
      { heading: "Resources", items: ["Docs", "Blog", "Templates", "Support"] },
      { heading: "Company", items: ["About", "Careers", "Press", "Contact"] },
      { heading: "Legal", items: ["Privacy", "Terms", "Security", "Cookies"] }
    ],
    finalCtaTitle: `Ready to ship the new ${platform}?`,
    finalCtaBody: "Use this generated layout as your new baseline and iterate against the live score."
  };
}

function buildSiteContent(
  result: AnalyticsResult,
  prediction: NonNullable<AnalyticsResult["prediction"]>,
  blueprint: GeneratedUiBlueprint
): GeneratedSiteContent {
  const platform = blueprint.platformName;
  const topIssue = blueprint.scoreGapSummary.topIssue;
  const currentScore = blueprint.scoreGapSummary.currentScore;
  const totalGap = blueprint.scoreGapSummary.totalGap;
  const projectedMin = blueprint.projectedScoreRange.min;
  const projectedMax = blueprint.projectedScoreRange.max;
  const layout = blueprint.layoutTemplate;
  const industry = blueprint.industry;
  const heroVariant = heroVariantFromLayout(layout);

  const eyebrow = safeText(
    `${industry} \u2022 ${blueprint.generationProfile.styleLabel} \u2022 Target ${blueprint.targetScore}/100`
  );
  const headline = safeText(industryHeadline(platform, industry, topIssue));
  const subheadline = trimSentence(
    `We rebuilt ${platform} around a ${layout.toLowerCase()} structure, ` +
      `${(prediction.colorPsychology || "calibrated color hierarchy").toLowerCase()}, and a ` +
      `${(prediction.conversionModel || "focused conversion").toLowerCase()} flow \u2014 ` +
      `recovering the ${totalGap.toFixed(1)} points lost to ${topIssue.toLowerCase()} and weak conversion signals.`,
    260
  );

  const heroBadges: GeneratedSiteContent["heroBadges"] = [
    { label: "Current", value: `${currentScore}/100` },
    { label: "Projected", value: `${projectedMin}\u2013${projectedMax}` },
    { label: "Layout", value: layout },
    { label: "Density", value: result.density.rating }
  ];

  const designSys = (prediction.designSystem || "design system").toLowerCase();
  const topGapLabel = blueprint.metricGaps[0]?.label.toLowerCase() || "conversion";

  const keeps = (prediction.strengths || []).slice(0, 2).map((s) => ({
    kind: "keep" as const,
    title: trimSentence(s, 70),
    body: trimSentence(
      `Already working for ${platform}. Preserved as a foundation in the redesign so we don't regress trust.`,
      150
    )
  }));
  const adds = (prediction.recommendedComponents || []).slice(0, 2).map((c) => ({
    kind: "add" as const,
    title: trimSentence(`Add: ${c}`, 70),
    body: trimSentence(
      `Introduces a missing ${designSys} element to lift ${topGapLabel} and tighten the value story.`,
      150
    )
  }));
  const fixes = blueprint.metricGaps.slice(0, 2).map((g) => ({
    kind: "fix" as const,
    title: trimSentence(`Fix: ${g.label}`, 70),
    body: trimSentence(g.suggestions[0] || g.whyItMatters, 150)
  }));
  const features = [...keeps, ...fixes, ...adds].slice(0, 6);

  const ctaCount = result.cta?.count ?? 0;
  const contrast = Number(result.color?.contrastRatio || 0);
  const components = result.domSummary?.componentCount ?? 0;
  const proofMetrics: GeneratedSiteContent["proofMetrics"] = [
    { value: `+${Math.max(0, projectedMax - currentScore).toFixed(0)}`, label: `Projected score gain on ${platform}` },
    {
      value: ctaCount > 0 ? `${ctaCount}\u21922` : "2",
      label: ctaCount > 2 ? "CTAs streamlined above the fold" : "Focused CTA architecture"
    },
    { value: `${(contrast || 4.5).toFixed(1)}:1`, label: "Color contrast tuned for readability" },
    { value: `${components}`, label: "Live components mapped to the redesign" }
  ].slice(0, 3);

  const faqs: GeneratedSiteContent["faqs"] = [];
  const risks = prediction.risks || [];
  const gaps = blueprint.metricGaps;
  for (let i = 0; i < Math.min(2, risks.length); i++) {
    const advice = gaps[i]?.suggestions[0] || gaps[0]?.suggestions[0] || "Apply the prioritized roadmap below.";
    faqs.push({
      q: trimSentence(`How does this redesign address: ${risks[i]}?`, 140),
      a: trimSentence(advice, 220)
    });
  }
  faqs.push({
    q: trimSentence(`Why a ${layout.toLowerCase()} for ${platform}?`, 140),
    a: trimSentence(
      `The analyzer detected a ${result.layout.type} on the live page. ` +
        `For ${industry}, a ${layout} pattern matches user intent and lifts ${topIssue.toLowerCase()}.`,
      240
    )
  });
  faqs.push({
    q: `Will this preserve ${platform}'s brand?`,
    a: trimSentence(
      `Yes \u2014 colors are derived from your live palette (${blueprint.designTokens.primary}, ` +
        `${blueprint.designTokens.secondary}, ${blueprint.designTokens.accent}) and only refined for contrast and hierarchy.`,
      260
    )
  });

  const phaseOneGain = blueprint.improvementRoadmap[0]?.expectedScoreGain || 0;
  const closing: GeneratedSiteContent["closing"] = {
    headline: trimSentence(
      `Ship the ${platform} redesign and close the ${totalGap.toFixed(1)}-point gap`,
      140
    ),
    body: trimSentence(
      `Phase 1 alone targets +${phaseOneGain.toFixed(1)} points by fixing ${topIssue.toLowerCase()}. ` +
        `Use this generated layout as the new baseline for ${platform} and iterate against the score breakdown.`,
      280
    )
  };

  const marqueeChips = [
    industry.toUpperCase(),
    layout.toUpperCase(),
    (prediction.conversionModel || "FOCUSED CONVERSION").toUpperCase(),
    (prediction.designSystem || "DESIGN SYSTEM").toUpperCase(),
    `${result.density.rating.toUpperCase()} DENSITY`,
    `TOP ISSUE: ${topIssue.toUpperCase()}`
  ].map(safeText);

  const landingPage = buildLandingPage(result, prediction, blueprint);

  return {
    eyebrow,
    headline,
    subheadline,
    heroVariant,
    heroBadges,
    features,
    proofMetrics,
    faqs,
    closing,
    marqueeChips,
    landingPage
  };
}


function buildReactComponent(blueprint: GeneratedUiBlueprint): string {
  const sc = blueprint.siteContent;
  if (!sc) return "// Generated UI unavailable";

  const componentName = toComponentName(blueprint.platformName);
  const tokens = blueprint.designTokens;
  const sty = STYLE_PRESETS[blueprint.generationProfile.stylePreset];
  const mo = MOTION_PRESETS[blueprint.generationProfile.motionLevel];
  const platform = blueprint.platformName.replace(/[`$\\]/g, "");
  const styleLabel = sty.label.replace(/[`$\\]/g, "");
  const cs = blueprint.scoreGapSummary.currentScore;
  const tg = blueprint.scoreGapSummary.totalGap;
  const projGain = Math.max(0, blueprint.projectedScoreRange.max - cs);

  const HERO = JSON.stringify({
    eyebrow: sc.eyebrow,
    headline: sc.headline,
    subheadline: sc.subheadline,
    heroVariant: sc.heroVariant,
    heroBadges: sc.heroBadges
  });
  const FEATURES = JSON.stringify(sc.features);
  const PROOF = JSON.stringify(sc.proofMetrics);
  const ROADMAP = JSON.stringify(blueprint.improvementRoadmap);
  const FAQS = JSON.stringify(sc.faqs);
  const CHIPS = JSON.stringify(sc.marqueeChips);
  const CLOSING = JSON.stringify(sc.closing);
  const CTA = JSON.stringify(blueprint.ctaPlan);

  let HeroVisualJsx = "null";
  if (sc.heroVariant === "split") {
    HeroVisualJsx = `(\n        <aside className="hero-visual mock-browser" aria-hidden>\n          <div className="mb-bar"><span /><span /><span /></div>\n          <div className="mb-body">\n            <div className="mb-line lg" style={{ background: "var(--primary)", opacity: .85 }} />\n            <div className="mb-line" /><div className="mb-line short" />\n            <div className="mb-cta" style={{ background: "var(--accent)" }} />\n          </div>\n        </aside>\n      )`;
  } else if (sc.heroVariant === "dashboard") {
    HeroVisualJsx = `(\n        <aside className="hero-visual mock-dashboard" aria-hidden>\n          <div className="mb-tabs"><span className="active" /><span /><span /></div>\n          <div className="mb-stats">\n            <div className="stat" style={{ borderLeftColor: "var(--primary)" }}><strong>${cs}</strong><span>Score</span></div>\n            <div className="stat" style={{ borderLeftColor: "var(--secondary)" }}><strong>+${projGain.toFixed(0)}</strong><span>Projected</span></div>\n            <div className="stat" style={{ borderLeftColor: "var(--accent)" }}><strong>${tg.toFixed(1)}</strong><span>Gap</span></div>\n          </div>\n          <div className="mb-chart">\n            <i style={{ height: "30%", background: "var(--primary)" }} />\n            <i style={{ height: "55%", background: "var(--secondary)" }} />\n            <i style={{ height: "80%", background: "var(--accent)" }} />\n            <i style={{ height: "65%", background: "var(--primary)" }} />\n            <i style={{ height: "90%", background: "var(--accent)" }} />\n          </div>\n        </aside>\n      )`;
  } else if (sc.heroVariant === "sidebar") {
    HeroVisualJsx = `(\n        <aside className="hero-visual mock-sidebar" aria-hidden>\n          <div className="mb-rail"><span style={{ background: "var(--primary)" }} /><span /><span /><span /><span /></div>\n          <div className="mb-content"><div className="mb-line lg" /><div className="mb-line" /><div className="mb-line short" /><div className="mb-cta" style={{ background: "var(--accent)" }} /></div>\n        </aside>\n      )`;
  } else if (sc.heroVariant === "card-grid") {
    HeroVisualJsx = `(\n        <aside className="hero-visual mock-grid" aria-hidden>\n          <div className="mb-mini" style={{ borderColor: "var(--primary)" }} />\n          <div className="mb-mini" />\n          <div className="mb-mini" style={{ borderColor: "var(--accent)" }} />\n          <div className="mb-mini" />\n        </aside>\n      )`;
  }

  const heroLayout = sc.heroVariant === "centered" ? "1fr" : "1.05fr .95fr";

  return `import React, { useEffect } from "react";

const HERO = ${HERO};
const FEATURES = ${FEATURES};
const PROOF = ${PROOF};
const ROADMAP = ${ROADMAP};
const FAQS = ${FAQS};
const CHIPS = ${CHIPS};
const CLOSING = ${CLOSING};
const CTA = ${CTA};

export default function ${componentName}() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("in"); });
    }, { threshold: 0.18 });
    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="trap-ui-gen">
      <div className="bg-grid" />
      <div className="orb orb-one" /><div className="orb orb-two" /><div className="orb orb-three" />

      <header className="shell nav reveal">
        <div className="logo-pill">${platform} \u2022 ${styleLabel}</div>
        <nav className="nav-links">
          <a href="#features">Plan</a><a href="#proof">Proof</a>
          <a href="#roadmap">Roadmap</a><a href="#faq">FAQ</a>
        </nav>
      </header>

      <section className={"shell hero hero-" + HERO.heroVariant + " reveal"}>
        <div className="hero-text">
          <p className="eyebrow">{HERO.eyebrow}</p>
          <h1>{HERO.headline}</h1>
          <p className="hero-copy">{HERO.subheadline}</p>
          <div className="cta-row">
            <button className="btn btn-primary">{CTA.primary}</button>
            <button className="btn btn-secondary">{CTA.secondary}</button>
          </div>
          <div className="hero-badges">
            {HERO.heroBadges.map((b) => (
              <span key={b.label}><strong>{b.label}:</strong> {b.value}</span>
            ))}
          </div>
        </div>
        {${HeroVisualJsx}}
      </section>

      <section className="marquee-wrap reveal">
        <div className="marquee-track">
          {[...CHIPS, ...CHIPS].map((c, i) => <span key={i}>{c}</span>)}
        </div>
      </section>

      <section id="features" className="shell section reveal">
        <h2>What we keep, fix, and add for ${platform}</h2>
        <p className="section-lead">Each card is generated from this site's analysis: green strengths, amber fixes, blue components to add.</p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className={"feature-card kind-" + f.kind}>
              <span className="kind-tag">{f.kind.toUpperCase()}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="proof" className="shell section reveal">
        <h2>Why this redesign for ${platform} performs</h2>
        <div className="proof-grid">
          {PROOF.map((m) => (
            <article key={m.label} className="proof-card">
              <p className="metric">{m.value}</p>
              <p>{m.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="roadmap" className="shell section reveal">
        <h2>Improvement roadmap to close the ${tg.toFixed(1)}-point gap</h2>
        <div className="timeline">
          {ROADMAP.map((p, i) => (
            <div key={p.phase} className="timeline-item">
              <span className="dot">{i + 1}</span>
              <div>
                <p className="phase-name">{p.phase} \u2022 +{p.expectedScoreGain.toFixed(1)} pts</p>
                <p className="phase-goal">{p.goal}</p>
                <ul>{p.tasks.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="shell section reveal">
        <h2>FAQ tailored to ${platform}</h2>
        <div className="faq-list">
          {FAQS.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <section className="shell cta-final reveal">
        <div>
          <p className="eyebrow">Final conversion block</p>
          <h2>{CLOSING.headline}</h2>
          <p>{CLOSING.body}</p>
        </div>
        <button className="btn btn-accent">{CTA.primary}</button>
      </section>

      <style jsx>{\`
        .trap-ui-gen {
          position: relative; min-height: 100vh; overflow-x: hidden; padding-bottom: 60px;
          background: ${tokens.background}; color: ${tokens.text}; font-family: ${tokens.fontFamily};
          --primary: ${tokens.primary}; --secondary: ${tokens.secondary}; --accent: ${tokens.accent};
          --surface: ${sty.cardBackground}; --radius: ${sty.radius};
          --nav-bg: ${sty.navBackground}; --nav-border: ${sty.navBorder};
          --card-border: ${sty.cardBorder}; --card-shadow: ${sty.cardShadow};
          --final-gradient: ${sty.finalGradient};
          --float-d: ${mo.floatDuration}s; --float-x: ${mo.floatDistance}px;
          --reveal-d: ${mo.revealDuration}s; --marquee-d: ${mo.marqueeDuration}s;
          --blur: ${sty.glass ? "blur(12px)" : "none"};
        }
        .bg-grid { position: fixed; inset: 0; background-image: linear-gradient(rgba(15,23,42,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.06) 1px, transparent 1px); background-size: 32px 32px; mask-image: radial-gradient(circle at 50% 20%, black 34%, transparent 72%); pointer-events: none; }
        .orb { position: fixed; border-radius: 999px; filter: blur(38px); opacity: .32; pointer-events: none; animation: floatOrb var(--float-d) ease-in-out infinite; }
        .orb-one { width: 260px; height: 260px; background: var(--primary); top: -70px; right: 10%; }
        .orb-two { width: 300px; height: 300px; background: var(--secondary); top: 32%; left: -100px; animation-delay: 1.7s; }
        .orb-three { width: 240px; height: 240px; background: var(--accent); bottom: -70px; right: -80px; animation-delay: 3s; }
        .shell { width: min(1120px, calc(100% - 32px)); margin: 0 auto; position: relative; z-index: 2; }
        .reveal { opacity: 0; transform: translateY(22px); transition: opacity var(--reveal-d) ease, transform var(--reveal-d) ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }
        .nav { margin-top: 18px; display: flex; justify-content: space-between; align-items: center; background: var(--nav-bg); border: 1px solid var(--nav-border); border-radius: var(--radius); padding: 10px 14px; backdrop-filter: blur(14px); }
        .logo-pill { font-size: 12px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; color: #0f172a; }
        .nav-links { display: flex; gap: 14px; }
        .nav-links a { color: #334155; text-decoration: none; font-size: 13px; font-weight: 700; }
        .hero { padding: 62px 0 30px; display: grid; grid-template-columns: ${heroLayout}; gap: 36px; align-items: center; }
        .hero-text { max-width: 780px; }
        .eyebrow { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; font-weight: 800; color: #475569; }
        h1 { margin: 0; font-size: clamp(34px, 5.4vw, 58px); line-height: 1.04; letter-spacing: -0.03em; color: #0f172a; }
        .hero-copy { margin-top: 18px; color: #334155; line-height: 1.7; font-size: clamp(15px, 1.8vw, 18px); }
        .cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
        .btn { border: 0; border-radius: var(--radius); padding: 13px 20px; font-weight: 800; cursor: pointer; transition: transform .24s ease, box-shadow .24s ease; font-size: 14px; }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: var(--primary); color: #fff; box-shadow: 0 10px 30px rgba(15,23,42,.24); }
        .btn-secondary { background: rgba(255,255,255,.85); border: 1px solid var(--secondary); color: #0f172a; }
        .btn-accent { background: var(--accent); color: #111827; box-shadow: 0 12px 26px rgba(0,0,0,.18); }
        .hero-badges { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 8px; }
        .hero-badges span { background: rgba(255,255,255,.74); border: 1px solid rgba(148,163,184,.34); border-radius: 999px; padding: 7px 11px; font-size: 12px; color: #334155; font-weight: 600; }
        .hero-badges strong { color: #0f172a; font-weight: 800; margin-right: 4px; }
        .hero-visual { background: var(--surface); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 18px; box-shadow: var(--card-shadow); backdrop-filter: var(--blur); aspect-ratio: 5/4; display: flex; flex-direction: column; gap: 10px; }
        .mock-browser .mb-bar { display: flex; gap: 6px; padding-bottom: 10px; border-bottom: 1px solid rgba(15,23,42,.07); }
        .mock-browser .mb-bar span { width: 10px; height: 10px; border-radius: 999px; background: rgba(15,23,42,.1); }
        .mb-body { padding-top: 6px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .mb-line { height: 12px; border-radius: 6px; background: rgba(15,23,42,.08); }
        .mb-line.lg { height: 30px; }
        .mb-line.short { width: 60%; }
        .mb-cta { width: 150px; height: 38px; border-radius: 8px; margin-top: 6px; }
        .mock-dashboard .mb-tabs { display: flex; gap: 6px; padding-bottom: 10px; border-bottom: 1px solid rgba(15,23,42,.07); }
        .mock-dashboard .mb-tabs span { width: 60px; height: 8px; border-radius: 4px; background: rgba(15,23,42,.1); }
        .mock-dashboard .mb-tabs span.active { background: var(--primary); }
        .mock-dashboard .mb-stats { display: flex; gap: 8px; padding: 6px 0; }
        .mock-dashboard .stat { flex: 1; padding: 10px; background: rgba(255,255,255,.55); border-left: 3px solid; border-radius: 8px; font-size: 11px; color: #475569; }
        .mock-dashboard .stat strong { display: block; font-size: 18px; color: #0f172a; }
        .mock-dashboard .mb-chart { display: flex; gap: 8px; align-items: flex-end; height: 80px; flex: 1; padding-top: 6px; }
        .mock-dashboard .mb-chart i { flex: 1; border-radius: 6px 6px 0 0; opacity: .85; }
        .mock-sidebar { flex-direction: row; }
        .mock-sidebar .mb-rail { display: flex; flex-direction: column; gap: 10px; padding-right: 12px; border-right: 1px solid rgba(15,23,42,.08); }
        .mock-sidebar .mb-rail span { width: 14px; height: 14px; border-radius: 4px; background: rgba(15,23,42,.1); display: block; }
        .mock-sidebar .mb-content { display: flex; flex-direction: column; gap: 10px; flex: 1; padding-left: 12px; }
        .mock-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 6px; }
        .mock-grid .mb-mini { aspect-ratio: 1; border: 2px solid rgba(15,23,42,.1); border-radius: var(--radius); background: rgba(255,255,255,.55); }
        .marquee-wrap { width: min(1120px, calc(100% - 32px)); margin: 6px auto 24px; overflow: hidden; border-radius: 14px; border: 1px solid rgba(148,163,184,.25); background: rgba(255,255,255,.65); }
        .marquee-track { display: flex; gap: 18px; white-space: nowrap; width: max-content; padding: 12px 0; animation: marquee var(--marquee-d) linear infinite; }
        .marquee-track span { font-size: 12px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; color: #334155; }
        .section { padding: 46px 0 0; }
        h2 { margin: 0 0 12px; font-size: clamp(24px, 3.2vw, 32px); letter-spacing: -0.02em; color: #0f172a; }
        .section-lead { margin: 0 0 18px; color: #475569; max-width: 780px; line-height: 1.65; font-size: 14px; }
        .feature-grid, .proof-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; }
        .feature-card, .proof-card { background: var(--surface); backdrop-filter: var(--blur); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 18px; box-shadow: var(--card-shadow); }
        .feature-card h3 { margin: 0 0 8px; font-size: 18px; color: #0f172a; }
        .feature-card p, .proof-card p { margin: 0; color: #475569; line-height: 1.65; font-size: 14px; }
        .kind-tag { display: inline-block; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 999px; letter-spacing: .07em; margin-bottom: 10px; }
        .kind-keep .kind-tag { background: #dcfce7; color: #166534; }
        .kind-add .kind-tag { background: #dbeafe; color: #1e40af; }
        .kind-fix .kind-tag { background: #fef3c7; color: #92400e; }
        .metric { font-size: 42px; margin: 0 0 8px; font-weight: 900; letter-spacing: -0.02em; color: var(--primary); }
        .timeline { display: grid; gap: 11px; }
        .timeline-item { display: grid; grid-template-columns: 34px 1fr; gap: 10px; align-items: start; background: var(--surface); backdrop-filter: var(--blur); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 14px; }
        .dot { width: 28px; height: 28px; border-radius: 999px; background: var(--primary); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; }
        .phase-name { margin: 0 0 4px; color: #0f172a; font-weight: 800; font-size: 14px; }
        .phase-goal { margin: 0 0 6px; color: #475569; font-size: 13px; }
        .timeline-item ul { margin: 6px 0 0; padding-left: 18px; color: #334155; font-size: 13px; }
        .timeline-item li { margin-bottom: 3px; }
        .faq-list { display: grid; gap: 10px; }
        details { background: var(--surface); backdrop-filter: var(--blur); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 12px 14px; box-shadow: var(--card-shadow); }
        summary { cursor: pointer; font-weight: 800; color: #0f172a; }
        details p { margin: 8px 0 0; color: #475569; line-height: 1.65; font-size: 14px; }
        .cta-final { margin-top: 34px; border-radius: calc(var(--radius) + 8px); padding: 30px 24px; background: var(--final-gradient); color: #fff; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 20px 50px rgba(15,23,42,.35); }
        .cta-final h2 { margin: 0 0 8px; font-size: clamp(24px, 3.4vw, 32px); color: #fff; }
        .cta-final p { margin: 0; max-width: 640px; color: rgba(255,255,255,.84); }
        .cta-final .eyebrow { color: rgba(255,255,255,.7); }
        @keyframes marquee { to { transform: translateX(-50%); } }
        @keyframes floatOrb { 0%,100% { transform: translateY(0); } 50% { transform: translateY(calc(-1 * var(--float-x))); } }
        @media (max-width: 880px) { .nav-links { display: none; } .hero { grid-template-columns: 1fr; padding-top: 42px; } .hero-visual { aspect-ratio: 16/10; } }
      \`}</style>
    </main>
  );
}
`;
}


function buildHtmlPrototype(blueprint: GeneratedUiBlueprint): string {
  const sc = blueprint.siteContent;
  if (!sc) {
    return "<!doctype html><html><body><p>Generated UI preview unavailable.</p></body></html>";
  }
  const tokens = blueprint.designTokens;
  const sty = STYLE_PRESETS[blueprint.generationProfile.stylePreset];
  const mo = MOTION_PRESETS[blueprint.generationProfile.motionLevel];
  const platform = escapeHtml(blueprint.platformName);
  const cs = blueprint.scoreGapSummary.currentScore;
  const tg = blueprint.scoreGapSummary.totalGap;
  const projGain = Math.max(0, blueprint.projectedScoreRange.max - cs);
  const heroVariant = sc.heroVariant;
  const heroLayout = heroVariant === "centered" ? "centered" : "split";

  let heroVisual = "";
  if (heroVariant === "split") {
    heroVisual = `<aside class="hero-visual mock-browser" aria-hidden="true">
      <div class="mb-bar"><span></span><span></span><span></span></div>
      <div class="mb-body">
        <div class="mb-line lg" style="background:var(--primary);opacity:.85"></div>
        <div class="mb-line"></div><div class="mb-line short"></div>
        <div class="mb-cta" style="background:var(--accent)"></div>
      </div></aside>`;
  } else if (heroVariant === "dashboard") {
    heroVisual = `<aside class="hero-visual mock-dashboard" aria-hidden="true">
      <div class="mb-tabs"><span class="active"></span><span></span><span></span></div>
      <div class="mb-stats">
        <div class="stat" style="border-left-color:var(--primary)"><strong>${cs}</strong><span>Score</span></div>
        <div class="stat" style="border-left-color:var(--secondary)"><strong>+${projGain.toFixed(0)}</strong><span>Projected</span></div>
        <div class="stat" style="border-left-color:var(--accent)"><strong>${tg.toFixed(1)}</strong><span>Gap</span></div>
      </div>
      <div class="mb-chart">
        <i style="height:30%;background:var(--primary)"></i>
        <i style="height:55%;background:var(--secondary)"></i>
        <i style="height:80%;background:var(--accent)"></i>
        <i style="height:65%;background:var(--primary)"></i>
        <i style="height:90%;background:var(--accent)"></i>
      </div></aside>`;
  } else if (heroVariant === "sidebar") {
    heroVisual = `<aside class="hero-visual mock-sidebar" aria-hidden="true">
      <div class="mb-rail"><span style="background:var(--primary)"></span><span></span><span></span><span></span><span></span></div>
      <div class="mb-content"><div class="mb-line lg"></div><div class="mb-line"></div><div class="mb-line short"></div><div class="mb-cta" style="background:var(--accent)"></div></div>
    </aside>`;
  } else if (heroVariant === "card-grid") {
    heroVisual = `<aside class="hero-visual mock-grid" aria-hidden="true">
      <div class="mb-mini" style="border-color:var(--primary)"></div>
      <div class="mb-mini"></div>
      <div class="mb-mini" style="border-color:var(--accent)"></div>
      <div class="mb-mini"></div>
    </aside>`;
  }

  const badgesHtml = sc.heroBadges
    .map((b) => `<span><strong>${escapeHtml(b.label)}:</strong> ${escapeHtml(b.value)}</span>`)
    .join("");
  const featuresHtml = sc.features
    .map(
      (f) =>
        `<article class="card kind-${f.kind}"><span class="kind-tag">${f.kind.toUpperCase()}</span><h3>${escapeHtml(
          f.title
        )}</h3><p>${escapeHtml(f.body)}</p></article>`
    )
    .join("");
  const proofHtml = sc.proofMetrics
    .map(
      (m) =>
        `<article class="card metric-card"><p class="metric">${escapeHtml(m.value)}</p><p>${escapeHtml(m.label)}</p></article>`
    )
    .join("");
  const roadmapHtml = blueprint.improvementRoadmap
    .map(
      (p, i) =>
        `<div class="timeline-item"><span class="dot">${i + 1}</span><div class="phase-body"><p class="phase-name">${escapeHtml(
          p.phase
        )} \u2022 +${p.expectedScoreGain.toFixed(1)} pts</p><p class="phase-goal">${escapeHtml(
          p.goal
        )}</p><ul>${p.tasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul></div></div>`
    )
    .join("");
  const faqHtml = sc.faqs
    .map((q) => `<details><summary>${escapeHtml(q.q)}</summary><p>${escapeHtml(q.a)}</p></details>`)
    .join("");
  const marqueeOnce = sc.marqueeChips.map((c) => `<span>${escapeHtml(c)}</span>`).join("");

  const lp = sc.landingPage;
  const navHtml = lp
    ? lp.navLinks
        .map((n, i) => `<a href="#${i === 0 ? "product" : i === 1 ? "pricing" : i === 2 ? "customers" : i === 3 ? "design-rationale" : "design-rationale"}">${escapeHtml(n)}</a>`)
        .join("")
    : `<a href="#features">Plan</a><a href="#proof">Proof</a><a href="#roadmap">Roadmap</a><a href="#faq">FAQ</a>`;
  const heroEyebrowHtml = lp ? escapeHtml(lp.heroEyebrow) : escapeHtml(sc.eyebrow);
  const heroTaglineHtml = lp ? escapeHtml(lp.heroTagline) : escapeHtml(sc.headline);
  const heroValuePropHtml = lp ? escapeHtml(lp.heroValueProp) : escapeHtml(sc.subheadline);
  const heroPrimaryCta = lp ? escapeHtml(lp.primaryCta) : escapeHtml(blueprint.ctaPlan.primary);
  const heroSecondaryCta = lp ? escapeHtml(lp.secondaryCta) : escapeHtml(blueprint.ctaPlan.secondary);

  const logoStripHtml = lp
    ? `<section class="shell logos reveal">
  <p class="logos-lead">Trusted by teams building the future</p>
  <div class="logos-row">${lp.logoStrip.map((n) => `<span class="logo-mark">${escapeHtml(n)}</span>`).join("")}</div>
</section>`
    : "";
  const productFeaturesHtml = lp
    ? `<section id="product" class="shell section reveal">
  <h2>What you can do with ${platform}</h2>
  <p class="section-lead">Three product capabilities, designed around how ${platform} customers actually work.</p>
  <div class="grid product-grid">${lp.productFeatures
    .map(
      (f) =>
        `<article class="card product-card"><span class="emoji" aria-hidden="true">${escapeHtml(f.emoji)}</span><h3>${escapeHtml(f.title)}</h3><p>${escapeHtml(f.body)}</p></article>`
    )
    .join("")}</div>
</section>`
    : "";
  const statsBandHtml = lp
    ? `<section id="customers" class="shell stats-wrap reveal"><div class="stats-band">${lp.stats
        .map((s) => `<div class="stat-tile"><p class="stat-value">${escapeHtml(s.value)}</p><p class="stat-label">${escapeHtml(s.label)}</p></div>`)
        .join("")}</div></section>`
    : "";
  const testimonialHtml = lp
    ? `<section class="shell testimonial reveal"><blockquote>“${escapeHtml(lp.testimonial.quote)}”</blockquote><p class="t-author"><strong>${escapeHtml(lp.testimonial.author)}</strong> • ${escapeHtml(lp.testimonial.role)}</p></section>`
    : "";
  const pricingHtml = lp
    ? `<section id="pricing" class="shell section reveal">
  <h2>Simple pricing for every team</h2>
  <p class="section-lead">Pick the plan that fits your stage. Upgrade or downgrade anytime.</p>
  <div class="grid pricing-grid">${lp.pricing
    .map(
      (p) =>
        `<article class="card price-card${p.highlight ? " featured" : ""}">${p.highlight ? '<span class="featured-tag">Most popular</span>' : ""}<p class="price-name">${escapeHtml(p.name)}</p><p class="price-amount"><strong>${escapeHtml(p.price)}</strong><span>${escapeHtml(p.period)}</span></p><ul>${p.perks.map((perk) => `<li>${escapeHtml(perk)}</li>`).join("")}</ul><button class="btn ${p.highlight ? "primary" : "secondary"}">${escapeHtml(p.highlight ? lp.primaryCta : `Choose ${p.name}`)}</button></article>`
    )
    .join("")}</div>
</section>`
    : "";
  const bigCtaHtml = lp
    ? `<section class="shell big-cta reveal"><h2>${escapeHtml(lp.finalCtaTitle)}</h2><p>${escapeHtml(lp.finalCtaBody)}</p><div class="buttons"><button class="btn primary">${escapeHtml(lp.primaryCta)}</button><button class="btn secondary">${escapeHtml(lp.secondaryCta)}</button></div></section>`
    : "";
  const footerHtml = lp
    ? `<footer class="shell foot reveal"><div class="foot-cols">${lp.footerColumns
        .map(
          (c) =>
            `<div><h4>${escapeHtml(c.heading)}</h4><ul>${c.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul></div>`
        )
        .join("")}</div><p class="foot-base">© ${new Date().getFullYear()} ${platform} — Generated landing page concept by TRAP UI.</p></footer>`
    : "";
  const rationaleDividerHtml = `<section id="design-rationale" class="shell rationale-divider reveal"><p class="rationale-eyebrow">DESIGNED FROM YOUR REPORT</p><h2>${escapeHtml(sc.headline)}</h2><p>${escapeHtml(sc.subheadline)}</p></section>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${platform} \u2022 ${escapeHtml(sty.label)} Landing</title>
<style>
:root {
  --primary: ${tokens.primary};
  --secondary: ${tokens.secondary};
  --accent: ${tokens.accent};
  --bg: ${tokens.background};
  --surface: ${sty.cardBackground};
  --text: ${tokens.text};
  --radius: ${sty.radius};
  --nav-bg: ${sty.navBackground};
  --nav-border: ${sty.navBorder};
  --card-border: ${sty.cardBorder};
  --card-shadow: ${sty.cardShadow};
  --final-gradient: ${sty.finalGradient};
  --float-d: ${mo.floatDuration}s;
  --float-x: ${mo.floatDistance}px;
  --reveal-d: ${mo.revealDuration}s;
  --marquee-d: ${mo.marqueeDuration}s;
  --blur: ${sty.glass ? "blur(12px)" : "none"};
}
* { box-sizing: border-box; }
body { margin:0; font-family:${tokens.fontFamily}; background:var(--bg); color:var(--text); min-height:100vh; overflow-x:hidden; }
.bg-grid { position:fixed; inset:0; background-image: linear-gradient(rgba(15,23,42,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.06) 1px, transparent 1px); background-size:32px 32px; mask-image: radial-gradient(circle at 50% 20%, black 34%, transparent 72%); pointer-events:none; z-index:0; }
.orb { position:fixed; border-radius:999px; filter: blur(38px); opacity:.32; pointer-events:none; animation: float var(--float-d) ease-in-out infinite; z-index:0; }
.orb.one { width:260px;height:260px;right:10%;top:-70px;background:var(--primary); }
.orb.two { width:300px;height:300px;left:-100px;top:35%;background:var(--secondary); animation-delay:1.7s; }
.orb.three { width:240px;height:240px;right:-80px;bottom:-70px;background:var(--accent); animation-delay:3s; }
.shell { width: min(1120px, calc(100% - 32px)); margin: 0 auto; position:relative; z-index:2; }
.reveal { opacity:0; transform: translateY(24px); transition: opacity var(--reveal-d) ease, transform var(--reveal-d) ease; }
.reveal.in { opacity:1; transform: none; }
.nav { margin-top:18px; display:flex; justify-content:space-between; align-items:center; background: var(--nav-bg); border:1px solid var(--nav-border); border-radius: var(--radius); padding:10px 14px; backdrop-filter: blur(14px); }
.logo { font-size:12px; font-weight:800; letter-spacing:.07em; text-transform:uppercase; color:#0f172a; }
.nav a { text-decoration:none; color:#334155; margin-left:14px; font-size:13px; font-weight:700; }
.hero { padding:62px 0 30px; display:grid; grid-template-columns: ${heroLayout === "split" ? "1.05fr .95fr" : "1fr"}; gap:36px; align-items:center; }
.hero-text { max-width:780px; }
.eyebrow { margin:0 0 10px; font-size:12px; text-transform:uppercase; letter-spacing:.08em; font-weight:800; color:#475569; }
h1 { margin:0; font-size: clamp(34px, 5.4vw, 58px); line-height:1.04; letter-spacing:-0.03em; color:#0f172a; }
.hero-copy { margin-top:18px; color:#334155; line-height:1.7; font-size: clamp(15px, 1.8vw, 18px); }
.buttons { margin-top:22px; display:flex; gap:12px; flex-wrap:wrap; }
.btn { border:0; border-radius: var(--radius); padding:13px 20px; font-weight:800; cursor:pointer; transition: transform .24s ease, box-shadow .24s ease; font-size:14px; }
.btn:hover { transform: translateY(-2px); }
.btn.primary { background: var(--primary); color:#fff; box-shadow: 0 10px 30px rgba(15,23,42,.24); }
.btn.secondary { background: rgba(255,255,255,.85); border:1px solid var(--secondary); color:#0f172a; }
.btn.accent { background: var(--accent); color:#111827; box-shadow: 0 12px 26px rgba(0,0,0,.18); }
.hero-badges { margin-top:18px; display:flex; flex-wrap:wrap; gap:8px; }
.hero-badges span { background: rgba(255,255,255,.74); border:1px solid rgba(148,163,184,.34); border-radius:999px; padding:7px 11px; font-size:12px; color:#334155; font-weight:600; }
.hero-badges strong { color:#0f172a; font-weight:800; margin-right:4px; }
.hero-visual { background: var(--surface); border:1px solid var(--card-border); border-radius: var(--radius); padding:18px; box-shadow: var(--card-shadow); backdrop-filter: var(--blur); aspect-ratio: 5/4; display:flex; flex-direction:column; gap:10px; }
.mock-browser .mb-bar { display:flex; gap:6px; padding-bottom:10px; border-bottom:1px solid rgba(15,23,42,.07); }
.mock-browser .mb-bar span { width:10px;height:10px;border-radius:999px;background:rgba(15,23,42,.1); }
.mock-browser .mb-bar span:first-child { background:#fca5a5; }
.mock-browser .mb-bar span:nth-child(2) { background:#fcd34d; }
.mock-browser .mb-bar span:nth-child(3) { background:#86efac; }
.mb-body { padding-top:6px; display:flex; flex-direction:column; gap:10px; flex:1; }
.mb-line { height:12px; border-radius:6px; background: rgba(15,23,42,.08); }
.mb-line.lg { height:30px; }
.mb-line.short { width:60%; }
.mb-cta { width:150px; height:38px; border-radius:8px; margin-top:6px; }
.mock-dashboard .mb-tabs { display:flex; gap:6px; padding-bottom:10px; border-bottom:1px solid rgba(15,23,42,.07); }
.mock-dashboard .mb-tabs span { width:60px; height:8px; border-radius:4px; background: rgba(15,23,42,.1); }
.mock-dashboard .mb-tabs span.active { background: var(--primary); }
.mock-dashboard .mb-stats { display:flex; gap:8px; padding:6px 0; }
.mock-dashboard .stat { flex:1; padding:10px; background: rgba(255,255,255,.55); border-left: 3px solid; border-radius:8px; font-size:11px; color:#475569; }
.mock-dashboard .stat strong { display:block; font-size:18px; color:#0f172a; }
.mock-dashboard .mb-chart { display:flex; gap:8px; align-items:flex-end; height:80px; flex:1; padding-top:6px; }
.mock-dashboard .mb-chart i { flex:1; border-radius:6px 6px 0 0; opacity:.85; }
.mock-sidebar { flex-direction:row; }
.mock-sidebar .mb-rail { display:flex; flex-direction:column; gap:10px; padding-right:12px; border-right:1px solid rgba(15,23,42,.08); }
.mock-sidebar .mb-rail span { width:14px; height:14px; border-radius:4px; background: rgba(15,23,42,.1); display:block; }
.mock-sidebar .mb-content { display:flex; flex-direction:column; gap:10px; flex:1; padding-left:12px; }
.mock-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:6px; }
.mock-grid .mb-mini { aspect-ratio:1; border:2px solid rgba(15,23,42,.1); border-radius: var(--radius); background: rgba(255,255,255,.55); }
.marquee { width: min(1120px, calc(100% - 32px)); margin:6px auto 24px; overflow:hidden; border-radius:14px; border:1px solid rgba(148,163,184,.25); background: rgba(255,255,255,.65); position:relative; z-index:2; }
.marquee .track { display:flex; gap:18px; white-space:nowrap; width:max-content; padding:12px 0; animation: marquee var(--marquee-d) linear infinite; }
.marquee span { font-size:12px; font-weight:800; letter-spacing:.09em; text-transform:uppercase; color:#334155; }
.section { padding:46px 0 0; }
h2 { margin:0 0 12px; font-size: clamp(24px, 3.2vw, 32px); letter-spacing:-0.02em; color:#0f172a; }
.section-lead { margin:0 0 18px; color:#475569; max-width:780px; line-height:1.65; font-size:14px; }
.grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap:14px; }
.card { background: var(--surface); backdrop-filter: var(--blur); border:1px solid var(--card-border); border-radius: var(--radius); padding:18px; box-shadow: var(--card-shadow); }
.card h3 { margin:0 0 8px; font-size:18px; color:#0f172a; }
.card p { margin:0; color:#475569; line-height:1.65; font-size:14px; }
.kind-tag { display:inline-block; font-size:10px; font-weight:800; padding:3px 8px; border-radius:999px; letter-spacing:.07em; margin-bottom:10px; }
.kind-keep .kind-tag { background:#dcfce7; color:#166534; }
.kind-add .kind-tag { background:#dbeafe; color:#1e40af; }
.kind-fix .kind-tag { background:#fef3c7; color:#92400e; }
.metric-card .metric { font-size:42px; margin:0 0 8px; font-weight:900; letter-spacing:-0.02em; color: var(--primary); }
.timeline { display:grid; gap:11px; }
.timeline-item { display:grid; grid-template-columns: 34px 1fr; gap:10px; align-items:start; background: var(--surface); backdrop-filter: var(--blur); border:1px solid var(--card-border); border-radius: var(--radius); padding:14px; }
.dot { width:28px; height:28px; border-radius:999px; background: var(--primary); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; }
.phase-name { margin:0 0 4px; color:#0f172a; font-weight:800; font-size:14px; }
.phase-goal { margin:0 0 6px; color:#475569; font-size:13px; }
.timeline-item ul { margin:6px 0 0; padding-left:18px; color:#334155; font-size:13px; }
.timeline-item li { margin-bottom:3px; }
details { background: var(--surface); backdrop-filter: var(--blur); border:1px solid var(--card-border); border-radius: var(--radius); padding:12px 14px; margin-bottom:10px; box-shadow: var(--card-shadow); }
summary { cursor:pointer; font-weight:800; color:#0f172a; }
details p { margin:8px 0 0; color:#475569; line-height:1.65; font-size:14px; }
.final { margin-top:34px; border-radius: calc(var(--radius) + 8px); padding:30px 24px; background: var(--final-gradient); color:#fff; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; box-shadow: 0 20px 50px rgba(15,23,42,.35); }
.final h2 { margin:0 0 8px; font-size: clamp(24px, 3.4vw, 32px); color:#fff; }
.final p { margin:0; max-width:640px; color: rgba(255,255,255,.84); font-size:14px; line-height:1.65; }
.final .eyebrow { color: rgba(255,255,255,.7); }
.logos { padding:30px 0 10px; text-align:center; }
.logos-lead { font-size:11px; text-transform:uppercase; letter-spacing:.14em; color:#94a3b8; margin:0 0 16px; font-weight:700; }
.logos-row { display:flex; gap:22px; flex-wrap:wrap; justify-content:center; align-items:center; }
.logo-mark { font-weight:800; font-size:13px; letter-spacing:.04em; color:rgba(15,23,42,.55); padding:6px 12px; border-radius:6px; background:rgba(255,255,255,.55); border:1px solid rgba(148,163,184,.22); }
.product-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
.product-card { display:flex; flex-direction:column; gap:8px; }
.product-card .emoji { font-size:32px; line-height:1; }
.product-card h3 { margin:4px 0 0; font-size:18px; color:#0f172a; }
.stats-wrap { padding:30px 0; }
.stats-band { display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:18px; padding:26px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: var(--radius); color:#fff; box-shadow: 0 16px 40px rgba(15,23,42,.18); }
.stat-tile { text-align:center; }
.stat-value { font-size:36px; font-weight:900; margin:0; letter-spacing:-0.02em; color:#fff; }
.stat-label { font-size:13px; opacity:.86; margin:4px 0 0; }
.testimonial { margin:30px auto; padding:26px 28px; background:var(--surface); border-left:4px solid var(--accent); border-radius:var(--radius); box-shadow:var(--card-shadow); max-width:880px; }
.testimonial blockquote { margin:0; font-size:20px; line-height:1.55; color:#0f172a; font-weight:500; }
.t-author { margin:14px 0 0; color:#475569; font-size:13px; }
.t-author strong { color:#0f172a; font-weight:800; }
.pricing-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.price-card { display:flex; flex-direction:column; gap:12px; position:relative; }
.price-card.featured { border:2px solid var(--primary); transform: translateY(-4px); }
.featured-tag { position:absolute; top:-10px; right:14px; background:var(--primary); color:#fff; font-size:10px; font-weight:800; padding:4px 10px; border-radius:999px; letter-spacing:.06em; text-transform:uppercase; }
.price-name { margin:0; font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:.07em; color:#475569; }
.price-amount { margin:0; }
.price-amount strong { font-size:36px; font-weight:900; color:#0f172a; letter-spacing:-0.02em; }
.price-amount span { color:#64748b; font-size:14px; margin-left:4px; }
.price-card ul { margin:6px 0 4px; padding-left:18px; color:#334155; font-size:13px; }
.price-card ul li { margin-bottom:4px; }
.price-card .btn { margin-top:auto; width:100%; }
.big-cta { margin-top:40px; padding:50px 26px; background:var(--final-gradient); color:#fff; text-align:center; border-radius: calc(var(--radius) + 8px); box-shadow: 0 24px 60px rgba(15,23,42,.28); }
.big-cta h2 { margin:0 0 12px; color:#fff; font-size: clamp(26px, 3.8vw, 36px); }
.big-cta p { margin:0 auto; max-width:640px; color:rgba(255,255,255,.86); font-size:15px; line-height:1.65; }
.big-cta .buttons { justify-content:center; margin-top:22px; display:flex; gap:12px; flex-wrap:wrap; }
.big-cta .btn.secondary { background: rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.4); color:#fff; }
.foot { padding:50px 0 30px; margin-top:30px; border-top:1px solid rgba(148,163,184,.3); }
.foot-cols { display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:24px; }
.foot h4 { margin:0 0 10px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#475569; }
.foot ul { list-style:none; padding:0; margin:0; display:grid; gap:8px; }
.foot li { color:#64748b; font-size:13px; cursor:pointer; }
.foot li:hover { color:#0f172a; }
.foot-base { margin:32px 0 0; font-size:12px; color:#94a3b8; text-align:center; }
.rationale-divider { margin-top:60px; padding:50px 0 16px; text-align:center; border-top:1px dashed rgba(148,163,184,.5); }
.rationale-eyebrow { color:var(--primary); font-weight:800; letter-spacing:.14em; font-size:11px; text-transform:uppercase; margin:0 0 10px; }
.rationale-divider h2 { margin:0 0 10px; }
.rationale-divider p { margin:0 auto; max-width:720px; color:#475569; line-height:1.65; font-size:14px; }
@keyframes marquee { to { transform: translateX(-50%); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(calc(-1 * var(--float-x))); } }
@media (max-width: 880px) {
  .nav nav { display:none; }
  .hero { grid-template-columns: 1fr; padding-top:42px; }
  .hero-visual { aspect-ratio: 16/10; }
}
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="orb one"></div><div class="orb two"></div><div class="orb three"></div>

<header class="shell nav reveal">
  <div class="logo">${platform} \u2022 ${escapeHtml(sty.label)}</div>
  <nav>${navHtml}</nav>
</header>

<section class="shell hero reveal">
  <div class="hero-text">
    <p class="eyebrow">${heroEyebrowHtml}</p>
    <h1>${heroTaglineHtml}</h1>
    <p class="hero-copy">${heroValuePropHtml}</p>
    <div class="buttons">
      <button class="btn primary">${heroPrimaryCta}</button>
      <button class="btn secondary">${heroSecondaryCta}</button>
    </div>
    <div class="hero-badges">${badgesHtml}</div>
  </div>
  ${heroVisual}
</section>

${logoStripHtml}
${productFeaturesHtml}
${statsBandHtml}
${testimonialHtml}
${pricingHtml}
${bigCtaHtml}
${footerHtml}

${rationaleDividerHtml}

<section class="marquee reveal"><div class="track">${marqueeOnce}${marqueeOnce}</div></section>

<section id="features" class="shell section reveal">
  <h2>What we keep, fix, and add for ${platform}</h2>
  <p class="section-lead">Each card below is generated from this site's analysis: green strengths preserved, amber high-impact fixes, blue components introduced.</p>
  <div class="grid">${featuresHtml}</div>
</section>

<section id="proof" class="shell section reveal">
  <h2>Why this redesign for ${platform} performs</h2>
  <p class="section-lead">Numbers derived from the live scan: current TRAP UI score, projected lift, CTAs detected, and contrast ratio.</p>
  <div class="grid">${proofHtml}</div>
</section>

<section id="roadmap" class="shell section reveal">
  <h2>Improvement roadmap to close the ${tg.toFixed(1)}-point gap</h2>
  <div class="timeline">${roadmapHtml}</div>
</section>

<section id="faq" class="shell section reveal">
  <h2>FAQ tailored to ${platform}</h2>
  ${faqHtml}
</section>

<section class="shell final reveal">
  <div>
    <p class="eyebrow">Final conversion block</p>
    <h2>${escapeHtml(sc.closing.headline)}</h2>
    <p>${escapeHtml(sc.closing.body)}</p>
  </div>
  <button class="btn accent">${escapeHtml(blueprint.ctaPlan.primary)}</button>
</section>

<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in'); });
}, { threshold: 0.18 });
document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
</script>
</body>
</html>`;
}


function buildImprovementRoadmap(metricGaps: MetricGapInsight[]): GeneratedUiBlueprint["improvementRoadmap"] {
  const [first, second, third] = metricGaps;
  const phaseOneGain = Number(((first?.scoreLoss || 0) + (second?.scoreLoss || 0)).toFixed(2));
  const phaseTwoGain = Number((third?.scoreLoss || 0).toFixed(2));
  const remaining = Number(
    metricGaps
      .slice(3)
      .reduce((sum, item) => sum + item.scoreLoss, 0)
      .toFixed(2)
  );

  return [
    {
      phase: "Phase 1 (Highest Impact)",
      goal: `${first?.label || "Top metric"} + ${second?.label || "second metric"} fixes`,
      expectedScoreGain: phaseOneGain,
      tasks: [...(first?.suggestions.slice(0, 2) || []), ...(second?.suggestions.slice(0, 2) || [])].slice(0, 4)
    },
    {
      phase: "Phase 2 (Conversion Lift)",
      goal: `${third?.label || "Conversion system"} hardening`,
      expectedScoreGain: phaseTwoGain,
      tasks: third?.suggestions.slice(0, 3) || ["Refine conversion structure based on user behavior."]
    },
    {
      phase: "Phase 3 (Polish + QA)",
      goal: "Consistency, responsiveness, and final quality pass",
      expectedScoreGain: remaining,
      tasks: [
        "Run mobile QA at 360/390/768 widths and fix clipping/overflow.",
        "Unify spacing, heading scale, and card rhythm.",
        "Validate final contrast and CTA prominence before launch."
      ]
    }
  ];
}

export function generateUiBlueprint(
  result: AnalyticsResult,
  prediction: NonNullable<AnalyticsResult["prediction"]>,
  url: string,
  industry: IndustryTag,
  options: GenerationOptions = {}
): GeneratedUiBlueprint {
  const platformName = platformNameFromUrl(url);
  const palette = result.color.palette || [];
  const resolved = resolveGenerationOptions(options);
  const styleConfig = STYLE_PRESETS[resolved.stylePreset];
  const motionConfig = MOTION_PRESETS[resolved.motionLevel];

  const primary = safeHex(palette[0], styleConfig.primaryFallback);
  const secondary = safeHex(palette[1], styleConfig.secondaryFallback);
  const accent = safeHex(palette[2], styleConfig.accentFallback);
  const background = styleConfig.background;
  const surface = styleConfig.surface;
  const text = styleConfig.text;

  const metricGaps = buildMetricGaps(result);
  const projectedMin = clamp(Math.round(result.score.final + metricGaps.reduce((a, b) => a + b.scoreLoss * 0.55, 0)), 88, 98);
  const projectedMax = 100;
  const industryLabel = toIndustryLabel(industry);
  const sections = sectionPlan(
    prediction.suggestedLayout as AnalyticsResult["layout"]["type"],
    prediction.recommendedComponents
  );
  const topIssue = metricGaps[0]?.label || "General optimization";

  const blueprint: GeneratedUiBlueprint = {
    platformName,
    sourceUrl: url,
    industry: industryLabel,
    targetScore: 100,
    targetBreakdown: IDEAL_BREAKDOWN,
    projectedScoreRange: {
      min: projectedMin,
      max: projectedMax
    },
    strategySummary:
      `Use a ${prediction.suggestedLayout} conversion-first layout with ${blueprintCtaLabel(prediction.conversionModel)}. ` +
      `${styleConfig.visualDirection} Primary improvement focus: ${topIssue}.`,
    generationProfile: {
      stylePreset: resolved.stylePreset,
      styleLabel: styleConfig.label,
      motionLevel: resolved.motionLevel,
      animationBudget: motionConfig.animationBudget,
      visualDirection: styleConfig.visualDirection
    },
    layoutTemplate: prediction.suggestedLayout,
    scoreGapSummary: {
      currentScore: result.score.final,
      targetScore: 100,
      totalGap: Number((100 - result.score.final).toFixed(2)),
      topIssue
    },
    metricGaps,
    improvementRoadmap: buildImprovementRoadmap(metricGaps),
    ctaPlan: {
      primary: result.cta.primary ? asTitle(result.cta.primary) : "Start Free Analysis",
      secondary: "Book Demo",
      placement: "Primary CTA in hero, repeated after trust proof and before footer",
      maxCtasAboveFold: 2
    },
    designTokens: {
      primary,
      secondary,
      accent,
      background,
      surface,
      text,
      radius: styleConfig.radius,
      spacing: styleConfig.spacing,
      fontFamily: styleConfig.fontFamily
    },
    sections,
    executionChecklist: [
      "Single H1 value proposition with one primary CTA above fold",
      "Limit above-fold actions to max two buttons",
      "Add trust proof within first 700px of scroll",
      "Maintain consistent spacing rhythm and card hierarchy",
      "Pass contrast checks for text and CTA states",
      "Optimize responsive behavior at 360px, 390px, 768px, 1280px"
    ],
    implementation: {
      reactComponent: "",
      htmlPrototype: ""
    }
  };

  blueprint.siteContent = buildSiteContent(result, prediction, blueprint);
  blueprint.implementation.reactComponent = buildReactComponent(blueprint);
  blueprint.implementation.htmlPrototype = buildHtmlPrototype(blueprint);
  return blueprint;
}

function blueprintCtaLabel(model: string): string {
  if (model.toLowerCase().includes("single")) return "a single-primary CTA strategy";
  if (model.toLowerCase().includes("multi")) return "a prioritized multi-CTA strategy";
  if (model.toLowerCase().includes("recovery")) return "a recovery CTA strategy";
  return "a balanced primary-secondary CTA strategy";
}
