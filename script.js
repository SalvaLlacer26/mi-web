/* script.js · hub + subwebs · hover, desplegable, anclas, vista global + por subsección, FAB/TOC, stats, modal, lightbox, Wikipedia, clima */

document.addEventListener("DOMContentLoaded", () => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;
  const anio = document.getElementById("anio"); if (anio) anio.textContent = new Date().getFullYear();

  /* Menu movil */
  const burger = document.querySelector(".nav__burger");
  const cerrarMenu = () => { document.body.classList.remove("nav-open"); if (burger) burger.setAttribute("aria-expanded", "false"); };
  if (burger) burger.addEventListener("click", () => { const open = document.body.classList.toggle("nav-open"); burger.setAttribute("aria-expanded", String(open)); });

  /* ░░ Anclas con offset de nav (lleva al título/subtítulo) ░░ */
  const navH = () => { const n = document.querySelector(".nav"); return n ? n.offsetHeight : 70; };
  const goToId = (id) => {
    const el = document.getElementById(id); if (!el) return false;
    const y = el.getBoundingClientRect().top + window.scrollY - (navH() + 14);
    window.scrollTo({ top: y < 0 ? 0 : y, behavior: reduce ? "auto" : "smooth" });
    try { history.replaceState(null, "", "#" + id); } catch (e) {}
    return true;
  };
  const thisFile = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="#"]'); if (!a) return;
    if (a.hasAttribute("data-soon")) return;
    const href = a.getAttribute("href"); const hash = href.split("#")[1]; if (!hash) return;
    const path = href.split("#")[0];
    const samePage = !path || path.toLowerCase() === thisFile;
    if (!samePage) return;                       /* enlace a otra página: navegación normal */
    if (!document.getElementById(hash)) return;
    e.preventDefault(); cerrarMenu(); goToId(hash);
  });

  /* Gama por hover (hub) */
  if (!html.hasAttribute("data-tema")) {
    const activar = (t) => html.setAttribute("data-tema", t), neutro = () => html.removeAttribute("data-tema");
    document.querySelectorAll("[data-tema]").forEach((el) => {
      const t = el.dataset.tema;
      el.addEventListener("mouseenter", () => activar(t)); el.addEventListener("focus", () => activar(t));
      el.addEventListener("mouseleave", neutro); el.addEventListener("blur", neutro);
    });
  }

  /* Accesibilidad desplegable */
  document.querySelectorAll(".nav__item").forEach((item) => {
    const tgl = item.querySelector(".nav__toggle"); if (!tgl) return;
    const on = () => tgl.setAttribute("aria-expanded", "true");
    const off = () => tgl.setAttribute("aria-expanded", "false");
    item.addEventListener("mouseenter", on); item.addEventListener("mouseleave", off);
    item.addEventListener("focusin", on); item.addEventListener("focusout", (e) => { if (!item.contains(e.relatedTarget)) off(); });
  });

  /* Parallax (desactivado en modo mosaico para no gastar CPU) */
  if(!reduce&&matchMedia("(pointer:fine)").matches){
    const objs=document.querySelector(".fondo__objetos");
    if(objs){
      let tx=0,ty=0,cx=0,cy=0,raf=0;
      const tick=()=>{ raf=0; cx+=(tx-cx)*.07; cy+=(ty-cy)*.07;
        objs.style.transform=`translate3d(${(cx*-44).toFixed(2)}px,${(cy*-30).toFixed(2)}px,0)`;
        if(Math.abs(tx-cx)>.0008||Math.abs(ty-cy)>.0008) raf=requestAnimationFrame(tick); };
      addEventListener("pointermove",(e)=>{
        if(html.getAttribute("data-view")==="grid"){ if(objs.style.transform) objs.style.transform=""; return; }
        tx=e.clientX/innerWidth-.5; ty=e.clientY/innerHeight-.5; if(!raf) raf=requestAnimationFrame(tick);
      },{passive:true});
    }
  }

  /* ░░ Idioma ░░ */
  const I18N = {
    es:{ "m.inicio":"Inicio","m.foto":"Foto","m.diseno":"Diseño","m.video":"Vídeo y música","m.musica":"Música","m.dam":"DAM","m.mec":"Mecánica","m.contacto":"Contacto",
      "sec.sobre":"Sobre mí","sec.obra":"Obra","sec.form":"Formación","sec.tools":"Herramientas","sec.exp":"Experiencia","h1.foto":"Fotografía — Salvador Llácer Ivars","h1.diseno":"Diseño gráfico — Salvador Llácer Ivars","h1.video":"Vídeo y música — Salvador Llácer Ivars","h1.fab":"Fabricación mecánica — Salvador Llácer Ivars","sec.comp":"Competencias","sec.ref":"Referentes","sec.lastfm":"Lo que escucho","sec.inspo":"Inspiración viva","sec.lab":"Tipografía &amp; motion",
      "sub.paisaje":"Paisaje","sub.robados":"Robados","sub.personal":"Visión personal","sub.bodegon":"Bodegón publicitario","sub.moda":"Moda","sub.retrato":"Retrato","sub.etsid":"ETSID · UPV","sub.casos":"Casos de proyecto","sub.bodas":"Bodas y eventos",
      "sub.posters":"Pósters","sub.folletos":"Folletos","sub.flyers":"Flyers","sub.identidad":"Identidad","sub.otros":"Otros productos","sub.portfolio":"Portfolio","sub.encantado":"Universo encantado","sub.sef":"SEF · Deporte UV","sub.weidner":"Weidner",
      "sub.video":"Vídeo","sub.musica":"Música","sub.interpreta":"Interpreta Natura","sub.missr":"MissR · 3R","sub.eco":"ECO","sub.arte":"ARTE","sub.ods":"ODS","sub.reviu":"Reviu lo Rural","sub.otrosvideos":"Otros proyectos",
      "view.toGrid":"Mosaico","view.toStd":"Carrusel",
      "eyebrow":"Diseño + Desarrollo · Perfil técnico-creativo","hub.nombre":"Salvador Llácer Ivars","hub.frase":"Seis disciplinas, una sola forma de trabajar: pensar como diseñador y ejecutar como desarrollador. Elige por dónde entrar.",
      "hub.lema":"Diseño · Imagen · Desarrollo",
      "bn.piensa":"Piensa","bn.piensa.pop":"Toda pieza empieza con una pregunta: investigo, esbozo y doy estructura a la idea antes de tocar la herramienta.",
      "bn.disena":"Diseña","bn.disena.pop":"Tipografía, color y composición al servicio del mensaje: que algo se vea bien antes de que se lea.",
      "bn.desarrolla":"Desarrolla","bn.desarrolla.pop":"Del boceto al navegador con HTML, CSS y JavaScript puro: rápido, accesible y sin frameworks de por medio.",
      "bn.instr":"Haz clic y arrastra hacia la izquierda","bn.instr.sub":"o navega con las flechas ← →",
      "bn.ver":"VER PORTFOLIO","bn.rec":"REC · 01 — FOTOGRAFÍA",
      "carga.titulo":"PORTFOLIO","carga.bienvenida":"Bienvenido","carga.entrar":"ENTRAR","carga.tema.foto":"Fotograf&iacute;a","carga.tema.diseno":"Dise&ntilde;o","carga.tema.video":"V&iacute;deo y m&uacute;sica","carga.tema.fab":"Fabricaci&oacute;n mec&aacute;nica",
      "bn.diseno.etq":"02 — DISEÑO GRÁFICO","bn.diseno.tit":"Ideas que se ven","bn.diseno.desc":"Flyers, marca, editorial e iconografía. Haz clic en el mosaico para descubrir el portfolio.",
      "bn.fab.etq":"04 — FABRICACIÓN MECÁNICA","bn.fab.tit":"<span>Si puedes <i>imaginarlo</i></span><span>lo puedes <i>fabricar</i></span>","bn.fab.desc":"Torres de apilamiento para automoción en CATIA V5, planos y modelos 3D. Del boceto paramétrico a la pieza sellada.","bn.fab.cta":"VER PORTFOLIO","bn.fab.hint":"Gira la rueda del ratón arriba para descubrir el ensamble",
      "bot.titulo":"Asistente PORTFOLIO","bot.sub":"Pregúntame por mis habilidades o por dónde verlas","bot.ph":"Escribe tu pregunta…","bot.enviar":"Enviar",
      "bot.q1":"¿Maneja Photoshop?","bot.q2":"Ver fotografía","bot.q3":"Ver diseño","bot.q4":"¿Quién es Salvador?","bot.q5":"¿Cómo contacto?",
      "consejo.titulo":"Un consejo al día","consejo.otro":"Otro consejo","consejo.carga":"Cargando consejo…","consejo.fuente":"Advice Slip API","consejo.error":"No se pudo cargar el consejo. Inténtalo de nuevo.",
      "f.inspo.titulo":"Inspiración viva","f.inspo.sub":"Una ventana aleatoria a Unsplash vía Picsum: paisaje, retrato y bodegón para seguir mirando.","f.inspo.c1":"Paisaje","f.inspo.c2":"Retrato","f.inspo.c3":"Bodegón","f.inspo.c4":"Arquitectura","f.inspo.c5":"Blanco y negro","f.inspo.carga":"Cargando imágenes…","f.inspo.error":"No se pudieron cargar las imágenes. Inténtalo de nuevo.","f.inspo.credito":"Fotografías de la comunidad de","f.inspo.otra":"Otra tanda",
      "d.lab.titulo":"Tipografía &amp; motion","d.lab.sub":"Muestras en vivo de Google Fonts e iconografía animada con Lordicon: dos librerías gratuitas que uso en prototipos.","d.lab.fuentes":"Tipografías","d.lab.texto":"Texto de muestra","d.lab.fuente":"Fuentes servidas por la API pública de","d.lab.iconos":"Iconos animados","d.lab.iconos.nota":"Animaciones Lottie de","d.lab.iconos.plan":"(plan gratuito)","cargando":"Cargando…",
      "sobre.p1":"Soy <strong>Salvador Llácer Ivars</strong>, nacido en Valencia. Técnico superior en Imagen y Artes Gráficas, en Diseño y Producción Editorial, en Diseño en Fabricación Mecánica y, actualmente, en Desarrollo de Aplicaciones Multiplataforma. Desde pequeño me apasionan el dibujo, la música y la idea de crear historias propias; esa curiosidad me ha llevado a estudiar siempre algo nuevo y a cruzar disciplinas que normalmente van por separado.",
      "sobre.p2":"Mi trayectoria une la imagen y el diseño: fotografía artística formada en la <strong>EASD de València</strong> (paisaje, arquitectura, reportaje, moda, bodegón y retrato), encargos de fotografía de interior para la <strong>ETSID de la UPV</strong> y fotografía de bodas; diseño gráfico y editorial aprendido en el <strong>CIPFP Ciudad del Aprendizaje</strong> y aplicado en <strong>Weidner Ibérica</strong>, donde me encargué de la imagen de la empresa: catálogos —también interactivos—, displays y tótems para ferias de automoción, identidad y firmas de correo.",
      "sobre.p3":"En el lado técnico llevé más de cinco años en Weidner Ibérica diseñando torres de apilamiento (<em>stacking columns</em>) para el sector de la automoción con <strong>CATIA V5</strong> y planimetría, además de tareas administrativas con el ERP <strong>Geinprod</strong>. Hoy curso el CFGS de <strong>DAM</strong>, donde programo, trabajo con bases de datos, Figma e inteligencia artificial. Completo el cuadro la creación musical con <strong>GarageBand</strong> —bandas sonoras y podcasts para Interpreta Natura—, la ilustración y el dibujo.",
      "sobre.p4":"Me va el minimalista con corrección geométrica y pesos visuales equilibrados: paletas complementarias, orden minucioso y resultados sencillos pero profesionales. Busco estabilidad laboral sin renunciar a la ambición de mejorar, y llevar todas mis habilidades a cada proyecto para que se aprecie un perfil completo y <strong>multidisciplinar</strong>.",
      "pie.volver":"← Volver al inicio",
      "sel.foto":"Fotografía","sel.foto.sub":"Luz, encuadre y narrativa","sel.diseno":"Diseño gráfico e ilustración","sel.diseno.sub":"Retícula, tinta y trazo","sel.video":"Edición de vídeo","sel.video.sub":"Ritmo, sonido y color","sel.musica":"Música","sel.musica.sub":"Composición y montaje sonoro","sel.dam":"DAM y videojuegos","sel.dam.sub":"Código, apps y Simon Says","sel.fab":"Fabricación mecánica","sel.fab.sub":"CATIA, planos y ERP",
      "pie.eyebrow":"¿Tienes un proyecto?","pie.nota":"Abierto a nuevas oportunidades. Diseño, desarrollo y administración en una sola persona.","pie.loc":"Localización","clima.ubicacion":"Ubicación",
      "modal.eyebrow":"Hablemos","modal.titulo":"Cuéntame tu proyecto","form.nombre":"Nombre","form.email":"Email","form.mensaje":"Mensaje","form.enviar":"Enviar mensaje","form.exito":"✓ Mensaje enviado. Gracias por tu contacto; me pondré en contacto contigo muy pronto.","toast.soon":"Subweb en construcción",
      "f.sobre.titulo":"Sobre mí",
      "f.escena.titulo":"Fotografía: mirada, luz y oficio",
      "f.escena.texto":"Nací en Valencia y aprendí a mirar antes que a escribir. En la EASD de València cursé Fotografía Artística —paisaje, arquitectura, interiorismo, reportaje social, moda y bodegón publicitario— y aprendí a moldear la luz en lugar de sufrirla. Mi criterio bebe de Ansel Adams, Henri Cartier-Bresson y Richard Avedon: medida, instante y gesto. He firmado encargos de imagen para la ETSID de la UPV y reportajes de bodas; en cada serie busco una fotografía honesta, coherente y bien revelada, sin artificio.",
      "f.obra.titulo":"Obra",
      "f.obra.sub":"Lo que aprendí en la EASD, aplicado: <strong>Paisaje</strong>, <strong>Robados</strong>, <strong>Visión personal</strong>, <strong>Bodegón publicitario</strong>, <strong>Moda</strong> y <strong>Retrato</strong>. Seis formas de mirar —la luz quieta del paisaje, el instante robado de la calle, la mirada propia, el objeto bien iluminado, el gesto de la prenda y el rostro sin artificio—, cada una en su sitio.",
      "f.obra.paisaje.titulo":"Paisaje","f.obra.paisaje.desc":"Del prado a la ciudad: luz quieta, atmósfera y encuadre medido. El paisaje como ejercicio de paciencia, donde el terreno revela su carácter.",
      "f.obra.robados.titulo":"Robados","f.obra.robados.desc":"Reportaje social en la estela de Cartier-Bresson: el instante decisivo. No se retrata a nadie, se sorprende el gesto verdadero antes de que se componga para la cámara.",
      "f.obra.personal.titulo":"Visión personal","f.obra.personal.desc":"Una mirada introspectiva que cuestiona lo establecido y abraza una visión generalista del mundo. Aquí la fotografía no documenta una realidad externa: compone, duda y relaciona, usando el encuadre como forma de pensar.",
      "f.obra.bodegon.titulo":"Bodegón publicitario","f.obra.bodegon.desc":"Composición, textura y luz dirigida para dar peso al objeto. El producto como protagonista: control del reflejo, del fondo y del punto de luz que lo hace deseable.",
      "f.obra.moda.titulo":"Moda","f.obra.moda.desc":"Dirección de imagen, gesto y luz al servicio de la prenda. El cuerpo en movimiento como línea compositiva: aire, ritmo y una historia contada con el encuadre.",
      "f.obra.retrato.titulo":"Retrato","f.obra.retrato.desc":"Fondo limpio, tensión elegante y la mirada por delante del artificio: buscar a la persona, no la pose. Retrato como encuentro, medido en la luz y en el silencio.",
      "f.form.titulo":"Formación",
      "f.form.item1.titulo":"Fotografía Artística","f.form.item1.texto":"Técnico superior en Imagen: paisaje, arquitectura, interiorismo, reportaje social, moda y bodegón publicitario. La base técnica de todo lo que hay en esta página.","f.form.item1.centro":"EASD València · Escola d'Art i Superior de Disseny",
      "f.form.item2.titulo":"Diseño y Producción Editorial","f.form.item2.texto":"Color, preimpresión y maquetación. El origen de mi ojo para el encuadre, el tono y el detalle bien acabado.","f.form.item2.centro":"CIPFP Ciudad del Aprendiz",
      "f.tools.titulo":"Herramientas","f.tools.sub":"Software que manejo a diario, con la suite Adobe como columna vertebral del flujo de imagen.","f.tools.experto":"Experto",
      "f.exp.titulo":"Experiencia",
      "f.exp.sub":"<strong>Tres ámbitos, un mismo criterio.</strong> Documentación fotográfica de instalaciones para la <strong>ETSID · UPV</strong> (exterior e interior), catálogo de producto industrial para <strong>Weidner Ibérica y Weidner México</strong> (bodegón técnico con control de reflejos sobre metal y plástico), y <strong>reportaje social</strong> de bodas, bautizos y comuniones. En cada encargo: plan de tomas, control de luz, revelado coherente serie a serie y entrega ordenada lista para publicar o imprimir.",
      "f.exp.upv.titulo":"Escola Tècnica Superior d'Enginyeria","f.exp.upv.texto":"Encargo de imagen para la <strong>ETSID</strong>, centro de la <strong>Universitat Politècnica de València</strong>.",
      "f.exp.etsid.titulo":"Instalaciones ETSID","f.exp.etsid.int":"Interior","f.exp.etsid.ext":"Exterior",
      "f.exp.wiberica.titulo":"Weidner Ibérica","f.exp.wiberica.texto":"Fabricante español de productos plásticos para la industria logística y de automoción, con central en Carlet (Valencia). Encargo de fotografía de producto industrial.",
      "f.exp.wmexico.titulo":"Weidner México","f.exp.wmexico.texto":"Filial mexicana del Grupo Weidner. Fotografía de producto industrial y catálogo técnico para su línea de componentes.",
      "f.exp.lista1":"Trato directo con el centro: escucho el uso que se dará a cada imagen y encuadro en consecuencia.","f.exp.lista2":"Coherencia de serie: mismo lenguaje de color y exposición en todo el encargo.","f.exp.lista3":"Entrega lista para publicar: nombrado, recorte y peso optimizado.",
      "f.exp.casos.titulo":"Casos de proyecto · problema → solución → resultado","f.exp.casos.desc":"Tres encargos reales, contados por lo que resolvieron. Las cifras son métricas propias de cada entrega.","f.exp.casos.problema":"Problema","f.exp.casos.solucion":"Solución","f.exp.casos.resultado":"Resultado",
      "f.exp.caso1.tag":"ETSID · UPV","f.exp.caso1.titulo":"Documentación de instalaciones","f.exp.caso1.problema":"El centro necesitaba un banco de imágenes actualizado para web e informes, sin coherencia visual entre espacios.","f.exp.caso1.solucion":"Plan de tomas interior/exterior, control de luz ambiente y revelado uniforme serie a serie.","f.exp.caso1.resultado":"Banco institucional listo para publicar, con lenguaje de color homogéneo.","f.exp.caso1.stat1":"imágenes finales","f.exp.caso1.stat2":"semana de tiempo","f.exp.caso1.stat3":"coherencia de serie",
      "f.exp.caso2.tag":"Weidner Ibérica y Weidner México","f.exp.caso2.titulo":"Catálogo de producto industrial","f.exp.caso2.problema":"Producto técnico con materiales reflectantes y acabados difíciles, para dos empresas, sin pérdida de detalle.","f.exp.caso2.solucion":"Estudio con control de reflejos, iluminación dirigida y montaje coherente para impresión.","f.exp.caso2.resultado":"Catálogo listo para maquetar, con la misma norma de color para ambas.","f.exp.caso2.stat1":"referencias de producto","f.exp.caso2.stat2":"empresas","f.exp.caso2.stat3":"catálogos entregados",
      "f.exp.caso3.tag":"Reportaje social","f.exp.caso3.titulo":"Bodas, bautizos y comuniones","f.exp.caso3.problema":"Cubrir un día entero sin dirigir y sin perder el gesto verdadero entre protocolo y tiempos cerrados.","f.exp.caso3.solucion":"Cobertura continua, revelado coherente y selección cuidada en forma de serie narrativa.","f.exp.caso3.resultado":"Book cerrado con ritmo propio, listo para imprimir o publicar.","f.exp.caso3.stat1":"cobertura continua","f.exp.caso3.stat2":"imágenes entregadas","f.exp.caso3.stat3":"books de boda",
      "f.exp.weidner.titulo":"Catálogo de producto · Weidner Ibérica y Weidner México","f.exp.weidner.texto":"<strong>Fotografía de producto industrial.</strong> Catálogo técnico para <strong>Weidner Ibérica</strong> y <strong>Weidner México</strong>: fotografía de producto en entorno de estudio y on-site, con control de reflejos sobre metal y plástico, iluminación dirigida para resaltar materiales y acabados, y montaje coherente de la serie listo para maquetación editorial. Un encargo que une la precisión del <strong>bodegón publicitario</strong> con la <strong>documentación técnica de producto</strong>: habilidad y experiencia demostrable en foto de producto en el ámbito industrial.","f.exp.weidner.btn":"Ver catálogo (PDF)",
      "f.exp.weidner.head.titulo":"Weidner Ibérica · Weidner México","f.exp.weidner.head.desc":"Fotografía de producto industrial para Weidner Ibérica y Weidner México: estudio y on-site, control de reflejos sobre metal y plástico e iluminación dirigida, para entregar una serie coherente lista para maquetación editorial.",
      "f.exp.bodas.titulo":"Bodas, bautizos y comuniones","f.exp.bodas.desc":"Reportaje social de encargo, tratado como una serie narrativa de principio a fin. <strong>Antes</strong>: reunión con la familia, plan de tomas y calendario (protocolo, tiempos, rincones y detalles). <strong>Durante</strong>: cobertura continua sin dirigir —la preparación, la ceremonia, el saludo, el convite y el baile—, atento al gesto verdadero y a los objetos que sostienen la historia. <strong>Después</strong>: revelado coherente, selección cuidada, maquetación del álbum y entrega lista para imprimir o publicar. Un book cerrado, con su propio ritmo.",
      "f.comp.titulo":"Competencias",
      "f.comp.b1.titulo":"Fotografía de interior","f.comp.b1.texto":"Luz ambiente controlada, verticales corregidas y espacios que se ven como son.",
      "f.comp.b2.titulo":"Fotografía de arquitectura","f.comp.b2.texto":"Volúmenes, líneas y escala: leer el edificio antes de encuadrarlo.",
      "f.comp.b3.titulo":"Bodegón publicitario","f.comp.b3.texto":"Composición, textura y luz dirigida para dar peso al objeto.",
      "f.comp.b4.titulo":"Reportaje social","f.comp.b4.texto":"Cobertura de eventos: el instante real, contado con criterio y sin ruido.",
      "f.comp.b5.titulo":"Moda","f.comp.b5.texto":"Dirección de imagen, gesto y luz de estudio al servicio de la prenda.",
      "f.ref.titulo":"Referentes","f.ref.sub":"Tres maestros que enseñan a mirar. De ellos heredo el criterio, no la copia.",
      "f.ref.r1.texto":"El blanco y negro como partitura: luz medida, textura y silencio.","f.ref.r2.texto":"El instante decisivo: esperar, encuadrar y no disparar de más.","f.ref.r3.texto":"Retrato, fondo limpio y tensión elegante: la mirada, no el artificio.",
      "fab.sobre.titulo":"Sobre mí",
      "fab.escena.titulo":"Fabricación mecánica: del boceto a la máquina",
      "fab.escena.texto":"Diseño mecánico industrial con más de cinco años de experiencia en <strong>Weidner Ibérica</strong>, en Carlet (Valencia). Me especialicé en el diseño de <strong>torres de apilamiento</strong> (<em>stacking columns</em>) para el sector de la automoción: columnas autoblocantes, cabrestantes y sistemas de retención que se fabrican, se montan y se entregan a los grandes montadores europeos. Trabajo a diario con <strong>CATIA V5</strong>, planimetría y el ERP <strong>Geinprod</strong>, del boceto paramétrico a la lista de piezas y al plano de fabricación sellado. Me formé en el <strong>CP San Jaime Apóstol</strong> de Moncada, en el CFGS de Diseño en Fabricación Mecánica, y cruzo ese oficio con el ojo gráfico del diseñador: se lee un plano, se entiende una secuencia de montaje y se piensa en el operario que lo va a apretar.",
      "fab.obra.titulo":"Obra",
      "fab.obra.sub":"Del diseño asistido por ordenador a la pieza fabricada: <strong>cabrestante</strong>, <strong>matriz de chapa</strong> y <strong>aprovechamiento de chapa</strong>. Tres formas de resolver un problema mecánico —el conjunto completo, la herramienta que lo estampa y el desarrollo de la chapa—, cada una en su sitio y con su plano.",
      "fab.obra.cab.titulo":"Cabrestante · conjunto completo",
      "fab.obra.cab.desc":"Diseño y documentación de un cabrestante manual de tambor: conjunto general, explosionado y lista de piezas, subconjunto soldado, perfiles, chapas laterales, base, mango, tres ejes, cuatro engranajes, tambor, subconjunto de manivela, manivela, maneta y trinquete. Veinte planos que cuentan la pieza entera, del ensamble general al detalle de cada componente.",
      "fab.obra.cab.video.titulo":"Vídeo de ensamble",
      "fab.obra.cab.video.desc":"Recorrido de la secuencia de montaje y desmontaje del cabrestante, tomado del modelo 3D. El tambor gira, los engranajes se engranan y el trinquete bloquea: la animación comprueba lo que el plano dibuja.",
      "fab.obra.cab.stp.titulo":"Modelos 3D interactivos",
      "fab.obra.cab.stp.desc":"Cuatro ensamblajes exportados a STEP. Gíralos, acércalos y léelos en tres dimensiones antes de abrir el plano: el visor carga en el navegador, sin instalar nada.",
      "fab.obra.cab.pdf.titulo":"Planos del cabrestante",
      "fab.obra.cab.pdf.desc":"Veinte planos en PDF con navegación previa/siguiente. Cada plano abre en su página, con su nomenclatura y sus vistas.",
      "fab.obra.matriz.titulo":"Utillaje de chapa · Proyecto 1 · Matriz",
      "fab.obra.matriz.desc":"Proyecto de utillaje de chapa: diseño de la matriz de corte y grabado para una pieza estampada. Desarrollo del troquel, análisis de la secuencia de operación, holguras de ajuste, guías y ejectores. El archivo fuente es un ensamble de <strong>Autodesk Inventor</strong> (.ipt/.iam), sin visor web nativo; aquí se documenta el trabajo con sus datos.",
      "fab.obra.matriz.files.titulo":"Archivos del proyecto",
      "fab.obra.matriz.files.desc":"Ensambles y piezas del proyecto, en formato nativo de Inventor.",
      "fab.obra.chapa.titulo":"Aprovechamiento de chapa",
      "fab.obra.chapa.desc":"Estudio de aprovechamiento de chapa para el corte de piezas planas: disposición de los trozos sobre el rollo, minimización del sobrante y control del sentido de fibra. Trabajo realizado en <strong>AutoCAD</strong> sobre archivos .dwg.",
      "fab.obra.chapa.files.titulo":"Planos .dwg",
      "fab.obra.chapa.files.desc":"Delineado de desarrollo y nesting en AutoCAD.",
      "fab.form.titulo":"Formación",
      "fab.form.item1.titulo":"Diseño en Fabricación Mecánica","fab.form.item1.texto":"El ciclo que me hizo pensador de piezas: dibujo técnico, cálculo de elementos de máquina, tolerancias, geometría y representación, CAD/CAM y organización de la fabricación. La base de todo lo que hay en esta página.","fab.form.item1.centro":"CP San Jaime Apóstol · Moncada (Valencia)",
      "fab.tools.titulo":"Herramientas","fab.tools.sub":"El software de diseño y gestión que manejo a diario en la planta, de la pieza paramétrica al plano de taller y al control de materiales.","fab.tools.experto":"Experto",
      "fab.exp.titulo":"Experiencia",
      "fab.exp.sub":"<strong>Más de cinco años en la planta de Weidner Ibérica</strong>, en Carlet (Valencia), como delineante industrial y diseñador mecánico. Del modelo paramétrico en <strong>CATIA V5</strong> al plano de fabricación sellado, con el ERP <strong>Geinprod</strong> para la gestión de materiales y la lista de piezas. Un oficio de precisión, tolerancias y plazos.",
      "fab.exp.wiberica.titulo":"Weidner Ibérica","fab.exp.wiberica.texto":"Fabricante español de productos plásticos y sistemas de apilamiento para la industria logística y de automoción, con central en Carlet (Valencia). Diseño de torres de apilamiento y documentación técnica de producto.",
      "fab.exp.wmexico.titulo":"Weidner México","fab.exp.wmexico.texto":"Filial mexicana del Grupo Weidner. Trabajo conjunto en la definición de producto y la documentación técnica para el mercado americano.",
      "fab.exp.stp.titulo":"Torre de apilamiento: sistema de levas inteligentes","fab.exp.stp.desc":"Torre de apilamiento para automoción con sistema de levas inteligente. La diseñé íntegramente yo tras un largo proceso de análisis de tensiones, materiales y funcionalidad; construí varios prototipos y las versiones definitivas son los modelos 3D de abajo. Este producto se ha fabricado y vendido comercialmente en la planta de Weidner Ibérica, en Carlet (Valencia).",
      "fab.exp.cadenas.titulo":"Columna de apilamiento con cadenas","fab.exp.cadenas.desc":"Proyecto de I+D propio para la compañía, en la línea de la columna SLA/SLI: columna de apilamiento con sistema de cadenas y palancas ergonómicas integradas en el cuerpo, para que el operario tense o libere la carga sin agacharse. Todo el ensamblaje está modelado y documentado en CATIA V5, con visor 3D completo.",
      "fab.exp.casos.titulo":"Casos de proyecto · problema → solución → resultado","fab.exp.casos.desc":"Tres problemas reales de ingeniería, contados por lo que resolvieron.","fab.exp.casos.problema":"Problema","fab.exp.casos.solucion":"Solución","fab.exp.casos.resultado":"Resultado",
      "fab.exp.caso1.problema":"Las columnas de apilamiento de la competencia exigían que el operario retirase a mano la pieza del rack para liberar el desbloqueo en cada ciclo: riesgo de atrapamiento de dedos, posturas forzadas y segundos perdidos que se acumulaban turno tras turno en la línea de automoción.","fab.exp.caso1.solucion":"Diseño de un mecanismo con palanca de desbloqueo accionada por el propio peso de la pieza al retirarla del rack: al descargarla, el retén se libera solo y la columna queda lista para el siguiente apilamiento sin que el operario toque el mecanismo.","fab.exp.caso1.resultado":"Ciclo más rápido y seguro: cero acciones manuales de desbloqueo, menos riesgo de atrapamiento y una cadencia de montaje más regular para el operario.","fab.exp.caso1.stat4":"ciclo más rápido",
      "fab.exp.caso2.problema":"Para tensar o liberar las cadenas de retención de la columna, el operario tenía que agacharse hasta el suelo en cada ajuste: una postura forzada y repetitiva que cargaba la espalda y acumulaba fatiga a lo largo del turno.","fab.exp.caso2.solucion":"Diseño de unas palancas de mando elevadas, integradas en el bastidor y de recorrido corto, que permiten tensar y liberar las cadenas de pie y con una sola mano, sin necesidad de bajar a la altura del suelo.","fab.exp.caso2.resultado":"Trabajo ergonómico: desaparece la postura forzada de agacharse, se reduce la fatiga acumulada y el ajuste de cadenas pasa a ser una operación cómoda dentro del ciclo de montaje.","fab.exp.caso2.stat4":"menos fatiga por turno",
      "fab.exp.caso3.problema":"Un producto nuevo tenía que pasar del modelo 3D al taller con planos limpios, listas de piezas coherentes, nomenclatura única y tolerancias claras: sin ese paquete cerrado, el taller paraba a preguntar y el montaje se retrasaba.","fab.exp.caso3.solucion":"Modelado paramétrico en CATIA V5, exportación a STEP para el intercambio, plano de conjunto, explosionado con lista de piezas y planos de despiece con tolerancias y tratamientos definidos, todo con una codificación única de referencias.","fab.exp.caso3.resultado":"Paquete de fabricación cerrado: el taller recibe plano, despiece y lista de piezas sin preguntas y puede arrancar la mecanización sin idas y venidas con ingeniería.","fab.exp.caso3.stat4":"años en CATIA V5",
      "fab.exp.weidner.titulo":"Weidner Ibérica · Diseño y documentación",
      "fab.exp.weidner.desc":"Diseño de torres de apilamiento (<em>stacking columns</em>) para el sector de la automoción: columnas autoblocantes, cabrestantes y sistemas de retención. Del modelo paramétrico en CATIA V5 al plano de fabricación sellado, con el ERP Geinprod para la gestión de materiales. Aquí tienes el resultado: modelos 3D navegables y el plano del cabrestante.",
      "fab.exp.listas.titulo":"Presentación de producto",
      "fab.exp.listas.desc":"Presentación de las columnas de apilamiento de Weidner, abierta en la página de producto. Maquetación técnica con secuencia de montaje, códigos de color y fichas de producto.",
      "fab.exp.listas.btn":"Ver presentación (PDF)",
      "fab.exp.flips.titulo":"Catálogo de producto","fab.exp.flips.desc":"Catálogo de producto de Weidner en formato flipbook (Flipsnack), abierto en las páginas de las columnas. Maquetación editorial con fichas técnicas y familias de producto.","fab.exp.flips.btn":"Abrir catálogo",
      "fab.exp.weidner.card.titulo":"Weidner Ibérica",
      "fab.exp.weidner.card.texto":"Fabricante español de sistemas de apilamiento para la industria logística y de automoción, con central en Carlet (Valencia).",
      "fab.exp.wmexico.card.titulo":"Weidner México","fab.exp.wmexico.card.texto":"Filial mexicana del Grupo Weidner, con sede en Querétaro.",
      "fab.api.titulo":"Normas y materiales",
      "fab.api.nav":"Normas y materiales",
      "fab.api.sub":"Dos herramientas de taller calculadas en el navegador: ajustes y tolerancias ISO 286 y una base de datos de materiales de ingeniería. Sin claves, sin servidores.",
      "fab.tol.titulo":"Tolerancias ISO 286",
      "fab.tol.nota":"Tablas oficiales ISO 286-2:2010. Base agujero H. Desviaciones en µm, límites en mm. Ø 3–400 mm.",
      "fab.tol.diam":"Ø nominal (mm)",
      "fab.tol.hueco":"Agujero",
      "fab.tol.eje":"Eje",
      "fab.tol.btn":"Calcular ajuste",
      "fab.mat.titulo":"Materiales de ingeniería",
      "fab.mat.nota":"Propiedades típicas a 20 °C. Valores orientativos: confirma siempre con el certificado del proveedor.",
      "fab.mat.sel":"Material",
      "fab.comp.titulo":"Competencias",
      "fab.comp.b1.titulo":"Diseño 3D paramétrico","fab.comp.b1.texto":"Del sólido al ensamble en CATIA V5: piezas, restricciones y actualización coherente.",
      "fab.comp.b2.titulo":"Dibujo técnico y tolerancias","fab.comp.b2.texto":"Planos de taller claros: vistas, secciones, acotación y tolerancias que se pueden fabricar.",
      "fab.comp.b3.titulo":"Fabricación de chapa","fab.comp.b3.texto":"Troquelado, corte, plegado y estampado: pensar la pieza para que salga bien de la máquina.",
      "fab.comp.b4.titulo":"ERP y gestión de materiales","fab.comp.b4.texto":"Geinprod: listas de piezas, materiales y control de aprovisionamiento.",
      "fab.comp.b5.titulo":"Documentación de producto","fab.comp.b5.texto":"Explosiones, despieces y nomenclatura coherente del modelo a la entrega.",
      "fab.comp.b6.titulo":"Ergonomía y mejora continua","fab.comp.b6.texto":"Diseñar para el operario: posturas seguras, ciclos cortos y menos esfuerzo.",
      "fab.ref.titulo":"Referentes","fab.ref.sub":"Los maestros del oficio industrial: de ellos heredo el método, no la copia.",
      "fab.ref.r1.texto":"El fundador de Toyota: del telar automático a la pieza intercambiable y al método que cambió la fabricación.",
      "fab.ref.r2.texto":"El TPS de Taiichi Ohno: producir solo lo necesario, cuando se necesita, sin sobreproducción.",
      "fab.ref.r3.texto":"La gestión científica: medir, estandarizar y simplificar cada operación para fabricar mejor.",
      "fab.ref.r4.texto":"La estética de la función pura: que la forma siga al uso y nada sobre.",
      "fab.ref.r5.texto":"La cadena de montaje y la pieza intercambiable: el origen de la fabricación en serie.",
      "fab.ref.r6.texto":"La máquina-herramienta moderna: la precisión como base de toda la industria.",
      "fab.planos.anterior":"Anterior",
      "fab.planos.siguiente":"Siguiente",
      "fab.planos.pagina":"Plano",
      "d.sobre.titulo":"Sobre mí",
      "d.escena.titulo":"Diseño gráfico: retícula, color y oficio",
      "d.escena.texto":"Siempre he querido crear: contar historias con imágenes, tipografía y orden. Me formé en Diseño y Producción Editorial (CIPFP Ciudad del Aprendiz) y en Fotografía Artística (EASD), aprendiendo composición y luz. Trabajo con retículas claras, pesos equilibrados y paletas complementarias, buscando un diseño sencillo, elegante y con intención, pensado para que cada pieza se lea y dure.",
      "d.obra.titulo":"Obra",
      "d.obra.sub":"Diseño editorial y gráfico aplicado: <strong>Folletos</strong> (dípticos y trípticos), <strong>Flyers</strong>, <strong>Pósters</strong>, <strong>Identidad corporativa</strong>, <strong>Otros productos</strong> y el proyecto personal de ilustración <strong>Universo encantado</strong>. Cada pieza, en su sitio y con su criterio: retícula, jerarquía tipográfica y color medido, del boceto al arte final listo para imprenta.",
      "d.obra.folletos.titulo":"Folletos · dípticos y trípticos",
      "d.obra.folletos.desc":"Dípticos y trípticos, folletos publicitarios y de producto. Plegados pensados para leerse de un vistazo y sostener la marca en la mano: retícula clara, jerarquía tipográfica y color medido. Preparo cada archivo con sangrados, líneas de corte y plegado para que la imprenta lo reciba sin sorpresas, y defino la secuencia de lectura panel a panel.",
      "d.obra.flyers.titulo":"Flyers",
      "d.obra.flyers.desc":"Piezas de mano rápida y alto impacto: flyers de eventos, promociones y campañas. Composición directa, un mensaje por pieza y una llamada a la acción evidente. Aprovecho una sola cara para contarlo todo —titular, dato útil y contacto— con una imagen que se reconozca de reojo.",
      "d.obra.posters.titulo":"Pósters y cartelería",
      "d.obra.posters.desc":"Cartelería para festivales, deporte universitario y campañas. La imagen leída a distancia: contraste, escala y tipografía que funciona de lejos. Trabajo la jerarquía visual para que el mensaje llegue en dos segundos y la reproduzco en gran formato sin perder nitidez.",
      "d.obra.identidad.titulo":"Identidad corporativa",
      "d.obra.identidad.desc":"Marcas y manuales de identidad: logotipo, versiones, proporciones, colores corporativos, tipografía y aplicaciones (papelería, señalética, rotulación). Un sistema antes que un adorno: dejo las reglas por escrito para que la marca se aplique igual hoy y dentro de cinco años, en papel y en pantalla.",
      "d.obra.otros.titulo":"Otros productos",
      "d.obra.otros.desc":"Displays y tótems para feria, packaging y piezas de gran formato. Diseño preparado para producirse: arte final, medidas reales y control de materiales. Pienso en el montaje, el transporte y el uso final de cada pieza antes de dibujarla.",
      "d.obra.portfolio.titulo":"Portfolio completo",
      "d.obra.portfolio.desc":"Un recorrido por los trabajos más representativos de mi etapa como diseñador gráfico: folletos, flyers, carteles, identidad corporativa y proyectos editoriales. Puedes ojearlo aquí mismo; cada proyecto está resuelto de la idea al archivo final.",
      "d.obra.portfolio.card.titulo":"Portfolio Salvador Llácer",
      "d.obra.portfolio.card.texto":"Selección de piezas de diseño gráfico: editorial, identidad, cartelería y producto, presentadas como un portafolio de proyectos. Un resumen visual de mi manera de trabajar, del concepto a la producción.",
      "d.obra.portfolio.btn":"Ver portfolio (PDF)",
      "d.obra.encantado.titulo":"Universo encantado · ilustración",
      "d.obra.encantado.desc":"Proyecto personal de ilustración y narrativa: un universo propio de personajes y escenas donde el dibujo, el color y la imaginación mandan. Aquí el diseño se vuelve historia: personajes que construyo desde el boceto, escenas con luz propia y una paleta que da unidad a todo el conjunto.",
      "d.obra.h":"Horizontal",
      "d.obra.v":"Vertical",
      "d.form.titulo":"Formación",
      "d.form.item1.titulo":"Fotografía Artística",
      "d.form.item1.texto":"La base de mi ojo: composición, color y luz. Del encuadre fotográfico aprendí a mirar antes de maquetar, y ese criterio se aplica igual a una página que a un cartel. La fotografía me enseñó a decidir qué sobra en cada composición.",
      "d.form.item1.centro":"EASD València · Escola d'Art i Superior de Disseny",
      "d.form.item2.titulo":"Diseño y Producción Editorial",
      "d.form.item2.texto":"El ciclo que me formó como diseñador: el proceso completo del producto editorial —libros, catálogos, folletos—, del concepto y la retícula al arte final y la imprenta. Aprendí a estructurar la información, elegir la tipografía y cerrar el archivo sin errores de producción.",
      "d.form.item2.centro":"CIPFP Ciudad del Aprendiz",
      "d.tools.titulo":"Herramientas",
      "d.tools.sub":"Mi caja de herramientas para el diseño: la suite de Adobe, de la ilustración vectorial a la maquetación y la publicación interactiva. Con ella recorro todo el flujo —imagen, vector, retícula y salida digital o impresa— sin salir del mismo ecosistema.",
      "d.tools.experto":"Experto",
      "d.exp.titulo":"Experiencia",
      "d.exp.sub":"<strong>Dos ámbitos, un mismo criterio.</strong> Comunicación visual del deporte universitario en el <strong>Servei d'Esports de la Universitat de València</strong>, y dirección de la imagen corporativa y la comunicación de producto en <strong>Weidner Ibérica</strong> y <strong>Weidner México</strong>. En cada encargo: concepto, retícula, arte final y entrega lista para imprimir o publicar. Un mismo método: entender el encargo, definir el sistema y entregarlo terminado.",
      "d.exp.sef.titulo":"Servei d'Esports · Universitat de València",
      "d.exp.sef.cabecera":"Cabecera para redes sociales",
      "d.exp.sef.vondom":"Aplicación de marca · VONDOM",
      "d.exp.sef.col1":"Cartelería",
      "d.exp.sef.col2":"Piezas de campaña",
      "d.exp.sef.desc":"Prácticas en el <strong>Servei d'Esports</strong> de la Universitat de València. Diseñé la comunicación visual del servicio: carteles y flyers de competiciones y actividades, una revista interna de deportes y la cabecera de sus redes. También adapté la iconografía de la mascota de la UV a todas las disciplinas deportivas, sobre fondo blanco, para un uso coherente y versátil. Cada pieza partía de una plantilla común para que el propio servicio pudiera reutilizarla en la siguiente campaña.",
      "d.exp.sef.iconos":"Iconos de deporte",
      "d.exp.sef.web":"Web oficial del SEF · UV",
      "d.exp.sef.card.titulo":"Servei d'Esports",
      "d.exp.sef.card.texto":"Prácticas de diseño y comunicación visual en el <strong>Servei d'Esports de la Universitat de València</strong>: cartelería, publicaciones y aplicación de marca.",
      "d.exp.sef.card.enlace":"Web oficial del SEF · UV",
      "d.exp.lista1":"Sistema visual coherente: mismo lenguaje gráfico en papel, redes y señalética.",
      "d.exp.lista2":"Piezas pensadas para reutilizarse: plantillas y elementos comunes entre campañas.",
      "d.exp.lista3":"Entrega lista para producir: arte final, medidas y color bajo control.",
      "d.exp.casos.titulo":"Casos de proyecto · problema → solución → resultado",
      "d.exp.casos.desc":"Tres encargos reales, contados por lo que resolvieron. Las cifras son métricas propias de cada entrega.",
      "d.exp.casos.problema":"Problema","d.exp.casos.solucion":"Solución","d.exp.casos.resultado":"Resultado",
      "d.exp.caso1.tag":"Weidner Ibérica · Weidner México","d.exp.caso1.titulo":"Identidad y comunicación de producto","d.exp.caso1.problema":"Una empresa industrial con sede en España y México, sin un sistema visual común ni un catálogo unificado de producto.","d.exp.caso1.solucion":"Identidad corporativa, plantillas editoriales y catálogos interactivos con una norma de color y tipografía única para ambas marcas.","d.exp.caso1.resultado":"Una imagen coherente y multiplataforma, del papel a la pantalla.","d.exp.caso1.stat1":"catálogos entregados","d.exp.caso1.stat2":"piezas de marca","d.exp.caso1.stat3":"sedes (ES / MX)",
      "d.exp.wiberica.titulo":"Weidner Ibérica","d.exp.wiberica.texto":"Fabricante español de productos plásticos para la industria logística y de automoción, con central en Carlet (Valencia). Encargado de su imagen corporativa y comunicación de producto.",
      "d.exp.wmexico.titulo":"Weidner México","d.exp.wmexico.texto":"Filial mexicana del Grupo Weidner. Identidad visual y comunicación de producto: catálogos, displays y presentaciones.",
      "d.exp.caso2.tag":"Universitat de València · SEF","d.exp.caso2.titulo":"Comunicación deportiva universitaria","d.exp.caso2.problema":"El Servei d'Esports necesitaba una imagen homogénea y reconocible para su calendario de actividades y competiciones.","d.exp.caso2.solucion":"Sistema de carteles y flyers, revista interna y adaptación de la mascota UV a cada disciplina deportiva.","d.exp.caso2.resultado":"Una identidad deportiva única y fácil de aplicar por el propio servicio.","d.exp.caso2.stat1":"disciplinas","d.exp.caso2.stat2":"piezas de campaña","d.exp.caso2.stat3":"temporada completa",
      "d.exp.caso3.tag":"Editorial y producto","d.exp.caso3.titulo":"Folletos, trípticos y catálogos","d.exp.caso3.problema":"Contenido denso —precios, horarios, recetas, producto— que debía seguir siendo legible, atractivo y bien plegado.","d.exp.caso3.solucion":"Retícula editorial, jerarquía tipográfica y arte final preparado para imprenta, con control de plegados y sangrados.","d.exp.caso3.resultado":"Folletos y trípticos listos para producir, con acabado profesional.","d.exp.caso3.stat1":"plegados distintos","d.exp.caso3.stat2":"páginas maquetadas","d.exp.caso3.stat3":"tintas de impresión",
      "d.exp.weidner.titulo":"Weidner Ibérica · Weidner México · Cmplastik",
      "d.exp.weidner.desc":"Como encargado de la imagen corporativa de Weidner Ibérica y Weidner México, desarrollé la identidad visual de la empresa y su comunicación de producto: catálogos impresos e interactivos, displays y tótems para ferias de automoción, tarjetas de visita y firmas de correo. Aquí tienes el resultado: catálogos navegables y presentaciones de producto.",
      "d.exp.wid.inter.titulo":"Catálogo interactivo · Weidner Ibérica","d.exp.wid.inter.texto":"Catálogo publicado con <strong>Adobe Publish Online</strong>: navegable, con interactividad y enlaces internos. La versión digital del catálogo de producto, pensada para consultarse desde cualquier dispositivo.","d.exp.wid.inter.btn":"Abrir catálogo interactivo",
      "d.exp.wid.prod.titulo":"Catálogo de producto · Weidner México","d.exp.wid.prod.texto":"Catálogo de producto en formato <strong>flipbook</strong> (Flipsnack). Maquetación editorial del catálogo completo: fichas técnicas, familias de producto y una navegación pensada para venta.","d.exp.wid.prod.btn":"Abrir catálogo de producto",
      "d.exp.wid.verdes.titulo":"Las Soluciones Verdes · Weidner Ibérica y Cmplastik","d.exp.wid.verdes.texto":"Presentación de producto sostenible en formato <strong>flipbook</strong> (Flipsnack): economía circular, materiales reciclados y soluciones verdes para el sector. Diseño al servicio de un mensaje medioambiental.","d.exp.wid.verdes.btn":"Abrir presentación",
      "d.exp.wid.logic.titulo":"Presentación LogicPalet","d.exp.wid.logic.texto":"Presentación de producto del <strong>palé modular LogicPalet</strong>, premiado como mejor invención española. Maquetación técnica bilingüe: características, ventajas logísticas, montaje en tres pasos y fichas de producto.","d.exp.wid.logic.btn":"Ver presentación (PDF)",
      "d.exp.wid.dulce.titulo":"Presentación Dulce de Leche","d.exp.wid.dulce.texto":"Presentación de <strong>soluciones sostenibles para el sector alimentario</strong> (bandejas, pelotas de pádel y tenis, cepillos). Maquetación editorial que traduce un mensaje de economía circular —reciclar, reutilizar, recuperar— en piezas claras y visuales.","d.exp.wid.dulce.btn":"Ver presentación (PDF)",
      "d.exp.wid.capr.titulo":"Presentación CAPR · columna autoblocante",      "d.exp.wid.capr.texto":"Presentación del sistema <strong>CAPR</strong> (columna autoblocante de paso reducido): innovación para el sector de automoción. Las <strong>fotografías</strong>, la <strong>maquetación</strong> y el <strong>diseño de la presentación</strong> están realizados por mí. Secuencia de montaje, códigos de color (último gatillo en rojo = carga completa) y fichas de producto.","d.exp.wid.capr.btn":"Ver presentación (PDF)",
      "d.comp.titulo":"Competencias",
      "d.comp.b1.titulo":"Diseño editorial","d.comp.b1.texto":"Retículas, folletos y catálogos: ordenar mucha información sin ruido. Jerarquía, ritmo y aire para que el lector encuentre lo importante sin esfuerzo.",
      "d.comp.b2.titulo":"Identidad corporativa","d.comp.b2.texto":"Marcas y manuales: un sistema que se aplica igual en papel y en pantalla. Del logotipo a la señalética, todo bajo las mismas reglas.",
      "d.comp.b3.titulo":"Ilustración y dibujo","d.comp.b3.texto":"Del boceto al arte final: crear la imagen cuando no existe. Dibujo, ilustración y personajes con coherencia de línea y color.",
      "d.comp.b4.titulo":"Tipografía y color","d.comp.b4.texto":"Jerarquía, contraste y paletas complementarias con criterio. La tipografía como voz y el color como estructura.",
      "d.comp.b5.titulo":"Arte final y preprensa","d.comp.b5.texto":"Pit stop para imprenta: sangrados, perfiles y control de color. Archivos que se imprimen bien a la primera.",
      "d.comp.b6.titulo":"Gran formato y displays","d.comp.b6.texto":"Carteles, tótems y piezas de feria pensadas para producirse. Medidas reales, materiales y resistencia al uso.",
      "d.ref.titulo":"Referentes","d.ref.sub":"De la geometría de Mondrian a la memoria visual de Kim Jung Gi: maestros de los que heredo el criterio, no la copia. En todos ellos busco lo mismo: una idea clara y una forma honesta de contarla.",
      "d.ref.r1.texto":"La retícula como lenguaje: orden, equilibrio y color puro en el espacio.",
      "d.ref.r2.texto":"Forma y función unidas: la escuela que enseñó a diseñar con método, del taller a la retícula.",
      "d.ref.r3.texto":"Dibujar de memoria, sin boceto: perspectiva y confianza en el trazo.",
      "d.ref.r4.texto":"La tipografía como sistema: claridad, disciplina y coherencia total.",
      "d.ref.r5.texto":"Una idea, una imagen: el poder de la síntesis gráfica.",
      "d.ref.r6.texto":"El cartel como arma y arte: fotomontaje, compromiso y oficio valenciano.",
      "pie.secciones":"Secciones",
      "bn.video.etq":"03 — VÍDEO Y MÚSICA","bn.video.tit":"Ritmo, sonido y color","bn.video.desc":"Edición, montaje y música propia: de los reels de MissR a la serie documental ECO. Entra y escucha.","bn.video.cta":"VER PORTFOLIO","bn.video.son":"Sonido",
      "repro.lista":"Música propia","repro.rrr":"Banda sonora MissR","repro.eco":"Banda sonora ECO","repro.arte":"Música ARTE",
      "v.sobre.titulo":"Sobre mí",
      "v.escena.titulo":"Vídeo y música: ritmo, sonido y color",
      "v.escena.texto":"De pequeño tocaba la bandurria en una rondalla y allí aprendí el placer de crear algo entre varios. En el CEIP Cavite —Isla de Hierro— curse mi primera formación optativa en medios audiovisuales, donde aprendí tipos de planos, lenguaje visual y encuadre. Desde entonces cine y música van juntos: colaboré con la productora La Canya Produccions —ganadora en dos ediciones de Cinema Jove— y, como socio y colaborador de Interpreta Natura, edito reels, cortometrajes y vídeos, compongo la música de esos trabajos y locuto algunos de ellos.",
      "v.obra.titulo":"Obra","v.obra.sub":"Dos oficios que se cruzan en el mismo montaje: <strong>Vídeo</strong> —guion, grabación, edición y postproducción— y <strong>Música</strong> —composición propia con GarageBand—. Una misma idea en dos formatos: ritmo, sonido y color.",
      "v.obra.video.titulo":"Vídeo","v.obra.video.desc":"Montaje y postproducción para Interpreta Natura: reels, cortometrajes y vídeos promocionales. Edito, doy color y cuido el sonido; la música de muchas de esas piezas también es mía.","v.obra.video.dest":"<strong>Ruta teatralitzada «Que el temps no esborre la memòria».</strong> Pieza promocional de una ruta escénica sobre la memoria de la guerra: grabación, edición y música propios, con la asociación Interpreta Natura.",
      "v.obra.rrr.titulo":"Las tres erres","v.obra.rrr.desc":"Siete piezas verticales sobre los tres erres: <strong>Reducir</strong>, <strong>Reparar</strong> y <strong>Reutilizar</strong>. Guion, grabación y edición propias, con música compuesta para cada pieza.","v.obra.rrr4.desc":"<strong>MissR i els 4 magnífics.</strong> Pieza de la campaña en la que <strong>compuse la música</strong> y colaboré en la <strong>grabación y la edición</strong> del vídeo.",
      "v.obra.musica.titulo":"Música","v.obra.musica.desc":"Mis piezas personales, compuestas y producidas en <strong>GarageBand</strong>: piezas para imaginar, trabajar y respirar. Púsalas mientras sigues mirando la web.",
      "v.form.titulo":"Formación","v.form.item1.grado":"Optativa","v.form.item1.titulo":"Medios audiovisuales","v.form.item1.texto":"Mi primera formación en el lenguaje del cine: tipos de planos, encuadre, narrativa y estructura guionizada. Allí mismo tocaba la bandurria en la rondalla del centro, donde aprendí a cooperar para conseguir algo común.","v.form.item1.centro":"CEIP Cavite · Isla de Hierro",
      "v.form.item2.titulo":"Fotografía Artística","v.form.item2.texto":"El módulo de medios audiovisuales reforzó lo aprendido en secundaria: encuadre, ritmo y montaje aplicados a un reportaje real. La base técnica para que una imagen se sostenga y un corte tenga sentido.","v.form.item2.centro":"EASD València · Escola d'Art i Superior de Disseny",
      "v.tools.titulo":"Herramientas","v.tools.sub":"Mi cadena de montaje: corte y color en Premiere, acabados en After Effects, sonido y mezcla en Audition, y las apps de Apple cuando el flujo es rápido y directo.","v.tools.experto":"Experto","v.tools.avanzado":"Avanzado","v.tools.intermedio":"Intermedio",
      "v.exp.titulo":"Experiencia","v.exp.sub":"<strong>Un solo ámbito, varios proyectos.</strong> Colaboro con el departamento audiovisual de <strong>Interpreta Natura</strong>: grabación, edición y sonido de reels, cortometrajes y podcasts, música compuesta para cada pieza y locución de algunas de ellas. Aquí están los proyectos en los que me impliqué de principio a fin.",
      "v.exp.in.titulo":"Interpreta Natura","v.exp.in.texto":"Asociación sin ánimo de lucro dedicada a la interpretación del medio natural y cultural de la Comunitat Valenciana. Con ella colaboro en <strong>grabación y edición de vídeo</strong>, reels y podcast, <strong>música original</strong> para sus piezas, locuciones y diseño gráfico.",
      "v.exp.missr.titulo":"MissR · reduce, repara, reutiliza","v.exp.missr.desc":"Campaña audiovisual sobre los tres erres. Edité las piezas para redes, participé en la grabación y compuse la banda sonora de cada una. La banda sonora, en formato de audio, está debajo.",
      "v.exp.eco.titulo":"ECO · La història d'ECO","v.exp.eco.desc":"Serie documental en valenciano: prólogo y ocho capítulos sobre el territorio, la gente y la tierra. Montaje de las nueve entregas y música propia para la serie.",
      "v.exp.arte.titulo":"ARTE","v.exp.arte.desc":"Nueve episodios del proyecto ARTE. La <strong>música es mía</strong>; la <strong>narración y las ilustraciones</strong> son de Esther Torres.",
      "v.exp.ods.titulo":"ODS · Objetivos de Desarrollo Sostenible","v.exp.ods.desc":"Serie de shorts en valenciano sobre los Objetivos de Desarrollo Sostenible. Edición de las piezas y música original para cada una.",
      "v.exp.reviu.titulo":"Reviu lo Rural","v.exp.reviu.desc":"Proyecto audiovisual para revivir el mundo rural: cinco piezas sobre el territorio, la gente y la casa. Edición y música propias.",
      "v.exp.otros.titulo":"Otros proyectos con Interpreta Natura","v.exp.otros.desc":"Música propia para los proyectos de Interpreta Natura.","v.exp.otros.musica":"música propia",
      "v.exp.casos.titulo":"Casos de proyecto · problema → solución → resultado","v.exp.casos.desc":"Tres encargos reales, contados por lo que resolvieron. Las cifras son métricas propias de cada entrega.","v.exp.casos.problema":"Problema","v.exp.casos.solucion":"Solución","v.exp.casos.resultado":"Resultado",
      "v.exp.caso1.tag":"Interpreta Natura","v.exp.caso1.titulo":"Ruta teatralitzada «Que el temps no esborre la memòria»","v.exp.caso1.problema":"La asociación necesitaba una pieza promocional para una ruta escénica sobre la memoria de la guerra, sin equipo audiovisual propio.","v.exp.caso1.solucion":"Grabación, edición y banda sonora original; locución y montaje con material de archivo y sonido directo.","v.exp.caso1.resultado":"Pieza promocional lista para redes que dio visibilidad a la ruta.","v.exp.caso1.stat1":"pieza entregada","v.exp.caso1.stat2":"música propia","v.exp.caso1.stat3":"días de grabación",
      "v.exp.caso2.tag":"Campaña audiovisual","v.exp.caso2.titulo":"MissR · reduce, repara, reutiliza","v.exp.caso2.problema":"Sensibilizar sobre las tres erres con piezas cortas para redes sociales, partiendo de cero y sin identidad sonora.","v.exp.caso2.solucion":"Guion, grabación y edición de seis reels, con banda sonora original compuesta para cada pieza.","v.exp.caso2.resultado":"Campaña completa lista para publicar, con identidad sonora propia.","v.exp.caso2.stat1":"reels entregados","v.exp.caso2.stat2":"bandas sonoras","v.exp.caso2.stat3":"música propia",
      "v.exp.caso3.tag":"Serie documental","v.exp.caso3.titulo":"ECO · La història d'ECO","v.exp.caso3.problema":"Serie audiovisual en valenciano que necesitaba estructura narrativa y unidad sonora para prólogo y ocho capítulos.","v.exp.caso3.solucion":"Montaje de prólogo y ocho episodios, con música compuesta para acompañar el ritmo de cada capítulo.","v.exp.caso3.resultado":"Serie documental completa, coherente en ritmo, color y sonido.","v.exp.caso3.stat1":"episodios","v.exp.caso3.stat2":"serie completa","v.exp.caso3.stat3":"música propia",
      "v.comp.titulo":"Competencias",
      "v.comp.b1.titulo":"Edición y montaje","v.comp.b1.texto":"Ritmo, corte y estructura: que una pieza tenga principio, medio y final sin perder al espectador.",
      "v.comp.b2.titulo":"Color y postproducción","v.comp.b2.texto":"Corrección de color, limpieza de imagen y acabados que unifican material de origen distinto.",
      "v.comp.b3.titulo":"Sonido y mezcla","v.comp.b3.texto":"Voz, ambiente y música en su sitio: diálogo limpio y mezcla equilibrada para cualquier pantalla.",
      "v.comp.b4.titulo":"Composición musical","v.comp.b4.texto":"Banda sonora propia con GarageBand: piezas compuestas para encajar con la imagen, no para competir con ella.",
      "v.comp.b5.titulo":"Locución y guion","v.comp.b5.texto":"Escribir qué se cuenta y decirlo bien: guion, locución y narración de las piezas en las que participo.",
      "v.ref.titulo":"Referentes","v.ref.sub":"Ocho nombres que explican de dónde viene mi manera de montar y de componer. De ellos heredo el criterio, no la copia.","v.ref.cine":"Referentes cinematográficos","v.ref.music":"Referentes musicales",
      "v.ref.r1.texto":"El suspense como montaje: saber qué va a pasar y hacerlo esperar.","v.ref.r2.texto":"Claridad narrativa: la historia por delante del efecto.","v.ref.r3.texto":"Cámara en mano y energía: el plano como golpe de ritmo.","v.ref.r4.texto":"Montaje al servicio de la música: cortar siguiendo el compás.",
      "v.ref.r5.texto":"Minimalismo melódico: repetir hasta que la idea respire.","v.ref.r6.texto":"Arquitectura sonora: el patrón como estructura de la pieza.","v.ref.r7.texto":"Piano que acompaña imagen: emoción sin gritar.","v.ref.r8.texto":"Motivo que vuelve: la melodía como hilo de la narración.",
      "v.lastfm.titulo":"Lo que escucho","v.lastfm.sub":"Mi música se escucha en la sección de música; aquí, lo que está sonando en mis cascos gracias a la API de Last.fm.","v.lastfm.tit":"Artistas que más escucho","v.lastfm.nota":"Datos en vivo de mi perfil de Last.fm.","v.lastfm.btn":"Escuchar mi música","v.lastfm.carga":"Cargando artistas…","v.lastfm.fuente":"Datos de la API pública de","v.lastfm.vacio":"Configura LASTFM_KEY y LASTFM_USER en script.js para ver mis artistas de Last.fm.","v.lastfm.sin_datos":"Mi perfil de Last.fm aún no tiene artistas registrados. ¡Escucha música y vuelve!"
    },
    en:{ "m.inicio":"Home","m.foto":"Photo","m.diseno":"Design","m.video":"Video & music","m.musica":"Music","m.dam":"DAM","m.mec":"Machining","m.contacto":"Contact",
      "sec.sobre":"About me","sec.obra":"Work","sec.form":"Education","sec.tools":"Tools","sec.exp":"Experience","h1.foto":"Photography — Salvador Llácer Ivars","h1.diseno":"Graphic design — Salvador Llácer Ivars","h1.video":"Video & music — Salvador Llácer Ivars","h1.fab":"Mechanical manufacturing — Salvador Llácer Ivars","sec.comp":"Skills","sec.ref":"References","sec.lastfm":"What I listen to","sec.inspo":"Living inspiration","sec.lab":"Typography &amp; motion",
      "sub.paisaje":"Landscape","sub.robados":"Candid","sub.personal":"Personal vision","sub.bodegon":"Still life","sub.moda":"Fashion","sub.retrato":"Portrait","sub.etsid":"ETSID · UPV","sub.casos":"Project cases","sub.bodas":"Weddings & events",
      "sub.posters":"Posters","sub.folletos":"Brochures","sub.flyers":"Flyers","sub.identidad":"Identity","sub.otros":"Other products","sub.portfolio":"Portfolio","sub.encantado":"Enchanted universe","sub.sef":"SEF · UV Sport","sub.weidner":"Weidner",
      "sub.video":"Video","sub.musica":"Music","sub.interpreta":"Interpreta Natura","sub.missr":"MissR · 3R","sub.eco":"ECO","sub.arte":"ARTE","sub.ods":"SDGs","sub.reviu":"Reviu lo Rural","sub.otrosvideos":"Other projects",
      "view.toGrid":"Mosaic","view.toStd":"Carousel",
      "eyebrow":"Design + Development · Technical-creative profile","hub.nombre":"Salvador Llácer Ivars","hub.frase":"Six disciplines, one way of working: think like a designer, build like a developer. Choose where to enter.",
      "hub.lema":"Design · Image · Development",
      "bn.piensa":"Think","bn.piensa.pop":"Every piece starts with a question: I research, sketch and give structure to the idea before touching the tool.",
      "bn.disena":"Design","bn.disena.pop":"Typography, colour and composition at the service of the message: something must look right before it is read.",
      "bn.desarrolla":"Build","bn.desarrolla.pop":"From sketch to browser with pure HTML, CSS and JavaScript: fast, accessible and with no frameworks in between.",
      "bn.instr":"Click and drag to the left","bn.instr.sub":"or navigate with the arrows ← →",
      "bn.ver":"VIEW PORTFOLIO","bn.rec":"REC · 01 — PHOTOGRAPHY",
      "carga.titulo":"PORTFOLIO","carga.bienvenida":"Welcome","carga.entrar":"ENTER","carga.tema.foto":"Photography","carga.tema.diseno":"Design","carga.tema.video":"Video &amp; music","carga.tema.fab":"Mechanical manufacturing",
      "bn.diseno.etq":"02 — GRAPHIC DESIGN","bn.diseno.tit":"Ideas you can see","bn.diseno.desc":"Flyers, branding, editorial and iconography. Click the mosaic to discover the portfolio.",
      "bn.fab.etq":"04 — MECHANICAL MANUFACTURING","bn.fab.tit":"<span>If you can <i>imagine it</i></span><span>you can <i>build it</i></span>","bn.fab.desc":"Automotive stacking columns in CATIA V5, drawings and 3D models. From parametric sketch to sealed part.","bn.fab.cta":"VIEW PORTFOLIO","bn.fab.hint":"Mouse wheel: scroll up to reveal",
      "bot.titulo":"PORTFOLIO Assistant","bot.sub":"Ask me about my skills or where to see them","bot.ph":"Type your question…","bot.enviar":"Send",
      "bot.q1":"Do you use Photoshop?","bot.q2":"See photography","bot.q3":"See design","bot.q4":"Who is Salvador?","bot.q5":"How can I contact you?",
      "consejo.titulo":"A daily piece of advice","consejo.otro":"Another one","consejo.carga":"Loading advice…","consejo.fuente":"Advice Slip API","consejo.error":"Could not load the advice. Try again.",
      "f.inspo.titulo":"Live inspiration","f.inspo.sub":"A random window into Unsplash via Picsum: landscape, portrait and still life to keep looking.","f.inspo.c1":"Landscape","f.inspo.c2":"Portrait","f.inspo.c3":"Still life","f.inspo.c4":"Architecture","f.inspo.c5":"Black and white","f.inspo.carga":"Loading images…","f.inspo.error":"Could not load the images. Try again.","f.inspo.credito":"Photos from the","f.inspo.otra":"Another batch",
      "d.lab.titulo":"Typography &amp; motion","d.lab.sub":"Live specimens from Google Fonts and animated iconography with Lordicon: two free libraries I use in prototypes.","d.lab.fuentes":"Typefaces","d.lab.texto":"Sample text","d.lab.fuente":"Fonts served by the public API of","d.lab.iconos":"Animated icons","d.lab.iconos.nota":"Lottie animations by","d.lab.iconos.plan":"(free plan)","cargando":"Loading…",
      "sobre.p1":"I am <strong>Salvador Llácer Ivars</strong>, born in Valencia. Higher Technician in Image and Graphic Arts, in Editorial Design and Production, in Mechanical Manufacturing Design and, currently, in Multiplatform Application Development. Drawing, music and the idea of creating my own stories have driven me since I was a child; that curiosity has led me to always study something new and to cross disciplines that usually stay apart.",
      "sobre.p2":"My path unites image and design: artistic photography trained at the <strong>EASD de València</strong> (landscape, architecture, reportage, fashion, still life and portrait), interior photography commissions for the <strong>ETSID at the UPV</strong> and wedding photography; graphic and editorial design learned at the <strong>CIPFP Ciudad del Aprendizaje</strong> and applied at <strong>Weidner Ibérica</strong>, where I ran the company's image: catalogues —also interactive—, displays and totems for automotive fairs, identity and email signatures.",
      "sobre.p3":"On the technical side I spent over five years at Weidner Ibérica designing <em>stacking columns</em> for the automotive sector with <strong>CATIA V5</strong> and drafting, plus administrative tasks with the <strong>Geinprod</strong> ERP. Today I study the <strong>DAM</strong> higher degree, where I program, work with databases, Figma and artificial intelligence. Music production with <strong>GarageBand</strong> —soundtracks and podcasts for Interpreta Natura—, illustration and drawing complete the picture.",
      "sobre.p4":"I go for minimalism with geometric correctness and balanced visual weights: complementary palettes, meticulous order and simple yet professional results. I am looking for job stability without giving up the ambition to improve, and to bring all my skills to every project so a complete, <strong>multidisciplinary</strong> profile is evident.",
      "pie.volver":"← Back to home",
      "sel.foto":"Photography","sel.foto.sub":"Light, framing and narrative","sel.diseno":"Graphic design & illustration","sel.diseno.sub":"Grid, ink and line","sel.video":"Video editing","sel.video.sub":"Rhythm, sound and colour","sel.musica":"Music","sel.musica.sub":"Composition and sound editing","sel.dam":"DAM & video games","sel.dam.sub":"Code, apps and Simon Says","sel.fab":"Mechanical manufacturing","sel.fab.sub":"CATIA, blueprints and ERP",
      "pie.eyebrow":"Have a project?","pie.nota":"Open to new opportunities. Design, development and administration in one person.","pie.loc":"Location","clima.ubicacion":"Location",
      "modal.eyebrow":"Let's talk","modal.titulo":"Tell me about your project","form.nombre":"Name","form.email":"Email","form.mensaje":"Message","form.enviar":"Send message","form.exito":"✓ Message sent. Thank you for reaching out; I'll get back to you very soon.","toast.soon":"Sub-web under construction",
      "f.sobre.titulo":"About me",
      "f.escena.titulo":"Photography: gaze, light and craft",
      "f.escena.texto":"I was born in Valencia and learned to look before I learned to write. At the EASD in València I studied Artistic Photography —landscape, architecture, interior design, social reportage, fashion and advertising still life— and learned to shape light rather than suffer it. My judgement draws on Ansel Adams, Henri Cartier-Bresson and Richard Avedon: measure, instant and gesture. I have signed image commissions for the ETSID at the UPV and wedding reportages; in every series I look for an honest, coherent and well-developed photograph, without artifice.",
      "f.obra.titulo":"Work",
      "f.obra.sub":"What I learned at the EASD, applied: <strong>Landscape</strong>, <strong>Candid</strong>, <strong>Personal vision</strong>, <strong>Advertising still life</strong>, <strong>Fashion</strong> and <strong>Portrait</strong>. Six ways of looking —the still light of the landscape, the stolen street moment, the personal gaze, the well-lit object, the gesture of the garment and the face without artifice—, each in its place.",
      "f.obra.paisaje.titulo":"Landscape","f.obra.paisaje.desc":"From meadow to city: still light, atmosphere and measured framing. Landscape as an exercise in patience, where the land reveals its character.",
      "f.obra.robados.titulo":"Candid","f.obra.robados.desc":"Social reportage in the wake of Cartier-Bresson: the decisive moment. No one is posed; the true gesture is surprised before it composes itself for the camera.",
      "f.obra.personal.titulo":"Personal vision","f.obra.personal.desc":"An introspective gaze that questions the established and embraces a generalist view of the world. Here photography does not document an external reality: it composes, doubts and relates, using the frame as a way of thinking.",
      "f.obra.bodegon.titulo":"Advertising still life","f.obra.bodegon.desc":"Composition, texture and directed light to give weight to the object. The product as protagonist: control of the reflection, the background and the point of light that makes it desirable.",
      "f.obra.moda.titulo":"Fashion","f.obra.moda.desc":"Image direction, gesture and light at the service of the garment. The body in motion as a compositional line: air, rhythm and a story told with the frame.",
      "f.obra.retrato.titulo":"Portrait","f.obra.retrato.desc":"Clean background, elegant tension and the gaze ahead of artifice: seeking the person, not the pose. Portrait as an encounter, measured in light and silence.",
      "f.form.titulo":"Education",
      "f.form.item1.titulo":"Artistic Photography","f.form.item1.texto":"Higher Technician in Image: landscape, architecture, interior design, social reportage, fashion and advertising still life. The technical foundation of everything on this page.","f.form.item1.centro":"EASD València · Escola d'Art i Superior de Disseny",
      "f.form.item2.titulo":"Editorial Design & Production","f.form.item2.texto":"Colour, prepress and layout. The origin of my eye for framing, tone and the well-finished detail.","f.form.item2.centro":"CIPFP Ciudad del Aprendiz",
      "f.tools.titulo":"Tools","f.tools.sub":"Software I use daily, with the Adobe suite as the backbone of the image workflow.","f.tools.experto":"Expert",
      "f.exp.titulo":"Experience",
      "f.exp.sub":"<strong>Three fields, one same criterion.</strong> Photographic documentation of facilities for the <strong>ETSID · UPV</strong> (interior and exterior), industrial product catalogue for <strong>Weidner Ibérica and Weidner México</strong> (technical still life with reflection control on metal and plastic), and <strong>social reportage</strong> of weddings, baptisms and communions. In every commission: shot plan, light control, coherent development series after series and an ordered delivery ready to publish or print.",
      "f.exp.upv.titulo":"Escola Tècnica Superior d'Enginyeria","f.exp.upv.texto":"Image commission for the <strong>ETSID</strong>, a centre of the <strong>Universitat Politècnica de València</strong>.",
      "f.exp.etsid.titulo":"ETSID facilities","f.exp.etsid.int":"Interior","f.exp.etsid.ext":"Exterior",
      "f.exp.wiberica.titulo":"Weidner Ibérica","f.exp.wiberica.texto":"Spanish manufacturer of plastic products for the logistics and automotive industry, based in Carlet (Valencia). Industrial product photography commission.",
      "f.exp.wmexico.titulo":"Weidner México","f.exp.wmexico.texto":"Mexican subsidiary of the Weidner Group. Industrial product photography and technical catalogue for its components line.",
      "f.exp.lista1":"Direct handling with the centre: I listen to the use each image will have and frame accordingly.","f.exp.lista2":"Series coherence: same colour and exposure language throughout the commission.","f.exp.lista3":"Ready-to-publish delivery: naming, cropping and optimised weight.",
      "f.exp.casos.titulo":"Project cases · problem → solution → result","f.exp.casos.desc":"Three real commissions, told by what they solved. The figures are my own metrics for each delivery.","f.exp.casos.problema":"Problem","f.exp.casos.solucion":"Solution","f.exp.casos.resultado":"Result",
      "f.exp.caso1.tag":"ETSID · UPV","f.exp.caso1.titulo":"Facility documentation","f.exp.caso1.problema":"The centre needed an updated image bank for web and reports, with no visual coherence between spaces.","f.exp.caso1.solucion":"Interior/exterior shot plan, ambient light control and uniform development series after series.","f.exp.caso1.resultado":"Institutional bank ready to publish, with a homogeneous colour language.","f.exp.caso1.stat1":"final images","f.exp.caso1.stat2":"week of work","f.exp.caso1.stat3":"series coherence",
      "f.exp.caso2.tag":"Weidner Ibérica and Weidner México","f.exp.caso2.titulo":"Industrial product catalogue","f.exp.caso2.problema":"Technical product with reflective materials and difficult finishes, for two companies, without loss of detail.","f.exp.caso2.solucion":"Studio with reflection control, directed lighting and coherent assembly for print.","f.exp.caso2.resultado":"Catalogue ready to lay out, with the same colour standard for both.","f.exp.caso2.stat1":"product references","f.exp.caso2.stat2":"companies","f.exp.caso2.stat3":"catalogues delivered",
      "f.exp.caso3.tag":"Social reportage","f.exp.caso3.titulo":"Weddings, baptisms and communions","f.exp.caso3.problema":"Covering a whole day without directing and without losing the true gesture amid protocol and tight timings.","f.exp.caso3.solucion":"Continuous coverage, coherent development and careful selection in the form of a narrative series.","f.exp.caso3.resultado":"Closed book with its own rhythm, ready to print or publish.","f.exp.caso3.stat1":"continuous coverage","f.exp.caso3.stat2":"images delivered","f.exp.caso3.stat3":"wedding books",
      "f.exp.weidner.titulo":"Product catalogue · Weidner Ibérica and Weidner México","f.exp.weidner.texto":"<strong>Industrial product photography.</strong> Technical catalogue for <strong>Weidner Ibérica</strong> and <strong>Weidner México</strong>: product photography in studio and on-site environments, with reflection control on metal and plastic, directed lighting to highlight materials and finishes, and a coherent series assembly ready for editorial layout. A commission that joins the precision of <strong>advertising still life</strong> with <strong>technical product documentation</strong>: demonstrable skill and experience in product photography in the industrial field.","f.exp.weidner.btn":"View catalogue (PDF)",
      "f.exp.weidner.head.titulo":"Weidner Ibérica · Weidner México","f.exp.weidner.head.desc":"Industrial product photography for Weidner Ibérica and Weidner México: studio and on-site, reflection control on metal and plastic and directed lighting, to deliver a coherent series ready for editorial layout.",
      "f.exp.bodas.titulo":"Weddings, baptisms and communions","f.exp.bodas.desc":"Commissioned social reportage, treated as a narrative series from start to finish. <strong>Before</strong>: meeting with the family, shot plan and schedule (protocol, timings, corners and details). <strong>During</strong>: continuous coverage without directing —the preparation, the ceremony, the greeting, the reception and the dance—, attentive to the true gesture and the objects that hold the story. <strong>After</strong>: coherent development, careful selection, album layout and delivery ready to print or publish. A closed book, with its own rhythm.",
      "f.comp.titulo":"Skills",
      "f.comp.b1.titulo":"Interior photography","f.comp.b1.texto":"Controlled ambient light, corrected verticals and spaces that look as they are.",
      "f.comp.b2.titulo":"Architecture photography","f.comp.b2.texto":"Volumes, lines and scale: reading the building before framing it.",
      "f.comp.b3.titulo":"Advertising still life","f.comp.b3.texto":"Composition, texture and directed light to give weight to the object.",
      "f.comp.b4.titulo":"Social reportage","f.comp.b4.texto":"Event coverage: the real instant, told with judgement and without noise.",
      "f.comp.b5.titulo":"Fashion","f.comp.b5.texto":"Image direction, gesture and studio light at the service of the garment.",
      "f.ref.titulo":"References","f.ref.sub":"Three masters who teach how to look. From them I inherit the criterion, not the copy.",
      "f.ref.r1.texto":"Black and white as a score: measured light, texture and silence.","f.ref.r2.texto":"The decisive moment: wait, frame and don't over-shoot.","f.ref.r3.texto":"Portrait, clean background and elegant tension: the gaze, not the artifice.",
      "d.sobre.titulo":"About me",
      "d.escena.titulo":"Graphic design: grid, colour and craft",
      "d.escena.texto":"I love telling stories with images, typography and order. Trained in Editorial Design & Production (CIPFP Ciudad del Aprendiz) and Artistic Photography (EASD), I work with clear grids, balanced weights and complementary palettes to create designs that are simple, elegant and purposeful — designed to last.",
      "d.obra.titulo":"Work",
      "d.obra.sub":"Applied editorial and graphic design: <strong>Brochures</strong> (bifolds and trifolds), <strong>Flyers</strong>, <strong>Posters</strong>, <strong>Corporate identity</strong>, <strong>Other products</strong> and the personal illustration project <strong>Enchanted universe</strong>. Every piece, in its place and with its criterion: grid, typographic hierarchy and measured colour, from sketch to print-ready final art.",
      "d.obra.folletos.titulo":"Brochures · bifolds and trifolds",
      "d.obra.folletos.desc":"Bifolds and trifolds, advertising and product brochures. Folds designed to be read at a glance and to carry the brand in the hand: clear grid, typographic hierarchy and measured colour. I prepare every file with bleeds, cut and fold marks so the printer receives it without surprises, and I define the reading sequence panel by panel.",
      "d.obra.flyers.titulo":"Flyers",
      "d.obra.flyers.desc":"Fast, high-impact handheld pieces: event, promotion and campaign flyers. Direct composition, one message per piece and an obvious call to action. I use a single side to tell everything —headline, useful data and contact— with an image recognisable at a glance.",
      "d.obra.posters.titulo":"Posters and signage",
      "d.obra.posters.desc":"Posters for festivals, university sport and campaigns. The image read from a distance: contrast, scale and typography that works from afar. I work the visual hierarchy so the message lands in two seconds, and I reproduce it in large format without losing sharpness.",
      "d.obra.identidad.titulo":"Corporate identity",
      "d.obra.identidad.desc":"Brands and identity manuals: logo, versions, proportions, corporate colours, typography and applications (stationery, signage, lettering). A system before an ornament: I set the rules in writing so the brand is applied the same today and five years from now, on paper and on screen.",
      "d.obra.otros.titulo":"Other products",
      "d.obra.otros.desc":"Displays and totems for trade fairs, packaging and large-format pieces. Design prepared for production: final art, real measurements and material control. I think about the assembly, transport and final use of every piece before drawing it.",
      "d.obra.portfolio.titulo":"Full portfolio",
      "d.obra.portfolio.desc":"A journey through the most representative works of my time as a graphic designer: brochures, flyers, posters, corporate identity and editorial projects. You can browse it right here; every project is resolved from the idea to the final file.",
      "d.obra.portfolio.card.titulo":"Portfolio Salvador Llácer",
      "d.obra.portfolio.card.texto":"A selection of graphic design pieces: editorial, identity, signage and product, presented as a project portfolio. A visual summary of the way I work, from concept to production.",
      "d.obra.portfolio.btn":"View portfolio (PDF)",
      "d.obra.encantado.titulo":"Enchanted universe · illustration",
      "d.obra.encantado.desc":"A personal illustration and storytelling project: a universe of my own characters and scenes where drawing, colour and imagination rule. Here design becomes story: characters built from the sketch, scenes with their own light and a palette that unifies the whole set.",
      "d.obra.h":"Horizontal",
      "d.obra.v":"Vertical",
      "d.form.titulo":"Education",
      "d.form.item1.titulo":"Artistic Photography",
      "d.form.item1.texto":"The foundation of my eye: composition, colour and light. From photographic framing I learned to look before laying out, and that judgement applies to a page just as it does to a poster. Photography taught me to decide what to leave out of every composition.",
      "d.form.item1.centro":"EASD València · Escola d'Art i Superior de Disseny",
      "d.form.item2.titulo":"Editorial Design & Production",
      "d.form.item2.texto":"The course that trained me as a designer: the whole editorial product process —books, catalogues, brochures—, from concept and grid to final art and print. I learned to structure information, choose the typeface and close the file without production errors.",
      "d.form.item2.centro":"CIPFP Ciudad del Aprendiz",
      "d.tools.titulo":"Tools",
      "d.tools.sub":"My design toolbox: the Adobe suite, from vector illustration to layout and interactive publishing. With it I cover the whole flow —image, vector, grid and digital or print output— without leaving the same ecosystem.",
      "d.tools.experto":"Expert",
      "d.exp.titulo":"Experience",
      "d.exp.sub":"<strong>Two fields, one same criterion.</strong> Visual communication of university sport at the <strong>Servei d'Esports of the Universitat de València</strong>, and direction of corporate image and product communication at <strong>Weidner Ibérica</strong> and <strong>Weidner México</strong>. In every commission: concept, grid, final art and a delivery ready to print or publish. One same method: understand the brief, define the system and deliver it finished.",
      "d.exp.sef.titulo":"Servei d'Esports · Universitat de València",
      "d.exp.sef.cabecera":"Social media cover",
      "d.exp.sef.vondom":"Brand application · VONDOM",
      "d.exp.sef.col1":"Posters",
      "d.exp.sef.col2":"Campaign pieces",
      "d.exp.sef.desc":"Internship at the <strong>Servei d'Esports</strong> of the Universitat de València. I designed the service's visual communication: posters and flyers for competitions and activities, an internal sports magazine and its social media cover. I also adapted the UV mascot iconography to every sport, on a white background, for coherent and versatile use. Every piece started from a common template so the service itself could reuse it in the next campaign.",
      "d.exp.sef.iconos":"Sport icons",
      "d.exp.sef.web":"Official SEF · UV website",
      "d.exp.sef.card.titulo":"Servei d'Esports",
      "d.exp.sef.card.texto":"Design and visual communication internship at the <strong>Servei d'Esports de la Universitat de València</strong>: posters, publications and brand application.",
      "d.exp.sef.card.enlace":"Official SEF · UV website",
      "d.exp.lista1":"Coherent visual system: the same graphic language in print, social media and signage.",
      "d.exp.lista2":"Pieces designed to be reused: templates and common elements across campaigns.",
      "d.exp.lista3":"Ready-to-produce delivery: final art, measurements and colour under control.",
      "d.exp.casos.titulo":"Project cases · problem → solution → result",
      "d.exp.casos.desc":"Three real commissions, told by what they solved. The figures are my own metrics for each delivery.",
      "d.exp.casos.problema":"Problem","d.exp.casos.solucion":"Solution","d.exp.casos.resultado":"Result",
      "d.exp.caso1.tag":"Weidner Ibérica · Weidner México","d.exp.caso1.titulo":"Identity and product communication","d.exp.caso1.problema":"An industrial company based in Spain and Mexico, with no common visual system or unified product catalogue.","d.exp.caso1.solucion":"Corporate identity, editorial templates and interactive catalogues with a single colour and typography standard for both brands.","d.exp.caso1.resultado":"A coherent, multiplatform image, from paper to screen.","d.exp.caso1.stat1":"catalogues delivered","d.exp.caso1.stat2":"brand pieces","d.exp.caso1.stat3":"sites (ES / MX)",
      "d.exp.wiberica.titulo":"Weidner Ibérica","d.exp.wiberica.texto":"Spanish manufacturer of plastic products for the logistics and automotive industry, based in Carlet (Valencia). In charge of its corporate image and product communication.",
      "d.exp.wmexico.titulo":"Weidner México","d.exp.wmexico.texto":"Mexican subsidiary of the Weidner Group. Visual identity and product communication: catalogues, displays and presentations.",
      "d.exp.caso2.tag":"Universitat de València · SEF","d.exp.caso2.titulo":"University sports communication","d.exp.caso2.problema":"The Servei d'Esports needed a homogeneous, recognisable image for its calendar of activities and competitions.","d.exp.caso2.solucion":"A system of posters and flyers, an internal magazine and the UV mascot adapted to each sport.","d.exp.caso2.resultado":"A unique sports identity that the service itself can easily apply.","d.exp.caso2.stat1":"sports","d.exp.caso2.stat2":"campaign pieces","d.exp.caso2.stat3":"full season",
      "d.exp.caso3.tag":"Editorial and product","d.exp.caso3.titulo":"Brochures, trifolds and catalogues","d.exp.caso3.problema":"Dense content —prices, schedules, recipes, product— that had to remain legible, attractive and well folded.","d.exp.caso3.solucion":"Editorial grid, typographic hierarchy and final art prepared for print, with fold and bleed control.","d.exp.caso3.resultado":"Brochures and trifolds ready to produce, with a professional finish.","d.exp.caso3.stat1":"different folds","d.exp.caso3.stat2":"pages laid out","d.exp.caso3.stat3":"printing inks",
      "d.exp.weidner.titulo":"Weidner Ibérica · Weidner México · Cmplastik",
      "d.exp.weidner.desc":"As the person in charge of corporate image at Weidner Ibérica and Weidner México, I developed the company's visual identity and its product communication: printed and interactive catalogues, displays and totems for automotive trade fairs, business cards and email signatures. Here is the result: browsable catalogues and product presentations.",
      "d.exp.wid.inter.titulo":"Interactive catalogue · Weidner Ibérica","d.exp.wid.inter.texto":"Catalogue published with <strong>Adobe Publish Online</strong>: browsable, with interactivity and internal links. The digital version of the product catalogue, designed to be viewed on any device.","d.exp.wid.inter.btn":"Open interactive catalogue",
      "d.exp.wid.prod.titulo":"Product catalogue · Weidner México","d.exp.wid.prod.texto":"Product catalogue in <strong>flipbook</strong> format (Flipsnack). Editorial layout of the full catalogue: technical sheets, product families and a navigation designed for sales.","d.exp.wid.prod.btn":"Open product catalogue",
      "d.exp.wid.verdes.titulo":"Las Soluciones Verdes · Weidner Ibérica and Cmplastik","d.exp.wid.verdes.texto":"Sustainable product presentation in <strong>flipbook</strong> format (Flipsnack): circular economy, recycled materials and green solutions for the sector. Design at the service of an environmental message.","d.exp.wid.verdes.btn":"Open presentation",
      "d.exp.wid.logic.titulo":"LogicPalet presentation","d.exp.wid.logic.texto":"Product presentation of the <strong>modular LogicPalet pallet</strong>, awarded best Spanish invention. Bilingual technical layout: features, logistics advantages, three-step assembly and product sheets.","d.exp.wid.logic.btn":"View presentation (PDF)",
      "d.exp.wid.dulce.titulo":"Dulce de Leche presentation","d.exp.wid.dulce.texto":"Presentation of <strong>sustainable solutions for the food sector</strong> (trays, padel and tennis balls, brushes). Editorial layout that translates a circular-economy message —recycle, reuse, recover— into clear, visual pieces.","d.exp.wid.dulce.btn":"View presentation (PDF)",
      "d.exp.wid.capr.titulo":"CAPR presentation · self-locking column",      "d.exp.wid.capr.texto":"Presentation of the <strong>CAPR</strong> system (self-locking column with reduced pitch): innovation for the automotive sector. <strong>Photography, layout and design of the presentation by me</strong>. Assembly sequence, colour codes (last trigger in red = full load) and product sheets.","d.exp.wid.capr.btn":"View presentation (PDF)",
      "d.comp.titulo":"Skills",
      "d.comp.b1.titulo":"Editorial design","d.comp.b1.texto":"Grids, brochures and catalogues: ordering a lot of information without noise. Hierarchy, rhythm and air so the reader finds what matters effortlessly.",
      "d.comp.b2.titulo":"Corporate identity","d.comp.b2.texto":"Brands and manuals: a system that applies the same on paper and on screen. From the logo to the signage, all under the same rules.",
      "d.comp.b3.titulo":"Illustration and drawing","d.comp.b3.texto":"From sketch to final art: creating the image when it doesn't exist. Drawing, illustration and characters with coherent line and colour.",
      "d.comp.b4.titulo":"Typography and colour","d.comp.b4.texto":"Hierarchy, contrast and complementary palettes with judgement. Typography as a voice and colour as structure.",
      "d.comp.b5.titulo":"Final art and prepress","d.comp.b5.texto":"Pit stop for print: bleeds, profiles and colour control. Files that print right the first time.",
      "d.comp.b6.titulo":"Large format and displays","d.comp.b6.texto":"Posters, totems and trade-fair pieces designed to be produced. Real measurements, materials and resistance to use.",
      "d.ref.titulo":"References","d.ref.sub":"From Mondrian's geometry to Kim Jung Gi's visual memory: masters from whom I inherit the criterion, not the copy. In all of them I look for the same thing: a clear idea and an honest way of telling it.",
      "d.ref.r1.texto":"The grid as language: order, balance and pure colour in space.",
      "d.ref.r2.texto":"Form and function united: the school that taught how to design with method, from workshop to grid.",
      "d.ref.r3.texto":"Drawing from memory, without a sketch: perspective and confidence in the stroke.",
      "d.ref.r4.texto":"Typography as a system: clarity, discipline and total coherence.",
      "d.ref.r5.texto":"One idea, one image: the power of graphic synthesis.",
      "d.ref.r6.texto":"The poster as weapon and art: photomontage, commitment and Valencian craft.",
      "fab.sobre.titulo":"About me",
      "fab.escena.titulo":"Mechanical manufacturing: from sketch to machine",
      "fab.escena.texto":"Industrial mechanical design with over five years of experience at <strong>Weidner Ibérica</strong> in Carlet (Valencia). I specialised in designing <strong>stacking columns</strong> for the automotive sector: self-locking columns, winches and retention systems that are built, assembled and delivered to the big European carmakers. I work daily with <strong>CATIA V5</strong>, drafting and the <strong>Geinprod</strong> ERP, from the parametric model to the bill of materials and the sealed fabrication drawing. I trained at <strong>CP San Jaime Apóstol</strong> in Moncada on the Higher Degree in Mechanical Manufacturing Design, and I cross that craft with a designer's eye: you read a drawing, understand an assembly sequence and think about the operator who will tighten it.",
      "fab.obra.titulo":"Work",
      "fab.obra.sub":"From computer-aided design to the fabricated part: <strong>winch</strong>, <strong>sheet-metal die</strong> and <strong>sheet-metal nesting</strong>. Three ways of solving a mechanical problem —the full assembly, the die that stamps it and the flat-pattern development—, each in its place with its drawing.",
      "fab.obra.cab.titulo":"Winch · full assembly",
      "fab.obra.cab.desc":"Design and documentation of a manual drum winch: general assembly, exploded view and bill of materials, welded sub-assembly, profiles, side plates, base, handle, three shafts, four gears, drum, crank sub-assembly, crank, lever and pawl. Twenty drawings that tell the whole part, from the general assembly to every component detail.",
      "fab.obra.cab.video.titulo":"Assembly video",
      "fab.obra.cab.video.desc":"Walkthrough of the winch assembly and disassembly sequence, taken from the 3D model. The drum turns, the gears mesh and the pawl locks: the animation checks what the drawing depicts.",
      "fab.obra.cab.stp.titulo":"Interactive 3D models",
      "fab.obra.cab.stp.desc":"Four assemblies exported to STEP. Rotate them, zoom in and read them in three dimensions before opening the drawing: the viewer loads in the browser, nothing to install.",
      "fab.obra.cab.pdf.titulo":"Winch drawings",
      "fab.obra.cab.pdf.desc":"Twenty PDF drawings with previous/next navigation. Each drawing opens on its page, with its nomenclature and its views.",
      "fab.obra.matriz.titulo":"Sheet-metal tooling · Project 1 · Die",
      "fab.obra.matriz.desc":"Sheet-metal tooling project: design of the cutting and drawing die for a stamped part. Development of the die, operation-sequence analysis, fit clearances, guides and ejectors. The source file is an <strong>Autodesk Inventor</strong> assembly (.ipt/.iam) with no native web viewer; the work is documented here with its data.",
      "fab.obra.matriz.files.titulo":"Project files",
      "fab.obra.matriz.files.desc":"Project assemblies and parts, in Inventor's native format.",
      "fab.obra.chapa.titulo":"Sheet-metal nesting",
      "fab.obra.chapa.desc":"Sheet-metal nesting study for flat-part cutting: layout of the blanks over the coil, scrap minimisation and grain-direction control. Carried out in <strong>AutoCAD</strong> on .dwg files.",
      "fab.obra.chapa.files.titulo":".dwg drawings",
      "fab.obra.chapa.files.desc":"Development and nesting drafting in AutoCAD.",
      "fab.form.titulo":"Education",
      "fab.form.item1.titulo":"Mechanical Manufacturing Design","fab.form.item1.texto":"The degree that turned me into a part thinker: technical drawing, machine-element calculation, tolerances, geometry and representation, CAD/CAM and manufacturing organisation. The foundation of everything on this page.","fab.form.item1.centro":"CP San Jaime Apóstol · Moncada (Valencia)",
      "fab.tools.titulo":"Tools","fab.tools.sub":"The design and management software I use daily on the shop floor, from the parametric part to the shop-floor drawing and materials control.","fab.tools.experto":"Expert",
      "fab.exp.titulo":"Experience",
      "fab.exp.sub":"<strong>Over five years at the Weidner Ibérica plant</strong> in Carlet (Valencia), as industrial draughtsman and mechanical designer. From the parametric model in <strong>CATIA V5</strong> to the sealed fabrication drawing, with the <strong>Geinprod</strong> ERP for materials management and the bill of materials. A craft of precision, tolerances and deadlines.",
      "fab.exp.wiberica.titulo":"Weidner Ibérica","fab.exp.wiberica.texto":"Spanish manufacturer of plastic products and stacking systems for the logistics and automotive industry, based in Carlet (Valencia). Design of stacking columns and product technical documentation.",
      "fab.exp.wmexico.titulo":"Weidner México","fab.exp.wmexico.texto":"Mexican subsidiary of the Weidner Group. Joint work on product definition and technical documentation for the American market.",
      "fab.exp.stp.titulo":"3D assemblies","fab.exp.stp.desc":"Stacking tower for the automotive industry with an intelligent cam system. I designed it entirely myself after a long process of analysing stresses, materials and functionality; I built several prototypes and the final versions are the 3D models below. The product was manufactured and sold commercially at the Weidner Ibérica plant in Carlet (Valencia).",
      "fab.exp.cadenas.titulo":"Column with chains","fab.exp.cadenas.desc":"My own R&D project for the company, in the spirit of the SLI column: a stacking column with a chain system and ergonomic levers integrated into the body, so the operator tensions or releases the load without bending down. The whole assembly is modelled and documented in CATIA V5, with a full 3D viewer.",
      "fab.exp.casos.titulo":"Project cases · problem → solution → result","fab.exp.casos.desc":"Three real engineering problems, told by what they solved.","fab.exp.casos.problema":"Problem","fab.exp.casos.solucion":"Solution","fab.exp.casos.resultado":"Result",
      "fab.exp.caso1.tag":"Weidner Ibérica · Automotive","fab.exp.caso1.titulo":"Stacking column with no manual unlocking","fab.exp.caso1.problema":"Competitor stacking columns required the operator to remove the part from the rack by hand to release the lock on every cycle: finger-entrapment risk, forced postures and lost seconds that piled up shift after shift on the automotive line.","fab.exp.caso1.solucion":"Design of a locking mechanism whose lever is triggered by the part's own weight as it is lifted off the rack: unloading it releases the catch by itself, leaving the column ready for the next stacking without the operator touching the mechanism.","fab.exp.caso1.resultado":"A faster, safer cycle: zero manual unlocking actions, less entrapment risk and a steadier assembly pace for the operator.","fab.exp.caso1.stat4":"faster cycle",
      "fab.exp.caso2.tag":"Weidner Ibérica · Ergonomics","fab.exp.caso2.titulo":"Chain column with ergonomic levers","fab.exp.caso2.problema":"To tension or release the column's retention chains, the operator had to bend down to the floor on every adjustment: a forced, repetitive posture that strained the back and built up fatigue over the shift.","fab.exp.caso2.solucion":"Design of raised, short-stroke control levers integrated into the frame that let the chains be tensioned and released standing up and with one hand, with no need to bend down to floor level.","fab.exp.caso2.resultado":"Ergonomic work: the forced bending posture disappears, accumulated fatigue drops and chain adjustment becomes a comfortable step in the assembly cycle.","fab.exp.caso2.stat4":"less fatigue per shift",
      "fab.exp.caso3.tag":"Product engineering","fab.exp.caso3.titulo":"Fabrication documentation and bill of materials","fab.exp.caso3.problema":"A new product had to go from the 3D model to the shop floor with clean drawings, a coherent bill of materials, a single nomenclature and clear tolerances: without that closed package, the shop stopped to ask and assembly slipped.","fab.exp.caso3.solucion":"Parametric modelling in CATIA V5, STEP export for exchange, a general-assembly drawing, an exploded view with bill of materials and detail drawings with tolerances and treatments defined, all under a single reference coding.","fab.exp.caso3.resultado":"A closed fabrication package: the shop receives drawing, detail and bill of materials with no questions and can start machining without back-and-forth with engineering.","fab.exp.caso3.stat4":"years in CATIA V5",
      "fab.exp.weidner.titulo":"Weidner Ibérica · Design and documentation",
      "fab.exp.weidner.desc":"Design of <em>stacking columns</em> for the automotive sector: self-locking columns, winches and retention systems. From the parametric model in CATIA V5 to the sealed fabrication drawing, with the Geinprod ERP for materials management. Here is the result: navigable 3D models and the winch drawing.",
      "fab.exp.listas.titulo":"Product presentation",
      "fab.exp.listas.desc":"Presentation of Weidner's stacking columns, opened on the product page. Technical layout with assembly sequence, colour codes and product data sheets.",
      "fab.exp.listas.btn":"View presentation (PDF)",
      "fab.exp.flips.titulo":"Product catalogue","fab.exp.flips.desc":"Weidner product catalogue in flipbook format (Flipsnack), opened on the columns pages. Editorial layout with technical sheets and product families.","fab.exp.flips.btn":"Open catalogue",
      "fab.exp.weidner.card.titulo":"Weidner Ibérica",
      "fab.exp.weidner.card.texto":"Spanish manufacturer of stacking systems for the logistics and automotive industry, based in Carlet (Valencia).",
      "fab.exp.wmexico.card.titulo":"Weidner México","fab.exp.wmexico.card.texto":"Mexican subsidiary of the Weidner Group, based in Querétaro.",
      "fab.api.titulo":"Standards and materials",
      "fab.api.nav":"Standards and materials",
      "fab.api.sub":"Two shop-floor tools computed in the browser: ISO 286 fits and tolerances, and an engineering materials database. No keys, no servers.",
      "fab.tol.titulo":"ISO 286 tolerances",
      "fab.tol.nota":"Official ISO 286-2:2010 tables. Hole basis H. Deviations in µm, limits in mm. Ø 3–400 mm.",
      "fab.tol.diam":"Nominal Ø (mm)",
      "fab.tol.hueco":"Hole",
      "fab.tol.eje":"Shaft",
      "fab.tol.btn":"Calculate fit",
      "fab.mat.titulo":"Engineering materials",
      "fab.mat.nota":"Typical properties at 20 °C. Indicative values: always confirm against the supplier's certificate.",
      "fab.mat.sel":"Material",
      "fab.comp.titulo":"Skills",
      "fab.comp.b1.titulo":"Parametric 3D design","fab.comp.b1.texto":"From solid to assembly in CATIA V5: parts, constraints and coherent updates.",
      "fab.comp.b2.titulo":"Technical drawing and tolerances","fab.comp.b2.texto":"Clear shop-floor drawings: views, sections, dimensioning and tolerances you can actually make.",
      "fab.comp.b3.titulo":"Sheet-metal manufacturing","fab.comp.b3.texto":"Punching, cutting, bending and stamping: think the part so it comes out right off the machine.",
      "fab.comp.b4.titulo":"ERP and materials management","fab.comp.b4.texto":"Geinprod: bills of materials, materials and procurement control.",
      "fab.comp.b5.titulo":"Product documentation","fab.comp.b5.texto":"Exploded views, detail drawings and coherent nomenclature from model to delivery.",
      "fab.comp.b6.titulo":"Ergonomics and continuous improvement","fab.comp.b6.texto":"Design for the operator: safe postures, short cycles and less effort.",
      "fab.ref.titulo":"References","fab.ref.sub":"The masters of industrial craft: from them I inherit the method, not the copy.",
      "fab.ref.r1.texto":"The founder of Toyota: from the automatic loom to the interchangeable part and the method that changed manufacturing.",
      "fab.ref.r2.texto":"Taiichi Ohno's TPS: make only what is needed, when it is needed, with no overproduction.",
      "fab.ref.r3.texto":"Scientific management: measure, standardise and simplify every operation to manufacture better.",
      "fab.ref.r4.texto":"The aesthetics of pure function: form following use, with nothing left over.",
      "fab.ref.r5.texto":"The assembly line and the interchangeable part: the origin of mass production.",
      "fab.ref.r6.texto":"The machine tool: precision as the basis of all industry.",
      "fab.planos.anterior":"Previous",
      "fab.planos.siguiente":"Next",
      "fab.planos.pagina":"Drawing",
      "pie.secciones":"Sections",
      "bn.video.etq":"03 — VIDEO & MUSIC","bn.video.tit":"Rhythm, sound and colour","bn.video.desc":"Editing, assembly and my own music: from the MissR reels to the ECO documentary series. Come in and listen.","bn.video.cta":"VIEW PORTFOLIO","bn.video.son":"Sound",
      "repro.lista":"My own music","repro.rrr":"MissR soundtrack","repro.eco":"ECO soundtrack","repro.arte":"ARTE music",
      "v.sobre.titulo":"About me",
      "v.escena.titulo":"Video & music: rhythm, sound and colour",
      "v.escena.texto":"As a child I played the bandurria in a rondalla, where I learned the pleasure of creating something together. At CEIP Cavite —La Isla de Hierro— I took my first optional course in audiovisual media, learning shot types, visual language and framing. Since then, cinema and music have gone hand in hand: I collaborated with La Canya Produccions —winner in two editions of Cinema Jove— and, as a member and collaborator of Interpreta Natura, I edit reels, short films and videos, compose the music for those works and voice some of them.",
      "v.obra.titulo":"Work","v.obra.sub":"Two crafts that cross in the same edit: <strong>Video</strong> —script, shooting, editing and post-production— and <strong>Music</strong> —my own compositions made with GarageBand—. One idea in two formats: rhythm, sound and colour.",
      "v.obra.video.titulo":"Video","v.obra.video.desc":"Editing and post-production for Interpreta Natura: reels, short films and promotional videos. I edit, grade and take care of the sound; the music of many of those pieces is also mine.","v.obra.video.dest":"<strong>Ruta teatralitzada «Que el temps no esborre la memòria».</strong> Promotional piece for a scenic route about war memory: my own shooting, editing and music, with the Interpreta Natura association.",
      "v.obra.rrr.titulo":"The three Rs","v.obra.rrr.desc":"Seven vertical pieces on the three Rs: <strong>Reduce</strong>, <strong>Repair</strong> and <strong>Reuse</strong>. My own script, shooting and editing, with music composed for each piece.","v.obra.rrr4.desc":"<strong>MissR and the 4 magnificents.</strong> Piece from the MissR campaign in which <strong>I composed the music</strong> and collaborated on the <strong>shooting and editing</strong> of the video.",
      "v.obra.musica.titulo":"Music","v.obra.musica.desc":"My personal pieces, composed and produced in <strong>GarageBand</strong>: music to imagine, work and breathe. Play them while you keep browsing the site.",
      "v.form.titulo":"Education","v.form.item1.grado":"Elective","v.form.item1.titulo":"Audiovisual media","v.form.item1.texto":"My first training in the language of cinema: shot types, framing, narrative and screenwriting structure. I also played the bandurria in the school rondalla, where I learned to cooperate for a common result.","v.form.item1.centro":"CEIP Cavite · La Isla de Hierro",
      "v.form.item2.titulo":"Artistic Photography","v.form.item2.texto":"The audiovisual module reinforced what I had learned in secondary school: framing, rhythm and editing applied to a real reportage. The technical foundation for an image to hold up and a cut to make sense.","v.form.item2.centro":"EASD València · Escola d'Art i Superior de Disseny",
      "v.tools.titulo":"Tools","v.tools.sub":"My editing chain: cutting and colour in Premiere, finishing in After Effects, sound and mixing in Audition, and Apple apps when the workflow is quick and direct.","v.tools.experto":"Expert","v.tools.avanzado":"Advanced","v.tools.intermedio":"Intermediate",
      "v.exp.titulo":"Experience","v.exp.sub":"<strong>One field, several projects.</strong> I collaborate with the audiovisual department of <strong>Interpreta Natura</strong>: shooting, editing and sound for reels, short films and podcasts, music composed for each piece and voice-over for some of them. Here are the projects I was involved in from start to finish.",
      "v.exp.in.titulo":"Interpreta Natura","v.exp.in.texto":"Non-profit association dedicated to the interpretation of the natural and cultural environment of the Comunitat Valenciana. With them I collaborate on <strong>video shooting and editing</strong>, reels and podcasts, <strong>original music</strong> for their pieces, voice-overs and graphic design.",
      "v.exp.missr.titulo":"MissR · reduce, repair, reuse","v.exp.missr.desc":"Audiovisual campaign about the three Rs. I edited the social pieces, took part in the shooting and composed the soundtrack for each one. The soundtrack, in audio format, is just below.",
      "v.exp.eco.titulo":"ECO · La història d'ECO","v.exp.eco.desc":"Documentary series in Valencian: a prologue and eight chapters about the land, its people and the soil. Editing of all nine instalments and my own music for the series.",
      "v.exp.arte.titulo":"ARTE","v.exp.arte.desc":"Nine episodes of the ARTE project. The <strong>music is mine</strong>; the <strong>narration and illustrations</strong> are by Esther Torres.",
      "v.exp.ods.titulo":"SDGs · Sustainable Development Goals","v.exp.ods.desc":"Series of shorts in Valencian about the Sustainable Development Goals. Editing of the pieces and original music for each one.",
      "v.exp.reviu.titulo":"Reviu lo Rural","v.exp.reviu.desc":"Audiovisual project to revive rural life: five pieces about the land, its people and the home. My own editing and music.",
      "v.exp.otros.titulo":"Other projects with Interpreta Natura","v.exp.otros.desc":"Own music for Interpreta Natura projects.","v.exp.otros.musica":"own music",
      "v.exp.casos.titulo":"Project cases · problem → solution → result","v.exp.casos.desc":"Three real commissions, told by what they solved. The figures are each delivery's own metrics.","v.exp.casos.problema":"Problem","v.exp.casos.solucion":"Solution","v.exp.casos.resultado":"Result",
      "v.exp.caso1.tag":"Interpreta Natura","v.exp.caso1.titulo":"Staged route «Que el temps no esborre la memòria»","v.exp.caso1.problema":"The association needed a promotional piece for a scenic route about war memory, with no in-house audiovisual team.","v.exp.caso1.solucion":"Shooting, editing and original soundtrack; voice-over and assembly with archive material and location sound.","v.exp.caso1.resultado":"Promotional piece ready for social media that gave visibility to the route.","v.exp.caso1.stat1":"piece delivered","v.exp.caso1.stat2":"own music","v.exp.caso1.stat3":"shooting days",
      "v.exp.caso2.tag":"Audiovisual campaign","v.exp.caso2.titulo":"MissR · reduce, repair, reuse","v.exp.caso2.problema":"Raise awareness about the three Rs with short social-media pieces, starting from scratch with no sonic identity.","v.exp.caso2.solucion":"Script, shooting and editing of six reels, with an original soundtrack composed for each piece.","v.exp.caso2.resultado":"Complete campaign ready to publish, with its own sonic identity.","v.exp.caso2.stat1":"reels delivered","v.exp.caso2.stat2":"soundtracks","v.exp.caso2.stat3":"own music",
      "v.exp.caso3.tag":"Documentary series","v.exp.caso3.titulo":"ECO · The story of ECO","v.exp.caso3.problema":"An audiovisual series in Valencian that needed narrative structure and sonic unity for a prologue and eight chapters.","v.exp.caso3.solucion":"Editing of the prologue and eight episodes, with music composed to match the pace of each chapter.","v.exp.caso3.resultado":"Complete documentary series, coherent in rhythm, colour and sound.","v.exp.caso3.stat1":"episodes","v.exp.caso3.stat2":"complete series","v.exp.caso3.stat3":"own music",
      "v.comp.titulo":"Skills",
      "v.comp.b1.titulo":"Editing and assembly","v.comp.b1.texto":"Rhythm, cut and structure: giving a piece a beginning, middle and end without losing the viewer.",
      "v.comp.b2.titulo":"Colour and post-production","v.comp.b2.texto":"Colour correction, image clean-up and finishing that unify material from different sources.",
      "v.comp.b3.titulo":"Sound and mixing","v.comp.b3.texto":"Voice, ambience and music in their place: clean dialogue and a balanced mix for any screen.",
      "v.comp.b4.titulo":"Music composition","v.comp.b4.texto":"My own soundtrack with GarageBand: pieces composed to fit the image, not to compete with it.",
      "v.comp.b5.titulo":"Voice-over and script","v.comp.b5.texto":"Writing what is told and saying it well: script, voice-over and narration of the pieces I take part in.",
      "v.ref.titulo":"References","v.ref.sub":"Eight names that explain where my way of editing and composing comes from. From them I inherit the criterion, not the copy.","v.ref.cine":"Film references","v.ref.music":"Music references",
      "v.ref.r1.texto":"Suspense as editing: knowing what will happen and making the audience wait.","v.ref.r2.texto":"Narrative clarity: story ahead of the effect.","v.ref.r3.texto":"Handheld energy: the shot as a rhythmic beat.","v.ref.r4.texto":"Editing at the service of music: cutting on the beat.",
      "v.ref.r5.texto":"Melodic minimalism: repeating until the idea breathes.","v.ref.r6.texto":"Sound architecture: the pattern as the structure of the piece.","v.ref.r7.texto":"Piano that accompanies the image: emotion without shouting.","v.ref.r8.texto":"A motif that returns: melody as the thread of the narrative.",
      "v.lastfm.titulo":"What I listen to","v.lastfm.sub":"My music can be heard in the music section; here, what is playing on my headphones thanks to the Last.fm API.","v.lastfm.tit":"Artists I listen to the most","v.lastfm.nota":"Live data from my Last.fm profile.","v.lastfm.btn":"Listen to my music","v.lastfm.carga":"Loading artists…","v.lastfm.fuente":"Data from the public API of","v.lastfm.vacio":"Set LASTFM_KEY and LASTFM_USER in script.js to see my Last.fm artists.","v.lastfm.sin_datos":"My Last.fm profile has no artists registered yet. Listen to some music and come back!"
    }
  };
  const i18nEls = [...document.querySelectorAll("[data-i18n]")];
  const langBtns = [...document.querySelectorAll(".lang__btn")];
  function aplicarIdioma(lang){ const dic=I18N[lang]; if(!dic) return; i18nEls.forEach((el)=>{const k=el.getAttribute("data-i18n"); if(dic[k]) el.innerHTML=dic[k];}); document.querySelectorAll("[data-i18n-ph]").forEach((el)=>{const k=el.getAttribute("data-i18n-ph"); if(dic[k]) el.placeholder=dic[k];}); html.setAttribute("lang",lang); langBtns.forEach((b)=>{const on=b.dataset.lang===lang;b.classList.toggle("is-active",on);b.setAttribute("aria-pressed",String(on));}); try{localStorage.setItem("idioma",lang);}catch(e){} if(window.__updateViewBtn) window.__updateViewBtn(); }
  langBtns.forEach((b)=>b.addEventListener("click",()=>aplicarIdioma(b.dataset.lang)));
  let idioma="es"; try{idioma=localStorage.getItem("idioma")||"es";}catch(e){} if(idioma==="en") aplicarIdioma("en");
  const langActual=()=>html.getAttribute("lang")||"es";

  /* Toast */
  let toastEl;
  const toast=(msg)=>{ if(!toastEl){toastEl=document.createElement("div");toastEl.className="toast";toastEl.setAttribute("role","status");document.body.appendChild(toastEl);} toastEl.textContent=msg;toastEl.classList.add("is-on");clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove("is-on"),2200); };
  document.querySelectorAll("[data-soon]").forEach((a)=>a.addEventListener("click",(e)=>{e.preventDefault();cerrarMenu();toast((I18N[langActual()]||I18N.es)["toast.soon"]);}));

  /* Modal contacto */
  const modal=document.getElementById("modal"),form=document.getElementById("form"),exito=document.getElementById("exito");
  const btnEnviar=form?form.querySelector("button[type=submit]"):null;
  const campos=form?form.querySelectorAll(".form__campo"):null;
  let timer=0,ultimoFoco=null;
  const lbAbierto=()=>{const l=document.getElementById("lightbox");return l&&l.classList.contains("is-open");};
  const gmAbierto=()=>{const l=document.getElementById("gridmodal");return l&&l.classList.contains("is-open");};
  const focusables=()=>[...modal.querySelectorAll('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])')].filter((el)=>el.offsetParent!==null);
  const abrirModal=(tr)=>{ if(!modal||!form) return; ultimoFoco=tr||document.activeElement; modal.classList.add("is-open"); modal.setAttribute("aria-hidden","false"); const p=form.querySelector("input"); if(p) setTimeout(()=>p.focus(),200); };
  const cerrarModal=()=>{ if(!modal||!form) return; modal.classList.remove("is-open"); modal.setAttribute("aria-hidden","true"); clearTimeout(timer); form.reset(); if(btnEnviar) btnEnviar.style.display=""; if(campos) campos.forEach(c=>c.style.display=""); if(exito) exito.hidden=true; if(ultimoFoco&&ultimoFoco.focus) ultimoFoco.focus(); };
  document.querySelectorAll(".js-contacto").forEach((a)=>a.addEventListener("click",(e)=>{e.preventDefault();cerrarMenu();abrirModal(a);}));
  if(modal){ modal.querySelectorAll("[data-cerrar]").forEach((el)=>el.addEventListener("click",cerrarModal));
    document.addEventListener("keydown",(e)=>{ if(!modal.classList.contains("is-open")||lbAbierto()||gmAbierto()) return;
      if(e.key==="Escape"){cerrarModal();cerrarMenu();return;}
      if(e.key==="Tab"){const f=focusables(); if(!f.length) return; const first=f[0],last=f[f.length-1]; if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();} else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}} }); }
  if(form) form.addEventListener("submit",(e)=>{e.preventDefault(); if(!form.checkValidity()){form.reportValidity();return;}
    const fd=new FormData(form);
    const nom=String(fd.get("nombre")||"").trim(), em=String(fd.get("email")||"").trim(), ms=String(fd.get("mensaje")||"").trim();
    const asunto=encodeURIComponent("Mensaje desde el portfolio — "+nom);
    const cuerpo=encodeURIComponent(ms+"\n\n— "+nom+" ("+em+")");
    window.location.href="mailto:salllaiva@alu.edu.gva.es?subject="+asunto+"&body="+cuerpo;
    if(btnEnviar) btnEnviar.style.display="none"; if(campos) campos.forEach(c=>c.style.display="none"); if(exito) exito.hidden=false; timer=setTimeout(cerrarModal,3500);});

  /* ░░ Revelado ░░ */
  const rev=document.querySelectorAll(".reveal");
  if(!reduce&&"IntersectionObserver" in window){ rev.forEach((el,i)=>{el.style.animationDelay=(i%6)*0.07+"s";});
    const obs=new IntersectionObserver((es)=>es.forEach((e)=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);}}),{threshold:.12}); rev.forEach((el)=>obs.observe(el));
  } else rev.forEach((el)=>el.classList.add("visible"));

  /* ░░ Barras y bolitas de herramientas: entran al llegar, se reinician al salir ░░ */
  document.querySelectorAll(".tools").forEach((tools)=>{
    if(reduce||!("IntersectionObserver" in window)){ tools.classList.add("is-on"); return; }
    const tio=new IntersectionObserver((es)=>es.forEach((e)=>{ tools.classList.toggle("is-on",e.isIntersecting&&e.intersectionRatio>=.35); }),{threshold:[0,.35,.6]});
    tio.observe(tools);
  });

  /* Stats count-up */
  document.querySelectorAll(".stat__num").forEach((el)=>{
    const target=+el.dataset.count, suf=el.dataset.suffix||"";
    if(reduce){ el.textContent=target+suf; return; }
    const io=new IntersectionObserver((es)=>es.forEach((e)=>{ if(e.isIntersecting){ io.disconnect(); const dur=1200,t0=performance.now(); (function tick(n){const p=Math.min(1,(n-t0)/dur); el.textContent=Math.round(p*target)+suf; if(p<1) requestAnimationFrame(tick);})(performance.now()); } }),{threshold:.6});
    io.observe(el);
  });

  /* Wikipedia */
  const API=(qs)=>`https://es.wikipedia.org/w/api.php?format=json&origin=*&${qs}`;
  const firstPage=(j)=>{const p=j&&j.query&&j.query.pages;return p?Object.values(p)[0]:null;};
  async function wikiOriginal(titulo){
    try{const r=await fetch(API(`action=query&titles=${encodeURIComponent(titulo)}&redirects=1&prop=pageimages&piprop=original`));const j=await r.json();return firstPage(j)?.original?.source||null;}catch{return null;}
  }
  async function wikiSearch(q){
    try{const r=await fetch(API(`action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=1&prop=pageimages&piprop=original`));const j=await r.json();return firstPage(j)?.original?.source||null;}catch{return null;}
  }
  document.querySelectorAll(".media img").forEach((img)=>{
    if(img.complete&&img.naturalWidth) img.classList.add("ok");
    else img.onload=()=>img.classList.add("ok");
  });
  document.querySelectorAll(".media[data-wiki]").forEach(async (m)=>{
    const t=m.getAttribute("data-wiki");
    const img=m.querySelector("img");
    const tryWiki=async()=>{ let s=await wikiOriginal(t); if(!s) s=await wikiSearch(m.getAttribute("data-wiki-search")||t); if(s&&img){ img.onload=()=>img.classList.add("ok"); img.src=s; } };
    const own=img&&img.getAttribute("src");
    if(own&&/^https?:/i.test(own)){ if(img.complete&&img.naturalWidth) img.classList.add("ok"); else img.onload=()=>img.classList.add("ok"); img.onerror=()=>{ tryWiki(); }; }
    else if(!own) tryWiki();
  });

  /* ░░ OBRA / EXPERIENCIA: slider + mosaico (grid) ░░ */
  (function obra(){
    const pad2=(n)=>String(n).padStart(2,"0");
    const DUR=6000;
    const globalMode=()=>html.getAttribute("data-view")||"std";

    const SERIES2={
      "paisaje-h":{title:"Paisaje",orient:"h",base:"Imagenes/foto/paisaje/horizontal/",
        files:["paisaje-horizontal-001.webp","paisaje-horizontal-002.webp","paisaje-horizontal-003.webp","paisaje-horizontal-004.webp","paisaje-horizontal-005.webp","paisaje-horizontal-006.webp","paisaje-horizontal-007.webp","paisaje-horizontal-008.webp","paisaje-horizontal-009.webp","paisaje-horizontal-010.webp"]},
      "paisaje-v":{title:"Paisaje",orient:"v",base:"Imagenes/foto/paisaje/vertical/",
        files:["paisaje-vertical-010.webp","paisaje-vertical-001.webp","paisaje-vertical-002.webp","paisaje-vertical-003.webp","paisaje-vertical-004.webp","paisaje-vertical-005.webp","paisaje-vertical-006.webp","paisaje-vertical-007.webp","paisaje-vertical-008.webp","paisaje-vertical-009.webp"]},
      "robados-h":{title:"Robados",orient:"h",base:"Imagenes/foto/robados/horizontal/",
        files:["robados-horizontal-002.webp","robados-horizonta-009.webp","robados-horizonta-010.webp","robados-horizontal-001.webp","robados-horizontal-003.webp","robados-horizontal-004.webp","robados-horizontal-005.webp","robados-horizontal-006.webp","robados-horizontal-007.webp","robados-horizontal-008.webp"]},
      "robados-v":{title:"Robados",orient:"v",base:"Imagenes/foto/robados/vertical/",
        files:["010.webp","robados-vertical-001.webp","robados-vertical-002.webp","robados-vertical-003.webp","robados-vertical-004.webp","robados-vertical-005.webp","robados-vertical-006.webp","robados-vertical-007.webp","robados-vertical-008.webp","robados-vertical-009.webp"]},
      "personal-h":{title:"Visión personal",orient:"h",base:"Imagenes/foto/personal/horizontal/",
        files:["personal-horizontal-001.webp","personal-horizontal-002.webp","personal-horizontal-003.webp","personal-horizontal-004.webp","personal-horizontal-005.webp","personal-horizontal-006.webp"]},
      "personal-v":{title:"Visión personal",orient:"v",base:"Imagenes/foto/personal/vertical/",
        files:["personal-vertical-004.webp","personal-vertical-001.webp","personal-vertical-002.webp","personal-vertical-003.webp"]},
      "bodegon-h":{title:"Bodegón publicitario",orient:"h",base:"Imagenes/foto/bodegon/",
        files:["bodegon-005.webp","bodegon-003.webp","bodegon-001.webp","bodegon-006.webp"]},
      "bodegon-v":{title:"Bodegón publicitario",orient:"v",base:"Imagenes/foto/bodegon/",
        files:["bodegon-002.webp","bodegon-004.webp"]},
      "moda-h":{title:"Moda",orient:"h",base:"Imagenes/foto/moda/horizontal/",
        files:["moda-horizontal-001.webp","moda-horizontal-002.webp","moda-horizontal-003.webp","moda-horizontal-004.webp","moda-horizontal-005.webp","moda-horizontal-006.webp","moda-horizontal-007.webp","moda-horizontal-008.webp","moda-horizontal-009.webp","moda-horizontal-010.webp","moda-horizontal-011.webp"]},
      "moda-v":{title:"Moda",orient:"v",base:"Imagenes/foto/moda/vertical/",
        files:["moda-vertical-008.webp","moda-vertical-001.webp","moda-vertical-002.webp","moda-vertical-003.webp","moda-vertical-004.webp","moda-vertical-005.webp","moda-vertical-006.webp","moda-vertical-007.webp","moda-vertical-009.webp","moda-vertical-010.webp","moda-vertical-011.webp","moda-vertical-012.webp","moda-vertical-013.webp","moda-vertical-014.webp","moda-vertical-015.webp","moda-vertical-016.webp","moda-vertical-017.webp"]},
      "retrato-a":{title:"Retrato",orient:"v",base:"Imagenes/foto/retrato/",
        files:["retrato-001.webp","retrato-002.webp","retrato-003.webp","retrato-004.webp","retrato-005.webp","retrato-006.webp"]},
      "retrato-b":{title:"Retrato",orient:"v",base:"Imagenes/foto/retrato/",
        files:["retrato-007.webp","retrato-008.webp","retrato-009.webp","retrato-010.webp","retrato-011.webp","retrato-012.webp"]},
      "etsid-interior":{title:"Interior · ETSID",orient:"h",base:"Imagenes/foto/ETSID/Interior/",
        files:["01.webp","02.webp","03.webp","05.webp","06.webp","07.webp","09.webp","10.webp","12.webp","13.webp","14.webp","15.webp","16.webp","17.webp","18.webp"]},
      "etsid-exterior":{title:"Exterior · ETSID",orient:"h",base:"Imagenes/foto/ETSID/Exterior/",
        files:["exterior-004.webp","exterior-001.webp","exterior-002.webp","exterior-003.webp","exterior-005.webp","exterior-006.webp","exterior-007.webp","exterior-008.webp","exterior-009.webp","exterior-010.webp","exterior-011.webp"]},
      "dis-folletos-a":{title:"Folletos",orient:"h",ratio:"4/3",base:"Imagenes/diseño/",
        files:["diseño-006.webp","diseño-001.webp","diseño-002.webp","diseño-003.webp","diseño-004.webp","diseño-007.webp","diseño-008.webp","diseño-009.webp","diseño-010.webp","diseño-011.webp","diseño-012.webp","diseño-013.webp","diseño-014.webp","diseño-015.webp"]},
      "dis-folletos-b":{title:"Folletos",orient:"h",ratio:"4/3",base:"Imagenes/diseño/",
        files:["diseño-010.webp","diseño-011.webp","diseño-012.webp","diseño-013.webp","diseño-014.webp","diseño-015.webp"]},
      "dis-flyers-a":{title:"Flyers",orient:"h",ratio:"4/3",base:"Imagenes/diseño/",
        files:["diseño-017.webp","diseño-018.webp"]},
      "dis-posters":{title:"Pósters",orient:"h",ratio:"4/3",base:"Imagenes/diseño/",
        files:["diseño-021.webp","diseño-005.webp","diseño-020.webp"]},
      "dis-posters-v":{title:"Pósters",orient:"v",ratio:"5/7",ratios:{"diseño-024.webp":"2551/3579","diseño-032.webp":"5976/7157","diseño-034.webp":"2289/2614","diseño-033.webp":"1789/2551","diseño-035.webp":"1819/2551"},base:"Imagenes/diseño/",
        files:["diseño-024.webp","diseño-032.webp","diseño-034.webp","diseño-033.webp","diseño-035.webp"]},
      "dis-identidad-a":{title:"Identidad",orient:"h",ratio:"4/3",base:"Imagenes/diseño/",
        files:["diseño-019.webp","diseño-022.webp"]},
      "dis-identidad-b":{title:"Identidad",orient:"h",ratio:"4/3",base:"Imagenes/diseño/",
        files:["diseño-023.webp","diseño-025.webp","diseño-026.webp","diseño-027.webp","diseño-028.webp"]},
      "dis-encantado-a":{title:"Universo encantado",orient:"h",ratio:"4/3",sepia:true,ratios:{"dibujo-003.webp":"3471/2062","dibujo-004.webp":"2252/2177","dibujo-005.webp":"2528/2148","dibujo-007.webp":"2466/1868"},base:"Imagenes/dibujo/",
        files:["dibujo-003.webp","dibujo-004.webp","dibujo-005.webp","dibujo-007.webp"]},
      "dis-encantado-b":{title:"Universo encantado",orient:"h",ratio:"4/3",sepia:true,ratios:{"dibujo-008.webp":"2549/1987","dibujo-009.webp":"2025/1952","dibujo-010.webp":"2666/1934","dibujo-001.webp":"2223/2471"},base:"Imagenes/dibujo/",
        files:["dibujo-010.webp","dibujo-008.webp","dibujo-009.webp","dibujo-001.webp"]},
      "sef-piezas-v-a":{title:"SEF · carteles",orient:"v",ratio:"5/7",ratios:{"Cartel II Festival Flamenc_page-0001.webp":"3579/5032","II Festival de Danzas 2014.webp":"3579/5032"},base:"Imagenes/diseño/SEFUV/",
        files:["Cartel II Festival Flamenc_page-0001.webp","II Festival de Danzas 2014.webp"]},
      "sef-piezas-v-b":{title:"SEF · piezas",orient:"v",ratio:"5/7",ratios:{"POSTER v3.webp":"3579/5032","flyer premios.webp":"2480/3509"},base:"Imagenes/diseño/SEFUV/",
        files:["POSTER v3.webp","flyer premios.webp"]}
    };

    function serieItems(cfg){ return cfg.files.map((f,i)=>({src:cfg.base+f,label:cfg.title+" "+pad2(i+1)})); }
    function ratioOf(cfg,f){ return (cfg.ratios&&cfg.ratios[f])||cfg.ratio||(cfg.orient==="h"?"3/2":"2/3"); }

    function buildSlider(el){
      const cfg=SERIES2[el.dataset.slider]; if(!cfg) return;
      const n=cfg.files.length;
      const w=cfg.orient==="h"?1600:1067, h=cfg.orient==="h"?1067:1600;
      el.setAttribute("data-orient",cfg.orient);
      el.innerHTML=`<div class="slider">
          <div class="slider__stage"><span class="slider__progress"></span></div>
          <button class="slider__nav slider__nav--prev" aria-label="Anterior"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button class="slider__nav slider__nav--next" aria-label="Siguiente"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
          <div class="slider__bar"><button class="slider__all">Ver todas <b>${n}</b></button><span class="slider__count">01 / ${n}</span></div>
        </div>`;
      const stage=el.querySelector(".slider__stage");
      const prog=el.querySelector(".slider__progress");
      const count=el.querySelector(".slider__count");
      const items=serieItems(cfg);
      if(cfg.files.length) stage.style.aspectRatio=ratioOf(cfg,cfg.files[0]);
      if(cfg.bg) stage.style.background=cfg.bg;
      if(cfg.bg) el.dataset.bg=cfg.bg;

      const imgs=cfg.files.map((f,i)=>{
        const img=document.createElement("img");
        stage.insertBefore(img,prog);
        const src=cfg.base+f;
        if(i===0){ img.src=src; img.setAttribute("fetchpriority","high"); } else { img.dataset.src=src; }
        img.width=w; img.height=h; img.alt=items[i].label; img.decoding="async";
        if(cfg.sepia) img.classList.add("img-sepia");
        if(cfg.bg) img.style.background=cfg.bg;
        img.addEventListener("error",()=>{ img.dataset.broken="1"; },{once:true});
        return img;
      });
      const cargar=(i)=>{ const im=imgs[i]; if(im && im.dataset.src && !im.src){ im.src=im.dataset.src; delete im.dataset.src; } };

      const slider={ idx:0,timer:null,visible:false,el:el,stage:stage,
        go(i){ if(!imgs.length) return;
          let nn=i; for(let k=0;k<imgs.length;k++){ const c=(nn+k)%imgs.length; if(imgs[c].dataset.broken!=="1"){ nn=c; break; } }
          this.idx=nn; cargar(nn); cargar((nn+1)%imgs.length);
          stage.style.aspectRatio=ratioOf(cfg,cfg.files[nn]);
          imgs.forEach((im,k)=>im.classList.toggle("is-active",k===nn));
          count.textContent=pad2(nn+1)+" / "+imgs.length;
          if(!reduce){ prog.classList.remove("go"); void prog.offsetWidth; prog.classList.add("go"); }
          this.schedule(); },
        schedule(){ clearTimeout(this.timer); if(reduce||!this.visible||gmAbierto()||lbAbierto()) return; this.timer=setTimeout(()=>this.go(this.idx+1),DUR); },
        destroy(){ clearTimeout(this.timer); io.disconnect(); } };

      el.querySelector(".slider__nav--prev").addEventListener("click",()=>slider.go(slider.idx-1));
      el.querySelector(".slider__nav--next").addEventListener("click",()=>slider.go(slider.idx+1));
      el.querySelector(".slider__all").addEventListener("click",()=>openGrid(slider,items,cfg,el));
      stage.addEventListener("click",()=>openLightbox(items,slider.idx,el));
      el.addEventListener("mouseenter",()=>{clearTimeout(slider.timer);prog.style.animationPlayState="paused";});
      el.addEventListener("mouseleave",()=>{prog.style.animationPlayState="running";slider.schedule();});
      const io=new IntersectionObserver((es)=>es.forEach((e)=>{slider.visible=e.isIntersecting; if(e.isIntersecting){ if(!slider._ini){slider._ini=true;slider.go(0);} else slider.schedule(); } else clearTimeout(slider.timer);}),{threshold:.2});
      io.observe(el);
      el._slider=slider;
    }

    function buildGrid(el){
      const cfg=SERIES2[el.dataset.slider]; if(!cfg) return;
      const w=cfg.orient==="h"?1600:1067, h=cfg.orient==="h"?1067:1600;
      el.setAttribute("data-orient",cfg.orient);
      const items=serieItems(cfg);
      const m=document.createElement("div"); m.className="masonry"; m.setAttribute("data-ratio",cfg.orient==="h"?"h":"v");
      cfg.files.forEach((f,i)=>{
        const fig=document.createElement("figure"); fig.className="m-item"; fig.dataset.slider=el.dataset.slider;
        fig.style.aspectRatio=ratioOf(cfg,f);
        if(cfg.bg){ fig.style.background=cfg.bg; fig.dataset.bg=cfg.bg; }
        const img=document.createElement("img"); img.src=cfg.base+f; img.alt=items[i].label; img.width=w; img.height=h; img.loading="lazy"; img.decoding="async";
        if(cfg.sepia) img.classList.add("img-sepia");
        img.onload=()=>img.classList.add("ok"); img.onerror=()=>fig.remove();
        fig.appendChild(img); fig.addEventListener("click",()=>openLightbox(items,i,fig));
        m.appendChild(fig);
      });
      el.innerHTML=""; el.appendChild(m);
    }

    function render(el,grid){ if(el._slider){ el._slider.destroy(); el._slider=null; } el.innerHTML=""; grid?buildGrid(el):buildSlider(el); el._grid=grid; }

    function modeOf(sub){ const ov=sub.dataset.view; return (ov==="grid"||ov==="std")?ov:globalMode(); }
    function syncSub(sub){ const grid=modeOf(sub)==="grid"; sub.classList.toggle("view-grid",grid); const b=sub.querySelector("[data-subview]"); if(b) b.setAttribute("aria-pressed",String(grid)); }
    function renderSubSeries(sub){ sub.querySelectorAll(".serie[data-slider]").forEach(el=>{ const grid=modeOf(sub)==="grid"; if(el._grid!==grid) render(el,grid); }); }
    function applyView(){ document.querySelectorAll(".subserie").forEach(sub=>{ if(!sub.querySelector(".serie[data-slider]")) return; syncSub(sub); if(sub._mounted) renderSubSeries(sub); }); }

    const gm=document.getElementById("gridmodal");
    const gmGrid=document.getElementById("gm-grid"), gmTitle=document.getElementById("gm-title");
    let gmSlider=null;
    function openGrid(slider,items,cfg,last){
      gmSlider=slider; gmTitle.textContent=cfg.title; gmGrid.innerHTML=""; clearTimeout(slider.timer);
      gm.classList.toggle("gm-sepia",!!cfg.sepia);
      items.forEach((it,i)=>{ const b=document.createElement("button"); b.className="mini"+(i===slider.idx?" is-active":""); b.setAttribute("aria-label",it.label); if(cfg.bg) b.style.background=cfg.bg;
        const im=document.createElement("img"); im.src=it.src; im.alt=it.label; im.width=160; im.height=160; im.loading="lazy"; im.decoding="async"; im.onload=()=>im.classList.add("ok"); im.onerror=()=>b.remove();
        b.appendChild(im); b.addEventListener("click",()=>{ slider.go(i); closeGrid(); openLightbox(items,i,last||slider.el); }); gmGrid.appendChild(b); });
      gm.classList.add("is-open"); gm.setAttribute("aria-hidden","false");
    }
    function closeGrid(){ gm.classList.remove("is-open"); gm.setAttribute("aria-hidden","true"); if(gmSlider) gmSlider.schedule(); }
    if(gm){ gm.querySelector("[data-gm-cerrar]").addEventListener("click",closeGrid); gm.querySelector("[data-gm-fondo]").addEventListener("click",closeGrid); }

    const lb=document.getElementById("lightbox"); const lbImg=lb&&lb.querySelector("img");
    let lbItems=[],lbIdx=0,lbLast=null;
    function lbShow(n){ if(!lbItems.length) return; lbIdx=(n+lbItems.length)%lbItems.length; lbImg.src=lbItems[lbIdx].src; lbImg.alt=lbItems[lbIdx].label; }
    function openLightbox(items,i,ret){ lbItems=items; lbLast=ret||document.activeElement; if(gmSlider) clearTimeout(gmSlider.timer); lbImg.style.background=(ret&&ret.dataset&&ret.dataset.bg)||"transparent";
      lb.classList.toggle("lb-sepia",!!(ret&&ret.dataset&&ret.dataset.slider&&ret.dataset.slider.indexOf("dis-encantado")===0));
      lb.classList.add("is-open"); lb.setAttribute("aria-hidden","false"); lbShow(i); lb.querySelector(".lightbox__cerrar").focus(); }
    function closeLightbox(){ lb.classList.remove("is-open"); lb.setAttribute("aria-hidden","true"); lb.classList.remove("lb-sepia"); if(lbLast&&lbLast.focus) lbLast.focus(); }
    if(lb){ lb.querySelector(".lightbox__cerrar").addEventListener("click",closeLightbox); lb.querySelector("[data-lb-fondo]").addEventListener("click",closeLightbox);
      lb.querySelector("[data-lb-prev]").addEventListener("click",()=>lbShow(lbIdx-1)); lb.querySelector("[data-lb-next]").addEventListener("click",()=>lbShow(lbIdx+1)); }
    document.addEventListener("keydown",(e)=>{
      if(gm&&gm.classList.contains("is-open")&&e.key==="Escape"){closeGrid();return;}
      if(!lb||!lb.classList.contains("is-open")) return;
      if(e.key==="Escape") closeLightbox(); else if(e.key==="ArrowLeft") lbShow(lbIdx-1); else if(e.key==="ArrowRight") lbShow(lbIdx+1);
    });

    const subs=[...document.querySelectorAll(".subserie")].filter(s=>s.querySelector(".serie[data-slider]"));
    if("IntersectionObserver" in window){
      const ioBuild=new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ const sub=e.target; sub._mounted=true; renderSubSeries(sub); ioBuild.unobserve(sub);} }),{rootMargin:"400px 0px"});
      subs.forEach(sub=>ioBuild.observe(sub));
    } else { subs.forEach(sub=>{ sub._mounted=true; renderSubSeries(sub); }); }
    subs.forEach(syncSub);

    document.querySelectorAll("[data-subview]").forEach(btn=>{
      btn.addEventListener("click",()=>{ const sub=btn.closest(".subserie"); if(!sub) return;
        sub.dataset.view = (modeOf(sub)==="grid")?"std":"grid"; syncSub(sub); if(sub._mounted) renderSubSeries(sub); });
    });

    const viewBtn=document.getElementById("viewToggle");
    function updateViewBtn(){ if(!viewBtn) return; const grid=globalMode()==="grid"; const dic=I18N[langActual()]||I18N.es;
      viewBtn.setAttribute("aria-pressed",String(grid));
      const lbl=viewBtn.querySelector(".viewbtn__label"); if(lbl) lbl.textContent=grid?dic["view.toStd"]:dic["view.toGrid"];
      viewBtn.setAttribute("aria-label",grid?"Cambiar visualización a carrusel":"Cambiar visualización a mosaico"); }
    window.__updateViewBtn=updateViewBtn;
    /* setView no persiste: al recargar/iniciar siempre arranca en carrusel (std). */
    function setView(v){ html.setAttribute("data-view",v); if(v==="std") closeToc();
      document.querySelectorAll(".subserie").forEach(sub=>{ delete sub.dataset.view; });
      applyView(); updateViewBtn(); }
    if(viewBtn) viewBtn.addEventListener("click",()=>setView(globalMode()==="grid"?"std":"grid"));

    const toTop=document.getElementById("toTop");
    if(toTop){ toTop.addEventListener("click",()=>scrollTo({top:0,behavior:reduce?"auto":"smooth"}));
      const onScroll=()=>{ toTop.classList.toggle("is-on", scrollY>560); };
      addEventListener("scroll",onScroll,{passive:true}); onScroll(); }

    const toc=document.getElementById("toc"), tocScrim=document.getElementById("tocScrim"), tocBtn=document.getElementById("tocBtn"), tocClose=document.getElementById("tocClose"), tocList=document.getElementById("tocList");
    function buildToc(){ if(!tocList) return; const secs=[...document.querySelectorAll("#contenido .seccion")]; tocList.innerHTML="";
      secs.forEach(s=>{ const hid=s.getAttribute("aria-labelledby"); const h=hid&&document.getElementById(hid); if(!h) return; const a=document.createElement("a"); a.href="#"+hid; a.textContent=h.textContent.trim(); a.dataset.target=hid; a.addEventListener("click",(e)=>{e.preventDefault();closeToc();goToId(hid);}); tocList.appendChild(a); }); }
    function setActiveToc(hid){ if(!tocList) return; tocList.querySelectorAll("a").forEach(a=>a.classList.toggle("is-active",a.dataset.target===hid)); }
    function openToc(){ if(!toc||globalMode()!=="grid") return; buildToc(); toc.classList.add("is-open"); toc.setAttribute("aria-hidden","false"); if(tocScrim) tocScrim.classList.add("is-open"); if(tocBtn) tocBtn.setAttribute("aria-expanded","true"); }
    function closeToc(){ if(!toc) return; toc.classList.remove("is-open"); toc.setAttribute("aria-hidden","true"); if(tocScrim) tocScrim.classList.remove("is-open"); if(tocBtn) tocBtn.setAttribute("aria-expanded","false"); }
    if(tocBtn) tocBtn.addEventListener("click",()=>{ toc.classList.contains("is-open")?closeToc():openToc(); });
    if(tocClose) tocClose.addEventListener("click",closeToc);
    if(tocScrim) tocScrim.addEventListener("click",closeToc);
    document.addEventListener("keydown",(e)=>{ if(e.key==="Escape"&&toc&&toc.classList.contains("is-open")) closeToc(); });

    if("IntersectionObserver" in window){
      const secs=[...document.querySelectorAll("#contenido .seccion")];
      const spy=new IntersectionObserver((es)=>{ es.forEach((e)=>{ if(e.isIntersecting){ const hid=e.target.getAttribute("aria-labelledby"); if(hid) setActiveToc(hid); } }); },{rootMargin:"-45% 0px -50% 0px",threshold:0});
      secs.forEach((s)=>spy.observe(s));
    }
  })();

  /* ░░ CLIMA reutilizable (hub + footer) ░░ */
  (function clima(){
    const widgets=[...document.querySelectorAll(".clima[data-clima]")];
    if(!widgets.length) return;

    const UBIS={
      xativa:{nombre:"Xàtiva · Valencia",lat:38.9935,lon:-0.5181},
      valencia:{nombre:"Valencia",lat:39.4699,lon:-0.3763},
      jaraguas:{nombre:"Jaraguas",lat:38.947,lon:-0.928},
      lapobla:{nombre:"La Pobla Llarga",lat:39.2167,lon:-0.5519}
    };

    const TXT={
      es:{carg:"Cargando…",err:"Tiempo no disponible",min:"Mín",max:"Máx",viento:"Viento"},
      en:{carg:"Loading…",err:"Weather unavailable",min:"Min",max:"Max",viento:"Wind"}
    };

    const WMO={
      0:["sol","Despejado","Clear"],1:["sol","Mayormente despejado","Mostly clear"],2:["nube","Parcialmente nublado","Partly cloudy"],3:["nube","Nublado","Overcast"],
      45:["niebla","Niebla","Fog"],48:["niebla","Niebla helada","Rime fog"],
      51:["lluvia","Llovizna ligera","Light drizzle"],53:["lluvia","Llovizna","Drizzle"],55:["lluvia","Llovizna intensa","Dense drizzle"],
      61:["lluvia","Lluvia ligera","Light rain"],63:["lluvia","Lluvia","Rain"],65:["lluvia","Lluvia intensa","Heavy rain"],
      71:["nieve","Nieve ligera","Light snow"],73:["nieve","Nieve","Snow"],75:["nieve","Nieve intensa","Heavy snow"],77:["nieve","Granizo","Grains"],
      80:["lluvia","Chubascos","Showers"],81:["lluvia","Chubascos","Showers"],82:["lluvia","Chubascos fuertes","Violent showers"],
      95:["tormenta","Tormenta","Thunderstorm"],96:["tormenta","Tormenta con granizo","Storm + hail"],99:["tormenta","Tormenta con granizo","Storm + hail"]
    };

    const ICONO={
      sol:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`,
      nube:`<svg viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 19z"/></svg>`,
      niebla:`<svg viewBox="0 0 24 24"><path d="M17.5 15a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 15"/><path d="M4 19h16M7 22h13"/></svg>`,
      lluvia:`<svg viewBox="0 0 24 24"><path d="M17.5 14a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 14"/><path d="M8 18l-1 3M13 18l-1 3M18 18l-1 3"/></svg>`,
      nieve:`<svg viewBox="0 0 24 24"><path d="M17.5 14a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 14"/><path d="M8 18v3M13 18v3M18 18v3"/></svg>`,
      tormenta:`<svg viewBox="0 0 24 24"><path d="M17.5 13a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 6 13"/><path d="M13 15l-3 4h3l-1 4 4-5h-3z"/></svg>`
    };

    let actual="xativa";
    try{
      const stored=localStorage.getItem("climaUbi");
      if(stored && UBIS[stored]) actual=stored;
    }catch(e){}

    let ultimo=null;
    let pid=0;
    const L=()=>html.getAttribute("lang")||"es";
    const url=(u)=>`https://api.open-meteo.com/v1/forecast?latitude=${u.lat}&longitude=${u.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1`;

    const widgetEls=widgets.map((w)=>({
      ico:w.querySelector(".clima__ico"),
      lugar:w.querySelector(".clima__lugar"),
      temp:w.querySelector(".clima__temp"),
      desc:w.querySelector(".clima__desc"),
      meta:w.querySelector(".clima__meta"),
      select:w.querySelector(".clima__select")
    }));

    function pintar(){
      widgetEls.forEach((els)=>{
        if(!els.lugar) return;
        els.lugar.textContent=UBIS[actual].nombre;

        if(!ultimo){
          if(els.ico) els.ico.innerHTML="";
          if(els.temp) els.temp.textContent="–";
          if(els.desc) els.desc.textContent=TXT[L()].err;
          if(els.meta) els.meta.textContent="";
          return;
        }

        const w=WMO[ultimo.code]||["nube","—","—"];
        if(els.ico) els.ico.innerHTML=ICONO[w[0]];
        if(els.temp) els.temp.textContent=Math.round(ultimo.temp)+"°";
        if(els.desc) els.desc.textContent=L()==="en"?w[2]:w[1];
        if(els.meta) els.meta.textContent=`${TXT[L()].min} ${Math.round(ultimo.min)}° · ${TXT[L()].max} ${Math.round(ultimo.max)}° · ${TXT[L()].viento} ${Math.round(ultimo.viento)} km/h`;
      });
    }

    function setUbi(v){
      actual=v;
      widgetEls.forEach((els)=>{ if(els.select) els.select.value=actual; });
      try{ localStorage.setItem("climaUbi",actual); }catch(e){}
      cargar();
    }

    async function cargar(r=1){
      const u=UBIS[actual];
      const id=++pid;
      ultimo=null;

      widgetEls.forEach((els)=>{
        if(els.lugar) els.lugar.textContent=u.nombre;
        if(els.ico) els.ico.innerHTML="";
        if(els.temp) els.temp.textContent="–";
        if(els.desc) els.desc.textContent=TXT[L()].carg;
        if(els.meta) els.meta.textContent="";
      });

      try{
        const res=await fetch(url(u));
        if(!res.ok) throw 0;
        const d=await res.json();
        if(id!==pid) return;

        ultimo={
          temp:d.current.temperature_2m,
          code:d.current.weather_code,
          viento:d.current.wind_speed_10m,
          min:d.daily.temperature_2m_min[0],
          max:d.daily.temperature_2m_max[0]
        };

        pintar();
      }catch(e){
        if(id!==pid) return;
        if(r>0) setTimeout(()=>cargar(r-1),2500);
        else { ultimo=null; pintar(); }
      }
    }

    widgetEls.forEach((els)=>{
      if(!els.select) return;
      els.select.value=actual;
      els.select.addEventListener("change",()=>setUbi(els.select.value));
    });

    new MutationObserver(pintar).observe(html,{attributes:true,attributeFilter:["lang"]});
    cargar();
  })();

  /* ░░ Slider índice (estilo blacknegative): arrastre, cámara y mosaico ░░ */
  (() => {
    const bn = document.querySelector("[data-bn]");
    if (!bn) return;
    const track = bn.querySelector("[data-bn-track]");
    const slides = Array.from(bn.querySelectorAll("[data-bn-slide]"));
    const pags = Array.from(bn.querySelectorAll("[data-bn-to]"));
    const conteo = bn.querySelector("[data-bn-cur]");
    const N = slides.length;
    let i = 0, W = 0, visible = true;

    const setX = (px) => { track.style.transform = "translate3d(" + px + "px,0,0)"; };
    const medir = () => { W = bn.clientWidth; setX(-i * W); };

    let activo = false, sx = 0, sy = 0, axis = "", arrastrando = false;
    let ultimoX = 0, ultimoT = 0, vel = 0, suppress = 0;

    const cam = bn.querySelector("[data-bn-cam]");
    const mos = bn.querySelector("[data-bn-mos]");
    const final = bn.querySelector("[data-bn-final]");
    let camReset = null, mosHecho = false, mosDone = false;

    if (cam) {
      const flou = cam.querySelector("[data-cam-flou]");
      const fondo = cam.querySelector("[data-cam-fondo]");
      const hud = cam.querySelector("[data-cam-hud]");
      const camTop = cam.querySelector(".bn__cam-top");
      const centro = cam.querySelector("[data-cam-centro]");
      const poner = (x, y) => {
        const k = Math.min(1, ((Math.abs(x) + Math.abs(y)) / 2) * 1.6);
        const tr = "translate(" + (x * 30).toFixed(1) + "px," + (y * 20).toFixed(1) + "px)";
        if (flou) { flou.style.opacity = (1 - Math.pow(1 - k, 13)).toFixed(3); flou.style.transform = tr; }
        if (centro) centro.style.opacity = Math.pow(1 - k, 13).toFixed(3);
        if (fondo) fondo.style.transform = tr;
        if (hud) hud.style.transform = "translate(" + (x * 44).toFixed(1) + "px," + (y * 28).toFixed(1) + "px)";
        if (camTop) camTop.style.transform = "translate(" + (x * 44).toFixed(1) + "px," + (y * 28).toFixed(1) + "px)";
      };
      const esTactil = !(window.matchMedia && window.matchMedia("(hover:hover)").matches);
      camReset = () => { poner(0, 0); if (esTactil && centro) centro.style.opacity = "0.85"; };
      if (esTactil) {
        poner(0, 0);
        if (centro) centro.style.opacity = "0.85";
      } else {
        poner(0, 0);
        cam.addEventListener("mousemove", (e) => {
          const r = cam.getBoundingClientRect();
          poner(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
        });
        cam.addEventListener("mouseleave", () => poner(0.6, 0.6));
      }
    }

    const enlazarTema = (sel, tema) => {
      const el = bn.querySelector(sel); if (!el) return;
      const on = () => html.setAttribute("data-tema", tema);
      const off = () => html.setAttribute("data-tema", "index");
      el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off);
      el.addEventListener("focus", on); el.addEventListener("blur", off);
    };
    enlazarTema(".bn__rec", "foto");
    enlazarTema(".bn__cta", "diseno");
    enlazarTema(".bn__cta--video", "video");
    enlazarTema("[data-bn-cta-fab]", "fab");

    const vidSlide = bn.querySelector(".bn__slide--video");
    if (vidSlide) {
      const sonBtn = vidSlide.querySelector("[data-bn-son]");
      const aud = vidSlide.querySelector("audio[data-bn-audio]");
      if (sonBtn && aud) {
        if (reduce) { aud.dataset.mute = "1"; sonBtn.classList.add("is-mute"); sonBtn.setAttribute("aria-pressed", "false"); }
        sonBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (aud.dataset.mute === "1" || aud.paused) {
            aud.dataset.mute = "";
            sonBtn.classList.remove("is-mute");
            sonBtn.setAttribute("aria-pressed", "true");
            if (vidSlide.classList.contains("is-on")) aud.play().catch(() => {});
          } else {
            aud.pause();
            aud.dataset.mute = "1";
            sonBtn.classList.add("is-mute");
            sonBtn.setAttribute("aria-pressed", "false");
          }
        });
      }
    }

    const FILAS = [["D","I","S","E","Ñ","A"], ["I","M","A","G","I","N","A"], ["C","R","E","A"]];
    const GRISES = ["#7d818c", "#555a66"];

    const construirMos = () => {
      if (!mos) return;
      const Wm = mos.clientWidth, Hm = mos.clientHeight;
      if (!Wm || !Hm) return;
      const obj = Wm < 560 ? 56 : Wm < 900 ? 72 : 88;
      const cols = Math.max(8, Math.round(Wm / obj));
      const cel = Wm / cols;
      const filas = Math.max(6, Math.round(Hm / cel));
      mos.style.gridTemplateColumns = "repeat(" + cols + ",1fr)";
      mos.style.gridTemplateRows = "repeat(" + filas + ",1fr)";
      mos.style.setProperty("--cel", cel + "px");
      mos.innerHTML = "";
      const cx = Math.floor(cols / 2), cy = Math.floor(filas / 2);
      const mapa = {};
      FILAS.forEach((fila, fi) => {
        fila.forEach((ch, k) => {
          mapa[(cx + k - Math.floor(fila.length / 2)) + "," + (cy + fi - 1)] = { txt: ch };
        });
      });
      const frag = document.createDocumentFragment();
      for (let r = 0; r < filas; r++) {
        for (let c = 0; c < cols; c++) {
          const d = document.createElement("div");
          d.className = "bn__celda";
          const m = mapa[c + "," + r];
          if (m && m.txt) { d.classList.add("bn__celda--let"); d.textContent = m.txt; }
          else d.style.backgroundColor = GRISES[(Math.random() * GRISES.length) | 0];
          d.style.animationDelay = (Math.random() * 0.5).toFixed(2) + "s";
          frag.appendChild(d);
        }
      }
      mos.appendChild(frag);
      mos.classList.remove("is-out");
      if (final) final.classList.remove("is-on");
      mosDone = false;
      mosHecho = true;
      const celdas = mos.children;
      for (let k = 0; k < celdas.length; k++) {
        const cel = celdas[k];
        let t = 0;
        cel.addEventListener("mouseenter", () => {
          if (mosDone) return;
          clearTimeout(t);
          cel.style.opacity = "0";
        });
        cel.addEventListener("mouseleave", () => {
          if (mosDone) return;
          clearTimeout(t);
          t = setTimeout(() => { cel.style.opacity = ""; }, 600);
        });
      }
      mos.classList.remove("is-in");
      void mos.offsetWidth;
      mos.classList.add("is-in");
    };

    const revelar = () => {
      if (!mos || mosDone) return;
      mosDone = true;
      const celdas = Array.from(mos.children);
      const orden = celdas.map((_, k) => k);
      for (let k = orden.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        const tmp = orden[k]; orden[k] = orden[j]; orden[j] = tmp;
      }
      const paso = Math.max(6, Math.round(1300 / Math.max(1, orden.length)));
      orden.forEach((idx, k) => {
        setTimeout(() => {
          const c = celdas[idx];
          c.style.opacity = "0";
          c.style.backgroundImage = "none";
          c.style.backgroundColor = "transparent";
          c.textContent = "";
        }, paso * k);
      });
      setTimeout(() => {
        mos.classList.add("is-out");
        if (final) final.classList.add("is-on");
      }, paso * orden.length + 350);
    };
    if (mos) mos.addEventListener("click", revelar);

    const activar = () => {
      html.setAttribute("data-tema", "index");
      slides.forEach((s, k) => {
        const on = k === i;
        s.classList.toggle("is-on", on);
        if (on) s.removeAttribute("inert"); else s.setAttribute("inert", "");
        s.setAttribute("aria-hidden", on ? "false" : "true");
        const v = s.querySelector("video[data-bn-video]");
        if (v) { if (on) { v.play().catch(() => {}); } else v.pause(); }
        const a = s.querySelector("audio[data-bn-audio]");
        if (a) { if (on && a.dataset.mute !== "1") { a.play().catch(() => {}); } else a.pause(); }
      });
      pags.forEach((p, k) => p.classList.toggle("is-on", k === i));
      if (conteo) conteo.textContent = String(i + 1).padStart(2, "0");
      if (camReset) camReset();
      if (slides[i].classList.contains("bn__slide--diseno")) construirMos();
    };

    const ir = (n) => {
      n = Math.max(0, Math.min(N - 1, n));
      if (n === i && track.style.transform) return;
      i = n;
      track.style.transition = "transform .65s cubic-bezier(.16,1,.3,1)";
      setX(-i * W);
      activar();
    };

    const finDrag = (dx) => {
      track.style.transition = "transform .65s cubic-bezier(.16,1,.3,1)";
      let n = i;
      if (dx < -W * 0.22 || (dx < -24 && vel > 0.45)) n = i + 1;
      else if (dx > W * 0.22 || (dx > 24 && vel < -0.45)) n = i - 1;
      if (n !== i) { suppress = Date.now(); ir(n); } else setX(-i * W);
    };

    bn.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      activo = true; sx = e.clientX; sy = e.clientY; axis = ""; arrastrando = false;
      ultimoX = e.clientX; ultimoT = e.timeStamp; vel = 0;
    });
    bn.addEventListener("pointermove", (e) => {
      if (!activo) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!axis) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        else return;
      }
      if (axis === "y") return;
      if (!arrastrando) {
        arrastrando = true;
        bn.classList.add("is-drag");
        track.style.transition = "none";
        try { bn.setPointerCapture(e.pointerId); } catch (_) {}
      }
      const dt = e.timeStamp - ultimoT;
      if (dt > 0) vel = (e.clientX - ultimoX) / dt;
      ultimoX = e.clientX; ultimoT = e.timeStamp;
      let d = dx;
      if ((i === 0 && d > 0) || (i === N - 1 && d < 0)) d *= 0.32;
      setX(-i * W + d);
    });
    const soltar = (e) => {
      if (!activo) return;
      activo = false;
      bn.classList.remove("is-drag");
      if (arrastrando) finDrag(e.clientX - sx);
      try { bn.releasePointerCapture(e.pointerId); } catch (_) {}
      axis = ""; arrastrando = false;
    };
    bn.addEventListener("pointerup", soltar);
    bn.addEventListener("pointercancel", soltar);
    bn.addEventListener("click", (e) => {
      if (Date.now() - suppress < 350) { e.stopPropagation(); e.preventDefault(); }
    }, true);

    pags.forEach((p) => p.addEventListener("click", () => ir(Number(p.dataset.bnTo) || 0)));

    document.addEventListener("keydown", (e) => {
      if (!visible || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t && t.closest && t.closest("input,textarea,select,[contenteditable]")) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); ir(i - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); ir(i + 1); }
    });

    let rt = 0;
    window.addEventListener("resize", () => {
      medir();
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (slides[i].classList.contains("bn__slide--diseno")) construirMos();
        else mosHecho = false;
      }, 180);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
      }, { threshold: 0.05 }).observe(bn);
    }

    medir();
    activar();
  })();

  /* ░░ Chatbot del índice: preguntas frecuentes → secciones y subwebs ░░ */
  (() => {
    const root = document.querySelector("[data-bot]");
    if (!root) return;
    const log = root.querySelector("[data-bot-log]");
    const form = root.querySelector("[data-bot-form]");
    const input = root.querySelector("[data-bot-in]");
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const REGLAS = [
      { k:["contacto","contactar","email","correo","escribir","formulario","contratar","contact","reach","hire"],
        t:"Puedes contactar conmigo desde el botón «Contacto» de la cabecera o desde el pie de página: allí tienes mi correo (salllaiva@alu.edu.gva.es) y un formulario rápido.",
        tEn:"You can reach me from the «Contact» button in the header or from the footer: my email (salllaiva@alu.edu.gva.es) and a quick form are there.",
        b:[["mailto:salllaiva@alu.edu.gva.es","Enviar email","Send email"]] },
      { k:["photoshop","illustrator","indesign","acrobat","lightroom","premiere","audition","paquete adobe","adobe"],
        t:"Sí, manejo el paquete Adobe completo: Photoshop, Illustrator, InDesign, Acrobat, Premiere, Audition y Lightroom. La evidencia está en mi obra de diseño gráfico y en mi trabajo fotográfico.",
        tEn:"Yes, I use the full Adobe suite: Photoshop, Illustrator, InDesign, Acrobat, Premiere, Audition and Lightroom. The proof is in my graphic design work and my photography.",
        b:[["diseno.html","Ver diseño","See design"],["fotografia.html","Ver fotografía","See photography"]] },
      { k:["fotograf","camara","luz","retrato","paisaje","bodegon","lightroom","photo","camera"],
        t:"Formé mi criterio fotográfico en la EASD de València y trabajé en encargos para la ETSID de la UPV: paisaje, arquitectura, reportaje, moda, bodegón y retrato. Puedes verlo en la subweb de fotografía, incluida la sección de herramientas.",
        tEn:"I trained my eye at the EASD de València and worked on commissions for the ETSID at the UPV: landscape, architecture, reportage, fashion, still life and portrait. You can see it in the photography sub-site, including the tools section.",
        b:[["fotografia.html","Ver fotografía","See photography"],["fotografia.html#t-tools","Herramientas","Tools"]] },
      { k:["catia","autocad","inventor","mecanic","fabricac","matrices","moldes","geinprod","delineante","stacking","plano","cad"],
        t:"Sí: más de cinco años en Weidner Ibérica diseñando stacking columns con CATIA V5, planimetría y gestión de fabricación con el ERP Geinprod (además de Inventor). El detalle está en Sobre mí; la subweb de mecánica aún está en preparación.",
        tEn:"Yes: over five years at Weidner Ibérica designing stacking columns with CATIA V5, drafting and manufacturing management with the Geinprod ERP (plus Inventor). The details are in About me; the machining sub-site is still under preparation.",
        b:[["#t-sobre","Ver en Sobre mí","See in About me"]] },
      { k:["diseñ","disen","grafic","editorial","identidad","logo","folio","poster","portfolio","ilustr","dibujo","design"],
        t:"Sí: diseño gráfico y editorial (retícula, identidad, catálogos, folletos, pósters) con Illustrator e InDesign, aplicado en proyectos reales como Weidner Ibérica y SEF UV. Toda la obra está en la subweb de diseño.",
        tEn:"Yes: graphic and editorial design (grid, identity, catalogues, brochures, posters) with Illustrator and InDesign, applied on real projects like Weidner Ibérica and SEF UV. All the work is in the design sub-site.",
        b:[["diseno.html","Ver diseño","See design"],["diseno.html#sub-identidad","Identidad","Identity"],["diseno.html#sub-posters","Pósters","Posters"]] },
      { k:["program","codigo","html","css","javascript","python","java","android","dam","git","base de datos","videojuego","simon","code","programming"],
        t:"Actualmente curso el CFGS de DAM: programación, bases de datos, Git/GitHub, Figma y fundamentos de IA. La sección DAM de la web está en preparación; mientras tanto, el resumen está en Sobre mí.",
        tEn:"I am currently studying the DAM higher degree: programming, databases, Git/GitHub, Figma and AI fundamentals. The DAM section of the site is under construction; meanwhile, the summary is in About me.",
        b:[["#t-sobre","Ver en Sobre mí","See in About me"]] },
      { k:["video","montaje","edicion","postproduccion","cortometraje","reel"],
        t:"Edición de vídeo con Premiere y audio con Audition (reels, cortometrajes y podcasts para Interpreta Natura). Toda la obra —MissR, ECO, ARTE y más— está en la subweb de vídeo y música.",
        tEn:"Video editing with Premiere and audio with Audition (reels, short films and podcasts for Interpreta Natura). All the work —MissR, ECO, ARTE and more— is in the video & music sub-site.",
        b:[["video.html","Ver vídeo y música","See video & music"],["video.html#sub-video","Ver obra","See work"]] },
      { k:["musica","audio","garageband","banda sonora","podcast","cancion","music"],
        t:"Creo música con GarageBand: bandas sonoras para Mis piezas, MissR, ECO y ARTE, además de podcasts para Interpreta Natura. Puedes escucharlas en la subweb de vídeo y música.",
        tEn:"I create music with GarageBand: soundtracks for my own pieces, MissR, ECO and ARTE, plus podcasts for Interpreta Natura. You can listen to them in the video & music sub-site.",
        b:[["video.html#sub-musica","Escuchar música","Listen to music"],["video.html","Ver vídeo y música","See video & music"]] },
      { k:["quien","salvador","sobre mi","perfil","cv","experiencia","formacion","resumen","who"],
        t:"Salvador Llácer Ivars, técnico superior multidisciplinar de Valencia: fotografía, diseño gráfico/editorial, fabricación mecánica (CATIA) y DAM en curso, con experiencia en Weidner Ibérica e Interpreta Natura. Tienes el resumen completo en Sobre mí.",
        tEn:"Salvador Llácer Ivars, multidisciplinary higher technician from Valencia: photography, graphic/editorial design, mechanical manufacturing (CATIA) and DAM in progress, with experience at Weidner Ibérica and Interpreta Natura. The full summary is in About me.",
        b:[["#t-sobre","Leer Sobre mí","Read About me"]] },
      { k:["hola","buenas","buenos dias","que tal","hey","hello","hi"],
        t:"¡Hola! Soy el asistente del portfolio de Salvador. Pregúntame por software (Photoshop, CATIA…), disciplinas o por dónde ver su obra.",
        tEn:"Hello! I am Salvador's portfolio assistant. Ask me about software (Photoshop, CATIA…), disciplines or where to see his work." },
      { k:["gracias","genial","perfecto","thanks","great"],
        t:"¡A ti! Si quieres, pregunta por alguna habilidad concreta o te llevo directo a la subweb que te interese.",
        tEn:"You're welcome! If you like, ask about a specific skill and I'll take you straight to the sub-site you're interested in." }
    ];
    const FALLBACK = { t:"No tengo una respuesta para eso todavía. Puedo ayudarte con sus habilidades (Adobe, CATIA, programación, fotografía, música…), contarte quién es o llevarte a las subwebs.",
      tEn:"I don't have an answer for that yet. I can help with his skills (Adobe, CATIA, programming, photography, music…), tell you who he is, or take you to the sub-sites.",
      b:[["fotografia.html","Ver fotografía","See photography"],["diseno.html","Ver diseño","See design"],["#t-sobre","Sobre mí","About me"]] };
    const buscar = (q) => { const n = norm(q); for (const r of REGLAS) if (r.k.some((k) => n.includes(norm(k)))) return r; return FALLBACK; };
    const addMsg = (quien, txt, btns) => {
      const m = document.createElement("div");
      m.className = "bot__msg bot__msg--" + quien;
      const p = document.createElement("span");
      p.textContent = txt;
      m.appendChild(p);
      if (btns && btns.length) {
        const wrap = document.createElement("span");
        wrap.className = "bot__btns";
        btns.forEach(([h, t, tEn]) => {
          const a = document.createElement("a");
          a.className = "bot__ir";
          a.href = h;
          a.textContent = (langActual() === "en" && tEn) ? tEn : t;
          wrap.appendChild(a);
        });
        m.appendChild(wrap);
      }
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
    };
    const responder = (q) => {
      addMsg("yo", q);
      const r = buscar(q);
      const en = langActual() === "en";
      setTimeout(() => addMsg("bot", en && r.tEn ? r.tEn : r.t, r.b), 320);
    };
    const SALUDO = { t:"¡Hola! Soy el asistente del portfolio de Salvador Llácer. Pregúntame si maneja alguna herramienta (Photoshop, CATIA, código…) o dime qué quieres ver y te llevo a la sección adecuada.",
      tEn:"Hello! I am Salvador Llácer's portfolio assistant. Ask me about any tool he uses (Photoshop, CATIA, code…) or tell me what you want to see and I'll take you to the right section." };
    const en0 = langActual() === "en";
    addMsg("bot", en0 && SALUDO.tEn ? SALUDO.tEn : SALUDO.t);
    if (form) form.addEventListener("submit", (e) => { e.preventDefault(); const q = input.value.trim(); if (!q) return; input.value = ""; responder(q); });
    root.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => {
      const en = langActual() === "en";
      responder(en && b.dataset.qEn ? b.dataset.qEn : b.dataset.q);
    }));
  })();

  /* ░░ Widget consejo (índice): Advice Slip API ░░ */
  (() => {
    const root = document.querySelector("[data-consejo]");
    if (!root) return;
    const cita = root.querySelector("[data-consejo-cita]");
    const btn = root.querySelector("[data-consejo-btn]");
    const dic = () => I18N[langActual()] || I18N.es;
    let cargando = false;
    const pedir = async () => {
      if (cargando) return;
      cargando = true;
      cita.classList.remove("is-err");
      cita.textContent = dic()["consejo.carga"];
      try {
        const r = await fetch("https://api.adviceslip.com/advice", { cache: "no-store" });
        if (!r.ok) throw 0;
        const d = await r.json();
        cita.textContent = d.slip && d.slip.advice ? d.slip.advice : dic()["consejo.error"];
        if (!(d.slip && d.slip.advice)) cita.classList.add("is-err");
      } catch (e) {
        cita.textContent = dic()["consejo.error"];
        cita.classList.add("is-err");
      } finally { cargando = false; }
    };
    if (btn) btn.addEventListener("click", pedir);
    pedir();
  })();

  /* ░░ Toggle del panel flotante del asistente (chatbot en subwebs + índice) ░░ */
  (() => {
    const panel = document.querySelector("[data-bot]");
    if (!panel || !panel.classList.contains("bot--fab")) return;
    const toggles = document.querySelectorAll("[data-bot-toggle]");
    const closeBtn = panel.querySelector("[data-bot-close]");
    const setOpen = (open) => {
      panel.classList.toggle("is-open", open);
      toggles.forEach((t) => { t.setAttribute("aria-expanded", open ? "true" : "false"); t.setAttribute("aria-label", open ? "Cerrar asistente" : "Abrir asistente"); });
    };
    toggles.forEach((t) => t.addEventListener("click", () => setOpen(!panel.classList.contains("is-open"))));
    if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("is-open")) setOpen(false); });
  })();

  /* ░░ Widget inspiración (fotografía): Unsplash API ░░ */
  (() => {
    const root = document.querySelector("[data-inspo]");
    if (!root) return;
    const grid = root.querySelector("[data-inspo-grid]");
    const btn = root.querySelector("[data-inspo-btn]");
    const chips = [...root.querySelectorAll("[data-inspo-q]")];
    const dic = () => I18N[langActual()] || I18N.es;
    let q = "landscape", cargando = false;
    const pintar = (fotos) => {
      grid.textContent = "";
      fotos.forEach((f) => {
        const fig = document.createElement("figure");
        fig.className = "inspo__fig";
        const img = document.createElement("img");
        img.src = f.url;
        img.alt = f.alt;
        img.loading = "lazy";
        img.decoding = "async";
        img.width = 400; img.height = 533;
        const cap = document.createElement("figcaption");
        const nombre = document.createElement("span");
        nombre.textContent = "Picsum";
        const enlace = document.createElement("a");
        enlace.href = f.page;
        enlace.target = "_blank"; enlace.rel = "noopener";
        enlace.textContent = "Unsplash";
        cap.appendChild(nombre); cap.appendChild(enlace);
        fig.appendChild(img); fig.appendChild(cap);
        grid.appendChild(fig);
      });
    };
    const pedir = async () => {
      if (cargando) return;
      cargando = true;
      grid.textContent = "";
      const e = document.createElement("p");
      e.className = "inspo__estado";
      e.setAttribute("data-inspo-estado", "");
      e.textContent = dic()["f.inspo.carga"];
      grid.appendChild(e);
      try {
        const r = await fetch("https://picsum.photos/v2/list?page=1&limit=30", { cache: "no-store" });
        if (!r.ok) throw 0;
        const d = await r.json();
        if (!Array.isArray(d) || !d.length) throw 0;
        const mezcla = d.slice().sort(() => Math.random() - 0.5).slice(0, 6);
        pintar(mezcla.map((f) => ({
          url: "https://picsum.photos/id/" + f.id + "/400/533",
          alt: q,
          page: f.download_url || "https://picsum.photos"
        })));
      } catch (err) {
        grid.textContent = "";
        const e2 = document.createElement("p");
        e2.className = "inspo__estado";
        e2.textContent = dic()["f.inspo.error"];
        grid.appendChild(e2);
      } finally { cargando = false; }
    };
    chips.forEach((c) => c.addEventListener("click", () => {
      chips.forEach((x) => x.classList.toggle("is-on", x === c));
      q = c.dataset.inspoQ;
      pedir();
    }));
    if (btn) btn.addEventListener("click", pedir);
    pedir();
  })();

  /* ░░ Widget lab (diseño): specimens Google Fonts ░░ */
  (() => {
    const root = document.querySelector("[data-lab-fonts]");
    if (!root) return;
    const input = document.querySelector("[data-lab-input]");
    const FUENTES = [
      { fam: "Playfair Display", css: "'Playfair Display', serif" },
      { fam: "Bebas Neue", css: "'Bebas Neue', sans-serif" },
      { fam: "Archivo", css: "'Archivo', sans-serif" },
      { fam: "DM Serif Display", css: "'DM Serif Display', serif" },
      { fam: "Oswald", css: "'Oswald', sans-serif" },
      { fam: "Lora", css: "'Lora', serif" }
    ];
    const pintar = () => {
      const t = input && input.value.trim() ? input.value.trim() : "El veloz murciélago hindú comía feliz cardillo y kiwi.";
      root.textContent = "";
      FUENTES.forEach((f) => {
        const box = document.createElement("div");
        box.className = "lab__spec";
        const n = document.createElement("span");
        n.className = "lab__spec-n";
        n.textContent = f.fam;
        const p = document.createElement("span");
        p.className = "lab__spec-t";
        p.style.fontFamily = f.css;
        p.textContent = t;
        box.appendChild(n); box.appendChild(p);
        root.appendChild(box);
      });
    };
    if (input) input.addEventListener("input", pintar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pintar);
    else pintar();
    pintar();
  })();

  window.__pausaMusica = null;
  /* ░░ Reproductor de playlists (vídeo y música) ░░ */
  (() => {
    const LISTAS = {
      personal: [
        ["musica/Personal/Bokeh.m4a", "Bokeh"],
        ["musica/Personal/Esperanza .m4a", "Esperanza"],
        ["musica/Personal/Fortuna.m4a", "Fortuna"],
        ["musica/Personal/Impasse.m4a", "Impasse"],
        ["musica/Personal/Jardín.m4a", "Jardín"],
        ["musica/Personal/Lar.m4a", "Lar"],
        ["musica/Personal/Lluvia en otoño.m4a", "Lluvia en otoño"],
        ["musica/Personal/Musgarium.m4a", "Musgarium"]
      ],
      rrr: [
        ["musica/rrr/Alimento 2.m4a", "Alimento 2"],
        ["musica/rrr/Banqueta.m4a", "Banqueta"],
        ["musica/rrr/Camiseta 3.m4a", "Camiseta 3"],
        ["musica/rrr/Jabón 2.m4a", "Jabón 2"],
        ["musica/rrr/Lego.m4a", "Lego"],
        ["musica/rrr/Luca mas tempo.m4a", "Luca mas tempo"],
        ["musica/rrr/Palet  final 2.m4a", "Palet final 2"],
        ["musica/rrr/Spacetroid mod.m4a", "Spacetroid mod"]
      ],
      eco: [
        ["musica/eco/Eco agricultura.m4a", "Eco agricultura"],
        ["musica/eco/Eco etiqueta.m4a", "Eco etiqueta"],
        ["musica/eco/Eco experiencia.m4a", "Eco experiencia"],
        ["musica/eco/Eco final.m4a", "Eco final"],
        ["musica/eco/Eco i la dona.m4a", "Eco i la dona"],
        ["musica/eco/Eco i paraules.m4a", "Eco i paraules"],
        ["musica/eco/Eco inicio (1).m4a", "Eco inicio (1)"],
        ["musica/eco/Eco inicio.m4a", "Eco inicio"],
        ["musica/eco/Eco ramaderia.m4a", "Eco ramaderia"],
        ["musica/eco/Eco tenda.m4a", "Eco tenda"]
      ],
      arte: [
        ["musica/arte/Arte 1n.m4a", "Arte 1n"],
        ["musica/arte/Arte 2n.m4a", "Arte 2n"],
        ["musica/arte/Arte 3n.m4a", "Arte 3n"],
        ["musica/arte/Arte 4n.m4a", "Arte 4n"],
        ["musica/arte/Arte 5n.m4a", "Arte 5n"],
        ["musica/arte/Arte 6n.m4a", "Arte 6n"],
        ["musica/arte/Arte 7n.m4a", "Arte 7n"],
        ["musica/arte/Arte 8n.m4a", "Arte 8n"],
        ["musica/arte/Arte 9n.m4a", "Arte 9n"],
        ["musica/arte/Arte 10n.m4a", "Arte 10n"]
      ]
    };
    const fmt = (s) => { if (!isFinite(s) || s < 0) return "0:00"; const m = Math.floor(s / 60), x = Math.floor(s % 60); return m + ":" + String(x).padStart(2, "0"); };
    let sonando = null;
  window.__pausaMusica = () => { if (sonando && sonando.audio && !sonando.audio.paused) { sonando.audio.pause(); sonando.rep.classList.remove("is-playing"); } };
    document.querySelectorAll(".repro[data-repro]").forEach((rep) => {
      const tracks = LISTAS[rep.dataset.playlist] || [];
      const audio = rep.querySelector("[data-repro-audio]");
      const btnPlay = rep.querySelector("[data-repro-play]");
      const btnPrev = rep.querySelector("[data-repro-prev]");
      const btnNext = rep.querySelector("[data-repro-next]");
      const tit = rep.querySelector("[data-repro-tit]");
      const cur = rep.querySelector("[data-repro-cur]");
      const dur = rep.querySelector("[data-repro-dur]");
      const bar = rep.querySelector("[data-repro-bar]");
      const fill = rep.querySelector("[data-repro-fill]");
      const lista = rep.querySelector("[data-repro-lista]");
      if (!audio || !btnPlay || !tracks.length) return;
      let idx = -1;
      const marcar = () => { if (lista) lista.querySelectorAll("button").forEach((b, k) => b.classList.toggle("is-on", k === idx)); };
      const arrancar = () => {
        if (sonando && sonando.audio !== audio) { sonando.audio.pause(); sonando.rep.classList.remove("is-playing"); }
        sonando = { audio, rep };
        return audio.play().then(() => true, () => { rep.classList.remove("is-playing"); return false; });
      };
      const cargar = (k, darPlay) => {
        idx = ((k % tracks.length) + tracks.length) % tracks.length;
        audio.src = tracks[idx][0];
        if (tit) tit.textContent = tracks[idx][1];
        marcar();
        if (darPlay) arrancar();
      };
      if (lista) {
        tracks.forEach((tr, k) => {
          const li = document.createElement("li");
          const b = document.createElement("button");
          b.type = "button";
          const n = document.createElement("span"); n.className = "repro__lista-n"; n.textContent = String(k + 1).padStart(2, "0");
          const t = document.createElement("span"); t.textContent = tr[1];
          b.appendChild(n); b.appendChild(t);
          b.addEventListener("click", () => cargar(k, true));
          li.appendChild(b);
          lista.appendChild(li);
        });
      }
      btnPlay.addEventListener("click", () => {
        if (!audio.src) { cargar(0, true); return; }
        if (audio.paused) arrancar(); else audio.pause();
      });
      if (btnPrev) btnPrev.addEventListener("click", () => cargar(idx - 1, true));
      if (btnNext) btnNext.addEventListener("click", () => cargar(idx + 1, true));
      audio.addEventListener("play", () => rep.classList.add("is-playing"));
      audio.addEventListener("pause", () => rep.classList.remove("is-playing"));
      audio.addEventListener("timeupdate", () => {
        const p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        if (fill) fill.style.width = p.toFixed(2) + "%";
        if (bar) bar.setAttribute("aria-valuenow", String(Math.round(p)));
        if (cur) cur.textContent = fmt(audio.currentTime);
      });
      audio.addEventListener("loadedmetadata", () => { if (dur) dur.textContent = fmt(audio.duration); });
      audio.addEventListener("ended", () => cargar(idx + 1, true));
      if (bar) {
        bar.addEventListener("click", (e) => {
          if (!audio.duration) return;
          const r = bar.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
          audio.currentTime = p * audio.duration;
        });
        bar.addEventListener("keydown", (e) => {
          if (!audio.duration) return;
          if (e.key === "ArrowRight") { e.preventDefault(); audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); audio.currentTime = Math.max(0, audio.currentTime - 5); }
        });
      }
      cargar(0, false);
      if (rep.dataset.autoplay) {
        const k = tracks.findIndex((t) => t[1] === rep.dataset.autoplay);
        cargar(k >= 0 ? k : 0, false);
        arrancar().then((ok) => {
          if (ok) return;
          const soltar = () => {
            document.removeEventListener("pointerdown", gesto);
            document.removeEventListener("keydown", gesto);
            audio.removeEventListener("play", soltar);
          };
          const gesto = (e) => {
            if (e && e.type === "pointerdown" && rep.contains(e.target)) return;
            soltar();
            arrancar();
          };
          document.addEventListener("pointerdown", gesto);
          document.addEventListener("keydown", gesto);
          audio.addEventListener("play", soltar);
        });
      }
    });
  })();

  /* ░░ Widget Last.fm (vídeo y música) ░░ */
  (() => {
    const root = document.querySelector("[data-lastfm]");
    if (!root) return;
    const grid = root.querySelector("[data-lastfm-grid]");
    const dic = () => I18N[langActual()] || I18N.es;
    const LASTFM_KEY = "98b1049b6143764f87f00e6457d05710";
    const LASTFM_USER = "Feristan24";
    const estado = (txt) => {
      grid.textContent = "";
      const e = document.createElement("li");
      e.className = "lastfm__estado";
      e.textContent = txt;
      grid.appendChild(e);
    };
    const pintar = (artistas) => {
      grid.textContent = "";
      const esEn = langActual() === "en";
      artistas.forEach((a) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.className = "lastfm__item";
        link.href = a.url || "https://www.last.fm";
        link.target = "_blank"; link.rel = "noopener";
        const imgs = (a.image || []).filter((x) => x && x["#text"]);
        if (imgs.length) {
          const img = document.createElement("img");
          img.className = "lastfm__img";
          img.src = imgs[imgs.length - 1]["#text"];
          img.alt = a.name || "Last.fm";
          img.loading = "lazy"; img.decoding = "async";
          img.width = 200; img.height = 200;
          link.appendChild(img);
        }
        const info = document.createElement("span");
        info.className = "lastfm__info";
        const name = document.createElement("span");
        name.className = "lastfm__name";
        name.textContent = a.name || "";
        const plays = document.createElement("span");
        plays.className = "lastfm__plays";
        const n = Number(a.playcount || 0);
        plays.textContent = n.toLocaleString(esEn ? "en-US" : "es-ES") + " " + (esEn ? "plays" : "reproducciones");
        info.appendChild(name); info.appendChild(plays);
        link.appendChild(info);
        li.appendChild(link);
        grid.appendChild(li);
      });
    };
    const pedir = async () => {
      if (!LASTFM_KEY || !LASTFM_USER) { estado(dic()["v.lastfm.vacio"]); return; }
      estado(dic()["v.lastfm.carga"]);
      try {
        const url = "https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=" + encodeURIComponent(LASTFM_USER) + "&api_key=" + encodeURIComponent(LASTFM_KEY) + "&limit=8&format=json";
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) throw 0;
        const d = await r.json();
        const lista = d.topartists && d.topartists.artist;
        if (!lista || !lista.length) { estado(dic()["v.lastfm.sin_datos"]); return; }
        pintar(lista);
      } catch (e) {
        estado(dic()["v.lastfm.vacio"]);
      }
    };
    pedir();
  })();

  /* ░░ Vídeos YouTube: IFrame Player API (click-to-play) ░░ */
  (() => {
    const esFile = location.protocol === "file:";
    let apiOk = false;
    const cola = [];
    window.onYouTubeIframeAPIReady = () => { apiOk = true; cola.forEach((f) => f()); cola.length = 0; };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    const cuandoApi = (f) => { if (apiOk) f(); else cola.push(f); };
    const reproducir = (caja, id, titulo) => {
      if (esFile) { window.open("https://www.youtube.com/watch?v=" + id, "_blank", "noopener"); return; }
      cuandoApi(() => {
        const div = document.createElement("div");
        div.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
        caja.textContent = "";
        caja.appendChild(div);
        new YT.Player(div, {
          videoId: id,
          playerVars: { playsinline: 1, rel: 0 },
          events: { onReady: (e) => { if (window.__pausaMusica) window.__pausaMusica(); e.target.playVideo(); if (titulo) e.target.getIframe().title = titulo; } }
        });
      });
    };
    document.querySelectorAll(".yt--dest[data-yt]").forEach((caja) => {
      const btn = caja.querySelector(".yt__play");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const id = caja.dataset.yt;
        const t = (caja.querySelector(".yt__poster") || {}).alt || "YouTube";
        reproducir(caja, id, t);
      }, { once: true });
    });
    const ico = document.createElement("span");
    ico.className = "ytc__play";
    ico.setAttribute("aria-hidden", "true");
    ico.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>';
    document.querySelectorAll("a.ytc[data-yt]").forEach((a) => {
      const thumb = a.querySelector(".ytc__thumb");
      if (thumb) thumb.appendChild(ico.cloneNode(true));
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        const id = a.dataset.yt;
        const t = (a.querySelector(".ytc__t") || {}).textContent || "YouTube";
        if (!thumb || thumb.dataset.on) return;
        thumb.dataset.on = "1";
        reproducir(thumb, id, t);
      });
    });
  })();

  /* Favicon dinámico según tema (logo3 relleno + fondo por sección) */
  (() => {
    const link = document.querySelector('link[rel="icon"]');
    if (!link) return;
    const paths = [
      "M192.39,151.33V12.33l13.82,1.18c2.98,7.65,3.27,21.19,6.43,28.07.7,1.53.99,1.79,2.5,2.5,6.54,3.05,17.45,4.07,24.55,7.1l22.17-21.83,28.33,16.17c1.65,2.79-7.81,26.36-8.47,31.33l17.62,19.01,28.81-8.38c1.31-.44,1.81.05,2.72.85,2.13,1.89,15.55,26.39,15.5,28.53l-22.78,23.11c3.05,5.98,3.38,18.47,6,23.67,2.19,4.34,27.03,5.65,30.33,8.67,2.99,2.73,1.39,29.44.39,34.94l-30.91,7.84-5.86,24.55,22.83,22.17c-1.52,4-3.22,8.04-5.17,11.85-1.48,2.9-8.51,15.1-10.33,16.68-1.53,1.33-1.93.99-3.7.8-5.17-.54-24.71-8.97-27.33-8.57l-17.34,18.44c-1.55,4.59,7.02,23.02,7.72,29.08.16,1.36.06,1.71-.76,2.79-1.52,2.01-25.32,16.33-27.68,16.46-1.46.08-1.86-.31-2.96-.96-4.97-2.94-16.44-20.02-20.15-20.91l-25.6,6.82-7.15,30.08-13.55,1.95v-215ZM295.39,169.33c-7.22-43.42-41.3-81.59-85-90v47.5c18.37,8.02,33.31,22.93,39,42.5h46ZM295.39,209.33h-45.5c-7.2,17.92-20.29,35.2-39.5,41v49c43.76-8.92,77.91-46.15,85-90Z",
      "M174.17,355.16c-29.6-2.2-57.81-11.04-82.5-27.6C32.58,287.92,6.64,215.16,24.68,146.12,42.37,78.38,104.02,27.74,174.17,24.44v-12.1C64.61,18.79-11.24,120.56,11.06,228.17c15.75,76.01,84.95,136.58,163.11,138.02v-11.03Z",
      "M174.17,314.19c-84.03-4.85-137.94-89.57-108.54-169.12,16.56-44.82,60.77-77.3,108.54-79.61V31.37C72.01,37.81,3.78,137.28,32.45,235.78c18.44,63.35,75.84,108.68,141.72,111.99v-33.58Z",
      "M174.17,290.2c-69.14-4.04-112.31-76.64-85.24-140.83,14.12-33.48,48.65-58.39,85.24-59.95v-13.93c-51.2,3.39-94.96,40.89-104.51,91.62-13,69.11,34.74,132.42,104.51,137.09v-14Z",
      "M174.17,274.71c-27.44-1.53-54.39-19.49-67.3-43.35-29.6-54.69,5.94-121.61,67.3-125.88v-8.88c-19.33,2.32-37.66,8.69-52.79,21.23-64.18,53.19-29.45,159.63,52.79,165.4v-8.52Z"
    ];
    const COL = {
      "": ["#e8ebf3", "#0a0a0c"],
      "index": ["#e8ebf3", "#0a0a0c"],
      "foto": ["#a06f3a", "#161411"],
      "diseno": ["#19b6d6", "#e0118a"],
      "video": ["#2ee6ff", "#b026ff"],
      "fab": ["#f97316", "#1e293b"]
    };
    const uri = (fg, bg) => {
      const body = paths.map((d) => '<path fill="' + fg + '" d="' + d + '"/>').join("");
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 368 378.59"><rect width="368" height="378.59" fill="' + bg + '"/>' + body + "</svg>";
      return "data:image/svg+xml," + encodeURIComponent(svg);
    };
    const apply = () => {
      const t = html.getAttribute("data-tema") || "";
      const c = COL[t] || COL[""];
      link.href = uri(c[0], c[1]);
    };
    apply();
    new MutationObserver(apply).observe(html, { attributes: true, attributeFilter: ["data-tema"] });
  })();

  /* Pantalla de carga de entrada (solo index, solo primera visita) */
  (() => {
    const carga = document.getElementById("carga");
    if (!carga) return;
    const fill = document.getElementById("carga-fill");
    const cta = document.getElementById("carga-cta");
    const logo = carga.querySelector(".carga__logo");
    const temas = [...carga.querySelectorAll(".carga__tema")];
    const reduced = reduce;
    const KEY = "miweb-carga-ok";
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch (_) {}

    const introAud = document.querySelector(".bn__slide--intro audio[data-bn-audio]");
    const playIntro = () => {
      if (introAud && introAud.paused && introAud.dataset.mute !== "1") introAud.play().catch(() => {});
    };

    if (seen) {
      carga.remove();
      const gestoIntro = () => { playIntro(); document.removeEventListener("pointerdown", gestoIntro); document.removeEventListener("keydown", gestoIntro); };
      document.addEventListener("pointerdown", gestoIntro);
      document.addEventListener("keydown", gestoIntro);
      return;
    }

    const total = reduced ? 0 : 1600;
    const flash = reduced ? 0 : 520;
    let done = false;

    const COL = {
      index: ["#e8ebf3", "#8088a4"],
      foto: ["#a06f3a", "#d4a574"],
      diseno: ["#19b6d6", "#e0118a"],
      video: ["#2ee6ff", "#b026ff"],
      fab: ["#f97316", "#fb923c"]
    };
    const BAR = [
      ["#a06f3a", "#d4a574"],
      ["#19b6d6", "#e0118a"],
      ["#2ee6ff", "#b026ff"],
      ["#f97316", "#fb923c"]
    ];
    const setLogo = (k) => {
      if (!logo) return;
      const c = COL[k] || COL.index;
      logo.style.background = "linear-gradient(135deg," + c[0] + "," + c[1] + ")";
    };
    const setBar = (p) => {
      if (!fill) return;
      fill.style.width = (p * 100).toFixed(1) + "%";
      const b = BAR[Math.min(3, Math.floor(p * 4))];
      fill.style.background = "linear-gradient(90deg," + b[0] + "," + b[1] + ")";
    };

    const finish = () => {
      if (done) return; done = true;
      try { sessionStorage.setItem(KEY, "1"); } catch (_) {}
      playIntro();
      html.removeAttribute("data-carga");
      carga.classList.add("is-ocultando");
      setTimeout(() => carga.remove(), reduced ? 0 : 520);
    };

    html.setAttribute("data-carga", "1");
    setLogo("index");
    playIntro();
    const gestoIntro = () => { playIntro(); document.removeEventListener("pointerdown", gestoIntro); document.removeEventListener("keydown", gestoIntro); };
    document.addEventListener("pointerdown", gestoIntro);
    document.addEventListener("keydown", gestoIntro);

    if (reduced) {
      setBar(1);
      if (cta) { cta.classList.add("is-on"); cta.focus(); }
    } else {
      const start = performance.now();
      const tick = (now) => {
        if (done) return;
        const p = Math.min(1, (now - start) / total);
        setBar(p);
        if (p < 1) { requestAnimationFrame(tick); return; }
        const seq = ["foto", "diseno", "video", "fab"];
        seq.forEach((k, j) => setTimeout(() => {
          if (done) return;
          if (temas[j]) temas[j].classList.add("is-on");
          setLogo(k);
        }, j * flash));
        const finSeq = seq.length * flash;
        const rapido = ["foto", "diseno", "video", "fab", "foto", "diseno", "video", "fab"];
        rapido.forEach((k, j) => setTimeout(() => { if (!done) setLogo(k); }, finSeq + j * 130));
        setTimeout(() => {
          if (done) return;
          setLogo("index");
          if (cta) { cta.classList.add("is-on"); cta.focus(); }
        }, finSeq + rapido.length * 130 + 120);
      };
      requestAnimationFrame(tick);
    }

    carga.addEventListener("click", finish);
    document.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { if (!done) { e.preventDefault(); finish(); } } });
  })();
});
