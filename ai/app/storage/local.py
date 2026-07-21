from pathlib import Path
from app.configs.config import settings

storage_root = Path(settings.storage_root).resolve()

def resolve_storage_key(key: str) -> Path:
    file_path = (storage_root / key).resolve()
    is_inside_storage = (
        file_path == storage_root
        or storage_root in file_path.parents
    )
    if not is_inside_storage:
        raise ValueError("Invalid storage key")
    return file_path

def read_bytes(key: str) -> bytes:
    file_path = resolve_storage_key(key)
    return file_path.read_bytes()

def write_text(key: str, content: str) -> None:
    file_path = resolve_storage_key(key)
    file_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )
    file_path.write_text(content, encoding="utf-8")
