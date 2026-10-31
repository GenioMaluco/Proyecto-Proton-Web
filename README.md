# 🌌 Proyecto Protón — Saga Literaria Canon, Biblia de Lore y Plataforma Web Interactiva

Repositorio oficial y optimizado del universo narrativo **Proyecto Protón**. Este espacio organiza:
1. El **Libro 1 (CANON): *Proyecto Protón*** íntegro (11 capítulos + anexos epistolares, 38,871 palabras) como punto de partida de una **Trilogía (3 Libros)**.
2. Los espacios de desarrollo para el **Libro 2** y el **Libro 3**.
3. La **Biblia de Personajes** separada en **Principales**, **Secundarios** y **Grupos / Entidades** con control progresivo de evolución por capítulo.
4. La **Bóveda de Lore y Fotografías de Apuntes a Mano** (`saga/lore_y_apuntes/`).
5. La **Aplicación Web Interactiva** (`index.html`) con lector por capítulos, marcador automático y manual de lectura, catálogo y grafo de relaciones con filtro anti-spoilers, y modo Audiolibro sincronizado (*Read-Along*).

---

## 🗂️ Estructura Optimizada del Proyecto

```text
Protecto Proton Web/
├── Proyecto Proton.txt                        # 📜 Fuente maestra CANON (1,494 líneas íntegras)
├── index.html                                 # 🌐 Aplicación Web Interactiva Principal
├── book_builder.py                            # ⚙️ Compilador Python (Texto Canon -> Saga MD + SQLite + JSON + Web)
├── biblia_personajes.py                       # 🧬 Base maestra de 20 personajes, 21 relaciones y 8 gemas
├── narrador.py                                # 🎙️ Pipeline de voz IA (ElevenLabs / OpenAI) + Memoria SQLite
├── config.py                                  # 🔐 Carga segura de variables de entorno (.env)
│
├── saga/                                      # 📚 ESPACIO EDITORIAL Y LITERARIO DE LA TRILOGÍA
│   ├── GUIA_SAGA_Y_CANON.md                   # Mapa maestro de lectura, estructura de capítulos y arcos
│   ├── 01_libro_1_proyecto_proton_canon/      # ✅ LIBRO 1 (CANON OFICIAL)
│   │   ├── manuscrito_canon_completo.md       # Manuscrito unificado en Markdown
│   │   ├── capitulos/                         # Los 11 capítulos individuales numerados (Cap 00 a Cap 10)
│   │   └── anexos_y_cartas/                   # Cartas de Miranda y Don Paco + Poema de los 5 Hermanos
│   ├── 02_libro_2_continuacion/               # 🚧 LIBRO 2: El Despertar de las Siete Semillas
│   │   ├── README.md
│   │   ├── escaleta_libro_2.md                # Hilos abiertos del Libro 1 y estructura de actos
│   │   └── borradores_capitulos/
│   ├── 03_libro_3_cierre_saga/                # 🔮 LIBRO 3: El Horizonte del Octavo Color
│   │   ├── README.md
│   │   ├── escaleta_libro_3.md                # Clímax de la trilogía
│   │   └── borradores_capitulos/
│   ├── personajes/                            # 👥 FICHAS DETALLADAS DE PERSONAJES (MARKDOWN)
│   │   ├── INDICE_PERSONAJES.md               # Índice general con tabla comparativa
│   │   ├── principales/                       # 8 protagonistas (Protón, Nawa, Miranda, Sura, etc.)
│   │   ├── secundarios/                       # 8 secundarios (Hermano Mayor, Danta, Capitán, etc.)
│   │   └── grupos_y_entidades/                # 4 facciones/entidades (Los 5 Hermanos, Árbol de Ámbar, etc.)
│   └── lore_y_apuntes/                        # 📸 APUNTES MANUSCRITOS Y REGLAS DEL UNIVERSO
│       ├── README.md                          # Guía de las 8 Gemas del Arcoíris y reglas del canon
│       ├── fotos_apuntes_mano/                # 📷 CARPETA PARA SUBIR TUS FOTOS DE APUNTES A MANO
│       └── transcripciones_apuntes/           # 📝 Transcripciones estructuradas de las fotos subidas
│
├── data/                                      # 🗄️ BASES DE DATOS GENERADAS POR book_builder.py
│   ├── proton_db.json                         # Exportación JSON completa (capítulos, párrafos, personajes, grafo)
│   └── proton.sqlite                          # Base SQLite relacional (chapters, paragraphs, characters, relationships, gems)
│
├── assets/                                    # 🎨 RECURSOS DE LA PÁGINA WEB INTERACTIVA
│   ├── css/styles.css                         # Diseño inmersivo + temas Claro, Sepia y Oscuro
│   ├── js/app.js                              # Lógica del Lector, Progreso, Grafo SVG y Read-Along TTS/MP3
│   └── data/proton_data.js                    # Bundle JS local para abrir index.html directamente sin servidor
│
└── tests/
    └── test_narrador.py                       # Pruebas automatizadas del compilador, biblia y narrador
```

---

## 🚀 Cómo Usar el Proyecto

### 1. Abrir la Página Web Interactiva
Puedes abrir [`index.html`](index.html) directamente con doble clic en cualquier navegador moderno (usa `assets/data/proton_data.js` de forma nativa sin bloqueos CORS) o levantar un servidor local:

```bash
python -m http.server 8080
```
Y visitar `http://localhost:8080`.

### 2. Recompilar el Libro, Fichas de Personajes y Bases de Datos
Cada vez que edites [`Proyecto Proton.txt`](Proyecto%20Proton.txt) o [`biblia_personajes.py`](biblia_personajes.py), ejecuta:

```bash
python book_builder.py
```
Esto regenerará automáticamente todas las carpetas de `saga/`, `Proyecto-Proton/Capitulos/`, `data/proton_db.json`, `data/proton.sqlite` y `assets/data/proton_data.js`.

### 3. Subir Fotografías de Apuntes a Mano sobre el Lore
1. Coloca tus fotografías (`.jpg`, `.png`, `.webp`, `.heic`) en [`saga/lore_y_apuntes/fotos_apuntes_mano/`](saga/lore_y_apuntes/fotos_apuntes_mano/) o cárgales vista previa desde la pestaña **"💎 Lore, Gemas & Apuntes"** de la web.
2. También puedes enviar las fotos directamente en el chat para transcribirlas en [`saga/lore_y_apuntes/transcripciones_apuntes/`](saga/lore_y_apuntes/transcripciones_apuntes/) e integrar sus revelaciones a las fichas de personajes y escaletas de los Libros 2 y 3.
