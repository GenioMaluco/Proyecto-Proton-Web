// Preview backdrops: what the tools and the gallery draw behind an effect. Sprite sheets stay transparent.

import { hex, mix } from "./color.js";
import { rand } from "./math.js";

const SKY = hex("#15131d"), SKY_TOP = hex("#0d0b14"), SKY_LOW = hex("#221d33");
const FLOOR_EDGE = hex("#4a4263"), FLOOR = hex("#2b2639"), FLOOR_DARK = hex("#211d2d"), MORTAR = hex("#1a1724");
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export const BACKDROPS = [
  "proton_diquis",
  "proton_cascada",
  "proton_volcan",
  "proton_ceibo",
  "proton_playa",
  "proton_hospital",
  "proton_alfa",
  "proton_lab",
  "dark",
  "ground",
  "sky",
  "light",
  "black",
];

function drawStoneSphere(out, w, h, cx, cy, r, runeColor) {
  const sL = hex("#64748b"), sM = hex("#334155"), sD = hex("#1e293b"), rune = hex(runeColor);
  for (let dy = -r; dy <= r; dy++) {
    const py = cy + dy;
    if (py < 0 || py >= h) continue;
    for (let dx = -r; dx <= r; dx++) {
      const px = cx + dx;
      if (px < 0 || px >= w) continue;
      const d2 = dx * dx + dy * dy;
      if (d2 > r * r) continue;
      const dist = Math.sqrt(d2) / r;
      const isGlyph =
        (Math.abs(dy) <= 1 && Math.abs(dx) < r * 0.72) ||
        (Math.abs(dx) <= 1 && Math.abs(dy) < r * 0.72) ||
        (dist > 0.52 && dist < 0.62 && ((dx + dy) & 3) === 0);
      let c = dx + dy < -r * 0.25 ? sL : dx + dy > r * 0.35 ? sD : sM;
      if (isGlyph) c = mix(c, rune, 0.85);
      out[py * w + px] = c;
    }
  }
}

/**
 * A backdrop as a Uint32Array of w x h colors.
 */
