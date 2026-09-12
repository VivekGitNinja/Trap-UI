# TRAP UI Backend

Production-ready API service for authentication, scan orchestration, queue processing, report storage, and benchmark APIs.

## Stack
- Node.js + Fastify + TypeScript
- JWT Auth + Role-based access (`user`, `admin`)
- BullMQ + Redis queue
- PostgreSQL (users/plans/reports/scan jobs)
- MongoDB (industry benchmark + website analysis)

## Features
- Register/Login/Me auth APIs
- URL scan submission with security guards:
  - Public URL only
  - Login page rejection
  - robots.txt respect
  - Rate limiting
  - Plan-based scan quotas
- Async scan processing via Redis queue worker
- Report generation + persistence
- Benchmark comparison APIs

## Environment
Copy `.env.example` to `.env`.

## Run
```bash
npm install
npm run dev
```

## Test
```bash
npm test
```

## API Docs
See `/Volumes/Vivek's SSD/Mini/trap-ui-backend/docs/API.md`.

## Schema Script
See `/Volumes/Vivek's SSD/Mini/trap-ui-backend/db/schema.sql`.
