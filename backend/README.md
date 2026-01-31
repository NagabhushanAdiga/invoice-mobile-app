# Invoice App Backend

Node.js + Express + MongoDB backend for the Invoice Mobile App.

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Setup

1. **Install dependencies**
   ```bash
   cd backend && npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - `MONGODB_URI` – MongoDB connection string (e.g. `mongodb://localhost:27017/invoice-app` or Atlas URI)
   - `JWT_SECRET` – Secret key for JWT tokens (use a strong random string in production)
   - `PORT` – Server port (default: 3000)

3. **Seed demo data (optional)**
   ```bash
   npm run seed
   ```
   Creates a demo user (`user@invoice.com` / `password123`), one company, and three sample invoices.

4. **Start the server**
   ```bash
   npm run dev    # development with auto-reload
   npm start      # production
   ```

Server runs at `http://localhost:3000`.

## Deploy to Vercel

1. **Connect your repo** to Vercel and set **Root Directory** to `backend`.

2. **Add Environment Variables** in Vercel Project Settings → Environment Variables (required):
   - `MONGODB_URI` – Your MongoDB Atlas connection string
   - `JWT_SECRET` – A strong random string for JWT signing

3. **MongoDB Atlas**: In Atlas → Network Access, allow `0.0.0.0/0` so Vercel serverless can connect.

4. Redeploy. Your API will be at `https://your-project.vercel.app/api/health`.

> **Note:** The "Serverless Function has crashed" error usually means `MONGODB_URI` or `JWT_SECRET` is missing in Vercel.

## API Endpoints

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{ name, email, password }` | Register new user |
| POST | `/api/auth/login` | `{ email, password }` | Login, returns JWT |
| GET | `/api/auth/me` | - | Get current user (Bearer token) |

### Companies (require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | List user's companies |
| GET | `/api/companies/:id` | Get company by id |
| POST | `/api/companies` | Create company |
| PATCH | `/api/companies/:id` | Update company |
| DELETE | `/api/companies/:id` | Delete company (fails if invoices exist) |

### Invoices (require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | List user's invoices |
| GET | `/api/invoices/:id` | Get invoice by id or invoiceId |
| POST | `/api/invoices` | Create invoice |
| PATCH | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Request/Response Examples

### Register
```json
POST /api/auth/register
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }

Response: { "success": true, "token": "eyJ...", "user": { "email": "john@example.com", "name": "John Doe" } }
```

### Create Company
```json
POST /api/companies
Authorization: Bearer <token>
{ "name": "My Company", "gstin": "29AABCU9603R1ZM", "address": "...", "email": "...", "mobile": "..." }

Response: { "id": "...", "name": "My Company", ... }
```

### Create Invoice
```json
POST /api/invoices
Authorization: Bearer <token>
{
  "companyId": "<company_id>",
  "customerName": "Acme Corp",
  "customerEmail": "billing@acme.com",
  "customerAddress": "123 Main St",
  "date": "2025-01-31",
  "dueDate": "2025-02-28",
  "taxPercentage": 8,
  "items": [
    { "name": "Service", "qty": 1, "rate": 100, "amount": 100 }
  ]
}

Response: { "id": "INV-123456", "companyId": "...", "subtotal": 100, "tax": 8, "total": 108, ... }
```
