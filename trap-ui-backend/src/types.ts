export type UserRole = "user" | "admin";
export type ScanJobStatus = "queued" | "processing" | "completed" | "failed";
export type UiStylePreset = "conversion-max" | "glass-lux" | "neo-bold" | "luxury-minimal" | "cyber-dim" | "saas-clean" | "corporate-trust";
export type UiMotionLevel = "minimal" | "balanced" | "cinematic";

export interface JwtUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface ScoreBreakdown {
  colorTrustIndex: number;
  layoutEfficiency: number;
  ctaOptimization: number;
  conversionIndicators: number;
  mobileResponsiveness: number;
}

export interface GeneratedUiSection {
  id: string;
  title: string;
  purpose: string;
  components: string[];
  targetMetric: string;
}

export interface MetricGapInsight {
  metricKey: keyof ScoreBreakdown;
  label: string;
  current: number;
  target: number;
  gap: number;
  scoreLoss: number;
  priority: "high" | "medium" | "low";
  whyItMatters: string;
  suggestions: string[];
}

export interface GeneratedUiBlueprint {
  platformName: string;
  sourceUrl: string;
  industry: "FinTech" | "AI SaaS" | "EdTech" | "General";
  generationProfile: {
    stylePreset: UiStylePreset;
    styleLabel: string;
    motionLevel: UiMotionLevel;
    animationBudget: string;
    visualDirection: string;
  };
  targetScore: number;
  targetBreakdown: ScoreBreakdown;
  projectedScoreRange: {
    min: number;
    max: number;
  };
  strategySummary: string;
  layoutTemplate: string;
  scoreGapSummary: {
    currentScore: number;
    targetScore: number;
    totalGap: number;
    topIssue: string;
  };
  metricGaps: MetricGapInsight[];
  improvementRoadmap: Array<{
    phase: string;
    goal: string;
    expectedScoreGain: number;
    tasks: string[];
  }>;
  ctaPlan: {
    primary: string;
    secondary: string;
    placement: string;
    maxCtasAboveFold: number;
  };
  designTokens: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    radius: string;
    spacing: string;
    fontFamily: string;
  };
  sections: GeneratedUiSection[];
  executionChecklist: string[];
  implementation: {
    reactComponent: string;
    htmlPrototype: string;
  };
  siteContent?: GeneratedSiteContent;
}

export interface GeneratedSiteContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  heroVariant: "centered" | "split" | "sidebar" | "dashboard" | "card-grid";
  heroBadges: Array<{ label: string; value: string }>;
  features: Array<{ kind: "keep" | "add" | "fix"; title: string; body: string }>;
  proofMetrics: Array<{ value: string; label: string }>;
  faqs: Array<{ q: string; a: string }>;
  closing: { headline: string; body: string };
  marqueeChips: string[];
  landingPage?: LandingPageContent;
}

export interface LandingPageContent {
  heroEyebrow: string;
  navLinks: string[];
  heroTagline: string;
  heroValueProp: string;
  primaryCta: string;
  secondaryCta: string;
  logoStrip: string[];
  productFeatures: Array<{ emoji: string; title: string; body: string }>;
  stats: Array<{ value: string; label: string }>;
  testimonial: { quote: string; author: string; role: string };
  pricing: Array<{ name: string; price: string; period: string; perks: string[]; highlight?: boolean }>;
  footerColumns: Array<{ heading: string; items: string[] }>;
  finalCtaTitle: string;
  finalCtaBody: string;
}

export interface AnalyticsResult {
  screenshot: {
    fullPagePath: string;
    aboveTheFoldPath: string;
  };
  domSummary: {
    title: string | null;
    buttons: number;
    anchors: number;
    headings: number;
    sections: number;
    images: number;
    scrollHeight: number;
    componentCount: number;
  };
  cta: {
    count: number;
    primary: string | null;
    placementScore: number;
    items: Array<{ text: string; tag: string; aboveFold: boolean; contrast: number }>;
  };
  color: {
    palette: string[];
    primaryColor: string;
    contrastRatio: number;
  };
  layout: {
    type: "Centered Hero" | "Split Hero" | "Sidebar Layout" | "Dashboard Layout" | "Card Grid Layout";
    confidence?: number;
  };
  density: {
    score: number;
    rating: "Low" | "Medium" | "High";
  };
  score: {
    final: number;
    breakdown: ScoreBreakdown;
  };
  prediction?: {
    modelName: string;
    modelVersion: string;
    confidence: number;
    designSystem: string;
    suggestedLayout: string;
    colorPsychology: string;
    conversionModel: string;
    strengths: string[];
    risks: string[];
    recommendedComponents: string[];
    actionItems: string[];
  };
  uiBlueprint?: GeneratedUiBlueprint;
  timingMs: number;
}
