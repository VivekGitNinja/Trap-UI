import { mongodb } from "./db.js";

export async function getIndustryBenchmark(industry: string) {
  return mongodb().collection("IndustryData").findOne({ industry_name: industry, year: 2026 });
}

export async function listBenchmarks() {
  return mongodb().collection("IndustryData").find({ year: 2026 }).toArray();
}
