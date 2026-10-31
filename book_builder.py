import json
import re
import sqlite3
from pathlib import Path
from typing import Any, Dict, List

from biblia_personajes import (
    GEMAS_CANON,
    PERSONAJES_SELECCIONADOS,
    RELACIONES_CANON,
    BibliaPersonajes,
)

ROOT_DIR = Path(__file__).resolve().parent
MANUSCRITO_TXT = ROOT_DIR / "Proyecto Proton.txt"

CAPITULOS_METADATA: List[Dict[str, Any]] = [
    {
        "index": 0,
        "slug": "capitulo-00-nacimiento",
        "archivo_md": "Capitulo_00_Nacimiento.md",
        "titulo": "Capítulo 0: Nacimiento",
        "subtitulo": "La Noche de los Dos Zafiros y la Carta del Destino",
        "fecha_lore": "13 de diciembre de 1990 (11:30 p.m.)",
        "ubicacion": "Sección de Natalidad, Hospital Capitalino — San José, Costa Rica",
        "coordenadas": "9.9368° N, -84.0695° O",
        "epoca": "1990",
        "resumen": "En una noche lluviosa en San José, una mujer indígena con el tatuaje de las ocho esferas da a luz a dos gemelos (uno de ojos amarillos y otro de ojos azules) antes de fallecer. Mientras una pareja española de apellido González Dávila adopta al primero con monedas de oro antiguas, el conserje Don Paco convence al escéptico Dr. Miranda —quien ha vivido todo el día en un déjà vu anunciado por una carta misteriosa— de confiarle al bebé de ojos azules: Francisco.",
        "personajes_ids": ["cisco", "gil", "don_paco", "shilea", "doctor_miranda", "obstetra_rodriguez", "droid"],
        "gemas_ids": [],
        "ilustracion": "Proyecto-Proton/src/1. Don Paco y Francisco en el hospital.png",
        "audio_folder": "proyecto_proton/outputs/MiAudiolibro/capitulo_0",
    },
    {
        "index": 1,
        "slug": "capitulo-01-limonada-y-miel",
        "archivo_md": "Capitulo_01_Limonada_y_Miel.md",
        "titulo": "Capítulo 1: Limonada y Miel",
        "subtitulo": "La Ley de Murphy Invertida y el Cubo Azul",
        "fecha_lore": "10 de diciembre de 1990 -> Octubre de 1499",
        "ubicacion": "Curridabat, San José -> Valle del Río Grande de Térraba, Osa",
        "coordenadas": "9.9228° N, -84.0456° O -> Península de Osa",
        "epoca": "1990 -> 1499",
        "resumen": "Tres días antes de cumplir diez años, Cisco conversa con Don Paco mientras toman té de limón, canela y miel. Incapaz de resistir la curiosidad, despierta a su robot Droid y abre la caja de plomo de su regalo de cumpleaños. Al escanear el cubo celeste perfecto, se abre un vórtice morado que les muestra visiones de la conquista y la voz de Don Paco encomendándole reunir las ocho gemas antes de la Luna Carmesí, transportándolos a octubre de 1499.",
        "personajes_ids": ["cisco", "don_paco", "droid", "espanoles"],
        "gemas_ids": ["gema_azul"],
        "ilustracion": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "audio_folder": "proyecto_proton/outputs/MiAudiolibro/capitulo_1",
    },
    {
        "index": 2,
        "slug": "capitulo-02-los-diquis",
        "archivo_md": "Capitulo_02_Los_Diquis.md",
        "titulo": "Capítulo 2: Los Diquís",
        "subtitulo": "La Niña de la Máscara de Zorro y el Modo Explorador",
        "fecha_lore": "Octubre de 1499 (Noche y Alba — Día 1)",
        "ubicacion": "Cascada del Valle del Río Grande de Térraba y Aldea Diquís",
        "coordenadas": "Valle del Diquís, Puntarenas",
        "epoca": "1499",
        "resumen": "Apenas llegan a 1499, una figura con máscara de zorro derriba el cristal azul para ocultarlo y salva a Cisco y Droid de caer por un acantilado. Se trata de Boenawa (Nawa), aprendiz del Jawa Paco, quien esperaba a Cisco siguiendo una carta profética. Droid se pliega en una mochila táctica con gafas traductoras, Nawa teje una falda-armadura para Cisco y juntos entran a la aldea Diquís durante el ritual Shkina para conocer al Jawa Pipo.",
        "personajes_ids": ["cisco", "nawa", "droid", "pipo_ramses", "don_paco", "tribu_diquis"],
        "gemas_ids": ["gema_azul", "gema_indigo"],
        "ilustracion": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "audio_folder": "proyecto_proton/outputs/MiAudiolibro/capitulo_2",
    },
    {
        "index": 3,
        "slug": "capitulo-03-el-mentor-y-la-profecia",
        "archivo_md": "Capitulo_03_El_Mentor_y_la_Profecia.md",
        "titulo": "Capítulo 3: El Mentor y la Profecía",
        "subtitulo": "Ciencia, Magia y el Secreto de los Ocho Cristales",
        "fecha_lore": "Octubre de 1499 (Amanecer — Día 1)",
        "ubicacion": "Choza del Jawa Pipo, al pie de la gran Ceiba",
        "coordenadas": "Aldea Diquís",
        "epoca": "1499",
        "resumen": "En su choza llena de manuscritos y vasijas, el Jawa Pipo explica a Cisco cómo la psicología, la pólvora y las matemáticas son vistas como magia en 1499. Le revela que las esferas de piedra de la aldea son réplicas de ocho Cristales originales dejados por los Jawas Ancestrales y que tiene tres días antes de la Luna Carmesí para visitar los Cuatro Templos de la Rosa de los Vientos. Pipo le entrega el manuscrito en corteza para que Droid lo decodifique en 12 horas.",
        "personajes_ids": ["cisco", "nawa", "pipo_ramses", "droid"],
        "gemas_ids": ["gema_azul"],
        "ilustracion": "Proyecto-Proton/Personajes/Jawa-Pipo.jpg",
        "audio_folder": "proyecto_proton/outputs/MiAudiolibro/capitulo_3",
    },
    {
        "index": 4,
        "slug": "capitulo-04-el-espiritu-del-jaguar",
        "archivo_md": "Capitulo_04_El_Espiritu_del_Jaguar.md",
        "titulo": "Capítulo 4: El Espíritu del Jaguar",
        "subtitulo": "Ojos de Abismo y la Prueba del Valor",
        "fecha_lore": "Octubre de 1499 (Día 1 al Mediodía)",
        "ubicacion": "Plaza Ceremonial de la Aldea Diquís",
        "coordenadas": "Valle del Diquís",
        "epoca": "1499",
        "resumen": "El Rey Curré irrumpe para interrogar al forastero, pero Cisco lo impresiona usando los lentes y altavoces de Droid. Al día siguiente, al mediodía, Curré somete a Cisco a la prueba ancestral frente a toda la tribu: entrar sin armas a la jaula del gigantesco jaguar negro capturado en la cascada. Cisco descubre una herida cosida en el lomo del felino, extrae de ella la Gema Roja del Valor que lo estaba infectando y sana al espíritu del valle, ganándose la lealtad del jaguar y el respeto de Curré.",
        "personajes_ids": ["cisco", "nawa", "curre", "loky", "pipo_ramses", "don_paco", "droid", "chamanes", "tribu_diquis"],
        "gemas_ids": ["gema_roja"],
        "ilustracion": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "audio_folder": None,
    },
    {
        "index": 5,
        "slug": "capitulo-05-el-sendero-del-engano",
        "archivo_md": "Capitulo_05_El_Sendero_del_Engano.md",
        "titulo": "Capítulo 5: El Sendero del Engaño",
        "subtitulo": "La Traición de Pipo, el Bautizo de Loky y la Anomalía en el Mar",
        "fecha_lore": "Noche del Día 1 al Amanecer del Día 2 (1499)",
        "ubicacion": "Aldea Diquís -> Selva de Osa -> Costa del Océano Pacífico",
        "coordenadas": "Litoral del Pacífico Sur, Osa",
        "epoca": "1499",
        "resumen": "Durante la noche, Jawa Pipo intenta robar la Gema Roja de la mochila de Cisco; el jaguar negro le desgarra el brazo, pero Pipo logra escapar con la gema usando humo cegador. Durante la persecución nocturna, la herida del jaguar se abre; Nawa lo cura con un ungüento de bálsamo y manzanilla, y Cisco lo bautiza como 'Loky'. Al llegar a la playa al amanecer, descubren tres carabelas españolas tres años antes de tiempo y un cuarto barco con propulsión a vapor de 1802, al cual Pipo sube en un submarino primitivo junto a un misterioso hombre de catalejo.",
        "personajes_ids": ["cisco", "nawa", "loky", "pipo_ramses", "droid", "cristobal_colon", "espanoles"],
        "gemas_ids": ["gema_roja"],
        "ilustracion": "Proyecto-Proton/Personajes/Jawa-Pipo.jpg",
        "audio_folder": None,
    },
    {
        "index": 6,
        "slug": "capitulo-06-los-manuscritos",
        "archivo_md": "Capitulo_06_Los_Manuscritos.md",
        "titulo": "Capítulo 6: Los Manuscritos",
        "subtitulo": "El Mapa de la Rosa de los Vientos y el Reencuentro de los Gemelos",
        "fecha_lore": "Amanecer del Día 2 (Quedan 2 días para el cumpleaños de Cisco)",
        "ubicacion": "Aldea de Curré y Orilla del Río Sierpe",
        "coordenadas": "Río Sierpe, Valle del Diquís",
        "epoca": "1499",
        "resumen": "Droid completa la traducción de los manuscritos y proyecta el holograma de los Cuatro Templos: Norte (Gema Blanca), Sur (Gema Verde), Este (Gema Naranja) y Oeste (Gema Morada). En ese momento, una nave-submarino arriba por el río Sierpe y desembarca Gil González Dávila, el hermano gemelo de ojos amarillos de Cisco. Gil les advierte que Pipo engañó a su padre adoptivo para quitarle la Gema Amarilla y que escuchó hablar de 'los tres niños'. Se dividen en cuatro equipos hacia los templos.",
        "personajes_ids": ["cisco", "nawa", "gil", "curre", "tamanco", "loky", "droid", "cristobal_colon", "pipo_ramses", "chamanes", "tribu_diquis", "espanoles"],
        "gemas_ids": ["gema_roja", "gema_amarilla", "gema_blanca", "gema_verde", "gema_naranja", "gema_morada", "gema_indigo", "gema_azul"],
        "ilustracion": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "audio_folder": None,
    },
    {
        "index": 7,
        "slug": "capitulo-07-los-cuatro-templos",
        "archivo_md": "Capitulo_07_Los_Cuatro_Templos.md",
        "titulo": "Capítulo 7: Los Cuatro Templos",
        "subtitulo": "Las Cuatro Pruebas, la Carta de Shilea y el Despertar del Número Siete",
        "fecha_lore": "Atardecer y Noche del Día 2 (Queda 1 día para el cumpleaños de Cisco)",
        "ubicacion": "Cordillera Volcánica Central, Península de Osa, Talamanca, Isla de Nicoya y Playa del Encuentro",
        "coordenadas": "Norte, Sur, Este y Oeste de Costa Rica",
        "epoca": "1499",
        "resumen": "Los cuatro equipos enfrentan sus pruebas: (7.1) En el volcán del Norte, Cisco y Tamanco derrotan al Gólem de Granito mediante choque térmico de agua subterránea y nitrógeno criogénico, obteniendo la Gema Blanca. (7.2) En el Gran Ceibo de Osa, Nawa y Loky vencen a la Banshee uniendo lo físico y lo espiritual para reclamar la Gema Verde. (7.3) En Talamanca, el Rey Curré entra en la esfera de agua salada, ve el futuro de los cubículos y el envenenamiento de su padre por Quepoa Corrohore, pide perdón de rodillas a los Cabécares y recibe la Gema Naranja. (7.4) En la Isla de Nicoya, Gil halla la carta de su madre Ditsowe Shilea y la Gema Morada. (7.5) Reunidos en la Playa del Encuentro, leen la carta de Shilea descubriendo que los tres son hermanos y los aretes de jade de Nawa se unen formando la séptima gema: la Gema Índigo del Espíritu.",
        "personajes_ids": ["cisco", "nawa", "gil", "curre", "tamanco", "loky", "droid", "shilea", "dulcehe", "quepoa", "chamanes", "tribu_diquis", "espanoles", "la_banshee", "guardian_norte"],
        "gemas_ids": ["gema_blanca", "gema_verde", "gema_naranja", "gema_morada", "gema_indigo"],
        "ilustracion": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "audio_folder": None,
    },
    {
        "index": 8,
        "slug": "capitulo-08-el-faraon-infinito",
        "archivo_md": "Capitulo_08_El_Faraon_Infinito.md",
        "titulo": "Capítulo 8: El Faraón Infinito",
        "subtitulo": "Las Ocho Repeticiones de Ramsés II y el Protocolo Paradox",
        "fecha_lore": "Amanecer del Día 3 — 14 de octubre de 1499 (Quedan 12 horas)",
        "ubicacion": "Playa del Encuentro (Bucle Cuántico en el Tiempo de Planck)",
        "coordenadas": "Litoral del Pacífico Sur",
        "epoca": "1499 (Bucle Temporal)",
        "resumen": "Pipo desembarca con las gemas Roja y Amarilla, dobla el tejido de la realidad y revela su verdadera identidad milenaria: el Faraón Ramsés II. Durante seis repeticiones masacra a los héroes con ondas carmesí, espectros de Anubis y explosiones, pero la anomalía cuántica devuelve los recuerdos de los hermanos a las 11:59 p.m. de la noche anterior, convirtiendo el bucle en una escuela de entrenamiento infinito. En la quinta repetición Droid absorbe 3,000 años de datos en 3 segundos; en la séptima descolocan al Faraón con su quietud absoluta; y en la octava clavan sus armas formando una matriz geométrica y ejecutan el Protocolo Paradox, proyectando las siete líneas temporales en reversa hasta encerrar a Ramsés para siempre en la cuarentena estática de su propio infinito.",
        "personajes_ids": ["cisco", "nawa", "gil", "curre", "loky", "droid", "pipo_ramses", "tribu_diquis", "espanoles"],
        "gemas_ids": ["gema_roja", "gema_amarilla", "gema_blanca", "gema_verde", "gema_naranja", "gema_morada", "gema_indigo", "gema_azul"],
        "ilustracion": "Proyecto-Proton/Personajes/Jawa-Pipo.jpg",
        "audio_folder": None,
    },
    {
        "index": 9,
        "slug": "capitulo-09-la-luna-carmesi",
        "archivo_md": "Capitulo_09_La_Luna_Carmesi.md",
        "titulo": "Capítulo 9: La Luna Carmesí",
        "subtitulo": "La Partitura del Cosmos, el Secreto de Colón y la Fiesta de los 10 Años",
        "fecha_lore": "14 de octubre de 1499 -> 13 de diciembre de 1990 (7:00 a.m.)",
        "ubicacion": "Gran Altar de la Explanada del Delta -> Curridabat, San José",
        "coordenadas": "9.9368° N, -84.0695° O",
        "epoca": "1499 -> 1990",
        "resumen": "Tras encerrar a Ramsés y reunir las ocho gemas, Don Paco camina desde el mar con la apariencia de un joven de 33 años, revelando que el tiempo es un ocho acostado. Bajo el eclipse de la Luna Carmesí, las esferas de piedra se activan como cápsulas de transferencia interestelar y las tribus ascienden de ocho en ocho hacia Alfa Centauri junto a Nawa y Loky, dejando en la Tierra solo los cascarones de granito. Don Paco revela que hipnotizó al falso Colón en Las Vegas en 1989 y Gil parte en las carabelas para borrar el rastro. Con un aplauso de Don Paco, Cisco despierta en su cama en 1990 el día de su décimo cumpleaños, celebrando una fiesta inolvidable rodeado de todos sus amigos y un cachorro de jaguar.",
        "personajes_ids": ["cisco", "nawa", "gil", "don_paco", "curre", "tamanco", "loky", "droid", "cristobal_colon", "obstetra_rodriguez", "chamanes", "tribu_diquis", "espanoles"],
        "gemas_ids": ["gema_azul", "gema_roja", "gema_amarilla", "gema_blanca", "gema_verde", "gema_naranja", "gema_morada", "gema_indigo"],
        "ilustracion": "Proyecto-Proton/src/1. Don Paco y Francisco en el hospital.png",
        "audio_folder": None,
    },
    {
        "index": 10,
        "slug": "epilogo-el-retorno-de-la-semilla",
        "archivo_md": "Capitulo_10_Epilogo_El_Retorno_de_la_Semilla.md",
        "titulo": "Epílogo: El Retorno de la Semilla",
        "subtitulo": "14 de Octubre de 2033 y las Cartas del Tiempo",
        "fecha_lore": "14 de octubre de 2033 (4:20 p.m.) + Anexos de 1990 y 1499",
        "ubicacion": "Curridabat, San José, Costa Rica (y Transmisión Global)",
        "coordenadas": "9.9228° N, -84.0456° O",
        "epoca": "2033",
        "resumen": "El 14 de octubre de 2033 a las 4:20 p.m., ocho colosales Esferas Madre de granito negro aparecen suspendidas sobre el Valle Central y el Delta del Diquís. El oficinista que Curré había visto en su visión rompe el bucle pegando un post-it de 'RENUNCIO' en la frente de su jefe y saliendo libre a la azotea. En todas las pantallas del planeta, el Rey Curré —sin haber envejecido un solo día— finge reclamar a España la deuda de sangre para luego estallar en carcajadas junto a los chamanes espaciales: '¡Tranquilos, hombres de metal! No se preocupen... eso nunca pasó'. Incluye además los textos íntegros de la Carta al Dr. Miranda y la Carta de Jawa Paco a Nawa.",
        "personajes_ids": ["cisco", "curre", "nawa", "gil", "don_paco", "doctor_miranda", "chamanes", "tribu_diquis"],
        "gemas_ids": ["gema_azul", "gema_roja", "gema_amarilla", "gema_blanca", "gema_verde", "gema_naranja", "gema_morada", "gema_indigo"],
        "ilustracion": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        "audio_folder": None,
    },
]

