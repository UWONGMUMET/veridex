from typing import TypedDict
from uuid import uuid4

import numpy as np
import psycopg
from pgvector.psycopg import register_vector
from psycopg.rows import dict_row

from app.configs.config import settings
from app.ingestion.chunker import TextChunk


class ChunkSearchResult(TypedDict):
    document_id: str
    document_name: str
    position: int
    content: str
    similarity: float


def get_connection() -> psycopg.Connection:
    connection = psycopg.connect(
        settings.database_url,
        row_factory=dict_row,
    )
    register_vector(connection)
    return connection


def save_document_chunks(
    document_id: str,
    chunks: list[TextChunk],
    embeddings: np.ndarray,
    token_counts: list[int],
) -> None:
    if len(chunks) != len(embeddings):
        raise ValueError(
            "Chunk and embedding counts do not match"
        )

    if len(chunks) != len(token_counts):
        raise ValueError(
            "Chunk and token counts do not match"
        )

    chunk_rows = [
        (
            uuid4(),
            document_id,
            chunk.position,
            chunk.content,
            token_count,
            embedding,
        )
        for chunk, token_count, embedding in zip(
            chunks,
            token_counts,
            embeddings,
            strict=True,
        )
    ]

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM document_chunks
                WHERE document_id = %s
                """,
                (document_id,),
            )

            if chunk_rows:
                cursor.executemany(
                    """
                    INSERT INTO document_chunks (
                        id,
                        document_id,
                        position,
                        content,
                        token_count,
                        embedding,
                        metadata
                    )
                    VALUES (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        '{}'::jsonb
                    )
                    """,
                    chunk_rows,
                )

            cursor.execute(
                """
                UPDATE documents
                SET
                    chunk_count = %s,
                    indexed_at = NOW(),
                    updated_at = NOW()
                WHERE id = %s
                """,
                (len(chunks), document_id),
            )


def search_project_chunks(
    project_id: str,
    query_embedding: np.ndarray,
    limit: int,
) -> list[ChunkSearchResult]:
    if limit < 1:
        raise ValueError("Search limit must be greater than zero")

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    dc.document_id,
                    d.name AS document_name,
                    dc.position,
                    dc.content,
                    1 - (dc.embedding <=> %s) AS similarity
                FROM document_chunks AS dc
                INNER JOIN documents AS d
                    ON d.id = dc.document_id
                WHERE
                    d.research_project_id = %s
                    AND dc.embedding IS NOT NULL
                ORDER BY dc.embedding <=> %s
                LIMIT %s
                """,
                (
                    query_embedding,
                    project_id,
                    query_embedding,
                    limit,
                ),
            )

            rows = cursor.fetchall()

    return [
        {
            "document_id": str(row["document_id"]),
            "document_name": str(row["document_name"]),
            "position": int(row["position"]),
            "content": str(row["content"]),
            "similarity": float(row["similarity"]),
        }
        for row in rows
    ]
