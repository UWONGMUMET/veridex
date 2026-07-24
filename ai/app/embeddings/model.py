from functools import lru_cache
import numpy as np
from sentence_transformers import SentenceTransformer
from app.configs.config import settings

@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    return SentenceTransformer(settings.embedding_model)

def embed_documents(texts: list[str]) -> np.ndarray:
    model = get_embedding_model()
    prepared_texts = [
        f"passage: {text}" for text in texts
    ]

    embeddings = model.encode(
        prepared_texts,
        batch_size=16,
        show_progress_bar=False,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    if (embeddings.shape[1] != settings.embedding_dimensions):
        raise ValueError("Embedding model dimension does not match EMBEDDING_DIMENSIONS")
    
    return embeddings

def embed_query(query: str) -> np.ndarray:
    model = get_embedding_model()
    embedding = model.encode(
        [f"query: {query}"],
        show_progress_bar=False,
        convert_to_numpy=True,
        normalize_embeddings=True,
    )
    return embedding[0]

def count_tokens(text: str) -> int:
    model = get_embedding_model()
    token_ids = model.tokenizer.encode(text, add_special_tokens=False)
    return len(token_ids)
