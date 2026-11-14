// ============================================================================
// PROYECTO PROTÓN — CHARACTER, ANIMATION & PIXELFX STUDIO (0 TOKENS)
// Conecta la Biblia de Personajes del Canon (window.PROTON_DATA) con el motor
// procedural 3D-a-píxel y los 244+ efectos de pixelfx-main.
// ============================================================================

import {
  effects as rawEffects,
  categories as rawCategories,
} from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/fx/index.js";

import {
  createFrame,
  clearFrame,
  createFx,
  createAct,
  actBounds,
  actTiming,
  composite,
  backdrop,
  PAL,
  READY,
  STAND,
  posed,
  setCharacterRig,
  chain,
} from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/core/index.js";

import * as holyRing from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/fx/holy/heal-aoe.js";
import * as chargeUp from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/fx/lightning/charge-up.js";
import * as heavyLand from "../../saga/Proyecto Proton el video Juego/pixelfx-main/src/fx/impacts/heavy-landing.js";

// ---- 1. Movimientos Base de Locomoción y Despertar para el Videojuego ----
const PROTON_MOVES = {
  "proton/idle-guard": {
    meta: {
      name: "Guardia Activa (Idle)",
      desc: "Postura de combate base con respiración rítmica a 12 FPS y sujeción del arma o reliquia equipada.",
      tags: ["proton", "idle", "guardia", "personaje", "loop"],
      size: [140, 110],
      origin: [70, 92],
      duration: 1.2,
      loop: true,
      fps: 24,
      bg: "proton_diquis",
      actor: 2,
      options: { seed: 1 },
    },
    act: {
      poses: [
        [0.0, { ...READY, weapon: "sword", crouch: 2, lean: 1, fx: 11, fy: -21, bx: 8, by: -21, sa: -0.65 }],
        [0.6, { ...READY, weapon: "sword", crouch: 4, lean: 2, fx: 12, fy: -19, bx: 9, by: -19, sa: -0.55 }],
        [1.2, { ...READY, weapon: "sword", crouch: 2, lean: 1, fx: 11, fy: -21, bx: 8, by: -21, sa: -0.65 }],
      ],
    },
    draw() {},
  },
  "proton/walk-cycle": {
    meta: {
      name: "Caminata de Exploración (Walk)",
      desc: "Ciclo de caminata de 4 tiempos con balanceo natural de brazos, torso y arma equipada.",
      tags: ["proton", "walk", "caminar", "locomocion", "loop"],
      size: [150, 110],
      origin: [75, 92],
      duration: 0.8,
      loop: true,
      fps: 24,
      bg: "proton_diquis",
      actor: 2,
      options: { seed: 1 },
    },
    act: {
      poses: [
        [0.0, { ...STAND, weapon: "sword", crouch: 2, lean: 2, fx: 8, fy: -18, bx: -4, by: -17, ffx: -7, ffy: -4, fbx: 8, fby: -4, sa: -0.4 }],
        [0.2, { ...STAND, weapon: "sword", crouch: 1, lean: 2, fx: 2, fy: -19, bx: 2, by: -19, ffx: 0, ffy: -6, fbx: 1, fby: -4, sa: -0.5 }],
        [0.4, { ...STAND, weapon: "sword", crouch: 2, lean: 2, fx: -4, fy: -17, bx: 9, by: -18, ffx: 8, ffy: -4, fbx: -7, fby: -4, sa: -0.6 }],
        [0.6, { ...STAND, weapon: "sword", crouch: 1, lean: 2, fx: 2, fy: -19, bx: 2, by: -19, ffx: 1, ffy: -4, fbx: 0, fby: -6, sa: -0.5 }],
        [0.8, { ...STAND, weapon: "sword", crouch: 2, lean: 2, fx: 8, fy: -18, bx: -4, by: -17, ffx: -7, ffy: -4, fbx: 8, fby: -4, sa: -0.4 }],
      ],
      dust: [{ t: 0.0, x: -4, n: 3, dir: -1 }, { t: 0.4, x: 4, n: 3, dir: -1 }],
    },
    draw() {},
  },
  "proton/run-dash": {
    meta: {
      name: "Carrera Veloz con Estela (Run)",
      desc: "Sprint de combate inclinado hacia adelante con estela energética de la Gema activa y partículas de polvo.",
      tags: ["proton", "run", "correr", "sprint", "loop"],
      size: [160, 110],
      origin: [80, 92],
      duration: 0.56,
      loop: true,
      fps: 30,
      bg: "proton_diquis",
      actor: 2,
      options: { seed: 2 },
    },
    act: {
      poses: [
        [0.0, { ...READY, weapon: "sword", crouch: 4, lean: 7, fx: 13, fy: -20, bx: -7, by: -21, ffx: -11, ffy: -6, fbx: 11, fby: -5, sa: -0.2, ghost: 1 }],
        [0.14, { ...READY, weapon: "sword", y: -3, crouch: 2, lean: 7, fx: 3, fy: -21, bx: 3, by: -21, ffx: -2, ffy: -8, fbx: 3, fby: -5, sa: -0.35, ghost: 1 }],
        [0.28, { ...READY, weapon: "sword", crouch: 4, lean: 7, fx: -6, fy: -19, bx: 13, by: -22, ffx: 11, ffy: -5, fbx: -11, fby: -6, sa: -0.5, ghost: 1 }],
        [0.42, { ...READY, weapon: "sword", y: -3, crouch: 2, lean: 7, fx: 3, fy: -21, bx: 3, by: -21, ffx: 3, ffy: -5, fbx: -2, fby: -8, sa: -0.35, ghost: 1 }],
        [0.56, { ...READY, weapon: "sword", crouch: 4, lean: 7, fx: 13, fy: -20, bx: -7, by: -21, ffx: -11, ffy: -6, fbx: 11, fby: -5, sa: -0.2, ghost: 1 }],
      ],
      dust: [{ t: 0.02, x: -6, n: 5, dir: -1 }, { t: 0.3, x: -4, n: 5, dir: -1 }],
    },
    draw() {},
  },
  "proton/jump-strike": {
    meta: {
      name: "Salto Acrobático e Impacto (Jump)",
      desc: "Impulso vertical, suspensión aérea con arma en alto y aterrizaje de fuerza sobre el terreno.",
      tags: ["proton", "jump", "salto", "acrobacia", "one-shot"],
      size: [180, 140],
      origin: [90, 118],
      duration: 1.15,
      loop: false,
      fps: 30,
      bg: "proton_cascada",
      actor: 2,
      options: { seed: 3 },
    },
    act: {
      poses: [
        [-0.2, { ...READY, weapon: "sword", crouch: 6, lean: 4, fx: -4, fy: -16, bx: -4, by: -18, sa: 2.6 }],
        [0.0, { ...READY, weapon: "sword", y: -12, crouch: 0, lean: -2, fx: 12, fy: -32, bx: -6, by: -28, ffx: 5, ffy: -7, fbx: -6, fby: -9, sa: -1.3, ghost: 1 }, "out"],
        [0.32, { ...READY, weapon: "sword", y: -28, crouch: 2, lean: 2, fx: 14, fy: -36, bx: -8, by: -30, ffx: 7, ffy: -10, fbx: -7, fby: -11, sa: -1.1, ghost: 1 }, "out"],
        [0.64, { ...READY, weapon: "sword", y: 0, crouch: 7, lean: 6, fx: 16, fy: -16, bx: -7, by: -20, ffx: 10, fbx: -9, sa: 0.45 }, "snap"],
        [1.1, { ...READY, weapon: "sword" }],
      ],
      hits: [{ t: 0.64, stop: 0.08, shake: 0.16, amp: 2, target: false }],
      dust: [{ t: 0.0, x: 0, n: 7 }, { t: 0.64, x: 0, n: 10 }],
    },
    create: chain([{ fx: heavyLand, t: 0.62, x: 0, y: 0 }]),
  },
  "proton/gem-awakening": {
    meta: {
      name: "Despertar de las 8 Gemas (Ultimate)",
      desc: "Canalización cuántica del portador: levitación mística, sobrecarga de partículas y pulso de onda expansiva.",
      tags: ["proton", "gema", "ultimate", "despertar", "energia"],
      size: [200, 150],
      origin: [100, 122],
      duration: 1.8,
      loop: false,
      fps: 30,
      bg: "proton_alfa",
      actor: 2,
      options: { seed: 7 },
    },
    act: {
      poses: [
        [-0.3, { ...READY, weapon: "esfera_diquis", crouch: 5, lean: 3, fx: 6, fy: -18, bx: 6, by: -18 }],
        [0.0, { ...STAND, weapon: "esfera_diquis", y: -6, crouch: 0, lean: -3, fx: -10, fy: -32, bx: 12, by: -32, ffx: -4, ffy: -6, fbx: 4, fby: -6, ghost: 1 }, "out"],
        [0.65, { ...STAND, weapon: "esfera_diquis", y: -14, crouch: 0, lean: -5, fx: -12, fy: -36, bx: 14, by: -36, ffx: -3, ffy: -8, fbx: 3, fby: -8, ghost: 1 }],
        [1.25, { ...READY, weapon: "esfera_diquis", y: 0, crouch: 3, lean: 1, fx: 12, fy: -23, bx: 8, by: -21 }],
        [1.75, { ...READY, weapon: "esfera_diquis" }],
      ],
      hits: [{ t: 0.45, stop: 0.12, shake: 0.25, amp: 3, target: false }],
      dust: [{ t: 0.0, x: 0, n: 9 }, { t: 1.25, x: 0, n: 6 }],
    },
    create: chain([
      { fx: chargeUp, t: 0.0, x: 0, y: -10 },
      { fx: holyRing, t: 0.42, x: 0, y: 0 },
    ]),
  },
};

