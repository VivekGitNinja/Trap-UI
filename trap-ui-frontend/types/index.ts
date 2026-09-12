export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "free" | "pro" | "enterprise";
  scans_remaining: number;
}

export type UiStylePreset = "conversion-max" | "glass-lux" | "neo-bold";
export type UiMotionLevel = "minimal" | "balanced" | "cinematic";

export interface ScanJob {
  id: number;
  status: "queued" | "processing" | "completed" | "failed";
  result_json?: AnalysisResult;
  error_message?: string;
}

export interface GeneratedUiSection {
  id: string;
  title: string;
  purpose: string;
  components: string[];
  targetMetric: string;
}

export interface MetricGapInsight {
  metricKey: "colorTrustIndex" | "layoutEfficiency" | "ctaOptimization" | "conversionIndicators" | "mobileResponsiveness";
  label: string;
  current: number;
  target: number;
  gap: number;
  scoreLoss: number;
  priority: "high" | "medium" | "low";
  whyItMatters: string;
  suggestions: string[];
}

export interface AnalysisResult {
  screenshot: {
    fullPagePath: string;
    aboveTheFoldPath: string;
    fullPageUrl?: string;
    aboveTheFoldUrl?: string;
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
    breakdown: {
      colorTrustIndex: number;
      layoutEfficiency: number;
      ctaOptimization: number;
      conversionIndicators: number;
      mobileResponsiveness: number;
    };
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
  uiBlueprint?: {
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
    targetBreakdown: {
      colorTrustIndex: number;
      layoutEfficiency: number;
      ctaOptimization: number;
      conversionIndicators: number;
      mobileResponsiveness: number;
    };
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
  };
  timingMs: number;
}

export interface Benchmark {
  industry_name: "FinTech" | "AI SaaS" | "EdTech";
  year: number;
  avg_cta_count: number;
  dominant_layout: string;
  dominant_colors: string[];
  ui_density_avg: number;
  trap_ui_score_avg: number;
}

export interface ReportSummary {
  id: number;
  website_url: string;
  trap_ui_score: number;
  industry_tag: string | null;
  created_at: string;
}
