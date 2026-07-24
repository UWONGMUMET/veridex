from fastapi import APIRouter, HTTPException
from app.database.vector_store import search_project_chunks
from app.embeddings.model import embed_query
from app.schemas.search import SearchRequest, SearchResponse

router = APIRouter(
    prefix="/internal/search",
    tags=["internal-search"]
)

@router.post("", response_model=SearchResponse)
def search_documents(request: SearchRequest) -> SearchResponse:
    try:
        query_embedding = embed_query(request.query)
        results = search_project_chunks(
            project_id=str(request.project_id),
            query_embedding=query_embedding,
            limit=request.limit
        )
        return SearchResponse(
            results=results
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Semantic search failed"
        ) from error