// ---- 2. Presets Visuales y de Combate de los 20 Personajes del Canon ----
export const PROTON_CHARACTER_PRESETS = {
  cisco: {
    id: "cisco",
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
    gemId: "gema_azul",
    defaultWeapon: "esfera_diquis",
    defaultScene: "proton_cascada",
    defaultWeather: "weather/fireflies",
    defaultChapterBg: "assets/img/capitulos/cap_01.jpg",
    signatureMoves: [
      "proton/gem-awakening",
      "moves/dash-strike",
      "moves/lightning-call",
      "scifi/emp-blast",
      "proton/run-dash",
    ],
  },
  nawa: {
    id: "nawa",
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
    gemId: "gema_verde",
    defaultWeapon: "bow",
    defaultScene: "proton_ceibo",
    defaultWeather: "weather/falling-leaves",
    defaultChapterBg: "assets/img/capitulos/cap_02.jpg",
    signatureMoves: [
      "moves/arrow-shot",
      "nature/healing-bloom",
      "moves/dash-strike",
      "proton/jump-strike",
      "proton/gem-awakening",
    ],
  },
  gil: {
    id: "gil",
    build: "hero",
    headgear: "none",
    hairColor: "#292018",
    skinColor: "#dfb18b",
    torsoColor: "#b45309",
    sleeveColor: "#78350f",
    beltColor: "#fbbf24",
    legsColor: "#27272a",
    bootsColor: "#451a03",
    gemColor: "#eab308",
    gemId: "gema_amarilla",
    defaultWeapon: "sword",
    defaultScene: "proton_playa",
    defaultWeather: "weather/storm",
    defaultChapterBg: "assets/img/capitulos/cap_06.jpg",
    signatureMoves: [
      "moves/sword-combo",
      "moves/holy-smite",
      "moves/fireball-throw",
      "melee/double-slash",
      "proton/run-dash",
    ],
  },
  don_paco: {
    id: "don_paco",
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
    gemId: "gema_azul",
    defaultWeapon: "baston_chaman",
    defaultScene: "proton_hospital",
    defaultWeather: "weather/rain",
    defaultChapterBg: "assets/img/capitulos/cap_00.jpg",
    signatureMoves: [
      "proton/gem-awakening",
      "moves/holy-smite",
      "arcane/magic-circle-cast",
      "holy/blessing",
      "proton/idle-guard",
    ],
  },
  curre: {
    id: "curre",
    build: "hero",
    headgear: "crown",
    hairColor: "#171717",
    skinColor: "#b9774e",
    torsoColor: "#b45309",
    sleeveColor: "#b9774e",
    beltColor: "#fbbf24",
    legsColor: "#78350f",
    bootsColor: "#451a03",
    gemColor: "#f97316",
    gemId: "gema_naranja",
    defaultWeapon: "lanza_diquis",
    defaultScene: "proton_diquis",
    defaultWeather: "weather/fireflies",
    defaultChapterBg: "assets/img/capitulos/cap_04.jpg",
    signatureMoves: [
      "moves/earth-stomp",
      "melee/spear-sweep",
      "moves/holy-smite",
      "proton/gem-awakening",
      "proton/idle-guard",
    ],
  },
  droid: {
    id: "droid",
    build: "droid",
    headgear: "none",
    hairColor: "#94a3b8",
    skinColor: "#cbd5e1",
    torsoColor: "#0284c7",
    sleeveColor: "#64748b",
    beltColor: "#38bdf8",
    legsColor: "#334155",
    bootsColor: "#0f172a",
    gemColor: "#38bdf8",
    gemId: "gema_azul",
    defaultWeapon: "blaster_proton",
    defaultScene: "proton_lab",
    defaultWeather: "none",
    defaultChapterBg: "assets/img/capitulos/cap_01.jpg",
    signatureMoves: [
      "moves/pistol-shots",
      "moves/rocket-launcher",
      "scifi/emp-blast",
      "scifi/scanner",
      "scifi/laser-grid",
    ],
  },
  loky: {
    id: "loky",
    build: "feline",
    headgear: "jaguar_ears",
    hairColor: "#0f172a",
    skinColor: "#1e293b",
    torsoColor: "#0f172a",
    sleeveColor: "#1e293b",
    beltColor: "#ef4444",
    legsColor: "#0f172a",
    bootsColor: "#dc2626",
    gemColor: "#ef4444",
    gemId: "gema_roja",
    defaultWeapon: "claw",
    defaultScene: "proton_diquis",
    defaultWeather: "weather/fireflies",
    defaultChapterBg: "assets/img/Portadav2.png",
    signatureMoves: [
      "melee/claw-swipe",
      "moves/dash-strike",
      "fire/fire-breath",
      "proton/jump-strike",
      "proton/run-dash",
    ],
  },
  pipo_ramses: {
    id: "pipo_ramses",
    build: "hero",
    headgear: "nemes",
    hairColor: "#eab308",
    skinColor: "#b47854",
    torsoColor: "#7f1d1d",
    sleeveColor: "#b47854",
    beltColor: "#facc15",
    legsColor: "#1e1b4b",
    bootsColor: "#ca8a04",
    gemColor: "#dc2626",
    gemId: "gema_roja",
    defaultWeapon: "scythe",
    defaultScene: "proton_playa",
    defaultWeather: "weather/storm",
    defaultChapterBg: "assets/img/capitulos/cap_08.jpg",
    signatureMoves: [
      "moves/meteor-call",
      "melee/scythe-reap",
      "shadow/black-hole",
      "moves/fireball-throw",
      "shadow/dark-explosion",
    ],
  },
  shilea: {
    id: "shilea",
    build: "agile",
    headgear: "long_hair",
    hairColor: "#18181b",
    skinColor: "#c88a65",
    torsoColor: "#7e22ce",
    sleeveColor: "#c88a65",
    beltColor: "#c084fc",
    legsColor: "#581c87",
    bootsColor: "#3b0764",
    gemColor: "#a855f7",
    gemId: "gema_morada",
    defaultWeapon: "esfera_diquis",
    defaultScene: "proton_alfa",
    defaultWeather: "weather/aurora",
    defaultChapterBg: "assets/img/capitulos/cap_07.jpg",
    signatureMoves: [
      "proton/gem-awakening",
      "arcane/arcane-beam",
      "holy/heal",
      "arcane/magic-circle-cast",
      "proton/idle-guard",
    ],
  },
  tamanco: {
    id: "tamanco",
    build: "colossus",
    headgear: "crown",
    hairColor: "#1c1917",
    skinColor: "#b4724c",
    torsoColor: "#78350f",
    sleeveColor: "#b4724c",
    beltColor: "#eab308",
    legsColor: "#451a03",
    bootsColor: "#291d12",
    gemColor: "#f59e0b",
    gemId: "gema_blanca",
    defaultWeapon: "hammer",
    defaultScene: "proton_volcan",
    defaultWeather: "none",
    defaultChapterBg: "assets/img/capitulos/cap_06.jpg",
    signatureMoves: [
      "moves/ground-pound",
      "moves/earth-stomp",
      "melee/hammer-smash",
      "nature/boulder",
      "water/geyser",
    ],
  },
  doctor_miranda: {
    id: "doctor_miranda",
    build: "hero",
    headgear: "none",
    hairColor: "#334155",
    skinColor: "#ecc5a8",
    torsoColor: "#f8fafc",
    sleeveColor: "#e2e8f0",
    beltColor: "#475569",
    legsColor: "#1e293b",
    bootsColor: "#0f172a",
    gemColor: "#0ea5e9",
    gemId: "gema_azul",
    defaultWeapon: "handle",
    defaultScene: "proton_hospital",
    defaultWeather: "weather/rain",
    defaultChapterBg: "assets/img/capitulos/cap_00.jpg",
    signatureMoves: [
      "proton/idle-guard",
      "proton/walk-cycle",
      "holy/heal",
      "scifi/scanner",
      "ui/countdown",
    ],
  },
  obstetra_rodriguez: {
    id: "obstetra_rodriguez",
    build: "hero",
    headgear: "none",
    hairColor: "#475569",
    skinColor: "#e5b899",
    torsoColor: "#0284c7",
    sleeveColor: "#0284c7",
    beltColor: "#0369a1",
    legsColor: "#0369a1",
    bootsColor: "#f8fafc",
    gemColor: "#38bdf8",
    gemId: "gema_verde",
    defaultWeapon: "none",
    defaultScene: "proton_hospital",
    defaultWeather: "weather/rain",
    defaultChapterBg: "assets/img/capitulos/cap_00.jpg",
    signatureMoves: [
      "holy/heal-aoe",
      "holy/heal",
      "proton/idle-guard",
      "proton/walk-cycle",
    ],
  },
  cristobal_colon: {
    id: "cristobal_colon",
    build: "hero",
    headgear: "morion",
    hairColor: "#94a3b8",
    skinColor: "#e2b292",
    torsoColor: "#991b1b",
    sleeveColor: "#7f1d1d",
    beltColor: "#eab308",
    legsColor: "#1e293b",
    bootsColor: "#451a03",
    gemColor: "#eab308",
    gemId: "gema_amarilla",
    defaultWeapon: "sword",
    defaultScene: "proton_playa",
    defaultWeather: "weather/fog",
    defaultChapterBg: "assets/img/capitulos/cap_05.jpg",
    signatureMoves: [
      "moves/sword-combo",
      "moves/pistol-shots",
      "projectiles/cannonball",
      "proton/idle-guard",
    ],
  },
  dulcehe: {
    id: "dulcehe",
    build: "agile",
    headgear: "long_hair",
    hairColor: "#1c1917",
    skinColor: "#c6865c",
    torsoColor: "#be185d",
    sleeveColor: "#c6865c",
    beltColor: "#fbbf24",
    legsColor: "#831843",
    bootsColor: "#500724",
    gemColor: "#ec4899",
    gemId: "gema_morada",
    defaultWeapon: "lanza_diquis",
    defaultScene: "proton_diquis",
    defaultWeather: "weather/fireflies",
    defaultChapterBg: "assets/img/capitulos/cap_07.jpg",
    signatureMoves: [
      "moves/dash-strike",
      "melee/spear-sweep",
      "moves/arrow-shot",
      "proton/jump-strike",
    ],
  },
  quepoa: {
    id: "quepoa",
    build: "hero",
    headgear: "crown",
    hairColor: "#1c1917",
    skinColor: "#b9774e",
    torsoColor: "#0f766e",
    sleeveColor: "#b9774e",
    beltColor: "#f59e0b",
    legsColor: "#134e4a",
    bootsColor: "#451a03",
    gemColor: "#14b8a6",
    gemId: "gema_verde",
    defaultWeapon: "lanza_diquis",
    defaultScene: "proton_playa",
    defaultWeather: "none",
    defaultChapterBg: "assets/img/capitulos/cap_03.jpg",
    signatureMoves: [
      "melee/spear-sweep",
      "moves/earth-stomp",
      "moves/arrow-shot",
      "proton/run-dash",
    ],
  },
  chamanes: {
    id: "chamanes",
    build: "hero",
    headgear: "crown",
    hairColor: "#e2e8f0",
    skinColor: "#b4724c",
    torsoColor: "#c2410c",
    sleeveColor: "#9a3412",
    beltColor: "#fbbf24",
    legsColor: "#431407",
    bootsColor: "#291d12",
    gemColor: "#f97316",
    gemId: "gema_naranja",
    defaultWeapon: "baston_chaman",
    defaultScene: "proton_diquis",
    defaultWeather: "weather/fireflies",
    defaultChapterBg: "assets/img/capitulos/cap_07.jpg",
    signatureMoves: [
      "proton/gem-awakening",
      "moves/holy-smite",
      "water/water-orb",
      "nature/leaf-storm",
    ],
  },
  tribu_diquis: {
    id: "tribu_diquis",
    build: "hero",
    headgear: "jaguar_ears",
    hairColor: "#d97706",
    skinColor: "#b9774e",
    torsoColor: "#b45309",
    sleeveColor: "#b9774e",
    beltColor: "#10b981",
    legsColor: "#78350f",
    bootsColor: "#451a03",
    gemColor: "#f59e0b",
    gemId: "gema_naranja",
    defaultWeapon: "lanza_diquis",
    defaultScene: "proton_alfa",
    defaultWeather: "weather/shooting-stars",
    defaultChapterBg: "assets/img/capitulos/cap_09.jpg",
    signatureMoves: [
      "moves/arrow-shot",
      "melee/spear-sweep",
      "proton/gem-awakening",
      "proton/run-dash",
    ],
  },
  espanoles: {
    id: "espanoles",
    build: "hero",
    headgear: "morion",
    hairColor: "#64748b",
    skinColor: "#dfb18b",
    torsoColor: "#475569",
    sleeveColor: "#991b1b",
    beltColor: "#78350f",
    legsColor: "#7f1d1d",
    bootsColor: "#27272a",
    gemColor: "#ef4444",
    gemId: "gema_roja",
    defaultWeapon: "greatsword",
    defaultScene: "proton_playa",
    defaultWeather: "weather/fog",
    defaultChapterBg: "assets/img/capitulos/cap_08.jpg",
    signatureMoves: [
      "moves/sword-combo",
      "melee/heavy-cleave",
      "moves/pistol-shots",
      "explosions/barrel-explosion",
    ],
  },
  la_banshee: {
    id: "la_banshee",
    build: "agile",
    headgear: "long_hair",
    hairColor: "#064e3b",
    skinColor: "#6ee7b7",
    torsoColor: "#047857",
    sleeveColor: "#34d399",
    beltColor: "#10b981",
    legsColor: "#065f46",
    bootsColor: "#022c22",
    gemColor: "#10b981",
    gemId: "gema_verde",
    defaultWeapon: "claw",
    defaultScene: "proton_ceibo",
    defaultWeather: "weather/fog",
    defaultChapterBg: "assets/img/capitulos/cap_07.jpg",
    signatureMoves: [
      "shadow/grasping-hands",
      "shadow/curse",
      "melee/claw-swipe",
      "nature/poison-cloud",
    ],
  },
  guardian_norte: {
    id: "guardian_norte",
    build: "colossus",
    headgear: "crown",
    hairColor: "#475569",
    skinColor: "#64748b",
    torsoColor: "#334155",
    sleeveColor: "#475569",
    beltColor: "#f97316",
    legsColor: "#1e293b",
    bootsColor: "#0f172a",
    gemColor: "#f8fafc",
    gemId: "gema_blanca",
    defaultWeapon: "hammer",
    defaultScene: "proton_volcan",
    defaultWeather: "none",
    defaultChapterBg: "assets/img/capitulos/cap_07.jpg",
    signatureMoves: [
      "moves/ground-pound",
      "moves/earth-stomp",
      "moves/meteor-call",
      "fire/flame-pillar",
      "ice/frost-nova",
    ],
  },
};

