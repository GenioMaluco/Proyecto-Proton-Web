import importlib.util
import unittest
from pathlib import Path

from docx import Document

ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "narrador.py"
SPEC = importlib.util.spec_from_file_location("narrator", MODULE_PATH)
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("No se pudo cargar narrator")

narrator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(narrator)


class NarradorTests(unittest.TestCase):
    def test_extraer_secciones_docx_detecta_titulos_y_subtitulos(self):
        documento = Document()
        documento.add_heading("Capitulo 1", level=1)
        documento.add_paragraph("Texto inicial del capítulo.")
        documento.add_heading("Subtema A", level=2)
        documento.add_paragraph("Texto del subtema.")

        ruta_docx = Path("/tmp/ejemplo.docx")
        documento.save(str(ruta_docx))

        secciones = narrator.extraer_secciones_docx(ruta_docx)

        self.assertEqual(secciones[0]["heading_path"], ["Capitulo 1"])
        self.assertEqual(secciones[1]["heading_path"], ["Capitulo 1", "Subtema A"])
        self.assertIn("Texto inicial del capítulo.", secciones[0]["text"])
        self.assertIn("Texto del subtema.", secciones[1]["text"])


if __name__ == "__main__":
    unittest.main()
