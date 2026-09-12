def classify_layout(dom_summary: dict) -> dict:
    sections = dom_summary.get("sections", 0)
    images = dom_summary.get("images", 0)
    anchors = dom_summary.get("anchors", 0)
    headings = dom_summary.get("headings", 0)
    text_density = dom_summary.get("textDensity", 0.0)
    semantic_score = dom_summary.get("semanticScore", 0)

    # Scoring criteria for each layout type
    scores = {
        "Dashboard Layout": 0,
        "Card Grid Layout": 0,
        "Split Hero": 0,
        "Centered Hero": 0,
        "Sidebar Layout": 0
    }

    # Dashboard: High interactivity (anchors), high complexity, low text density (dense UI)
    if anchors > 20: scores["Dashboard Layout"] += 3
    if anchors > 40: scores["Dashboard Layout"] += 5
    if sections > 8: scores["Dashboard Layout"] += 2
    if text_density < 0.05: scores["Dashboard Layout"] += 2  # Very dense with little long-form text
    if semantic_score > 5: scores["Dashboard Layout"] += 2 # Uses nav/main structure

    # Card Grid: Many repeating sections and images, moderate text
    if sections >= 6: scores["Card Grid Layout"] += 3
    if images >= 6: scores["Card Grid Layout"] += 4
    if sections >= 10: scores["Card Grid Layout"] += 2
    if text_density > 0.05 and text_density < 0.15: scores["Card Grid Layout"] += 1

    # Split Hero: Balanced visual/text, moderate sections, clear hierarchy
    if sections >= 3 and sections <= 6: scores["Split Hero"] += 3
    if images >= 1 and images <= 4: scores["Split Hero"] += 3
    if headings >= 2: scores["Split Hero"] += 2
    if semantic_score >= 3: scores["Split Hero"] += 2 # Proper landing page structure

    # Centered Hero: Simple structure, strong headings, few sections, focused
    if sections <= 3: scores["Centered Hero"] += 4
    if headings >= 2: scores["Centered Hero"] += 3
    if images <= 2: scores["Centered Hero"] += 2
    if text_density > 0.08: scores["Centered Hero"] += 1 # More copy focused

    # Sidebar: Fallback for average content or documentation style
    scores["Sidebar Layout"] += 4  # Base probability
    if anchors > 10 and anchors <= 30: scores["Sidebar Layout"] += 2
    if text_density > 0.15: scores["Sidebar Layout"] += 3 # Documentation / Blog likely
    if semantic_score > 6: scores["Sidebar Layout"] += 2 # High semantic structure (nav + main + aside)

    # Find winner
    best_layout = max(scores, key=scores.get)
    best_score = scores[best_layout]
    
    # Calculate confidence: (Winner Score) / (Total Score)
    # Simple softmax-ish approximation
    total_score = sum(scores.values())
    confidence = 0.5 # Default fallback
    
    if total_score > 0:
        confidence = round(best_score / total_score, 2)
        # Boost confidence if it's a very strong match (>8 points)
        if best_score > 8:
            confidence = min(0.95, confidence + 0.2)
        elif best_score < 4:
            confidence = max(0.3, confidence - 0.1)

    return {
        "type": best_layout,
        "confidence": round(confidence * 100) # Return as percentage 0-100
    }
