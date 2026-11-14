// ============================================================================
// PROYECTO PROTÓN — VIDEOJUEGO DEMO (MUNDO 1-1: ESCAPE DEL HOSPITAL NOCTURNO)
// Motor Pixel-Art 2D (PC + Controles Táctiles Móviles + Base Godot 4):
// - Selector de 4 Personajes Jugables: Don Paco, Cisco, Droid y Nawa.
// - Entrada en escena con `scifi/tractor-beam` (loop).
// - Inicia SIN ARMAS y encuentra su arma más adelante en el hospital.
// - Mecánicas: Doble Salto, Salto Acrobático e Impacto (`impacts/heavy-landing`),
//   Carrera Veloz con Estela, Dash con Golpe (`moves/dash-strike`),
//   Defensa con Escudo (`impacts/shield-block`) y Barra de Energía + Sword Combo.
// - Trozo de la Gema Blanca (Hacerse Grande) con `pickups/crystal-shard`.
// - 100 Monedas de Oro = +1 Vida Extra. Temporizador de 240 minutos (240:00).
// - Fondo fijo de Hospital Nocturno (sin esferas de piedra, con camillas, ECG,
//   portasueros, quirófano y maternidad) + criaturas voladoras, rastreras y
//   saltarinas con sprite sheets propios que buscan al jugador.
// - Puzzle de la Incubadora para encontrar al Bebé + Animación final subiéndose
//   al Vehículo Blanco de escape.
// ============================================================================

import {
  createFrame,
  clearFrame,
  createFx,
  composite,
  READY,
  STAND,
  posed,
  setCharacterRig,
} from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/core/index.js";

import * as fxTractorBeam from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/fx/scifi/tractor-beam.js";
import * as fxCrystalShard from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/fx/pickups/crystal-shard.js";
import * as fxShieldBlock from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/fx/impacts/shield-block.js";
import * as fxHeavyLanding from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/fx/impacts/heavy-landing.js";

// ---- 1. Los 4 Personajes Seleccionables para Jugar ----
export const PLAYABLE_CHARACTERS = {
  cisco: {
    id: "cisco",
    name: "Cisco Miranda",
    role: "Joven Científico · Gema Azul",
    portrait: "assets/img/personajes/cisco.jpg",
    weaponName: "Hoja Cuántica de Laboratorio",
    weaponType: "sword",
    trailColor: "#38bdf8",
    shieldColor: "#38bdf8",
    rig: {
      id: "cisco_game",
      build: "hero",
      headgear: "goggles",
      hairColor: "#f3e5c8",
      skinColor: "#f2c2a7",
      torsoColor: "#f1f5f9",
      sleeveColor: "#e2e8f0",
      beltColor: "#16384c",
      legsColor: "#1e293b",
      bootsColor: "#0f172a",
      gemColor: "#38bdf8",
      gogglesFrameColor: "#1e293b",
      gogglesLensColor: "#38bdf8",
    },
  },
  don_paco: {
    id: "don_paco",
    name: "Don Paco (Protón)",
    role: "Guardián Ancestral · Gema Dorada",
    portrait: "assets/img/personajes/don_paco.jpg",
    weaponName: "Bastón Rúnico Ancestral",
    weaponType: "baston_chaman",
    trailColor: "#f59e0b",
    shieldColor: "#fbbf24",
    rig: {
      id: "don_paco_game",
      build: "hero",
      headgear: "crown",
      hairColor: "#cbd5e1",
      skinColor: "#c88a65",
      torsoColor: "#92400e",
      sleeveColor: "#78350f",
      beltColor: "#f59e0b",
      legsColor: "#451a03",
      bootsColor: "#291d12",
      gemColor: "#f59e0b",
    },
  },
  droid: {
    id: "droid",
    name: "Droid",
    role: "Androide Táctico · Gema Cian",
    portrait: "assets/img/personajes/droid.jpg",
    weaponName: "Hoja de Plasma Cibernética",
    weaponType: "sword",
    trailColor: "#22d3ee",
    shieldColor: "#06b6d4",
    rig: {
      id: "droid_game",
      build: "droid",
      headgear: "none",
      hairColor: "#475569",
      skinColor: "#94a3b8",
      torsoColor: "#0f172a",
      sleeveColor: "#334155",
      beltColor: "#06b6d4",
      legsColor: "#1e293b",
      bootsColor: "#0284c7",
      gemColor: "#22d3ee",
    },
  },
  nawa: {
    id: "nawa",
    name: "Nawa (Protón 2)",
    role: "Guerrera del Diquís · Gema Verde",
    portrait: "assets/img/personajes/nawa.jpg",
    weaponName: "Espada Ceremonial de Jade",
    weaponType: "sword",
    trailColor: "#10b981",
    shieldColor: "#34d399",
    rig: {
      id: "nawa_game",
      build: "agile",
      headgear: "long_hair",
      hairColor: "#14121d",
      skinColor: "#c6865c",
      torsoColor: "#047857",
      sleeveColor: "#c6865c",
      beltColor: "#d97706",
      legsColor: "#064e3b",
      bootsColor: "#78350f",
      gemColor: "#10b981",
    },
  },
};

// ---- 2. Arquitectura Canónica: 8 Mundos × 4 Niveles = 32 Niveles ----
export const PROTON_8_WORLDS = [
  {
    world: 1,
    title: "Mundo 1: Hospital en Tormenta y Escape Nocturno",
    gem: "Gema Blanca / Azul",
    gemColor: "#38bdf8",
    era: "1990 · Capítulos 0 y 1",
    chapterRef: "Cap. 0: Nacimiento — El rescate del bebé y escape en el vehículo blanco",
    bgImg: "assets/img/capitulos/cap_00.jpg",
    unlocked: true,
    levels: [
      { id: "1-1", name: "Pasillos de Urgencias, Maternidad y Escape en el Vehículo Blanco", playable: true },
      { id: "1-2", name: "Carretera Bajo la Tormenta", playable: false },
      { id: "1-3", name: "Refugio en la Montaña", playable: false },
      { id: "1-4", name: "Jefe: Persecución en la Noche", playable: false },
    ],
  },
  {
    world: 2,
    title: "Mundo 2: Valle del Diquís y Río Sierpe",
    gem: "Gema Verde (Esmeralda)",
    gemColor: "#10b981",
    era: "Costa Rica Precolombina · Cap. 2 y 3",
    chapterRef: "Cap. 2: Un Nuevo Mundo · Cap. 3: La decisión",
    bgImg: "assets/img/capitulos/cap_02.jpg",
    unlocked: false,
    levels: [
      { id: "2-1", name: "Ribera de los Manglares Gigantes", playable: false },
      { id: "2-2", name: "Aldea de los Sabios del Diquís", playable: false },
      { id: "2-3", name: "Catarata del Jaguar Loky", playable: false },
      { id: "2-4", name: "Jefe: Prueba del Cacique Camaquiri", playable: false },
    ],
  },
  {
    world: 3,
    title: "Mundo 3: El Árbol Ceibo de Ámbar",
    gem: "Gema Naranja (Ámbar)",
    gemColor: "#f97316",
    era: "Santuario Ancestral · Cap. 0 y 4",
    chapterRef: "Cap. 0: Nacimiento · Cap. 4: El Entrenamiento",
    bgImg: "assets/img/capitulos/cap_04.jpg",
    unlocked: false,
    levels: [
      { id: "3-1", name: "Raíces Luminosas del Ceibo", playable: false },
      { id: "3-2", name: "Cámara de la Resina Dorada", playable: false },
      { id: "3-3", name: "Sendero de los Cinco Hermanos", playable: false },
      { id: "3-4", name: "Jefe: Espíritu del Ámbar Antiguo", playable: false },
    ],
  },
  {
    world: 4,
    title: "Mundo 4: Cumbres de Talamanca y Valle del Silencio",
    gem: "Gema Morada (Amatista)",
    gemColor: "#a855f7",
    era: "Cordillera de Talamanca · Cap. 5",
    chapterRef: "Cap. 5: El viaje — El acecho de La Banshee",
    bgImg: "assets/img/capitulos/cap_05.jpg",
    unlocked: false,
    levels: [
      { id: "4-1", name: "Páramo de la Neblina Eterna", playable: false },
      { id: "4-2", name: "Desfiladero de los Ecos", playable: false },
      { id: "4-3", name: "Santuario de los Chamanes", playable: false },
      { id: "4-4", name: "Jefe: La Banshee del Valle del Silencio", playable: false },
    ],
  },
  {
    world: 5,
    title: "Mundo 5: Costa de Cariari y Galeones de 1502",
    gem: "Gema Amarilla (Topacio)",
    gemColor: "#eab308",
    era: "1502 d.C. · Cap. 6",
    chapterRef: "Cap. 6: Cariari — El desembarco de Cristóbal Colón",
    bgImg: "assets/img/capitulos/cap_06.jpg",
    unlocked: false,
    levels: [
      { id: "5-1", name: "Arrecife de las Carabelas", playable: false },
      { id: "5-2", name: "Trincheras en la Playa de Cariari", playable: false },
      { id: "5-3", name: "Cubierta del Galeón Español", playable: false },
      { id: "5-4", name: "Jefe: Artillería de Cristóbal Colón", playable: false },
    ],
  },
  {
    world: 6,
    title: "Mundo 6: Arenas de Pi-Ramsés (Egipto Antiguo)",
    gem: "Gema Roja (Rubí)",
    gemColor: "#ef4444",
    era: "1250 a.C. · Cap. 7 y 8",
    chapterRef: "Cap. 7: El plan · Cap. 8: La verdad",
    bgImg: "assets/img/capitulos/cap_07.jpg",
    unlocked: false,
    levels: [
      { id: "6-1", name: "Dunas de los Obeliscos Solares", playable: false },
      { id: "6-2", name: "Corredor de las Esfinges", playable: false },
      { id: "6-3", name: "Cámara Secreta del Faraón", playable: false },
      { id: "6-4", name: "Jefe: Pipo (Ramsés II) y su Guardia Real", playable: false },
    ],
  },
  {
    world: 7,
    title: "Mundo 7: Fortaleza Helada del Guardián del Norte",
    gem: "Gema Cian (Hielo Astral)",
    gemColor: "#06b6d4",
    era: "Confín Boreal · Cap. 8 y 9",
    chapterRef: "Cap. 8: La verdad · Cap. 9: La batalla",
    bgImg: "assets/img/capitulos/cap_08.jpg",
    unlocked: false,
    levels: [
      { id: "7-1", name: "Glaciar de las Auroras Cuánticas", playable: false },
      { id: "7-2", name: "Puente de Cristal Congelado", playable: false },
      { id: "7-3", name: "Torre de Hielo Eterno", playable: false },
      { id: "7-4", name: "Jefe: El Guardián del Norte", playable: false },
    ],
  },
  {
    world: 8,
    title: "Mundo 8: Convergencia de las 8 Gemas del Arcoíris",
    gem: "Gema Blanca (Luz Primordial)",
    gemColor: "#f8fafc",
    era: "Convergencia Temporal · Cap. 9 y 10",
    chapterRef: "Cap. 9: La batalla · Cap. 10: El inicio",
    bgImg: "assets/img/capitulos/cap_10.jpg",
    unlocked: false,
    levels: [
      { id: "8-1", name: "Fractura del Continuo Espacio-Tiempo", playable: false },
      { id: "8-2", name: "Alianza de los 8 Portadores", playable: false },
      { id: "8-3", name: "Núcleo del Proyecto Protón", playable: false },
      { id: "8-4", name: "Jefe Final: El Despertar del Arcoíris", playable: false },
    ],
  },
];

