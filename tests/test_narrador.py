import json
import sqlite3
import tempfile
import unittest
from pathlib import Path

import biblia_personajes
import book_builder

ROOT = Path(__file__).resolve().parents[1]


class SagaYBookBuilderTests(unittest.TestCase):
    def test_parseo_manuscrito_canon_extrae_11_capitulos(self):
        manuscrito = ROOT / "Proyecto Proton.txt"
        self.assertTrue(manuscrito.exists(), "Debe existir Proyecto Proton.txt como fuente canon")

        texto = book_builder.leer_manuscrito_canon(manuscrito)
        secciones = book_builder.extraer_capitulos_canon(texto)
        self.assertEqual(len(secciones), 11)
        self.assertIn(0, secciones)
        self.assertIn(10, secciones)
        self.assertEqual(book_builder.CAPITULOS_METADATA[0]["titulo"], "Capítulo 0: Nacimiento")
        self.assertIn("Epílogo", book_builder.CAPITULOS_METADATA[-1]["titulo"])

    def test_biblia_personajes_contiene_principales_secundarios_grupos_y_relaciones(self):
        todos = biblia_personajes.PERSONAJES_SELECCIONADOS
        self.assertEqual(len(todos), 20)
        principales = [p for p in todos if biblia_personajes.BibliaPersonajes._subcarpeta_categoria(p["categoria"]) == "principales"]
        secundarios = [p for p in todos if biblia_personajes.BibliaPersonajes._subcarpeta_categoria(p["categoria"]) == "secundarios"]
        grupos = [p for p in todos if biblia_personajes.BibliaPersonajes._subcarpeta_categoria(p["categoria"]) == "grupos_y_entidades"]
        self.assertEqual(len(principales), 4)
        self.assertEqual(len(secundarios), 11)
        self.assertEqual(len(grupos), 5)
        self.assertGreaterEqual(len(biblia_personajes.RELACIONES_CANON), 20)
        self.assertEqual(len(biblia_personajes.GEMAS_CANON), 8)

    def test_archivos_generados_en_saga_y_bases_de_datos(self):
        self.assertTrue((ROOT / "saga" / "GUIA_SAGA_Y_CANON.md").exists())
        self.assertTrue((ROOT / "saga" / "01_libro_1_proyecto_proton_canon" / "manuscrito_canon_completo.md").exists())
        self.assertTrue((ROOT / "saga" / "02_libro_2_continuacion" / "escaleta_libro_2.md").exists())
        self.assertTrue((ROOT / "saga" / "03_libro_3_cierre_saga" / "escaleta_libro_3.md").exists())
        self.assertTrue((ROOT / "saga" / "lore_y_apuntes" / "fotos_apuntes_mano" / "README.md").exists())
        self.assertTrue((ROOT / "index.html").exists())
        self.assertTrue((ROOT / "assets" / "css" / "styles.css").exists())
        self.assertTrue((ROOT / "assets" / "js" / "app.js").exists())

        db_json = ROOT / "data" / "proton_db.json"
        self.assertTrue(db_json.exists())
        data = json.loads(db_json.read_text(encoding="utf-8"))
        self.assertEqual(len(data["capitulos"]), 11)
        self.assertEqual(len(data["personajes"]), 20)
        self.assertEqual(len(data["saga_libros"]), 3)

        sqlite_path = ROOT / "data" / "proton.sqlite"
        self.assertTrue(sqlite_path.exists())
        conn = sqlite3.connect(sqlite_path)
        try:
            cap_count = conn.execute("SELECT COUNT(*) FROM chapters").fetchone()[0]
            char_count = conn.execute("SELECT COUNT(*) FROM characters").fetchone()[0]
            rel_count = conn.execute("SELECT COUNT(*) FROM relationships").fetchone()[0]
            self.assertEqual(cap_count, 11)
            self.assertEqual(char_count, 20)
            self.assertGreaterEqual(rel_count, 20)
        finally:
            conn.close()


class NarradorDocxTests(unittest.TestCase):
    def test_extraer_secciones_docx_detecta_titulos_y_subtitulos(self):
        try:
            from docx import Document
            import narrador as narrator
        except ImportError:
            self.skipTest("python-docx o dependencias opcionales de narrador no instaladas en este entorno")

        documento = Document()
        documento.add_heading("Capitulo 1", level=1)
        documento.add_paragraph("Texto inicial del capítulo.")
        documento.add_heading("Subtema A", level=2)
        documento.add_paragraph("Texto del subtema.")

        with tempfile.TemporaryDirectory() as tmpdir:
            ruta_docx = Path(tmpdir) / "ejemplo.docx"
            documento.save(str(ruta_docx))
            secciones = narrator.extraer_secciones_docx(ruta_docx)

        self.assertEqual(secciones[0]["heading_path"], ["Capitulo 1"])
        self.assertEqual(secciones[1]["heading_path"], ["Capitulo 1", "Subtema A"])
        self.assertIn("Texto inicial del capítulo.", secciones[0]["text"])
        self.assertIn("Texto del subtema.", secciones[1]["text"])


if __name__ == "__main__":
    unittest.main()
