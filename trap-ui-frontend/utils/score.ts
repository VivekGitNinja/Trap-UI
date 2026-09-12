export function computeTrapUiScore(input: {
  color: number;
  layout: number;
  cta: number;
  conversion: number;
  mobile: number;
}): number {
  const weighted =
    input.color * 0.2 +
    input.layout * 0.25 +
    input.cta * 0.25 +
    input.conversion * 0.2 +
    input.mobile * 0.1;

  return Math.round(weighted * 10 * 10) / 10;
}
