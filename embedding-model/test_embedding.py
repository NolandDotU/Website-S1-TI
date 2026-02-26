from embedding_engine import IndonesianEmbeddingEngine
import numpy as np

engine = IndonesianEmbeddingEngine()

texts = [
    "Pengumuman",
    "Informasi",
    "Berita",
]

vectors = engine.embed(texts)

print("Jumlah vector:", len(vectors))
print("Dimensi vector:", len(vectors[0]))

# === Norm test ===
for i, v in enumerate(vectors):
    print(f"Norm {i}:", np.linalg.norm(v))

# === Similarity test ===
def cosine(a, b):
    return np.dot(a, b)

print("Q1 vs Q2:", cosine(vectors[0], vectors[1]))
print("Q1 vs Q3:", cosine(vectors[0], vectors[2]))

# === Determinism test ===
v1 = engine.embed(["Berita"])[0]
v2 = engine.embed(["informasi"])[0]
print("Max diff:", np.max(np.abs(np.array(v1) - np.array(v2))))
