# 🎮 Proyecto Protón — Proyecto Base para Godot 4.x (`godot4_proyecto_proton`)

Este directorio contiene la estructura nativa de **Godot 4** para el videojuego **Proyecto Protón**, sincronizada con la **Demo Jugable Web/Móvil** (`#view-game` en `index.html`) y el **Estudio Creador PixelFX** (`#view-studio`).

## 🌍 Arquitectura Canónica: 8 Mundos × 4 Niveles (32 Niveles)
Definida en [`scripts/GameState.gd`](scripts/GameState.gd):
1. **Mundo 1**: *Tormenta en la Casa Miranda y Umbral Diquís* (Gema Azul — Cap. 0 al 2) -> **Nivel 1-1 Jugable**.
2. **Mundo 2**: *Aldea del Valle del Diquís y Forja de Esferas* (Gema Amarilla — Cap. 2 y 3).
3. **Mundo 3**: *Asedio en la Costa del Cacique Camaquiri* (Gema Roja — Cap. 3 y 4).
4. **Mundo 4**: *Laberinto Subterráneo y Cavernas de Jade* (Gema Naranja — Cap. 4 y 5).
5. **Mundo 5**: *Cordillera de Talamanca y los Cinco Hermanos* (Gema Morada — Cap. 6 y 7).
6. **Mundo 6**: *Anomalía Cuántica y Laboratorio de 1995* (Gema Cian — Cap. 7 y 8).
7. **Mundo 7**: *El Árbol de Ámbar Ancestral* (Gema Verde — Cap. 0 y 9).
8. **Mundo 8**: *Convergencia de las 8 Gemas del Arcoíris* (Gema Blanca/Arcoíris — Cap. 10).

## 🍄 Mecánicas Implementadas (Nivel 1-1 con Cisco)
- **Protagonista Inicial**: **Cisco (Francisco Miranda)** ([`scripts/PlayerCisco.gd`](scripts/PlayerCisco.gd)).
- **Crecimiento estilo Super Mario Bros (`Modo Super Protón`)**: Al golpear los bloques rúnicos `[?]` desde abajo emerge la **Semilla de Ámbar** ([`scripts/PowerUpItem.gd`](scripts/PowerUpItem.gd)). Al recogerla, Cisco crece a escala `1.48x` con `Tween`, aumenta su salto, el alcance y daño de su ataque, y puede absorber un impacto regresando a su tamaño normal sin perder vida.
- **Poder de la Gema Azul**: El segundo tipo de bloque `[?]` libera la **Gema Azul**, desbloqueando el proyectil cuántico (`K` / `X` / botón `⚡ Poder`).
- **Mobs y Jefe**: Slimes de Sombra, Drones/Murciélagos del Bucle Temporal y el **Guardián Corrupto del Umbral** ([`scripts/MobEnemy.gd`](scripts/MobEnemy.gd)), derrotables saltando encima (stomp) o con ataques.
- **Escenas de Historia con las Ilustraciones de la Web**: [`scripts/StoryCutscene.gd`](scripts/StoryCutscene.gd) reutiliza `assets/img/capitulos/cap_00.jpg..cap_10.jpg` y los retratos de `assets/img/personajes/`.

## 🚀 Cómo abrir en Godot 4 e importar Sprites del Estudio Web
1. Abre **Godot Engine 4.2+**, haz clic en **Importar** y selecciona `saga/Proyecto Proton el video Juego/godot4_proyecto_proton/project.godot`.
2. Desde la pestaña **🎮 Estudio Videojuego** de la web (`index.html`), selecciona a **Cisco** (o cualquier otro personaje/ataque) y pulsa **📦 Exportar `.sheet.png` + `.sheet.json`** para copiar la hoja de sprites directamente a tu carpeta `sprites/` de Godot 4.
