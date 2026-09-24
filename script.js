/* script.js */

document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  requestAnimationFrame(() => document.body.classList.add("is-loaded"));

  /* Parallax */
  const capas = document.querySelectorAll(".parallax__forma");
  if (capas.length && !reduce) {
    let pendiente = false;
    const mover = () => { const y = window.scrollY; capas.forEach(c => { c.style.transform = `translate3d(0, ${y * (parseFloat(c.dataset.speed)||0)}px, 0)`; }); pendiente = false; };
    window.addEventListener("scroll", () => { if (!pendiente) { requestAnimationFrame(mover); pendiente = true; } }, { passive: true });
    mover();
  }

  /* Máscara del título */
  const titulo = document.getElementById("titulo");
  const mask = document.querySelector(".titulo-mask");
  if (titulo && mask) {
    let tx = 0, ty = 0, cx = 0, cy = 0, activo = false;
    titulo.addEventListener("mousemove", (e) => {
      const r = titulo.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      if (!activo) { cx = nx; cy = ny; }
      tx = nx; ty = ny; activo = true;
    });
    titulo.addEventListener("mouseleave", () => { activo = false; });
    const loop = () => {
      if (activo) {
        cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
        mask.style.setProperty("--mx", cx + "px");
        mask.style.setProperty("--my", cy + "px");
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* Cursor 1:1 */
  const punto = document.querySelector(".cursor--punto");
  const anillo = document.querySelector(".cursor--anillo");
  const esTactil = matchMedia("(pointer: coarse)").matches || ("ontouchstart" in window && navigator.maxTouchPoints > 0);

  if (punto && anillo && !esTactil) {
    document.body.classList.add("cursor-on");
    const pos = (e) => {
      const t = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      punto.style.transform = t; anillo.style.transform = t;
    };
    addEventListener("mousemove", pos);
    const crece = () => { punto.classList.add("cursor--big"); anillo.classList.add("cursor--big"); };
    const encoge = () => { punto.classList.remove("cursor--big"); anillo.classList.remove("cursor--big"); };
    document.querySelectorAll("a, button, .magnet, .fila, .bloque, .nav__item, .catalogo-grande, .catalogo-sec, .empresa, .empresa__video, .formacion__item, .chip").forEach((el) => {
      el.addEventListener("mouseenter", crece);
      el.addEventListener("mouseleave", encoge);
    });
  }

  /* Hover magnético */
  if (!reduce) {
    document.querySelectorAll(".magnet").forEach((el) => {
      el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width/2)*0.3}px, ${(e.clientY - r.top - r.height/2)*0.4}px)`; });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* Revelado escalonado */
  const elementos = document.querySelectorAll(".reveal, .seccion__head, .fila, .bloque, .catalogo-grande, .catalogo-sec, .empresa, .formacion__item");
  if (!reduce && "IntersectionObserver" in window) {
    elementos.forEach((el, i) => { el.classList.add("reveal"); el.style.animationDelay = (i % 6) * 0.07 + "s"; });
    const obs = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }), { threshold: 0.12 });
    elementos.forEach((el) => obs.observe(el));
  } else { elementos.forEach((el) => el.classList.add("visible")); }

  /* Botón volver arriba */
  const topBtn = document.getElementById("topBtn");
  if (topBtn) {
    const toggle = () => topBtn.classList.toggle("is-visible", scrollY > innerHeight * 0.6);
    addEventListener("scroll", toggle, { passive: true });
    toggle();
    topBtn.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  }

  /* Modo claro/oscuro */
  const html = document.documentElement;
  const temaBtn = document.getElementById("tema");
  const metaTema = document.querySelector('meta[name="theme-color"]');
  const setTema = (t) => { html.setAttribute("data-theme", t); if (temaBtn) temaBtn.setAttribute("aria-pressed", t === "light"); if (metaTema) metaTema.setAttribute("content", t === "light" ? "#f4f4f2" : "#0a0a0b"); try { localStorage.setItem("tema", t); } catch (e) {} };
  const temaGuardado = (() => { try { return localStorage.getItem("tema"); } catch (e) { return null; } })();
  if (temaGuardado) setTema(temaGuardado);
  if (temaBtn) temaBtn.addEventListener("click", () => setTema(html.getAttribute("data-theme") === "light" ? "dark" : "light"));

  /* Traducciones */
  const I18N = {
    es: {
      "nav.sobre":"Sobre mí","nav.servicios":"Competencias","nav.catalogos":"Catálogos","nav.pasiones":"Pasiones","nav.contacto":"Contacto","nav.programacion":"Programación","nav.empresas":"Experiencia","nav.formacion":"Formación",
      "status":"Disponible","eyebrow":"Diseño + Desarrollo · Perfil técnico-creativo",
      "word1":"Diseño","word2":"Fábrica","word3":"Código",
      "hero.frase":"Pienso como diseñador y ejecuto como desarrollador. Convierto ideas en interfaces y aplicaciones que se ven profesionales y funcionan de verdad.",
      "btn.propuesta":"Mi experiencia","btn.hablemos":"Hablemos",
      "sec.sobre":"Sobre mí","sec.hecho":"Competencias","sec.hecho.sub":"Lo que aporto a un equipo, del diseño al código.",
      "sec.empresas":"Experiencia","sec.empresas.sub":"Experiencia real que combina diseño, fabricación y trabajo administrativo.",
      "sec.form":"Formación","sec.form.sub":"Cuatro títulos de grado superior que combinan diseño, técnica y programación.","form.tools":"Herramientas",
      "sec.cat":"Catálogos","sec.cat.sub":"Diseño editorial realizado en mi última empresa: catálogos corporativos e industriales, de la retícula a la producción.","sec.gusta":"Me gusta","sec.gusta.sub":"Lo que consumo y creo alimenta cómo diseño y programo.",
      "ficha":"Soy Salvador Llácer Ivars, técnico superior en Imagen, Artes Gráficas, Diseño en Fabricación Mecánica y Desarrollo de Aplicaciones Multiplataforma. Esa mezcla me permite llevar una idea desde el boceto hasta el producto final sin perder el criterio visual ni la solidez del código. Busco proyectos donde el detalle y el código limpio importen tanto como la idea.",
      "prog.marca":"Programación","prog.titulo":"Un perfil difícil de encontrar","prog.texto":"Formado en DAM y con origen en las artes gráficas: escribo código ordenado y cuido cada interfaz como una pieza de diseño. Piensas en producto, no solo en pantalla.","prog.btn":"¿Trabajamos juntos?",
      "chk1":"Desarrollo multiplataforma","chk2":"Interfaces claras y coherentes","chk3":"Pensamiento de producto","chk4":"Materializo ideas",
      "s1.t":"Diseño gráfico","s1.d":"Identidad y piezas con intención, listas para producción.",
      "s2.t":"Fotografía","s2.d":"Composición, luz y narrativa al servicio de tu marca.","s2.m":"Luz · Encuadre",
      "s3.t":"Edición de vídeo","s3.d":"Ritmo, sonido y montaje para contenido que retiene.",
      "s4.t":"Dibujo e ilustración","s4.d":"Expresión y forma propia, sin recursos genéricos.","s4.m":"Trazo · Color",
      "s5.t":"Delineación industrial","s5.d":"Precisión y planos cuando el detalle importa.","s5.m":"Geometría",
      "s6.t":"Gestión administrativa","s6.d":"Método y orden para que el proyecto fluya.","s6.m":"Organización",
      "exp.ultima":"Última empresa","exp.weidner.puesto":"Diseño de producto · Administración · Imagen corporativa",
      "exp.weidner.l1":"Diseño desde cero de torres de apilamiento para logística en automoción (CATIA V5 / CATIA Xperience) y elaboración de la planimetría.",
      "exp.weidner.l2":"Creación de la estructura de artículos (BOM) en el ERP Geinprod, emisión de órdenes de fabricación y seguimiento con Producción.",
      "exp.weidner.l3":"Pedidos a proveedores, seguimiento y solicitud de materiales para fabricar las torres.",
      "exp.weidner.l4":"Imagen corporativa: catálogos, banners, folletos, tarjetas de visita, stands de feria y firmas de correo.",
      "emp.interpreta.rol":"Producción audiovisual",
      "emp.interpreta.l1":"Producción de vídeos para el canal de la marca.",
      "emp.interpreta.l2":"Composición de música original para algunos de los vídeos.",
      "emp.interpreta.l3":"Colaboración en guiones y en la grabación del contenido audiovisual.",
      "emp.interpreta.l4":"Montaje y edición de vídeo con Adobe Premiere y Adobe Audition.",
      "emp.web":"Web oficial","emp.ver":"Ver en YouTube",
      "cat.titulo":"Catálogo interactivo","cat.full":"Ver a pantalla completa","flip.titulo":"Catálogo Weidner","flip.abrir":"Abrir catálogo","flip.desc":"Catálogo corporativo/industrial maquetado en InDesign y publicado como folleto digital interactivo.",
      "form.t1":"Desarrollo de Aplicaciones Multiplataforma","form.t1d":"Programación Java y Android y desarrollo de apps multiplataforma.",
      "form.t2":"Diseño en Fabricación Mecánica","form.t2d":"Diseño de producto en 3D, planos y documentación de fabricación.",
      "form.t3":"Artes Gráficas","form.t3d":"Maquetación editorial, preimpresión y producción gráfica.",
      "form.t4":"Imagen","form.t4d":"Fotografía, vídeo y tratamiento de imagen.",
      "p1.t":"Cine y series","p1.d":"Estudio narrativa y ritmo para contar mejor.",
      "p2.t":"Videojuegos","p2.d":"Referente de UX, interacción y mundos coherentes.",
      "p3.t":"Crear música","p3.d":"Ritmo y estructura como criterio de diseño.",
      "p4.t":"Dibujo","p4.d":"Forma y mirada aplicadas a cada entregable.",
      "pie.eyebrow":"¿Tienes un proyecto?","pie.nota":"Abierto a nuevas oportunidades. Diseño, desarrollo y administración en una sola persona.","pie.loc":"Localización",
      "modal.eyebrow":"Hablemos","modal.titulo":"Cuéntame tu proyecto","form.nombre":"Nombre","form.email":"Email","form.mensaje":"Mensaje","form.ph_nombre":"Tu nombre","form.ph_email":"tu@correo.com","form.ph_mensaje":"¿En qué puedo ayudarte?","form.enviar":"Enviar mensaje","form.exito":"✓ Mensaje enviado correctamente."
    },
    en: {
      "nav.sobre":"About","nav.servicios":"Skills","nav.catalogos":"Catalogues","nav.pasiones":"Passions","nav.contacto":"Contact","nav.programacion":"Programming","nav.empresas":"Experience","nav.formacion":"Education",
      "status":"Available","eyebrow":"Design + Development · Technical-creative profile",
      "word1":"Design","word2":"Manufacturing","word3":"Code",
      "hero.frase":"I think like a designer and build like a developer. I turn ideas into interfaces and applications that look professional and truly work.",
      "btn.propuesta":"My experience","btn.hablemos":"Let's talk",
      "sec.sobre":"About me","sec.hecho":"Skills","sec.hecho.sub":"What I bring to a team, from design to code.",
      "sec.empresas":"Experience","sec.empresas.sub":"Hands-on experience combining design, manufacturing and administration.",
      "sec.form":"Education","sec.form.sub":"Four senior technician degrees combining design, engineering and programming.","form.tools":"Tools",
      "sec.cat":"Catalogues","sec.cat.sub":"Editorial design created at my last company: corporate and industrial catalogues, from grid to press.","sec.gusta":"What I love","sec.gusta.sub":"What I consume and create shapes how I design and code.",
      "ficha":"I am Salvador Llácer Ivars, senior technician in Imaging, Graphic Arts, Design in Mechanical Manufacturing and Multiplatform Application Development. That combination lets me take an idea from sketch to final product without losing visual judgment or code solidity. I look for projects where detail and clean code matter as much as the idea.",
      "prog.marca":"Programming","prog.titulo":"A profile that's hard to find","prog.texto":"Trained in DAM and rooted in graphic arts: I write clean, ordered code and treat every interface as a design piece. You think in product, not just in screens.","prog.btn":"Shall we work together?",
      "chk1":"Multiplatform development","chk2":"Clear, coherent interfaces","chk3":"Product thinking","chk4":"I make ideas real",
      "s1.t":"Graphic design","s1.d":"Identity and pieces with intent, production-ready.",
      "s2.t":"Photography","s2.d":"Composition, light and narrative in service of your brand.","s2.m":"Light · Framing",
      "s3.t":"Video editing","s3.d":"Rhythm, sound and editing for content that holds attention.",
      "s4.t":"Drawing & illustration","s4.d":"Original expression and form, no generic assets.","s4.m":"Line · Color",
      "s5.t":"Industrial drafting","s5.d":"Precision and blueprints when the detail matters.","s5.m":"Geometry",
      "s6.t":"Administrative management","s6.d":"Method and order so the project flows.","s6.m":"Organisation",
      "exp.ultima":"Most recent role","exp.weidner.puesto":"Product design · Administration · Corporate image",
      "exp.weidner.l1":"Designed stacking towers from scratch for automotive logistics (CATIA V5 / CATIA Xperience) and produced the blueprints.",
      "exp.weidner.l2":"Built the bill of materials (BOM) in the Geinprod ERP, issued manufacturing orders and tracked them with the production team.",
      "exp.weidner.l3":"Placed and tracked supplier orders and requested the materials needed to build the towers.",
      "exp.weidner.l4":"Corporate image: catalogues, banners, brochures, business cards, trade-show stands and email signatures.",
      "emp.interpreta.rol":"Audiovisual production",
      "emp.interpreta.l1":"Produced videos for the brand's channel.",
      "emp.interpreta.l2":"Composed original music for some of the videos.",
      "emp.interpreta.l3":"Collaborated on scripts and on filming the audiovisual content.",
      "emp.interpreta.l4":"Edited videos with Adobe Premiere and Adobe Audition.",
      "emp.web":"Official website","emp.ver":"Watch on YouTube",
      "cat.titulo":"Interactive catalogue","cat.full":"View fullscreen","flip.titulo":"Weidner catalogue","flip.abrir":"Open catalogue","flip.desc":"Corporate/industrial catalogue laid out in InDesign and published as an interactive digital booklet.",
      "form.t1":"Multiplatform Application Development","form.t1d":"Java and Android programming and multiplatform app development.",
      "form.t2":"Design in Mechanical Manufacturing","form.t2d":"3D product design, blueprints and manufacturing documentation.",
      "form.t3":"Graphic Arts","form.t3d":"Editorial layout, prepress and graphic production.",
      "form.t4":"Imaging","form.t4d":"Photography, video and image processing.",
      "p1.t":"Film & series","p1.d":"I study narrative and rhythm to tell stories better.",
      "p2.t":"Video games","p2.d":"Reference for UX, interaction and coherent worlds.",
      "p3.t":"Making music","p3.d":"Rhythm and structure as design criteria.",
      "p4.t":"Drawing","p4.d":"Form and eye applied to every deliverable.",
      "pie.eyebrow":"Have a project?","pie.nota":"Open to new opportunities. Design, development and administration in one person.","pie.loc":"Location",
      "modal.eyebrow":"Let's talk","modal.titulo":"Tell me about your project","form.nombre":"Name","form.email":"Email","form.mensaje":"Message","form.ph_nombre":"Your name","form.ph_email":"you@email.com","form.ph_mensaje":"How can I help you?","form.enviar":"Send message","form.exito":"✓ Message sent successfully."
    }
  };

  let idioma = "es";
  const aplicarIdioma = (lang) => {
    idioma = lang;
    const dic = I18N[lang];
    document.querySelectorAll("[data-i18n]").forEach((el) => { const k = el.getAttribute("data-i18n"); if (dic[k]) el.textContent = dic[k]; });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => { const k = el.getAttribute("data-i18n-ph"); if (dic[k]) el.setAttribute("placeholder", dic[k]); });
    html.setAttribute("lang", lang);
    document.title = lang === "en" ? "Salvador Llácer Ivars — Design + Development" : "Salvador Llácer Ivars — Diseño + Desarrollo";
    document.querySelectorAll(".lang__btn").forEach((b) => { const on = b.dataset.lang === lang; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on); });
    try { localStorage.setItem("idioma", lang); } catch (e) {}
  };
  document.querySelectorAll(".lang__btn").forEach((b) => b.addEventListener("click", () => aplicarIdioma(b.dataset.lang)));
  const idiomaGuardado = (() => { try { return localStorage.getItem("idioma"); } catch (e) { return null; } })();
  if (idiomaGuardado && I18N[idiomaGuardado]) aplicarIdioma(idiomaGuardado);

  /* Menú móvil + dropdowns táctiles */
  const burger = document.querySelector(".nav__burger");
  if (burger) {
    const cerrarMenu = () => { document.body.classList.remove("nav-open"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav__menu a[href^='#']").forEach(a => a.addEventListener("click", cerrarMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });
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

  /* Modal de contacto: confirmación + cierre automático a 2 s */
  const modal = document.getElementById("modal");
  const form = document.getElementById("form");
  const exito = document.getElementById("exito");
  const btnEnviar = form ? form.querySelector("button[type=submit]") : null;
  const campos = form ? form.querySelectorAll(".form__campo") : null;
  let timer = 0;

  const abrir = () => { modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.remove("cursor-on"); const p = form.querySelector("input"); if (p) setTimeout(() => p.focus(), 200); };
  const limpiar = () => {
    form.reset();
    if (btnEnviar) btnEnviar.style.display = "";
    if (campos) campos.forEach(c => c.style.display = "");
    if (exito) exito.hidden = true;
  };
  const cerrar = () => { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); if (!esTactil) document.body.classList.add("cursor-on"); clearTimeout(timer); limpiar(); };

  if (modal && form) {
    document.querySelectorAll(".js-contacto").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); abrir(); }));
    modal.querySelectorAll("[data-cerrar]").forEach((el) => el.addEventListener("click", cerrar));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) cerrar(); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (btnEnviar) btnEnviar.style.display = "none";
      if (campos) campos.forEach(c => c.style.display = "none");
      if (exito) exito.hidden = false;
      timer = setTimeout(cerrar, 2000);
    });
  }
});
