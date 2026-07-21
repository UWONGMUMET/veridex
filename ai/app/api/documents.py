import logging

from fastapi import APIRouter, HTTPException
from app.ingestion.parser import parse_document
from app.schemas.document import ParseDocumentRequest, ParseDocumentResponse
from app.storage.local import read_bytes, write_text

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/internal/documents",
    tags=["internal-documents"]
)

@router.post("/parse", response_model=ParseDocumentResponse)
def process_document(request: ParseDocumentRequest) -> ParseDocumentResponse:
    try:
        logger.info(
            "Processing document %s",
            request.document_id,
        )

        original_content = read_bytes(request.storage_key)
        text, page_count = parse_document(original_content, request.mime_type)
        parsed_storage_key = (
            "parsed/"
            f"{request.document_id}"
            ".txt"
        )
        write_text(parsed_storage_key, text)

        logger.info(
            "Document %s processed successfully: %s pages, %s characters",
            request.document_id,
            page_count,
            len(text),
        )

        return ParseDocumentResponse(
            document_id = request.document_id,
            parsed_storage_key = parsed_storage_key,
            page_count = page_count,
            character_count = len(text),
        )
    except ValueError as error:
        logger.warning(
            "Document %s could not be processed: %s",
            request.document_id,
            error,
        )
        raise HTTPException(status_code=422, detail=str(error)) from error
    except FileNotFoundError as error:
        logger.warning(
            "Original file for document %s was not found",
            request.document_id,
        )
        raise HTTPException(status_code=404, detail="Original document was not found") from error
    except Exception as error:
        logger.exception(
            "Unexpected error while processing document %s",
            request.document_id,
        )
        raise HTTPException(status_code=500, detail="Failed to process document") from error
