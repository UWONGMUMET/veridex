from pydantic import BaseModel, Field

class SearchRequest(BaseModel):
    project_id: str
    query: str = Field(
        min_length=2,
        max_length=1000,
    )
    limit: int = Field(
        default=5,
        ge=1,
        le=20
    )

class SearchResult(BaseModel):
    document_id: str
    document_name: str
    position: int
    content: str
    similarity: float

class SearchResponse(BaseModel):
    results: list[SearchResult]