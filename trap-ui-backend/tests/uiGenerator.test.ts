import { describe, expect, it } from "vitest";
import { generatePrediction } from "../src/services/predictionService.js";
import { generateUiBlueprint } from "../src/services/uiGeneratorService.js";
import type { AnalyticsResult } from "../src/types.js";

const mockResult: AnalyticsResult = {
  screenshot: {
    fullPagePath: "full.png",
    aboveTheFoldPath: "atf.png"
  },
  domSummary: {
    title: "Demo",
    buttons: 2,
    anchors: 9,
    headings: 3,
    sections: 4,
    images: 3,
    scrollHeight: 1800,
    componentCount: 21
  },
  cta: {
    count: 2,
    primary: "get started",
    placementScore: 8.4,
    items: [{ text: "get started", tag: "button", aboveFold: true, contrast: 4.7 }]
  },
  color: {
    palette: ["#0f172a", "#1d4ed8", "#f97316"],
    primaryColor: "#1d4ed8",
    contrastRatio: 5.8
  },
  layout: {
    type: "Split Hero",
    confidence: 81
  },
  density: {
    score: 4.8,
    rating: "Medium"
  },
  score: {
    final: 73.2,
    breakdown: {
      colorTrustIndex: 7.9,
      layoutEfficiency: 8.2,
      ctaOptimization: 8.0,
      conversionIndicators: 7.4,
      mobileResponsiveness: 7.1
    }
  },
  timingMs: 2900
};

describe("generateUiBlueprint", () => {
  it("returns a target-100 UI blueprint with implementation code", () => {
    const prediction = generatePrediction(mockResult, "AI SaaS");
    const blueprint = generateUiBlueprint(mockResult, prediction, "https://example.com", "AI SaaS");

    expect(blueprint.targetScore).toBe(100);
    expect(blueprint.scoreGapSummary.totalGap).toBeGreaterThan(0);
    expect(blueprint.metricGaps.length).toBe(5);
    expect(blueprint.improvementRoadmap.length).toBe(3);
    expect(blueprint.sections.length).toBeGreaterThan(0);
    expect(blueprint.implementation.reactComponent).toContain("export default function");
    expect(blueprint.implementation.reactComponent).toContain("Frequently asked questions");
    expect(blueprint.implementation.htmlPrototype).toContain("<!doctype html>");
    expect(blueprint.projectedScoreRange.max).toBe(100);
  });
});
