export interface ScoreBreakdownInput {
  colorTrustIndex: number;
  layoutEfficiency: number;
  ctaOptimization: number;
  conversionIndicators: number;
  mobileResponsiveness: number;
}

export function computeTrapUiScore(input: ScoreBreakdownInput): number {
  const weighted =
    input.colorTrustIndex * 0.2 +
    input.layoutEfficiency * 0.25 +
    input.ctaOptimization * 0.25 +
    input.conversionIndicators * 0.2 +
    input.mobileResponsiveness * 0.1;

  return Math.round(weighted * 10 * 100) / 100;
}
