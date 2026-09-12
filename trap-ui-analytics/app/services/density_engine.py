def compute_ui_density(dom_summary: dict) -> dict:
    sections = max(1, int(dom_summary.get("sections", 1)))
    component_count = max(1, int(dom_summary.get("componentCount", 1)))
    scroll_height = max(1, int(dom_summary.get("scrollHeight", 1)))

    raw_score = (sections * component_count) / scroll_height * 100
    score = round(raw_score, 2)

    if score < 12:
        rating = "Low"
    elif score < 28:
        rating = "Medium"
    else:
        rating = "High"

    return {"score": score, "rating": rating}