// ---- 3. Catálogo de Escenas Alusivas a Proyecto Protón ----
export const PROTON_SCENES = [
  { id: "proton_diquis", label: "🗿 Selva del Diquís y Esferas de Piedra", group: "Proyecto Protón (Pixel Art)" },
  { id: "proton_cascada", label: "🌊 Cascada del Salto Temporal (Cap. 1–2)", group: "Proyecto Protón (Pixel Art)" },
  { id: "proton_volcan", label: "🌋 Volcán y Templo del Norte (Cap. 7.1)", group: "Proyecto Protón (Pixel Art)" },
  { id: "proton_ceibo", label: "🌳 El Gran Ceibo de Osa — Templo del Sur (Cap. 7.2)", group: "Proyecto Protón (Pixel Art)" },
  { id: "proton_playa", label: "🌕 Playa del Encuentro y Luna Carmesí (Cap. 8–9)", group: "Proyecto Protón (Pixel Art)" },
  { id: "proton_hospital", label: "🏥 Hospital Capitalino San José 1990 (Cap. 0)", group: "Proyecto Protón (Pixel Art)" },
  { id: "proton_alfa", label: "🌌 Alfa Centauri y Esferas Madre (Cap. 10)", group: "Proyecto Protón (Pixel Art)" },
  { id: "proton_lab", label: "⚡ Laboratorio Cuántico Proyecto Protón", group: "Proyecto Protón (Pixel Art)" },
  { id: "ground", label: "🧱 Arena de Piedra Clásica (PixelFX)", group: "Estándar" },
  { id: "sky", label: "✨ Cielo Nocturno Estrellado", group: "Estándar" },
  { id: "dark", label: "🌑 Estudio Oscuro Neutro", group: "Estándar" },
  { id: "black", label: "⬛ Negro Puro (Contraste de Luz)", group: "Estándar" },
  { id: "none", label: "🏁 Transparente (Para Sprite Sheet PNG)", group: "Estándar" },
];

export const PROTON_CHAPTER_BACKGROUNDS = [
  { value: "", label: "Ninguno (Usar solo Escena Pixel Art Procedural)" },
  { value: "assets/img/Portadav2.png", label: "🌟 Portada Oficial: Jaguar y Esfera Diquís (Portadav2.png)" },
  { value: "assets/img/capitulos/cap_00.jpg", label: "Cap. 0: Nacimiento — Hospital San José 1990" },
  { value: "assets/img/capitulos/cap_01.jpg", label: "Cap. 1: La Misión — Salto Temporal" },
  { value: "assets/img/capitulos/cap_02.jpg", label: "Cap. 2: El Encuentro — Cascada del Diquís" },
  { value: "assets/img/capitulos/cap_03.jpg", label: "Cap. 3: La Captura — Aldea Indígena" },
  { value: "assets/img/capitulos/cap_04.jpg", label: "Cap. 4: El Juicio — Rey Curré y Loky" },
  { value: "assets/img/capitulos/cap_05.jpg", label: "Cap. 5: La Traición — Huida de Pipo" },
  { value: "assets/img/capitulos/cap_06.jpg", label: "Cap. 6: El Reencuentro — Los Hermanos" },
  { value: "assets/img/capitulos/cap_07.jpg", label: "Cap. 7: Los Cuatro Templos de las Gemas" },
  { value: "assets/img/capitulos/cap_08.jpg", label: "Cap. 8: La Batalla — El Bucle de Ramsés II" },
  { value: "assets/img/capitulos/cap_09.jpg", label: "Cap. 9: La Revelación — Luna Carmesí" },
  { value: "assets/img/capitulos/cap_10.jpg", label: "Cap. 10: Epílogo — Retorno de las Esferas 2033" },
];

export const PROTON_WEATHER_OPTIONS = [
  { value: "none", label: "☀️ Sin efecto climático adicional" },
  { value: "weather/fireflies", label: "✨ Luciérnagas Bioluminiscentes del Diquís" },
  { value: "weather/rain", label: "🌧️ Lluvia Nocturna (San José / Selva)" },
  { value: "weather/storm", label: "⛈️ Tormenta Eléctrica del Bucle Temporal" },
  { value: "weather/fog", label: "🌫️ Niebla Mística del Gran Ceibo" },
  { value: "weather/aurora", label: "🌌 Aurora Cósmica de Alfa Centauri" },
  { value: "weather/falling-leaves", label: "🍃 Hojas del Bosque Tropical" },
  { value: "weather/shooting-stars", label: "☄️ Lluvia de Estrellas / Éxodo Cósmico" },
  { value: "weather/blizzard", label: "❄️ Ventisca Helada / Nitrógeno Líquido" },
];

