# Proyecto Proton

Repositorio del libro *Proyecto Proton*, con capítulos, personajes, ilustraciones y ediciones exportadas en EPUB y DOCX.

## Contenido

- `Capitulos/`: capítulos y material narrativo.
- `Personajes/`: fichas e ilustraciones.
- `src/`: imágenes del proyecto.
- `Libro_Proyecto_Proton.md`: manuscrito compilado.
- `Proyecto Protón*.docx` y `Proyecto Protón - Genio Maluco.epub`: ediciones exportadas.

## Compilar el manuscrito

Desde esta carpeta, ejecuta:

```powershell
python book-builder.py
```

El script combina los archivos Markdown de `Capitulos/` en `Libro_Proyecto_Proton.md`.