SAGA_LIBROS: List[Dict[str, Any]] = [
    {
        "numero": 1,
        "id": "libro_1_proyecto_proton",
        "titulo": "Proyecto Protón",
        "subtitulo": "El Código de las Ocho Esferas (Libro CANON)",
        "estado": "CANON COMPLETO",
        "epoca_principal": "1990 / 1499 / 2033",
        "protagonistas": ["Francisco 'Cisco' González Dávila", "Boenawa 'Nawa' Shilea", "Gilberto 'Gil' González Dávila", "Don Paco"],
        "sinopsis": "Libro fundacional CANON de la trilogía. Narra el nacimiento de los gemelos en San José (1990), el salto temporal de Cisco y Droid a octubre de 1499 en el Valle del Diquís, la búsqueda de las ocho Gemas Arcoíris en los Cuatro Templos, la batalla cuántica en el bucle de ocho repeticiones contra Ramsés II y el éxodo de las tribus hacia Alfa Centauri bajo la Luna Carmesí.",
        "carpeta": "saga/01_libro_1_proyecto_proton_canon",
    },
    {
        "numero": 2,
        "id": "libro_2_continuacion",
        "titulo": "Proyecto Protón II: Los Hilos del Anacronismo",
        "subtitulo": "Las Crónicas de Biriteca y el Nuevo Suelo de Alfa Centauri",
        "estado": "EN ESTRUCTURACIÓN (Libro 2 de la Saga)",
        "epoca_principal": "Siglo XVI (Cartago / Valle Central) / Alfa Centauri / 1990-2020",
        "protagonistas": ["Gilberto 'Gil' González Dávila", "Dulcehe La Biriteca", "Boenawa 'Nawa' Shilea", "Francisco 'Cisco' González Dávila"],
        "sinopsis": "Segundo volumen de la saga. Explora la misión encomendada por Shilea a Gil en el siglo XVI para encontrar a su tía Dulcehe La Biriteca en el Valle Central y proteger las raíces históricas, en paralelo al florecimiento de la civilización Diquís en Alfa Centauri junto a Nawa, Loky y el Rey Curré, y el desarrollo tecnológico de Cisco y Droid en el siglo XXI.",
        "carpeta": "saga/02_libro_2_continuacion",
    },
    {
        "numero": 3,
        "id": "libro_3_convergencia",
        "titulo": "Proyecto Protón III: El Retorno de la Semilla",
        "subtitulo": "La Convergencia de 2033 y el Despertar del Gran Ciclo",
        "estado": "EN ESTRUCTURACIÓN (Libro 3 de la Saga)",
        "epoca_principal": "2033 y Horizonte Cósmico",
        "protagonistas": ["Francisco 'Cisco' González Dávila", "Boenawa 'Nawa' Shilea", "Gilberto 'Gil' González Dávila", "Rey Curré", "Don Paco"],
        "sinopsis": "Cierre épico de la trilogía. Parte del retorno de las ocho Esferas Madre de granito negro el 14 de octubre de 2033 sobre Costa Rica, el reencuentro de los tres hermanos a través de los siglos y la transformación definitiva de la humanidad frente al fin del gran ciclo.",
        "carpeta": "saga/03_libro_3_cierre_saga",
    },
]


