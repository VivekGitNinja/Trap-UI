LAYOUT_BASELINE = {
    "Centered Hero": 7.8,
    "Split Hero": 8.2,
    "Sidebar Layout": 7.0,
    "Dashboard Layout": 8.6,
    "Card Grid Layout": 7.4,
}


def _clamp(value: float, lo: float = 0.0, hi: float = 10.0) -> float:
    return round(max(lo, min(hi, value)), 2)


def compute_breakdown(
    color_contrast: float, 
    layout_type: str, 
    cta_count: int, 
    cta_placement: float, 
    density_rating: str,
    industry: str = None
) -> dict:
    # Industry specific weights/penalties
    color_penalty = 1.0
    layout_penalty = 1.0
    cta_penalty = 1.0
    
    if industry == "FinTech":
        # FinTech needs high trust (contrast) and clear conversion
        if color_contrast < 4.5: color_penalty = 0.8
        if cta_count < 1: cta_penalty = 0.7
    elif industry == "AI SaaS":
        # AI SaaS needs modern layout and clear CTAs
        if layout_type not in ["Centered Hero", "Split Hero"]: layout_penalty = 0.9
    elif industry == "EdTech":
        # EdTech needs content clarity
        if density_rating == "High": layout_penalty = 0.85

    color = _clamp(((color_contrast / 7.0) * 10) * color_penalty)
    layout = _clamp(LAYOUT_BASELINE.get(layout_type, 7.0) * layout_penalty)

    cta_quantity_score = 10 - abs(4 - min(cta_count, 10)) * 1.5
    cta = _clamp(((cta_quantity_score * 0.6) + (cta_placement * 0.4)) * cta_penalty)

    conversion_base = 6.0 + min(2.0, cta_count / 3)
    if density_rating == "Medium":
        conversion_base += 1.0
    conversion = _clamp(conversion_base)

    mobile = _clamp(8.0 if density_rating != "High" else 6.8)

    return {
      "colorTrustIndex": color,
      "layoutEfficiency": layout,
      "ctaOptimization": cta,
      "conversionIndicators": conversion,
      "mobileResponsiveness": mobile,
    }


def trap_ui_score(breakdown: dict) -> float:
    weighted = (
        breakdown["colorTrustIndex"] * 0.2
        + breakdown["layoutEfficiency"] * 0.25
        + breakdown["ctaOptimization"] * 0.25
        + breakdown["conversionIndicators"] * 0.2
        + breakdown["mobileResponsiveness"] * 0.1
    )
    return round(weighted * 10, 2)
