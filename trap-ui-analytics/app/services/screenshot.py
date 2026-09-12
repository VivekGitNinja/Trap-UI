import os
import time
import uuid
import cv2
import numpy as np
import requests
import urllib3
from pyppeteer import launch

SCREENSHOT_DIR = os.getenv("SCREENSHOT_DIR", "/tmp/trap-ui-shots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


async def capture_page(url: str) -> dict:
    file_prefix = uuid.uuid4().hex
    full_page = os.path.join(SCREENSHOT_DIR, f"{file_prefix}-full.png")
    above_fold = os.path.join(SCREENSHOT_DIR, f"{file_prefix}-atf.png")

    try:
        executable_path = os.getenv("PYPPETEER_EXECUTABLE_PATH")
        browser = await launch(
            headless=True,
            executablePath=executable_path,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        )
        page = await browser.newPage()
        await page.setViewport({"width": 1366, "height": 768, "deviceScaleFactor": 1})
        
        # Use 'domcontentloaded' to avoid hanging on external resources like fonts or ads
        # Decrease timeout to 15s since we just need the DOM and basic styles.
        try:
            await page.goto(url, {"waitUntil": "domcontentloaded", "timeout": 15000})
        except Exception:
            # Fallback if page navigation takes too long, but page might still be usable
            pass
            
        # Extra stabilization wait for animations/lazy loads
        await page.waitFor(2000)

        html = await page.content()
        metrics = await page.evaluate(
            """
            () => {
              const viewportHeight = window.innerHeight;
              const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || viewportHeight;
              const elements = Array.from(document.querySelectorAll('button, a, [role="button"]')).slice(0, 200);
              const ctas = elements.map((el) => {
                const rect = el.getBoundingClientRect();
                const st = window.getComputedStyle(el);
                return {
                  text: (el.innerText || '').trim().slice(0, 120),
                  tag: el.tagName.toLowerCase(),
                  y: rect.top,
                  aboveFold: rect.top < viewportHeight,
                  bg: st.backgroundColor,
                  fg: st.color,
                  fontSize: st.fontSize,
                  fontWeight: st.fontWeight,
                  padding: st.padding,
                  borderRadius: st.borderRadius,
                  cursor: st.cursor
                };
              }).filter((item) => item.text.length > 0);

              return {
                viewportHeight,
                scrollHeight,
                ctaCandidates: ctas
              };
            }
            """
        )

        await page.screenshot({"path": full_page, "fullPage": True})
        await page.screenshot({"path": above_fold, "clip": {"x": 0, "y": 0, "width": 1366, "height": 768}})
    except Exception as e:
        print(f"Browser automation failed: {e}")
        # Browser launch can fail in constrained containers; keep pipeline alive with fallback capture.
        response = requests.get(url, timeout=10, verify=False)
        response.raise_for_status()
        html = response.text
        metrics = {"viewportHeight": 768, "scrollHeight": 768, "ctaCandidates": []}

        placeholder = np.full((768, 1366, 3), 245, dtype=np.uint8)
        cv2.putText(
            placeholder,
            "Screenshot unavailable (fallback mode)",
            (80, 380),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.0,
            (60, 60, 60),
            2,
            cv2.LINE_AA,
        )
        cv2.imwrite(full_page, placeholder)
        cv2.imwrite(above_fold, placeholder)
    finally:
        if 'browser' in locals() and browser is not None:
            try:
                await browser.close()
            except Exception:
                pass

    return {
        "fullPagePath": full_page,
        "aboveTheFoldPath": above_fold,
        "html": html,
        "metrics": metrics,
    }


def cleanup_old_screenshots(max_age_hours: int = 24) -> None:
    now = time.time()
    cutoff = max_age_hours * 3600

    for name in os.listdir(SCREENSHOT_DIR):
        path = os.path.join(SCREENSHOT_DIR, name)
        if not os.path.isfile(path):
            continue
        try:
            if now - os.path.getmtime(path) > cutoff:
                os.remove(path)
        except OSError:
            continue
