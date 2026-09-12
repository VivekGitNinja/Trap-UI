from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


async def _fake_capture(_url: str):
    return {
        "fullPagePath": "/tmp/full.png",
        "aboveTheFoldPath": "/tmp/atf.png",
        "html": """<html><head><title>Demo</title></head><body><section><h1>Hello</h1><a>Get Started</a><button>Book Demo</button></section></body></html>""",
        "metrics": {
            "scrollHeight": 1600,
            "ctaCandidates": [
                {
                    "text": "Get Started",
                    "tag": "a",
                    "aboveFold": True,
                    "fg": "rgb(255,255,255)",
                    "bg": "rgb(0,0,0)",
                }
            ],
        },
    }


def test_analyze_pipeline(monkeypatch):
    monkeypatch.setattr("app.main.capture_page", _fake_capture)
    monkeypatch.setattr(
        "app.main.extract_palette",
        lambda *_args, **_kwargs: {"palette": ["#000000", "#ffffff"], "primaryColor": "#000000", "contrastRatio": 7.0},
    )

    response = client.post("/analyze", json={"url": "https://example.com"})
    assert response.status_code == 200
    body = response.json()
    assert "score" in body
    assert 0 <= body["score"]["final"] <= 100
    assert body["cta"]["count"] >= 1
    assert body["screenshot"]["fullPageUrl"].endswith(".png")
    assert body["screenshot"]["aboveTheFoldUrl"].endswith(".png")


def test_analyze_invalid_url():
    response = client.post("/analyze", json={"url": "not-a-url"})
    assert response.status_code == 422