export const PROTON_WEAPONS_LIST = [
  { value: "", label: "🎯 Automática del Movimiento" },
  { value: "esfera_diquis", label: "🗿 Esfera de Piedra Diquís Luminosa (Canon)" },
  { value: "lanza_diquis", label: "🔱 Lanza Ceremonial Indígena Diquís (Canon)" },
  { value: "baston_chaman", label: "🪄 Bastón Ancestral Jawa / Don Paco (Canon)" },
  { value: "blaster_proton", label: "🔫 Cañón / Blaster Protónico de Droid (Canon)" },
  { value: "machete", label: "🗡️ Machete de Expedición Costarricense (Canon)" },
  { value: "sword", label: "⚔️ Espada de Acero" },
  { value: "greatsword", label: "🗡️ Mandoble Pesado" },
  { value: "dagger", label: "🔪 Daga de Obsidiana" },
  { value: "spear", label: "🦯 Lanza Larga" },
  { value: "hammer", label: "🔨 Mazo / Martillo Colosal" },
  { value: "scythe", label: "🌙 Guadaña de Sombra (Ramsés)" },
  { value: "claw", label: "🐾 Garras de Jaguar (Loky / Banshee)" },
  { value: "bow", label: "🏹 Arco Ceremonial (Nawa)" },
  { value: "pistol", label: "🔫 Pistola" },
  { value: "launcher", label: "🚀 Lanzacohetes Pesado" },
  { value: "none", label: "✋ Manos Limpias (Sin Arma)" },
];

