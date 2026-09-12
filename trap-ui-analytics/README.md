# TRAP UI Analytics Service

Python FastAPI service that performs UI analysis in one pass and returns full TRAP UI scoring payload.

## Stack
- FastAPI
- Pyppeteer (Puppeteer equivalent in Python)
- OpenCV + NumPy
- scikit-learn (K-Means)
- BeautifulSoup

## Features
- Full-page + above-the-fold screenshots
- DOM parsing (buttons, anchors, headings, sections, images)
- CTA detection (text + contrast + above-fold)
- Color clustering (`k=5`) + primary color + contrast ratio
- Rule-based layout classification
- UI density score + rating
- TRAP UI Score (0-100) with required weighted formula
- 24-hour screenshot cleanup

## Run
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Test
```bash
pytest -q
```
