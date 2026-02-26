from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from embedding_engine import IndonesianEmbeddingEngine
from typing import List
import time

app = FastAPI(title="Indonesian Embedding Service")

engine = IndonesianEmbeddingEngine()

class EmbedRequest(BaseModel):
    texts: List[str]

class EmbedResponse(BaseModel):
    embeddings: List[List[float]]
    dimension: int
    model: str
    elapsed_ms: float

@app.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest):
    if not req.texts or len(req.texts) == 0:
        raise HTTPException(status_code=400, detail="texts required")
    
    start = time.time()

    embeddings = engine.embed(req.texts)

    elapsed = (time.time() - start) * 1000

    return {
        "embeddings": embeddings,
        "dimension": len(embeddings[0]),
        "model": "asmud/indonesian-embedding-small (onnx)",
        "elapsed_ms": round(elapsed, 2),
    }

@app.get("/health")
def health():
    return {"status": "ok"}