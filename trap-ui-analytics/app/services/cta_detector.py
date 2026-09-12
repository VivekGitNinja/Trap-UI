CTA_TERMS = {
    "buy",
    "start",
    "sign up",
    "signup",
    "subscribe",
    "book",
    "demo",
    "try",
    "get started",
    "join",
    "contact",
    "download",
    "launch",
    "create",
    "view",
    "explore",
    "learn more",
    "register",
    "login",
    "log in",
    "signin",
    "sign in",
    "checkout",
    "add to cart",
    "shop",
    "order"
}


def _parse_rgb(value: str) -> tuple[int, int, int]:
    if not value:
        return (0, 0, 0)
    text = value.strip().lower()
    if text.startswith("rgb"):
        nums = text[text.find("(") + 1 : text.find(")")].split(",")
        if len(nums) >= 3:
            return (int(float(nums[0])), int(float(nums[1])), int(float(nums[2])))
    return (0, 0, 0)


def _luminance(rgb: tuple[int, int, int]) -> float:
    def channel(v: int) -> float:
        x = v / 255.0
        return x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4

    r, g, b = rgb
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def _contrast_ratio(fg: tuple[int, int, int], bg: tuple[int, int, int]) -> float:
    l1 = _luminance(fg)
    l2 = _luminance(bg)
    high = max(l1, l2)
    low = min(l1, l2)
    return round((high + 0.05) / (low + 0.05), 2)


def _parse_pixels(value: str) -> float:
    if not value:
        return 0.0
    v = value.strip().lower()
    # Handle "10px"
    if v.endswith("px"):
        try:
            return float(v[:-2])
        except ValueError:
            return 0.0
    # Handle "0.5rem" (approx)
    if v.endswith("rem"):
        try:
            return float(v[:-3]) * 16
        except ValueError:
            return 0.0
    return 0.0


def _parse_weight(value: str) -> int:
    if not value:
        return 400
    v = value.strip().lower()
    if v == "bold":
        return 700
    if v == "normal":
        return 400
    try:
        return int(float(v))
    except ValueError:
        return 400


def detect_ctas(candidates: list[dict]) -> dict:
    items = []

    for row in candidates:
        text = " ".join(row.get("text", "").lower().split())
        if not text or len(text) > 60:
            continue

        # Extract styles
        fg = _parse_rgb(row.get("fg", ""))
        bg = _parse_rgb(row.get("bg", ""))
        contrast = _contrast_ratio(fg, bg)
        
        padding = row.get("padding", "")
        # Padding is complex "10px 20px", just check if it has digits
        has_padding = any(c.isdigit() for c in padding)
        
        radius = _parse_pixels(row.get("borderRadius", "0px"))
        weight = _parse_weight(row.get("fontWeight", "400"))
        size = _parse_pixels(row.get("fontSize", "16px"))
        cursor = row.get("cursor", "auto")
        
        # Scoring
        score = 0
        
        # 1. Text Match
        if any(term in text.split() for term in CTA_TERMS) or any(text.startswith(term) for term in CTA_TERMS):
            score += 4
        
        # 2. Visual Prominence
        if contrast >= 4.5:
            score += 4
        elif contrast >= 2.5:
            score += 2
            
        # 3. Button Semantics
        is_button_tag = row.get("tag") in ["button", "submit"]
        is_pointer = cursor == "pointer"
        is_rounded = radius > 1
        is_bold = weight >= 500
        is_large = size >= 14
        
        if is_button_tag: score += 3
        if has_padding: score += 2
        if is_pointer: score += 1
        if is_rounded: score += 1
        if is_bold: score += 1
        if is_large: score += 1
        
        # Threshold: 4 means it has multiple visual button traits OR it matches a CTA word
        if score >= 4:
            items.append(
                {
                    "text": text,
                    "tag": row.get("tag", "button"),
                    "aboveFold": bool(row.get("aboveFold", False)),
                    "contrast": contrast,
                    "score": score
                }
            )

    # Sort by score desc, then by aboveFold
    items.sort(key=lambda x: (x["aboveFold"], x["score"]), reverse=True)
    
    items = items[:30]
    count = len(items)
    primary = items[0]["text"] if items else None

    above_fold = len([x for x in items if x["aboveFold"]])
    placement_score = 0.0
    if count > 0:
        placement_score = round(min(10.0, (above_fold / count) * 10), 2)

    return {
      "count": count,
      "primary": primary,
      "placementScore": placement_score,
      "items": items
    }
