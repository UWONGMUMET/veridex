from fastapi import APIRouter, HTTPException
from app.database.vector_store import save_document_chunks
from app.embeddings.model import count_tokens, embed_documents
from app.ingestion.chunker import chunk_text
from app.schemas.indexing import IndexDocumentRequest, IndexDocumentResponse
from app.storage.local import read_text

router = APIRouter(
    prefix="/internal/indexing",
    tags=["internal-indexing"]
)

@router.post("/documents", response_model=IndexDocumentResponse)
def index_document(request: IndexDocumentRequest) -> IndexDocumentResponse:
    try:
        document_text = read_text(request.parsed_storage_key)
        chunks = chunk_text(document_text)
        if not chunks:
            raise ValueError("Document produced no chunks")
        contents = [chunk.content for chunk in chunks]
        embeddings = embed_documents(contents)
        token_counts = [count_tokens(content) for content in contents]
        save_document_chunks(
            document_id=str(request.document_id),
            chunks=chunks,
            embeddings=embeddings,
            token_counts = token_counts
        )
        return IndexDocumentResponse(
            document_id = request.document_id,
            chunk_count = len(chunks),
            indexed=True
        )
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail = "Parsed document was not found"
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error),
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Failed to index document"
        ) from error