def leer_manuscrito_canon(ruta: Path = MANUSCRITO_TXT) -> str:
    datos = ruta.read_bytes()
    for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            return datos.decode(encoding)
        except UnicodeDecodeError:
            continue
    return datos.decode("utf-8", errors="ignore")


def limpiar_guiones_silabicos(texto: str) -> str:
    """Corrige cortes de palabra por guion de maquetación (ej. 'parpadea-ban' -> 'parpadeaban') sin alterar diálogos."""
    return re.sub(r"([a-záéíóúñ])-([a-záéíóúñ])", r"\1\2", texto)


def extraer_capitulos_canon(texto: str) -> Dict[int, List[str]]:
    lineas = texto.splitlines()
    patron_cap = re.compile(r"^\s*(?:CAP[IÍ]TULO\s+(\d+)|EP[IÍ]LOGO)\b.*", re.I)

    secciones: Dict[int, List[str]] = {}
    actual_idx = 0
    secciones[0] = []

    for linea in lineas:
        m = patron_cap.match(linea)
        if m:
            if m.group(1) is not None:
                actual_idx = int(m.group(1))
            else:
                actual_idx = 10  # Epílogo
            secciones.setdefault(actual_idx, [])
            continue
        secciones.setdefault(actual_idx, []).append(linea)

    return secciones


