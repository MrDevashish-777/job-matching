# AI-Powered Informal Sector Job Matchmaker

Voice-first, multilingual-friendly prototype that connects informal workers (plumbers, electricians, drivers, etc.) with employers. Now powered by fully free, local AI components: embeddings, speech-to-text, and a small conversational model.

## Tech Stack
- **Frontend**: React 18 + TypeScript, Vite, TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (email or phone + password)
- **AI/ML**:
  - **Embeddings**: HuggingFace sentence-transformers all-MiniLM-L6-v2 via `@xenova/transformers`
  - **STT**: Vosk (offline, local)
  - **Chat**: DialoGPT-small (local via `@xenova/transformers`)
- **Matching**: Geospatial prefilter + cosine similarity over embeddings

## Features
- **Worker**
  - Register/Login (email or phone)
  - Create/update profile (skills, experience, location, availability)
  - View recommended jobs (keyword-based matching)
  - Apply to jobs
- **Employer**
  - Register/Login (email or phone)
  - Post jobs (title, description, required skills, budget, location)
  - See recommended candidates, ranked by suitability
  - Accept a worker (stores accepted worker on the job)
- **Admin (optional, not fully implemented)**
  - View all jobs and users
  - Remove flagged/invalid users

## Repository Structure
```
.
├─ backend
│  ├─ src
│  │  ├─ config
│  │  │  ├─ db.ts            # Mongo connection
│  │  │  └─ env.ts           # Env config (validates MONGO_URI, JWT_SECRET, PORT)
│  │  ├─ controllers         # Route handlers
│  │  │  ├─ authController.ts
│  │  │  ├─ jobController.ts
│  │  │  └─ workerController.ts
│  │  ├─ middleware
│  │  │  └─ auth.ts          # JWT auth + role guard
│  │  ├─ models              # Mongoose models & interfaces
│  │  │  ├─ Employer.ts
│  │  │  ├─ Job.ts
│  │  │  └─ Worker.ts
│  │  ├─ routes
│  │  │  ├─ authRoutes.ts
│  │  │  ├─ jobRoutes.ts
│  │  │  └─ workerRoutes.ts
│  │  ├─ services
│  │  │  └─ matchingService.ts  # Keyword extraction + similarity
│  │  └─ server.ts            # App entrypoint
│  ├─ .env.example
│  ├─ package.json
│  └─ tsconfig.json
└─ frontend
   ├─ index.html
   ├─ src
   │  ├─ App.tsx
   │  ├─ main.tsx
   │  ├─ styles.css
   │  ├─ pages
   │  │  ├─ Auth
   │  │  │  ├─ Login.tsx
   │  │  │  └─ Register.tsx
   │  │  ├─ EmployerDashboard.tsx
   │  │  └─ WorkerDashboard.tsx
   │  └─ components           # (optional components)
   ├─ vite.config.ts          # Proxy /api → http://localhost:4000
   ├─ tailwind.config.js
   ├─ postcss.config.js
   ├─ package.json
   └─ tsconfig.json
```

## Prerequisites
- **Node.js**: v18+ recommended
- **npm**: v9+ recommended
- **MongoDB**: local or Docker
  - Docker quick start:
    ```powershell
    docker run -d --name mongo -p 27017:27017 mongo:6
    ```

## Environment Variables (Backend)
Create `backend/.env` (copy from example):
```
MONGO_URI=mongodb://127.0.0.1:27017/job_matchmaker
JWT_SECRET=devsecret_change_me
PORT=4000
VOSK_MODEL_PATH=e:\job-matching\backend\models\vosk-model-small-en-us-0.15
WAGE_RULES_PATH=e:\job-matching\backend\wageRules.json
```

## Install Dependencies
1) Backend
   ```powershell
   Set-Location "e:\job-matching\backend"; npm install
   ```
2) Frontend
   ```powershell
   Set-Location "e:\job-matching\frontend"; npm install
   ```

## Vosk model download (required for voice profile)
1) Download a small Vosk model (e.g., vosk-model-small-en-us-0.15) from the official repo.
2) Extract to: `e:\job-matching\backend\models\vosk-model-small-en-us-0.15`
3) Ensure `VOSK_MODEL_PATH` in `.env` points to that folder.

## Seed demo data
```powershell
Set-Location "e:\job-matching\backend"; npm run seed
```

## Run the Project
1) Start MongoDB (local or Docker)
2) Backend (dev with auto-reload)
   ```powershell
   Set-Location "e:\job-matching\backend"; npm run dev
   ```
   - Or build & start:
     ```powershell
     Set-Location "e:\job-matching\backend"; npm run build; npm start
     ```
3) Frontend (Vite dev server)
   ```powershell
   Set-Location "e:\job-matching\frontend"; npm run dev
   ```
4) Open http://localhost:5173

Vite proxy forwards requests from `/api/*` → `http://localhost:4000/*`.

## Authentication
- **Token**: JWT signed with `JWT_SECRET`
- **Header**: `Authorization: Bearer <token>`
- **Roles**:
  - `worker`
  - `employer`
- Protected endpoints verify the token and, where specified, required roles.

## API Reference (Prototype)
Base URL: `http://localhost:4000`

