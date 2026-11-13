# ReportSaathi 🩺
**Empathetic, Accessible Medical Laboratory Report Explanations for Patients & Families**

ReportSaathi is a full-stack educational web application designed to bridge the medical literacy gap. It ingests complex laboratory reports (PDFs, scans, and camera photos), extracts clinical test parameters using native text parsing and Tesseract OCR, translates dense jargon into plain language, highlights out-of-range biomarkers without alarmism, and prepares empowering questions for patients to ask their doctors.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS, Lucide Icons.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2.
- **Extraction & OCR**: PyMuPDF (native vector PDF parsing) + Pillow & Tesseract OCR v5 (for scanned documents and mobile camera photos).
- **Medical Intelligence**: Google Gemini API (`gemini-2.5-flash`) with structured JSON schema outputs and strict non-diagnostic guardrails.
- **Persistence (Optional)**: Supabase PostgreSQL with Row Level Security (RLS) enforcing privacy-by-design.
- **Messaging (Optional)**: Telegram Bot integration using Telegram Bot API for mobile laboratory report breakdowns.

---

## 🌟 Key Features

1. **Strict Medical & Factual Safety (Zero Invention)**:
   - Never invents missing values, units, or reference intervals.
   - Distinctly separates raw extracted facts from plain-language educational explanations.
   - Refuses diagnostic or prescriptive inquiries (*"Do I have cancer?" ➔ Refusal with physician consultation guidance*).
   - Prominent, non-dismissible educational disclaimers across all views.
2. **Flexible Document Ingestion**:
   - Accepts `.pdf`, `.jpg`, `.jpeg`, and `.png` files.
   - Client-side and server-side validation against unauthorized file extensions and files exceeding 10 MB.
   - Safe temporary file management with guaranteed disk cleanup.
3. **Interactive Report Chat**:
   - Report-specific conversational assistant grounded strictly in the active report's extracted parameters.
4. **Privacy-by-Design Supabase Integration**:
   - Opt-in report saving: Original binary files and raw medical text are **never** stored.
   - Only user-approved summary metadata and biomarker counts are saved.
   - Full user-level DELETE capability.
   - **Demo-first resilience**: If Supabase credentials are not configured, the platform runs in local session mode without pretending cloud sync occurred.
5. **Telegram Bot Assistant**:
   - Secure bot script for parsing lab slips directly from Telegram with the same validation and safety rules.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+ or v20+) and npm
- Python (v3.10 - 3.15)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) installed and added to your system PATH

### 1. Clone & Inspect Repository
```bash
git clone <repo-url>
cd workshop
```

### 2. Backend Setup (FastAPI)
```bash
# Navigate to backend and create virtual environment
cd backend
python -m venv .venv

# Activate virtual environment:
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Edit `backend/.env`:
```env
# Google Gemini API Key (Leave empty to run in realistic simulated mode)
GEMINI_API_KEY=your_gemini_api_key_here

# Tesseract executable (tesseract if on PATH, or absolute path)
TESSERACT_CMD=tesseract

# Supabase (Optional - leave empty for guest local session storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_key

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Allowed CORS Origins
CORS_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173"]
```

Start the FastAPI backend server:
```bash
# In the workshop root:
# Windows PowerShell:
$env:PYTHONPATH="backend"
backend\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Linux/macOS:
PYTHONPATH=backend python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive API Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### 3. Frontend Setup (React + Vite)
```bash
# In another terminal:
cd frontend
npm install

# Configure environment variables
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 🧪 Testing & Quality Assurance

Run the automated backend test suite (8 tests covering validation, OCR safety, Gemini guardrails, chat boundaries, and Supabase flows):
```bash
$env:PYTHONPATH="backend"
backend\.venv\Scripts\pytest.exe backend\tests\test_api.py -v
```

Verify frontend production build integrity:
```bash
npm run build --prefix frontend
```

---

## 🗄️ Supabase Database Setup

To enable user accounts and persistent report history:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire contents of [`supabase/schema.sql`](supabase/schema.sql).
4. This script sets up:
   - `profiles` table linked to `auth.users` on cascade delete.
   - `saved_reports` table storing summary metadata and biomarker counts (no raw files or raw medical text).
   - Strict **Row Level Security (RLS)** policies guaranteeing users can only read, insert, and delete their own records (`auth.uid() = user_id`).
5. Copy your **Project URL** and **Anon Key** into `backend/.env`.

---

## 🤖 Optional Telegram Bot

To run the ReportSaathi Telegram Bot:
1. Create a bot using [@BotFather](https://t.me/BotFather) on Telegram and retrieve your bot token.
2. Add `TELEGRAM_BOT_TOKEN=your_token` to `backend/.env`.
3. Start the bot polling worker:
   ```bash
   $env:PYTHONPATH="backend"
   backend\.venv\Scripts\python.exe -m app.services.telegram_bot
   ```
4. Send a laboratory PDF or photo to your bot on Telegram to receive an educational summary and doctor questions.

---

## ☁️ Deployment Instructions

### 1. Frontend on Cloudflare Pages
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Build Output Directory**: `dist`
- **Root Directory**: `frontend`
- **Environment Variables**:
  - `VITE_API_URL`: `https://your-backend-service.onrender.com`

### 2. Backend on Render (Web Service)
- **Environment**: Python 3
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `PYTHONPATH`: `backend`
  - `GEMINI_API_KEY`: `your_production_gemini_key`
  - `TESSERACT_CMD`: `tesseract`
  - `SUPABASE_URL`: `https://your-project.supabase.co`
  - `SUPABASE_KEY`: `your_production_supabase_key`
  - `CORS_ORIGINS`: `["https://your-app.pages.dev"]`
- **System Packages (Tesseract OCR on Linux)**:
  - Add a `render.yaml` or build script installing `apt-get update && apt-get install -y tesseract-ocr`.
- **Health Check Path**: `/api/health`

---

## 📋 Final QA Checklist & Remaining Limitations

### QA Checklist
- [x] Strict file validation: Only `.pdf`, `.jpg`, `.jpeg`, and `.png` allowed.
- [x] File size enforcement: Files exceeding 10 MB are rejected with clear user warnings.
- [x] Empty & unreadable file handling: Explicit HTTP 400/422 responses.
- [x] Safe temporary file handling: Guaranteed disk unlink in try/finally blocks.
- [x] Zero invention rule: Reference ranges and units only populated when explicitly present in the source text.
- [x] Out-of-scope chat refusal: Diagnosis or treatment requests are safely deflected with doctor consultation guidance.
- [x] Supabase opt-in & RLS: Signed-in users only access their own records; local session demo fallback when credentials are absent.
- [x] Responsive layout: Verified on mobile and desktop viewports.

### Remaining Limitations
1. **Extremely Low-Resolution Handwritten Notes**: Tesseract OCR is tuned for printed laboratory report slips and digital PDFs; cursive handwritten doctor notes may require human verification or multi-modal vision models.
2. **Language Support**: Currently prompts and explanations are generated in English; multilingual translation (e.g. Hindi, Spanish) can be added in subsequent iterations.
3. **Session vs Persistent Guest Mode**: When Supabase is not configured, report history is retained for the active session only.
