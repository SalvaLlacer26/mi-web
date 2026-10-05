/* script.js */

document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esTactil = matchMedia("(pointer: coarse)").matches || ("ontouchstart" in window && navigator.maxTouchPoints > 0);
  const html = document.documentElement;

  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* ── Tema ── */
  const temaBtn = document.getElementById("tema");
  const metaTema = document.querySelector('meta[name="theme-color"]');
  const setTema = (t) => { html.setAttribute("data-theme", t); if (temaBtn) temaBtn.setAttribute("aria-pressed", String(t === "light")); if (metaTema) metaTema.setAttribute("content", t === "light" ? "#f4f4f2" : "#0a0a0b"); try { localStorage.setItem("tema", t); } catch (e) {} };
  const temaGuardado = (() => { try { return localStorage.getItem("tema"); } catch (e) { return null; } })();
  if (temaGuardado) setTema(temaGuardado);
  if (temaBtn) temaBtn.addEventListener("click", () => setTema(html.getAttribute("data-theme") === "light" ? "dark" : "light"));

  /* ── Cerrar menú ── */
  const burger = document.querySelector(".nav__burger");
  function cerrarMenu() { document.body.classList.remove("nav-open"); if (burger) burger.setAttribute("aria-expanded", "false"); }

  /* ── VÍDEOS ── */
  const VIDEOS = [
    { serie: "MissR",          org: "Interpreta Natura", rol: "Grabación · Edición · Música", id: "IwEHOaWaUZY" },
    { serie: "Eco",            org: "Interpreta Natura", rol: "Grabación · Edición · Música", id: "" },
    { serie: "Arte",           org: "Rural Labscape",    rol: "Edición · Música",             id: "" },
    { serie: "Rural Labscape", org: "Rural Labscape",    rol: "Edición · Música",             id: "" },
    { serie: "Proyecto Ulges", org: "Proyecto Ulges",    rol: "Edición · Música",             id: "" },
  ];
  function renderVideos() {
    const grid = document.getElementById("videos-grid");
    if (!grid) return;
    const frag = document.createDocumentFragment();
    VIDEOS.forEach(v => {
      const a = document.createElement("a");
      a.className = "video-card";
      a.target = "_blank"; a.rel = "noopener";
      a.href = v.id ? `https://www.youtube.com/watch?v=${v.id}`
                    : `https://www.youtube.com/results?search_query=${encodeURIComponent(v.serie + ' ' + v.org)}`;

      const thumb = document.createElement("span");
      thumb.className = "video-card__thumb";
      if (v.id) {
        const img = document.createElement("img");
        img.src = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
        img.alt = v.serie; img.loading = "lazy";
        thumb.appendChild(img);
      } else {
        const ph = document.createElement("span");
        ph.className = "video-card__ph"; ph.textContent = "▶";
        thumb.appendChild(ph);
      }
      const play = document.createElement("span");
      play.className = "video-card__play";
      play.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
      thumb.appendChild(play);
      a.appendChild(thumb);

      const meta = document.createElement("span");
      meta.className = "video-card__meta";
      meta.innerHTML = `<span class="video-card__serie">${v.serie}</span><span class="video-card__org">${v.org}</span><span class="video-card__rol">${v.rol}</span>`;
      a.appendChild(meta);

      frag.appendChild(a);
    });
    grid.textContent = "";
    grid.appendChild(frag);
  }
  renderVideos();

  /* ── Vista de detalle · Experiencia ── */
  const expVista = document.getElementById("experiencia-vista");
  function abrirExp(cat) {
    if (!expVista) return;
    expVista.classList.add("is-open");
    expVista.setAttribute("aria-hidden", "false");
    document.body.classList.add("exp-open");
    if (cat) {
      const bloque = document.getElementById('exp-' + cat);
      if (bloque) setTimeout(() => bloque.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }), 380);
    } else {
      expVista.querySelector('.experiencia__body').scrollTop = 0;
    }
    if (!esTactil) document.body.classList.remove("cursor-on");
    const cerrarBtn = expVista.querySelector('.experiencia__cerrar');
    if (cerrarBtn) cerrarBtn.focus();
  }
  function cerrarExp() {
    if (!expVista) return;
    expVista.classList.remove("is-open");
    expVista.setAttribute("aria-hidden", "true");
    document.body.classList.remove("exp-open");
    if (!esTactil && document.body.classList.contains("is-loaded")) document.body.classList.add("cursor-on");
  }
  document.querySelectorAll(".js-experiencia").forEach(a => a.addEventListener("click", (e) => { e.preventDefault(); cerrarMenu(); abrirExp(a.dataset.cat); }));
  if (expVista) {
    expVista.querySelector('[data-cerrar-exp]').addEventListener('click', cerrarExp);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && expVista.classList.contains('is-open')) cerrarExp(); });
  }

  /* ── Menú móvil + dropdowns táctiles ── */
  if (burger) {
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav__menu a[href^='#']").forEach(a => a.addEventListener("click", () => { if (!a.classList.contains('js-experiencia')) cerrarMenu(); }));
  }
  if (matchMedia("(hover: none)").matches) {
    document.querySelectorAll(".nav__item").forEach((it) => {
      const l = it.querySelector(".nav__label");
      if (l && it.querySelector(".dropdown")) l.addEventListener("click", (e) => {
        if (!it.classList.contains("is-abierto")) {
          e.preventDefault();
          document.querySelectorAll(".nav__item.is-abierto").forEach((o) => o.classList.remove("is-abierto"));
          it.classList.add("is-abierto");
        }
      });
    });
  }

  /* ── Modal de contacto ── */
  const modal = document.getElementById("modal");
  const form = document.getElementById("form");
  const exito = document.getElementById("exito");
  const btnEnviar = form ? form.querySelector("button[type=submit]") : null;
  const campos = form ? form.querySelectorAll(".form__campo") : null;
  let timer = 0;
  function abrirModal() { if (!modal || !form) return; modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.remove("cursor-on"); const p = form.querySelector("input"); if (p) setTimeout(() => p.focus(), 200); }
  function limpiarModal() { form.reset(); if (btnEnviar) btnEnviar.style.display = ""; if (campos) campos.forEach(c => c.style.display = ""); if (exito) exito.hidden = true; }
  function cerrarModal() { if (!modal || !form) return; modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); if (!esTactil && document.body.classList.contains("is-loaded")) document.body.classList.add("cursor-on"); clearTimeout(timer); limpiarModal(); }
  if (modal && form) {
    document.querySelectorAll(".js-contacto").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); cerrarMenu(); abrirModal(); }));
    modal.querySelectorAll("[data-cerrar]").forEach((el) => el.addEventListener("click", cerrarModal));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) cerrarModal(); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (btnEnviar) btnEnviar.style.display = "none";
      if (campos) campos.forEach(c => c.style.display = "none");
      if (exito) exito.hidden = false;
      timer = setTimeout(cerrarModal, 2000);
    });
  }

  /* ── Traducciones ── */
  const I18N = {
    es: {
      "nav.sobre":"Sobre mí","nav.servicios":"Competencias","nav.pasiones":"Mis pasiones","nav.contacto":"Contacto","nav.programacion":"Programación","nav.formacion":"Formación","nav.experiencia":"Experiencia","nav.diseno":"Diseño gráfico","nav.audiovisual":"Producción audiovisual",
      "status":"Disponible","eyebrow":"Diseño + Desarrollo · Perfil técnico-creativo",
      "word1":"Edición","word2":"Diseño","word3":"Código",
      "hero.frase":"Pienso como diseñador y ejecuto como desarrollador. Convierto ideas en interfaces y aplicaciones que se ven profesionales y funcionan de verdad.",
      "btn.propuesta":"Mi experiencia","btn.hablemos":"Hablemos",
      "sec.sobre":"Sobre mí","sec.hecho":"Competencias","sec.hecho.sub":"Lo que aporto a un equipo, del diseño al código.",
      "sec.exp":"Experiencia","sec.exp.sub":"Un vistazo a los productos que he entregado. Entra en la experiencia para ver cada trabajo por dentro.",
      "sec.form":"Formación","sec.form.sub":"Cuatro títulos de grado superior que combinan diseño, técnica y programación.","form.tools":"Herramientas",
      "sec.gusta":"Mis pasiones","sec.gusta.sub":"Lo que consumo y creo alimenta cómo diseño y programo.",
      "ficha":"Soy Salvador Llácer Ivars, técnico superior en Imagen, Artes Gráficas, Diseño en Fabricación Mecánica y Desarrollo de Aplicaciones Multiplataforma. Esa mezcla me permite llevar una idea desde el boceto hasta el producto final sin perder el criterio visual ni la solidez del código. Busco proyectos donde el detalle y el código limpio importen tanto como la idea.",
      "prog.marca":"Programación","prog.titulo":"Un perfil difícil de encontrar","prog.texto":"Formado en DAM y con origen en las artes gráficas: escribo código ordenado y cuido cada interfaz como una pieza de diseño. Piensas en producto, no solo en pantalla.","prog.btn":"¿Trabajamos juntos?",
      "chk1":"Desarrollo multiplataforma","chk2":"Interfaces claras y coherentes","chk3":"Pensamiento de producto","chk4":"Materializo ideas",
      "s1.t":"Diseño gráfico","s1.d":"Identidad y piezas con intención, listas para producción.",
      "s2.t":"Fotografía","s2.d":"Composición, luz y narrativa al servicio de tu marca.","s2.m":"Luz · Encuadre",
      "s3.t":"Edición de vídeo","s3.d":"Ritmo, sonido y montaje para contenido que retiene.",
      "s4.t":"Dibujo e ilustración","s4.d":"Expresión y forma propia, sin recursos genéricos.","s4.m":"Trazo · Color",
      "s5.t":"Delineación industrial","s5.d":"Precisión y planos cuando el detalle importa.","s5.m":"Geometría",
      "s6.t":"Gestión administrativa","s6.d":"Método y orden para que el proyecto fluya.","s6.m":"Organización",
      "cat.titulo":"Catálogo interactivo","cat.full":"Ver a pantalla completa","flip.titulo":"Catálogo Weidner",
      "form.t1":"Desarrollo de Aplicaciones Multiplataforma","form.t1d":"Programación Java y Android y desarrollo de apps multiplataforma.",
      "form.t2":"Diseño en Fabricación Mecánica","form.t2d":"Diseño de producto en 3D, planos y documentación de fabricación.",
      "form.t3":"Artes Gráficas","form.t3d":"Maquetación editorial, preimpresión y producción gráfica.",
      "form.t4":"Imagen","form.t4d":"Fotografía, vídeo y tratamiento de imagen.",
      "p1.t":"Cine y series","p1.d":"Estudio narrativa y ritmo para contar mejor.",
      "p2.t":"Videojuegos","p2.d":"Referente de UX, interacción y mundos coherentes.",
      "p3.t":"Crear música","p3.d":"Ritmo y estructura como criterio de diseño.",
      "p4.t":"Dibujo","p4.d":"Forma y mirada aplicadas a cada entregable.",
      "exp.abrir":"Ver trabajo","exp.completa":"Ver la experiencia completa","exp.vista.t":"Trabajos, por dentro",
      "exp.audio.t":"Vídeos, música y edición","exp.audio.intro":"Colaboración en grabación, edición y composición de música original para series de marca.",
      "exp.diseno.t":"Catálogos e imagen de marca","exp.diseno.intro":"Diseño editorial y de identidad para empresas del sector de la automoción. De la retícula a la imprenta y a la feria.",
      "exp.d.l1":"Catálogos corporativos e industriales maquetados en InDesign (impreso y digital interactivo).",
      "exp.d.l2":"Folletos, tarjetas de visita y firmas de correo.",
      "exp.d.l3":"Stands y totems para ferias de automoción.",
      "exp.d.l4":"Diseño desde cero de torres de apilamiento (CATIA) y planimetría.",
      "exp.d.l5":"BOM en el ERP Geinprod, órdenes de fabricación y seguimiento con Producción.",
      "prod.audio.d":"Grabación, montaje y composición de música original para series de marca.",
      "prod.diseno.d":"Catálogos, folletos, tarjetas, firmas, stands y totems de feria.",
      "prod.ind.d":"Torres de apilamiento, BOM en ERP y órdenes de fabricación.",
      "exp.ind.t":"Diseño de producto y planimetría",
      "pie.eyebrow":"¿Tienes un proyecto?","pie.nota":"Abierto a nuevas oportunidades. Diseño, desarrollo y administración en una sola persona.","pie.loc":"Localización",
      "modal.eyebrow":"Hablemos","modal.titulo":"Cuéntame tu proyecto","form.nombre":"Nombre","form.email":"Email","form.mensaje":"Mensaje","form.ph_nombre":"Tu nombre","form.ph_email":"tu@correo.com","form.ph_mensaje":"¿En qué puedo ayudarte?","form.enviar":"Enviar mensaje","form.exito":"✓ Mensaje enviado correctamente.",
      "clima.ubicacion":"Ubicación"
    },
    en: {
      "nav.sobre":"About","nav.servicios":"Skills","nav.pasiones":"Passions","nav.contacto":"Contact","nav.programacion":"Programming","nav.formacion":"Education","nav.experiencia":"Experience","nav.diseno":"Graphic design","nav.audiovisual":"Audiovisual production",
      "status":"Available","eyebrow":"Design + Development · Technical-creative profile",
      "word1":"Editing","word2":"Design","word3":"Code",
      "hero.frase":"I think like a designer and build like a developer. I turn ideas into interfaces and applications that look professional and truly work.",
      "btn.propuesta":"My experience","btn.hablemos":"Let's talk",
      "sec.sobre":"About me","sec.hecho":"Skills","sec.hecho.sub":"What I bring to a team, from design to code.",
      "sec.exp":"Experience","sec.exp.sub":"A look at the products I've delivered. Enter the experience to see each job from the inside.",
      "sec.form":"Education","sec.form.sub":"Four senior technician degrees combining design, engineering and programming.","form.tools":"Tools",
      "sec.gusta":"Passions","sec.gusta.sub":"What I consume and create shapes how I design and code.",
      "ficha":"I am Salvador Llácer Ivars, senior technician in Imaging, Graphic Arts, Design in Mechanical Manufacturing and Multiplatform Application Development. That combination lets me take an idea from sketch to final product without losing visual judgment or code solidity. I look for projects where detail and clean code matter as much as the idea.",
      "prog.marca":"Programming","prog.titulo":"A profile that's hard to find","prog.texto":"Trained in DAM and rooted in graphic arts: I write clean, ordered code and treat every interface as a design piece. You think in product, not just in screens.","prog.btn":"Shall we work together?",
      "chk1":"Multiplatform development","chk2":"Clear, coherent interfaces","chk3":"Product thinking","chk4":"I make ideas real",
      "s1.t":"Graphic design","s1.d":"Identity and pieces with intent, production-ready.",
      "s2.t":"Photography","s2.d":"Composition, light and narrative in service of your brand.","s2.m":"Light · Framing",
      "s3.t":"Video editing","s3.d":"Rhythm, sound and editing for content that holds attention.",
      "s4.t":"Drawing & illustration","s4.d":"Original expression and form, no generic assets.","s4.m":"Line · Color",
      "s5.t":"Industrial drafting","s5.d":"Precision and blueprints when the detail matters.","s5.m":"Geometry",
      "s6.t":"Administrative management","s6.d":"Method and order so the project flows.","s6.m":"Organisation",
      "cat.titulo":"Interactive catalogue","cat.full":"View fullscreen","flip.titulo":"Weidner catalogue",
      "form.t1":"Multiplatform Application Development","form.t1d":"Java and Android programming and multiplatform app development.",
      "form.t2":"Design in Mechanical Manufacturing","form.t2d":"3D product design, blueprints and manufacturing documentation.",
      "form.t3":"Graphic Arts","form.t3d":"Editorial layout, prepress and graphic production.",
      "form.t4":"Imaging","form.t4d":"Photography, video and image processing.",
      "p1.t":"Film & series","p1.d":"I study narrative and rhythm to tell stories better.",
      "p2.t":"Video games","p2.d":"Reference for UX, interaction and coherent worlds.",
      "p3.t":"Making music","p3.d":"Rhythm and structure as design criteria.",
      "p4.t":"Drawing","p4.d":"Form and eye applied to every deliverable.",
      "exp.abrir":"See work","exp.completa":"See full experience","exp.vista.t":"Work, up close",
      "exp.audio.t":"Videos, music & editing","exp.audio.intro":"Collaborated on filming, editing and composing original music for brand series.",
      "exp.diseno.t":"Catalogues & brand image","exp.diseno.intro":"Editorial and identity design for automotive companies. From the grid to the press and the trade fair.",
      "exp.d.l1":"Corporate and industrial catalogues laid out in InDesign (print and interactive digital).",
      "exp.d.l2":"Brochures, business cards and email signatures.",
      "exp.d.l3":"Trade-show stands and totems for automotive fairs.",
      "exp.d.l4":"Designed stacking towers from scratch (CATIA) and blueprints.",
      "exp.d.l5":"BOM in the Geinprod ERP, manufacturing orders and tracking with Production.",
      "prod.audio.d":"Filming, editing and composing original music for brand series.",
      "prod.diseno.d":"Catalogues, brochures, cards, signatures, stands and fair totems.",
      "prod.ind.d":"Stacking towers, ERP BOM and manufacturing orders.",
      "exp.ind.t":"Product design & blueprints",
      "pie.eyebrow":"Have a project?","pie.nota":"Open to new opportunities. Design, development and administration in one person.","pie.loc":"Location",
      "modal.eyebrow":"Let's talk","modal.titulo":"Tell me about your project","form.nombre":"Name","form.email":"Email","form.mensaje":"Message","form.ph_nombre":"Your name","form.ph_email":"you@email.com","form.ph_mensaje":"How can I help you?","form.enviar":"Send message","form.exito":"✓ Message sent successfully.",
      "clima.ubicacion":"Location"
    }
  };

  let idioma = "es";
  function aplicarIdioma(lang) {
    idioma = lang;
    const dic = I18N[lang];
    document.querySelectorAll("[data-i18n]").forEach((el) => { const k = el.getAttribute("data-i18n"); if (dic[k]) el.textContent = dic[k]; });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => { const k = el.getAttribute("data-i18n-ph"); if (dic[k]) el.setAttribute("placeholder", dic[k]); });
    html.setAttribute("lang", lang);
    document.title = lang === "en" ? "Salvador Llácer Ivars — Design + Development" : "Salvador Llácer Ivars — Diseño + Desarrollo";
    document.querySelectorAll(".lang__btn").forEach((b) => { const on = b.dataset.lang === lang; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
    try { localStorage.setItem("idioma", lang); } catch (e) {}
  }
  document.querySelectorAll(".lang__btn").forEach((b) => b.addEventListener("click", () => aplicarIdioma(b.dataset.lang)));
  const idiomaGuardado = (() => { try { return localStorage.getItem("idioma"); } catch (e) { return null; } })();
  if (idiomaGuardado && I18N[idiomaGuardado]) aplicarIdioma(idiomaGuardado);

  /* ════════════════════════════════════════════════════════════
     ARRANQUE DE LA WEB (animaciones)
     ════════════════════════════════════════════════════════════ */
  let webArrancada = false;
  function arrancarWeb() {
    if (webArrancada) return; webArrancada = true;
    requestAnimationFrame(() => document.body.classList.add("is-loaded"));

    const capas = document.querySelectorAll(".parallax__forma");
    if (capas.length && !reduce) {
      let pendiente = false;
      const mover = () => { const y = window.scrollY; capas.forEach(c => { c.style.transform = `translate3d(0, ${y * (parseFloat(c.dataset.speed)||0)}px, 0)`; }); pendiente = false; };
      window.addEventListener("scroll", () => { if (!pendiente) { requestAnimationFrame(mover); pendiente = true; } }, { passive: true });
      mover();
    }

    const titulo = document.getElementById("titulo");
    const mask = document.querySelector(".titulo-mask");
    if (titulo && mask) {
      let tx = 0, ty = 0, cx = 0, cy = 0, activo = false;
      titulo.addEventListener("mousemove", (e) => { const r = titulo.getBoundingClientRect(); const nx = e.clientX - r.left, ny = e.clientY - r.top; if (!activo) { cx = nx; cy = ny; } tx = nx; ty = ny; activo = true; });
      titulo.addEventListener("mouseleave", () => { activo = false; });
      const loop = () => { if (activo) { cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16; mask.style.setProperty("--mx", cx + "px"); mask.style.setProperty("--my", cy + "px"); } requestAnimationFrame(loop); };
      loop();
    }

    const punto = document.querySelector(".cursor--punto");
    const anillo = document.querySelector(".cursor--anillo");
    if (punto && anillo && !esTactil) {
      document.body.classList.add("cursor-on");
      const pos = (e) => { const t = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`; punto.style.transform = t; anillo.style.transform = t; };
      addEventListener("mousemove", pos);
      const crece = () => { punto.classList.add("cursor--big"); anillo.classList.add("cursor--big"); };
      const encoge = () => { punto.classList.remove("cursor--big"); anillo.classList.remove("cursor--big"); };
      document.querySelectorAll("a, button, .magnet, .fila, .bloque, .nav__item, .catalogo-grande, .catalogo-sec, .empresa, .formacion__item, .chip, .prod__tarjeta, .video-card").forEach((el) => { el.addEventListener("mouseenter", crece); el.addEventListener("mouseleave", encoge); });
    }

    if (!reduce) {
      document.querySelectorAll(".magnet").forEach((el) => {
        el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width/2)*0.3}px, ${(e.clientY - r.top - r.height/2)*0.4}px)`; });
        el.addEventListener("mouseleave", () => { el.style.transform = ""; });
      });
    }

    const elementos = document.querySelectorAll(".reveal, .seccion__head, .fila, .bloque, .catalogo-grande, .prod__tarjeta, .formacion__item");
    if (!reduce && "IntersectionObserver" in window) {
      elementos.forEach((el, i) => { el.classList.add("reveal"); el.style.animationDelay = (i % 6) * 0.07 + "s"; });
      const obs = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }), { threshold: 0.12 });
      elementos.forEach((el) => obs.observe(el));
    } else { elementos.forEach((el) => el.classList.add("visible")); }

    const topBtn = document.getElementById("topBtn");
    if (topBtn) {
      const toggle = () => topBtn.classList.toggle("is-visible", scrollY > innerHeight * 0.6);
      addEventListener("scroll", toggle, { passive: true });
      toggle();
      topBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
    }
  }
  arrancarWeb(); // la web arranca directa (sin pantonera)

  /* ════════════════════════════════════════════════════════════
     API CLIMA · Open-Meteo (sin key) · con selector de ubicación
     Pinta temperatura actual + mín/máx + viento. La ubicación
     elegida se guarda en localStorage y se traduce el texto.
     ════════════════════════════════════════════════════════════ */
  (function clima(){
    const box = document.getElementById("clima");
    if (!box) return;
    const elIco = document.getElementById("climaIco");
    const elLugar = document.getElementById("climaLugar");
    const elTemp = document.getElementById("climaTemp");
    const elDesc = document.getElementById("climaDesc");
    const elMeta = document.getElementById("climaMeta");
    const sel = document.getElementById("climaSelect");

    // ⚠️ Cambia lat/lon de "jaraguas" si es otra ciudad
    const UBIS = {
      xativa:   { nombre: "Xàtiva · Valencia", lat: 38.9935, lon: -0.5181 },
      valencia: { nombre: "Valencia",          lat: 39.4699, lon: -0.3763 },
      jaraguas: { nombre: "Jaraguas",          lat: 38.947,  lon: -0.928  },
      lapobla:  { nombre: "La Pobla Llarga",   lat: 39.2167, lon: -0.5519 },
    };

    // Textos dinámicos del widget (los nombres de ciudad no se traducen)
    const TXT = {
      es: { cargando: "Cargando…", error: "Tiempo no disponible", min: "Mín", max: "Máx", viento: "Viento" },
      en: { cargando: "Loading…",  error: "Weather unavailable",  min: "Min", max: "Max", viento: "Wind" },
    };

    // Código WMO → icono + texto ES/EN
    const WMO = {
      0:{c:"sol",  es:"Despejado", en:"Clear"},
      1:{c:"sol",  es:"Mayormente despejado", en:"Mostly clear"},
      2:{c:"nube", es:"Parcialmente nublado", en:"Partly cloudy"},
      3:{c:"nube", es:"Nublado", en:"Overcast"},
      45:{c:"niebla",es:"Niebla", en:"Fog"}, 48:{c:"niebla",es:"Niebla helada", en:"Rime fog"},
      51:{c:"lluvia",es:"Llovizna ligera", en:"Light drizzle"}, 53:{c:"lluvia",es:"Llovizna", en:"Drizzle"},
      55:{c:"lluvia",es:"Llovizna intensa", en:"Dense drizzle"},
      61:{c:"lluvia",es:"Lluvia ligera", en:"Light rain"}, 63:{c:"lluvia",es:"Lluvia", en:"Rain"},
      65:{c:"lluvia",es:"Lluvia intensa", en:"Heavy rain"},
      71:{c:"nieve", es:"Nieve ligera", en:"Light snow"}, 73:{c:"nieve",es:"Nieve", en:"Snow"},
      75:{c:"nieve", es:"Nieve intensa", en:"Heavy snow"}, 77:{c:"nieve",es:"Granizo", en:"Grains"},
      80:{c:"lluvia",es:"Chubascos", en:"Showers"}, 81:{c:"lluvia",es:"Chubascos", en:"Showers"},
      82:{c:"lluvia",es:"Chubascos fuertes", en:"Violent showers"},
      95:{c:"tormenta",es:"Tormenta", en:"Thunderstorm"}, 96:{c:"tormenta",es:"Tormenta con granizo", en:"Storm + hail"},
      99:{c:"tormenta",es:"Tormenta con granizo", en:"Storm + hail"},
    };
    const ICONO = {
      sol:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`,
      nube:`<svg viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 19z"/></svg>`,
      niebla:`<svg viewBox="0 0 24 24"><path d="M17.5 15a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 15"/><path d="M4 19h16M7 22h13"/></svg>`,
      lluvia:`<svg viewBox="0 0 24 24"><path d="M17.5 14a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 14"/><path d="M8 18l-1 3M13 18l-1 3M18 18l-1 3"/></svg>`,
      nieve:`<svg viewBox="0 0 24 24"><path d="M17.5 14a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 14"/><path d="M8 18v3M13 18v3M18 18v3"/></svg>`,
      tormenta:`<svg viewBox="0 0 24 24"><path d="M17.5 13a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 13"/><path d="M13 15l-3 4h3l-1 4 4-5h-3z"/></svg>`,
    };

    let actual = "xativa";
    try { const g = localStorage.getItem("climaUbi"); if (g && UBIS[g]) actual = g; } catch (e) {}
    let ultimo = null, pid = 0;

    const lang = () => document.documentElement.getAttribute("lang") || "es";
    const url = (u) => `https://api.open-meteo.com/v1/forecast?latitude=${u.lat}&longitude=${u.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1`;

    function pintar(){
      const L = lang();
      elLugar.textContent = UBIS[actual].nombre;
      if (!ultimo) { elIco.innerHTML = ""; elTemp.textContent = "–"; elDesc.textContent = TXT[L].error; elMeta.textContent = ""; return; }
      const w = WMO[ultimo.code] || { c:"nube", es:"—", en:"—" };
      elIco.innerHTML = ICONO[w.c];
      elTemp.textContent = Math.round(ultimo.temp) + "°";
      elDesc.textContent = L === "en" ? w.en : w.es;
      elMeta.textContent = `${TXT[L].min} ${Math.round(ultimo.min)}° · ${TXT[L].max} ${Math.round(ultimo.max)}° · ${TXT[L].viento} ${Math.round(ultimo.viento)} km/h`;
    }

    async function cargar(reintentos = 1){
      const u = UBIS[actual], id = ++pid;
      ultimo = null;
      elLugar.textContent = u.nombre;
      elIco.innerHTML = ""; elTemp.textContent = "–"; elDesc.textContent = TXT[lang()].cargando; elMeta.textContent = "";
      try {
        const r = await fetch(url(u));
        if (!r.ok) throw new Error("http");
        const d = await r.json();
        if (id !== pid) return; // una petición más nueva ganó
        ultimo = { temp: d.current.temperature_2m, code: d.current.weather_code, viento: d.current.wind_speed_10m, min: d.daily.temperature_2m_min[0], max: d.daily.temperature_2m_max[0] };
        pintar();
      } catch (e) {
        if (id !== pid) return;
        if (reintentos > 0) setTimeout(() => cargar(reintentos - 1), 2500);
        else { ultimo = null; pintar(); }
      }
    }

    sel.value = actual;
    sel.addEventListener("change", () => {
      actual = sel.value;
      try { localStorage.setItem("climaUbi", actual); } catch (e) {}
      cargar();
    });
    // Repinta al cambiar idioma (sin tocar aplicarIdioma)
    new MutationObserver(pintar).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    cargar();
  })();
});
