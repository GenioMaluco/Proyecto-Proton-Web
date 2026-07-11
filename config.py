import os

try:
    from elevenlabs.client import ElevenLabs
except ImportError:
    ElevenLabs = None

API_KEY = os.getenv("ELEVENLABS_API_KEY", "sk_400204c6dabf2601531805b5aa8cbf59f6038958adeeca8e")
CLIENT = ElevenLabs(api_key=API_KEY) if ElevenLabs and API_KEY else None