// ---- 3. Secuencias de Historia del Hospital Nocturno ----
export const STORY_SEQUENCES = {
  intro: [
    {
      title: "Capítulo 0: Nacimiento — Hospital Nocturno en Alerta",
      speaker: "Don Paco (Protón)",
      portrait: "assets/img/personajes/don_paco.jpg",
      bg: "assets/img/capitulos/cap_00.jpg",
      text: "«El rayo de luz nos ha teletransportado al interior del hospital durante la tormenta. Entramos sin armas: debemos abrirnos paso por Urgencias y encontrar nuestro equipo.»",
    },
    {
      title: "Capítulo 0: El Bebé en el Ala de Maternidad",
      speaker: "Cisco Miranda",
      portrait: "assets/img/personajes/cisco.jpg",
      bg: "assets/img/capitulos/cap_00.jpg",
      text: "«¡Criaturas nocturnas han invadido los pasillos del hospital! Debemos encontrar el arma en el Armero Médico, resolver el puzzle de la Incubadora para rescatar al bebé y escapar en el vehículo blanco antes de que se agote el tiempo.»",
    },
  ],
  baby_saved: [
    {
      title: "Ala de Maternidad — ¡Bebé Rescatado!",
      speaker: "Nawa (Protón 2)",
      portrait: "assets/img/personajes/nawa.jpg",
      bg: "assets/img/capitulos/cap_00.jpg",
      text: "«¡Código biomédico desbloqueado! Tenemos al bebé a salvo en nuestros brazos. ¡Rápido, corre hacia la salida del estacionamiento donde aguarda el vehículo blanco!»",
    },
  ],
  victory: [
    {
      title: "¡Escape Completado en el Vehículo Blanco!",
      speaker: "Don Paco & Cisco",
      portrait: "assets/img/personajes/cisco.jpg",
      bg: "assets/img/capitulos/cap_01.jpg",
      text: "«¡Subimos al vehículo blanco con el bebé a salvo y dejamos atrás el hospital en medio de la tormenta! Has superado la Pantalla 1-1 del Mundo 1.»",
    },
  ],
};

// ---- 4. Horneador de Efectos Reales de PixelFX (tractor-beam, crystal-shard, shield, heavy-landing) ----
function bakePixelFxStrip(fxMod, customOptions = {}, maxFrames = 18) {
  const m = fxMod.meta;
  const w = m.size[0];
  const h = m.size[1];
  const ox = m.origin[0];
  const oy = m.origin[1];
  const frame = createFrame(w, h);
  const inst = createFx(fxMod, { x: ox, y: oy, ...(m.options || {}), ...customOptions });
  const dt = m.duration / maxFrames;
  const frames = [];

  for (let i = 0; i < maxFrames; i++) {
    if (i > 0) inst.update(dt);
    clearFrame(frame);
    inst.draw(frame, "back");
    inst.draw(frame, "front");
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext("2d");
    const img = ctx.createImageData(w, h);
    composite(frame, img.data, null);
    ctx.putImageData(img, 0, 0);
    frames.push(cv);
  }
  return { frames, w, h, ox, oy };
}

// ---- 5. Generador de Sprites para los 4 Personajes (Desarmado + Con Arma) ----
function bakeAllCharactersSprites() {
  const catalog = {};
  const W = 56;
  const H = 56;
  const OX = 28;
  const OY = 50;

  const setPx = (data, x, y, r, g, b, a = 255) => {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || iy < 0 || ix >= W || iy >= H) return;
    const idx = (iy * W + ix) * 4;
    data[idx] = r;
    data[idx + 1] = g;
    data[idx + 2] = b;
    data[idx + 3] = a;
  };

  for (const [charId, charDef] of Object.entries(PLAYABLE_CHARACTERS)) {
    catalog[charId] = {};
    for (const mode of ["unarmed", "armed"]) {
      const wpn = mode === "unarmed" ? "none" : charDef.weaponType;
      setCharacterRig({
        ...charDef.rig,
        weaponOverride: wpn,
      });

      const poseDefs = {
        idle0: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 2, lean: 1, fx: 10, fy: -20, bx: 7, by: -20 },
        idle1: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 4, lean: 2, fx: 11, fy: -19, bx: 8, by: -19 },
        run0: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 3, lean: 6, fx: 12, fy: -20, bx: -6, by: -20, ffx: -10, ffy: -5, fbx: 10, fby: -4 },
        run1: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 1, lean: 6, fx: 3, fy: -21, bx: 3, by: -21, ffx: -1, ffy: -7, fbx: 2, fby: -4 },
        run2: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 3, lean: 6, fx: -5, fy: -19, bx: 12, by: -21, ffx: 10, ffy: -4, fbx: -10, fby: -5 },
        run3: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 1, lean: 6, fx: 3, fy: -21, bx: 3, by: -21, ffx: 2, ffy: -4, fbx: -1, fby: -7 },
        jump: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 0, lean: 2, fx: 11, fy: -28, bx: -5, by: -25, ffx: 5, ffy: -8, fbx: -5, fby: -9 },
        double_jump: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 5, lean: 8, fx: 14, fy: -26, bx: -10, by: -26, ffx: 8, ffy: -10, fbx: -8, fby: -10 },
        fall: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 2, lean: 3, fx: 9, fy: -24, bx: -6, by: -23, ffx: 6, ffy: -5, fbx: -6, fby: -6 },
        dash: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 5, lean: 9, fx: 17, fy: -20, bx: -9, by: -19, ffx: 11, ffy: -4, fbx: -11, fby: -5, sa: 0.15 },
        attack: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 4, lean: 6, fx: 16, fy: -20, bx: -6, by: -19, ffx: 8, ffy: -4, fbx: -8, fby: -4, sa: 0.25 },
        combo: { ...READY, weapon: wpn === "none" ? undefined : wpn, crouch: 3, lean: 8, fx: 18, fy: -23, bx: 12, by: -22, ffx: 9, ffy: -4, fbx: -9, fby: -4, sa: -0.35 },
        shield: { ...STAND, weapon: wpn === "none" ? undefined : wpn, crouch: 4, lean: -1, fx: 12, fy: -25, bx: 8, by: -22, ffx: 6, ffy: -4, fbx: -6, fby: -4 },
      };

      for (const [key, poseObj] of Object.entries(poseDefs)) {
        const r = posed(poseObj);
        for (const dir of ["right", "left"]) {
          const cv = document.createElement("canvas");
          cv.width = W;
          cv.height = H;
          const ctx = cv.getContext("2d");
          const img = ctx.createImageData(W, H);
          const data = img.data;
          const mirror = dir === "left";

          let headTopY = 999;
          let headSumX = 0;
          let headCount = 0;

          for (let i = 0; i < r.n; i++) {
            const px = mirror ? OX - r.xs[i] - 1 : OX + r.xs[i];
            const py = OY + r.ys[i];
            if (px >= 0 && py >= 0 && px < W && py < H) {
              const c = r.color[i];
              const idx = (py * W + px) * 4;
              data[idx] = c & 255;
              data[idx + 1] = (c >>> 8) & 255;
              data[idx + 2] = (c >>> 16) & 255;
              data[idx + 3] = (c >>> 24) & 255;
              if (py < headTopY) headTopY = py;
              if (py <= OY - 28) {
                headSumX += px;
                headCount++;
              }
            }
          }

          // Detalles finos de Cisco fieles a cisco.jpg
          if (charId === "cisco" && headCount > 0) {
            const hx = Math.round(headSumX / headCount);
            const hy = headTopY + 4;
            const s = mirror ? -1 : 1;
            const blondeHi = [255, 249, 232];
            const blondeMid = [243, 229, 200];
            const blondeShd = [212, 192, 154];
            setPx(data, hx - 2 * s, hy - 4, ...blondeHi);
            setPx(data, hx - 1 * s, hy - 4, ...blondeHi);
            setPx(data, hx + 1 * s, hy - 4, ...blondeMid);
            setPx(data, hx - 4 * s, hy - 2, ...blondeMid);
            setPx(data, hx - 5 * s, hy - 1, ...blondeHi);
            setPx(data, hx - 4 * s, hy + 1, ...blondeShd);
            setPx(data, hx + 1 * s, hy + 1, ...blondeHi);
            setPx(data, hx + 2 * s, hy + 1, ...blondeMid);
            setPx(data, hx - 1 * s, hy + 1, ...blondeMid);

            const frameDark = [15, 23, 42];
            const lensBlue = [2, 132, 199];
            const lensCyan = [56, 189, 248];
            const lensGlint = [224, 242, 254];
            for (let dx = -3; dx <= 3; dx++) {
              setPx(data, hx + dx * s, hy - 2, ...frameDark);
              setPx(data, hx + dx * s, hy, ...frameDark);
            }
            setPx(data, hx - 3 * s, hy - 1, ...frameDark);
            setPx(data, hx, hy - 1, ...frameDark);
            setPx(data, hx - 2 * s, hy - 1, ...lensBlue);
            setPx(data, hx - 1 * s, hy - 1, ...lensCyan);
            setPx(data, hx + 1 * s, hy - 1, ...lensBlue);
            setPx(data, hx + 2 * s, hy - 1, ...lensCyan);
            setPx(data, hx + 3 * s, hy - 1, ...lensGlint);

            setPx(data, hx + 2 * s, hy + 2, 29, 78, 216);
            setPx(data, hx + 1 * s, hy + 2, 147, 197, 253);
            setPx(data, hx + 1 * s, hy + 4, 74, 44, 29);

            const by = hy + 8;
            setPx(data, hx + 1 * s, by, 22, 56, 76);
            setPx(data, hx + 1 * s, by + 1, 22, 56, 76);
            for (let dy = 0; dy <= 8; dy++) {
              setPx(data, hx, by + dy, 248, 250, 252);
              setPx(data, hx - 1 * s, by + dy, 226, 232, 240);
              if (dy >= 5) {
                setPx(data, hx - 2 * s, by + dy, 241, 245, 249);
                setPx(data, hx + 1 * s, by + dy, 226, 232, 240);
              }
            }
            setPx(data, hx - 3 * s, by + 2, 103, 232, 249);
            setPx(data, hx - 3 * s, by + 3, 103, 232, 249);
            setPx(data, hx - 3 * s, by + 4, 103, 232, 249);
          }

          ctx.putImageData(img, 0, 0);
          catalog[charId][`${mode}_${key}_${dir}`] = cv;
        }
      }
    }
  }
  return catalog;
}

// ---- 6. Sprite Sheets Propios para las Criaturas del Hospital Nocturno ----
// Incluye 3 arquetipos: Voladoras (flyer), Rastreras (crawler) y Saltarinas (hopper), más el Jefe
function bakeHospitalMobSprites() {
  const out = {};

  const makeCanvas = (w, h, drawFn) => {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const c = cv.getContext("2d");
    c.imageSmoothingEnabled = false;
    drawFn(c, w, h);
    return cv;
  };

  // 1. VOLADORA (Flyer: Dron / Quirófano-Espectro Alado) - 2 frames x 2 direcciones
  for (let f = 0; f < 2; f++) {
    for (const dir of ["left", "right"]) {
      out[`flyer_${f}_${dir}`] = makeCanvas(36, 30, (c) => {
        const wingY = f === 0 ? 4 : 16;
        // Alas bio-mecánicas quirúrgicas
        c.fillStyle = "#4c1d95";
        c.beginPath();
        c.moveTo(18, 15);
        c.lineTo(2, wingY);
        c.lineTo(6, wingY + 8);
        c.closePath();
        c.fill();
        c.beginPath();
        c.moveTo(18, 15);
        c.lineTo(34, wingY);
        c.lineTo(30, wingY + 8);
        c.closePath();
        c.fill();
        // Cuerpo globular blindado
        c.fillStyle = "#1e1b4b";
        c.fillRect(11, 8, 14, 14);
        c.strokeStyle = "#a855f7";
        c.lineWidth = 1.5;
        c.strokeRect(11, 8, 14, 14);
        // Ojo láser rojo buscador
        const eyeX = dir === "right" ? 19 : 13;
        c.fillStyle = "#ef4444";
        c.fillRect(eyeX, 12, 5, 5);
        c.fillStyle = "#fecaca";
        c.fillRect(eyeX + 1, 13, 2, 2);
        // Aguja inferior
        c.fillStyle = "#94a3b8";
        c.fillRect(17, 22, 2, 6);
      });
    }
  }

  // 2. RASTRERA (Crawler: Sombra Bio-Rastrera de Laboratorio) - 2 frames x 2 direcciones
  for (let f = 0; f < 2; f++) {
    for (const dir of ["left", "right"]) {
      out[`crawler_${f}_${dir}`] = makeCanvas(40, 22, (c) => {
        const stretch = f === 0 ? 0 : 3;
        c.fillStyle = "#064e3b";
        for (let seg = 0; seg < 4; seg++) {
          const sx = dir === "right" ? 6 + seg * 7 : 28 - seg * 7;
          const sy = 12 + ((seg + f) % 2) * 2;
          c.beginPath();
          c.arc(sx, sy, 6 - (seg === 0 ? 0 : 1), 0, Math.PI * 2);
          c.fill();
          c.strokeStyle = "#10b981";
          c.lineWidth = 1;
          c.stroke();
        }
        // Mandíbulas y ojos brillantes en la cabeza delantera
        const headX = dir === "right" ? 28 + stretch : 12 - stretch;
        c.fillStyle = "#84cc16";
        c.fillRect(headX - 2, 9, 4, 3);
        c.fillStyle = "#fef08a";
        c.fillRect(dir === "right" ? headX + 2 : headX - 5, 13, 3, 2);
      });
    }
  }

  // 3. SALTARINA (Hopper: Acechador Mutante Saltarín de Guardia) - 2 frames (agachado / salto) x 2 dirs
  for (let f = 0; f < 2; f++) {
    for (const dir of ["left", "right"]) {
      out[`hopper_${f}_${dir}`] = makeCanvas(38, 38, (c) => {
        const bodyY = f === 0 ? 14 : 6;
        // Piernas de resorte articuladas
        c.strokeStyle = "#64748b";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(14, bodyY + 12);
        c.lineTo(10, f === 0 ? 30 : 24);
        c.lineTo(15, 36);
        c.moveTo(24, bodyY + 12);
        c.lineTo(28, f === 0 ? 30 : 24);
        c.lineTo(23, 36);
        c.stroke();
        // Torso con bata rasgada de hospital
        c.fillStyle = "#0f766e";
        c.fillRect(10, bodyY, 18, 15);
        c.strokeStyle = "#2dd4bf";
        c.lineWidth = 1.5;
        c.strokeRect(10, bodyY, 18, 15);
        // Visor / ojos amarillos
        const ex = dir === "right" ? 20 : 12;
        c.fillStyle = "#facc15";
        c.fillRect(ex, bodyY + 4, 6, 4);
      });
    }
  }

  return out;
}

