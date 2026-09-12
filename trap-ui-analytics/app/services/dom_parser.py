from bs4 import BeautifulSoup


def parse_dom_summary(html: str, scroll_height: int) -> dict:
    soup = BeautifulSoup(html, "lxml")

    buttons = len(soup.find_all("button"))
    anchors = len(soup.find_all("a"))
    headings = len(soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]))
    sections = len(soup.find_all(["section", "main", "article", "aside"]))
    images = len(soup.find_all("img"))

    if sections == 0:
        sections = max(1, headings // 2)

    # Advanced Metrics
    text_content = soup.get_text(separator=" ", strip=True)
    text_length = len(text_content)
    html_length = len(html)
    text_density = round(text_length / max(1, html_length), 4)

    nav_count = len(soup.find_all("nav"))
    footer_count = len(soup.find_all("footer"))
    header_count = len(soup.find_all("header"))
    
    semantic_score = 0
    if nav_count > 0: semantic_score += 2
    if footer_count > 0: semantic_score += 2
    if header_count > 0: semantic_score += 2
    if soup.find("main"): semantic_score += 3
    if soup.find("article"): semantic_score += 1

    # Meta tags for SEO
    meta_desc = soup.find("meta", attrs={"name": "description"})
    has_meta_desc = bool(meta_desc and meta_desc.get("content"))
    
    # Image Alt Text Check
    imgs = soup.find_all("img")
    imgs_with_alt = sum(1 for img in imgs if img.get("alt"))
    alt_ratio = round(imgs_with_alt / max(1, len(imgs)), 2)

    component_count = buttons + anchors + headings + sections + images

    title = None
    if soup.title and soup.title.string:
        title = soup.title.string.strip()

    return {
      "title": title,
      "buttons": buttons,
      "anchors": anchors,
      "headings": headings,
      "sections": sections,
      "images": images,
      "scrollHeight": max(1, int(scroll_height)),
      "componentCount": component_count,
      "textDensity": text_density,
      "semanticScore": semantic_score,
      "hasMetaDescription": has_meta_desc,
      "imageAltRatio": alt_ratio
    }
