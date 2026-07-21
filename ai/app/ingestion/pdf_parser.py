import pymupdf

def parse_pdf(content: bytes) -> tuple[str, int]:
    with pymupdf.open(
        stream=content,
        filetype="pdf"
    ) as document:
        if document.needs_pass:
            raise ValueError("Password-protected PDFs are not supported")
        pages: list[str] = []
        for page in document:
            page_text = page.get_text("text", sort=True).strip()
            if page_text:
                pages.append(f"[Page {page.number + 1}]\n{page_text}")
        
        text = "\n\n".join(pages)
        if not text:
            raise ValueError("No extractable text was found. Scanned PDFs require OCR."
                             )
        return (
            text,
            document.page_count
        )