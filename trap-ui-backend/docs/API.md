# TRAP UI Backend API

Base URL: `http://localhost:4000`

## Auth

### `POST /api/auth/register`
Body:
```json
{
  "name": "Vivek",
  "email": "vivek@example.com",
  "password": "strongpassword",
  "plan": "free"
}
```

### `POST /api/auth/login`
Body:
```json
{
  "email": "vivek@example.com",
  "password": "strongpassword"
}
```

### `GET /api/auth/me`
Header: `Authorization: Bearer <token>`

## Scan

### `POST /api/scan`
Header: `Authorization: Bearer <token>`
Body:
```json
{
  "url": "https://example.com",
  "industryTag": "AI SaaS"
}
```

### `GET /api/scan/:id`
Header: `Authorization: Bearer <token>`

## Reports

### `GET /api/reports`
Header: `Authorization: Bearer <token>`

### `GET /api/reports/:id`
Header: `Authorization: Bearer <token>`

### `GET /api/admin/reports`
Header: `Authorization: Bearer <token>`
Role required: `admin`

## Benchmarks

### `GET /api/benchmarks`
Header: `Authorization: Bearer <token>`
