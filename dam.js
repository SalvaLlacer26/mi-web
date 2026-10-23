/* dam.js — Programación: Simon (port del sketch original), API GitHub, artículos Dev.to */
(() => {
  const html = document.documentElement;
  const lang = () => html.getAttribute("lang") || "es";
  const DICT = {
    es: {
      "simon.jugar": "Jugar!",
      "simon.aria": "Jugar al Simon",
      "simon.win": "Has ganado!",
      "simon.lose": "Vuelve a intentarlo!",
      "gh.carga": "Cargando repositorios…",
      "gh.error": "No se pudieron cargar los repositorios. Inténtalo de nuevo.",
      "gh.vacio": "Aún no hay repositorios públicos.",
      "devto.carga": "Cargando artículos…",
      "devto.error": "No se pudieron cargar los artículos. Inténtalo de nuevo.",
      "devto.vacio": "La API de Dev.to no ha devuelto artículos. Inténtalo de nuevo.",
      "hn.carga": "Cargando titulares…",
      "hn.error": "No se pudieron cargar los titulares. Inténtalo de nuevo.",
      "hn.vacio": "La API no ha devuelto titulares."
    },
    en: {
      "simon.jugar": "Play!",
      "simon.aria": "Play Simon",
      "simon.win": "You won!",
      "simon.lose": "Try again!",
      "gh.carga": "Loading repositories…",
      "gh.error": "Could not load the repositories. Try again.",
      "gh.vacio": "There are no public repositories yet.",
      "devto.carga": "Loading articles…",
      "devto.error": "Could not load the articles. Try again.",
      "devto.vacio": "The Dev.to API returned no articles. Try again.",
      "hn.carga": "Loading headlines…",
      "hn.error": "Could not load the headlines. Try again.",
      "hn.vacio": "The API returned no headlines."
    }
  };
  const L = (k) => (DICT[lang()] || DICT.es)[k] || k;
  const renders = [];

  /* ── Simon: port fiel de Simon_vAlpha.pde ── */
  (() => {
    const sim = document.querySelector(".simon");
    if (!sim) return;
    const play = sim.querySelector("[data-simon-play]");
    const jugar = sim.querySelector("[data-simon-jugar]");
    const msg = sim.querySelector("[data-simon-msg]");
    const juego = sim.querySelector("[data-simon-juego]");
    const pads = [...sim.querySelectorAll("[data-pad]")];
    if (!play || !jugar || !juego || pads.length !== 4) return;

    const vid = document.querySelector(".dam-fila__caja--video video");
    if (vid) {
      const box = vid.parentElement;
      const fit = () => {
        const W = box.clientWidth, H = box.clientHeight;
        if (!W || !H) return;
        const vw = vid.videoWidth || 16, vh = vid.videoHeight || 9;
        const sc = Math.min(W / vh, H / vw);
        vid.style.width = Math.round(vw * sc) + "px";
        vid.style.height = Math.round(vh * sc) + "px";
      };
      vid.addEventListener("loadedmetadata", fit);
      window.addEventListener("resize", fit);
      fit();
    }

    const RUTA = "juego/Simon_vAlpha/data/";
    const crear = (f, v) => {
      const a = new Audio();
      a.preload = "none";
      a.src = RUTA + f;
      a.volume = v;
      return a;
    };
    const simonSon = [0, 1, 2, 3].map((i) => crear("nota" + (i + 1) + ".wav", 0.178));
    const jugSon = [0, 1, 2, 3].map((i) => crear("nota" + (i + 5) + ".wav", 0.316));
    const fallo = crear("error.wav", 0.178);
    const todos = simonSon.concat(jugSon, [fallo]);
    const suena = (a) => {
      try {
        a.currentTime = 0;
        const p = a.play();
        if (p && p.catch) p.catch(() => {});
      } catch (e) {}
    };
    const para = (a) => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (e) {}
    };
    const preCargar = () => {
      todos.forEach((a) => {
        a.preload = "auto";
        try {
          a.load();
        } catch (e) {}
      });
    };

    const ON = 183, OFF = 600, FIN = 750;
    const partida = [];
    let posicion = 0, longitud = 0, turnoSimon = false, gameOver = true, gano = false;
    let fase = "inicio", pasoT = 0, sonOn = false, sonOff = false, raf = 0, presionado = null;

    const pantalla = (juega) => sim.classList.toggle("is-juego", juega);
    const encender = (id, on) => pads.forEach((p, k) => p.classList.toggle("is-on", on && k === id));
    const setMsg = () => {
      if (!msg) return;
      if (fase === "fin") {
        msg.textContent = gano ? L("simon.win") : L("simon.lose");
        msg.hidden = false;
      } else {
        msg.hidden = true;
      }
    };
    const render = () => {
      jugar.textContent = L("simon.jugar");
      play.setAttribute("aria-label", L("simon.aria"));
      setMsg();
    };
    renders.push(render);

    const bucle = (t) => {
      if (turnoSimon && !gameOver) {
        if (!pasoT) {
          pasoT = t;
          sonOn = false;
          sonOff = false;
        }
        const e = t - pasoT;
        const id = partida[posicion];
        if (e >= ON && e < OFF) {
          encender(id, true);
          if (!sonOn) {
            sonOn = true;
            suena(simonSon[id]);
          }
        } else if (e >= OFF) {
          if (!sonOff) {
            sonOff = true;
            encender(-1, false);
            para(simonSon[id]);
          }
          if (e >= FIN) {
            if (posicion < longitud) {
              posicion++;
              pasoT = t;
              sonOn = false;
              sonOff = false;
            } else {
              turnoSimon = false;
              posicion = 0;
              pasoT = 0;
              juego.classList.add("is-turno");
            }
          }
        } else {
          encender(-1, false);
        }
      }
      raf = requestAnimationFrame(bucle);
    };

    const terminar = (ganado) => {
      gameOver = true;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      gano = !!ganado;
      fase = "fin";
      encender(-1, false);
      juego.classList.remove("is-turno");
      pantalla(false);
      setMsg();
    };

    const empezar = () => {
      preCargar();
      todos.forEach(para);
      for (let i = 0; i < 30; i++) partida[i] = Math.floor(Math.random() * 4);
      posicion = 0;
      longitud = 0;
      turnoSimon = true;
      gameOver = false;
      gano = false;
      fase = "jugando";
      encender(-1, false);
      juego.classList.remove("is-turno");
      pasoT = 0;
      sonOn = false;
      sonOff = false;
      pantalla(true);
      setMsg();
      if (!raf) raf = requestAnimationFrame(bucle);
    };

    const press = (p) => {
      if (gameOver || turnoSimon || fase !== "jugando") return false;
      const id = Number(p.dataset.pad);
      encender(-1, false);
      p.classList.add("is-on");
      suena(jugSon[id]);
      if (partida[posicion] !== id) {
        jugSon.forEach(para);
        suena(fallo);
        terminar(false);
        return false;
      }
      return true;
    };

    const suelta = (p, avanza) => {
      const id = Number(p.dataset.pad);
      p.classList.remove("is-on");
      para(jugSon[id]);
      if (!avanza || gameOver || turnoSimon) return;
      if (posicion < longitud) {
        posicion++;
        return;
      }
      if (longitud === partida.length - 1) {
        terminar(true);
        return;
      }
      turnoSimon = true;
      posicion = 0;
      longitud++;
      juego.classList.remove("is-turno");
      pasoT = 0;
      sonOn = false;
      sonOff = false;
    };

    pads.forEach((p) => {
      p.addEventListener("pointerdown", (e) => {
        if (presionado) return;
        e.preventDefault();
        if (press(p)) presionado = p;
      });
      p.addEventListener("pointerup", () => {
        if (presionado !== p) return;
        presionado = null;
        suelta(p, true);
      });
      p.addEventListener("pointercancel", () => {
        if (presionado !== p) return;
        presionado = null;
        suelta(p, false);
      });
      p.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        if (!press(p)) return;
        setTimeout(() => suelta(p, true), 240);
      });
    });
    window.addEventListener("pointerup", () => {
      if (!presionado) return;
      suelta(presionado, false);
      presionado = null;
    });

    play.addEventListener("click", empezar);
    render();
  })();

  /* ── API GitHub: repositorios en vivo ── */
  (() => {
    const root = document.querySelector("[data-gh]");
    if (!root) return;
    const grid = root.querySelector("[data-gh-grid]");
    const est = root.querySelector("[data-gh-estado]");
    if (!grid || !est) return;
    let estadoKey = "carga";
    const render = () => { est.textContent = estadoKey ? L("gh." + estadoKey) : ""; };
    renders.push(render);
    const cargar = async () => {
      estadoKey = "carga";
      grid.textContent = "";
      render();
      try {
        const r = await fetch("https://api.github.com/users/SalvaLlacer26/repos?sort=updated&per_page=6", { headers: { Accept: "application/vnd.github+json" } });
        if (!r.ok) throw 0;
        const d = await r.json();
        if (!Array.isArray(d) || !d.length) { estadoKey = "vacio"; render(); return; }
        estadoKey = "";
        render();
        const frag = document.createDocumentFragment();
        d.forEach((repo) => {
          const a = document.createElement("a");
          a.className = "gh-card";
          a.href = repo.html_url || "#";
          a.target = "_blank";
          a.rel = "noopener";
          const b = document.createElement("b");
          b.textContent = repo.name || "";
          const s = document.createElement("span");
          s.textContent = repo.description || "";
          const i = document.createElement("i");
          i.textContent = (repo.language || "") + (repo.stargazers_count ? " · ★ " + repo.stargazers_count : "");
          a.appendChild(b);
          a.appendChild(s);
          a.appendChild(i);
          frag.appendChild(a);
        });
        grid.appendChild(frag);
      } catch (e) {
        estadoKey = "error";
        render();
      }
    };
    render();
    cargar();
  })();

  /* ─── API Hacker News (portada en vivo, Algolia · sin clave) ─── */
  (() => {
    const root = document.querySelector("[data-hn]");
    if (!root) return;
    const grid = root.querySelector("[data-hn-grid]");
    let estadoKey = "carga";
    const render = () => {
      if (!estadoKey) return;
      grid.textContent = "";
      const li = document.createElement("li");
      li.className = "api__estado";
      li.textContent = L("hn." + estadoKey) || estadoKey;
      grid.appendChild(li);
    };
    renders.push(render);
    const cargar = async () => {
      estadoKey = "carga";
      render();
      try {
        const r = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=6");
        if (!r.ok) throw 0;
        const d = await r.json();
        const hits = (d && d.hits) || [];
        if (!hits.length) { estadoKey = "vacio"; render(); return; }
        estadoKey = "";
        const frag = document.createDocumentFragment();
        hits.forEach((h) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.className = "devto-card";
          a.href = h.url || ("https://news.ycombinator.com/item?id=" + h.objectID);
          a.target = "_blank";
          a.rel = "noopener";
          const cab = document.createElement("span");
          cab.className = "devto-card__cab";
          const aut = document.createElement("span");
          aut.className = "devto-card__aut";
          aut.textContent = "Hacker News";
          const reac = document.createElement("b");
          reac.className = "devto-card__reac";
          reac.textContent = "\u2665 " + Number(h.points || 0).toLocaleString(lang() === "en" ? "en-US" : "es-ES") + " \u00b7 \ud83d\udcac " + Number(h.num_comments || 0);
          cab.appendChild(aut); cab.appendChild(reac);
          const tit = document.createElement("span");
          tit.className = "devto-card__tit";
          tit.textContent = h.title || "";
          const tags = document.createElement("span");
          tags.className = "devto-card__tags";
          tags.textContent = "front page · " + (h.author || "hn");
          a.appendChild(cab); a.appendChild(tit); a.appendChild(tags);
          li.appendChild(a);
          frag.appendChild(li);
        });
        grid.textContent = "";
        grid.appendChild(frag);
      } catch (e) {
        estadoKey = "error";
        render();
      }
    };
    cargar();
  })();

  /* ─── Re-render de textos dinámicos al cambiar de idioma ─── */  /* ── Re-render de textos dinámicos al cambiar de idioma ── */
  if ("MutationObserver" in window) {
    new MutationObserver(() => renders.forEach((r) => r())).observe(html, { attributes: true, attributeFilter: ["lang"] });
  }
})();
