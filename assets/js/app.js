(function () {
  "use strict";

  const DATA = window.PROTON_DATA || {
    saga_libros: [],
    capitulos: [],
    personajes: [],
    relaciones: [],
    gemas: [],
    apuntes_lore: [],
    estadisticas: {},
  };

  const STORAGE_KEYS = {
    PROGRESS: "proton_reading_progress_v1",
    BOOKMARKS: "proton_manual_bookmarks_v1",
    PREFS: "proton_reader_prefs_v1",
    CUSTOM_NOTES: "proton_custom_handwritten_notes_v1",
  };

  // --- Recursos gráficos (portada, fondos por capítulo y retratos) ---
  const IMG = {
    cover: "assets/img/Portadav2.png",
    chapter: (idx) => `assets/img/capitulos/cap_${String(idx).padStart(2, "0")}.jpg`,
    character: (id) => `assets/img/personajes/${id}.jpg`,
  };
  const imageAvailability = {};

  /** Comprueba (con caché) si una imagen existe antes de usarla como fondo. */
  function whenImageAvailable(src, onOk, onFail) {
    if (imageAvailability[src] === true) return onOk(src);
    if (imageAvailability[src] === false) return onFail && onFail();
    const probe = new Image();
    probe.onload = () => {
      imageAvailability[src] = true;
      onOk(src);
    };
    probe.onerror = () => {
      imageAvailability[src] = false;
      if (onFail) onFail();
    };
    probe.src = src;
  }

  function setPageBackdrop(src) {
    const el = document.getElementById("page-backdrop");
    if (!el) return;
    whenImageAvailable(
      src,
      (ok) => (el.style.backgroundImage = `url("${ok}")`),
      () => (el.style.backgroundImage = `url("${IMG.cover}")`)
    );
  }

  /** Avatar con retrato generado; si no existe, muestra la inicial. */
  function avatarInner(ch) {
    const initial = escapeHtml(ch.nombre.charAt(0));
    return `<img src="${IMG.character(ch.id)}" alt="${escapeHtml(ch.nombre)}" loading="lazy"
              onerror="this.replaceWith(document.createTextNode('${initial}'))" />`;
  }

  const state = {
    activeView: "home",
    currentChapterIdx: 0,
    currentParagraphNum: 1,
    chapterProgressMap: {},
    bookmarks: [],
    spoilerMaxChapter: 0,
    spoilerSyncWithReader: true,
    selectedCharacterId: "cisco",
    characterCategoryFilter: "todos",
    characterSearch: "",
    readerPrefs: {
      theme: "dark",
      fontSizeRem: 1.125,
      fontFamily: "serif",
    },
    tts: {
      playing: false,
      paused: false,
      rate: 1.0,
      paraIndex: 0,
      utterance: null,
      mode: "tts", // "tts" | "mp3"
    },
    observer: null,
  };

  // --- LocalStorage Helpers ---
  function loadPersistedState() {
    try {
      const savedProg = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || "null");
      if (savedProg) {
        state.currentChapterIdx = savedProg.chapterIdx ?? 0;
        state.currentParagraphNum = savedProg.paragraphNum ?? 1;
        state.chapterProgressMap = savedProg.chapterProgressMap || {};
        state.spoilerMaxChapter = state.currentChapterIdx;
      }
      const savedBookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || "[]");
      if (Array.isArray(savedBookmarks)) {
        state.bookmarks = savedBookmarks;
      }
      const savedPrefs = JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFS) || "null");
      if (savedPrefs) {
        state.readerPrefs = { ...state.readerPrefs, ...savedPrefs };
      }
    } catch (e) {
      console.warn("No se pudo leer localStorage:", e);
    }
  }

  function saveProgress(chapterIdx, paragraphNum, totalParagraphs) {
    state.currentChapterIdx = chapterIdx;
    state.currentParagraphNum = paragraphNum;
    const pct = totalParagraphs > 0 ? Math.min(100, Math.round((paragraphNum / totalParagraphs) * 100)) : 0;
    const prevPct = state.chapterProgressMap[chapterIdx] || 0;
    state.chapterProgressMap[chapterIdx] = Math.max(prevPct, pct);

    if (state.spoilerSyncWithReader && chapterIdx > state.spoilerMaxChapter) {
      state.spoilerMaxChapter = chapterIdx;
    }

    try {
      localStorage.setItem(
        STORAGE_KEYS.PROGRESS,
        JSON.stringify({
          chapterIdx: state.currentChapterIdx,
          paragraphNum: state.currentParagraphNum,
          chapterProgressMap: state.chapterProgressMap,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      // ignore quota errors
    }
    updateContinueReadingUI();
    updateProgressBarUI(pct, paragraphNum, totalParagraphs);
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(state.bookmarks));
    } catch (e) {
      // ignore
    }
    renderBookmarksDrawer();
  }

  function saveReaderPrefs() {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(state.readerPrefs));
    } catch (e) {
      // ignore
    }
    applyReaderPrefs();
  }

  // --- Navigation ---
  function switchView(viewName) {
    state.activeView = viewName;
    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === `view-${viewName}`);
    });
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });
    if (viewName === "characters") {
      renderCharacterExplorer();
    }
    setPageBackdrop(viewName === "reader" ? IMG.chapter(state.currentChapterIdx) : IMG.cover);
  }

  // --- Home & Saga Render ---
  function renderHomeStatsAndSaga() {
    const stats = DATA.estadisticas || {};
    const statContainer = document.getElementById("hero-stats-grid");
    if (statContainer) {
      statContainer.innerHTML = `
        <div class="stat-card"><strong>${stats.total_libros_saga || 3}</strong><span>Libros en la Saga</span></div>
        <div class="stat-card"><strong>${stats.total_capitulos_canon || 11}</strong><span>Capítulos Canon</span></div>
        <div class="stat-card"><strong>${(stats.total_palabras_canon || 38871).toLocaleString("es-CR")}</strong><span>Palabras Escritas</span></div>
        <div class="stat-card"><strong>${stats.total_personajes || 20}</strong><span>Personajes & Entidades</span></div>
      `;
    }

    const sagaGrid = document.getElementById("saga-books-grid");
    if (sagaGrid) {
      sagaGrid.innerHTML = (DATA.saga_libros || [])
        .map((libro) => {
          const isCanon = libro.numero === 1;
          return `
            <article class="saga-card ${isCanon ? "canon-book" : ""}">
              <div>
                <span class="saga-status ${isCanon ? "canon" : "wip"}">Libro ${libro.numero} · ${libro.estado}</span>
                <h3>${libro.titulo}</h3>
                <div class="sub">${libro.subtitulo}</div>
                <p>${libro.sinopsis}</p>
              </div>
              <div class="saga-meta">
                <div><strong>Época clave:</strong> ${libro.epoca_principal}</div>
                <div><strong>Protagonistas:</strong> ${libro.protagonistas.join(", ")}</div>
                <div><strong>Carpeta de trabajo:</strong> <code>${libro.carpeta}/</code></div>
                <div style="margin-top:0.6rem;">
                  ${
                    isCanon
                      ? `<button class="btn btn-primary" data-action="open-reader" style="width:100%;justify-content:center;">Leer Manuscrito Canon</button>`
                      : `<button class="btn btn-outline" data-action="open-lore" style="width:100%;justify-content:center;">Ver Escaleta y Lore</button>`
                  }
                </div>
              </div>
            </article>
          `;
        })
        .join("");
    }

    updateContinueReadingUI();
  }

  function updateContinueReadingUI() {
    const cap = DATA.capitulos.find((c) => c.index === state.currentChapterIdx) || DATA.capitulos[0];
    if (!cap) return;
    const pct = state.chapterProgressMap[cap.index] || 0;
    const titleEl = document.getElementById("continue-chapter-title");
    const metaEl = document.getElementById("continue-chapter-meta");
    if (titleEl) {
      titleEl.textContent = `${cap.titulo} — ${cap.subtitulo}`;
    }
    if (metaEl) {
      metaEl.textContent = `Párrafo ${state.currentParagraphNum} de ${cap.paragraph_count} (${pct}% leído en este capítulo)`;
    }
  }

  // --- Reader (HU-4.1 & HU-4.2) ---
  function applyReaderPrefs() {
    const readerMain = document.getElementById("reader-main-panel");
    if (!readerMain) return;
    readerMain.setAttribute("data-reader-theme", state.readerPrefs.theme);
    readerMain.style.setProperty("--reader-font-size", `${state.readerPrefs.fontSizeRem}rem`);
    readerMain.style.setProperty(
      "--reader-font-family",
      state.readerPrefs.fontFamily === "sans"
        ? "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        : "'Georgia', 'Cambria', 'Times New Roman', serif"
    );

    document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.themeBtn === state.readerPrefs.theme);
    });
    const fontBtn = document.getElementById("btn-toggle-font");
    if (fontBtn) {
      fontBtn.textContent = state.readerPrefs.fontFamily === "sans" ? "Fuente: Sans" : "Fuente: Serif";
    }
  }

  function renderChapterSidebar() {
    const listEl = document.getElementById("reader-chapter-list");
    if (!listEl) return;
    listEl.innerHTML = DATA.capitulos
      .map((cap) => {
        const pct = state.chapterProgressMap[cap.index] || 0;
        const isActive = cap.index === state.currentChapterIdx;
        const hasMp3 = cap.audios && cap.audios.length > 0;
        return `
          <button class="chapter-item-btn ${isActive ? "active" : ""}" data-select-chapter="${cap.index}"
                  style="background-image:url('${IMG.chapter(cap.index)}');">
            <div class="chapter-item-top">
              <span>${cap.titulo}</span>
              <span class="era-pill">${cap.epoca}</span>
            </div>
            <div class="chapter-item-sub">
              <span>${cap.reading_time_min} min · ${cap.word_count} pal. ${hasMp3 ? "· 🎧 MP3" : ""}</span>
              <span>${pct}%</span>
            </div>
            <div class="chapter-mini-bar">
              <div class="chapter-mini-fill" style="width:${pct}%;"></div>
            </div>
          </button>
        `;
      })
      .join("");
  }

  function loadChapter(chapterIdx, targetParagraphNum = 1, scrollIntoView = false) {
    stopTTS();
    const cap = DATA.capitulos.find((c) => c.index === Number(chapterIdx)) || DATA.capitulos[0];
    if (!cap) return;

    state.currentChapterIdx = cap.index;
    state.currentParagraphNum = targetParagraphNum || 1;
    if (state.spoilerSyncWithReader && cap.index > state.spoilerMaxChapter) {
      state.spoilerMaxChapter = cap.index;
    }

    renderChapterSidebar();

    const headerEl = document.getElementById("reader-chapter-header");
    const persMap = Object.fromEntries(DATA.personajes.map((p) => [p.id, p.nombre]));
    const gemMap = Object.fromEntries(DATA.gemas.map((g) => [g.id, g.nombre]));

    if (headerEl) {
      const charChips = (cap.personajes_ids || [])
        .map(
          (pid) =>
            `<span class="tag-chip" data-inspect-char="${pid}" title="Ver ficha sin spoilers">👤 ${
              persMap[pid] || pid
            }</span>`
        )
        .join("");
      const gemChips = (cap.gemas_ids || [])
        .map((gid) => `<span class="tag-chip">💎 ${gemMap[gid] || gid}</span>`)
        .join("");

      headerEl.style.backgroundImage = "";
      whenImageAvailable(IMG.chapter(cap.index), (src) => {
        if (state.currentChapterIdx === cap.index) headerEl.style.backgroundImage = `url("${src}")`;
      });
      if (state.activeView === "reader") setPageBackdrop(IMG.chapter(cap.index));

      headerEl.innerHTML = `
        <div class="chapter-kicker">
          <span>📅 ${cap.fecha_lore}</span>
          <span>•</span>
          <span>📍 ${cap.ubicacion}</span>
          <span>•</span>
          <span>🧭 ${cap.coordenadas}</span>
        </div>
        <h2>${cap.titulo}</h2>
        <h3>${cap.subtitulo}</h3>
        <div class="chapter-summary-box">
          <strong>Resumen de referencia:</strong> ${cap.resumen}
        </div>
        <div class="chapter-tags-row">${charChips} ${gemChips}</div>
      `;
    }

    const contentEl = document.getElementById("reader-paragraphs-container");
    if (contentEl) {
      const bookmarkedIds = new Set(state.bookmarks.map((b) => b.id));
      contentEl.innerHTML = cap.parrafos
        .map((p) => {
          const isBookmarked = bookmarkedIds.has(p.id);
          return `
            <div class="reader-paragraph ${p.tipo} ${isBookmarked ? "bookmarked-para" : ""}"
                 id="${p.id}"
                 data-para-num="${p.numero}"
                 data-chapter-idx="${cap.index}">
              <span class="para-text">${escapeHtml(p.texto)}</span>
              <div class="para-actions">
                <button class="para-btn" data-tts-from="${p.numero}" title="Leer en voz alta desde este párrafo">🔊 Leer aquí</button>
                <button class="para-btn" data-bookmark-para="${p.numero}" title="Guardar marcador o cita">
                  ${isBookmarked ? "★ Guardado" : "☆ Marcar"}
                </button>
              </div>
            </div>
          `;
        })
        .join("");
    }

    // Update Prev/Next chapter buttons
    const prevBtn = document.getElementById("btn-prev-chapter");
    const nextBtn = document.getElementById("btn-next-chapter");
    if (prevBtn) {
      prevBtn.disabled = cap.index <= 0;
      prevBtn.onclick = () => loadChapter(cap.index - 1, 1, true);
    }
    if (nextBtn) {
      nextBtn.disabled = cap.index >= DATA.capitulos.length - 1;
      nextBtn.onclick = () => loadChapter(cap.index + 1, 1, true);
    }

    setupParagraphObserver(cap);
    setupChapterAudioOptions(cap);

    if (scrollIntoView) {
      setTimeout(() => {
        const targetEl = document.getElementById(`cap-${cap.index}-p-${state.currentParagraphNum}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          document.getElementById("reader-main-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    } else {
      updateProgressBarUI(
        state.chapterProgressMap[cap.index] || 0,
        state.currentParagraphNum,
        cap.paragraph_count
      );
    }
  }

  function setupParagraphObserver(cap) {
    if (state.observer) {
      state.observer.disconnect();
    }
    const paragraphs = document.querySelectorAll("#reader-paragraphs-container .reader-paragraph");
    if (!("IntersectionObserver" in window) || !paragraphs.length) return;

    state.observer = new IntersectionObserver(
      (entries) => {
        if (state.activeView !== "reader") return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const pNum = Number(entry.target.dataset.paraNum || 1);
            saveProgress(cap.index, pNum, cap.paragraph_count);
            break;
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0.1,
      }
    );

    paragraphs.forEach((el) => state.observer.observe(el));
  }

  function updateProgressBarUI(pct, paraNum, totalParas) {
    const bar = document.getElementById("global-reading-bar");
    if (bar) bar.style.width = `${pct}%`;

    const badge = document.getElementById("reader-progress-label");
    if (badge) {
      badge.textContent = `Párrafo ${paraNum}/${totalParas} (${pct}%)`;
    }
  }

  function toggleBookmark(chapterIdx, paraNum) {
    const cap = DATA.capitulos.find((c) => c.index === Number(chapterIdx));
    if (!cap) return;
    const para = cap.parrafos.find((p) => p.numero === Number(paraNum));
    if (!para) return;

    const existingIdx = state.bookmarks.findIndex((b) => b.id === para.id);
    if (existingIdx >= 0) {
      state.bookmarks.splice(existingIdx, 1);
    } else {
      state.bookmarks.unshift({
        id: para.id,
        chapterIdx: cap.index,
        chapterTitle: cap.titulo,
        paraNum: para.numero,
        excerpt: para.texto.slice(0, 140) + (para.texto.length > 140 ? "…" : ""),
        createdAt: new Date().toLocaleDateString("es-CR"),
      });
    }
    saveBookmarks();
    const paraEl = document.getElementById(para.id);
    if (paraEl) {
      const isNow = existingIdx < 0;
      paraEl.classList.toggle("bookmarked-para", isNow);
      const btn = paraEl.querySelector("[data-bookmark-para]");
      if (btn) btn.textContent = isNow ? "★ Guardado" : "☆ Marcar";
    }
  }

  function renderBookmarksDrawer() {
    const countEl = document.getElementById("bookmarks-count-badge");
    if (countEl) countEl.textContent = String(state.bookmarks.length);

    const listEl = document.getElementById("bookmarks-list-container");
    if (!listEl) return;

    if (!state.bookmarks.length) {
      listEl.innerHTML = `<p style="color:var(--text-secondary);font-size:0.88rem;">Aún no tienes citas o marcadores manuales. Pasa el cursor sobre cualquier párrafo en el lector y pulsa <strong>"☆ Marcar"</strong>.</p>`;
      return;
    }

    listEl.innerHTML = state.bookmarks
      .map(
        (b) => `
        <div class="bookmark-card">
          <div>
            <strong style="color:var(--accent-gold);">${b.chapterTitle} · Párrafo ${b.paraNum}</strong>
            <p style="margin-top:0.3rem;color:var(--text-primary);font-style:italic;">"${escapeHtml(b.excerpt)}"</p>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.4rem;">
            <button class="tool-btn" data-jump-bookmark-cap="${b.chapterIdx}" data-jump-bookmark-para="${b.paraNum}">Ir al párrafo →</button>
            <button class="tool-btn" data-remove-bookmark="${b.id}" title="Eliminar marcador">✕</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  // --- Audiobook & TTS Read-Along (HU-4.4: SCRUM-35 & SCRUM-36) ---
  function setupChapterAudioOptions(cap) {
    const mp3Select = document.getElementById("mp3-track-select");
    const mp3Player = document.getElementById("native-mp3-player");
    if (!mp3Select || !mp3Player) return;

    if (cap.audios && cap.audios.length > 0) {
      mp3Select.style.display = "inline-block";
      mp3Select.innerHTML =
        `<option value="">🎧 Pistas MP3 ElevenLabs (${cap.audios.length})...</option>` +
        cap.audios
          .map((path, i) => `<option value="${path}">Parte ${i + 1} — ${path.split("/").pop()}</option>`)
          .join("");
    } else {
      mp3Select.style.display = "none";
      mp3Player.style.display = "none";
      mp3Player.pause();
    }
  }

  function startTTSFromParagraph(paraNum) {
    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no soporta Web Speech API para lectura en voz alta.");
      return;
    }
    const cap = DATA.capitulos.find((c) => c.index === state.currentChapterIdx);
    if (!cap || !cap.parrafos.length) return;

    window.speechSynthesis.cancel();
    const startIdx = Math.max(
      0,
      cap.parrafos.findIndex((p) => p.numero >= paraNum)
    );
    state.tts.paraIndex = startIdx;
    state.tts.playing = true;
    state.tts.paused = false;
    speakCurrentParagraph();
  }

  function speakCurrentParagraph() {
    const cap = DATA.capitulos.find((c) => c.index === state.currentChapterIdx);
    if (!cap || state.tts.paraIndex >= cap.parrafos.length) {
      stopTTS();
      return;
    }

    const para = cap.parrafos[state.tts.paraIndex];
    highlightActiveParagraph(para.id, true);
    saveProgress(cap.index, para.numero, cap.paragraph_count);

    const statusText = document.getElementById("audio-now-playing");
    if (statusText) {
      statusText.textContent = `Narrando ${cap.titulo} · Párrafo ${para.numero}/${cap.paragraph_count}`;
    }
    updateAudioButtonsUI();

    const u = new SpeechSynthesisUtterance(para.texto);
    u.lang = "es-MX";
    u.rate = state.tts.rate;

    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find((v) => v.lang.toLowerCase().startsWith("es"));
    if (esVoice) u.voice = esVoice;

    u.onend = () => {
      if (!state.tts.playing || state.tts.paused) return;
      state.tts.paraIndex += 1;
      speakCurrentParagraph();
    };

    u.onerror = () => {
      stopTTS();
    };

    state.tts.utterance = u;
    window.speechSynthesis.speak(u);
  }

  function togglePlayPauseTTS() {
    if (!("speechSynthesis" in window)) return;
    if (!state.tts.playing) {
      switchView("reader");
      startTTSFromParagraph(state.currentParagraphNum || 1);
      return;
    }
    if (state.tts.paused) {
      window.speechSynthesis.resume();
      state.tts.paused = false;
    } else {
      window.speechSynthesis.pause();
      state.tts.paused = true;
    }
    updateAudioButtonsUI();
  }

  function stopTTS() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    state.tts.playing = false;
    state.tts.paused = false;
    document.querySelectorAll(".reader-paragraph.reading-active").forEach((el) => {
      el.classList.remove("reading-active");
    });
    const statusText = document.getElementById("audio-now-playing");
    if (statusText) {
      statusText.textContent = "Modo Audiolibro (Read-Along) listo · Pulsa ▶ Reproducir";
    }
    updateAudioButtonsUI();
  }

  function highlightActiveParagraph(paraId, autoScroll) {
    document.querySelectorAll(".reader-paragraph.reading-active").forEach((el) => {
      el.classList.remove("reading-active");
    });
    const target = document.getElementById(paraId);
    if (target) {
      target.classList.add("reading-active");
      if (autoScroll) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  function updateAudioButtonsUI() {
    const playBtn = document.getElementById("btn-audio-play");
    const dot = document.getElementById("audio-pulse-dot");
    if (playBtn) {
      if (!state.tts.playing) {
        playBtn.textContent = "▶ Narrar Capítulo";
      } else if (state.tts.paused) {
        playBtn.textContent = "▶ Reanudar";
      } else {
        playBtn.textContent = "⏸ Pausar";
      }
    }
    if (dot) {
      dot.classList.toggle("playing", state.tts.playing && !state.tts.paused);
    }
  }

  // --- Character Explorer & Anti-Spoiler Graph (HU-4.3: SCRUM-33 & SCRUM-34) ---
  function getCharacterProgressiveStage(char, maxCap) {
    const etapas = char.evolucion_por_capitulo || [];
    for (const etapa of etapas) {
      if (maxCap <= etapa.hasta_capitulo) {
        return etapa;
      }
    }
    return (
      etapas[etapas.length - 1] || {
        rol_visible: char.categoria,
        faccion_visible: char.faccion,
        bio: char.descripcion.trasfondo,
      }
    );
  }

  function renderCharacterExplorer() {
    const slider = document.getElementById("spoiler-chapter-slider");
    const badge = document.getElementById("spoiler-chapter-badge");
    const capObj = DATA.capitulos.find((c) => c.index === state.spoilerMaxChapter);

    if (slider) slider.value = String(state.spoilerMaxChapter);
    if (badge) {
      badge.textContent =
        state.spoilerMaxChapter >= 10
          ? "Canon Completo (Sin Filtro)"
          : `Filtro Anti-Spoilers: Hasta ${capObj ? capObj.titulo : "Cap. " + state.spoilerMaxChapter}`;
    }

    renderRelationshipGraphSVG();
    renderCharacterSpotlight(state.selectedCharacterId);
    renderCharacterCardsGrid();
  }

  function renderRelationshipGraphSVG() {
    const svg = document.getElementById("relationship-svg");
    if (!svg) return;

    const maxCap = state.spoilerMaxChapter;
    const visibleChars = DATA.personajes.filter((p) => p.primera_aparicion <= maxCap);
    const visibleIds = new Set(visibleChars.map((p) => p.id));

    const visibleRels = DATA.relaciones.filter(
      (r) =>
        r.capitulo_minimo <= maxCap &&
        (r.capitulo_maximo === undefined || maxCap <= r.capitulo_maximo) &&
        visibleIds.has(r.origen) &&
        visibleIds.has(r.destino)
    );

    const width = 760;
    const height = 450;
    const cx = width / 2;
    const cy = height / 2;

    // Position main characters in inner ring, secondary in outer ring
    const mainChars = visibleChars.filter((c) => c.categoria.toLowerCase().includes("principal"));
    const otherChars = visibleChars.filter((c) => !c.categoria.toLowerCase().includes("principal"));

    const posMap = {};
    mainChars.forEach((ch, idx) => {
      const angle = (idx / Math.max(1, mainChars.length)) * Math.PI * 2 - Math.PI / 2;
      const r = mainChars.length === 1 ? 0 : 95;
      posMap[ch.id] = {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      };
    });

    otherChars.forEach((ch, idx) => {
      const angle = (idx / Math.max(1, otherChars.length)) * Math.PI * 2 - Math.PI / 4;
      const rx = 275;
      const ry = 175;
      posMap[ch.id] = {
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
      };
    });

    const edgeColors = {
      familia: "#a855f7",
      familia_mentor: "#38bdf8",
      alianza: "#10b981",
      vinculo_espiritual: "#f59e0b",
      mentor_aparente: "#eab308",
      conflicto: "#ef4444",
      manipulacion_temporal: "#6366f1",
    };

    const edgesSvg = visibleRels
      .map((rel) => {
        const p1 = posMap[rel.origen];
        const p2 = posMap[rel.destino];
        if (!p1 || !p2) return "";
        const color = edgeColors[rel.tipo] || "#94a3b8";
        const isSelected =
          rel.origen === state.selectedCharacterId || rel.destino === state.selectedCharacterId;
        const opacity = isSelected ? "0.95" : "0.42";
        const strokeWidth = isSelected ? "3" : "1.6";
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;

        return `
          <g class="graph-edge">
            <line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}"
                  x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}"
                  stroke="${color}" stroke-width="${strokeWidth}" stroke-opacity="${opacity}" />
            ${
              isSelected
                ? `<text x="${mx.toFixed(1)}" y="${(my - 6).toFixed(1)}"
                         fill="#f8fafc" font-size="10" text-anchor="middle"
                         style="paint-order:stroke;stroke:#020617;stroke-width:3px;font-weight:700;">
                     ${escapeHtml(rel.etiqueta)}
                   </text>`
                : ""
            }
          </g>
        `;
      })
      .join("");

    const nodesSvg = visibleChars
      .map((ch) => {
        const pos = posMap[ch.id];
        if (!pos) return "";
        const isSel = ch.id === state.selectedCharacterId;
        const hex = ch.atributos?.hex || "#38bdf8";
        const radius = ch.categoria.toLowerCase().includes("principal") ? 22 : 16;
        const shortName = ch.nombre.split(" ")[0];
        return `
          <g class="graph-node" data-node-char="${ch.id}" style="cursor:pointer;">
            ${
              isSel
                ? `<circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="${
                    radius + 7
                  }" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 3" />`
                : ""
            }
            <circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="${radius}"
                    fill="${hex}" fill-opacity="0.9" stroke="#020617" stroke-width="2.5" />
            <clipPath id="clip-${ch.id}">
              <circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="${radius - 1.5}" />
            </clipPath>
            <image href="${IMG.character(ch.id)}" x="${(pos.x - radius).toFixed(1)}" y="${(pos.y - radius).toFixed(1)}"
                   width="${radius * 2}" height="${radius * 2}" clip-path="url(#clip-${ch.id})"
                   preserveAspectRatio="xMidYMid slice" onerror="this.remove()" />
            <circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="${radius}"
                    fill="none" stroke="${hex}" stroke-width="2" />
            <text x="${pos.x.toFixed(1)}" y="${(pos.y + radius + 14).toFixed(1)}"
                  fill="#f1f5f9" font-size="11.5" font-weight="700" text-anchor="middle"
                  style="paint-order:stroke;stroke:#020617;stroke-width:3.5px;">
              ${escapeHtml(shortName === "Francisco" ? "Cisco" : shortName === "Boenawa" ? "Nawa" : shortName === "Gilberto" ? "Gil" : ch.nombre.slice(0, 16))}
            </text>
          </g>
        `;
      })
      .join("");

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = edgesSvg + nodesSvg;
  }

  function renderCharacterSpotlight(charId) {
    const box = document.getElementById("character-spotlight-box");
    if (!box) return;
    const ch = DATA.personajes.find((p) => p.id === charId) || DATA.personajes[0];
    if (!ch) return;

    const maxCap = state.spoilerMaxChapter;
    const isUnlocked = ch.primera_aparicion <= maxCap;
    const stage = getCharacterProgressiveStage(ch, maxCap);
    const stats = ch.atributos.estadisticas;
    const hex = ch.atributos.hex || "#38bdf8";

    const rels = DATA.relaciones.filter(
      (r) =>
        r.capitulo_minimo <= maxCap &&
        (r.capitulo_maximo === undefined || maxCap <= r.capitulo_maximo) &&
        (r.origen === ch.id || r.destino === ch.id)
    );
    const persMap = Object.fromEntries(DATA.personajes.map((p) => [p.id, p.nombre]));

    if (!isUnlocked) {
      box.innerHTML = `
        <div style="text-align:center;padding:2rem 1rem;">
          <div style="font-size:2.5rem;margin-bottom:0.5rem;">🔒</div>
          <h3>${escapeHtml(ch.nombre)}</h3>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">
            Este personaje o entidad aparece por primera vez en el <strong>Capítulo ${ch.primera_aparicion}</strong>.
          </p>
          <button class="btn btn-outline" style="margin-top:1rem;" data-unlock-spoiler="${ch.primera_aparicion}">
            Avanzar filtro al Capítulo ${ch.primera_aparicion}
          </button>
        </div>
      `;
      return;
    }

    box.innerHTML = `
      <img class="character-portrait-hero" src="${IMG.character(ch.id)}" alt="Retrato de ${escapeHtml(ch.nombre)}"
           onerror="this.remove()" />
      <div class="char-top" style="margin-bottom:1rem;">
        <div class="char-avatar" style="background:${hex};">${avatarInner(ch)}</div>
        <div>
          <span class="era-pill" style="background:rgba(56,189,248,0.18);color:${hex};">${escapeHtml(
      stage.faccion_visible
    )}</span>
          <h3 style="font-size:1.3rem;margin-top:0.2rem;">${escapeHtml(ch.nombre)}</h3>
          <small style="color:var(--text-secondary);">${escapeHtml(stage.rol_visible)}</small>
        </div>
      </div>

      <p style="font-size:0.92rem;color:var(--text-primary);margin-bottom:1rem;">
        ${escapeHtml(stage.bio)}
      </p>

      <div class="stat-bars" style="margin-bottom:1rem;">
        <div class="mini-stat"><strong>${stats.fuerza}</strong>FUE</div>
        <div class="mini-stat"><strong>${stats.inteligencia}</strong>INT</div>
        <div class="mini-stat"><strong>${stats.agilidad}</strong>AGI</div>
        <div class="mini-stat"><strong>${stats.resistencia}</strong>RES</div>
        <div class="mini-stat"><strong>${stats.espiritu}</strong>ESP</div>
      </div>

      <div style="font-size:0.83rem;color:var(--text-secondary);display:flex;flex-direction:column;gap:0.35rem;margin-bottom:1rem;">
        <div><strong>Alias:</strong> ${escapeHtml(ch.descripcion.alias)}</div>
        <div><strong>Habilidades:</strong> ${escapeHtml(ch.descripcion.habilidades)}</div>
        <div><strong>Capítulos donde aparece:</strong> ${ch.capitulos_presente.map((c) => `Cap. ${c}`).join(", ")}</div>
        <div><strong>Ficha Markdown:</strong> <code>saga/personajes/.../${ch.archivo}.md</code></div>
      </div>

      <h4 style="font-size:0.86rem;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:0.5rem;">
        Relaciones Activas (Hasta Cap. ${maxCap})
      </h4>
      <div style="display:flex;flex-direction:column;gap:0.45rem;">
        ${
          rels.length
            ? rels
                .map((r) => {
                  const otherId = r.origen === ch.id ? r.destino : r.origen;
                  return `
                    <div style="background:rgba(30,41,59,0.6);padding:0.5rem 0.7rem;border-radius:8px;font-size:0.8rem;">
                      <strong>${escapeHtml(persMap[otherId] || otherId)}</strong> · <span style="color:var(--accent-gold);">${escapeHtml(
                    r.etiqueta
                  )}</span>
                      <div style="color:var(--text-secondary);margin-top:0.15rem;">${escapeHtml(r.descripcion)}</div>
                    </div>
                  `;
                })
                .join("")
            : `<p style="font-size:0.8rem;color:var(--text-secondary);">Sin relaciones reveladas en este punto de lectura.</p>`
        }
      </div>
    `;
  }

  function renderCharacterCardsGrid() {
    const grid = document.getElementById("characters-catalog-grid");
    if (!grid) return;

    const maxCap = state.spoilerMaxChapter;
    const catFilter = state.characterCategoryFilter;
    const q = state.characterSearch.trim().toLowerCase();

    const filtered = DATA.personajes.filter((ch) => {
      const cat = ch.categoria.toLowerCase();
      const isGrupo = cat.includes("grupo") || cat.includes("entidad");
      const isPrincipal = cat.includes("principal");
      if (catFilter === "principales" && !isPrincipal) return false;
      if (catFilter === "grupos" && !isGrupo) return false;
      if (catFilter === "secundarios" && (isPrincipal || isGrupo)) return false;
      if (q) {
        const hay = `${ch.nombre} ${ch.faccion} ${ch.descripcion.alias}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    grid.innerHTML = filtered
      .map((ch) => {
        const isUnlocked = ch.primera_aparicion <= maxCap;
        const stage = getCharacterProgressiveStage(ch, maxCap);
        const stats = ch.atributos.estadisticas;
        const hex = ch.atributos.hex || "#38bdf8";

        return `
          <article class="char-card ${isUnlocked ? "" : "locked"}" data-select-char-card="${ch.id}">
            <div class="char-top">
              <div class="char-avatar" style="background:${hex};">${isUnlocked ? avatarInner(ch) : "🔒"}</div>
              <div>
                <span class="era-pill">${
                  isUnlocked ? escapeHtml(stage.faccion_visible) : `Se descubre en Cap. ${ch.primera_aparicion}`
                }</span>
                <h4 style="font-size:1.05rem;margin-top:0.2rem;">${escapeHtml(ch.nombre)}</h4>
                <small style="color:var(--text-secondary);">${
                  isUnlocked ? escapeHtml(stage.rol_visible) : "Bloqueado por control Anti-Spoilers"
                }</small>
              </div>
            </div>
            <p style="font-size:0.86rem;color:var(--text-secondary);flex:1;">
              ${
                isUnlocked
                  ? escapeHtml(stage.bio)
                  : `Avanza tu lectura o el control de spoilers al Capítulo ${ch.primera_aparicion} para desbloquear su biografía sin spoilers.`
              }
            </p>
            <div class="stat-bars">
              <div class="mini-stat"><strong>${stats.fuerza}</strong>FUE</div>
              <div class="mini-stat"><strong>${stats.inteligencia}</strong>INT</div>
              <div class="mini-stat"><strong>${stats.agilidad}</strong>AGI</div>
              <div class="mini-stat"><strong>${stats.resistencia}</strong>RES</div>
              <div class="mini-stat"><strong>${stats.espiritu}</strong>ESP</div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // --- Gems & Lore / Handwritten Notes Section ---
  function renderGemsAndLore() {
    const gemsGrid = document.getElementById("gems-catalog-grid");
    if (gemsGrid) {
      gemsGrid.innerHTML = (DATA.gemas || [])
        .map(
          (g) => `
          <article class="gem-card" style="border-top: 3px solid ${g.hex};">
            <div class="gem-orb" style="background:${g.hex};color:${g.hex};"></div>
            <span class="era-pill" style="margin-bottom:0.4rem;display:inline-block;">${escapeHtml(g.valor)}</span>
            <h3 style="font-size:1.1rem;margin-bottom:0.4rem;">${escapeHtml(g.nombre)}</h3>
            <p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:0.75rem;">${escapeHtml(
              g.descripcion
            )}</p>
            <div style="font-size:0.78rem;color:var(--text-secondary);border-top:1px solid var(--border-color);padding-top:0.6rem;">
              <div><strong>Templo / Ubicación:</strong> ${escapeHtml(g.templo)}</div>
              <div><strong>Portador Canon:</strong> ${escapeHtml(g.portador)}</div>
              <div><strong>Guardián:</strong> ${escapeHtml(g.guardian)}</div>
            </div>
          </article>
        `
        )
        .join("");
    }

    renderLoreNotesGrid();
  }

  function renderLoreNotesGrid() {
    const loreGrid = document.getElementById("lore-notes-grid");
    if (!loreGrid) return;

    let customNotes = [];
    try {
      customNotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_NOTES) || "[]");
    } catch (e) {
      customNotes = [];
    }

    const allNotes = [...customNotes, ...(DATA.apuntes_lore || [])];
    loreGrid.innerHTML = allNotes
      .map(
        (n) => `
        <article class="lore-card">
          ${n.imagen ? `<img src="${n.imagen}" alt="${escapeHtml(n.titulo)}" loading="lazy" />` : ""}
          <div>
            <span class="era-pill">${escapeHtml(n.categoria)} · ${escapeHtml(n.fecha_registro)}</span>
            <h3 style="font-size:1.08rem;margin-top:0.35rem;">${escapeHtml(n.titulo)}</h3>
          </div>
          <p style="font-size:0.86rem;color:var(--text-primary);background:rgba(0,0,0,0.28);padding:0.75rem;border-radius:8px;white-space:pre-line;">${escapeHtml(
            n.contenido
          )}</p>
          <p style="font-size:0.8rem;color:var(--accent-cyan);">
            <strong>Conexión con el Canon:</strong> ${escapeHtml(n.analisis_canon)}
          </p>
        </article>
      `
      )
      .join("");
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // --- Event Listeners Setup ---
  function initEventListeners() {
    document.body.addEventListener("click", (e) => {
      const target = e.target.closest("[data-view],[data-action],[data-select-chapter],[data-theme-btn],[data-tts-from],[data-bookmark-para],[data-jump-bookmark-cap],[data-remove-bookmark],[data-node-char],[data-select-char-card],[data-inspect-char],[data-unlock-spoiler],[data-char-cat]");
      if (!target) return;

      if (target.dataset.view) {
        switchView(target.dataset.view);
        return;
      }

      if (target.dataset.action === "continue-reading") {
        switchView("reader");
        loadChapter(state.currentChapterIdx, state.currentParagraphNum, true);
        return;
      }

      if (target.dataset.action === "open-reader") {
        switchView("reader");
        loadChapter(state.currentChapterIdx, 1, true);
        return;
      }

      if (target.dataset.action === "open-lore") {
        switchView("lore");
        return;
      }

      if (target.dataset.selectChapter !== undefined) {
        loadChapter(Number(target.dataset.selectChapter), 1, true);
        return;
      }

      if (target.dataset.themeBtn) {
        state.readerPrefs.theme = target.dataset.themeBtn;
        saveReaderPrefs();
        return;
      }

      if (target.dataset.ttsFrom !== undefined) {
        startTTSFromParagraph(Number(target.dataset.ttsFrom));
        return;
      }

      if (target.dataset.bookmarkPara !== undefined) {
        toggleBookmark(state.currentChapterIdx, Number(target.dataset.bookmarkPara));
        return;
      }

      if (target.dataset.jumpBookmarkCap !== undefined) {
        const capIdx = Number(target.dataset.jumpBookmarkCap);
        const pNum = Number(target.dataset.jumpBookmarkPara || 1);
        switchView("reader");
        loadChapter(capIdx, pNum, true);
        return;
      }

      if (target.dataset.removeBookmark) {
        state.bookmarks = state.bookmarks.filter((b) => b.id !== target.dataset.removeBookmark);
        saveBookmarks();
        loadChapter(state.currentChapterIdx, state.currentParagraphNum, false);
        return;
      }

      if (target.dataset.nodeChar || target.dataset.selectCharCard) {
        state.selectedCharacterId = target.dataset.nodeChar || target.dataset.selectCharCard;
        renderRelationshipGraphSVG();
        renderCharacterSpotlight(state.selectedCharacterId);
        return;
      }

      if (target.dataset.inspectChar) {
        state.selectedCharacterId = target.dataset.inspectChar;
        switchView("characters");
        return;
      }

      if (target.dataset.unlockSpoiler !== undefined) {
        state.spoilerSyncWithReader = false;
        state.spoilerMaxChapter = Number(target.dataset.unlockSpoiler);
        renderCharacterExplorer();
        return;
      }

      if (target.dataset.charCat) {
        state.characterCategoryFilter = target.dataset.charCat;
        document.querySelectorAll("[data-char-cat]").forEach((b) => {
          b.classList.toggle("active", b.dataset.charCat === state.characterCategoryFilter);
        });
        renderCharacterCardsGrid();
      }
    });

    // Font size & family buttons
    document.getElementById("btn-font-dec")?.addEventListener("click", () => {
      state.readerPrefs.fontSizeRem = Math.max(0.9, Number((state.readerPrefs.fontSizeRem - 0.08).toFixed(2)));
      saveReaderPrefs();
    });
    document.getElementById("btn-font-inc")?.addEventListener("click", () => {
      state.readerPrefs.fontSizeRem = Math.min(1.55, Number((state.readerPrefs.fontSizeRem + 0.08).toFixed(2)));
      saveReaderPrefs();
    });
    document.getElementById("btn-toggle-font")?.addEventListener("click", () => {
      state.readerPrefs.fontFamily = state.readerPrefs.fontFamily === "serif" ? "sans" : "serif";
      saveReaderPrefs();
    });

    // Bookmarks drawer toggle
    document.getElementById("btn-toggle-bookmarks")?.addEventListener("click", () => {
      document.getElementById("bookmarks-drawer")?.classList.toggle("open");
    });

    // Spoiler slider
    const spoilerSlider = document.getElementById("spoiler-chapter-slider");
    if (spoilerSlider) {
      spoilerSlider.addEventListener("input", (e) => {
        state.spoilerSyncWithReader = false;
        state.spoilerMaxChapter = Number(e.target.value);
        renderCharacterExplorer();
      });
    }

    document.getElementById("btn-spoiler-all")?.addEventListener("click", () => {
      state.spoilerSyncWithReader = false;
      state.spoilerMaxChapter = 10;
      renderCharacterExplorer();
    });

    document.getElementById("char-search-input")?.addEventListener("input", (e) => {
      state.characterSearch = e.target.value || "";
      renderCharacterCardsGrid();
    });

    // Audio / TTS controls
    document.getElementById("btn-audio-play")?.addEventListener("click", togglePlayPauseTTS);
    document.getElementById("btn-audio-stop")?.addEventListener("click", stopTTS);
    document.getElementById("btn-audio-prev")?.addEventListener("click", () => {
      if (state.tts.playing && state.tts.paraIndex > 0) {
        window.speechSynthesis.cancel();
        state.tts.paraIndex -= 1;
        speakCurrentParagraph();
      }
    });
    document.getElementById("btn-audio-next")?.addEventListener("click", () => {
      if (state.tts.playing) {
        window.speechSynthesis.cancel();
        state.tts.paraIndex += 1;
        speakCurrentParagraph();
      }
    });
    document.getElementById("tts-rate-select")?.addEventListener("change", (e) => {
      state.tts.rate = Number(e.target.value || 1.0);
      if (state.tts.playing && !state.tts.paused) {
        window.speechSynthesis.cancel();
        speakCurrentParagraph();
      }
    });

    // MP3 Selector
    const mp3Select = document.getElementById("mp3-track-select");
    const mp3Player = document.getElementById("native-mp3-player");
    if (mp3Select && mp3Player) {
      mp3Select.addEventListener("change", (e) => {
        const src = e.target.value;
        if (!src) {
          mp3Player.pause();
          mp3Player.style.display = "none";
          return;
        }
        stopTTS();
        mp3Player.src = src;
        mp3Player.style.display = "inline-block";
        mp3Player.play().catch(() => {});
      });
    }

    // Handwritten notes photo preview uploader
    const fileInput = document.getElementById("handwritten-photo-input");
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const noteTitle = prompt(
              `Título para la fotografía "${file.name}":`,
              file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")
            );
            const noteDesc = prompt(
              "Escribe una nota rápida o transcripción de este apunte a mano:",
              "Apunte a mano del lore de Proyecto Protón."
            );
            let customNotes = [];
            try {
              customNotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_NOTES) || "[]");
            } catch (err) {
              customNotes = [];
            }
            customNotes.unshift({
              id: "local_" + Date.now(),
              titulo: noteTitle || file.name,
              categoria: "Apunte a Mano (Vista Previa)",
              fecha_registro: new Date().toLocaleDateString("es-CR"),
              contenido: noteDesc || "Sin descripción adicional.",
              analisis_canon:
                "Recuerda guardar también el archivo en saga/lore_y_apuntes/fotos_apuntes_mano/ o subirlo al chat para transcribirlo al Canon.",
              imagen: ev.target.result,
            });
            try {
              localStorage.setItem(STORAGE_KEYS.CUSTOM_NOTES, JSON.stringify(customNotes));
            } catch (err) {
              alert("La imagen es muy grande para localStorage, pero puedes colocarla directamente en saga/lore_y_apuntes/fotos_apuntes_mano/.");
            }
            renderLoreNotesGrid();
          };
          reader.readAsDataURL(file);
        });
      });
    }
  }

  // --- Bootstrap ---
  function init() {
    loadPersistedState();
    applyReaderPrefs();
    renderHomeStatsAndSaga();
    renderBookmarksDrawer();
    loadChapter(state.currentChapterIdx, state.currentParagraphNum, false);
    renderCharacterExplorer();
    renderGemsAndLore();
    initEventListeners();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
