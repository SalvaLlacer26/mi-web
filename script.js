/* script.js · modo, franjas del hub, reveal, slideshow, toast, idioma, clima */

document.addEventListener("DOMContentLoaded", () => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;

  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* Modo claro / oscuro */
  const modoBtn = document.getElementById("modo");
  const metaTema = document.querySelector('meta[name="theme-color"]');
  const setModo = (m) => {
    html.setAttribute("data-mode", m);
    if (modoBtn) modoBtn.setAttribute("aria-pressed", String(m === "light"));
    if (metaTema) metaTema.setAttribute("content", m === "light" ? "#f4f4f2" : "#0a0a0b");
    try { localStorage.setItem("tema", m); } catch (e) {}
  };
  let guardado = null; try { guardado = localStorage.getItem("tema"); } catch (e) {}
  if (guardado) setModo(guardado);
  if (modoBtn) modoBtn.addEventListener("click", () => setModo(html.getAttribute("data-mode") === "light" ? "dark" : "light"));

  /* El logo sigue la gama de la disciplina que se mira (solo hub) */
  const items = [...document.querySelectorAll(".selector__item")];
  const neutro = () => { html.style.removeProperty("--t1"); html.style.removeProperty("--t2"); html.style.removeProperty("--t3"); };
  items.forEach((it) => {
    const c = getComputedStyle(it);
    const pintar = () => {
      html.style.setProperty("--t1", c.getPropertyValue("--c1").trim());
      html.style.setProperty("--t2", c.getPropertyValue("--c2").trim());
      html.style.setProperty("--t3", c.getPropertyValue("--c3").trim());
    };
    it.addEventListener("mouseenter", pintar);
    it.addEventListener("focus", pintar);
    it.addEventListener("mouseleave", neutro);
    it.addEventListener("blur", neutro);
  });

  /* Toast "en construcción" para las subwebs aún no creadas */
  let toastEl;
  const toast = (msg) => {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove("is-on"), 2200);
  };
  document.querySelectorAll(".selector__item[data-soon]").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); toast("Subweb en construcción"); }));

  /* Revelado al hacer scroll */
  const rev = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    rev.forEach((el, i) => { el.style.animationDelay = (i % 6) * 0.07 + "s"; });
    const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }), { threshold: 0.12 });
    rev.forEach((el) => obs.observe(el));
  } else { rev.forEach((el) => el.classList.add("visible")); }

  /* Slideshow generico (placeholders o fotos reales) */
  (function slideshow(){
    const ss = document.querySelector(".slideshow");
    if (!ss) return;
    const slides = [...ss.querySelectorAll(".slideshow__slide")];
    if (slides.length < 2) return;
    const dotsWrap = ss.querySelector(".slideshow__dots");
    let i = 0;
    const dots = slides.map((_, k) => {
      const b = document.createElement("button");
      b.className = "slideshow__dot";
      b.setAttribute("aria-label", "Imagen " + (k + 1));
      b.addEventListener("click", () => go(k));
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });
    function go(n){
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
      dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
    }
    const prev = ss.querySelector("[data-ss-prev]"), next = ss.querySelector("[data-ss-next]");
    if (prev) prev.addEventListener("click", () => go(i - 1));
    if (next) next.addEventListener("click", () => go(i + 1));
    go(0);
  })();

  /* Idioma (header/footer; subwebs se traducen con textos reales) */
  const I18N = {
    es: { "status":"Disponible","volver":"Volver al inicio","eyebrow":"Diseño + Desarrollo · Perfil técnico-creativo","hub.nombre":"Salvador Llácer Ivars",
      "hub.frase":"Seis disciplinas, una sola forma de trabajar: pensar como diseñador y ejecutar como desarrollador. Elige por dónde entrar.",
      "sel.foto":"Fotografía","sel.foto.sub":"Luz, encuadre y narrativa","sel.diseno":"Diseño gráfico e ilustración","sel.diseno.sub":"Retícula, tinta y trazo",
      "sel.video":"Edición de vídeo","sel.video.sub":"Ritmo, sonido y color","sel.musica":"Música","sel.musica.sub":"Composición y montaje sonoro",
      "sel.dam":"DAM y videojuegos","sel.dam.sub":"Código, apps y Simon Says","sel.fab":"Fabricación mecánica","sel.fab.sub":"CATIA, planos y ERP",
      "pie.eyebrow":"¿Tienes un proyecto?","pie.nota":"Abierto a nuevas oportunidades. Diseño, desarrollo y administración en una sola persona.","pie.loc":"Localización","clima.ubicacion":"Ubicación" },
    en: { "status":"Available","volver":"Back to start","eyebrow":"Design + Development · Technical-creative profile","hub.nombre":"Salvador Llácer Ivars",
      "hub.frase":"Six disciplines, one way of working: think like a designer, build like a developer. Choose where to enter.",
      "sel.foto":"Photography","sel.foto.sub":"Light, framing and narrative","sel.diseno":"Graphic design & illustration","sel.diseno.sub":"Grid, ink and line",
      "sel.video":"Video editing","sel.video.sub":"Rhythm, sound and colour","sel.musica":"Music","sel.musica.sub":"Composition and sound editing",
      "sel.dam":"DAM & video games","sel.dam.sub":"Code, apps and Simon Says","sel.fab":"Mechanical manufacturing","sel.fab.sub":"CATIA, blueprints and ERP",
      "pie.eyebrow":"Have a project?","pie.nota":"Open to new opportunities. Design, development and administration in one person.","pie.loc":"Location","clima.ubicacion":"Location" }
  };
  const i18nEls = [...document.querySelectorAll("[data-i18n]")];
  const langBtns = [...document.querySelectorAll(".lang__btn")];
  function aplicarIdioma(lang) {
    const dic = I18N[lang]; if (!dic) return;
    i18nEls.forEach((el) => { const k = el.getAttribute("data-i18n"); if (dic[k]) el.textContent = dic[k]; });
    html.setAttribute("lang", lang);
    langBtns.forEach((b) => { const on = b.dataset.lang === lang; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
    try { localStorage.setItem("idioma", lang); } catch (e) {}
  }
  langBtns.forEach((b) => b.addEventListener("click", () => aplicarIdioma(b.dataset.lang)));
  let idioma = "es"; try { idioma = localStorage.getItem("idioma") || "es"; } catch (e) {}
  if (idioma === "en") aplicarIdioma("en");

  /* Clima Open-Meteo (solo en el hub) */
  (function clima() {
    const box = document.getElementById("clima");
    const ico = document.getElementById("climaIco"), lugar = document.getElementById("climaLugar");
    const temp = document.getElementById("climaTemp"), desc = document.getElementById("climaDesc"), meta = document.getElementById("climaMeta");
    const sel = document.getElementById("climaSelect");
    if (!box || !sel) return;
    const UBIS = {
      xativa:{nombre:"Xàtiva · Valencia",lat:38.9935,lon:-0.5181}, valencia:{nombre:"Valencia",lat:39.4699,lon:-0.3763},
      jaraguas:{nombre:"Jaraguas",lat:38.947,lon:-0.928}, lapobla:{nombre:"La Pobla Llarga",lat:39.2167,lon:-0.5519}
    };
    const TXT = { es:{carg:"Cargando…",err:"Tiempo no disponible",min:"Mín",max:"Máx",viento:"Viento"},
                  en:{carg:"Loading…",err:"Weather unavailable",min:"Min",max:"Max",viento:"Wind"} };
    const WMO = { 0:["sol","Despejado","Clear"],1:["sol","Mayormente despejado","Mostly clear"],2:["nube","Parcialmente nublado","Partly cloudy"],3:["nube","Nublado","Overcast"],
      45:["niebla","Niebla","Fog"],48:["niebla","Niebla helada","Rime fog"],51:["lluvia","Llovizna ligera","Light drizzle"],53:["lluvia","Llovizna","Drizzle"],55:["lluvia","Llovizna intensa","Dense drizzle"],
      61:["lluvia","Lluvia ligera","Light rain"],63:["lluvia","Lluvia","Rain"],65:["lluvia","Lluvia intensa","Heavy rain"],71:["nieve","Nieve ligera","Light snow"],73:["nieve","Nieve","Snow"],
      75:["nieve","Nieve intensa","Heavy snow"],77:["nieve","Granizo","Grains"],80:["lluvia","Chubascos","Showers"],81:["lluvia","Chubascos","Showers"],82:["lluvia","Chubascos fuertes","Violent showers"],
      95:["tormenta","Tormenta","Thunderstorm"],96:["tormenta","Tormenta con granizo","Storm + hail"],99:["tormenta","Tormenta con granizo","Storm + hail"] };
    const ICONO = {
      sol:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`,
      nube:`<svg viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 19z"/></svg>`,
      niebla:`<svg viewBox="0 0 24 24"><path d="M17.5 15a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 15"/><path d="M4 19h16M7 22h13"/></svg>`,
      lluvia:`<svg viewBox="0 0 24 24"><path d="M17.5 14a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 14"/><path d="M8 18l-1 3M13 18l-1 3M18 18l-1 3"/></svg>`,
      nieve:`<svg viewBox="0 0 24 24"><path d="M17.5 14a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 14"/><path d="M8 18v3M13 18v3M18 18v3"/></svg>`,
      tormenta:`<svg viewBox="0 0 24 24"><path d="M17.5 13a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 13"/><path d="M13 15l-3 4h3l-1 4 4-5h-3z"/></svg>`
    };
    let actual = "xativa"; try { const g = localStorage.getItem("climaUbi"); if (g && UBIS[g]) actual = g; } catch (e) {}
    let ultimo = null, pid = 0;
    const L = () => html.getAttribute("lang") || "es";
    const url = (u) => `https://api.open-meteo.com/v1/forecast?latitude=${u.lat}&longitude=${u.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1`;
    function pintar() {
      const l = L(); lugar.textContent = UBIS[actual].nombre;
      if (!ultimo) { ico.innerHTML = ""; temp.textContent = "–"; desc.textContent = TXT[l].err; meta.textContent = ""; return; }
      const w = WMO[ultimo.code] || ["nube","—","—"];
      ico.innerHTML = ICONO[w[0]];
      temp.textContent = Math.round(ultimo.temp) + "°";
      desc.textContent = l === "en" ? w[2] : w[1];
      meta.textContent = `${TXT[l].min} ${Math.round(ultimo.min)}° · ${TXT[l].max} ${Math.round(ultimo.max)}° · ${TXT[l].viento} ${Math.round(ultimo.viento)} km/h`;
    }
    async function cargar(reintentos = 1) {
      const u = UBIS[actual], id = ++pid; ultimo = null;
      lugar.textContent = u.nombre; ico.innerHTML = ""; temp.textContent = "–"; desc.textContent = TXT[L()].carg; meta.textContent = "";
      try {
        const r = await fetch(url(u)); if (!r.ok) throw 0;
        const d = await r.json(); if (id !== pid) return;
        ultimo = { temp:d.current.temperature_2m, code:d.current.weather_code, viento:d.current.wind_speed_10m, min:d.daily.temperature_2m_min[0], max:d.daily.temperature_2m_max[0] };
        pintar();
      } catch (e) { if (id !== pid) return; reintentos > 0 ? setTimeout(() => cargar(reintentos - 1), 2500) : (ultimo = null, pintar()); }
    }
    sel.value = actual;
    sel.addEventListener("change", () => { actual = sel.value; try { localStorage.setItem("climaUbi", actual); } catch (e) {} cargar(); });
    new MutationObserver(pintar).observe(html, { attributes: true, attributeFilter: ["lang"] });
    cargar();
  })();
});