export function backdrop(kind, w, h, groundY = h) {
  const out = new Uint32Array(w * h);
  if (kind === "light") return out.fill(hex("#ebe8f0"));
  if (kind === "black") return out.fill(hex("#000000"));

  // ---- PROYECTO PROTÓN PROCEDURAL PIXEL SCENES ----
  if (kind === "proton_diquis") {
    const top = hex("#041318"), mid = hex("#092c2a"), low = hex("#124538");
    const moss = hex("#166534"), soil = hex("#1c1917"), soilD = hex("#0c0a09");
    for (let y = 0; y < h; y++) {
      const t = y / Math.max(1, groundY);
      for (let x = 0; x < w; x++) {
        if (y < groundY) {
          let c = t < 0.5 ? mix(top, mid, t * 2) : mix(mid, low, (t - 0.5) * 2);
          // Distant jungle canopy silhouettes
          const hill1 = groundY - 26 - Math.round(Math.sin(x * 0.045) * 9 + Math.cos(x * 0.11) * 4);
          const hill2 = groundY - 14 - Math.round(Math.sin(x * 0.08 + 1.4) * 6);
          if (y > hill1) c = hex("#07221f");
          if (y > hill2) c = hex("#051816");
          // Glowing jungle spores
          const r = rand(x, y, 41);
          if (r > 0.996) c = hex("#38bdf8");
          else if (r > 0.993) c = hex("#fbbf24");
          out[y * w + x] = c;
        } else {
          const gy = y - groundY;
          out[y * w + x] = gy === 0 ? hex("#22c55e") : gy < 3 ? moss : ((x + gy) & 7) === 0 ? soilD : soil;
        }
      }
    }
    drawStoneSphere(out, w, h, Math.floor(w * 0.22), groundY - 12, 14, "#38bdf8");
    drawStoneSphere(out, w, h, Math.floor(w * 0.82), groundY - 8, 9, "#f59e0b");
    return out;
  }

  if (kind === "proton_cascada") {
    const skyT = hex("#081c2e"), skyB = hex("#164e63"), cliff = hex("#1e293b"), cliffD = hex("#0f172a");
    const waterA = hex("#38bdf8"), waterB = hex("#bae6fd"), floor = hex("#134e4a");
    const fallX0 = Math.floor(w * 0.38), fallX1 = Math.floor(w * 0.62);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y < groundY) {
          let c = mix(skyT, skyB, y / Math.max(1, groundY));
          if (x < fallX0 || x > fallX1) {
            c = ((x + y * 2) % 11 === 0) ? cliffD : cliff;
          } else {
            const streak = ((y + x * 3) % 7 === 0) || rand(x, y, 19) > 0.85;
            c = streak ? waterB : waterA;
            if (y > groundY - 10 && rand(x, y, 91) > 0.45) c = hex("#e0f2fe");
          }
          out[y * w + x] = c;
        } else {
          const gy = y - groundY;
          out[y * w + x] = gy === 0 ? waterB : gy < 4 ? waterA : floor;
        }
      }
    }
    return out;
  }

  if (kind === "proton_volcan") {
    const skyT = hex("#180707"), skyB = hex("#450a0a"), rock = hex("#1c1917"), lava = hex("#f97316"), lavaHi = hex("#fde047");
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y < groundY) {
          let c = mix(skyT, skyB, y / Math.max(1, groundY));
          // Volcano cone silhouette in center
          const dx = Math.abs(x - w * 0.5);
          const coneY = groundY - Math.max(0, Math.floor(46 - dx * 0.55));
          if (y >= coneY) {
            c = rock;
            if (dx < 8 && (y - coneY) < 6) c = lavaHi;
            else if (Math.abs(dx - (y - coneY) * 0.35) < 1.8) c = lava;
          } else if (rand(x, y, 63) > 0.994) {
            c = lava;
          }
          out[y * w + x] = c;
        } else {
          const gy = y - groundY;
          out[y * w + x] = gy === 0 ? lava : ((x + gy * 3) % 13 === 0) ? lavaHi : rock;
        }
      }
    }
    return out;
  }

  if (kind === "proton_ceibo") {
    const bgT = hex("#021a14"), bgB = hex("#064e3b"), bark = hex("#291d12"), barkD = hex("#1c130b");
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y < groundY) {
          let c = mix(bgT, bgB, y / Math.max(1, groundY));
          const dx = Math.abs(x - w * 0.5);
          const trunkW = 22 + Math.max(0, (y - (groundY - 40)) * 0.55);
          if (dx < trunkW) {
            c = ((x + Math.floor(y / 3)) % 5 === 0) ? barkD : bark;
            // Arco del portal místico en la base del Gran Ceibo (al ras de groundY)
            const dyPortal = groundY - y;
            if (dyPortal > 0 && dyPortal <= 26) {
              const archHalfW = Math.sqrt(Math.max(0, 1 - Math.pow(dyPortal / 26, 2))) * 7.5;
              if (dx <= archHalfW) {
                c = dx > archHalfW - 1.4 ? hex("#059669") : hex("#042f2e");
              }
            }
          } else if (y < groundY * 0.36) {
            c = hex("#063729");
          }
          if (rand(x, y, 105) > 0.994) c = hex("#6ee7b7");
          out[y * w + x] = c;
        } else {
          const gy = y - groundY;
          out[y * w + x] = gy === 0 ? hex("#10b981") : gy < 3 ? hex("#065f46") : barkD;
        }
      }
    }
    return out;
  }

  if (kind === "proton_playa") {
    const skyT = hex("#1a081e"), skyB = hex("#4c0519"), sea = hex("#1e1b4b"), sand = hex("#27201c");
    const moonX = Math.floor(w * 0.72), moonY = Math.floor(groundY * 0.34), moonR = 16;
    const horizon = Math.floor(groundY * 0.74);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y < horizon) {
          let c = mix(skyT, skyB, y / Math.max(1, horizon));
          const d2 = (x - moonX) * (x - moonX) + (y - moonY) * (y - moonY);
          if (d2 <= moonR * moonR) c = d2 < moonR * moonR * 0.6 ? hex("#f43f5e") : hex("#e11d48");
          else if (rand(x, y, 88) > 0.995) c = hex("#fecdd3");
          out[y * w + x] = c;
        } else if (y < groundY) {
          let c = sea;
          if (Math.abs(x - moonX) < 18 && (y & 1) === 0) c = hex("#be123c");
          else if (((x + y * 5) % 17) === 0) c = hex("#312e81");
          out[y * w + x] = c;
        } else {
          const gy = y - groundY;
          out[y * w + x] = gy === 0 ? hex("#fb7185") : sand;
        }
      }
    }
    return out;
  }

  if (kind === "proton_hospital") {
    const wall = hex("#1e293b"), tileLine = hex("#0f172a"), floorA = hex("#334155"), floorB = hex("#1e293b");
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y < groundY) {
          let c = (x % 16 === 0 || y % 12 === 0) ? tileLine : wall;
          if (y >= 8 && y <= 12 && x % 48 > 8 && x % 48 < 38) c = hex("#e0f2fe");
          out[y * w + x] = c;
        } else {
          const gy = y - groundY;
          const checker = ((Math.floor(x / 10) + Math.floor(gy / 4)) & 1) === 0;
          out[y * w + x] = gy === 0 ? hex("#38bdf8") : checker ? floorA : floorB;
        }
      }
    }
    return out;
  }

  if (kind === "proton_alfa") {
    const skyT = hex("#090418"), skyB = hex("#2e1065"), floor = hex("#1e1b4b");
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y < groundY) {
          let c = mix(skyT, skyB, y / Math.max(1, groundY));
          const r = rand(x, y, 123);
          if (r > 0.992) c = hex("#f8fafc");
          else if (r > 0.988) c = hex("#c084fc");
          out[y * w + x] = c;
        } else {
          const gy = y - groundY;
          out[y * w + x] = gy === 0 ? hex("#a855f7") : ((x + gy) % 9 === 0) ? hex("#4c1d95") : floor;
        }
      }
    }
    drawStoneSphere(out, w, h, Math.floor(w * 0.25), Math.floor(groundY * 0.38), 11, "#a855f7");
    drawStoneSphere(out, w, h, Math.floor(w * 0.76), Math.floor(groundY * 0.28), 14, "#38bdf8");
    return out;
  }

  if (kind === "proton_lab") {
    const panel = hex("#0f172a"), seam = hex("#1e293b"), tube = hex("#0284c7"), tubeHi = hex("#7dd3fc"), ped = hex("#334155");
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (y < groundY) {
          let c = (x % 24 === 0 || y % 18 === 0) ? seam : panel;
          const dx = Math.abs(x - w * 0.5);
          if (dx < 15 && y >= groundY - 6) {
            c = ped;
          } else if (dx < 12 && y > 14 && y < groundY - 6) {
            c = dx < 4 ? tubeHi : tube;
          }
          out[y * w + x] = c;
        } else {
          const gy = y - groundY;
          out[y * w + x] = gy === 0 ? hex("#38bdf8") : (x % 6 === 0) ? hex("#090d16") : hex("#1e293b");
        }
      }
    }
    return out;
  }

  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let c = SKY;
      if (kind === "sky") {
        const t = y / Math.max(1, h - 1), step = (t * 5 + BAYER[((y & 3) << 2) | (x & 3)] / 16) | 0;
        c = mix(SKY_TOP, SKY_LOW, Math.min(1, step / 4));
        const r = rand(x, y, 77);
        if (r > 0.994) c = mix(c, hex("#cfc8ff"), 0.35 + (r - 0.994) * 90);
      }
      if (kind === "ground" && y >= groundY) {
        const gy = y - groundY;
        if (gy === 0) c = FLOOR_EDGE;
        else {
          const row = Math.floor((gy - 1) / 5), off = row % 2 ? 6 : 0;
          const mortar = (gy - 1) % 5 === 4 || (x + off) % 12 === 0;
          c = mortar ? MORTAR : gy < 3 ? FLOOR : FLOOR_DARK;
        }
      }
      out[y * w + x] = c;
    }
  return out;
}