export const GEM_PALETTE_MAP = {
  gema_azul: ["#081830", "#0e2e5a", "#14508c", "#1c76bc", "#38bdf8", "#7dd3fc", "#e0f2fe", "#ffffff"],
  gema_roja: ["#1f0b10", "#4a1118", "#8c1d1c", "#dc2626", "#ef4444", "#f87171", "#fecaca", "#ffffff"],
  gema_amarilla: ["#24160a", "#5e3a0c", "#a8680f", "#eab308", "#facc15", "#fef08a", "#fef9c3", "#ffffff"],
  gema_blanca: ["#1e293b", "#334155", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#f8fafc", "#ffffff"],
  gema_verde: ["#062016", "#064e3b", "#047857", "#059669", "#10b981", "#34d399", "#a7f3d0", "#ffffff"],
  gema_naranja: ["#1c0d06", "#431407", "#7c2d12", "#c2410c", "#f97316", "#fb923c", "#fed7aa", "#ffffff"],
  gema_morada: ["#140a26", "#2b1252", "#481c88", "#6b2cc0", "#a855f7", "#c084fc", "#f3e8ff", "#ffffff"],
  gema_indigo: ["#0f0e26", "#1e1b4b", "#312e81", "#4338ca", "#6366f1", "#818cf8", "#e0e7ff", "#ffffff"],
};

// ---- 4. Unificación de Categorías y Efectos (249 en total) ----
const ALL_EFFECTS_MAP = {
  ...PROTON_MOVES,
  ...rawEffects,
};

const ALL_CATEGORIES = [
  { id: "proton", name: "movimientos protón", blurb: "Guardia, caminata, carrera, salto y despertar de las 8 Gemas." },
  ...rawCategories,
];

const FX_LIST = Object.entries(ALL_EFFECTS_MAP).map(([id, mod]) => {
  const meta = { fps: 30, bg: "proton_diquis", loop: false, duration: 1, tags: [], options: {}, ...mod.meta };
  return { id, cat: id.split("/")[0], name: meta.name, mod: { ...mod, meta }, meta };
});

// ---- 5. Estado del Estudio ----
const studioState = {
  charId: "cisco",
  rig: { ...PROTON_CHARACTER_PRESETS.cisco, weaponOverride: "esfera_diquis" },
  activeFxId: "proton/gem-awakening",
  sceneKind: "proton_cascada",
  chapterBgUrl: "",
  chapterBgAlpha: 0.45,
  weatherFxId: "weather/fireflies",
  useGemPaletteOnFx: false,
  showCharacter: true,
  showTarget: true,
  flip: false,
  speed: 1,
  playing: true,
  seed: 1,
  filterCat: "all",
  searchQuery: "",
  assignedMoves: [...PROTON_CHARACTER_PRESETS.cisco.signatureMoves],
  lastSheetDataUrl: null,
  lastSheetJson: null,
};

// ---- 6. Motor de Escenario en Vivo (Personaje + Acto/Efecto + Clima + Escena) ----
const STREAM_FX_IDS = new Set([
  "fire/fire-breath",
  "fire/flamethrower",
  "water/water-jet",
  "ice/frost-breath",
]);

const OVERHEAD_FX_IDS = new Set([
  "critters/bat",
  "critters/bird",
  "critters/butterfly",
  "shadow/eclipse",
  "explosions/firework-burst",
]);

class StudioStagePlayer {
  constructor(canvas, bgImgEl) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.bgImgEl = bgImgEl;
    this.acc = 0;
    this.wait = 0;
    this.clock = 0;
    this.weatherInst = null;
    this.weatherFrame = createFrame(320, 180);
    this.weatherOriginY = 170;
    this.setupStage();
  }

  get fxEntry() {
    return FX_LIST.find((f) => f.id === studioState.activeFxId) || FX_LIST[0];
  }

  get acted() {
    return !!this.fxEntry.mod.act && studioState.showCharacter;
  }

  setupStage() {
    setCharacterRig(studioState.rig);
    const fx = this.fxEntry;
    const acted = this.acted;
    const b = acted ? { ...actBounds(fx.mod) } : null;
    if (b) b.y1 = Math.min(b.y1, 20);
    const [w, h] = acted ? [b.x1 - b.x0, b.y1 - b.y0] : fx.meta.size;
    const [ox, oy] = acted ? [-b.x0, -b.y0] : fx.meta.origin;

    const aspect = 16 / 9;
    const pad = acted ? 1.15 : 1.22;
    this.W = Math.max(320, Math.ceil(Math.max(w * pad, h * pad * aspect)));
    this.H = Math.ceil(this.W / aspect);

    // Un único plano de suelo (groundY) compartido por la escena, el personaje, el efecto y el clima
    if (acted) {
      const below = Math.max(14, (b.y1 || 0) + 8);
      this.groundY = Math.min(this.H - 14, Math.max(oy + 4, this.H - below));
      this.x = Math.floor((this.W - w) / 2) + ox;
      this.y = this.groundY;
      this.charX = this.x;
      this.charY = this.groundY;
    } else if (fx.id.startsWith("weather/")) {
      this.groundY = this.H - 16;
      this.x = Math.floor(this.W / 2);
      this.y = oy >= 180 ? this.H : this.groundY;
      this.charX = Math.floor(this.W / 2);
      this.charY = this.groundY;
    } else if (fx.id.startsWith("transitions/")) {
      this.groundY = this.H - 16;
      this.x = Math.floor((this.W - w) / 2);
      this.y = Math.floor((this.H - h) / 2);
      this.charX = Math.floor(this.W / 2);
      this.charY = this.groundY;
    } else if ((fx.meta.bg || "dark") === "ground") {
      // Todos los efectos de suelo tienen su origen (0,0) exactamente sobre el piso
      const below = Math.min(26, Math.max(14, h - oy));
      this.groundY = Math.min(this.H - 12, Math.max(oy + 4, this.H - below));
      this.x = Math.floor((this.W - w) / 2) + ox;
      this.y = this.groundY;
      this.charX = this.x;
      this.charY = this.groundY;
    } else if (STREAM_FX_IDS.has(fx.id)) {
      // Alientos / chorros: el personaje pisa el suelo y el chorro sale a la altura de boca/manos (-23 px)
      this.groundY = this.H - 18;
      this.charX = studioState.flip ? Math.floor(this.W * 0.68) : Math.floor(this.W * 0.32);
      this.charY = this.groundY;
      this.x = this.charX + (studioState.flip ? -8 : 8);
      this.y = this.groundY - 23;
    } else if (fx.id.startsWith("ui/") || OVERHEAD_FX_IDS.has(fx.id)) {
      // Efectos aéreos o de interfaz: el personaje pisa el suelo y el efecto flota arriba
      this.groundY = this.H - 18;
      this.charX = Math.floor(this.W / 2);
      this.charY = this.groundY;
      this.x = Math.floor((this.W - w) / 2) + ox;
      this.y = Math.max(oy + 4, this.groundY - 46);
    } else {
      // Proyectiles, impactos en torso, escudos, mochilas propulsoras: personaje en el suelo, efecto en torso (-20 px)
      this.groundY = this.H - 18;
      this.charX = Math.floor(this.W / 2);
      this.charY = this.groundY;
      this.x = Math.floor((this.W - w) / 2) + ox;
      this.y = Math.max(oy + 2, this.groundY - 20);
    }

    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.frame = createFrame(this.W, this.H);
    this.img = this.ctx.createImageData(this.W, this.H);
    this.updateBackdrop();
    this.restart();
  }

  updateBackdrop() {
    const kind = studioState.sceneKind;
    this.bgBuf = kind === "none" ? null : backdrop(kind, this.W, this.H, this.groundY);
    if (this.bgImgEl) {
      if (studioState.chapterBgUrl) {
        this.bgImgEl.src = studioState.chapterBgUrl;
        this.bgImgEl.style.display = "block";
        this.bgImgEl.style.opacity = String(studioState.chapterBgAlpha);
      } else {
        this.bgImgEl.style.display = "none";
      }
    }
  }

  get fxOptions() {
    const opts = { seed: studioState.seed };
    if (studioState.useGemPaletteOnFx && studioState.rig.gemId && GEM_PALETTE_MAP[studioState.rig.gemId]) {
      opts.palette = GEM_PALETTE_MAP[studioState.rig.gemId];
    }
    return opts;
  }

  restart() {
    setCharacterRig(studioState.rig);
    const fx = this.fxEntry;
    const isDirectWeather = fx.id.startsWith("weather/");
    const opts = {
      x: isDirectWeather ? 160 : this.x,
      y: isDirectWeather ? (fx.meta.origin[1] || 170) : this.y,
      flip: studioState.flip,
      ...this.fxOptions,
    };
    this.inst = (this.acted ? createAct : createFx)(fx.mod, opts);

    if (
      !isDirectWeather &&
      studioState.weatherFxId &&
      studioState.weatherFxId !== "none" &&
      ALL_EFFECTS_MAP[studioState.weatherFxId]
    ) {
      const wMod = ALL_EFFECTS_MAP[studioState.weatherFxId];
      this.weatherOriginY = wMod.meta?.origin?.[1] || 170;
      this.weatherInst = createFx(wMod, { x: 160, y: this.weatherOriginY, seed: studioState.seed + 11 });
    } else {
      this.weatherInst = null;
    }
    this.acc = 0;
    this.wait = 0;
    this.render();
  }

  tick(dt) {
    const fx = this.fxEntry;
    const m = fx.meta;
    const step = 1 / m.fps;
    this.clock += dt;
    if (studioState.playing) {
      this.acc = Math.min(this.acc + dt * studioState.speed, 0.25);
    }
    let moved = false;
    while (this.acc >= step) {
      this.acc -= step;
      if (this.weatherInst) this.weatherInst.update(step);
      if (!m.loop && (this.acted ? this.inst.done() : this.inst.t >= m.duration)) {
        this.wait += step;
        if (this.wait > 0.5) this.restart();
      } else {
        this.inst.update(step);
      }
      moved = true;
    }
    if (moved) this.render();
  }

  /**
   * Proyecta un efecto climático nativo de 320x180 sobre el frame actual (W x H)
   * haciendo coincidir exactamente su línea de suelo (y = 170) con this.groundY.
   */
  blitWeatherInstance(inst, originY, targetFrame, layer) {
    const wf = clearFrame(this.weatherFrame);
    inst.draw(wf, layer);
    const W = targetFrame.w;
    const H = targetFrame.h;
    const dstC = targetFrame.color;
    const dstL = targetFrame.light;
    const srcC = wf.color;
    const srcL = wf.light;
    const gY = Math.max(1, this.groundY);
    const hasGroundPlane = originY < 180;

    for (let y = 0; y < H; y++) {
      let wy;
      if (hasGroundPlane) {
        if (y < gY) {
          wy = Math.min(originY - 1, Math.max(0, Math.floor((y * originY) / gY)));
        } else {
          wy = originY + (y - gY);
          if (wy >= 180) continue;
        }
      } else {
        wy = Math.min(179, Math.max(0, Math.floor((y * 180) / H)));
      }
      const wRow = wy * 320;
      const dRow = y * W;
      for (let x = 0; x < W; x++) {
        const wx = Math.min(319, Math.floor((x * 320) / W));
        const sc = srcC[wRow + wx];
        const sl = srcL[wRow + wx] & 0xffffff;
        const di = dRow + x;
        if (sc) {
          const sa = sc >>> 24;
          if (sa === 255 || !dstC[di]) {
            dstC[di] = sc;
          } else if (sa > 0) {
            const dc = dstC[di];
            const k = sa / 255;
            const ik = 1 - k;
            const r = Math.round((sc & 255) * k + (dc & 255) * ik);
            const g = Math.round(((sc >>> 8) & 255) * k + ((dc >>> 8) & 255) * ik);
            const b = Math.round(((sc >>> 16) & 255) * k + ((dc >>> 16) & 255) * ik);
            const a = Math.max(sa, dc >>> 24);
            dstC[di] = (a << 24) | (b << 16) | (g << 8) | r;
          }
        }
        if (sl) {
          const dl = dstL[di];
          const r = Math.min(255, (dl & 255) + (sl & 255));
          const g = Math.min(255, ((dl >>> 8) & 255) + ((sl >>> 8) & 255));
          const b = Math.min(255, ((dl >>> 16) & 255) + ((sl >>> 16) & 255));
          dstL[di] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
    }
  }

  drawStandaloneRig(f) {
    const breath = Math.floor(this.clock * 3) & 1;
    const wName = studioState.rig.weaponOverride || this.rigDefaultWeapon() || "sword";
    const q = {
      ...READY,
      weapon: wName === "none" ? undefined : wName,
      crouch: (READY.crouch ?? 3) + breath,
      fy: (READY.fy ?? -21) + breath,
      by: (READY.by ?? -21) + breath,
    };
    const r = posed(q);
    const BX = this.charX ?? this.x;
    const BY = this.charY ?? this.groundY;
    const mirror = studioState.flip;

    // Sombra de contacto sobre el suelo (groundY) para asentar los pies del personaje
    const hw = 10;
    for (let dy = 0; dy < 2; dy++) {
      const sy = BY + dy;
      if (sy < 0 || sy >= this.H) continue;
      for (let dx = -hw + dy * 2; dx <= hw - dy * 2; dx++) {
        const sx = BX + dx;
        if (sx < 0 || sx >= this.W) continue;
        const idx = sy * this.W + sx;
        f.color[idx] = (f.color[idx] & 0xffffff) | (Math.max(f.color[idx] >>> 24, 115) << 24);
      }
    }

    for (let i = 0; i < r.n; i++) {
      const px = mirror ? BX - r.xs[i] - 1 : BX + r.xs[i];
      const py = BY + r.ys[i];
      if (px >= 0 && py >= 0 && px < this.W && py < this.H) {
        f.color[py * this.W + px] = r.color[i];
      }
    }
  }

  rigDefaultWeapon() {
    const preset = PROTON_CHARACTER_PRESETS[studioState.charId];
    return preset?.defaultWeapon || "sword";
  }

  render() {
    const f = clearFrame(this.frame);
    const fx = this.fxEntry;
    const isDirectWeather = fx.id.startsWith("weather/");

    if (this.weatherInst) {
      this.blitWeatherInstance(this.weatherInst, this.weatherOriginY, f, "back");
    }

    if (this.acted) {
      this.inst.draw(f, { body: studioState.showCharacter, target: studioState.showTarget });
    } else if (isDirectWeather) {
      const origY = fx.meta.origin[1] || 170;
      this.blitWeatherInstance(this.inst, origY, f, "back");
      if (studioState.showCharacter) {
        this.drawStandaloneRig(f);
      }
      this.blitWeatherInstance(this.inst, origY, f, "front");
    } else {
      this.inst.draw(f, "back");
      if (studioState.showCharacter) {
        this.drawStandaloneRig(f);
      }
      this.inst.draw(f, "front");
    }

    if (this.weatherInst) {
      this.blitWeatherInstance(this.weatherInst, this.weatherOriginY, f, "front");
    }

    // Si hay ilustración de capítulo activa, dejamos transparente el cielo procedural para que se vea la ilustración,
    // pero conservamos la franja del suelo (y >= groundY) para que el personaje pise tierra firme.
    let bgToUse = this.bgBuf;
    if (studioState.chapterBgUrl) {
      if (studioState.sceneKind === "none" || !this.bgBuf) {
        bgToUse = null;
      } else {
        // Copiar el suelo (y >= groundY) al frame si aún está vacío para dar base firme sobre la ilustración
        for (let y = this.groundY; y < this.H; y++) {
          const row = y * this.W;
          for (let x = 0; x < this.W; x++) {
            const idx = row + x;
            if (!f.color[idx]) {
              f.color[idx] = this.bgBuf[idx];
            }
          }
        }
        bgToUse = null;
      }
    }

    composite(f, this.img.data, bgToUse);

    const [sx, sy] = this.acted && this.inst.shake ? this.inst.shake : [0, 0];
    this.ctx.clearRect(0, 0, this.W, this.H);
    this.ctx.putImageData(this.img, sx, sy);
  }
}

// ---- 7. Generación de Sprite Sheet (.sheet.png) y Metadatos (.sheet.json / .proton.json) ----
function generateSpriteSheetBundle(stagePlayer) {
  setCharacterRig(studioState.rig);
  const fx = stagePlayer.fxEntry;
  const m = fx.meta;
  const acted = stagePlayer.acted;
  const b = acted ? { ...actBounds(fx.mod) } : null;
  if (b) b.y1 = Math.min(b.y1, 22);

  let w = acted ? b.x1 - b.x0 : m.size[0];
  let h = acted ? b.y1 - b.y0 : m.size[1];
  let ox = acted ? -b.x0 : m.origin[0];
  let oy = acted ? -b.y0 : m.origin[1];
  const charDx = !acted ? (stagePlayer.charX ?? stagePlayer.x) - stagePlayer.x : 0;
  const charDy = !acted ? (stagePlayer.charY ?? stagePlayer.y) - stagePlayer.y : 0;
  if (!acted && studioState.showCharacter) {
    const x0 = Math.min(-ox, charDx - 16);
    const x1 = Math.max(w - ox, charDx + 16);
    const y0 = Math.min(-oy, charDy - 42);
    const y1 = Math.max(h - oy, charDy + 4);
    w = x1 - x0;
    h = y1 - y0;
    ox = -x0;
    oy = -y0;
  }

  const totalSec = acted && fx.mod.act?.poses
    ? Math.max(m.duration, fx.mod.act.poses[fx.mod.act.poses.length - 1][0]) - Math.min(0, fx.mod.act.poses[0][0])
    : m.duration;

  const n = Math.max(1, Math.min(64, Math.round(totalSec * m.fps) + (m.loop ? 0 : 1)));
  const cols = Math.min(n, Math.max(1, Math.ceil(Math.sqrt((n * h) / w))));
  const rows = Math.ceil(n / cols);

  const sheetCanvas = document.createElement("canvas");
  sheetCanvas.width = cols * w;
  sheetCanvas.height = rows * h;
  const sCtx = sheetCanvas.getContext("2d");

  const frame = createFrame(w, h);
  const img = sCtx.createImageData(w, h);
  const opts = { x: ox, y: oy, flip: studioState.flip, ...stagePlayer.fxOptions };
  const inst = (acted ? createAct : createFx)(fx.mod, opts);

  const framesMeta = {};
  const stepMs = Math.round(1000 / m.fps);

  for (let i = 0; i < n; i++) {
    if (i > 0) inst.update(1 / m.fps);
    clearFrame(frame);
    if (acted) {
      inst.draw(frame, { body: studioState.showCharacter, target: studioState.showTarget });
    } else {
      inst.draw(frame, "back");
      if (studioState.showCharacter) {
        const wName = studioState.rig.weaponOverride || stagePlayer.rigDefaultWeapon() || "sword";
        const q = { ...READY, weapon: wName === "none" ? undefined : wName };
        const r = posed(q);
        const cx = ox + charDx;
        const cy = oy + charDy;
        for (let p = 0; p < r.n; p++) {
          const px = studioState.flip ? cx - r.xs[p] - 1 : cx + r.xs[p];
          const py = cy + r.ys[p];
          if (px >= 0 && py >= 0 && px < w && py < h) frame.color[py * w + px] = r.color[p];
        }
      }
      inst.draw(frame, "front");
    }
    composite(frame, img.data, null);
    const gx = (i % cols) * w;
    const gy = Math.floor(i / cols) * h;
    sCtx.putImageData(img, gx, gy);

    framesMeta[`${studioState.charId}_${fx.id.replace("/", "_")}_${i}`] = {
      frame: { x: gx, y: gy, w, h },
      rotated: false,
      trimmed: false,
      spriteSourceSize: { x: 0, y: 0, w, h },
      sourceSize: { w, h },
      duration: stepMs,
    };
  }

  const dataUrl = sheetCanvas.toDataURL("image/png");
  const sheetJson = {
    frames: framesMeta,
    meta: {
      app: "Proyecto Protón PixelFX Studio",
      version: "1.0.0",
      image: `${studioState.charId}_${fx.id.replace("/", "-")}.sheet.png`,
      format: "RGBA8888",
      size: { w: cols * w, h: rows * h },
      scale: "1",
      pixelfx: {
        id: fx.id,
        characterId: studioState.charId,
        fps: m.fps,
        loop: !!m.loop,
        frames: n,
        columns: cols,
        rows,
        frameSize: [w, h],
        pivot: [ox, oy],
        act: actTiming(fx.mod),
      },
    },
  };

  studioState.lastSheetDataUrl = dataUrl;
  studioState.lastSheetJson = sheetJson;
  return { dataUrl, sheetJson, n, w, h, cols, rows, fps: m.fps, loop: m.loop };
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function downloadJsonObj(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// ---- 8. Construcción de la Interfaz Completa del Estudio ----
export function initProtonGameStudio() {
  const container = document.getElementById("proton-studio-root");
  if (!container) return;

  const db = window.PROTON_DATA || { personajes: [], gemas: [], capitulos: [] };
  const personajes = db.personajes || [];
  const gemas = db.gemas || [];

  container.innerHTML = `
    <div class="studio-shell">
      <!-- COLUMNA IZQUIERDA: SELECTOR DE PERSONAJE DEL CANON + DATOS DEL LIBRO -->
      <aside class="studio-panel studio-left">
        <div class="studio-panel-header">
          <h3>🧬 1. Personaje del Canon (20)</h3>
          <span class="studio-badge">0 Tokens</span>
        </div>

        <div id="studio-char-roster" class="studio-char-roster" role="listbox" aria-label="Personajes del libro Proyecto Protón"></div>

        <!-- Ficha resumida del personaje activo desde proton_data.js -->
        <div id="studio-char-canon-card" class="studio-canon-card"></div>

        <!-- Personalizador de Colores, Complexión y Arma -->
        <div class="studio-subbox">
          <h4>🎨 Apariencia y Esqueleto 3D (rig.js)</h4>
          <div class="studio-form-grid">
            <label class="studio-field">
              <span>Complexión</span>
              <select id="st-build-select" class="studio-select">
                <option value="hero">Heroica Estándar</option>
                <option value="agile">Ágil / Estilizada (Nawa/Shilea)</option>
                <option value="colossus">Coloso (Tamanco / Gólem)</option>
                <option value="feline">Jaguar / Felino (Loky)</option>
                <option value="droid">Androide (Droid)</option>
              </select>
            </label>
            <label class="studio-field">
              <span>Tocado / Cabeza</span>
              <select id="st-headgear-select" class="studio-select">
                <option value="none">Estándar</option>
                <option value="goggles">Gafas en la Frente + Rubio Despeinado (Cisco)</option>
                <option value="long_hair">Cabello Largo (Nawa/Shilea)</option>
                <option value="crown">Corona / Penacho Diquís</option>
                <option value="jaguar_ears">Orejas y Cola de Jaguar</option>
                <option value="nemes">Nemes Egipcio (Ramsés II)</option>
                <option value="morion">Casco Español (Morrión)</option>
              </select>
            </label>
          </div>

          <label class="studio-field" style="margin-top:0.55rem;">
            <span>⚔️ Arma o Reliquia Equipada</span>
            <select id="st-weapon-select" class="studio-select"></select>
          </label>

          <label class="studio-field" style="margin-top:0.55rem;">
            <span>💎 Gema del Arcoíris Vinculada</span>
            <select id="st-gem-select" class="studio-select"></select>
          </label>

          <label class="studio-checkbox-row">
            <input type="checkbox" id="st-use-gem-palette" />
            <span>Teñir partículas del ataque con el color de la Gema activa</span>
          </label>

          <div class="studio-color-grid">
            <label class="studio-color-item"><span>Cabello/Casco</span><input type="color" id="col-hair" /></label>
            <label class="studio-color-item"><span>Piel/Chasis</span><input type="color" id="col-skin" /></label>
            <label class="studio-color-item"><span>Torso/Pecho</span><input type="color" id="col-torso" /></label>
            <label class="studio-color-item"><span>Mangas/Brazos</span><input type="color" id="col-sleeve" /></label>
            <label class="studio-color-item"><span>Cinturón</span><input type="color" id="col-belt" /></label>
            <label class="studio-color-item"><span>Piernas</span><input type="color" id="col-legs" /></label>
            <label class="studio-color-item"><span>Botas</span><input type="color" id="col-boots" /></label>
            <label class="studio-color-item"><span>Brillo Gema</span><input type="color" id="col-gem" /></label>
          </div>

          <button type="button" id="btn-reset-canon-rig" class="toolbar-btn" style="width:100%;margin-top:0.6rem;justify-content:center;">
            ↺ Restaurar Colores y Arma del Canon
          </button>
        </div>
      </aside>

      <!-- COLUMNA CENTRAL: ESCENARIO EN VIVO + ESCENAS PROYECTO PROTÓN + EXPORTADOR -->
      <section class="studio-panel studio-center">
        <div class="studio-panel-header">
          <div>
            <h3 id="st-stage-title">🎬 Escenario en Vivo: Cisco — Despertar de las 8 Gemas</h3>
            <span id="st-stage-subtitle" class="studio-meta-text">proton/gem-awakening · 30 FPS · Esqueleto 3D + Luz Aditiva</span>
          </div>
          <div class="studio-stage-pills">
            <button type="button" id="st-btn-play" class="toolbar-btn active">⏸ Pausar</button>
            <button type="button" id="st-btn-replay" class="toolbar-btn">🔄 Repetir</button>
            <button type="button" id="st-btn-flip" class="toolbar-btn">↔️ Espejo</button>
            <button type="button" id="st-btn-seed" class="toolbar-btn">🎲 Semilla</button>
          </div>
        </div>

        <!-- Lienzo Principal con Soporte de Ilustración de Capítulo + PixelFX -->
        <div class="studio-stage-viewport" id="st-viewport">
          <img id="st-chapter-bg-img" class="studio-chapter-bg-img" alt="Escenario de capítulo de Proyecto Protón" style="display:none;" />
          <canvas id="st-main-canvas" aria-label="Vista previa en vivo del personaje y animación"></canvas>
        </div>

        <!-- Barra de Controles Rápidos de Escena y Actores -->
        <div class="studio-controls-bar">
          <div class="studio-toggles">
            <label class="studio-checkbox-inline">
              <input type="checkbox" id="st-toggle-char" checked />
              <span>🧍 Mostrar Personaje</span>
            </label>
            <label class="studio-checkbox-inline">
              <input type="checkbox" id="st-toggle-target" checked />
              <span>🎯 Mostrar Objetivo (Dummy)</span>
            </label>
          </div>
          <div class="studio-speed-group">
            <span>Velocidad:</span>
            <button type="button" class="toolbar-btn" data-st-speed="0.25">0.25×</button>
            <button type="button" class="toolbar-btn" data-st-speed="0.5">0.5×</button>
            <button type="button" class="toolbar-btn active" data-st-speed="1">1×</button>
          </div>
        </div>

        <!-- Opciones de Escenas de Fondo Alusivas a Proyecto Protón -->
        <div class="studio-subbox studio-scenes-box">
          <h4>🌄 2. Escenas de Fondo Alusivas a Proyecto Protón y Atmósfera</h4>
          <div class="studio-scene-grid">
            <label class="studio-field">
              <span>🎨 Escena Pixel Art Procedural (scene.js)</span>
              <select id="st-scene-select" class="studio-select"></select>
            </label>
            <label class="studio-field">
              <span>🖼️ Ilustración de Capítulo detrás del Lienzo</span>
              <select id="st-chapter-bg-select" class="studio-select"></select>
            </label>
            <label class="studio-field">
              <span>🌦️ Efecto Ambiental / Clima en Vivo</span>
              <select id="st-weather-select" class="studio-select"></select>
            </label>
          </div>
        </div>

        <!-- Movimientos Asignados al Personaje para el Juego -->
        <div class="studio-subbox">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;flex-wrap:wrap;">
            <h4>⚡ Kit de Movimientos del Personaje (Haz clic para probar)</h4>
            <button type="button" id="st-btn-add-move" class="toolbar-btn">➕ Añadir animación actual al Kit</button>
          </div>
          <div id="st-assigned-moves" class="studio-assigned-moves"></div>
        </div>

        <!-- Exportador de Archivos para el Videojuego (PNG + JSON) -->
        <div class="studio-subbox studio-export-box">
          <h4>📦 4. Exportar Archivos para el Videojuego Proyecto Protón (0 Tokens)</h4>
          <p class="studio-meta-text" style="margin-bottom:0.75rem;">
            Genera la hoja de sprites transparente (<code>.sheet.png</code>) con el personaje personalizado y su animación, el atlas compatible con Phaser/Godot/Unity/Aseprite (<code>.sheet.json</code>) y el paquete completo del personaje con sus estadísticas del libro (<code>.proton.json</code>).
          </p>
          <div class="studio-export-actions">
            <button type="button" id="st-btn-make-sheet" class="btn-primary">
              🖼️ Generar y Descargar Sprite Sheet (.PNG)
            </button>
            <button type="button" id="st-btn-dl-atlas" class="btn-secondary">
              📐 Descargar Atlas (.sheet.json)
            </button>
            <button type="button" id="st-btn-dl-proton" class="btn-secondary">
              🧬 Descargar Personaje Completo (.proton.json)
            </button>
          </div>

          <div id="st-sheet-preview-box" class="studio-sheet-preview" style="display:none;"></div>
        </div>
      </section>

      <!-- COLUMNA DERECHA: CATÁLOGO DE 249 ANIMACIONES, ATAQUES Y EFECTOS PIXELFX -->
      <aside class="studio-panel studio-right">
        <div class="studio-panel-header">
          <h3>🔥 3. Animaciones y Efectos (${FX_LIST.length})</h3>
        </div>

        <input
          type="search"
          id="st-fx-search"
          class="studio-search-input"
          placeholder="🔍 Buscar ataque, movimiento, fuego, rayo, gema..."
          autocomplete="off"
        />

        <div id="st-fx-cats" class="studio-cat-chips"></div>

        <div id="st-fx-list" class="studio-fx-list" role="listbox" aria-label="Lista de animaciones y efectos"></div>
      </aside>
    </div>
  `;

  // Poblar selectores estáticos
  const weaponSel = document.getElementById("st-weapon-select");
  PROTON_WEAPONS_LIST.forEach((w) => {
    const opt = document.createElement("option");
    opt.value = w.value;
    opt.textContent = w.label;
    weaponSel.appendChild(opt);
  });

  const gemSel = document.getElementById("st-gem-select");
  gemas.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = `💎 ${g.nombre} (${g.color})`;
    gemSel.appendChild(opt);
  });

  const sceneSel = document.getElementById("st-scene-select");
  PROTON_SCENES.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.label;
    sceneSel.appendChild(opt);
  });

  const chapBgSel = document.getElementById("st-chapter-bg-select");
  PROTON_CHAPTER_BACKGROUNDS.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.value;
    opt.textContent = c.label;
    chapBgSel.appendChild(opt);
  });

  const weatherSel = document.getElementById("st-weather-select");
  PROTON_WEATHER_OPTIONS.forEach((w) => {
    const opt = document.createElement("option");
    opt.value = w.value;
    opt.textContent = w.label;
    weatherSel.appendChild(opt);
  });

  // Inicializar el StagePlayer
  const mainCanvas = document.getElementById("st-main-canvas");
  const bgImgEl = document.getElementById("st-chapter-bg-img");
  const stagePlayer = new StudioStagePlayer(mainCanvas, bgImgEl);

  // Renderizar lista de los 20 personajes
  const rosterEl = document.getElementById("studio-char-roster");
  function renderCharacterRoster() {
    rosterEl.innerHTML = "";
    personajes.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `studio-char-btn ${p.id === studioState.charId ? "active" : ""}`;
      const imgPath = `assets/img/personajes/${p.id}.jpg`;
      btn.innerHTML = `
        <img src="${imgPath}" alt="${p.nombre}" class="studio-char-thumb" loading="lazy" />
        <div class="studio-char-info">
          <strong>${p.nombre}</strong>
          <span>${p.faccion || p.categoria}</span>
        </div>
      `;
      btn.addEventListener("click", () => selectCharacter(p.id));
      rosterEl.appendChild(btn);
    });
  }

  function renderCanonCard() {
    const p = personajes.find((x) => x.id === studioState.charId);
    const box = document.getElementById("studio-char-canon-card");
    if (!p || !box) return;
    const st = p.atributos?.estadisticas || {};
    const hp = p.atributos?.puntos_salud || 80;
    const skills = (p.atributos?.habilidades_especiales || []).slice(0, 3).join(" · ");
    box.innerHTML = `
      <div class="canon-card-top">
        <img src="assets/img/personajes/${p.id}.jpg" alt="${p.nombre}" class="canon-card-avatar" />
        <div>
          <div class="canon-card-name">${p.nombre}</div>
          <div class="canon-card-role">${p.descripcion?.alias || p.categoria} · HP ${hp}</div>
          <div class="canon-card-skills">✨ ${skills || "Héroe del Canon"}</div>
        </div>
      </div>
      <div class="canon-stats-bars">
        <div><span>FUE</span><b>${st.fuerza ?? 5}</b></div>
        <div><span>INT</span><b>${st.inteligencia ?? 5}</b></div>
        <div><span>AGI</span><b>${st.agilidad ?? 5}</b></div>
        <div><span>RES</span><b>${st.resistencia ?? 5}</b></div>
        <div><span>ESP</span><b>${st.espiritu ?? 5}</b></div>
      </div>
    `;
  }

  function syncRigInputsFromState() {
    const r = studioState.rig;
    document.getElementById("st-build-select").value = r.build || "hero";
    document.getElementById("st-headgear-select").value = r.headgear || "none";
    weaponSel.value = r.weaponOverride ?? "";
    gemSel.value = r.gemId || "gema_azul";
    sceneSel.value = studioState.sceneKind;
    chapBgSel.value = studioState.chapterBgUrl;
    weatherSel.value = studioState.weatherFxId;
    document.getElementById("st-use-gem-palette").checked = studioState.useGemPaletteOnFx;

    document.getElementById("col-hair").value = r.hairColor || "#1e1b2e";
    document.getElementById("col-skin").value = r.skinColor || "#e2a982";
    document.getElementById("col-torso").value = r.torsoColor || "#1d4ed8";
    document.getElementById("col-sleeve").value = r.sleeveColor || "#1e3a8a";
    document.getElementById("col-belt").value = r.beltColor || "#78350f";
    document.getElementById("col-legs").value = r.legsColor || "#1e293b";
    document.getElementById("col-boots").value = r.bootsColor || "#451a03";
    document.getElementById("col-gem").value = r.gemColor || "#38bdf8";
  }

  function renderAssignedMoves() {
    const wrap = document.getElementById("st-assigned-moves");
    if (!wrap) return;
    wrap.innerHTML = "";
    studioState.assignedMoves.forEach((fxId) => {
      const fx = FX_LIST.find((f) => f.id === fxId);
      if (!fx) return;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `toolbar-btn ${studioState.activeFxId === fxId ? "active" : ""}`;
      chip.textContent = `▶ ${fx.name}`;
      chip.addEventListener("click", () => selectEffect(fxId));
      wrap.appendChild(chip);
    });
  }

  function updateStageHeader() {
    const p = personajes.find((x) => x.id === studioState.charId);
    const fx = stagePlayer.fxEntry;
    const m = fx.meta;
    const frames = Math.round(m.duration * m.fps) + (m.loop ? 0 : 1);
    document.getElementById("st-stage-title").textContent = `🎬 ${p ? p.nombre : studioState.charId} — ${fx.name}`;
    document.getElementById("st-stage-subtitle").textContent =
      `${fx.id} · ${m.loop ? "Loop continuo" : `${m.duration.toFixed(2)}s`} · ${frames} frames a ${m.fps} FPS · Escena: ${studioState.sceneKind}`;
  }

  function selectCharacter(charId) {
    studioState.charId = charId;
    const preset = PROTON_CHARACTER_PRESETS[charId] || PROTON_CHARACTER_PRESETS.cisco;
    studioState.rig = {
      ...preset,
      weaponOverride: preset.defaultWeapon || "sword",
    };
    studioState.sceneKind = preset.defaultScene || "proton_diquis";
    studioState.weatherFxId = preset.defaultWeather || "none";
    studioState.assignedMoves = [...(preset.signatureMoves || ["proton/idle-guard", "moves/dash-strike"])];
    if (studioState.assignedMoves.length && !studioState.assignedMoves.includes(studioState.activeFxId)) {
      studioState.activeFxId = studioState.assignedMoves[0];
    }

    renderCharacterRoster();
    renderCanonCard();
    syncRigInputsFromState();
    renderAssignedMoves();
    renderFxList();
    updateStageHeader();
    stagePlayer.setupStage();
  }

  function selectEffect(fxId) {
    studioState.activeFxId = fxId;
    renderAssignedMoves();
    renderFxList();
    updateStageHeader();
    stagePlayer.setupStage();
  }

  // Categorías y Lista de los 249 Efectos
  const catsEl = document.getElementById("st-fx-cats");
  const fxListEl = document.getElementById("st-fx-list");

  function renderCatChips() {
    catsEl.innerHTML = "";
    const makeChip = (id, label, count) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `studio-cat-chip ${studioState.filterCat === id ? "active" : ""}`;
      b.textContent = `${label} (${count})`;
      b.addEventListener("click", () => {
        studioState.filterCat = id;
        renderCatChips();
        renderFxList();
      });
      catsEl.appendChild(b);
    };
    makeChip("all", "Todas", FX_LIST.length);
    ALL_CATEGORIES.forEach((c) => {
      const count = FX_LIST.filter((f) => f.cat === c.id).length;
      if (count > 0) makeChip(c.id, c.name, count);
    });
  }

  function renderFxList() {
    fxListEl.innerHTML = "";
    const q = studioState.searchQuery.trim().toLowerCase();
    const filtered = FX_LIST.filter((fx) => {
      const catOk = studioState.filterCat === "all" || fx.cat === studioState.filterCat;
      if (!catOk) return false;
      if (!q) return true;
      const hay = `${fx.id} ${fx.name} ${fx.meta.desc || ""} ${(fx.meta.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });

    filtered.forEach((fx) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = `studio-fx-item ${fx.id === studioState.activeFxId ? "active" : ""}`;
      const hasAct = !!fx.mod.act;
      item.innerHTML = `
        <div class="studio-fx-item-top">
          <strong>${fx.name}</strong>
          <span class="studio-fx-tag">${hasAct ? "🧍 Actuado" : fx.cat}</span>
        </div>
        <div class="studio-fx-item-sub">
          <code>${fx.id}</code> · ${fx.meta.loop ? "loop" : `${+fx.meta.duration.toFixed(2)}s`}
        </div>
      `;
      item.addEventListener("click", () => selectEffect(fx.id));
      fxListEl.appendChild(item);
    });
  }

  // Eventos de formulario de apariencia y escena
  const onRigEdit = () => {
    studioState.rig.build = document.getElementById("st-build-select").value;
    studioState.rig.headgear = document.getElementById("st-headgear-select").value;
    studioState.rig.weaponOverride = weaponSel.value;
    studioState.rig.hairColor = document.getElementById("col-hair").value;
    studioState.rig.skinColor = document.getElementById("col-skin").value;
    studioState.rig.torsoColor = document.getElementById("col-torso").value;
    studioState.rig.sleeveColor = document.getElementById("col-sleeve").value;
    studioState.rig.beltColor = document.getElementById("col-belt").value;
    studioState.rig.legsColor = document.getElementById("col-legs").value;
    studioState.rig.bootsColor = document.getElementById("col-boots").value;
    studioState.rig.gemColor = document.getElementById("col-gem").value;
    stagePlayer.setupStage();
  };

  ["st-build-select", "st-headgear-select", "st-weapon-select", "col-hair", "col-skin", "col-torso", "col-sleeve", "col-belt", "col-legs", "col-boots", "col-gem"].forEach((id) => {
    document.getElementById(id).addEventListener("input", onRigEdit);
  });

  gemSel.addEventListener("change", () => {
    studioState.rig.gemId = gemSel.value;
    const gemObj = gemas.find((g) => g.id === gemSel.value);
    if (gemObj && gemObj.hex) {
      studioState.rig.gemColor = gemObj.hex;
      document.getElementById("col-gem").value = gemObj.hex;
    }
    stagePlayer.setupStage();
  });

  document.getElementById("st-use-gem-palette").addEventListener("change", (e) => {
    studioState.useGemPaletteOnFx = e.target.checked;
    stagePlayer.restart();
  });

  document.getElementById("btn-reset-canon-rig").addEventListener("click", () => {
    selectCharacter(studioState.charId);
  });

  sceneSel.addEventListener("change", () => {
    studioState.sceneKind = sceneSel.value;
    updateStageHeader();
    stagePlayer.updateBackdrop();
    stagePlayer.render();
  });

  chapBgSel.addEventListener("change", () => {
    studioState.chapterBgUrl = chapBgSel.value;
    stagePlayer.updateBackdrop();
    stagePlayer.render();
  });

  weatherSel.addEventListener("change", () => {
    studioState.weatherFxId = weatherSel.value;
    stagePlayer.restart();
  });

  // Controles de reproducción
  document.getElementById("st-btn-play").addEventListener("click", (e) => {
    studioState.playing = !studioState.playing;
    e.currentTarget.textContent = studioState.playing ? "⏸ Pausar" : "▶ Reproducir";
    e.currentTarget.classList.toggle("active", studioState.playing);
  });

  document.getElementById("st-btn-replay").addEventListener("click", () => {
    stagePlayer.restart();
  });

  document.getElementById("st-btn-flip").addEventListener("click", (e) => {
    studioState.flip = !studioState.flip;
    e.currentTarget.classList.toggle("active", studioState.flip);
    stagePlayer.restart();
  });

  document.getElementById("st-btn-seed").addEventListener("click", () => {
    studioState.seed = 1 + Math.floor(Math.random() * 9999);
    stagePlayer.restart();
  });

  document.getElementById("st-toggle-char").addEventListener("change", (e) => {
    studioState.showCharacter = e.target.checked;
    stagePlayer.setupStage();
  });

  document.getElementById("st-toggle-target").addEventListener("change", (e) => {
    studioState.showTarget = e.target.checked;
    stagePlayer.render();
  });

  document.querySelectorAll("[data-st-speed]").forEach((btn) => {
    btn.addEventListener("click", () => {
      studioState.speed = parseFloat(btn.dataset.stSpeed);
      document.querySelectorAll("[data-st-speed]").forEach((b) => b.classList.toggle("active", b === btn));
    });
  });

  document.getElementById("st-fx-search").addEventListener("input", (e) => {
    studioState.searchQuery = e.target.value;
    renderFxList();
  });

  document.getElementById("st-btn-add-move").addEventListener("click", () => {
    if (!studioState.assignedMoves.includes(studioState.activeFxId)) {
      studioState.assignedMoves.push(studioState.activeFxId);
      renderAssignedMoves();
    }
  });

  // Exportación de Sprite Sheet (.png), Atlas (.sheet.json) y Paquete (.proton.json)
  const previewBox = document.getElementById("st-sheet-preview-box");

  document.getElementById("st-btn-make-sheet").addEventListener("click", () => {
    const res = generateSpriteSheetBundle(stagePlayer);
    const filename = `${studioState.charId}_${studioState.activeFxId.replace("/", "-")}.sheet.png`;
    previewBox.style.display = "block";
    previewBox.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.5rem;">
        <strong style="color:var(--accent-gold);">✅ Sprite Sheet Generado (${res.n} frames de ${res.w}×${res.h} px · ${res.cols}×${res.rows} · ${res.fps} FPS)</strong>
        <span style="font-size:0.78rem;color:var(--text-muted);">Fondo transparente listo para motor 2D</span>
      </div>
      <div class="studio-sheet-img-wrap">
        <img src="${res.dataUrl}" alt="Sprite sheet de ${studioState.charId}" />
      </div>
    `;
    downloadDataUrl(res.dataUrl, filename);
  });

  document.getElementById("st-btn-dl-atlas").addEventListener("click", () => {
    if (!studioState.lastSheetJson) {
      generateSpriteSheetBundle(stagePlayer);
    }
    const filename = `${studioState.charId}_${studioState.activeFxId.replace("/", "-")}.sheet.json`;
    downloadJsonObj(studioState.lastSheetJson, filename);
  });

  document.getElementById("st-btn-dl-proton").addEventListener("click", () => {
    const canonChar = personajes.find((p) => p.id === studioState.charId) || {};
    const gemObj = gemas.find((g) => g.id === studioState.rig.gemId) || null;
    const movesTiming = {};
    studioState.assignedMoves.forEach((mId) => {
      const fx = FX_LIST.find((f) => f.id === mId);
      if (fx) {
        movesTiming[mId] = {
          name: fx.name,
          fps: fx.meta.fps,
          duration: fx.meta.duration,
          loop: !!fx.meta.loop,
          size: fx.meta.size,
          origin: fx.meta.origin,
          act: actTiming(fx.mod),
        };
      }
    });

    const protonBundle = {
      schema: "proyecto-proton-character-bundle/v1",
      exportedAt: new Date().toISOString(),
      character: {
        id: studioState.charId,
        nombre: canonChar.nombre || studioState.charId,
        categoria: canonChar.categoria || "Personaje",
        faccion: canonChar.faccion || "",
        retrato: `assets/img/personajes/${studioState.charId}.jpg`,
        descripcion: canonChar.descripcion || {},
        estadisticas_rpg: canonChar.atributos?.estadisticas || {},
        puntos_salud: canonChar.atributos?.puntos_salud || 80,
        habilidades_especiales: canonChar.atributos?.habilidades_especiales || [],
        poderes: canonChar.atributos?.poderes || [],
      },
      activeGem: gemObj,
      pixelfxRigProfile: { ...studioState.rig },
      stageConfig: {
        sceneKind: studioState.sceneKind,
        chapterBgUrl: studioState.chapterBgUrl,
        weatherFxId: studioState.weatherFxId,
        useGemPaletteOnFx: studioState.useGemPaletteOnFx,
      },
      assignedMoves: studioState.assignedMoves,
      movesMetadata: movesTiming,
    };

    downloadJsonObj(protonBundle, `${studioState.charId}.proton.json`);
  });

  // Inicializar vista por defecto con Cisco
  renderCatChips();
  selectCharacter("cisco");

  // Exponer API global para conectar la Biblia de Personajes con el Estudio
  window.ProtonStudio = {
    selectCharacter,
    selectEffect,
    stagePlayer,
  };

  // Loop de animación a 60 FPS (solo procesa cuando el estudio es visible)
  let lastNow = performance.now();
  function loop(now) {
    const dt = Math.min(0.1, (now - lastNow) / 1000);
    lastNow = now;
    const studioSection = document.getElementById("view-studio");
    if (!studioSection || studioSection.classList.contains("active")) {
      stagePlayer.tick(dt);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProtonGameStudio);
} else {
  initProtonGameStudio();
}