// ---- 7. Motor Principal del Nivel 1-1 ----
export function initProtonGameDemo() {
  const root = document.getElementById("proton-game-demo-root");
  if (!root) return;

  root.innerHTML = `
    <div class="game-demo-wrapper">
      <!-- Barra Selector de los 4 Personajes Jugables + Reloj de 240 Minutos + Puntaje -->
      <div class="game-demo-topbar">
        <div class="game-char-picker" role="group" aria-label="Seleccionar personaje jugable">
          <span style="font-size:0.76rem;color:var(--accent-gold);font-weight:700;margin-right:0.25rem;">🎮 JUGADOR:</span>
          <button type="button" class="toolbar-btn active" data-pick-char="cisco">
            👱‍♂️ Cisco
          </button>
          <button type="button" class="toolbar-btn" data-pick-char="don_paco">
            🧙‍♂️ Don Paco
          </button>
          <button type="button" class="toolbar-btn" data-pick-char="droid">
            🤖 Droid
          </button>
          <button type="button" class="toolbar-btn" data-pick-char="nawa">
            🏹 Nawa
          </button>
        </div>

        <div class="game-hud-pills">
          <span class="game-pill gold" id="gd-timer-label">⏱️ Tiempo: 240:00</span>
          <span class="game-pill cyan" id="gd-score-label">🏆 Puntos: 0</span>
          <span class="game-pill" id="gd-coins-label">🪙 Oro: 0 / 100 (1UP)</span>
          <span class="game-pill" id="gd-lives-label">❤️ Vidas: 3</span>
          <span class="game-pill" id="gd-weapon-label">👊 Sin Arma (Busca Armero)</span>
          <span class="game-pill" id="gd-energy-label">⚡ Energía Combo: 0%</span>
          <span class="game-pill" id="gd-baby-label">👶 Bebé: En Incubadora</span>
        </div>

        <div class="game-lab-actions">
          <button type="button" class="toolbar-btn" id="gd-btn-grow" title="Probar el Trozo de Gema Blanca (crystal-shard) que hace grande al personaje">
            💎 Gema Blanca (Grande)
          </button>
          <button type="button" class="toolbar-btn" id="gd-btn-energy" title="Llenar barra de energía al 100% para probar el Sword Combo">
            ⚡ Cargar Energía 100%
          </button>
          <button type="button" class="toolbar-btn" id="gd-btn-puzzle" title="Abrir el Puzzle de la Incubadora del Hospital para rescatar al bebé">
            🧩 Puzzle del Bebé
          </button>
          <button type="button" class="toolbar-btn" id="gd-btn-reset">
            🔄 Reiniciar
          </button>
          <button type="button" class="btn-primary" id="gd-btn-fullscreen" style="padding:0.4rem 0.85rem;font-size:0.78rem;">
            ⛶ Pantalla Completa
          </button>
        </div>
      </div>

      <!-- Contenedor del Escenario de Juego -->
      <div class="game-stage-box" id="gd-stage-box">
        <canvas id="gd-canvas" width="640" height="360" aria-label="Pantalla del Videojuego Proyecto Protón Hospital Nocturno"></canvas>

        <!-- Modal del Puzzle Biomédico del Hospital para Rescatar al Bebé -->
        <div class="game-cutscene-overlay" id="gd-puzzle-modal" style="display:none;">
          <div class="game-cutscene-card" style="max-width:520px;padding:1.1rem 1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
              <strong style="color:#38bdf8;font-size:1rem;">🏥 PUZZLE DE INCUBADORA NEONATAL — SALA DE MATERNIDAD</strong>
              <button type="button" class="toolbar-btn" id="gd-puzzle-close">✕ Cerrar</button>
            </div>
            <p style="font-size:0.84rem;color:var(--text-secondary);margin:0 0 0.8rem;">
              La cápsula del bebé recién nacido está bloqueada por el sistema de emergencia del hospital. Pulsa los <strong>4 Nodos de Frecuencia Cardíaca en orden ascendente (1 → 2 → 3 → 4)</strong> para abrir la incubadora y poder subir al vehículo blanco:
            </p>
            <div id="gd-puzzle-nodes" style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.6rem;margin-bottom:0.85rem;"></div>
            <div id="gd-puzzle-status" style="font-family:var(--font-mono);font-size:0.8rem;color:#fde047;text-align:center;">
              Secuencia actual: Esperando nodo #1...
            </div>
          </div>
        </div>

        <!-- Superposición de Escenas de Historia -->
        <div class="game-cutscene-overlay" id="gd-cutscene" style="display:none;">
          <div class="game-cutscene-card">
            <div class="game-cutscene-art" id="gd-cut-bg">
              <div class="game-cutscene-badge" id="gd-cut-title">Prólogo · Capítulo 0</div>
            </div>
            <div class="game-cutscene-dialog">
              <img id="gd-cut-portrait" src="assets/img/personajes/cisco.jpg" alt="Retrato" class="game-cutscene-avatar" />
              <div class="game-cutscene-text-wrap">
                <strong id="gd-cut-speaker">Cisco</strong>
                <p id="gd-cut-text"></p>
              </div>
            </div>
            <div class="game-cutscene-footer">
              <span id="gd-cut-step" style="font-size:0.75rem;color:var(--text-muted);">Escena 1 / 2</span>
              <div style="display:flex;gap:0.5rem;">
                <button type="button" class="toolbar-btn" id="gd-cut-skip">Saltar ⏭️</button>
                <button type="button" class="btn-primary" id="gd-cut-next" style="padding:0.45rem 1rem;font-size:0.82rem;">Siguiente ▶</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles Táctiles para Celular / Tablet y PC -->
        <div class="game-touch-controls" aria-label="Controles táctiles para móvil">
          <div class="touch-dpad">
            <button type="button" class="touch-btn" data-touch-key="left" aria-label="Mover a la izquierda">◀</button>
            <button type="button" class="touch-btn" data-touch-key="right" aria-label="Mover a la derecha">▶</button>
            <button type="button" class="touch-btn" data-touch-key="shield" aria-label="Escudo de defensa">🛡️ Escudo</button>
          </div>
          <div class="touch-actions">
            <button type="button" class="touch-btn action-atk" data-touch-key="attack" aria-label="Ataque básico">⚔️ Golpe</button>
            <button type="button" class="touch-btn action-pwr" data-touch-key="dash" aria-label="Dash con golpe">💨 Dash+Golpe</button>
            <button type="button" class="touch-btn action-atk" data-touch-key="combo" aria-label="Sword Combo con barra de energía">🔥 Combo</button>
            <button type="button" class="touch-btn action-jmp" data-touch-key="jump" aria-label="Saltar / Doble Salto">⬆️ Salto ×2</button>
          </div>
        </div>
      </div>

      <!-- Guía de Controles y Mecánicas -->
      <div class="game-instructions-bar">
        <div><strong>🎮 Controles:</strong> <code>A/D</code> Correr con Estela · <code>W/Espacio</code> Salto y <strong>Doble Salto Acrobático</strong> · <code>J/Z</code> Golpe · <code>Shift/L</code> <strong>Dash con Golpe</strong> · <code>U/C</code> <strong>Sword Combo (100% Energía)</strong> · <code>S/↓/Q</code> <strong>Escudo</strong></div>
        <div><strong>🏥 Objetivo Nivel 1-1:</strong> 1) Entra por el <code>scifi/tractor-beam</code> sin arma · 2) Recoge tu <strong>Arma</strong> en el Armero (<code>x=680</code>) · 3) Resuelve el <strong>Puzzle de la Incubadora</strong> (<code>x=2480</code>) para rescatar al <strong>Bebé</strong> · 4) Sube al <strong>Vehículo Blanco</strong> (<code>x=3040</code>).</div>
      </div>

      <!-- Mapa Canónico de los 8 Mundos × 4 Niveles -->
      <div class="game-worlds-section">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.85rem;">
          <div>
            <h3 style="font-family:var(--font-display);color:var(--accent-gold);margin:0;">🗺️ Arquitectura de los 8 Mundos Canónicos (8 Mundos × 4 Niveles = 32 Niveles)</h3>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin:0.2rem 0 0;">
              Selecciona cualquiera de los 4 héroes arriba y supera el Hospital Nocturno antes de que se agoten los <strong>240 minutos</strong>.
            </p>
          </div>
        </div>
        <div class="game-worlds-grid" id="gd-worlds-grid"></div>
      </div>
    </div>
  `;

  // Renderizar tarjetas de los 8 Mundos × 4 Niveles
  const worldsGrid = document.getElementById("gd-worlds-grid");
  PROTON_8_WORLDS.forEach((w) => {
    const card = document.createElement("article");
    card.className = `game-world-card ${w.unlocked ? "unlocked" : "locked"}`;
    card.innerHTML = `
      <div class="game-world-banner" style="background-image:url('${w.bgImg}');">
        <span class="game-world-gem" style="background:${w.gemColor};color:#04120d;">💎 ${w.gem}</span>
        <span class="game-world-status">${w.unlocked ? "✅ DEMO ACTIVA" : "🔒 PRÓXIMAMENTE"}</span>
      </div>
      <div class="game-world-body">
        <h4>${w.title}</h4>
        <small style="color:var(--accent-cyan);">${w.chapterRef}</small>
        <ul class="game-world-levels">
          ${w.levels
            .map(
              (lv) => `
            <li class="${lv.playable ? "playable" : ""}">
              <span><strong>${lv.id}</strong> · ${lv.name}</span>
              <span>${lv.playable ? "🎮 Jugable" : "⏳"}</span>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
    worldsGrid.appendChild(card);
  });

  const canvas = document.getElementById("gd-canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  // Hornear los sprites de los 4 personajes (desarmados y armados), de los 3 tipos de criaturas y los efectos PixelFX
  const charSprites = bakeAllCharactersSprites();
  const mobSprites = bakeHospitalMobSprites();

  // Efecto de entrada en escena: scifi/tractor-beam (loop)
  const fxBeam = bakePixelFxStrip(fxTractorBeam, {}, 20);
  // Efecto del Trozo de la Gema Blanca (Hacerse Grande): pickups/crystal-shard con paleta de Gema Blanca
  const fxWhiteGemShard = bakePixelFxStrip(
    fxCrystalShard,
    {
      palette: ["#0f172a", "#1e293b", "#38bdf8", "#7dd3fc", "#cbd5e1", "#e2e8f0", "#f8fafc", "#ffffff"],
    },
    18
  );
  // Efecto de Defensa / Escudo: impacts/shield-block
  const fxShield = bakePixelFxStrip(fxShieldBlock, {}, 14);
  // Efecto de Salto Acrobático e Impacto contra el suelo: impacts/heavy-landing
  const fxLanding = bakePixelFxStrip(fxHeavyLanding, {}, 12);

  // Imagen de fondo FIJA durante todo el nivel: Hospital Nocturno (cap_00.jpg) + retratos de los 4 personajes
  const bgHospital = new Image();
  bgHospital.src = "assets/img/capitulos/cap_00.jpg";

  const portraits = {};
  for (const [id, ch] of Object.entries(PLAYABLE_CHARACTERS)) {
    const im = new Image();
    im.src = ch.portrait;
    portraits[id] = im;
  }

  let selectedCharId = "cisco";

  // Controles activos (Teclado + Touch)
  const keys = {
    left: false,
    right: false,
    shield: false,
    jumpJustPressed: false,
    attackJustPressed: false,
    dashJustPressed: false,
    comboJustPressed: false,
  };

  const LEVEL_WIDTH = 3240;
  const GROUND_Y = 308;
  const GRAVITY = 1320;
  const TOTAL_TIME_SECONDS = 240 * 60; // 240 minutos exactos (14,400 segundos)

  let game = null;
  let cutsceneState = { active: false, seq: [], idx: 0 };

  function createInitialGameState() {
    return {
      time: 0,
      remainingSeconds: TOTAL_TIME_SECONDS,
      cameraX: 0,
      score: 0,
      goldCoins: 0,
      lives: 3,
      entryBeamTimer: 3.6, // Entrada en escena descendiendo por scifi/tractor-beam
      babySaved: false,
      puzzleNextNode: 1,
      puzzleOrder: [2, 4, 1, 3],
      carEscapeActive: false,
      carEscapeProgress: 0,
      carX: 3020,
      bannerMsg: "🛸 Entrada por Tractor-Beam: Avanza por el Hospital, recoge tu Arma (x=680), salva al Bebé (x=2480) y sube al Vehículo Blanco.",
      bannerTimer: 6.0,
      player: {
        x: 95,
        y: GROUND_Y - 72, // Empieza descendiendo por el Tractor Beam
        vx: 0,
        vy: 0,
        dir: "right",
        onGround: false,
        jumpsLeft: 2,      // Soporta Doble Salto
        acrobaticJump: false,
        isSuper: false,    // Trozo de Gema Blanca (crystal-shard) -> Crece 1.48x
        scale: 1.0,
        targetScale: 1.0,
        hasWeapon: false,  // Inicia SIN ARMAS y la encuentra en x=680
        energy: 40,        // Barra de energía (0 a 100) para el Sword Combo
        maxEnergy: 100,
        hp: 4,
        maxHp: 4,
        invulnTimer: 0,
        attackTimer: 0,
        dashTimer: 0,
        comboTimer: 0,
        comboStep: 0,
        shieldActive: false,
        landingShockTimer: 0,
        landingShockX: 0,
        landingShockY: 0,
        animTime: 0,
        ghostTrail: [],    // Estela de Carrera Veloz y Dash
      },
      // Plataformas y pisos del Hospital Nocturno
      platforms: [
        { x: 0, y: GROUND_Y, w: 940, h: 60 },
        { x: 990, y: GROUND_Y, w: 920, h: 60 },
        { x: 1960, y: GROUND_Y, w: 1280, h: 60 },
        // Camillas elevadas y pasarelas médicas
        { x: 240, y: 234, w: 115, h: 12 },
        { x: 430, y: 194, w: 125, h: 12 },
        { x: 630, y: 230, w: 115, h: 12 },
        { x: 820, y: 190, w: 105, h: 12 },
        { x: 1110, y: 226, w: 130, h: 12 },
        { x: 1340, y: 184, w: 140, h: 12 },
        { x: 1620, y: 222, w: 130, h: 12 },
        { x: 2050, y: 224, w: 135, h: 12 },
        { x: 2260, y: 186, w: 135, h: 12 },
        { x: 2660, y: 222, w: 140, h: 12 },
      ],
      // Bloques médicos [?] que liberan el Trozo de la Gema Blanca (crystal-shard) o Monedas/Energía
      mysteryBlocks: [
        { x: 282, y: 162, w: 28, h: 28, hit: false, content: "white_gem_shard", bounce: 0, label: "💎 Gema Blanca" },
        { x: 478, y: 122, w: 28, h: 28, hit: false, content: "coins_pack", bounce: 0, label: "🪙 +25 Oro" },
        { x: 1160, y: 154, w: 28, h: 28, hit: false, content: "white_gem_shard", bounce: 0, label: "💎 Gema Blanca" },
        { x: 1395, y: 112, w: 28, h: 28, hit: false, content: "coins_pack", bounce: 0, label: "🪙 +25 Oro" },
        { x: 2105, y: 152, w: 28, h: 28, hit: false, content: "white_gem_shard", bounce: 0, label: "💎 Gema Blanca" },
        { x: 2310, y: 114, w: 28, h: 28, hit: false, content: "coins_pack", bounce: 0, label: "🪙 +25 Oro" },
      ],
      // Cápsula Armero Médico donde el personaje encuentra su arma por primera vez
      weaponLocker: {
        x: 685,
        y: 230,
        taken: false,
      },
      // Incubadora Neonatal en el Ala de Maternidad (requiere resolver el Puzzle)
      babyIncubator: {
        x: 2480,
        y: GROUND_Y,
      },
      // Monedas de oro (100 monedas = +1 Vida Extra)
      coins: [
        { x: 185, y: 274, taken: false },
        { x: 215, y: 274, taken: false },
        { x: 265, y: 204, taken: false },
        { x: 305, y: 204, taken: false },
        { x: 460, y: 164, taken: false },
        { x: 505, y: 164, taken: false },
        { x: 655, y: 200, taken: false },
        { x: 850, y: 160, taken: false },
        { x: 1050, y: 274, taken: false },
        { x: 1145, y: 196, taken: false },
        { x: 1190, y: 196, taken: false },
        { x: 1380, y: 154, taken: false },
        { x: 1425, y: 154, taken: false },
        { x: 1650, y: 192, taken: false },
        { x: 1700, y: 192, taken: false },
        { x: 2080, y: 194, taken: false },
        { x: 2130, y: 194, taken: false },
        { x: 2290, y: 156, taken: false },
        { x: 2340, y: 156, taken: false },
        { x: 2700, y: 192, taken: false },
      ],
      // Power-ups activos en el mundo (white_gem_shard con crystal-shard, energy_orb, gold_coin_drop)
      powerups: [],
      // Criaturas del Hospital Nocturno (con IA que busca al jugador: crawler, hopper, flyer y boss)
      mobs: [
        { kind: "crawler", x: 370, y: GROUND_Y, vx: -55, vy: 0, minX: 200, maxX: 560, hp: 2, maxHp: 2, alive: true, squashTimer: 0, jumpTimer: 0 },
        { kind: "hopper", x: 560, y: GROUND_Y, vx: -65, vy: 0, minX: 380, maxX: 760, hp: 2, maxHp: 2, alive: true, squashTimer: 0, jumpTimer: 0.8 },
        { kind: "flyer", x: 760, y: 175, baseY: 175, vx: -72, vy: 0, minX: 540, maxX: 910, hp: 2, maxHp: 2, alive: true, squashTimer: 0 },
        { kind: "crawler", x: 1140, y: GROUND_Y, vx: -62, vy: 0, minX: 1010, maxX: 1420, hp: 2, maxHp: 2, alive: true, squashTimer: 0 },
        { kind: "hopper", x: 1320, y: GROUND_Y, vx: -68, vy: 0, minX: 1060, maxX: 1560, hp: 3, maxHp: 3, alive: true, squashTimer: 0, jumpTimer: 0.5 },
        { kind: "flyer", x: 1490, y: 165, baseY: 165, vx: -78, vy: 0, minX: 1240, maxX: 1760, hp: 2, maxHp: 2, alive: true, squashTimer: 0 },
        { kind: "crawler", x: 1720, y: GROUND_Y, vx: -65, vy: 0, minX: 1480, maxX: 1880, hp: 2, maxHp: 2, alive: true, squashTimer: 0 },
        { kind: "hopper", x: 2140, y: GROUND_Y, vx: -72, vy: 0, minX: 1980, maxX: 2380, hp: 3, maxHp: 3, alive: true, squashTimer: 0, jumpTimer: 0.6 },
        { kind: "flyer", x: 2340, y: 162, baseY: 162, vx: -82, vy: 0, minX: 2060, maxX: 2560, hp: 2, maxHp: 2, alive: true, squashTimer: 0 },
        { kind: "crawler", x: 2610, y: GROUND_Y, vx: -70, vy: 0, minX: 2380, maxX: 2820, hp: 3, maxHp: 3, alive: true, squashTimer: 0 },
        {
          kind: "boss",
          name: "Guardián Espectral del Hospital",
          x: 2860,
          y: GROUND_Y,
          vx: -62,
          vy: 0,
          minX: 2660,
          maxX: 2960,
          hp: 10,
          maxHp: 10,
          alive: true,
          squashTimer: 0,
          jumpTimer: 1.4,
        },
      ],
      particles: [],
      floatingTexts: [],
    };
  }

  game = createInitialGameState();

  function formatTimer(sec) {
    const s = Math.max(0, Math.floor(sec));
    const mins = Math.floor(s / 60);
    const remSec = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(remSec).padStart(2, "0")}`;
  }

  function updateHudPills() {
    const p = game.player;
    const ch = PLAYABLE_CHARACTERS[selectedCharId];
    const timerEl = document.getElementById("gd-timer-label");
    const scoreEl = document.getElementById("gd-score-label");
    const coinsEl = document.getElementById("gd-coins-label");
    const livesEl = document.getElementById("gd-lives-label");
    const weaponEl = document.getElementById("gd-weapon-label");
    const energyEl = document.getElementById("gd-energy-label");
    const babyEl = document.getElementById("gd-baby-label");

    if (timerEl) timerEl.textContent = `⏱️ Tiempo: ${formatTimer(game.remainingSeconds)}`;
    if (scoreEl) scoreEl.textContent = `🏆 Puntos: ${game.score}`;
    if (coinsEl) coinsEl.textContent = `🪙 Oro: ${game.goldCoins} / 100 (1UP)`;
    if (livesEl) livesEl.textContent = `❤️ Vidas: ${game.lives}`;
    if (weaponEl) {
      weaponEl.textContent = p.hasWeapon ? `⚔️ ${ch.weaponName}` : "👊 Sin Arma (Busca x=680)";
    }
    if (energyEl) {
      energyEl.textContent = `⚡ Energía Combo: ${Math.round(p.energy)}%${p.energy >= 100 ? " (¡LISTO [U/🔥]!)" : ""}`;
    }
    if (babyEl) {
      babyEl.textContent = game.babySaved ? "👶 Bebé: ¡Rescatado! (Ve al Vehículo Blanco)" : "👶 Bebé: En Incubadora (x=2480)";
    }
  }

  function addGoldCoins(amount, x, y) {
    game.goldCoins += amount;
    game.score += amount * 25;
    if (game.goldCoins >= 100) {
      const extraLives = Math.floor(game.goldCoins / 100);
      game.goldCoins = game.goldCoins % 100;
      game.lives += extraLives;
      game.player.hp = game.player.maxHp;
      spawnParticles(x, y, "#fde047", 28, 160);
      addFloatingText(x, y - 22, `🎉 ¡100 MONEDAS! +${extraLives} VIDA EXTRA (1UP)`, "#fde047");
    }
    updateHudPills();
  }

  function spawnParticles(x, y, color, count = 12, speed = 110) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = (0.3 + Math.random() * 0.7) * speed;
      game.particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 40,
        color,
        life: 0.35 + Math.random() * 0.35,
        age: 0,
        size: 2 + Math.floor(Math.random() * 3),
      });
    }
  }

  function addFloatingText(x, y, text, color = "#fde047") {
    game.floatingTexts.push({ x, y, text, color, age: 0, life: 1.15 });
  }

  // Transformación con el Trozo de la Gema Blanca (pickups/crystal-shard)
  function triggerWhiteGemGrowth() {
    const p = game.player;
    p.isSuper = true;
    p.targetScale = 1.48;
    p.maxHp = 6;
    p.hp = 6;
    game.score += 500;
    spawnParticles(p.x, p.y - 24, "#f8fafc", 28, 150);
    spawnParticles(p.x, p.y - 24, "#38bdf8", 18, 120);
    addFloatingText(p.x, p.y - 52, "¡TROZO DE GEMA BLANCA! TAMAÑO 1.5×", "#f8fafc");
    game.bannerMsg = "💎 ¡TROZO DE LA GEMA BLANCA ABSORBIDO! Has crecido en Modo Super Protón (1.5×).";
    game.bannerTimer = 4.2;
    updateHudPills();
  }

  // Drops al derrotar criaturas: Orbe de Energía (para el Sword Combo) + Monedas de Oro
  function spawnMobLoot(x, y, isBoss = false) {
    const count = isBoss ? 5 : 2;
    for (let i = 0; i < count; i++) {
      game.powerups.push({
        kind: "energy_orb",
        x: x + (i - 1) * 12,
        y: y - 14,
        vx: (Math.random() - 0.5) * 65,
        vy: -150 - Math.random() * 60,
        r: 7,
        taken: false,
      });
      game.powerups.push({
        kind: "gold_coin_drop",
        x: x + (i - 0.5) * 14,
        y: y - 18,
        vx: (Math.random() - 0.5) * 80,
        vy: -170 - Math.random() * 50,
        r: 7,
        taken: false,
      });
    }
  }

  // ---- Puzzle Interactivo de la Incubadora del Hospital para Rescatar al Bebé ----
  const puzzleModal = document.getElementById("gd-puzzle-modal");
  const puzzleNodesBox = document.getElementById("gd-puzzle-nodes");
  const puzzleStatusEl = document.getElementById("gd-puzzle-status");

  function openBabyPuzzleModal() {
    if (game.babySaved) {
      game.bannerMsg = "👶 ¡Ya rescataste al bebé! Llévalo hasta el Vehículo Blanco al final del hospital (x=3040).";
      game.bannerTimer = 3.5;
      return;
    }
    game.puzzleNextNode = 1;
    // Mezclar el orden de los 4 botones
    game.puzzleOrder = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
    renderPuzzleButtons();
    if (puzzleStatusEl) {
      puzzleStatusEl.textContent = "Pulsa el Nodo Biomédico #1 para iniciar el desbloqueo...";
    }
    puzzleModal.style.display = "flex";
  }

  function renderPuzzleButtons() {
    if (!puzzleNodesBox) return;
    puzzleNodesBox.innerHTML = "";
    game.puzzleOrder.forEach((num) => {
      const done = num < game.puzzleNextNode;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `btn-${done ? "primary" : "secondary"}`;
      btn.style.cssText = `padding:0.85rem 0.5rem;font-family:var(--font-mono);font-size:1rem;font-weight:700;border-color:${done ? "#10b981" : "#38bdf8"};`;
      btn.textContent = done ? `✅ #${num}` : `💓 NODO ${num}`;
      btn.addEventListener("click", () => {
        if (num === game.puzzleNextNode) {
          game.puzzleNextNode++;
          renderPuzzleButtons();
          if (game.puzzleNextNode > 4) {
            game.babySaved = true;
            game.score += 1000;
            puzzleModal.style.display = "none";
            spawnParticles(game.babyIncubator.x, GROUND_Y - 30, "#10b981", 32, 160);
            addFloatingText(game.babyIncubator.x, GROUND_Y - 58, "👶 ¡BEBÉ RESCATADO! +1000 PTS", "#10b981");
            game.bannerMsg = "👶 ¡BEBÉ RESCATADO DE LA INCUBADORA! Ahora corre al Vehículo Blanco al final del nivel (x=3040).";
            game.bannerTimer = 5.5;
            updateHudPills();
            openStorySequence("baby_saved");
          } else if (puzzleStatusEl) {
            puzzleStatusEl.textContent = `¡Correcto! Ahora pulsa el Nodo #${game.puzzleNextNode}...`;
          }
        } else {
          game.puzzleNextNode = 1;
          renderPuzzleButtons();
          if (puzzleStatusEl) {
            puzzleStatusEl.textContent = "⚠️ Frecuencia incorrecta. Reiniciando: Pulsa el Nodo #1.";
          }
        }
      });
      puzzleNodesBox.appendChild(btn);
    });
  }

  document.getElementById("gd-puzzle-close")?.addEventListener("click", () => {
    puzzleModal.style.display = "none";
  });

  // ---- Sistema de Escenas de Historia ----
  const cutsceneEl = document.getElementById("gd-cutscene");
  const cutBg = document.getElementById("gd-cut-bg");
  const cutTitle = document.getElementById("gd-cut-title");
  const cutPortrait = document.getElementById("gd-cut-portrait");
  const cutSpeaker = document.getElementById("gd-cut-speaker");
  const cutText = document.getElementById("gd-cut-text");
  const cutStep = document.getElementById("gd-cut-step");

  function openStorySequence(seqKey) {
    const seq = STORY_SEQUENCES[seqKey];
    if (!seq || !seq.length) return;
    cutsceneState = { active: true, seq, idx: 0 };
    renderCutsceneSlide();
    cutsceneEl.style.display = "flex";
  }

  function renderCutsceneSlide() {
    const slide = cutsceneState.seq[cutsceneState.idx];
    if (!slide) return;
    cutBg.style.backgroundImage = `url('${slide.bg}')`;
    cutTitle.textContent = slide.title;
    cutPortrait.src = slide.portrait;
    cutSpeaker.textContent = slide.speaker;
    cutText.textContent = slide.text;
    cutStep.textContent = `Escena ${cutsceneState.idx + 1} / ${cutsceneState.seq.length}`;
  }

  function closeCutscene() {
    cutsceneState.active = false;
    cutsceneEl.style.display = "none";
  }

  document.getElementById("gd-cut-next")?.addEventListener("click", () => {
    if (cutsceneState.idx + 1 < cutsceneState.seq.length) {
      cutsceneState.idx++;
      renderCutsceneSlide();
    } else {
      closeCutscene();
    }
  });
  document.getElementById("gd-cut-skip")?.addEventListener("click", closeCutscene);

  // Selector de los 4 Personajes
  root.querySelectorAll("[data-pick-char]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.pickChar;
      if (!PLAYABLE_CHARACTERS[id]) return;
      selectedCharId = id;
      root.querySelectorAll("[data-pick-char]").forEach((b) => b.classList.toggle("active", b.dataset.pickChar === id));
      const ch = PLAYABLE_CHARACTERS[id];
      spawnParticles(game.player.x, game.player.y - 24, ch.trailColor, 20, 130);
      addFloatingText(game.player.x, game.player.y - 46, `🎮 ${ch.name}`, ch.trailColor);
      updateHudPills();
    });
  });

  // Botones de barra superior
  document.getElementById("gd-btn-grow")?.addEventListener("click", triggerWhiteGemGrowth);
  document.getElementById("gd-btn-energy")?.addEventListener("click", () => {
    game.player.energy = 100;
    addFloatingText(game.player.x, game.player.y - 44, "⚡ ¡ENERGÍA 100%! USA SWORD COMBO [U / 🔥]", "#fde047");
    updateHudPills();
  });
  document.getElementById("gd-btn-puzzle")?.addEventListener("click", openBabyPuzzleModal);
  document.getElementById("gd-btn-reset")?.addEventListener("click", () => {
    game = createInitialGameState();
    updateHudPills();
  });
  document.getElementById("gd-btn-fullscreen")?.addEventListener("click", () => {
    const stageBox = document.getElementById("gd-stage-box");
    if (!document.fullscreenElement) {
      stageBox?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  });

  // Controles de Teclado (PC)
  window.addEventListener("keydown", (e) => {
    const gameSection = document.getElementById("view-game");
    if (!gameSection || !gameSection.classList.contains("active")) return;
    if (cutsceneState.active) {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        document.getElementById("gd-cut-next")?.click();
      }
      return;
    }
    if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
    if (e.code === "ArrowDown" || e.code === "KeyS" || e.code === "KeyQ") keys.shield = true;
    if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
      e.preventDefault();
      if (!e.repeat) keys.jumpJustPressed = true;
    }
    if (e.code === "KeyJ" || e.code === "KeyZ") {
      if (!e.repeat) keys.attackJustPressed = true;
    }
    if (e.code === "ShiftLeft" || e.code === "ShiftRight" || e.code === "KeyL" || e.code === "KeyX") {
      if (!e.repeat) keys.dashJustPressed = true;
    }
    if (e.code === "KeyU" || e.code === "KeyC" || e.code === "KeyK") {
      if (!e.repeat) keys.comboJustPressed = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
    if (e.code === "ArrowDown" || e.code === "KeyS" || e.code === "KeyQ") keys.shield = false;
  });

  // Controles Táctiles (Celular / Tablet y Clic)
  root.querySelectorAll("[data-touch-key]").forEach((btn) => {
    const k = btn.dataset.touchKey;
    const press = (ev) => {
      ev.preventDefault();
      btn.classList.add("pressed");
      if (k === "left") keys.left = true;
      if (k === "right") keys.right = true;
      if (k === "shield") keys.shield = true;
      if (k === "jump") keys.jumpJustPressed = true;
      if (k === "attack") keys.attackJustPressed = true;
      if (k === "dash") keys.dashJustPressed = true;
      if (k === "combo") keys.comboJustPressed = true;
    };
    const release = (ev) => {
      ev.preventDefault();
      btn.classList.remove("pressed");
      if (k === "left") keys.left = false;
      if (k === "right") keys.right = false;
      if (k === "shield") keys.shield = false;
    };
    btn.addEventListener("pointerdown", press);
    btn.addEventListener("pointerup", release);
    btn.addEventListener("pointerleave", release);
    btn.addEventListener("pointercancel", release);
  });

  function damagePlayer(fromX) {
    const p = game.player;
    if (p.invulnTimer > 0 || p.dashTimer > 0 || p.comboTimer > 0) return;

    // Si tiene el Escudo activo, bloquea el golpe y repele a la criatura
    if (p.shieldActive) {
      p.invulnTimer = 0.45;
      spawnParticles(p.x, p.y - 24, "#38bdf8", 16, 140);
      addFloatingText(p.x, p.y - 46, "🛡️ ¡BLOQUEO DE ESCUDO!", "#38bdf8");
      return;
    }

    p.invulnTimer = 1.3;
    p.vy = -230;
    p.vx = fromX && fromX > p.x ? -160 : 160;

    if (p.isSuper) {
      p.isSuper = false;
      p.targetScale = 1.0;
      spawnParticles(p.x, p.y - 24, "#cbd5e1", 20, 120);
      addFloatingText(p.x, p.y - 44, "¡Escudo Gema Blanca absorbido! Tamaño 1.0×", "#cbd5e1");
      updateHudPills();
      return;
    }

    p.hp--;
    spawnParticles(p.x, p.y - 20, "#ef4444", 16, 120);
    addFloatingText(p.x, p.y - 40, "-1 ❤️", "#ef4444");
    if (p.hp <= 0) {
      game.lives--;
      if (game.lives <= 0) {
        game = createInitialGameState();
        game.bannerMsg = "💥 Has perdido todas las vidas. ¡Reintentando Hospital Nocturno!";
        game.bannerTimer = 4.0;
      } else {
        p.hp = p.maxHp;
        p.x = Math.max(95, p.x - 180);
        p.y = GROUND_Y - 60;
        game.entryBeamTimer = 2.0;
        addFloatingText(p.x, p.y - 40, `🛸 Reaparición (${game.lives} Vidas)`, "#38bdf8");
      }
    }
    updateHudPills();
  }

  function applyMeleeHitbox(rangePx, dmg, labelColor = "#38bdf8", tagText = null) {
    const p = game.player;
    const reach = rangePx * p.scale;
    const hitCenterX = p.dir === "right" ? p.x + reach * 0.55 : p.x - reach * 0.55;
    game.mobs.forEach((m) => {
      if (!m.alive) return;
      if (Math.abs(m.x - hitCenterX) < reach && Math.abs(m.y - p.y) < 58 * p.scale) {
        m.hp -= dmg;
        m.vx = p.dir === "right" ? Math.abs(m.vx) : -Math.abs(m.vx);
        spawnParticles(m.x, m.y - 18, labelColor, 14, 130);
        addFloatingText(m.x, m.y - 34, tagText || `-${dmg}`, labelColor);
        if (m.hp <= 0) {
          m.alive = false;
          m.squashTimer = 0.35;
          game.score += m.kind === "boss" ? 1500 : 220;
          spawnMobLoot(m.x, m.y, m.kind === "boss");
          updateHudPills();
        }
      }
    });
  }

  // ---- Bucle Físico del Nivel 1-1 ----
  function updateGame(dt) {
    if (cutsceneState.active || puzzleModal.style.display === "flex") return;

    game.time += dt;
    if (game.entryBeamTimer > 0) {
      game.entryBeamTimer = Math.max(0, game.entryBeamTimer - dt);
    }
    if (game.bannerTimer > 0) {
      game.bannerTimer = Math.max(0, game.bannerTimer - dt);
    }

    // Cinemática final: el personaje se sube al Vehículo Blanco y arranca
    if (game.carEscapeActive) {
      game.carEscapeProgress += dt;
      const p = game.player;
      if (game.carEscapeProgress < 1.1) {
        // Camina hacia la puerta del vehículo blanco con el bebé
        p.dir = "right";
        p.x += (game.carX - 10 - p.x) * Math.min(1, dt * 6);
        p.y = GROUND_Y;
        p.animTime += dt * 2;
      } else if (game.carEscapeProgress < 3.4) {
        // Ya dentro del vehículo blanco: el vehículo acelera hacia la derecha con luces encendidas
        game.carX += 260 * dt;
        spawnParticles(game.carX - 48, GROUND_Y - 6, "#38bdf8", 2, 50);
      } else {
        game.carEscapeActive = false;
        openStorySequence("victory");
      }
      return;
    }

    // Reloj de cuenta regresiva de 240 minutos
    game.remainingSeconds = Math.max(0, game.remainingSeconds - dt);
    if (Math.floor(game.time * 2) !== Math.floor((game.time - dt) * 2)) {
      updateHudPills();
    }
    if (game.remainingSeconds <= 0) {
      game = createInitialGameState();
      game.bannerMsg = "⏰ ¡Se agotaron los 240 minutos! Reiniciando misión en el Hospital.";
      game.bannerTimer = 4.5;
      updateHudPills();
      return;
    }

    const p = game.player;
    const ch = PLAYABLE_CHARACTERS[selectedCharId];

    // Interpolación de escala (Modo Super Protón con Trozo de Gema Blanca)
    if (Math.abs(p.scale - p.targetScale) > 0.01) {
      p.scale += (p.targetScale - p.scale) * Math.min(1, dt * 8);
    } else {
      p.scale = p.targetScale;
    }

    if (p.invulnTimer > 0) p.invulnTimer = Math.max(0, p.invulnTimer - dt);
    if (p.attackTimer > 0) p.attackTimer = Math.max(0, p.attackTimer - dt);
    if (p.dashTimer > 0) p.dashTimer = Math.max(0, p.dashTimer - dt);
    if (p.comboTimer > 0) p.comboTimer = Math.max(0, p.comboTimer - dt);
    if (p.landingShockTimer > 0) p.landingShockTimer = Math.max(0, p.landingShockTimer - dt);

    // Defensa con Escudo (consume un poco de energía o se mantiene al pulsar S/Escudo)
    p.shieldActive = keys.shield && p.dashTimer <= 0 && p.comboTimer <= 0;

    // Movimiento horizontal y Carrera Veloz con Estela
    const baseSpeed = p.isSuper ? 235 : 210;
    if (p.dashTimer > 0) {
      p.vx = (p.dir === "right" ? 1 : -1) * 460;
    } else if (p.comboTimer > 0) {
      p.vx = (p.dir === "right" ? 1 : -1) * 140;
    } else if (p.shieldActive) {
      p.vx *= 0.6;
    } else if (keys.left && !keys.right) {
      p.vx = -baseSpeed;
      p.dir = "left";
    } else if (keys.right && !keys.left) {
      p.vx = baseSpeed;
      p.dir = "right";
    } else {
      p.vx *= Math.pow(0.0008, dt);
      if (Math.abs(p.vx) < 4) p.vx = 0;
    }

    // Estela de Carrera Veloz (proton/run-dash), Dash y Salto Acrobático
    if ((Math.abs(p.vx) > 165 || p.dashTimer > 0 || p.acrobaticJump || p.comboTimer > 0) && Math.floor(game.time * 28) !== Math.floor((game.time - dt) * 28)) {
      p.ghostTrail.push({
        x: p.x,
        y: p.y,
        dir: p.dir,
        scale: p.scale,
        color: ch.trailColor,
        alpha: p.dashTimer > 0 || p.comboTimer > 0 ? 0.55 : 0.32,
      });
      if (p.ghostTrail.length > 6) p.ghostTrail.shift();
    }
    for (let i = p.ghostTrail.length - 1; i >= 0; i--) {
      p.ghostTrail[i].alpha -= dt * 1.9;
      if (p.ghostTrail[i].alpha <= 0) p.ghostTrail.splice(i, 1);
    }

    // Salto y Doble Salto Acrobático
    if (keys.jumpJustPressed) {
      if (p.onGround) {
        p.vy = p.isSuper ? -525 : -490;
        p.onGround = false;
        p.jumpsLeft = 1;
        p.acrobaticJump = false;
        spawnParticles(p.x, p.y, "#94a3b8", 6, 60);
      } else if (p.jumpsLeft > 0) {
        // ¡Doble Salto Acrobático!
        p.vy = p.isSuper ? -495 : -465;
        p.jumpsLeft = 0;
        p.acrobaticJump = true;
        spawnParticles(p.x, p.y - 16, ch.trailColor, 16, 130);
        addFloatingText(p.x, p.y - 36, "🌀 ¡DOBLE SALTO ACROBÁTICO!", ch.trailColor);
      }
    }
    keys.jumpJustPressed = false;

    // Dash con Golpe (moves/dash-strike)
    if (keys.dashJustPressed && p.dashTimer <= 0) {
      p.dashTimer = 0.24;
      p.attackTimer = 0.24;
      const dmg = (p.hasWeapon ? 2 : 1) + (p.isSuper ? 1 : 0);
      spawnParticles(p.x, p.y - 20, ch.trailColor, 18, 150);
      addFloatingText(p.x, p.y - 42, "💨 ¡DASH CON GOLPE!", ch.trailColor);
      applyMeleeHitbox(64, dmg, ch.trailColor, `💨 DASH -${dmg}`);
    }
    keys.dashJustPressed = false;

    // Ataque Básico (Sin arma = Puño Rápido; Con arma = Corte de Hoja)
    if (keys.attackJustPressed && p.attackTimer <= 0) {
      p.attackTimer = 0.25;
      const dmg = (p.hasWeapon ? 2 : 1) + (p.isSuper ? 1 : 0);
      const reach = p.hasWeapon ? 48 : 32;
      applyMeleeHitbox(reach, dmg, p.hasWeapon ? ch.trailColor : "#fbbf24");
    }
    keys.attackJustPressed = false;

    // Sword Combo (moves/sword-combo) cuando ha cargado la Barra de Energía
    if (keys.comboJustPressed) {
      if (!p.hasWeapon) {
        addFloatingText(p.x, p.y - 42, "⚠️ Primero recoge tu Arma en el Armero (x=680)", "#fbbf24");
      } else if (p.energy < 100) {
        addFloatingText(p.x, p.y - 42, `⚡ Energía insuficiente (${Math.round(p.energy)}/100%)`, "#38bdf8");
      } else {
        p.energy = 0;
        p.comboTimer = 0.55;
        p.attackTimer = 0.55;
        const comboDmg = p.isSuper ? 6 : 4;
        spawnParticles(p.x, p.y - 24, "#fde047", 32, 190);
        spawnParticles(p.x, p.y - 24, ch.trailColor, 24, 170);
        addFloatingText(p.x, p.y - 54, "⚔️🔥 ¡SWORD COMBO SUPREMO!", "#fde047");
        applyMeleeHitbox(88, comboDmg, "#fde047", `🔥 COMBO -${comboDmg}`);
        updateHudPills();
      }
    }
    keys.comboJustPressed = false;

    // Gravedad y posición
    const prevY = p.y;
    const prevVy = p.vy;
    p.vy += GRAVITY * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if (p.x < 24) p.x = 24;
    if (p.x > LEVEL_WIDTH - 24) p.x = LEVEL_WIDTH - 24;

    const headHeight = Math.round(38 * p.scale);

    // Golpear bloques médicos [?] desde abajo
    if (p.vy < 0) {
      game.mysteryBlocks.forEach((b) => {
        const headY = p.y - headHeight;
        const prevHeadY = prevY - headHeight;
        if (p.x + 12 > b.x && p.x - 12 < b.x + b.w && prevHeadY >= b.y + b.h - 4 && headY <= b.y + b.h + 6) {
          p.vy = 40;
          b.bounce = 0.22;
          if (!b.hit) {
            b.hit = true;
            spawnParticles(b.x + b.w / 2, b.y, "#fde047", 14, 100);
            if (b.content === "white_gem_shard") {
              game.powerups.push({
                kind: "white_gem_shard",
                x: b.x + b.w / 2,
                y: b.y - 10,
                vx: 52,
                vy: -150,
                r: 12,
                taken: false,
              });
              addFloatingText(b.x + 14, b.y - 16, "💎 ¡Trozo de Gema Blanca!", "#f8fafc");
            } else {
              addGoldCoins(25, b.x + 14, b.y - 12);
              addFloatingText(b.x + 14, b.y - 16, "🪙 +25 Monedas de Oro", "#fde047");
            }
          }
        }
      });
    }

    // Colisión con plataformas y Salto Acrobático e Impacto al aterrizar
    p.onGround = false;
    if (p.vy >= 0) {
      for (const plat of game.platforms) {
        if (p.x + 11 > plat.x && p.x - 11 < plat.x + plat.w && prevY <= plat.y + 8 && p.y >= plat.y) {
          p.y = plat.y;
          p.vy = 0;
          p.onGround = true;
          p.jumpsLeft = 2;
          // Si venía de un Doble Salto Acrobático o caída veloz, genera Onda de Impacto (impacts/heavy-landing)
          if (p.acrobaticJump || prevVy > 520) {
            p.acrobaticJump = false;
            p.landingShockTimer = 0.42;
            p.landingShockX = p.x;
            p.landingShockY = p.y;
            spawnParticles(p.x, p.y, "#38bdf8", 18, 140);
            applyMeleeHitbox(58, p.isSuper ? 2 : 1, "#38bdf8", "💥 IMPACTO");
          }
          break;
        }
      }
      for (const b of game.mysteryBlocks) {
        if (p.x + 10 > b.x && p.x - 10 < b.x + b.w && prevY <= b.y + 6 && p.y >= b.y) {
          p.y = b.y;
          p.vy = 0;
          p.onGround = true;
          p.jumpsLeft = 2;
          p.acrobaticJump = false;
          break;
        }
      }
    }

    // Caída en fosos de ascensor del hospital
    if (p.y > 410) {
      p.y = GROUND_Y - 40;
      p.x = Math.max(95, p.x - 140);
      p.vy = 0;
      damagePlayer(p.x);
    }

    // Recoger el Arma en el Armero Médico (x = 685)
    if (!game.weaponLocker.taken && Math.hypot(p.x - game.weaponLocker.x, p.y - game.weaponLocker.y) < 38) {
      game.weaponLocker.taken = true;
      p.hasWeapon = true;
      game.score += 400;
      spawnParticles(game.weaponLocker.x, game.weaponLocker.y - 20, ch.trailColor, 26, 150);
      addFloatingText(game.weaponLocker.x, game.weaponLocker.y - 48, `⚔️ ¡ARMA EQUIPADA: ${ch.weaponName.toUpperCase()}!`, ch.trailColor);
      game.bannerMsg = `⚔️ ¡Has encontrado tu arma (${ch.weaponName})! Ahora puedes usar Sword Combo al cargar 100% de energía.`;
      game.bannerTimer = 4.5;
      updateHudPills();
    }

    // Interacción con la Incubadora del Bebé en Maternidad (x = 2480)
    if (!game.babySaved && Math.abs(p.x - game.babyIncubator.x) < 36 && Math.abs(p.y - game.babyIncubator.y) < 48) {
      openBabyPuzzleModal();
    }

    // Recolección de Monedas de Oro fijas
    game.coins.forEach((c) => {
      if (!c.taken && Math.hypot(p.x - c.x, p.y - 20 * p.scale - c.y) < 22 * p.scale) {
        c.taken = true;
        addGoldCoins(5, c.x, c.y);
        spawnParticles(c.x, c.y, "#fbbf24", 8, 80);
        addFloatingText(c.x, c.y - 10, "+5 🪙", "#fbbf24");
      }
    });

    // Actualizar Power-Ups (Trozo de Gema Blanca con crystal-shard, Orbes de Energía y Monedas de criaturas)
    game.powerups.forEach((pu) => {
      if (pu.taken) return;
      pu.vy += GRAVITY * 0.72 * dt;
      pu.x += pu.vx * dt;
      pu.y += pu.vy * dt;

      for (const plat of game.platforms) {
        if (pu.x > plat.x && pu.x < plat.x + plat.w && pu.y + pu.r >= plat.y && pu.y - pu.r < plat.y + 12 && pu.vy >= 0) {
          pu.y = plat.y - pu.r;
          pu.vy = pu.kind === "energy_orb" ? -90 : 0;
          pu.vx *= 0.85;
        }
      }

      if (Math.hypot(p.x - pu.x, p.y - 20 * p.scale - pu.y) < (18 + pu.r) * p.scale) {
        pu.taken = true;
        if (pu.kind === "white_gem_shard") {
          triggerWhiteGemGrowth();
        } else if (pu.kind === "energy_orb") {
          p.energy = Math.min(100, p.energy + 25);
          game.score += 75;
          spawnParticles(pu.x, pu.y, "#a855f7", 10, 90);
          addFloatingText(pu.x, pu.y - 14, "+25% ⚡ ENERGÍA", "#c084fc");
          updateHudPills();
        } else if (pu.kind === "gold_coin_drop") {
          addGoldCoins(10, pu.x, pu.y);
          addFloatingText(pu.x, pu.y - 14, "+10 🪙 ORO", "#fde047");
        }
      }
    });

    // Actualizar Criaturas del Hospital Nocturno (con IA que busca al jugador)
    game.mobs.forEach((m) => {
      if (!m.alive) {
        if (m.squashTimer > 0) m.squashTimer = Math.max(0, m.squashTimer - dt);
        return;
      }

      const distToPlayer = Math.abs(p.x - m.x);
      const dirToPlayer = p.x >= m.x ? 1 : -1;
      const aggro = distToPlayer < 290; // Te buscan activamente cuando entras en rango

      if (m.kind === "flyer") {
        // Criatura que vuela y busca la altura del jugador
        const speed = aggro ? 96 : 64;
        if (aggro) {
          m.vx = dirToPlayer * speed;
          const targetY = Math.min(GROUND_Y - 26, Math.max(110, p.y - 22));
          m.y += (targetY - m.y) * Math.min(1, dt * 2.6) + Math.sin(game.time * 6 + m.x * 0.04) * 0.8;
        } else {
          m.y = m.baseY + Math.sin(game.time * 4 + m.x * 0.03) * 16;
        }
        m.x += m.vx * dt;
      } else if (m.kind === "crawler") {
        // Criatura que se arrastra velozmente hacia el jugador
        const speed = aggro ? 105 : 55;
        if (aggro) m.vx = dirToPlayer * speed;
        m.x += m.vx * dt;
      } else if (m.kind === "hopper" || m.kind === "boss") {
        // Criatura que camina haciendo saltos buscando al jugador
        const speed = aggro ? (m.kind === "boss" ? 88 : 92) : 58;
        if (aggro) m.vx = dirToPlayer * speed;
        m.x += m.vx * dt;
        m.jumpTimer = (m.jumpTimer || 0) - dt;
        if (m.jumpTimer <= 0 && m.y >= GROUND_Y - 1) {
          m.vy = m.kind === "boss" ? -360 : -320;
          m.jumpTimer = aggro ? 1.15 : 1.8;
        }
        m.vy = (m.vy || 0) + GRAVITY * 0.85 * dt;
        m.y += m.vy * dt;
        if (m.y >= GROUND_Y) {
          m.y = GROUND_Y;
          m.vy = 0;
        }
      }

      if (!aggro) {
        if (m.x < m.minX) {
          m.x = m.minX;
          m.vx = Math.abs(m.vx);
        } else if (m.x > m.maxX) {
          m.x = m.maxX;
          m.vx = -Math.abs(m.vx);
        }
      }

      const mobRadius = m.kind === "boss" ? 24 : 15;
      const mobHeight = m.kind === "boss" ? 50 : 24;
      const dx = Math.abs(p.x - m.x);
      const dyFeet = p.y - (m.y - mobHeight);

      if (dx < mobRadius + 10 * p.scale && p.y >= m.y - mobHeight - 4 && p.y - headHeight <= m.y) {
        if (p.vy > 40 && prevY <= m.y - mobHeight + 16) {
          const stompDmg = p.isSuper ? 2 : 1;
          m.hp -= stompDmg;
          p.vy = -370;
          p.jumpsLeft = 1;
          spawnParticles(m.x, m.y - mobHeight / 2, "#fde047", 14, 130);
          addFloatingText(m.x, m.y - mobHeight - 12, `¡PISOTÓN! -${stompDmg}`, "#fde047");
          if (m.hp <= 0) {
            m.alive = false;
            m.squashTimer = 0.35;
            game.score += m.kind === "boss" ? 1500 : 220;
            spawnMobLoot(m.x, m.y, m.kind === "boss");
            updateHudPills();
          }
        } else if (dyFeet > 4) {
          damagePlayer(m.x);
        }
      }
    });

    // Meta del Nivel 1-1: El Vehículo Blanco en el estacionamiento del Hospital (x >= 2995)
    if (!game.carEscapeActive && p.x >= 2995) {
      if (!game.babySaved) {
        p.x = 2990;
        game.bannerMsg = "⚠️ ¡No puedes irte en el Vehículo Blanco sin el bebé! Regresa a la Incubadora en x=2480 y resuelve el Puzzle.";
        game.bannerTimer = 4.0;
        addFloatingText(p.x, p.y - 48, "👶 ¡Encuentra primero al bebé (x=2480)!", "#fde047");
      } else {
        game.carEscapeActive = true;
        game.carEscapeProgress = 0;
        game.score += 2500;
        updateHudPills();
        game.bannerMsg = "🚐 ¡SUBIENDO AL VEHÍCULO BLANCO CON EL BEBÉ! Escapando del Hospital...";
        game.bannerTimer = 4.0;
      }
    }

    // Actualizar rebote de bloques, partículas y textos flotantes
    game.mysteryBlocks.forEach((b) => {
      if (b.bounce > 0) b.bounce = Math.max(0, b.bounce - dt);
    });
    for (let i = game.particles.length - 1; i >= 0; i--) {
      const pt = game.particles[i];
      pt.age += dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 320 * dt;
      if (pt.age >= pt.life) game.particles.splice(i, 1);
    }
    for (let i = game.floatingTexts.length - 1; i >= 0; i--) {
      const ft = game.floatingTexts[i];
      ft.age += dt;
      ft.y -= 28 * dt;
      if (ft.age >= ft.life) game.floatingTexts.splice(i, 1);
    }

    p.animTime += dt * (Math.abs(p.vx) > 10 ? 1.45 : 1);
    const targetCamX = Math.max(0, Math.min(LEVEL_WIDTH - canvas.width, p.x - canvas.width * 0.36));
    game.cameraX += (targetCamX - game.cameraX) * Math.min(1, dt * 10);
  }

  // ---- Renderizado Pixel-Art del Hospital Nocturno ----
  function renderGame() {
    const W = canvas.width;
    const H = canvas.height;
    const camX = Math.round(game.cameraX);
    const p = game.player;
    const ch = PLAYABLE_CHARACTERS[selectedCharId];

    // 1. Fondo FIJO del Hospital Nocturno durante toda la pantalla (cap_00.jpg)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, "#050b16");
    skyGrad.addColorStop(1, "#0d1f33");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    if (bgHospital.complete && bgHospital.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = 0.34;
      const parallaxX = -((camX * 0.2) % W);
      ctx.drawImage(bgHospital, parallaxX, 0, W, H);
      ctx.drawImage(bgHospital, parallaxX + W, 0, W, H);
      ctx.restore();
    }

    ctx.save();
    ctx.translate(-camX, 0);

    // 2. Arquitectura y Mobiliario Típico de un Hospital Nocturno (SIN esferas de piedra)
    // Paredes de azulejo clínico, ventanas bajo la tormenta, letreros médicos, camillas, monitores ECG y portasueros
    for (let hx = 40; hx < LEVEL_WIDTH - 220; hx += 260) {
      // Ventanal de hospital con lluvia y cruz médica
      ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
      ctx.fillRect(hx, 88, 96, 68);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.strokeRect(hx, 88, 96, 68);
      // Cruz clínica en la pared
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(hx + 124, 96, 22, 6);
      ctx.fillRect(hx + 132, 88, 6, 22);

      // Monitor Cardíaco ECG animado
      const ecgX = hx + 165;
      const ecgY = GROUND_Y - 58;
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(ecgX, ecgY, 36, 26);
      ctx.strokeStyle = "#475569";
      ctx.strokeRect(ecgX, ecgY, 36, 26);
      ctx.fillStyle = "#475569";
      ctx.fillRect(ecgX + 15, ecgY + 26, 6, 32);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const pulseOffset = Math.floor(game.time * 18) % 12;
      ctx.moveTo(ecgX + 3, ecgY + 14);
      ctx.lineTo(ecgX + 10, ecgY + 14);
      ctx.lineTo(ecgX + 14 + (pulseOffset % 4), ecgY + 5);
      ctx.lineTo(ecgX + 19, ecgY + 21);
      ctx.lineTo(ecgX + 24, ecgY + 11);
      ctx.lineTo(ecgX + 33, ecgY + 14);
      ctx.stroke();

      // Camilla de hospital con portasueros (IV Stand)
      const bedX = hx + 20;
      const bedY = GROUND_Y - 22;
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(bedX, bedY + 8, 56, 14);
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(bedX + 2, bedY, 52, 9);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(bedX + 10, bedY + 2, 36, 5);
      // Ruedas de la camilla
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(bedX + 8, GROUND_Y - 3, 4, 0, Math.PI * 2);
      ctx.arc(bedX + 48, GROUND_Y - 3, 4, 0, Math.PI * 2);
      ctx.fill();
      // Portasueros (IV bag)
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(bedX - 8, GROUND_Y - 52, 2, 52);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(bedX - 13, GROUND_Y - 50, 7, 12);
    }

    // Letreros luminosos de las áreas del Hospital
    const signs = [
      { x: 70, text: "🏥 URGENCIAS · ENTRADA" },
      { x: 640, text: "⚔️ ARMERO DE SEGURIDAD" },
      { x: 1320, text: "🧪 QUIRÓFANO CENTRAL" },
      { x: 2410, text: "👶 ALA DE MATERNIDAD (PUZZLE)" },
      { x: 2960, text: "🚐 SALIDA · VEHÍCULO BLANCO" },
    ];
    signs.forEach((sg) => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.fillRect(sg.x, 54, 178, 22);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(sg.x, 54, 178, 22);
      ctx.fillStyle = "#e0f2fe";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(sg.text, sg.x + 89, 69);
    });

    // 3. Efecto de Entrada en Escena: scifi/tractor-beam (loop) en x = 95
    if (game.entryBeamTimer > 0 || p.x < 240) {
      const beamIdx = Math.floor(game.time * 20) % fxBeam.frames.length;
      const beamCv = fxBeam.frames[beamIdx];
      if (beamCv) {
        ctx.drawImage(beamCv, Math.round(95 - fxBeam.ox), Math.round(GROUND_Y - fxBeam.oy));
      }
    }

    // 4. Cápsula Armero Médico (x = 685) donde el jugador consigue su arma
    const wl = game.weaponLocker;
    ctx.fillStyle = wl.taken ? "#1e293b" : "#0f172a";
    ctx.fillRect(wl.x - 18, wl.y - 46, 36, 46);
    ctx.strokeStyle = wl.taken ? "#475569" : "#fde047";
    ctx.lineWidth = 2;
    ctx.strokeRect(wl.x - 18, wl.y - 46, 36, 46);
    if (!wl.taken) {
      const bob = Math.sin(game.time * 6) * 3;
      ctx.fillStyle = "#fde047";
      ctx.fillRect(wl.x - 3, wl.y - 34 + bob, 6, 22);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(wl.x - 8, wl.y - 20 + bob, 16, 4);
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⚔️ ARMA", wl.x, wl.y - 52);
    }

    // 5. Incubadora Neonatal del Bebé en el Ala de Maternidad (x = 2480)
    const inc = game.babyIncubator;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(inc.x - 24, inc.y - 48, 48, 48);
    ctx.fillStyle = game.babySaved ? "rgba(16, 185, 129, 0.25)" : "rgba(56, 189, 248, 0.35)";
    ctx.fillRect(inc.x - 20, inc.y - 44, 40, 26);
    ctx.strokeStyle = game.babySaved ? "#10b981" : "#38bdf8";
    ctx.lineWidth = 2;
    ctx.strokeRect(inc.x - 24, inc.y - 48, 48, 48);
    if (!game.babySaved) {
      // Bebé dentro de la incubadora esperando a que resuelvas el puzzle
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(inc.x - 4, inc.y - 29, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(inc.x - 2, inc.y - 31, 14, 9);
      ctx.fillStyle = "#fde047";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🧩 RESCATAR BEBÉ", inc.x, inc.y - 55);
    } else {
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("✅ BEBÉ A SALVO", inc.x, inc.y - 55);
    }

    // 6. El Vehículo Blanco de Escape al final del Hospital (x = game.carX)
    const cx = Math.round(game.carX);
    const cy = GROUND_Y;
    ctx.save();
    // Carrocería del Vehículo Blanco (Furgoneta/Sedán médico de escape)
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(cx - 46, cy - 30, 92, 22);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(cx - 28, cy - 46, 56, 18);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 46, cy - 30, 92, 22);
    // Ventanas del vehículo blanco
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(cx - 22, cy - 43, 22, 13);
    ctx.fillRect(cx + 4, cy - 43, 20, 13);
    // Si el jugador ya subió al vehículo con el bebé, dibujamos su silueta dentro y las luces encendidas
    if (game.carEscapeActive && game.carEscapeProgress >= 1.0) {
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(cx + 12, cy - 36, 5, 0, Math.PI * 2);
      ctx.fill();
      // Haz de luz de los faros delanteros del vehículo blanco
      ctx.fillStyle = "rgba(254, 240, 138, 0.38)";
      ctx.beginPath();
      ctx.moveTo(cx + 46, cy - 22);
      ctx.lineTo(cx + 145, cy - 42);
      ctx.lineTo(cx + 145, cy - 2);
      ctx.closePath();
      ctx.fill();
    }
    // Ruedas del vehículo blanco
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(cx - 26, cy - 7, 9, 0, Math.PI * 2);
    ctx.arc(cx + 26, cy - 7, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.arc(cx - 26, cy - 7, 4, 0, Math.PI * 2);
    ctx.arc(cx + 26, cy - 7, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Plataformas y Suelo Clínico del Hospital
    game.platforms.forEach((pl) => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(pl.x, pl.y, pl.w, 3);
      // Baldosas de hospital
      ctx.fillStyle = "rgba(148, 163, 184, 0.16)";
      for (let tx = pl.x; tx < pl.x + pl.w; tx += 24) {
        ctx.fillRect(tx, pl.y + 3, 1, pl.h - 3);
      }
    });

    // 8. Bloques Médicos [?]
    game.mysteryBlocks.forEach((b) => {
      const by = b.y - Math.sin((b.bounce / 0.22) * Math.PI) * 10;
      ctx.fillStyle = b.hit ? "#334155" : "#0284c7";
      ctx.fillRect(b.x, by, b.w, b.h);
      ctx.strokeStyle = b.hit ? "#64748b" : "#f8fafc";
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x + 1, by + 1, b.w - 2, b.h - 2);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(b.hit ? "·" : "?", b.x + b.w / 2, by + 19);
    });

    // 9. Monedas de Oro (100 = 1 Vida Extra)
    game.coins.forEach((c) => {
      if (c.taken) return;
      const bob = Math.sin(game.time * 5 + c.x) * 3;
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(c.x, c.y + bob, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(c.x - 2, c.y + bob - 2, 4, 4);
    });

    // 10. Power-Ups: Trozo de Gema Blanca (con pickups/crystal-shard), Orbes de Energía y Monedas
    game.powerups.forEach((pu) => {
      if (pu.taken) return;
      if (pu.kind === "white_gem_shard") {
        // Renderizado con el efecto real pickups/crystal-shard de PixelFX
        const shardIdx = Math.floor(game.time * 18) % fxWhiteGemShard.frames.length;
        const shardCv = fxWhiteGemShard.frames[shardIdx];
        if (shardCv) {
          ctx.drawImage(
            shardCv,
            Math.round(pu.x - fxWhiteGemShard.ox),
            Math.round(pu.y + 12 - fxWhiteGemShard.oy)
          );
        }
      } else if (pu.kind === "energy_orb") {
        ctx.fillStyle = "#a855f7";
        ctx.beginPath();
        ctx.arc(pu.x, pu.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f3e8ff";
        ctx.beginPath();
        ctx.arc(pu.x - 1, pu.y - 1, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (pu.kind === "gold_coin_drop") {
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(pu.x, pu.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 11. Criaturas del Hospital Nocturno (con sus Sprite Sheets propios: flyer, crawler, hopper, boss)
    game.mobs.forEach((m) => {
      if (!m.alive && m.squashTimer <= 0) return;
      ctx.save();
      const dir = m.vx >= 0 ? "right" : "left";
      const frameIdx = Math.floor(game.time * 8) % 2;

      if (m.kind === "flyer" || m.kind === "crawler" || m.kind === "hopper") {
        const mobCv = mobSprites[`${m.kind}_${frameIdx}_${dir}`];
        if (mobCv) {
          const sy = !m.alive ? 0.4 : 1;
          ctx.drawImage(
            mobCv,
            Math.round(m.x - mobCv.width / 2),
            Math.round(m.y - mobCv.height * sy),
            mobCv.width,
            Math.round(mobCv.height * sy)
          );
        }
      } else if (m.kind === "boss") {
        const squashY = !m.alive ? 0.35 : 1;
        ctx.fillStyle = "#1e1b4b";
        ctx.fillRect(m.x - 22, m.y - 54 * squashY, 44, 54 * squashY);
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 2;
        ctx.strokeRect(m.x - 22, m.y - 54 * squashY, 44, 54 * squashY);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(m.x - 12, m.y - 42 * squashY, 8, 6);
        ctx.fillRect(m.x + 4, m.y - 42 * squashY, 8, 6);
        if (m.alive) {
          ctx.fillStyle = "rgba(0,0,0,0.75)";
          ctx.fillRect(m.x - 28, m.y - 68, 56, 7);
          ctx.fillStyle = "#a855f7";
          ctx.fillRect(m.x - 27, m.y - 67, 54 * (m.hp / m.maxHp), 5);
        }
      }
      ctx.restore();
    });

    // 12. Onda de Impacto del Salto Acrobático (impacts/heavy-landing)
    if (p.landingShockTimer > 0) {
      const prog = 1 - p.landingShockTimer / 0.42;
      const idx = Math.min(fxLanding.frames.length - 1, Math.floor(prog * fxLanding.frames.length));
      const lCv = fxLanding.frames[idx];
      if (lCv) {
        ctx.drawImage(
          lCv,
          Math.round(p.landingShockX - fxLanding.ox),
          Math.round(p.landingShockY - fxLanding.oy)
        );
      }
    }

    // 13. Jugador (oculto dentro del vehículo blanco cuando ya subió)
    if (!(game.carEscapeActive && game.carEscapeProgress >= 1.0)) {
      const modePrefix = p.hasWeapon ? "armed" : "unarmed";
      let poseKey = "idle0";
      if (p.shieldActive) {
        poseKey = "shield";
      } else if (p.comboTimer > 0) {
        poseKey = "combo";
      } else if (p.dashTimer > 0) {
        poseKey = "dash";
      } else if (p.attackTimer > 0) {
        poseKey = "attack";
      } else if (!p.onGround) {
        poseKey = p.acrobaticJump ? "double_jump" : p.vy < 0 ? "jump" : "fall";
      } else if (Math.abs(p.vx) > 12) {
        const step = Math.floor(p.animTime * 8) % 4;
        poseKey = `run${step}`;
      } else {
        poseKey = Math.floor(p.animTime * 2) % 2 === 0 ? "idle0" : "idle1";
      }

      const activeCharCatalog = charSprites[selectedCharId] || charSprites.cisco;
      const spr = activeCharCatalog[`${modePrefix}_${poseKey}_${p.dir}`];

      // Dibujar Estela de Carrera Veloz / Dash / Doble Salto
      p.ghostTrail.forEach((gh) => {
        const gSpr = activeCharCatalog[`${modePrefix}_run0_${gh.dir}`] || spr;
        if (gSpr) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, gh.alpha);
          ctx.drawImage(
            gSpr,
            Math.round(gh.x - 28 * gh.scale),
            Math.round(gh.y - 50 * gh.scale),
            Math.round(56 * gh.scale),
            Math.round(56 * gh.scale)
          );
          ctx.restore();
        }
      });

      if (spr) {
        ctx.save();
        if (p.invulnTimer > 0 && Math.floor(p.invulnTimer * 16) % 2 === 1) {
          ctx.globalAlpha = 0.45;
        }
        const sc = p.scale;
        if (p.isSuper) {
          ctx.strokeStyle = Math.floor(game.time * 12) % 2 === 0 ? "#f8fafc" : ch.trailColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y - 22 * sc, 23 * sc, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.drawImage(
          spr,
          Math.round(p.x - 28 * sc),
          Math.round(p.y - 50 * sc),
          Math.round(56 * sc),
          Math.round(56 * sc)
        );

        // Si ya rescató al bebé, lleva al bebé en brazos
        if (game.babySaved) {
          const bx = p.dir === "right" ? p.x + 6 * sc : p.x - 10 * sc;
          const by = p.y - 24 * sc;
          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(bx - 4, by - 3, 9, 6);
          ctx.fillStyle = "#fed7aa";
          ctx.beginPath();
          ctx.arc(bx + (p.dir === "right" ? 3 : -3), by - 1, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Efecto de Defensa: Escudo Hexagonal de PixelFX (impacts/shield-block)
        if (p.shieldActive) {
          const shIdx = Math.floor(game.time * 20) % fxShield.frames.length;
          const shCv = fxShield.frames[shIdx];
          if (shCv) {
            ctx.drawImage(
              shCv,
              Math.round(p.x - fxShield.ox),
              Math.round(p.y - fxShield.oy + 4)
            );
          }
        }

        // Efectos de corte en Ataque Básico, Dash con Golpe y Sword Combo
        if (p.comboTimer > 0) {
          for (let ring = 0; ring < 3; ring++) {
            ctx.strokeStyle = ring % 2 === 0 ? "#fde047" : ch.trailColor;
            ctx.lineWidth = (4 - ring) * sc;
            ctx.beginPath();
            const arcX = p.dir === "right" ? p.x + (16 + ring * 10) * sc : p.x - (16 + ring * 10) * sc;
            ctx.arc(arcX, p.y - 24 * sc, (24 + ring * 8) * sc, -1.3, 1.3);
            ctx.stroke();
          }
        } else if (p.attackTimer > 0) {
          ctx.strokeStyle = p.dashTimer > 0 ? "#fde047" : ch.trailColor;
          ctx.lineWidth = 3 * sc;
          ctx.beginPath();
          const arcX = p.dir === "right" ? p.x + 14 * sc : p.x - 14 * sc;
          ctx.arc(arcX, p.y - 22 * sc, 20 * sc, p.dir === "right" ? -1.1 : 2.0, p.dir === "right" ? 1.1 : 4.2);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // 14. Partículas y Textos Flotantes
    game.particles.forEach((pt) => {
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
    });
    game.floatingTexts.forEach((ft) => {
      ctx.fillStyle = ft.color;
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(ft.text, ft.x, ft.y);
    });

    ctx.restore();

    // 15. Tarjeta HUD en el Lienzo (Retrato del Personaje Activo, Puntaje, Tiempo 240:00, Monedas 0/100 y Barra de Energía)
    ctx.save();
    ctx.fillStyle = "rgba(6, 16, 28, 0.9)";
    ctx.fillRect(8, 8, 232, 54);
    ctx.strokeStyle = p.isSuper ? "#fde047" : ch.trailColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, 232, 54);

    const activePortrait = portraits[selectedCharId];
    if (activePortrait && activePortrait.complete && activePortrait.naturalWidth > 0) {
      ctx.drawImage(activePortrait, 12, 12, 44, 44);
      ctx.strokeStyle = ch.trailColor;
      ctx.strokeRect(12, 12, 44, 44);
    }

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${ch.name.toUpperCase()} · ❤️×${game.lives}`, 62, 22);

    ctx.fillStyle = "#fde047";
    ctx.font = "bold 10px monospace";
    ctx.fillText(`⏱️ ${formatTimer(game.remainingSeconds)}  🏆 ${game.score}`, 62, 36);

    // Barra de Energía para el Sword Combo
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(62, 43, 112, 11);
    ctx.fillStyle = p.energy >= 100 ? "#fde047" : "#a855f7";
    ctx.fillRect(63, 44, Math.round(1.1 * p.energy), 9);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px monospace";
    ctx.fillText(`⚡ COMBO ${Math.round(p.energy)}%`, 68, 51);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 9px monospace";
    ctx.fillText(`🪙${game.goldCoins}/100`, 180, 51);
    ctx.restore();

    // 16. Banner informativo
    if (game.bannerTimer > 0 && game.bannerMsg) {
      ctx.save();
      ctx.fillStyle = "rgba(4, 12, 22, 0.9)";
      ctx.fillRect(248, 10, W - 256, 28);
      ctx.strokeStyle = "#38bdf8";
      ctx.strokeRect(248, 10, W - 256, 28);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "600 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(game.bannerMsg, 248 + (W - 256) / 2, 28);
      ctx.restore();
    }
  }

  updateHudPills();

  let lastTime = performance.now();
  function gameLoop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    const gameSection = document.getElementById("view-game");
    if (!gameSection || gameSection.classList.contains("active")) {
      updateGame(dt);
      renderGame();
    }
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);

  window.ProtonGameDemo = {
    openStorySequence,
    triggerWhiteGemGrowth,
    openBabyPuzzleModal,
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProtonGameDemo);
} else {
  initProtonGameDemo();
}
