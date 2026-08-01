# PulsePop Backend

Backend service for PulsePop AI Trend Intelligence Platform.

## Sprint Status
Sprint 2.1 - Backend Project Initialization

## How to Install

1. Ensure Python 3.12 is installed.
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## How to Run

Start the development server with Uvicorn:

```bash
uvicorn app.main:app --reload
```

The service will be accessible at `http://localhost:8000`.

Requesting `GET http://localhost:8000` returns:
```json
{
    "message": "PulsePop Backend Running"
}
```
