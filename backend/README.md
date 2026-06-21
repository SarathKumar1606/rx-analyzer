# Backend Deployment Guide

This backend is a FastAPI service for RxAnalyzer.
It exposes a single API endpoint at `/analyze` and uses `GROQ_API_KEY` from the environment.

## Local development

1. Create a virtual environment:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .\.venv\Scripts\activate # Windows PowerShell
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set the required environment variable:

```bash
export GROQ_API_KEY=your_groq_api_key
```

4. Start the app:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Recommended deployment configuration

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variable: `GROQ_API_KEY`

## Deploying on Render

1. Create a new Web Service in Render.
2. Connect the Git repo and set the root directory to `backend`.
3. Use the commands above.
4. Add `GROQ_API_KEY` as a secret environment variable.

## Deploying on Railway

1. Create a new Python service.
2. Point Railway to the `backend` directory.
3. Set the environment variable `GROQ_API_KEY`.
4. Use the same build and start commands.

## Docker deployment

Build and run with:

```bash
docker build -t rxanalyzer-backend .
docker run -e GROQ_API_KEY=your_groq_api_key -p 8000:8000 rxanalyzer-backend
```

## Notes

- This backend no longer saves uploaded files to disk permanently.
- The `uploads/` folder is not required for deployment and is excluded from git.
