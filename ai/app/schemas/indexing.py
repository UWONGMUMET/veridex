from pydantic import BaseModel

class IndexDocumentRequest(BaseModel):
    document_id: str
    parsed_storage_key: str

class IndexDocumentResponse(BaseModel):
    document_id: str
    chunk_count: int
    indexed: bool