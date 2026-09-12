import type { AnalyticsResult } from "../types.js";

type Industry = "FinTech" | "AI SaaS" | "EdTech" | null;

interface Archetype {
  id: string;
  designSystem: string;
  suggestedLayout: AnalyticsResult["layout"]["type"];
  preferredDensity: AnalyticsResult["density"]["rating"][];
  ctaRange: [number, number];
  industries: Array<Exclude<Industry, null>>;
  recommendedComponents: string[];
}

const ARCHETYPES: Archetype[] = [
  {
    id: "trust-first",
    designSystem: "Corporate Trust System",
    suggestedLayout: "Split Hero",
    preferredDensity: ["Low", "Medium"],
    ctaRange: [1, 4],
    industries: ["FinTech"],
    recommendedComponents: ["Sticky top bar", "Trust badges", "Proof strip", "Primary CTA block", "FAQ accordion"]
  },
  {
    id: "product-led",
    designSystem: "SaaS Clean System",
    suggestedLayout: "Centered Hero",
    preferredDensity: ["Medium"],
    ctaRange: [2, 5],
    industries: ["AI SaaS"],
    recommendedComponents: ["Feature grid", "Interactive demo CTA", "Social proof wall", "Comparison table", "Footer CTA"]
  },
  {
    id: "education-marketplace",
    designSystem: "Glass Lux System",
    suggestedLayout: "Card Grid Layout",
    preferredDensity: ["Medium", "High"],
    ctaRange: [3, 7],
    industries: ["EdTech"],
    recommendedComponents: ["Course cards", "Filter sidebar", "Instructor trust cards", "Trial CTA", "Outcome highlights"]
  },
  {
    id: "dashboard-growth",
    designSystem: "Cyber Dim System",
    suggestedLayout: "Dashboard Layout",
    preferredDensity: ["High"],
    ctaRange: [1, 3],
    industries: ["FinTech", "AI SaaS"],
    recommendedComponents: ["KPI strip", "Insight cards", "Action rail", "Segmented controls", "Export/Share controls"]
  },
  {
    id: "editorial-nav",
    designSystem: "Luxury Minimal System",
    suggestedLayout: "Sidebar Layout",
    preferredDensity: ["Medium", "High"],
    ctaRange: [1, 4],
    industries: ["EdTech", "FinTech"],
    recommendedComponents: ["Sidebar nav", "In-content CTA", "Context blocks", "Resource tiles", "Search-first header"]
  }
];

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeColorPsychology(primaryColor: string): string {
  const r = parseInt(primaryColor.slice(1, 3), 16);
  const g = parseInt(primaryColor.slice(3, 5), 16);
  const b = parseInt(primaryColor.slice(5, 7), 16);

  if (r >= 180 && g <= 110 && b <= 110) return "Urgency and momentum (red-led palette)";
  if (r <= 120 && g >= 150 && b <= 120) return "Growth and clarity (green-led palette)";
  if (r <= 110 && g <= 150 && b >= 170) return "Trust and stability (blue-led palette)";
  if (r >= 200 && g >= 170 && b <= 120) return "Energy and optimism (amber-led palette)";
  if (r <= 90 && g <= 90 && b <= 90) return "Authority and premium confidence (dark neutral palette)";
  return "Balanced neutrality with broad audience compatibility";
}

function detectConversionModel(ctaCount: number): string {
  if (ctaCount <= 0) return "Recovery Funnel (missing primary conversion intent)";
  if (ctaCount <= 2) return "Single Primary CTA Funnel";
  if (ctaCount <= 5) return "Primary + Secondary CTA Funnel";
  return "Multi-CTA Funnel (needs prioritization)";
}

function scoreArchetype(archetype: Archetype, result: AnalyticsResult, industry: Industry): number {
  let score = 0;

  if (archetype.suggestedLayout === result.layout.type) score += 35;
  if (archetype.preferredDensity.includes(result.density.rating)) score += 20;
  if (industry && archetype.industries.includes(industry)) score += 20;

  const [minCta, maxCta] = archetype.ctaRange;
  const ctaCount = result.cta.count;
  if (ctaCount >= minCta && ctaCount <= maxCta) {
    score += 15;
  } else {
    const distance = Math.min(Math.abs(ctaCount - minCta), Math.abs(ctaCount - maxCta));
    score -= clamp(distance * 4, 0, 15);
  }

  score += (result.score.final / 100) * 10;
  return clamp(Math.round(score));
}

export function generatePrediction(result: AnalyticsResult, industry: string | null): NonNullable<AnalyticsResult["prediction"]> {
  const normalizedIndustry: Industry =
    industry === "FinTech" || industry === "AI SaaS" || industry === "EdTech" ? industry : null;

  const ranked = ARCHETYPES.map((archetype) => ({
    archetype,
    score: scoreArchetype(archetype, result, normalizedIndustry)
  })).sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const second = ranked[1];
  const topDelta = top.score - (second?.score ?? 0);

  const strengths: string[] = [];
  const risks: string[] = [];
  const actionItems: string[] = [];

  if (result.score.breakdown.layoutEfficiency >= 8) strengths.push("Layout structure is coherent and easy to scan.");
  if (result.cta.placementScore >= 7) strengths.push("CTA placement is mostly above the fold.");
  if (result.score.breakdown.colorTrustIndex >= 7) strengths.push("Color contrast supports readability and trust.");
  if (result.density.rating === "Medium") strengths.push("Information density is conversion-friendly.");

  if (result.cta.count === 0) {
    risks.push("No clear conversion action is visible.");
    actionItems.push("Add one high-contrast primary CTA in the hero section.");
  } else if (result.cta.count > 6) {
    risks.push("Too many CTAs may dilute intent.");
    actionItems.push("Consolidate to one primary and one secondary CTA above the fold.");
  }

  if (result.score.breakdown.colorTrustIndex < 6.5) {
    risks.push("Color contrast may reduce readability.");
    actionItems.push("Increase button/text contrast to at least WCAG-friendly levels.");
  }

  if (result.density.rating === "High") {
    risks.push("High density can overwhelm first-time users.");
    actionItems.push("Reduce first-screen component load and group secondary content.");
  }

  if (result.score.breakdown.layoutEfficiency < 7) {
    risks.push("Layout pattern is not optimized for clear hierarchy.");
    actionItems.push(`Refactor to a ${top.archetype.suggestedLayout} with stronger visual hierarchy.`);
  }

  if (result.score.final < 60) {
    actionItems.push("Prioritize a hero rewrite with one value proposition and one CTA.");
  }

  actionItems.push(`Adopt ${top.archetype.designSystem} tokens for spacing, typography, and button hierarchy.`);
  actionItems.push("Run mobile-first pass for 360px/390px breakpoints before design freeze.");

  const confidence = clamp(
    Math.round(
      56 +
        topDelta * 1.2 +
        (result.layout.confidence || 0) * 0.18 +
        (result.score.final - 50) * 0.12 +
        (normalizedIndustry ? 4 : 0)
    )
  );

  return {
    modelName: "TRAP Design Intelligence",
    modelVersion: "v2.0",
    confidence,
    designSystem: top.archetype.designSystem,
    suggestedLayout: top.archetype.suggestedLayout,
    colorPsychology: normalizeColorPsychology(result.color.primaryColor),
    conversionModel: detectConversionModel(result.cta.count),
    strengths: strengths.slice(0, 4),
    risks: risks.slice(0, 4),
    recommendedComponents: top.archetype.recommendedComponents.slice(0, 5),
    actionItems: Array.from(new Set(actionItems)).slice(0, 6)
  };
}
