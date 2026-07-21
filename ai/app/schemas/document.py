from uuid import UUID

from pydantic import BaseModel

class ParseDocumentRequest(BaseModel):
    document_id: UUID
    storage_key: str
    mime_type: str 

class ParseDocumentResponse(BaseModel):
    document_id: UUID
    parsed_storage_key: str
    page_count: int
    character_count: int
