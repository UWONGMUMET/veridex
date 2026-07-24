from dataclasses import dataclass
from app.configs.config import settings

@dataclass
class TextChunk:
    position: int
    content: str

def find_chunk_end(
    text: str,
    start: int,
    end: int
) -> int:
    if end >= len(text):
        return len(text)
    minimum_end = start + int(settings.chunk_size * 0.6)
    
    separators = [
        "\n\n",
        ". ",
        "\n",
        " ",
    ]
    for separator in separators:
        separator_position = text.rfind(
            separator,
            minimum_end,
            end
        )
        if separator_position != -1:
            return (separator_position + len(separator))
        
    return end

def chunk_text(text: str) -> list[TextChunk]:
    cleaned_text = text.strip()
    if not cleaned_text:
        return []  
    
    chunks: list[TextChunk] = []
    start = 0
    position = 0

    while start < len(cleaned_text):
        end = min(start + settings.chunk_size, len(cleaned_text))
        end = find_chunk_end(cleaned_text, start, end)
        content = cleaned_text[start:end].strip()
        if content:
            chunks.append(
                TextChunk(
                    position=position,
                    content=content
                )
            )
            position +=1
        
        if end >= len(cleaned_text):
            break

        next_start = end - settings.chunk_overlap
        start = max(next_start, start+1)
        
    return chunks