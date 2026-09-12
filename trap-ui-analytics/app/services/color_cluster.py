import cv2
import numpy as np
from sklearn.cluster import KMeans


def _contrast_ratio(rgb1: tuple[int, int, int], rgb2: tuple[int, int, int]) -> float:
    def lum(rgb: tuple[int, int, int]) -> float:
        def channel(v: int) -> float:
            x = v / 255.0
            return x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4

        r, g, b = rgb
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

    l1 = lum(rgb1)
    l2 = lum(rgb2)
    high = max(l1, l2)
    low = min(l1, l2)
    return round((high + 0.05) / (low + 0.05), 2)


def extract_palette(image_path: str, k: int = 5) -> dict:
    image = cv2.imread(image_path)
    if image is None:
        return {"palette": ["#111111"], "primaryColor": "#111111", "contrastRatio": 21.0}

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pixels = rgb.reshape((-1, 3))

    if len(pixels) < k:
        return {"palette": ["#111111"], "primaryColor": "#111111", "contrastRatio": 21.0}

    # Fix random seed for deterministic sampling
    rng = np.random.RandomState(42)
    sample_size = min(len(pixels), 5000)
    sample = pixels[rng.choice(len(pixels), sample_size, replace=False)]

    model = KMeans(n_clusters=k, n_init="auto", random_state=42)
    model.fit(sample)

    labels, counts = np.unique(model.labels_, return_counts=True)
    centers = model.cluster_centers_.astype(int)

    sorted_idx = labels[np.argsort(-counts)]
    palette_rgb = [tuple(int(v) for v in centers[idx]) for idx in sorted_idx]

    palette_hex = [f"#{r:02x}{g:02x}{b:02x}" for r, g, b in palette_rgb]
    primary_rgb = palette_rgb[0] if palette_rgb else (17, 17, 17)

    # Find the maximum contrast between the primary color and the rest of the palette
    contrast = 1.0
    if len(palette_rgb) > 1:
        contrast = max(_contrast_ratio(primary_rgb, other_rgb) for other_rgb in palette_rgb[1:])
    else:
        # Fallback if only one color: compare against black or white, whichever contrasts more
        contrast = max(_contrast_ratio(primary_rgb, (255, 255, 255)), _contrast_ratio(primary_rgb, (0, 0, 0)))

    return {
      "palette": palette_hex[:k],
      "primaryColor": palette_hex[0] if palette_hex else "#111111",
      "contrastRatio": contrast,
    }
