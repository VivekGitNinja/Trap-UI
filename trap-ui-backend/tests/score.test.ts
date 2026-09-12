import { describe, expect, it } from "vitest";
import { computeTrapUiScore } from "../src/utils/score.js";

describe("computeTrapUiScore", () => {
  it("calculates weighted score out of 100", () => {
    const score = computeTrapUiScore({
      colorTrustIndex: 8,
      layoutEfficiency: 8,
      ctaOptimization: 8,
      conversionIndicators: 8,
      mobileResponsiveness: 8
    });

    expect(score).toBe(80);
  });
});
