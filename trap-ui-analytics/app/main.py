import os
import time
from fastapi import FastAPI
from pydantic import BaseModel, HttpUrl

from app.services.color_cluster import extract_palette
from app.services.cta_detector import detect_ctas
from app.services.density_engine import compute_ui_density
from app.services.dom_parser import parse_dom_summary
from app.services.layout_classifier import classify_layout
from app.services.score_engine import compute_breakdown, trap_ui_score
from app.services.screenshot import capture_page, cleanup_old_screenshots

app = FastAPI(title="TRAP UI Analytics")


class AnalyzeRequest(BaseModel):
    url: HttpUrl
    industry: str | None = None


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/analyze")
async def analyze(payload: AnalyzeRequest) -> dict:
    cleanup_old_screenshots(max_age_hours=24)
    started = time.time()

    page_data = await capture_page(str(payload.url))

    dom_summary = parse_dom_summary(page_data["html"], page_data["metrics"]["scrollHeight"])
    cta = detect_ctas(page_data["metrics"].get("ctaCandidates", []))
    color = extract_palette(page_data["aboveTheFoldPath"], k=5)
    layout_result = classify_layout(dom_summary)
    layout_type = layout_result["type"]
    density = compute_ui_density(dom_summary)

    breakdown = compute_breakdown(
      color_contrast=color["contrastRatio"],
      layout_type=layout_type,
      cta_count=cta["count"],
      cta_placement=cta["placementScore"],
      density_rating=density["rating"],
      industry=payload.industry
    )
    final_score = trap_ui_score(breakdown)

    return {
      "screenshot": {
        "fullPagePath": os.path.basename(page_data["fullPagePath"]),
        "aboveTheFoldPath": os.path.basename(page_data["aboveTheFoldPath"]),
      },
      "domSummary": dom_summary,
      "cta": cta,
      "color": color,
      "layout": layout_result,
      "density": density,
      "score": {
        "final": final_score,
        "breakdown": breakdown,
      },
      "timingMs": int((time.time() - started) * 1000),
    }
