import { describe, expect, it } from "vitest";
import { generatePrediction } from "../src/services/predictionService.js";
import type { AnalyticsResult } from "../src/types.js";

const mockResult: AnalyticsResult = {
  screenshot: {
    fullPagePath: "full.png",
    aboveTheFoldPath: "atf.png"
  },
  domSummary: {
    title: "Demo",
    buttons: 3,
    anchors: 12,
    headings: 4,
    sections: 5,
    images: 3,
    scrollHeight: 2200,
    componentCount: 27
  },
  cta: {
    count: 3,
    primary: "get started",
    placementScore: 8,
    items: [{ text: "get started", tag: "button", aboveFold: true, contrast: 4.5 }]
  },
  color: {
    palette: ["#1f2937", "#f97316"],
    primaryColor: "#1f2937",
    contrastRatio: 5.2
  },
  layout: {
    type: "Split Hero",
    confidence: 78
  },
  density: {
    score: 5.1,
    rating: "Medium"
  },
  score: {
    final: 72.4,
    breakdown: {
      colorTrustIndex: 7.4,
      layoutEfficiency: 8.2,
      ctaOptimization: 7.8,
      conversionIndicators: 7.1,
      mobileResponsiveness: 7.5
    }
  },
  timingMs: 3200
};

describe("generatePrediction", () => {
  it("returns enriched prediction output", () => {
    const prediction = generatePrediction(mockResult, "AI SaaS");

    expect(prediction.modelName).toBe("TRAP Design Intelligence");
    expect(prediction.modelVersion).toBe("v2.0");
    expect(prediction.confidence).toBeGreaterThanOrEqual(0);
    expect(prediction.confidence).toBeLessThanOrEqual(100);
    expect(prediction.actionItems.length).toBeGreaterThan(0);
    expect(prediction.recommendedComponents.length).toBeGreaterThan(0);
  });
});
