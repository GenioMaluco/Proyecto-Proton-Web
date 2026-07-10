import argparse
import os
import re
from pathlib import Path
from typing import List, Optional

try:
    from docx import Document
except ImportError:  # pragma: no cover - fallback simple
    Document = None

try:
    from elevenlabs.client import ElevenLabs
except ImportError:  # pragma: no cover - fallback simple
    ElevenLabs = None

# Configuración
API_KEY = os.getenv("ELEVENLABS_API_KEY", "sk_400204c6dabf2601531805b5aa8cbf59f6038958adeeca8e")
client = ElevenLabs(api_key=API_KEY) if ElevenLabs and API_KEY else None


def limpiar_nombre(texto: str) -> str:
    texto_limpio = re.sub(r"[^a-z0-9]+", "_", texto.lower()).strip("_")
    return texto_limpio or "seccion"


def detectar_nivel(style_name: Optional[str]) -> Optional[int]:
    if not style_name:
        return None

    nombre = style_name.strip().lower()
    if "title" in nombre:
        return 0
    if "subtitle" in nombre:
        return 1

    coincidencia = re.search(r"heading\s*(\d+)", nombre)
    if coincidencia:
        return int(coincidencia.group(1))

    return None


def extraer_secciones_docx(ruta_docx: Path) -> List[dict]:
    if Document is None:
        raise RuntimeError("python-docx no está instalado. Instálalo con pip install python-docx")

    documento = Document(str(ruta_docx))
    secciones: List[dict] = []
    heading_path: Optional[List[str]] = None
    texto_actual: List[str] = []

    def procesar_parrafo(parrafo) -> None:
        nonlocal heading_path, texto_actual
        texto = parrafo.text.strip()
        if not texto:
            return

        nivel = detectar_nivel(getattr(parrafo.style, "name", None))
        if nivel is not None:
            if heading_path is not None and texto_actual:
                secciones.append({"heading_path": heading_path, "text": "\n".join(texto_actual).strip()})

            if nivel == 0:
                heading_path = [texto]
            elif heading_path is None:
                heading_path = [texto]
            else:
                heading_path = heading_path[: max(0, nivel - 1)] + [texto]
            texto_actual = []
            return

        if heading_path is None:
            heading_path = ["Seccion"]

        texto_actual.append(texto)

    for parrafo in documento.paragraphs:
        procesar_parrafo(parrafo)

    for tabla in documento.tables:
        for fila in tabla.rows:
            for celda in fila.cells:
                for parrafo in celda.paragraphs:
                    procesar_parrafo(parrafo)

    if heading_path is not None and texto_actual:
        secciones.append({"heading_path": heading_path, "text": "\n".join(texto_actual).strip()})

    return secciones


def dividir_texto(texto: str, limite: int = 4000) -> List[str]:
    return [texto[i:i + limite] for i in range(0, len(texto), limite)]


def generar_audio(texto: str, ruta_destino: Path) -> None:
    if client is None:
        raise RuntimeError("ElevenLabs no está disponible. Configura ELEVENLABS_API_KEY o instala la librería.")

    trozos = dividir_texto(texto)
    for i, trozo in enumerate(trozos, start=1):
        nombre_mp3 = f"{ruta_destino.stem}_parte_{i}.mp3"
        ruta_final = ruta_destino.parent / nombre_mp3

        if ruta_final.exists():
            continue

        print(f"Generando {ruta_final.name}...")
        audio_stream = client.text_to_speech.convert(
            text=trozo,
            voice_id="J1MJX4cMJWohOm67gEFi",
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )

        with open(ruta_final, "wb") as archivo:
            for chunk in audio_stream:
                archivo.write(chunk)
        print(f"Guardado en {ruta_final}")


def procesar_archivo(ruta_entrada: str | Path, carpeta_destino: Optional[str | Path] = None) -> None:
    entrada = Path(ruta_entrada)
    if not entrada.exists():
        raise FileNotFoundError(f"No se encontró el archivo: {entrada}")

    if entrada.suffix.lower() == ".docx":
        secciones = extraer_secciones_docx(entrada)
        base_output = Path(carpeta_destino) if carpeta_destino else entrada.with_suffix("")
        base_output.mkdir(parents=True, exist_ok=True)

        for seccion in secciones:
            heading_path = seccion["heading_path"]
            contenido = seccion["text"].strip()
            if not contenido:
                continue

            ruta_carpeta = base_output.joinpath(*[limpiar_nombre(p) for p in heading_path])
            ruta_carpeta.mkdir(parents=True, exist_ok=True)

            nombre_base = "_".join(limpiar_nombre(p) for p in heading_path)
            texto_audio = f"{' '.join(heading_path)}. {contenido}"
            generar_audio(texto_audio, ruta_carpeta / nombre_base)
        return

    if entrada.suffix.lower() == ".txt":
        nombre_carpeta = Path(carpeta_destino) if carpeta_destino else entrada.with_suffix("")
        nombre_carpeta.mkdir(parents=True, exist_ok=True)

        with open(entrada, "r", encoding="utf-8") as archivo:
            texto = archivo.read()

        generar_audio(texto, nombre_carpeta / entrada.stem)
        return

    raise ValueError("Solo se admiten archivos .txt o .docx")


def procesar_libro(directorio: str | Path = "."):
    carpeta = Path(directorio)
    archivos = sorted(list(carpeta.glob("capitulo_*.txt")) + sorted(list(carpeta.glob("*.docx"))))

    for archivo in archivos:
        print(f"Procesando {archivo.name}...")
        procesar_archivo(archivo, carpeta_destino=carpeta / archivo.stem)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Genera archivos MP3 a partir de un documento .docx o .txt")
    parser.add_argument("entrada", nargs="?", help="Ruta al archivo .txt o .docx")
    parser.add_argument("--output", help="Carpeta de salida para los MP3")
    args = parser.parse_args()

    if args.entrada:
        procesar_archivo(args.entrada, carpeta_destino=args.output)
    else:
        procesar_libro()
