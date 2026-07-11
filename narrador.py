import argparse
import os
import re
import json
from pathlib import Path
from typing import List, Optional

try:
    from docx import Document
except ImportError:  # pragma: no cover - fallback simple
    Document = None

from config import CLIENT as client

# Archivo de progreso
ESTADO_FILE = "progreso.json"


def cargar_estado():
    if os.path.exists(ESTADO_FILE):
        with open(ESTADO_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"procesados": []}


def guardar_estado(nombre_archivo):
    estado = cargar_estado()
    procesados = estado.get("procesados", [])
    if nombre_archivo not in procesados:
        procesados.append(nombre_archivo)
    with open(ESTADO_FILE, "w", encoding="utf-8") as f:
        json.dump({"procesados": procesados}, f)


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


def leer_texto_archivo(ruta: Path) -> str:
    datos = ruta.read_bytes()
    for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            return datos.decode(encoding)
        except UnicodeDecodeError:
            continue

    return datos.decode("utf-8", errors="ignore")


def split_into_chapters(texto: str) -> List[dict]:
    """Divide un texto plano en capítulos buscando líneas que parezcan títulos de capítulo.

    Devuelve lista de dicts: {"title": str, "text": str, "index": int}
    """
    lines = texto.splitlines()
    heading_re = re.compile(r"^\s*(cap[ií]tulo|capitulo|chapter)\b.*", re.I)

    chapters: List[dict] = []
    current_title: Optional[str] = None
    current_lines: List[str] = []
    chapter_idx = -1

    for line in lines:
        if heading_re.match(line):
            # start new chapter
            if current_title is not None or current_lines:
                chapters.append({
                    "title": current_title or f"Capitulo {chapter_idx}",
                    "text": "\n".join(current_lines).strip(),
                    "index": chapter_idx,
                })

            chapter_idx += 1
            current_title = line.strip()
            current_lines = []
            continue

        current_lines.append(line)

    # push last
    if current_title is None and current_lines:
        # no headings found -> single chapter
        chapters.append({"title": "Capitulo 0", "text": "\n".join(current_lines).strip(), "index": 0})
    elif current_title is not None:
        chapters.append({"title": current_title, "text": "\n".join(current_lines).strip(), "index": chapter_idx})

    return chapters


def generar_audio_capitulo(base_output: Path, base_name: str, chapter_idx: int, texto: str, limite: int = 4000) -> None:
    """Genera archivos mp3 para un capítulo dividido en trozos.

    Los archivos se guardan en una subcarpeta capitulo_X y se nombran según la parte.
    """
    if client is None:
        raise RuntimeError("ElevenLabs no está disponible. Configura ELEVENLABS_API_KEY o instala la librería.")

    if not texto:
        return

    carpeta_capitulo = base_output / f"capitulo_{chapter_idx}"
    carpeta_capitulo.mkdir(parents=True, exist_ok=True)

    trozos = dividir_texto(texto, limite=limite)
    for i, trozo in enumerate(trozos, start=1):
        nombre_mp3 = f"{limpiar_nombre(base_name)}_Capitulo_{chapter_idx}_parte{str(i).zfill(2)}.mp3"
        ruta_final = carpeta_capitulo / nombre_mp3

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


def generar_audio(texto: str, ruta_destino: Path) -> None:
    if client is None:
        raise RuntimeError("ElevenLabs no está disponible. Configura ELEVENLABS_API_KEY o instala la librería.")

    trozos = dividir_texto(texto)
    for i, trozo in enumerate(trozos, start=1):
        nombre_base = limpiar_nombre(ruta_destino.stem)
        nombre_mp3 = f"{nombre_base}_parte_{i}.mp3"
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
        texto = leer_texto_archivo(entrada)

        # Dividir por capítulos detectando títulos (líneas que empiecen por "Capitulo"/"Capítulo"/"Chapter")
        capitulos = split_into_chapters(texto)

        base_name = entrada.stem
        for cap in capitulos:
            cap_idx = cap.get("index", 0)
            cap_text = cap.get("text", "").strip()
            if not cap_text:
                continue

            generar_audio_capitulo(nombre_carpeta, base_name, cap_idx, cap_text)
        return

    raise ValueError("Solo se admiten archivos .txt o .docx")


def procesar_libro(directorio: str | Path = "."):
    carpeta = Path(directorio)
    archivos = []
    for patron in ("capitulo_*.txt", "*.txt", "*.docx"):
        archivos.extend(carpeta.glob(patron))

    archivos = sorted(set(archivos), key=lambda ruta: ruta.name.lower())

    if not archivos:
        print("No se encontraron archivos .txt o .docx para procesar.")
        return

    estado = cargar_estado()
    procesados = set(estado.get("procesados", []))

    for archivo in archivos:
        if archivo.name in procesados:
            print(f"Saltando {archivo.name} (ya procesado)")
            continue

        print(f"Procesando {archivo.name}...")
        try:
            procesar_archivo(archivo, carpeta_destino=carpeta / archivo.stem)
            guardar_estado(archivo.name)
            print(f"Progreso guardado en {ESTADO_FILE}")
        except Exception as e:
            print(f"Error al procesar {archivo.name}: {e}")
            print("No se actualizará el progreso. Corrige el error y vuelve a ejecutar.")
            break


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Genera archivos MP3 a partir de un documento .docx o .txt")
    parser.add_argument("entrada", nargs="?", help="Ruta al archivo .txt o .docx")
    parser.add_argument("--output", help="Carpeta de salida para los MP3")
    args = parser.parse_args()

    if args.entrada:
        procesar_archivo(args.entrada, carpeta_destino=args.output)
    else:
        procesar_libro()