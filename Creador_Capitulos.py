import argparse
import json
import re
from pathlib import Path

PROCESO_FILE = "progreso_capitulos.json"
MP3_PATTERN = re.compile(r"(?i)(.+?)[_\s-]*capitulo[_\s-]?(\d+)[_\s-]*parte[_\s-]?(\d+)\.mp3$")


def cargar_estado() -> dict:
    if Path(PROCESO_FILE).exists():
        return json.loads(Path(PROCESO_FILE).read_text(encoding="utf-8"))
    return {"capitulos": {}}


def guardar_estado(estado: dict) -> None:
    Path(PROCESO_FILE).write_text(json.dumps(estado, ensure_ascii=False, indent=2), encoding="utf-8")


def encontrar_partes(root: Path) -> dict[int, list[Path]]:
    capitulos: dict[int, list[tuple[int, Path]]] = {}
    for ruta in sorted(root.glob("*.mp3")):
        match = MP3_PATTERN.match(ruta.name)
        if not match:
            continue
        _, chapter_idx, part_idx = match.groups()
        chapter_idx = int(chapter_idx)
        part_idx = int(part_idx)
        capitulos.setdefault(chapter_idx, []).append((part_idx, ruta))

    capitulos_ordenados: dict[int, list[Path]] = {}
    for idx, archivos in capitulos.items():
        archivos.sort(key=lambda item: item[0])
        capitulos_ordenados[idx] = [ruta for _, ruta in archivos]
    return capitulos_ordenados


def find_mp3_frame_start(data: bytes) -> int:
    if data.startswith(b"ID3") and len(data) >= 10:
        size = ((data[6] & 0x7f) << 21) | ((data[7] & 0x7f) << 14) | ((data[8] & 0x7f) << 7) | (data[9] & 0x7f)
        return 10 + size

    for i in range(0, min(len(data), 4096) - 1):
        if data[i] == 0xFF and (data[i + 1] & 0xE0) == 0xE0:
            return i
    return 0


def concatenar_mp3(archivos: list[Path], destino: Path) -> None:
    if destino.exists():
        dest_mtime = destino.stat().st_mtime
        if all(archivo.stat().st_mtime <= dest_mtime for archivo in archivos):
            print(f"Ya existe archivo fusionado y está actualizado: {destino.name}")
            return

    print(f"Fusionando {len(archivos)} partes en {destino.name}")
    destino.parent.mkdir(parents=True, exist_ok=True)
    with destino.open("wb") as salida:
        primero = True
        for archivo in archivos:
            datos = archivo.read_bytes()
            if primero:
                salida.write(datos)
                primero = False
                continue
            inicio = find_mp3_frame_start(datos)
            salida.write(datos[inicio:])
    print(f"Archivo generado: {destino}")


def mover_partes_a_capitulo(chapter_idx: int, archivos: list[Path], carpeta_base: Path) -> list[Path]:
    carpeta = carpeta_base / f"capitulo_{chapter_idx}"
    carpeta.mkdir(parents=True, exist_ok=True)
    destino_files = []
    for archivo in archivos:
        destino = carpeta / archivo.name
        if archivo.resolve() == destino.resolve():
            destino_files.append(destino)
            continue
        if destino.exists():
            archivo.unlink()
            destino_files.append(destino)
            continue
        archivo.rename(destino)
        destino_files.append(destino)
    return destino_files


def procesar_directorio(root: Path) -> None:
    root = root.resolve()
    estado = cargar_estado()
    capitulos = encontrar_partes(root)
    if not capitulos:
        print("No se encontraron archivos MP3 de capítulos en", root)
        return

    for chapter_idx, archivos in sorted(capitulos.items()):
        carpeta_capitulo = root / f"capitulo_{chapter_idx}"
        print(f"Procesando capítulo {chapter_idx}: {len(archivos)} partes")
        partes_movidas = mover_partes_a_capitulo(chapter_idx, archivos, root)

        base_name = None
        for parte in partes_movidas:
            match = MP3_PATTERN.match(parte.name)
            if match:
                base_name = match.group(1)
                break
        if not base_name:
            base_name = "capitulo"

        merged_name = f"{limpiar_nombre(base_name)}_Capitulo_{chapter_idx}.mp3"
        destino_merged = carpeta_capitulo / merged_name
        concatenar_mp3(partes_movidas, destino_merged)

        estado["capitulos"][str(chapter_idx)] = {
            "carpeta": str(carpeta_capitulo),
            "merged": str(destino_merged),
            "partes": [str(p) for p in partes_movidas],
        }
        guardar_estado(estado)

    print("Proceso completado.")


def limpiar_nombre(texto: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", texto.lower()).strip("_") or "capitulo"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Crea carpetas de capítulos y fusiona archivos MP3 por parte.")
    parser.add_argument("--root", default="Proyecto Proton", help="Carpeta raíz donde están los MP3 de capítulos")
    args = parser.parse_args()
    procesar_directorio(Path(args.root))