def listar_audios_capitulo(audio_folder: str | None) -> List[str]:
    if not audio_folder:
        return []
    carpeta = ROOT_DIR / audio_folder
    if not carpeta.exists():
        return []
    archivos = sorted(
        [
            p.relative_to(ROOT_DIR).as_posix()
            for p in carpeta.glob("*.mp3")
            if p.stat().st_size > 0
        ]
    )
    return archivos


def construir_parrafos(lineas: List[str], cap_index: int) -> List[Dict[str, Any]]:
    parrafos: List[Dict[str, Any]] = []
    subseccion_re = re.compile(r"^\s*(\d+\.\d+\s+.+|La carta del Dr\. Miranda|Carta de Don Paco a Nawa)\s*$", re.I)

    p_idx = 0
    for raw in lineas:
        limpio = limpiar_guiones_silabicos(raw.strip())
        if not limpio:
            continue
        p_idx += 1
        es_subtitulo = bool(subseccion_re.match(limpio))
        es_dialogo = limpio.startswith("—") or limpio.startswith("-") or limpio.startswith("¡Don Paco-")
        parrafos.append(
            {
                "id": f"cap-{cap_index}-p-{p_idx}",
                "numero": p_idx,
                "texto": limpio,
                "tipo": "subtitulo" if es_subtitulo else ("dialogo" if es_dialogo else "narracion"),
            }
        )
    return parrafos


def renderizar_capitulo_markdown(meta: Dict[str, Any], parrafos: List[Dict[str, Any]]) -> str:
    personajes_map = {p["id"]: p["nombre"] for p in PERSONAJES_SELECCIONADOS}
    gemas_map = {g["id"]: g["nombre"] for g in GEMAS_CANON}

    nombres_pers = [personajes_map.get(pid, pid) for pid in meta["personajes_ids"]]
    nombres_gemas = [gemas_map.get(gid, gid) for gid in meta["gemas_ids"]] or ["Ninguna directa en este capítulo"]

    header = [
        f"# {meta['titulo']}",
        f"### *{meta['subtitulo']}*",
        "",
        "| Metadato Canon | Detalle |",
        "| :--- | :--- |",
        f"| **Índice** | Capítulo {meta['index']} |",
        f"| **Época / Fecha Lore** | {meta['fecha_lore']} |",
        f"| **Ubicación** | {meta['ubicacion']} |",
        f"| **Coordenadas** | `{meta['coordenadas']}` |",
        f"| **Personajes presentes** | {', '.join(nombres_pers)} |",
        f"| **Gemas vinculadas** | {', '.join(nombres_gemas)} |",
        "",
        f"> **Resumen ejecutivo del capítulo:** {meta['resumen']}",
        "",
        "---",
        "",
    ]

    cuerpo: List[str] = []
    for p in parrafos:
        if p["tipo"] == "subtitulo":
            cuerpo.append(f"## {p['texto']}")
        else:
            cuerpo.append(p["texto"])
        cuerpo.append("")

    return "\n".join(header + cuerpo)


