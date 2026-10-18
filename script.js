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
    es:{ "m.inicio":"Inicio","m.foto":"Foto","m.diseno":"Diseño","m.video":"Vídeo","m.musica":"Música","m.dam":"DAM","m.mec":"Mecánica","m.contacto":"Contacto",
      "sec.sobre":"Sobre mí","sec.obra":"Obra","sec.form":"Formación","sec.tools":"Herramientas","sec.exp":"Experiencia","sec.comp":"Competencias","sec.ref":"Referentes",
      "sub.paisaje":"Paisaje","sub.robados":"Robados","sub.personal":"Visión personal","sub.bodegon":"Bodegón publicitario","sub.moda":"Moda","sub.retrato":"Retrato","sub.etsid":"ETSID · UPV","sub.casos":"Casos de proyecto","sub.bodas":"Bodas y eventos",
      "sub.posters":"Pósters","sub.folletos":"Folletos","sub.flyers":"Flyers","sub.identidad":"Identidad","sub.otros":"Otros productos","sub.portfolio":"Portfolio","sub.encantado":"Universo encantado","sub.sef":"SEF · Deporte UV","sub.weidner":"Weidner",
      "view.toGrid":"Mosaico","view.toStd":"Carrusel",
      "eyebrow":"Diseño + Desarrollo · Perfil técnico-creativo","hub.nombre":"Salvador Llácer Ivars","hub.frase":"Seis disciplinas, una sola forma de trabajar: pensar como diseñador y ejecutar como desarrollador. Elige por dónde entrar.",
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
      "d.ref.r6.texto":"El cartel como arma y arte: fotomontaje, compromiso y oficio valenciano."
    },
    en:{ "m.inicio":"Home","m.foto":"Photo","m.diseno":"Design","m.video":"Video","m.musica":"Music","m.dam":"DAM","m.mec":"Machining","m.contacto":"Contact",
      "sec.sobre":"About me","sec.obra":"Work","sec.form":"Education","sec.tools":"Tools","sec.exp":"Experience","sec.comp":"Skills","sec.ref":"References",
      "sub.paisaje":"Landscape","sub.robados":"Candid","sub.personal":"Personal vision","sub.bodegon":"Still life","sub.moda":"Fashion","sub.retrato":"Portrait","sub.etsid":"ETSID · UPV","sub.casos":"Project cases","sub.bodas":"Weddings & events",
      "sub.posters":"Posters","sub.folletos":"Brochures","sub.flyers":"Flyers","sub.identidad":"Identity","sub.otros":"Other products","sub.portfolio":"Portfolio","sub.encantado":"Enchanted universe","sub.sef":"SEF · UV Sport","sub.weidner":"Weidner",
      "view.toGrid":"Mosaic","view.toStd":"Carousel",
      "eyebrow":"Design + Development · Technical-creative profile","hub.nombre":"Salvador Llácer Ivars","hub.frase":"Six disciplines, one way of working: think like a designer, build like a developer. Choose where to enter.",
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
      "d.ref.r6.texto":"The poster as weapon and art: photomontage, commitment and Valencian craft."
    }
  };
  const i18nEls = [...document.querySelectorAll("[data-i18n]")];
  const langBtns = [...document.querySelectorAll(".lang__btn")];
  function aplicarIdioma(lang){ const dic=I18N[lang]; if(!dic) return; i18nEls.forEach((el)=>{const k=el.getAttribute("data-i18n"); if(dic[k]) el.innerHTML=dic[k];}); html.setAttribute("lang",lang); langBtns.forEach((b)=>{const on=b.dataset.lang===lang;b.classList.toggle("is-active",on);b.setAttribute("aria-pressed",String(on));}); try{localStorage.setItem("idioma",lang);}catch(e){} if(window.__updateViewBtn) window.__updateViewBtn(); }
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
  if(form) form.addEventListener("submit",(e)=>{e.preventDefault(); if(!form.checkValidity()){form.reportValidity();return;} if(btnEnviar) btnEnviar.style.display="none"; if(campos) campos.forEach(c=>c.style.display="none"); if(exito) exito.hidden=false; timer=setTimeout(cerrarModal,2000);});

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
  document.querySelectorAll(".media[data-wiki]").forEach(async (m)=>{
    const t=m.getAttribute("data-wiki");
    const img=m.querySelector("img");
    const tryWiki=async()=>{ let s=await wikiOriginal(t); if(!s) s=await wikiSearch(m.getAttribute("data-wiki-search")||t); if(s&&img){ img.onload=()=>img.classList.add("ok"); img.src=s; } };
    const own=img&&img.getAttribute("src");
    if(own&&/^https?:/i.test(own)){ if(img.complete&&img.naturalWidth) img.classList.add("ok"); else img.onload=()=>img.classList.add("ok"); img.onerror=()=>{ tryWiki(); }; }
    else tryWiki();
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

    const lb=document.getElementById("lightbox"); const lbImg=lb.querySelector("img");
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

  /* ░░ Pantonera (índice): hover en lámina → la web adopta su paleta ░░ */
  (() => {
    const pantone = document.querySelector(".pantone");
    if (!pantone) return;
    const html = document.documentElement;
    const laminas = Array.from(pantone.querySelectorAll(".pantone-lamina"));
    const volver = () => { if (html.getAttribute("data-tema") !== "index") html.setAttribute("data-tema", "index"); };
    laminas.forEach((l) => {
      const t = l.dataset.tema;
      if (!t) return;
      const poner = () => html.setAttribute("data-tema", t);
      l.addEventListener("mouseenter", poner);
      l.addEventListener("focus", poner);
      l.addEventListener("mouseleave", volver);
      l.addEventListener("blur", volver);
    });
    pantone.addEventListener("mouseleave", volver);
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
      { k:["contacto","contactar","email","correo","escribir","formulario","contratar"],
        t:"Puedes contactar conmigo desde el botón «Contacto» de la cabecera o desde el pie de página: allí tienes mi correo (salllaiva@alu.edu.gva.es) y un formulario rápido.",
        b:[["mailto:salllaiva@alu.edu.gva.es","Enviar email"]] },
      { k:["photoshop","illustrator","indesign","acrobat","lightroom","premiere","audition","paquete adobe","adobe"],
        t:"Sí, manejo el paquete Adobe completo: Photoshop, Illustrator, InDesign, Acrobat, Premiere, Audition y Lightroom. La evidencia está en mi obra de diseño gráfico y en mi trabajo fotográfico.",
        b:[["diseno.html","Ver diseño"],["fotografia.html","Ver fotografía"]] },
      { k:["fotograf","camara","luz","retrato","paisaje","bodegon","lightroom"],
        t:"Formé mi criterio fotográfico en la EASD de València y trabajé en encargos para la ETSID de la UPV: paisaje, arquitectura, reportaje, moda, bodegón y retrato. Puedes verlo en la subweb de fotografía, incluida la sección de herramientas.",
        b:[["fotografia.html","Ver fotografía"],["fotografia.html#t-tools","Herramientas"]] },
      { k:["catia","autocad","inventor","mecanic","fabricac","matrices","moldes","geinprod","delineante","stacking","plano"],
        t:"Sí: más de cinco años en Weidner Ibérica diseñando stacking columns con CATIA V5, planimetría y gestión de fabricación con el ERP Geinprod (además de Inventor). El detalle está en Sobre mí; la subweb de mecánica aún está en preparación.",
        b:[["#t-sobre","Ver en Sobre mí"]] },
      { k:["diseñ","disen","grafic","editorial","identidad","logo","folio","poster","portfolio","ilustr","dibujo"],
        t:"Sí: diseño gráfico y editorial (retícula, identidad, catálogos, folletos, pósters) con Illustrator e InDesign, aplicado en proyectos reales como Weidner Ibérica y SEF UV. Toda la obra está en la subweb de diseño.",
        b:[["diseno.html","Ver diseño"],["diseno.html#sub-identidad","Identidad"],["diseno.html#sub-posters","Pósters"]] },
      { k:["program","codigo","html","css","javascript","python","java","android","dam","git","base de datos","videojuego","simon"],
        t:"Actualmente curso el CFGS de DAM: programación, bases de datos, Git/GitHub, Figma y fundamentos de IA. La sección DAM de la web está en preparación; mientras tanto, el resumen está en Sobre mí.",
        b:[["#t-sobre","Ver en Sobre mí"]] },
      { k:["video","montaje","edicion","postproduccion"],
        t:"Edición de vídeo con Premiere y audio con Audition (montajes y podcasts para Interpreta Natura). La subweb de vídeo está en preparación; puedes ver el contexto en Sobre mí.",
        b:[["#t-sobre","Ver en Sobre mí"]] },
      { k:["musica","audio","garageband","banda sonora","podcast","cancion"],
        t:"Creo música con GarageBand y he compuesto bandas sonoras y podcasts para Interpreta Natura. La subweb de música está en preparación; el detalle está en Sobre mí.",
        b:[["#t-sobre","Ver en Sobre mí"]] },
      { k:["quien","salvador","sobre mi","perfil","cv","experiencia","formacion","resumen"],
        t:"Salvador Llácer Ivars, técnico superior multidisciplinar de Valencia: fotografía, diseño gráfico/editorial, fabricación mecánica (CATIA) y DAM en curso, con experiencia en Weidner Ibérica e Interpreta Natura. Tienes el resumen completo en Sobre mí.",
        b:[["#t-sobre","Leer Sobre mí"]] },
      { k:["hola","buenas","buenos dias","que tal","hey","hello"],
        t:"¡Hola! Soy el asistente del portfolio de Salvador. Pregúntame por software (Photoshop, CATIA…), disciplinas o por dónde ver su obra." },
      { k:["gracias","genial","perfecto"],
        t:"¡A ti! Si quieres, pregunta por alguna habilidad concreta o te llevo directo a la subweb que te interese." }
    ];
    const FALLBACK = { t:"No tengo una respuesta para eso todavía. Puedo ayudarte con sus habilidades (Adobe, CATIA, programación, fotografía, música…), contarte quién es o llevarte a las subwebs.", b:[["fotografia.html","Ver fotografía"],["diseno.html","Ver diseño"],["#t-sobre","Sobre mí"]] };
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
        btns.forEach(([h, t]) => {
          const a = document.createElement("a");
          a.className = "bot__ir";
          a.href = h;
          a.textContent = t;
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
      setTimeout(() => addMsg("bot", r.t, r.b), 320);
    };
    addMsg("bot", "¡Hola! Soy el asistente del portfolio de Salvador Llácer. Pregúntame si maneja alguna herramienta (Photoshop, CATIA, código…) o dime qué quieres ver y te llevo a la sección adecuada.");
    if (form) form.addEventListener("submit", (e) => { e.preventDefault(); const q = input.value.trim(); if (!q) return; input.value = ""; responder(q); });
    root.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => responder(b.dataset.q)));
  })();
});
