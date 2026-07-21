def parse_text(content: bytes) -> tuple[str, int]:
    text = content.decode("utf-8-sig", errors="replace").strip()
    if not text:
        raise ValueError("The document contains no text")
    return text,1