def crear_estructura_saga_y_lore(capitulos_procesados: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    saga_dir = ROOT_DIR / "saga"
    libro1_dir = saga_dir / "01_libro_1_proyecto_proton_canon"
    libro1_caps = libro1_dir / "capitulos"
    libro2_dir = saga_dir / "02_libro_2_continuacion"
    libro2_caps = libro2_dir / "capitulos"
    libro3_dir = saga_dir / "03_libro_3_cierre_saga"
    libro3_caps = libro3_dir / "capitulos"
    lore_dir = saga_dir / "lore_y_apuntes"
    fotos_dir = lore_dir / "fotos_apuntes_mano"
    transcripciones_dir = lore_dir / "transcripciones_apuntes"

    for carpeta in (
        libro1_caps,
        libro2_caps,
        libro3_caps,
        fotos_dir,
        transcripciones_dir,
        ROOT_DIR / "Proyecto-Proton" / "Capitulos",
    ):
        carpeta.mkdir(parents=True, exist_ok=True)

    # Escribir capítulos Markdown en saga/01_libro_1_proyecto_proton_canon/capitulos/ y Proyecto-Proton/Capitulos/
    manuscrito_compilado: List[str] = [
        "# PROYECTO PROTÓN — LIBRO 1 (MANUSCRITO CANON COMPLETO)",
        "",
        "**Autor:** Genio Maluco (Adrián Araya Aguilar)",
        "**Estado:** Libro 1 CANON de la Trilogía *Proyecto Protón*",
        "",
        "---",
        "",
    ]

    for cap in capitulos_procesados:
        md_text = renderizar_capitulo_markdown(cap, cap["parrafos"])
        (libro1_caps / cap["archivo_md"]).write_text(md_text, encoding="utf-8")
        (ROOT_DIR / "Proyecto-Proton" / "Capitulos" / cap["archivo_md"]).write_text(md_text, encoding="utf-8")
        manuscrito_compilado.append(f"<!-- ARCHIVO: {cap['archivo_md']} -->\n\n{md_text}\n\n")

    texto_compilado = "\n".join(manuscrito_compilado)
    (libro1_dir / "manuscrito_canon_completo.md").write_text(texto_compilado, encoding="utf-8")
    (ROOT_DIR / "Proyecto-Proton" / "Libro_Proyecto_Proton.md").write_text(texto_compilado, encoding="utf-8")

    # Guía maestra de la Saga y Canon
    guia_saga = [
        "# Guía Maestra de la Saga Proyecto Protón (Trilogía Canon)",
        "",
        "Este directorio centraliza todos los documentos escritos, capítulos estructurados, fichas de personajes y apuntes de lore para comprender de forma rápida y sencilla todo el universo de **Proyecto Protón**.",
        "",
        "## 1. Visión General de la Trilogía",
        "",
        "| Libro | Título | Estado | Épocas Clave | Carpeta |",
        "| :---: | :--- | :--- | :--- | :--- |",
        "| **Libro I** | **Proyecto Protón: El Código de las Ocho Esferas** | **CANON (Base Oficial)** | 1990 / 1499 / 2033 | [`01_libro_1_proyecto_proton_canon/`](./01_libro_1_proyecto_proton_canon/) |",
        "| **Libro II** | **Proyecto Protón II: Los Hilos del Anacronismo** | En Desarrollo | Siglo XVI (Cartago) / Alfa Centauri / Siglo XXI | [`02_libro_2_continuacion/`](./02_libro_2_continuacion/) |",
        "| **Libro III** | **Proyecto Protón III: El Retorno de la Semilla** | En Desarrollo | 14 de octubre de 2033 y Convergencia | [`03_libro_3_cierre_saga/`](./03_libro_3_cierre_saga/) |",
        "",
        "## 2. Índice Estructurado del Libro 1 (CANON)",
        "",
        "| Cap. | Título | Fecha / Época | Ubicación | Palabras | Archivo |",
        "| :---: | :--- | :--- | :--- | :---: | :--- |",
    ]
    for cap in capitulos_procesados:
        guia_saga.append(
            f"| **{cap['index']}** | {cap['titulo']} — *{cap['subtitulo']}* | {cap['fecha_lore']} | {cap['ubicacion']} | {cap['word_count']} | [`{cap['archivo_md']}`](./01_libro_1_proyecto_proton_canon/capitulos/{cap['archivo_md']}) |"
        )

    guia_saga.extend(
        [
            "",
            "## 3. Las Ocho Gemas Arcoíris y la Partitura del Cosmos",
            "",
            "| Gema | Color | Valor / Frecuencia | Templo / Origen | Portador Canon |",
            "| :--- | :--- | :--- | :--- | :--- |",
        ]
    )
    for g in GEMAS_CANON:
        guia_saga.append(
            f"| **{g['nombre']}** | {g['color']} (`{g['hex']}`) | {g['valor']} | {g['templo']} | {g['portador']} |"
        )

    guia_saga.extend(
        [
            "",
            "## 4. Espacios de Trabajo Rápidos",
            "",
            "- **Personajes Principales, Secundarios y Entidades**: [`personajes/INDICE_PERSONAJES.md`](./personajes/INDICE_PERSONAJES.md)",
            "- **Fotografías de Apuntes a Mano y Lore**: [`lore_y_apuntes/README.md`](./lore_y_apuntes/README.md)",
            "- **Espacio del Libro 2**: [`02_libro_2_continuacion/README.md`](./02_libro_2_continuacion/README.md)",
            "- **Espacio del Libro 3**: [`03_libro_3_cierre_saga/README.md`](./03_libro_3_cierre_saga/README.md)",
            "",
        ]
    )
    (saga_dir / "GUIA_SAGA_Y_CANON.md").write_text("\n".join(guia_saga), encoding="utf-8")

    # Espacios Libro 2 y Libro 3
    (libro2_dir / "README.md").write_text(
        "\n".join(
            [
                "# Libro 2 — Proyecto Protón II: Los Hilos del Anacronismo",
                "",
                "Espacio oficial para los documentos escritos, escaleta de capítulos y arcos de personajes del **segundo libro de la saga**, fundamentado directamente en el canon del Libro 1.",
                "",
                "## Hilos Canon Abiertos desde el Libro 1",
                "",
                "1. **La Misión de Gil en el Siglo XVI (Carta de Shilea, Cap. 7.4)**:",
                "   - Gil debe infiltrarse en las expediciones españolas, proteger el rastro de los templos vacíos y buscar en el Valle Central (Cartago) a su tía materna **Dulcehe La Biriteca** para preservar las raíces y evitar que el anacronismo borre su futuro.",
                "2. **El Nuevo Suelo en Alfa Centauri (Cap. 9.1)**:",
                "   - Nawa, Loky, el Rey Curré y los chamanes de las cuatro tribus fundan una civilización interestelar avanzada a partir de las cápsulas-esfera de granito negro.",
                "3. **El Crecimiento de Francisco y Droid (1990 – 2033)**:",
                "   - Cómo Cisco pasa de su décimo cumpleaños en Curridabat a construir su centro de mando tecnológico preparando la recepción del año 2033.",
                "4. **Los Viajes de Don Paco en el Ocho Acostado**:",
                "   - Cómo Francisco Paco recorrió los 3,000 años del círculo temporal y preparó cada carta y cada pieza del tablero.",
                "",
                "## Estructura de esta Carpeta",
                "- `capitulos/`: Borradores y capítulos del Libro 2 en formato Markdown.",
                "- `escaleta_libro_2.md`: Planificación de actos y capítulos.",
                "",
            ]
        ),
        encoding="utf-8",
    )
    if not (libro2_dir / "escaleta_libro_2.md").exists():
        (libro2_dir / "escaleta_libro_2.md").write_text(
            "# Escaleta de Capítulos — Libro 2\n\n- **Acto I**: El Regreso de las Carabelas y el Rumor de Cartago (Gil y Dulcehe La Biriteca).\n- **Acto II**: Los Jardines de Luz de Alfa Centauri (Nawa, Loky y el Rey Curré).\n- **Acto III**: El Laboratorio de Curridabat y los Ecos del Bucle (Cisco, Droid y Don Paco).\n",
            encoding="utf-8",
        )

    (libro3_dir / "README.md").write_text(
        "\n".join(
            [
                "# Libro 3 — Proyecto Protón III: El Retorno de la Semilla",
                "",
                "Espacio oficial para los documentos escritos, escaleta de capítulos y desenlace del **tercer libro de la trilogía**.",
                "",
                "## Punto de Partida Canon (Epílogo del Libro 1 — 14 de Octubre de 2033)",
                "",
                "1. **El Retorno de las Ocho Esferas Madre (4:20 p.m., 14 de octubre de 2033)**:",
                "   - Ocho naves colosales de granito negro se posicionan sobre el Valle Central y el Delta del Diquís.",
                "2. **La Transmisión Mundial del Rey Curré**:",
                "   - El despertar de la humanidad moderna frente al sistema corporativo ('RENUNCIO') y el reencuentro entre los descendientes terrestres y la civilización estelar Diquís.",
                "3. **La Reunión Final de los Tres Hermanos (Cisco, Nawa y Gil)**:",
                "   - La promesa cumplida de Nawa: *'Nos volveremos a ver cuando el sol de 2033 se oscurezca'*.",
                "",
                "## Estructura de esta Carpeta",
                "- `capitulos/`: Borradores y capítulos del Libro 3 en formato Markdown.",
                "- `escaleta_libro_3.md`: Planificación de actos y desenlace de la trilogía.",
                "",
            ]
        ),
        encoding="utf-8",
    )
    if not (libro3_dir / "escaleta_libro_3.md").exists():
        (libro3_dir / "escaleta_libro_3.md").write_text(
            "# Escaleta de Capítulos — Libro 3\n\n- **Acto I**: 14 de Octubre de 2033 — El Descenso sobre el Delta del Diquís.\n- **Acto II**: El Reencuentro de los Tres Hermanos y el Secreto del Primogénito.\n- **Acto III**: La Nueva Partitura del Cosmos.\n",
            encoding="utf-8",
        )

    # Lore y Apuntes a Mano
    poema_path = ROOT_DIR / "Proyecto-Proton" / "Capitulos" / "poema los 5 hermanos"
    poema_texto = (
        poema_path.read_text(encoding="utf-8", errors="ignore").strip()
        if poema_path.exists()
        else "6 nacimos y 5 vivimos pero a tus pasos me acerco con desenfreno y sigilo como bajando la peña del Guayabos..."
    )

    apuntes_registrados = [
        {
            "id": "apunte_poema_5_hermanos",
            "titulo": "Poema de los 5 Hermanos (Acertijo Numérico 6-5-4-3-2-1-0)",
            "categoria": "Acertijo / Profecía",
            "fecha_registro": "Canon Base",
            "contenido": poema_texto,
            "analisis_canon": "Contiene la cuenta regresiva numérica (6 nacimos, 5 vivimos, 4 hermanos viendo el suceso, 3 Cordilleras, 2 de 1, todo llega a 0) que refleja la Partitura del Cosmos del Capítulo 9.1 y sugiere misterios adicionales sobre el linaje para los Libros 2 y 3.",
            "imagen": None,
        },
        {
            "id": "apunte_carta_miranda",
            "titulo": "Cronología Exacta del 13 de Diciembre de 1990 (Carta al Dr. Miranda)",
            "categoria": "Línea Temporal",
            "fecha_registro": "Canon Base (Anexo 1)",
            "contenido": "1:47 p.m. Nacimiento de María Castro (Hab. 214) | 3:15 p.m. Ascensor detenido 12 min (Enf. Quirós) | 5:38 p.m. Ambulancia desde el Cerro de la Muerte trae a Shilea | 6:20 p.m. Enf. Martínez derrama café | 8:45 p.m. Quirófano | 9:14 p.m. Nacen Gil y Cisco (2 min de diferencia) | 9:37 p.m. Fallece Shilea | 11:02 p.m. Llegan los González Dávila con monedas de oro | 11:11 p.m. Adopción de Gil | 11:30 p.m. Cambio de turno y salida de Don Paco con Cisco y Droid.",
            "analisis_canon": "Demuestra que Don Paco ya había recorrido el bucle y conocía al minuto cada evento del hospital para convencer al Dr. Miranda sin usar la fuerza.",
            "imagen": "Proyecto-Proton/src/1. Don Paco y Francisco en el hospital.png",
        },
        {
            "id": "apunte_carta_nawa",
            "titulo": "El Año de Preparación de Nawa en 1499 (Carta de Jawa Paco a Nawa)",
            "categoria": "Lore de Personaje",
            "fecha_registro": "Canon Base (Anexo 2)",
            "contenido": "1 año antes: Primer sueño claro de Cisco | 6 lunas después: Prueba de Pipo en la cueva donde el agua canta | 3 lunas después: Desvía a cazadores Bribris sin sangre | Luna de la Cosecha: Ayuda a guerrero con viruela rumbo a Palmar (recibe silbato de hueso) | Hace 2 lunas: Cura a 5 niños de la fiebre manchada con cedro amargo (nombrada Ditsowe) | Hace 7 soles: Sueño de la cascada | Día del encuentro: Máscara de zorro, aretes de Shilea y rescate de Cisco.",
            "analisis_canon": "Explica cómo Nawa sobrevivió un año sola junto a Pipo sin caer en su manipulación y por qué estaba en la cascada en el segundo exacto en que llegaron Cisco y Droid.",
            "imagen": "Proyecto-Proton/src/2. Aventura en el vórtice temporal.png",
        },
    ]

    # Detectar automáticamente cualquier foto nueva subida por el usuario en fotos_apuntes_mano/
    for img_path in sorted(fotos_dir.glob("*")):
        if img_path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            stem = img_path.stem
            trans_file = transcripciones_dir / f"{stem}.md"
            trans_text = (
                trans_file.read_text(encoding="utf-8")
                if trans_file.exists()
                else "Fotografía de apunte manuscrito subida por el autor. Pendiente de transcripción detallada."
            )
            apuntes_registrados.append(
                {
                    "id": f"foto_{stem}",
                    "titulo": f"Apunte Manuscrito: {stem.replace('_', ' ').title()}",
                    "categoria": "Manuscrito a Mano",
                    "fecha_registro": "Subido por el Autor",
                    "contenido": trans_text,
                    "analisis_canon": "Nota manuscrita integrada desde saga/lore_y_apuntes/fotos_apuntes_mano/.",
                    "imagen": img_path.relative_to(ROOT_DIR).as_posix(),
                }
            )

    (lore_dir / "README.md").write_text(
        "\n".join(
            [
                "# Bóveda de Lore y Apuntes a Mano — Proyecto Protón",
                "",
                "Esta carpeta está diseñada para almacenar y estructurar las **fotografías de tus notas y apuntes a mano** junto con sus transcripciones y su cruce con el Canon.",
                "",
                "## ¿Cómo usar esta carpeta?",
                "",
                "1. **Fotografías de apuntes a mano**: Coloca tus fotos (`.jpg`, `.png`, `.webp`) en [`fotos_apuntes_mano/`](./fotos_apuntes_mano/) o súbelas directamente en el chat para que yo las lea, transcriba y clasifique automáticamente.",
                "2. **Transcripciones estructuradas**: Cada foto tendrá su archivo Markdown correspondiente en [`transcripciones_apuntes/`](./transcripciones_apuntes/) vinculando sus ideas con los capítulos y personajes de los Libros 1, 2 y 3.",
                "3. **Actualización automática en la Web**: Al ejecutar `python book_builder.py`, cualquier imagen en `fotos_apuntes_mano/` y su transcripción se integran automáticamente en la sección **Lore y Apuntes** de la página web.",
                "",
            ]
        ),
        encoding="utf-8",
    )

    (fotos_dir / "README.md").write_text(
        "# Fotos de Apuntes a Mano\n\nColoca aquí las fotografías de tus cuadernos, mapas, diagramas temporales y notas a mano sobre el lore de *Proyecto Protón*.\n",
        encoding="utf-8",
    )

    if not (transcripciones_dir / "plantilla_apunte.md").exists():
        (transcripciones_dir / "plantilla_apunte.md").write_text(
            "\n".join(
                [
                    "# Título del Apunte Manuscrito",
                    "",
                    "- **Imagen origen**: `../fotos_apuntes_mano/nombre_foto.jpg`",
                    "- **Libro vinculado**: Libro 1 (Canon) / Libro 2 / Libro 3",
                    "- **Personajes relacionados**: ",
                    "- **Época / Línea temporal**: ",
                    "",
                    "## Transcripción Fiel del Manuscrito",
                    "",
                    "> (Texto transcrito de la nota a mano)",
                    "",
                    "## Integración con el Canon",
                    "",
                    "- ",
                ]
            ),
            encoding="utf-8",
        )

    return apuntes_registrados


def exportar_sqlite(db_path: Path, payload: Dict[str, Any]) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    if db_path.exists():
        db_path.unlink()

    conn = sqlite3.connect(str(db_path))
    cur = conn.cursor()

    cur.executescript(
        """
        CREATE TABLE books (
            numero INTEGER PRIMARY KEY,
            id TEXT NOT NULL,
            titulo TEXT NOT NULL,
            subtitulo TEXT,
            estado TEXT,
            epoca_principal TEXT,
            sinopsis TEXT,
            carpeta TEXT
        );

        CREATE TABLE chapters (
            idx INTEGER PRIMARY KEY,
            slug TEXT NOT NULL,
            archivo_md TEXT NOT NULL,
            titulo TEXT NOT NULL,
            subtitulo TEXT,
            fecha_lore TEXT,
            ubicacion TEXT,
            coordenadas TEXT,
            epoca TEXT,
            resumen TEXT,
            word_count INTEGER,
            reading_time_min INTEGER,
            ilustracion TEXT
        );

        CREATE TABLE paragraphs (
            id TEXT PRIMARY KEY,
            chapter_idx INTEGER NOT NULL,
            numero INTEGER NOT NULL,
            tipo TEXT NOT NULL,
            texto TEXT NOT NULL,
            FOREIGN KEY (chapter_idx) REFERENCES chapters(idx)
        );

        CREATE TABLE characters (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            archivo TEXT NOT NULL,
            categoria TEXT,
            faccion TEXT,
            primera_aparicion INTEGER,
            color TEXT,
            hex TEXT,
            puntos_salud INTEGER,
            fuerza INTEGER,
            inteligencia INTEGER,
            agilidad INTEGER,
            resistencia INTEGER,
            espiritu INTEGER,
            descripcion_json TEXT,
            evolucion_json TEXT,
            proyeccion_json TEXT
        );

        CREATE TABLE relationships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            origen TEXT NOT NULL,
            destino TEXT NOT NULL,
            tipo TEXT NOT NULL,
            etiqueta TEXT NOT NULL,
            capitulo_minimo INTEGER NOT NULL,
            capitulo_maximo INTEGER,
            descripcion TEXT
        );

        CREATE TABLE gems (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            color TEXT,
            hex TEXT,
            valor TEXT,
            templo TEXT,
            portador TEXT,
            guardian TEXT,
            capitulo_aparicion INTEGER,
            capitulo_obtencion INTEGER,
            descripcion TEXT
        );
        """
    )

    for b in payload["saga_libros"]:
        cur.execute(
            "INSERT INTO books VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                b["numero"],
                b["id"],
                b["titulo"],
                b["subtitulo"],
                b["estado"],
                b["epoca_principal"],
                b["sinopsis"],
                b["carpeta"],
            ),
        )

    for c in payload["capitulos"]:
        cur.execute(
            "INSERT INTO chapters VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                c["index"],
                c["slug"],
                c["archivo_md"],
                c["titulo"],
                c["subtitulo"],
                c["fecha_lore"],
                c["ubicacion"],
                c["coordenadas"],
                c["epoca"],
                c["resumen"],
                c["word_count"],
                c["reading_time_min"],
                c["ilustracion"],
            ),
        )
        for p in c["parrafos"]:
            cur.execute(
                "INSERT INTO paragraphs VALUES (?, ?, ?, ?, ?)",
                (p["id"], c["index"], p["numero"], p["tipo"], p["texto"]),
            )

    for ch in payload["personajes"]:
        stats = ch["atributos"]["estadisticas"]
        cur.execute(
            "INSERT INTO characters VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                ch["id"],
                ch["nombre"],
                ch["archivo"],
                ch["categoria"],
                ch["faccion"],
                ch["primera_aparicion"],
                ch["atributos"].get("color"),
                ch["atributos"].get("hex"),
                ch["atributos"].get("puntos_salud", 80),
                stats["fuerza"],
                stats["inteligencia"],
                stats["agilidad"],
                stats["resistencia"],
                stats["espiritu"],
                json.dumps(ch["descripcion"], ensure_ascii=False),
                json.dumps(ch.get("evolucion_por_capitulo", []), ensure_ascii=False),
                json.dumps(ch.get("proyeccion_saga", {}), ensure_ascii=False),
            ),
        )

    for rel in payload["relaciones"]:
        cur.execute(
            "INSERT INTO relationships (origen, destino, tipo, etiqueta, capitulo_minimo, capitulo_maximo, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                rel["origen"],
                rel["destino"],
                rel["tipo"],
                rel["etiqueta"],
                rel["capitulo_minimo"],
                rel.get("capitulo_maximo"),
                rel["descripcion"],
            ),
        )

    for g in payload["gemas"]:
        cur.execute(
            "INSERT INTO gems VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                g["id"],
                g["nombre"],
                g["color"],
                g["hex"],
                g["valor"],
                g["templo"],
                g["portador"],
                g["guardian"],
                g["capitulo_aparicion"],
                g["capitulo_obtencion"],
                g["descripcion"],
            ),
        )

    conn.commit()
    conn.close()