### Auth
1) POST `/auth/register`
   - Body (worker):
     ```json
     {
       "role": "worker",
       "name": "Alice",
       "email": "alice@example.com",
       "phone": "",
       "password": "secret123",
       "location": "Nairobi"
     }
     ```
   - Body (employer):
     ```json
     {
       "role": "employer",
       "companyName": "FixIt Co.",
       "contactName": "Bob",
       "email": "hr@fixit.co",
       "phone": "",
       "password": "secret123",
       "location": "Nairobi"
     }
     ```
   - Response:
     ```json
     {
       "token": "<jwt>",
       "role": "worker",
       "worker": { "_id": "...", "name": "Alice", "skills": [], ... }
     }
     ```

2) POST `/auth/login`
   - Body (email or phone required):
     ```json
     { "role": "worker", "email": "alice@example.com", "password": "secret123" }
     ```
   - Response:
     ```json
     { "token": "<jwt>", "role": "worker", "worker": { "_id": "...", ... } }
     ```

### Workers
1) GET `/workers`
   - Returns a list of workers (basic listing; suitable for admin-like use).
2) GET `/workers/me` (auth: worker)
   - Header: `Authorization: Bearer <token>`
   - Response: worker profile
3) PUT `/workers/me` (auth: worker)
   - Body (any fields optional):
     ```json
     {
       "skills": ["plumbing", "wiring"],
       "experienceYears": 5,
       "location": "Kisumu",
       "availability": true
     }
     ```

### Jobs
1) GET `/jobs`
   - List recent jobs
2) POST `/jobs` (auth: employer)
   - Body:
     ```json
     {
       "title": "Electrician for home rewiring",
       "description": "Need someone to rewire a 3-bedroom house.",
       "skillsRequired": ["electrician", "wiring", "safety"],
       "budget": 300,
       "location": "Nairobi"
     }
     ```
3) GET `/jobs/:id`
4) PUT `/jobs/:id` (auth: employer, must be creator)
5) DELETE `/jobs/:id` (auth: employer, must be creator)
6) POST `/jobs/:id/apply` (auth: worker)
   - Worker applies to the job
7) POST `/jobs/:id/accept` (auth: employer)
   - Body:
     ```json
     { "workerId": "<workerObjectId>" }
     ```
   - Marks job as `in_progress` and stores accepted worker
8) GET `/jobs/:id/match`
   - Returns up to top 20 recommended workers with scores
   - Response sample:
     ```json
     [
       { "score": 0.67, "worker": { "_id": "...", "name": "Alice", "skills": ["wiring", ...] } }
     ]
     ```

## Matching Logic (Simplified AI)
File: `backend/src/services/matchingService.ts`
- **extractKeywords(text)**: cleans and splits text, lowercases, removes short tokens
- **normalize(tokens)**: trims, lowercases, deduplicates
- **jaccardSimilarity(a, b)**: |a ∩ b| / |a ∪ b|
- **rankWorkers(skillsRequired, jobDescription, workers)**:
  1. Build job keywords from `skillsRequired + extractKeywords(description)`
  2. Compare to each worker’s normalized skills
  3. Sort by score desc

This approach is predictable, fast, and requires no external ML services. It can be replaced with embeddings + cosine similarity later.

## Frontend Notes
- **Vite dev server** on port 5173
- **Proxy**: `/api` → `http://localhost:4000`
- **Auth storage**: JWT stored in `localStorage` (`token`)
- **Pages**:
  - Login / Register: forms for both roles
  - Worker Dashboard: edit profile, see recommended jobs, apply
  - Employer Dashboard: post jobs, view ranked candidates, accept worker

## Scripts
- Backend
  - `npm run dev` — ts-node-dev with auto-reload
  - `npm run build` — TypeScript compile to `dist`
  - `npm start` — run compiled server
- Frontend
  - `npm run dev` — Vite dev server
  - `npm run build` — TypeScript build + Vite production build
  - `npm run preview` — preview production build

## Development Workflow
1. Start MongoDB
2. Start backend (`npm run dev`)
3. Start frontend (`npm run dev`)
4. Register and login in the UI
5. Employer posts a job; Worker updates skills/availability
6. Worker applies; Employer views matches and accepts a worker

## Troubleshooting
- **connect ECONNREFUSED 127.0.0.1:27017**
  - MongoDB is not running. Start local service or run Docker:
    ```powershell
    docker run -d --name mongo -p 27017:27017 mongo:6
    ```
- **Unauthorized / Forbidden**
  - Ensure you include `Authorization: Bearer <token>` for protected routes and correct role.
- **Proxy issues**
  - Frontend assumes backend at `http://localhost:4000`. Adjust `frontend/vite.config.ts` if needed.
- **CORS**
  - When running without the Vite proxy, ensure backend CORS allows the frontend origin.

## Roadmap / Improvements
- Admin pages and stronger moderation flows
- TF-IDF or embedding-based similarity (cosine) for better matching
- File uploads: voice intro → transcription → profile extraction
- Geospatial search (by location/geohash)
- Production deployment (Render/Heroku for backend, Netlify/Vercel for frontend)
- E2E and API tests; CI/CD

---
This is a prototype intended for fast iteration. Keep changes small and focused on core flows (auth, CRUD, matching). Feel free to swap the matching implementation with more advanced methods as requirements evolve.