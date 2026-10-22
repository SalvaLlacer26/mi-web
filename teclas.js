(() => {
  "use strict";
  const root = document.querySelector("[data-teclas]");
  if (!root) return;
  const html = document.documentElement;
  const lang = () => html.getAttribute("lang") || "es";
  const DICT = {
    es: {
      "ctl.jugar": "Jugar", "ctl.facil": "Fácil", "ctl.medio": "Medio", "ctl.dificil": "Difícil",
      "ctl.ronda": "Ronda", "ctl.mira": "Mira la secuencia…", "ctl.toca": "¡Te toca!",
      "ctl.win": "¡Bien! Siguiente ronda…", "ctl.ayuda": "Teclado: A S D F G · W E para las negras · o toca las teclas",
      "ctl.prepara": "Preparado…"
    },
    en: {
      "ctl.jugar": "Play", "ctl.facil": "Easy", "ctl.medio": "Medium", "ctl.dificil": "Hard",
      "ctl.ronda": "Round", "ctl.mira": "Watch the sequence…", "ctl.toca": "Your turn!",
      "ctl.win": "Nice! Next round…", "ctl.ayuda": "Keyboard: A S D F G · W E for the black keys · or tap the keys",
      "ctl.prepara": "Ready…"
    }
  };
  const L = k => (DICT[lang()] || DICT.es)[k] || k;

  const $ = sel => root.querySelector(sel);
  const $$ = sel => [...root.querySelectorAll(sel)];

  const menuEl = $("[data-tn-menu]");
  const overEl = $("[data-tn-over]");
  const estadoEl = $("[data-tn-estado]");
  const pianoEl = $("[data-tn-piano]");
  const notasEl = $("[data-tn-notas]");
  const staffEl = $("[data-tn-staff]");
  const rondaEl = $("[data-tn-ronda]");
  const bpmEl = $("[data-tn-bpm]");
  const tiempoBarra = $("[data-tn-tiempo]");
  const beatDots = $$("[data-tn-beat]");

  const WHITES = ["C3","D3","E3","F3","G3","A3","B3","C4","D4","E4","F4","G4","A4","B4","C5"];
  const BLACKS = [
    { name:"C#3", after:0 }, { name:"D#3", after:1 },
    { name:"F#3", after:3 }, { name:"G#3", after:4 }, { name:"A#3", after:5 },
    { name:"C#4", after:7 }, { name:"D#4", after:8 },
    { name:"F#4", after:10 }, { name:"G#4", after:11 }, { name:"A#4", after:12 }
  ];
  const FREQ = (() => {
    const m = { C:0,"C#":1,D:2,"D#":3,E:4,F:5,"F#":6,G:7,"G#":8,A:9,"A#":10,B:11 };
    const f = {};
    WHITES.concat(BLACKS.map(b => b.name)).forEach(n => {
      const mm = n.match(/^([A-G]#?)(\d)$/);
      const semi = m[mm[1]] + 12 * (+mm[2] + 1);
      f[n] = 440 * Math.pow(2, (semi - 69) / 12);
    });
    return f;
  })();

  const KEYMAP = { a:"C4", s:"D4", d:"E4", f:"F4", g:"G4", w:"C#4", e:"D#4" };

  const DIFS = {
    facil:   { live:["C4","D4","E4"], bpm:66, capBpm:96,  maxNotes:5, startNotes:2 },
    dificil: { live:["C4","D4","E4","F4","G4","C#4","D#4"], bpm:88, capBpm:132, maxNotes:8, startNotes:3 }
  };

  let dif = "facil";
  let state = "menu";
  let estadoKey = "";
  let beatMs = 60000 / DIFS.facil.bpm;
  let nextBeatT = 0, beatIdx = 0, round = 1;
  let seq = [], seqIdx = 0, inputT0 = 0, showEndT = 0;
  let notes = [];
  let rafId = 0, lastT = 0;
  let audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* sin audio */ }
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  }
  function tone(freq, dur, vol, type) {
    if (!audioCtx) return;
    try {
      const t = audioCtx.currentTime;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type || "triangle";
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(audioCtx.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (e) { /* noop */ }
  }
  function tick(beat) { tone(beat % 4 === 0 ? 1000 : 800, 0.04, 0.18, "square"); }
  function pianoSound(name) { tone(FREQ[name] || 440, 0.9, 0.22, "triangle"); }

  function buildPiano() {
    pianoEl.innerHTML = "";
    WHITES.forEach(name => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "teclas__white";
      b.dataset.key = name;
      b.setAttribute("aria-label", name);
      b.tabIndex = -1;
      pianoEl.appendChild(b);
    });
    BLACKS.forEach(bl => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "teclas__black";
      b.dataset.key = bl.name;
      b.setAttribute("aria-label", bl.name);
      b.tabIndex = -1;
      b.style.transform = "translateX(-50%)";
      pianoEl.appendChild(b);
    });
  }

  function refreshLive() {
    const live = new Set(DIFS[dif].live);
    $$(".teclas__white, .teclas__black").forEach(b => {
      const on = live.has(b.dataset.key);
      b.style.display = on ? "" : "none";
      b.classList.toggle("is-live", on);
      b.tabIndex = on ? 0 : -1;
      b.setAttribute("aria-hidden", on ? "false" : "true");
    });
    requestAnimationFrame(posNegras);
  }

  function posNegras() {
    BLACKS.forEach(bl => {
      const el = keyEl(bl.name);
      if (!el || el.style.display === "none") return;
      const ref = keyEl(WHITES[bl.after]);
      if (!ref || ref.style.display === "none") return;
      el.style.left = (ref.offsetLeft + ref.offsetWidth) + "px";
      el.style.width = Math.max(22, Math.round(ref.offsetWidth * 0.6)) + "px";
    });
  }

  function keyEl(name) { return pianoEl.querySelector('[data-key="' + CSS.escape(name) + '"]'); }
  function pressKey(name) {
    const el = keyEl(name);
    if (!el) return;
    el.classList.add("is-down");
    setTimeout(() => el.classList.remove("is-down"), 120);
    pianoSound(name);
    if (state === "input") handleInput(name);
  }

  function setBeat(i) {
    beatDots.forEach((d, k) => d.classList.toggle("is-on", k === i % 4));
  }
  function setEstado(k) { estadoKey = k; estadoEl.textContent = k ? L(k) : ""; }
  function setRonda(n) { rondaEl.textContent = String(n); }
  function setBpm(v) { bpmEl.textContent = String(Math.round(v)); }

  function clearNotes() {
    notes.forEach(n => n.el && n.el.remove());
    notes = [];
    notasEl.innerHTML = "";
    tiempoBarra.style.width = "0%";
  }

  function spawnNote(name, tFrac, staffW) {
    const el = document.createElement("span");
    el.className = "teclas__nota";
    el.textContent = name;
    const wIdx = WHITES.indexOf(name.replace("#", "#"));
    const nat = name.startsWith("C") ? "C" : name.startsWith("D") ? "D" : name.startsWith("E") ? "E" :
                name.startsWith("F") ? "F" : name.startsWith("G") ? "G" : name.startsWith("A") ? "A" : "B";
    const baseIdx = WHITES.indexOf(nat + name.slice(-1));
    const slot = baseIdx >= 7 ? (baseIdx - 7) : baseIdx;
    const yPct = 78 - slot * 9.5 - (name.includes("#") ? 4.2 : 0);
    el.style.top = Math.max(12, Math.min(80, yPct)) + "%";
    el.style.left = "0px";
    el.style.transform = "translateX(" + staffW + "px)";
    notasEl.appendChild(el);
    const note = { name, el, x: staffW, t0: tFrac };
    notes.push(note);
    return note;
  }

  function scrollNotes(dt, speed) {
    const staffW = staffEl.clientWidth || 300;
    notes.forEach(n => {
      if (n.done) return;
      n.x -= speed * dt;
      if (n.x < -34) n.x = -34;
      n.el.style.transform = "translateX(" + n.x + "px)";
    });
  }

  function genSeq(len) {
    const live = DIFS[dif].live;
    const out = [];
    let prev = "";
    while (out.length < len) {
      const pick = live[Math.floor(Math.random() * live.length)];
      if (pick === prev && Math.random() < 0.6) continue;
      out.push(pick); prev = pick;
    }
    return out;
  }

  function startRound() {
    clearNotes();
    beatMs = 60000 / Math.min(DIFS[dif].capBpm, DIFS[dif].bpm + (round - 1) * 2);
    setBpm(beatMs ? 60000 / beatMs : DIFS[dif].bpm);
    const nNotes = Math.min(DIFS[dif].maxNotes, DIFS[dif].startNotes + Math.floor((round - 1) / 2));
    seq = genSeq(nNotes);
    seqIdx = 0;
    setRonda(round);
    state = "show";
    setEstado("ctl.mira");
    beatIdx = 0;
    nextBeatT = performance.now() + 400;
    showEndT = 0;
    const staffW = staffEl.clientWidth || 300;
    const spawnAt = [];
    for (let k = 0; k < seq.length; k++) {
      const tFrac = 1 + (k / seq.length) * 2.2 + Math.random() * 0.25;
      spawnAt.push(tFrac);
    }
    notes = [];
    seq.forEach((name, k) => {
      const note = spawnNote(name, spawnAt[k], staffW);
      note.spawned = false;
      note.el.style.visibility = "hidden";
    });
    startLoop();
  }

  function beginInput(now) {
    state = "input";
    setEstado("ctl.toca");
    inputT0 = now;
    notes.forEach(n => {
      n.spawned = true;
      n.el.style.visibility = "visible";
      n.el.style.transform = "translateX(" + n.x + "px)";
    });
    if (notes[0]) notes[0].el.classList.add("is-cur");
  }

  function handleInput(name) {
    if (seqIdx >= seq.length) return;
    const expect = seq[seqIdx];
    if (name === expect) {
      const n = notes[seqIdx];
      if (n) { n.el.classList.remove("is-cur"); n.el.classList.add("is-ok"); }
      seqIdx++;
      if (seqIdx < seq.length && notes[seqIdx]) notes[seqIdx].el.classList.add("is-cur");
      if (seqIdx >= seq.length) winRound();
    } else {
      gameOver();
    }
  }

  function winRound() {
    state = "win";
    setEstado("ctl.win");
    setTimeout(() => { round++; startRound(); }, 1400);
  }

  function gameOver() {
    state = "over";
    stopLoop();
    setEstado("");
    overEl.hidden = false;
    tiempoBarra.style.width = "0%";
    setTimeout(() => {
      overEl.hidden = true;
      backToMenu();
    }, 2600);
  }

  function backToMenu() {
    state = "menu";
    round = 1;
    clearNotes();
    setRonda(1);
    setBpm(DIFS[dif].bpm);
    setEstado("");
    menuEl.hidden = false;
    stopLoop();
  }

  function startLoop() {
    if (rafId) return;
    lastT = performance.now();
    const loop = now => {
      rafId = requestAnimationFrame(loop);
      const dt = now - lastT; lastT = now;
      if (state === "show" || state === "input" || state === "win") {
        if (now >= nextBeatT) {
          beatIdx++;
          tick(beatIdx);
          setBeat(beatIdx);
          nextBeatT += beatMs;
          if (state === "show") {
            const staffW = staffEl.clientWidth || 300;
            const speed = staffW / (4.5 * beatMs);
            notes.forEach(n => {
              if (!n.spawned && beatIdx >= Math.floor(n.t0)) {
                n.spawned = true;
                n.el.style.visibility = "visible";
              }
            });
            if (beatIdx >= 4) {
              showEndT = now;
              beginInput(now);
            }
          }
        }
        if (state === "show") {
          const staffW = staffEl.clientWidth || 300;
          const speed = staffW / (4.5 * beatMs);
          scrollNotes(dt, speed);
        } else if (state === "input") {
          const elapsed = now - inputT0;
          const total = 4 * beatMs;
          const pct = Math.min(100, (elapsed / total) * 100);
          tiempoBarra.style.width = pct + "%";
          if (elapsed >= total) gameOver();
        }
      }
    };
    rafId = requestAnimationFrame(loop);
  }
  function stopLoop() { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }

  // Eventos
  menuEl.querySelector("[data-tn-jugar]").addEventListener("click", () => {
    ensureAudio();
    menuEl.hidden = true;
    round = 1;
    startRound();
  });
  $$("[data-tn-dif]").forEach(b => {
    b.addEventListener("click", () => {
      dif = b.dataset.tnDif;
      $$("[data-tn-dif]").forEach(x => x.classList.toggle("is-on", x === b));
      refreshLive();
      setBpm(DIFS[dif].bpm);
      round = 1; setRonda(1);
    });
  });
  pianoEl.addEventListener("pointerdown", e => {
    const b = e.target.closest("[data-key]");
    if (!b) return;
    e.preventDefault();
    ensureAudio();
    if (b.classList.contains("is-live")) pressKey(b.dataset.key);
  });
  window.addEventListener("keydown", e => {
    if (state === "menu" || state === "over") return;
    const k = e.key.toLowerCase();
    if (KEYMAP[k]) {
      e.preventDefault();
      ensureAudio();
      const name = KEYMAP[k];
      if (keyEl(name) && keyEl(name).classList.contains("is-live")) pressKey(name);
    }
  }, { passive: false });

  // i18n dinámico
  function reRender() {
    $$("[data-tn-dif]").forEach(b => { b.textContent = L("ctl." + b.dataset.tnDif); });
    menuEl.querySelector("[data-tn-jugar] .flecha") && (menuEl.querySelector("[data-tn-jugar] span").textContent = L("ctl.jugar"));
    if (state === "menu") setEstado("");
    else setEstado(estadoKey);
  }
  const mo = new MutationObserver(() => { reRender(); });
  mo.observe(html, { attributes: true, attributeFilter: ["lang"] });
  reRender();

  buildPiano();
  refreshLive();
  setBpm(DIFS.facil.bpm);
  setRonda(1);
})();
