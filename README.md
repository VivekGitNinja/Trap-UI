# TRAP UI - Trend Research & Analytics Platform for UI

This workspace provides 3 isolated services and a compose setup.

## Services
1. `/Volumes/Vivek's SSD/Mini/trap-ui-frontend`
2. `/Volumes/Vivek's SSD/Mini/trap-ui-backend`
3. `/Volumes/Vivek's SSD/Mini/trap-ui-analytics`

## Product Flow
User -> Submit URL -> Queue -> Analytics -> Score -> Save Report -> Dashboard/Reports

## Implemented Requirements
- Public access (no login required for scan/report flow)
- Role-based access (`user`, `admin`)
- Plan-based scan limits
- URL validation + robots.txt + login-page rejection
- Screenshot engine (full + above fold)
- DOM parsing, CTA detection, color clustering, layout classification, density rating
- TRAP UI weighted score breakdown + final score 0-100
- Live URL preview on analyze page while scanning
- Multi-stage scan pipeline UI (open -> capture -> parse -> score -> predict)
- Enhanced design prediction engine (`TRAP Design Intelligence v2`) with confidence, risks, strengths, and prioritized actions
- Instant UI generator: per scanned URL, creates a platform-specific "target 100" blueprint with section plan, tokens, CTA plan, and copy-ready React/HTML code
- Score gap diagnostics: shows exactly where score is lost (metric-wise), point loss per metric, priority level, and targeted suggestions
- Improvement roadmap: phased tasks with expected score gain toward 100
- Industry benchmark module (FinTech, AI SaaS, EdTech)
- Report storage + retrieval
- Rate limiting and structured API errors
- Unit + integration + invalid URL tests
- Dockerized services with env-ready configs

## Run Everything
```bash
docker-compose up --build
```

## Service Ports
- Frontend: `3005`
- Backend: `4000`
- Analytics: `8000`
- Postgres: `5432`
- MongoDB: `27017`
- Redis: `6379`

## First Use
1. Open `http://localhost:3005`
2. Submit public URL on Analyze page
3. Watch result on Dashboard
4. View history in Reports
