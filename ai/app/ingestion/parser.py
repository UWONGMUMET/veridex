from app.ingestion.pdf_parser import parse_pdf
from app.ingestion.text_parser import parse_text

def parse_document(content: bytes, mime_type: str) -> tuple[str, int]:
    if (mime_type == "application/pdf"):
        return parse_pdf(content)
    if mime_type in {"text/plain", "text/markdown",}:
        return parse_text(content)
    raise ValueError(f"Unsupported MIME type: {mime_type}")