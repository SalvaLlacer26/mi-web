/* dfm.js — Fabricación Mecánica — visor 3D (model-viewer + glTF), pager PDF, tolerancias ISO 286, base de materiales, vídeo cabrestante, drag-it */

(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Carga de <model-viewer> (Google) + modelos glTF embebidos como data-URI ──
     Bajo file:// Chrome bloquea fetch de ficheros locales, por eso el modelo viaja
     dentro de un <script src> clásico (dfm/models/*.js) y se sirve como blob/data. */
  var MV_CDN = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
  var MV_LOCAL = "dfm/lib/model-viewer.min.js";
  var mvPromise = null;

  function loadScript(src, opts) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src;
      if (opts && opts.module) s.type = "module";
      if (opts && opts.async !== false) s.async = true;
      s.onload = res; s.onerror = function () { rej(new Error("load " + src)); };
      document.head.appendChild(s);
    });
  }

  function ensureModelViewer() {
    if (window.customElements && customElements.get("model-viewer")) return Promise.resolve();
    if (mvPromise) return mvPromise;
    mvPromise = loadScript(MV_CDN, { module: true, async: false })
      .catch(function () { return loadScript(MV_LOCAL, { module: true, async: false }); })
      .then(function () {
        if (!window.customElements || !customElements.get("model-viewer")) throw new Error("model-viewer no disponible");
      });
    return mvPromise;
  }

  function loadModelData(id) {
    if (window.DFM_MODELS && window.DFM_MODELS[id]) return Promise.resolve(window.DFM_MODELS[id]);
    return loadScript("dfm/models/" + id + ".js").then(function () {
      var u = window.DFM_MODELS && window.DFM_MODELS[id];
      if (!u) throw new Error("modelo " + id + " no disponible");
      return u;
    });
  }

  /* ── Visor 3D individual (<model-viewer>) ── */
  function initV3D(box) {
    var id = box.getAttribute("data-mv");
    if (!id) return;
    var carg = box.querySelector(".v3d__cargando");
    var err = box.querySelector(".v3d__err");
    var canvas = box.querySelector(".v3d__canvas");
    var started = false;

    function fail(msg) {
      box.classList.add("is-err"); box.classList.remove("is-ok");
      if (err) err.textContent = msg || "No se pudo cargar el modelo 3D.";
      if (carg) carg.style.display = "none";
    }

    function start() {
      if (started) return;
      started = true;
      ensureModelViewer()
        .then(function () { return loadModelData(id); })
        .then(function (src) {
          if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
          var mv = document.createElement("model-viewer");
          mv.className = "v3d__mv";
          mv.setAttribute("src", src);
          mv.setAttribute("alt", "Modelo 3D " + id);
          mv.setAttribute("camera-controls", "");
          mv.setAttribute("touch-action", "pan-y");
          mv.setAttribute("interaction-prompt", "none");
          mv.setAttribute("shadow-intensity", "1");
          mv.setAttribute("exposure", "0.95");
          mv.setAttribute("camera-orbit", box.getAttribute("data-mv-orbit") || "20deg 74deg 76%");
          box.appendChild(mv);

          mv.addEventListener("progress", function (e) {
            var d = e.detail;
            if (carg && d && typeof d.totalProgress === "number" && d.totalProgress < 1) {
              carg.textContent = "Cargando modelo 3D… " + Math.round(d.totalProgress * 100) + "%";
            }
          });
          mv.addEventListener("load", function () {
            box.classList.remove("is-err");
            box.classList.add("is-ok");
            if (carg) carg.style.display = "none";
          });
          mv.addEventListener("error", function () { fail(); });
        })
        .catch(function (e) {
          console.warn("v3d:", e);
          fail();
        });
    }

    if (!("IntersectionObserver" in window)) { start(); return; }
    var io = new IntersectionObserver(function (ents) {
      for (var i = 0; i < ents.length; i++) {
        if (ents[i].isIntersecting) { start(); io.disconnect(); break; }
      }
    }, { rootMargin: "260px 0px" });
    io.observe(box);
  }

  /* ── Pager de PDFs (planos cabrestante) ── */
  function initPager(box) {
    var files = [];
    try { files = JSON.parse(box.getAttribute("data-pdf-files") || "[]"); } catch (e) { files = []; }
    var total = files.length;
    var iframe = box.querySelector(".pdf-view");
    var btnPrev = box.querySelector("[data-pager-prev]");
    var btnNext = box.querySelector("[data-pager-next]");
    var info = box.querySelector("[data-pager-info]");
    var sel = box.querySelector("[data-pager-sel]");
    var i = parseInt(box.getAttribute("data-pager-start"), 10) || 1;
    if (i < 1) i = 1; if (i > total) i = total;

    function render() {
      if (iframe && files[i - 1]) iframe.src = files[i - 1] + "#page=1&toolbar=0&navpanes=0&statusbar=0&scrollbar=0&view=Fit";
      if (info) info.innerHTML = "<b>" + i + "</b> / " + total;
      if (btnPrev) btnPrev.disabled = i <= 1;
      if (btnNext) btnNext.disabled = i >= total;
      if (sel) sel.value = String(i);
    }
    if (sel) {
      files.forEach(function (f, n) {
        var o = document.createElement("option");
        o.value = String(n + 1);
        o.textContent = "Plano " + (n + 1 < 10 ? "0" + (n + 1) : (n + 1));
        sel.appendChild(o);
      });
      sel.addEventListener("change", function () { i = parseInt(sel.value, 10) || 1; render(); });
    }
    if (btnPrev) btnPrev.addEventListener("click", function () { if (i > 1) { i--; render(); } });
    if (btnNext) btnNext.addEventListener("click", function () { if (i < total) { i++; render(); } });
    render();
  }

  /* ── Tolerancias ISO 286-2 (tablas oficiales, base agujero H) ── */
  var ISO_MIN = 3, ISO_MAX = 400;
  var GRADES = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  var IT_T = [
    [  6,  5,  8, 12, 18, 30,  48,  75, 120, 180,  300],
    [ 10,  6,  9, 15, 22, 36,  58,  90, 150, 220,  360],
    [ 18,  8, 11, 18, 27, 43,  70, 110, 180, 270,  430],
    [ 30,  9, 13, 21, 33, 52,  84, 130, 210, 330,  520],
    [ 50, 11, 16, 25, 39, 62, 100, 160, 250, 390,  620],
    [ 80, 13, 19, 30, 46, 74, 120, 190, 300, 460,  740],
    [120, 15, 22, 35, 54, 87, 140, 220, 350, 540,  870],
    [180, 18, 25, 40, 63,100, 160, 250, 400, 630, 1000],
    [250, 20, 29, 46, 72,115, 185, 290, 460, 720, 1150],
    [315, 23, 32, 52, 81,130, 210, 320, 520, 810, 1300],
    [400, 25, 36, 57, 89,140, 230, 360, 570, 890, 1400]
  ];
  var FD = {
    d: [-30,-40,-50,-65,-80,-100,-120,-145,-170,-190,-210],
    e: [-20,-25,-32,-40,-50, -60, -72, -85,-100,-110,-125],
    f: [-10,-13,-16,-20,-25, -30, -36, -43, -50, -56, -62],
    g: [ -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18],
    h: [  0,  0,  0,  0,  0,   0,   0,   0,   0,   0,   0],
    k: [  1,  1,  1,  2,  2,   2,   3,   3,   4,   4,   4],
    m: [  4,  6,  7,  8,  9,  11,  13,  15,  17,  20,  21],
    n: [  8, 10, 12, 15, 17,  20,  23,  27,  31,  34,  37],
    p: [ 12, 15, 18, 22, 26,  32,  37,  43,  50,  56,  62],
    r: [ 15, 19, 23, 28, 34,  41,  43,  51,  54,  63,  65]
  };
  var HOLES = ["H5","H6","H7","H8","H9","H10","H11","H12","JS6","JS7","JS8"];
  var SHAFTS = ["d9","e7","e8","f6","f7","g5","g6","g7","h5","h6","h7","h8","h9","js6","js7","k5","k6","k7","m5","m6","m7","n5","n6","n7","p6","p7","r6","r7"];

  function isoRangeIdx(d) {
    if (d < ISO_MIN || d > ISO_MAX) return -1;
    for (var i = 0; i < IT_T.length; i++) if (d <= IT_T[i][0]) return i;
    return -1;
  }
  function parseCls(c) {
    var m = /^([A-Za-z]{1,2})(\d{1,2})$/.exec(c || "");
    if (!m) return null;
    var raw = m[1], letter = raw.toLowerCase(), grade = parseInt(m[2], 10);
    var gi = GRADES.indexOf(grade);
    if (gi < 0) return null;
    return { raw: raw, letter: letter, grade: grade, gi: gi };
  }
  function limits(code, d, isHole) {
    var c = parseCls(code);
    if (!c) return null;
    var ri = isoRangeIdx(d);
    if (ri < 0) return null;
    var IT = IT_T[ri][c.gi + 1];
    var up, lo;
    if (isHole) {
      if (c.raw !== c.raw.toUpperCase()) return null;
      if (c.raw === "H") { lo = 0; up = IT; }
      else if (c.raw === "JS") { up = IT / 2; lo = -IT / 2; }
      else return null;
    } else {
      if (c.raw !== c.raw.toLowerCase()) return null;
      if (c.raw === "js") { up = IT / 2; lo = -IT / 2; }
      else if (c.raw === "h") { up = 0; lo = -IT; }
      else {
        var row = FD[c.letter];
        if (!row) return null;
        var fd = row[ri];
        if ("defg".indexOf(c.letter) >= 0) { up = fd; lo = fd - IT; }
        else { lo = fd; up = fd + IT; }
      }
    }
    return { code: code, IT: IT, up: up, lo: lo, range: IT_T[ri][0] };
  }
  function fmtUm(v) { return (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v); }
  function fmtMm(v) { return (Math.round(v * 1000) / 1000).toFixed(3); }
  function dato(l, v) { return '<div class="api__dato"><b>' + l + "</b><span>" + v + "</span></div>"; }

  function initTol() {
    var form = document.querySelector("[data-tol-form]");
    if (!form) return;
    var din = form.querySelector("[data-tol-d]");
    var selH = form.querySelector("[data-tol-h]");
    var selS = form.querySelector("[data-tol-s]");
    var estado = form.querySelector("[data-tol-estado]");
    var res = form.querySelector("[data-tol-res]");
    var L = function (k, d) { return form.getAttribute(k) || d; };

    HOLES.forEach(function (c) { var o = document.createElement("option"); o.value = c; o.textContent = c; selH.appendChild(o); });
    SHAFTS.forEach(function (c) { var o = document.createElement("option"); o.value = c; o.textContent = c; selS.appendChild(o); });
    selH.value = "H7"; selS.value = "h6";

    function calc() {
      var d = parseFloat(din && din.value);
      if (!d || d < ISO_MIN || d > ISO_MAX) {
        estado.textContent = L("data-tol-err", "Introduce un \u00d8 entre " + ISO_MIN + " y " + ISO_MAX + " mm.");
        res.innerHTML = ""; return;
      }
      var H = limits(selH.value, d, true);
      var S = limits(selS.value, d, false);
      if (!H || !S) { estado.textContent = L("data-tol-err", "Clase no disponible."); res.innerHTML = ""; return; }
      var hMax = d + H.up / 1000, hMin = d + H.lo / 1000;
      var sMax = d + S.up / 1000, sMin = d + S.lo / 1000;
      var maxCl = hMax - sMin, minCl = hMin - sMax;
      var tipo = minCl > 0 ? L("data-tol-l-holg", "Holgura") : maxCl < 0 ? L("data-tol-l-prensa", "Interferencia") : L("data-tol-l-trans", "Transici\u00f3n");
      estado.textContent = "\u00d8" + fmtMm(d) + " " + H.code + " / " + S.code + " \u00b7 " + tipo;
      res.innerHTML =
        dato(L("data-tol-l-hueco", "Agujero " + H.code), fmtMm(hMin) + " \u2013 " + fmtMm(hMax) + " mm") +
        dato(L("data-tol-l-hdev", "Desviaciones ES / EI"), fmtUm(H.up) + " / " + fmtUm(H.lo) + " \u00b5m") +
        dato(L("data-tol-l-hit", "Tolerancia IT"), H.IT + " \u00b5m") +
        dato(L("data-tol-l-eje", "Eje " + S.code), fmtMm(sMin) + " \u2013 " + fmtMm(sMax) + " mm") +
        dato(L("data-tol-l-sdev", "Desviaciones es / ei"), fmtUm(S.up) + " / " + fmtUm(S.lo) + " \u00b5m") +
        dato(L("data-tol-l-cl", "Holgura m\u00e1x / m\u00edn"), (maxCl > 0 ? "+" : "") + fmtMm(maxCl) + " / " + (minCl > 0 ? "+" : "") + fmtMm(minCl) + " mm") +
        dato(L("data-tol-l-range", "Tramo nominal"), "\u2264 " + H.range + " mm") +
        dato(L("data-tol-l-norm", "Norma"), "ISO 286-2:2010");
    }
    form.addEventListener("submit", function (e) { e.preventDefault(); calc(); });
    [din, selH, selS].forEach(function (el) { if (el) el.addEventListener("change", calc); });
    calc();
  }

  /* ── Base de materiales de ingeniería ── */
  var MATS = [
    ["Acero S235JR (A36)",7.85,200,77,0.29,235,360,120,"Estructuras, soldadura"],
    ["Acero C45 (1045)",7.85,205,80,0.29,370,630,180,"Ejes, cigüeñales"],
    ["Acero 42CrMo4 (4140)",7.85,205,80,0.29,650,900,28,"Transmisión, alto carga"],
    ["Acero 20MnCr5",7.85,206,80,0.29,735,1080,60,"Engranajes cementados"],
    ["Acero inox 1.4301 (304)",7.93,193,74,0.29,215,520,150,"Alimentos, ambiente"],
    ["Acero inox 1.4404 (316L)",7.99,193,74,0.29,200,520,150,"Marino, química"],
    ["Acero inox 1.4057 (17-4PH)",7.80,196,77,0.30,1100,1310,42,"Ejes resistentes"],
    ["Hierro gris GJL-250",7.20,110,42,0.26,0,250,180,"Bancos, carcasas"],
    ["Aluminio 6061-T6",2.70,69,26,0.33,276,310,95,"Mecanizado, estructura"],
    ["Aluminio 7075-T6",2.81,72,27,0.33,503,572,150,"Aeroespacial, mordazas"],
    ["Aluminio 5083",2.66,71,27,0.33,228,320,75,"Chapa marina, soldable"],
    ["Aluminio AlSi10Mg",2.67,71,26,0.33,160,230,75,"Fundición, aditiva"],
    ["Titanio Gr.2 CP",4.51,105,40,0.34,275,350,160,"Corrosión, calor"],
    ["Titanio Ti-6Al-4V (Gr.5)",4.43,114,44,0.34,880,950,350,"Aeroespacial, médico"],
    ["Latón CuZn39Pb3 (C360)",8.50,97,37,0.31,310,470,130,"Tornillería, automática"],
    ["Bronce CuSn12",8.80,110,41,0.34,170,300,90,"Cojinetes, bujes"],
    ["Cobre ETP",8.96,117,44,0.34,70,220,45,"Eléctrico, intercambiadores"],
    ["Zamak Z400",6.70,96,37,0.29,100,280,80,"Fundición a presión"],
    ["POM (Delrin)",1.41,3.1,1.2,0.37,65,70,80,"Piezas precisionadas"],
    ["Nylon PA66",1.14,3.0,1.1,0.39,80,85,80,"Engranajes, guías"],
    ["ABS",1.04,2.3,0.9,0.35,43,45,100,"Carcasas, moldeo"],
    ["PEI Ultem 1000",1.27,3.3,1.3,0.37,85,90,90,"Térmica, aeroespacial"],
    ["PLA",1.24,3.5,1.3,0.36,50,60,80,"Impresión 3D"],
    ["PEEK",1.32,4.1,1.6,0.38,100,100,95,"Alto rendimiento"]
  ];
  var MAT_L = {den:"Densidad",E:"Módulo E",G:"Módulo G",nu:"Poisson",sy:"Límite elástico",su:"Resist. tracción",hb:"Dureza",use:"Uso típico"};

  function initMat() {
    var form = document.querySelector("[data-mat-form]");
    if (!form) return;
    var sel = form.querySelector("[data-mat-sel]");
    var q = form.querySelector("[data-mat-q]");
    var estado = form.querySelector("[data-mat-estado]");
    var res = form.querySelector("[data-mat-res]");
    var L = function (k, d) { return form.getAttribute(k) || d; };
    var idx = 0;
    function LMAT(k, d) { return form.getAttribute("data-mat-l-" + k) || d; }

    function render() {
      var m = MATS[idx];
      if (!m) { estado.textContent = L("data-mat-err", "Sin resultados."); res.innerHTML = ""; return; }
      estado.textContent = m[0];
      res.innerHTML =
        dato(LMAT("den", MAT_L.den), m[1] + " g/cm³") +
        dato(LMAT("E", MAT_L.E), m[2] + " GPa") +
        dato(LMAT("G", MAT_L.G), m[3] + " GPa") +
        dato(LMAT("nu", MAT_L.nu), m[4]) +
        dato(LMAT("sy", MAT_L.sy), m[5] ? m[5] + " MPa" : "—") +
        dato(LMAT("su", MAT_L.su), m[6] + " MPa") +
        dato(LMAT("hb", MAT_L.hb), m[7] + " HB") +
        dato(LMAT("use", MAT_L.use), m[8]);
    }

    function fill(filter) {
      var f = (filter || "").toLowerCase().trim();
      sel.innerHTML = "";
      MATS.forEach(function (m, i) {
        if (f && (m[0] + " " + m[8]).toLowerCase().indexOf(f) < 0) return;
        var o = document.createElement("option");
        o.value = String(i); o.textContent = m[0];
        sel.appendChild(o);
      });
      if (sel.options.length) { idx = parseInt(sel.options[0].value, 10); sel.value = sel.options[0].value; render(); }
      else { idx = -1; estado.textContent = L("data-mat-err", "Sin resultados."); res.innerHTML = ""; }
    }
    sel.addEventListener("change", function () { idx = parseInt(sel.value, 10); render(); });
    if (q) q.addEventListener("input", function () { fill(q.value); });
    form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
    fill("");
  }

  /* ── Vídeo cabrestante (play/pausa + barra de progreso) ── */
  function initVideo(box) {
    var v = box.querySelector("video");
    var btn = box.querySelector("[data-v-play]");
    var prog = box.querySelector("[data-v-prog]");
    var fill = prog && prog.querySelector("i");
    var t = box.querySelector("[data-v-t]");
    if (!v) return;
    function fmt(s) {
      s = Math.max(0, s | 0);
      var m = (s / 60) | 0, r = s % 60;
      return m + ":" + (r < 10 ? "0" : "") + r;
    }
    function icon(playing) {
      if (!btn) return;
      btn.innerHTML = playing
        ? '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      btn.setAttribute("aria-label", playing ? "Pausar" : "Reproducir");
    }
    btn && btn.addEventListener("click", function () {
      if (v.paused) { v.play(); } else { v.pause(); }
    });
    v.addEventListener("play", function () { icon(true); });
    v.addEventListener("pause", function () { icon(false); });
    v.addEventListener("timeupdate", function () {
      if (fill && v.duration) fill.style.width = (v.currentTime / v.duration * 100) + "%";
      if (t) t.textContent = fmt(v.currentTime) + " / " + fmt(v.duration || 0);
    });
    prog && prog.addEventListener("click", function (e) {
      var r = prog.getBoundingClientRect();
      var p = (e.clientX - r.left) / r.width;
      if (v.duration) v.currentTime = p * v.duration;
    });
    icon(false);

    if (v.muted || v.hasAttribute("muted")) v.muted = true;
    if ("IntersectionObserver" in window) {
      var vio = new IntersectionObserver(function (ents) {
        for (var n = 0; n < ents.length; n++) {
          if (ents[n].isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else v.pause();
        }
      }, { threshold: 0.35 });
      vio.observe(box);
    } else {
      var pr0 = v.play(); if (pr0 && pr0.catch) pr0.catch(function () {});
    }
  }

  /* ── Drag-it (índice): persiana negra que sube con la rueda o arrastrando ── */
  function initDrag() {
    var box = document.querySelector("[data-dragvid]");
    if (!box) return;
    var vid = box.querySelector(".dragvid__video");
    var rev = 0, abierto = false;

    var setRev = function (r) {
      rev = Math.max(0, Math.min(1, r));
      box.style.setProperty("--rev", rev.toFixed(3));
      box.classList.toggle("is-open", rev > 0.55);
      if (rev >= 0.999) abierto = true;
      if (vid) {
        if (rev > 0.45) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
        else { vid.pause(); }
      }
    };
    setRev(0);

    var range = box.querySelector("[data-drag-range]");
    if (range) range.addEventListener("input", function () { setRev(parseInt(range.value, 10) / 100); });

    var acc = 0, wheelT = null;
    box.addEventListener("wheel", function (e) {
      if (abierto) return;
      var slide = box.closest ? box.closest(".bn__slide") : null;
      if (slide && !slide.classList.contains("is-on")) return;
      if (e.deltaY >= 0) { acc = 0; return; }
      if (e.cancelable) e.preventDefault();
      acc += -e.deltaY;
      setRev(rev + acc / (box.clientHeight || 420));
      clearTimeout(wheelT);
      wheelT = setTimeout(function () { acc = 0; }, 160);
    }, { passive: false });

    var startY = null, base = 0, axis = "";
    box.addEventListener("pointerdown", function (e) {
      if (abierto) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      startY = e.clientY; axis = "";
      base = rev;
    });
    box.addEventListener("pointermove", function (e) {
      if (startY === null) return;
      var dy = startY - e.clientY;
      if (!axis) {
        if (Math.abs(dy) < 6) return;
        axis = Math.abs(dy) > Math.abs(e.movementX || 0) ? "y" : "x";
      }
      if (axis !== "y") return;
      setRev(base + dy / (box.clientHeight || 320));
    });
    var end = function () {
      if (startY === null) return;
      startY = null;
      if (axis === "y") setRev(rev > 0.4 ? 1 : 0);
    };
    box.addEventListener("pointerup", end);
    box.addEventListener("pointercancel", end);
  }

  /* ── Arranque diferido por presencia de nodos ── */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-mv]").forEach(initV3D);
    document.querySelectorAll("[data-pdf-files]").forEach(initPager);
    initTol();
    initMat();
    document.querySelectorAll("[data-vidfab]").forEach(initVideo);
    initDrag();
  });
})();
