import os
from pathlib import Path

try:
    from elevenlabs.client import ElevenLabs
except ImportError:
    ElevenLabs = None


def _cargar_env_local() -> None:
    env_path = Path(__file__).resolve().parent / ".env"
    if not env_path.exists():
        return
    for linea in env_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, valor = linea.split("=", 1)
        os.environ.setdefault(clave.strip(), valor.strip().strip('"').strip("'"))


_cargar_env_local()
API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
CLIENT = ElevenLabs(api_key=API_KEY) if ElevenLabs and API_KEY else None
