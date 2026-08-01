from fastapi import FastAPI

app = FastAPI(
    title="PulsePop Backend",
    version="1.0.0",
    description="Backend service for PulsePop AI Trend Intelligence Platform.",
)


@app.get("/")
def read_root():
    return {"message": "PulsePop Backend Running"}
