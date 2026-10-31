"""Compilador unificado de Proyecto Protón.
Ejecuta el pipeline completo de capítulos, personajes, relaciones, SQLite/JSON y bundle web.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from book_builder import compilar_proyecto

if __name__ == "__main__":
    compilar_proyecto()