def compilar_proyecto() -> Dict[str, Any]:
    # 1. Generar biblia de personajes (JSON + Markdown en saga/personajes/)
    biblia = BibliaPersonajes(
        carpeta_destino=ROOT_DIR / "proyecto_proton" / "biblia_personajes",
        carpeta_saga=ROOT_DIR / "saga" / "personajes",
    )
    biblia.generar()

    # 2. Leer y estructurar el manuscrito Canon
    texto_canon = leer_manuscrito_canon(MANUSCRITO_TXT)
    secciones_raw = extraer_capitulos_canon(texto_canon)

    capitulos_procesados: List[Dict[str, Any]] = []
    total_palabras = 0

    for meta in CAPITULOS_METADATA:
        idx = meta["index"]
        lineas = secciones_raw.get(idx, [])
        parrafos = construir_parrafos(lineas, idx)
        palabras = sum(len(p["texto"].split()) for p in parrafos)
        total_palabras += palabras
        tiempo_lectura = max(2, round(palabras / 200))
        audios = listar_audios_capitulo(meta.get("audio_folder"))

        cap_obj = {
            **meta,
            "word_count": palabras,
            "reading_time_min": tiempo_lectura,
            "paragraph_count": len(parrafos),
            "audios": audios,
            "parrafos": parrafos,
        }
        capitulos_procesados.append(cap_obj)

    # 3. Crear estructura de carpetas de la Saga (Libros 1, 2, 3) y Lore/Apuntes
    apuntes_lore = crear_estructura_saga_y_lore(capitulos_procesados)

    # 4. Construir payload unificado para JSON, SQLite y Web App
    payload: Dict[str, Any] = {
        "proyecto": "Proyecto Protón — Universo & Web Interactiva",
        "autor": "Genio Maluco (Adrián Araya Aguilar)",
        "libro_canon": "Proyecto Protón (Libro 1 de la Trilogía)",
        "estadisticas": {
            "total_libros_saga": len(SAGA_LIBROS),
            "total_capitulos_canon": len(capitulos_procesados),
            "total_palabras_canon": total_palabras,
            "total_personajes": len(PERSONAJES_SELECCIONADOS),
            "total_relaciones": len(RELACIONES_CANON),
            "total_gemas": len(GEMAS_CANON),
        },
        "saga_libros": SAGA_LIBROS,
        "capitulos": capitulos_procesados,
        "personajes": PERSONAJES_SELECCIONADOS,
        "relaciones": RELACIONES_CANON,
        "gemas": GEMAS_CANON,
        "apuntes_lore": apuntes_lore,
    }

    # 5. Exportar JSON, SQLite y JS para el lector interactivo
    data_dir = ROOT_DIR / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    json_path = data_dir / "proton_db.json"
    sqlite_path = data_dir / "proton.sqlite"
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    exportar_sqlite(sqlite_path, payload)

    assets_data_dir = ROOT_DIR / "assets" / "data"
    assets_data_dir.mkdir(parents=True, exist_ok=True)
    js_bundle_path = assets_data_dir / "proton_data.js"
    js_bundle_path.write_text(
        "window.PROTON_DATA = " + json.dumps(payload, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )

    print(f"[OK] Manuscrito Canon procesado: {len(capitulos_procesados)} capítulos ({total_palabras} palabras).")
    print(f"[OK] Personajes y relaciones exportados: {len(PERSONAJES_SELECCIONADOS)} fichas, {len(RELACIONES_CANON)} relaciones.")
    print(f"[OK] Base de datos JSON: {json_path}")
    print(f"[OK] Base de datos SQLite: {sqlite_path}")
    print(f"[OK] Bundle Web JS: {js_bundle_path}")
    return payload


if __name__ == "__main__":
    compilar_proyecto()
