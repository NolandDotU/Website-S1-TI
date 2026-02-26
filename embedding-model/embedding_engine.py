import onnxruntime as ort
import numpy as np
from tokenizers import Tokenizer
from typing import List


class IndonesianEmbeddingEngine:
    def __init__(
        self,
        model_path: str = "./onnx/indonesian_embedding.onnx",
        tokenizer_path: str = "./onnx/tokenizer.json",
        max_length: int = 384,
    ):
        self.max_length = max_length

        # Load tokenizer
        self.tokenizer = Tokenizer.from_file(tokenizer_path)

        # Load ONNX model
        self.session = ort.InferenceSession(
            model_path,
            providers=["CPUExecutionProvider"]
        )

        self.input_names = {i.name for i in self.session.get_inputs()}

    def _tokenize(self, texts: List[str]):
        encodings = self.tokenizer.encode_batch(texts)

        input_ids = []
        attention_mask = []

        for enc in encodings:
            ids = enc.ids[: self.max_length]
            mask = [1] * len(ids)

            pad_len = self.max_length - len(ids)
            if pad_len > 0:
                ids += [0] * pad_len
                mask += [0] * pad_len

            input_ids.append(ids)
            attention_mask.append(mask)

        return {
            "input_ids": np.array(input_ids, dtype=np.int64),
            "attention_mask": np.array(attention_mask, dtype=np.int64),
        }

    def _mean_pooling(self, token_embeddings, attention_mask):
        mask = attention_mask[..., None]
        summed = np.sum(token_embeddings * mask, axis=1)
        counts = np.clip(mask.sum(axis=1), a_min=1e-9, a_max=None)
        return summed / counts

    def _normalize(self, vectors):
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        return vectors / norms

    def embed(self, texts: List[str]) -> List[List[float]]:
        inputs = self._tokenize(texts)

        ort_inputs = {}
        if "input_ids" in self.input_names:
            ort_inputs["input_ids"] = inputs["input_ids"]
        if "attention_mask" in self.input_names:
            ort_inputs["attention_mask"] = inputs["attention_mask"]

        outputs = self.session.run(None, ort_inputs)

        token_embeddings = outputs[0]  # [batch, seq, hidden]
        pooled = self._mean_pooling(token_embeddings, inputs["attention_mask"])
        normalized = self._normalize(pooled)

        return normalized.tolist()
