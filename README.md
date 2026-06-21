# 💊 RxAnalyzer — Prescription Intelligence

A full-stack prescription analysis project with a Next.js frontend and a Python FastAPI backend.

## 📁 Current Project Structure

```
rx-analyzer/
├── backend/
│   ├── Dockerfile
│   ├── Procfile
│   ├── README.md
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── .dockerignore
│   └── uploads/            ← not required in deployment, ignored by git
├── my-app/
│   ├── app/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── .gitignore
│   └── .env.example
└── README.md
```

## 🚀 Backend Setup (Local)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .\.venv\Scripts\activate # Windows PowerShell
pip install -r requirements.txt
export GROQ_API_KEY=your_groq_api_key
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at `http://127.0.0.1:8000`.

## 🔧 Backend Deployment (Render / Railway)

### Recommended setup
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variable: `GROQ_API_KEY`

Both Render and Railway support this configuration directly.

### Docker deployment
If you want to deploy from a container, use the provided `backend/Dockerfile`.

## 🌐 Frontend Setup

```bash
cd my-app
npm install
npm run build
npm start
```

For local development:

```bash
npm run dev
```

The frontend uses `NEXT_PUBLIC_API_BASE_URL` to connect to the backend.

## 📌 Environment variables

- Backend: `GROQ_API_KEY`
- Frontend: `NEXT_PUBLIC_API_BASE_URL`

Create `.env` files from the `.env.example` files or set the values directly in your deployment platform.

## 🛠️ API Endpoints

| Method | Endpoint   | Description                          |
|--------|------------|--------------------------------------|
| GET    | `/`        | Health check                         |
| POST   | `/analyze` | Upload image + question → analysis   |

## ✅ Notes

- The backend now reads `GROQ_API_KEY` from environment variables.
- Uploaded images are handled in memory and not stored permanently in production.
- The frontend no longer hardcodes `127.0.0.1:8000` for the backend.
