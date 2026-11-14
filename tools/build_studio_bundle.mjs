// ============================================================================
// Bundler Zero-Dependencies para Proyecto Protón PixelFX Studio
// Empaqueta assets/js/proton_studio.js y los 281 módulos de pixelfx-main
// en un único script clásico (assets/js/proton_studio_bundle.js) compatible
// tanto con file:// (doble clic en Windows) como con GitHub Pages (https://).
// ============================================================================

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const ENTRY_STUDIO = path.resolve(ROOT, "assets/js/proton_studio.js");
const ENTRY_GAME = path.resolve(ROOT, "assets/js/proton_game_demo.js");
const OUT_FILE = path.resolve(ROOT, "assets/js/proton_studio_bundle.js");

// Mock document/window so Node can import proton_studio.js at build time to inspect exports
globalThis.document = {
  readyState: "loading",
  addEventListener() {},
  getElementById() {
    return null;
  },
};
globalThis.window = globalThis;

function walkJs(dir) {
  let out = [];
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) out.push(...walkJs(p));
    else if (p.endsWith(".js")) out.push(p);
  }
  return out;
}

function normId(absPath) {
  return path.relative(ROOT, absPath).replace(/\\/g, "/");
}

function resolveImport(fromFile, spec) {
  const abs = path.resolve(path.dirname(fromFile), spec);
  return normId(abs);
}

function convertSpecListToDestruct(listStr) {
  return listStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^([A-Za-z0-9_$]+)\s+as\s+([A-Za-z0-9_$]+)$/);
      return m ? `${m[1]}: ${m[2]}` : part;
    })
    .join(", ");
}

async function buildBundle() {
  const pixelfxSrc = path.resolve(ROOT, "saga/Proyecto Proton el video Juego/pixelfx-main/src");
  const allFiles = [...walkJs(pixelfxSrc), ENTRY_STUDIO, ENTRY_GAME];

  const moduleEntries = [];

  for (const absFile of allFiles) {
    const id = normId(absFile);
    const nativeMod = await import(pathToFileURL(absFile).href);
    const exportNames = Object.keys(nativeMod);

    let code = fs.readFileSync(absFile, "utf8");

    // 1. import * as ns from "..."
    code = code.replace(
      /import\s+\*\s+as\s+([A-Za-z0-9_$]+)\s+from\s+["']([^"']+)["']\s*;?/g,
      (_, ns, spec) => `const ${ns} = __require(${JSON.stringify(resolveImport(absFile, spec))});`
    );

    // 2. import { ... } from "..." (single or multi-line)
    code = code.replace(
      /import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']\s*;?/g,
      (_, list, spec) => {
        const destruct = convertSpecListToDestruct(list);
        return `const { ${destruct} } = __require(${JSON.stringify(resolveImport(absFile, spec))});`;
      }
    );

    // 3. export * from "..."
    code = code.replace(
      /export\s+\*\s+from\s+["']([^"']+)["']\s*;?/g,
      (_, spec) => `Object.assign(__exports, __require(${JSON.stringify(resolveImport(absFile, spec))}));`
    );

    // 4. export { ... } from "..."
    code = code.replace(
      /export\s*\{([\s\S]*?)\}\s*from\s*["']([^"']+)["']\s*;?/g,
      (_, list, spec) => {
        const reqId = JSON.stringify(resolveImport(absFile, spec));
        const assigns = list
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((part) => {
            const m = part.match(/^([A-Za-z0-9_$]+)\s+as\s+([A-Za-z0-9_$]+)$/);
            return m ? `__exports.${m[2]} = __m.${m[1]};` : `__exports.${part} = __m.${part};`;
          })
          .join(" ");
        return `{ const __m = __require(${reqId}); ${assigns} }`;
      }
    );

    // 5. export { ... }; (local re-export)
    code = code.replace(/export\s*\{([\s\S]*?)\}\s*;?/g, (_, list) => {
      return list
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((part) => {
          const m = part.match(/^([A-Za-z0-9_$]+)\s+as\s+([A-Za-z0-9_$]+)$/);
          return m ? `__exports.${m[2]} = ${m[1]};` : `__exports.${part} = ${part};`;
        })
        .join(" ");
    });

    // 6. export const / let / var / function / class
    code = code.replace(/^(\s*)export\s+(const|let|var|function|class)\b/gm, "$1$2");

    // 7. Export all top-level exported symbols discovered by Node
    const autoExports = exportNames
      .map((name) => `if (typeof ${name} !== "undefined") __exports.${name} = ${name};`)
      .join("\n  ");

    moduleEntries.push(
      `  ${JSON.stringify(id)}: function(__exports, __require) {\n${code}\n  ${autoExports}\n  }`
    );
  }

  const bundleSource = `// ============================================================================
// AUTO-GENERATED BUNDLE: PROYECTO PROTÓN PIXELFX STUDIO (0 TOKENS)
// Contiene los 281 módulos de pixelfx-main + assets/js/proton_studio.js
// Compatible con apertura directa (file://) y servidor web (GitHub Pages).
// ============================================================================
(function () {
  "use strict";
  const __modules = {
${moduleEntries.join(",\n")}
  };
  const __cache = {};
  function __require(id) {
    if (__cache[id]) return __cache[id];
    const fn = __modules[id];
    if (!fn) throw new Error("Módulo no encontrado en bundle: " + id);
    const exp = {};
    __cache[id] = exp;
    fn(exp, __require);
    return exp;
  }
  __require(${JSON.stringify(normId(ENTRY_STUDIO))});
  __require(${JSON.stringify(normId(ENTRY_GAME))});
})();
`;

  fs.writeFileSync(OUT_FILE, bundleSource, "utf8");
  console.log(
    `Bundle generado exitosamente: ${OUT_FILE} (${moduleEntries.length} módulos, ${(
      bundleSource.length / 1024
    ).toFixed(1)} KB)`
  );
}

buildBundle().catch((err) => {
  console.error(err);
  process.exit(1);
});
