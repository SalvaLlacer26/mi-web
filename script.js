/* script.js · modo, degradado por hover, color propio en menu, modal, slideshow, idioma, clima */

document.addEventListener("DOMContentLoaded", () => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;

  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* Modo */
  const modoBtn = document.getElementById("modo");
  const metaTema = document.querySelector('meta[name="theme-color"]');
  const setModo = (m) => {
    html.setAttribute("data-mode", m);
    if (modoBtn) modoBtn.setAttribute("aria-pressed", String(m === "light"));
    if (metaTema) metaTema.setAttribute("content", m === "light" ? "#f4f4f2" : "#0a0a0b");
    try { localStorage.setItem("tema", m); } catch (e) {}
  };
  let g = null; try { g = localStorage.getItem("tema"); } catch (e) {}
  if (g) setModo(g);
  if (modoBtn) modoBtn.addEventListener("click", () => setModo(html.getAttribute("data-mode") === "light" ? "dark" : "light"));

  /* Menu movil */
  const burger = document.querySelector(".nav__burger");
  const cerrarMenu = () => { document.body.classList.remove("nav-open"); if (burger) burger.setAttribute("aria-expanded", "false"); };
  if (burger) burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", String(open));
  });

  const GAMAS = {
    foto:["#8a5a2b","#161411","#8b857c"], diseno:["#19b6d6","#e0118a","#f2b705"],
    video:["#5b86dd","#e06a66","#6fbf73"], musica:["#b8923a","#161411","#ece8e1"],
    dam:["#e23b3b","#1f9d57","#3b82f6"], fab:["#7c8aa0","#2b56c9","#eef2f7"]
  };

  /* Cada enlace del menu se pinta de SU color principal al pasar el raton */
  document.querySelectorAll(".nav__menu a[data-tema]").forEach((a) => {
    const c = GAMAS[a.dataset.tema]; if (c) a.style.setProperty("--lc", c[0]);
  });

  /* Gama activa: en subweb es fija (data-tema); en hub cambia con hover (default "hub") */
  const esHub = html.getAttribute("data-bg") === "hub";
  if (esHub) {
    const neutro = () => { html.setAttribute("data-bg","hub"); html.style.removeProperty("--t1"); html.style.removeProperty("--t2"); html.style.removeProperty("--t3"); };
    const activar = (tema) => {
      const c = GAMAS[tema]; if (!c) return;
      html.setAttribute("data-bg", tema);
      html.style.setProperty("--t1", c[0]); html.style.setProperty("--t2", c[1]); html.style.setProperty("--t3", c[2]);
    };
    document.querySelectorAll("[data-tema]").forEach((el) => {
      el.addEventListener("mouseenter", () => activar(el.dataset.tema));
      el.addEventListener("focus", () => activar(el.dataset.tema));
      el.addEventListener("mouseleave", neutro);
      el.addEventListener("blur", neutro);
    });
  }

  /* Toast subwebs en construccion */
  let toastEl;
  const toast = (msg) => {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className="toast"; toastEl.setAttribute("role","status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove("is-on"), 2200);
  };
  document.querySelectorAll("[data-soon]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); cerrarMenu(); toast("Subweb en construcción"); }));

  /* Modal contacto */
  const modal = document.getElementById("modal"), form = document.getElementById("form"), exito = document.getElementById("exito");
  const btnEnviar = form ? form.querySelector("button[type=submit]") : null;
  const campos = form ? form.querySelectorAll(".form__campo") : null;
  let timer = 0;
  const abrirModal = () => { if (!modal||!form) return; modal.classList.add("is-open"); modal.setAttribute("aria-hidden","false"); const p = form.querySelector("input"); if (p) setTimeout(() => p.focus(), 200); };
  const cerrarModal = () => { if (!modal||!form) return; modal.classList.remove("is-open"); modal.setAttribute("aria-hidden","true"); clearTimeout(timer); form.reset(); if (btnEnviar) btnEnviar.style.display=""; if (campos) campos.forEach(c=>c.style.display=""); if (exito) exito.hidden=true; };
  document.querySelectorAll(".js-contacto").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); cerrarMenu(); abrirModal(); }));
  if (modal) {
    modal.querySelectorAll("[data-cerrar]").forEach((el) => el.addEventListener("click", cerrarModal));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { cerrarModal(); cerrarMenu(); } });
  }
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (btnEnviar) btnEnviar.style.display = "none";
    if (campos) campos.forEach((c) => c.style.display = "none");
    if (exito) exito.hidden = false;
    timer = setTimeout(cerrarModal, 2000);
  });

  /* Revelado */
  const rev = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    rev.forEach((el, i) => { el.style.animationDelay = (i % 6) * 0.07 + "s"; });
    const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }), { threshold: 0.12 });
    rev.forEach((el) => obs.observe(el));
  } else { rev.forEach((el) => el.classList.add("visible")); }

  /* Slideshow */
  (function slideshow(){
    const ss = document.querySelector(".slideshow"); if (!ss) return;
    const slides = [...ss.querySelectorAll(".slideshow__slide")]; if (slides.length < 2) return;
    const dotsWrap = ss.querySelector(".slideshow__dots"); let i = 0;
    const dots = slides.map((_, k) => { const b = document.createElement("button"); b.className="slideshow__dot"; b.setAttribute("aria-label","Imagen "+(k+1)); b.addEventListener("click",()=>go(k)); if (dotsWrap) dotsWrap.appendChild(b); return b; });
    function go(n){ i=(n+slides.length)%slides.length; slides.forEach((s,k)=>s.classList.toggle("is-active",k===i)); dots.forEach((d,k)=>d.classList.toggle("is-active",k===i)); }
    const prev = ss.querySelector("[data-ss-prev]"), next = ss.querySelector("[data-ss-next]");
    if (prev) prev.addEventListener("click", () => go(i-1));
    if (next) next.addEventListener("click", () => go(i+1));
    go(0);
  })();

  /* Idioma */
  const I18N = {
    es:{ "m.foto":"Foto","m.diseno":"Diseño","m.video":"Vídeo","m.musica":"Música","m.dam":"DAM","m.mec":"Mecánica","m.contacto":"Contacto",
      "eyebrow":"Diseño + Desarrollo · Perfil técnico-creativo","hub.nombre":"Salvador Llácer Ivars",
      "hub.frase":"Seis disciplinas, una sola forma de trabajar: pensar como diseñador y ejecutar como desarrollador. Elige por dónde entrar.",
      "sel.foto":"Fotografía","sel.foto.sub":"Luz, encuadre y narrativa","sel.diseno":"Diseño gráfico e ilustración","sel.diseno.sub":"Retícula, tinta y trazo",
      "sel.video":"Edición de vídeo","sel.video.sub":"Ritmo, sonido y color","sel.musica":"Música","sel.musica.sub":"Composición y montaje sonoro",
      "sel.dam":"DAM y videojuegos","sel.dam.sub":"Código, apps y Simon Says","sel.fab":"Fabricación mecánica","sel.fab.sub":"CATIA, planos y ERP",
      "pie.eyebrow":"¿Tienes un proyecto?","pie.nota":"Abierto a nuevas oportunidades. Diseño, desarrollo y administración en una sola persona.","pie.loc":"Localización","clima.ubicacion":"Ubicación",
      "modal.eyebrow":"Hablemos","modal.titulo":"Cuéntame tu proyecto","form.nombre":"Nombre","form.email":"Email","form.mensaje":"Mensaje","form.enviar":"Enviar mensaje","form.exito":"✓ Mensaje enviado correctamente." },
    en:{ "m.foto":"Photo","m.diseno":"Design","m.video":"Video","m.musica":"Music","m.dam":"DAM","m.mec":"Machining","m.contacto":"Contact",
      "eyebrow":"Design + Development · Technical-creative profile","hub.nombre":"Salvador Llácer Ivars",
      "hub.frase":"Six disciplines, one way of working: think like a designer, build like a developer. Choose where to enter.",
      "sel.foto":"Photography","sel.foto.sub":"Light, framing and narrative","sel.diseno":"Graphic design & illustration","sel.diseno.sub":"Grid, ink and line",
      "sel.video":"Video editing","sel.video.sub":"Rhythm, sound and colour","sel.musica":"Music","sel.musica.sub":"Composition and sound editing",
      "sel.dam":"DAM & video games","sel.dam.sub":"Code, apps and Simon Says","sel.fab":"Mechanical manufacturing","sel.fab.sub":"CATIA, blueprints and ERP",
      "pie.eyebrow":"Have a project?","pie.nota":"Open to new opportunities. Design, development and administration in one person.","pie.loc":"Location","clima.ubicacion":"Location",
      "modal.eyebrow":"Let's talk","modal.titulo":"Tell me about your project","form.nombre":"Name","form.email":"Email","form.mensaje":"Message","form.enviar":"Send message","form.exito":"✓ Message sent successfully." }
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

  /* Clima (solo hub) */
  (function clima() {
    const box = document.getElementById("clima"); if (!box) return;
    const ico = document.getElementById("climaIco"), lugar = document.getElementById("climaLugar");
    const temp = document.getElementById("climaTemp"), desc = document.getElementById("climaDesc"), meta = document.getElementById("climaMeta");
    const sel = document.getElementById("climaSelect"); if (!sel) return;
    const UBIS = { xativa:{nombre:"Xàtiva · Valencia",lat:38.9935,lon:-0.5181}, valencia:{nombre:"Valencia",lat:39.4699,lon:-0.3763}, jaraguas:{nombre:"Jaraguas",lat:38.947,lon:-0.928}, lapobla:{nombre:"La Pobla Llarga",lat:39.2167,lon:-0.5519} };
    const TXT = { es:{carg:"Cargando…",err:"Tiempo no disponible",min:"Mín",max:"Máx",viento:"Viento"}, en:{carg:"Loading…",err:"Weather unavailable",min:"Min",max:"Max",viento:"Wind"} };
    const WMO = { 0:["sol","Despejado","Clear"],1:["sol","Mayormente despejado","Mostly clear"],2:["nube","Parcialmente nublado","Partly cloudy"],3:["nube","Nublado","Overcast"],45:["niebla","Niebla","Fog"],48:["niebla","Niebla helada","Rime fog"],51:["lluvia","Llovizna ligera","Light drizzle"],53:["lluvia","Llovizna","Drizzle"],55:["lluvia","Llovizna intensa","Dense drizzle"],61:["lluvia","Lluvia ligera","Light rain"],63:["lluvia","Lluvia","Rain"],65:["lluvia","Lluvia intensa","Heavy rain"],71:["nieve","Nieve ligera","Light snow"],73:["nieve","Nieve","Snow"],75:["nieve","Nieve intensa","Heavy snow"],77:["nieve","Granizo","Grains"],80:["lluvia","Chubascos","Showers"],81:["lluvia","Chubascos","Showers"],82:["lluvia","Chubascos fuertes","Violent showers"],95:["tormenta","Tormenta","Thunderstorm"],96:["tormenta","Tormenta con granizo","Storm + hail"],99:["tormenta","Tormenta con granizo","Storm + hail"] };
    const ICONO = { sol:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`, nube:`<svg viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 19z"/></svg>`, niebla:`<svg viewBox="0 0 24 24"><path d="M17.5 15a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 15"/><path d="M4 19h16M7 22h13"/></svg>`, lluvia:`<svg viewBox="0 0 24 24"><path d="M17.5 14a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 14"/><path d="M8 18l-1 3M13 18l-1 3M18 18l-1 3"/></svg>`, nieve:`<svg viewBox="0 0 24 24"><path d="M17.5 14a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 14"/><path d="M8 18v3M13 18v3M18 18v3"/></svg>`, tormenta:`<svg viewBox="0 0 24 24"><path d="M17.5 13a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 13"/><path d="M13 15l-3 4h3l-1 4 4-5h-3z"/></svg>` };
    let actual = "xativa"; try { const gg = localStorage.getItem("climaUbi"); if (gg && UBIS[gg]) actual = gg; } catch (e) {}
    let ultimo = null, pid = 0;
    const L = () => html.getAttribute("lang") || "es";
    const url = (u) => `https://api.open-meteo.com/v1/forecast?latitude=${u.lat}&longitude=${u.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1`;
    function pintar() {
      const l = L(); lugar.textContent = UBIS[actual].nombre;
      if (!ultimo) { ico.innerHTML=""; temp.textContent="–"; desc.textContent=TXT[l].err; meta.textContent=""; return; }
      const w = WMO[ultimo.code] || ["nube","—","—"]; ico.innerHTML=ICONO[w[0]];
      temp.textContent=Math.round(ultimo.temp)+"°"; desc.textContent = l==="en"?w[2]:w[1];
      meta.textContent=`${TXT[l].min} ${Math.round(ultimo.min)}° · ${TXT[l].max} ${Math.round(ultimo.max)}° · ${TXT[l].viento} ${Math.round(ultimo.viento)} km/h`;
    }
    async function cargar(r=1){
      const u=UBIS[actual], id=++pid; ultimo=null;
      lugar.textContent=u.nombre; ico.innerHTML=""; temp.textContent="–"; desc.textContent=TXT[L()].carg; meta.textContent="";
      try { const res=await fetch(url(u)); if(!res.ok) throw 0; const d=await res.json(); if(id!==pid) return;
        ultimo={temp:d.current.temperature_2m,code:d.current.weather_code,viento:d.current.wind_speed_10m,min:d.daily.temperature_2m_min[0],max:d.daily.temperature_2m_max[0]}; pintar();
      } catch(e){ if(id!==pid) return; r>0?setTimeout(()=>cargar(r-1),2500):(ultimo=null,pintar()); }
    }
    sel.value=actual;
    sel.addEventListener("change",()=>{actual=sel.value; try{localStorage.setItem("climaUbi",actual)}catch(e){} cargar();});
    new MutationObserver(pintar).observe(html,{attributes:true,attributeFilter:["lang"]});
    cargar();
  })();
});
