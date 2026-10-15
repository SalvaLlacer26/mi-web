/* script.js · hover hub, desplegable, vista global + por subsección, FAB/TOC, stats, modal, lightbox, Wikipedia, clima */

document.addEventListener("DOMContentLoaded", () => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;
  const anio = document.getElementById("anio"); if (anio) anio.textContent = new Date().getFullYear();

  /* Menu movil */
  const burger = document.querySelector(".nav__burger");
  const cerrarMenu = () => { document.body.classList.remove("nav-open"); if (burger) burger.setAttribute("aria-expanded", "false"); };
  if (burger) burger.addEventListener("click", () => { const open = document.body.classList.toggle("nav-open"); burger.setAttribute("aria-expanded", String(open)); });

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

  /* Parallax indiana */
  if(!reduce&&matchMedia("(pointer:fine)").matches){
    const objs=document.querySelector(".fondo__objetos");
    if(objs){
      let tx=0,ty=0,cx=0,cy=0,raf=0;
      const tick=()=>{ raf=0; cx+=(tx-cx)*.07; cy+=(ty-cy)*.07;
        objs.style.transform=`translate3d(${(cx*-44).toFixed(2)}px,${(cy*-30).toFixed(2)}px,0)`;
        if(Math.abs(tx-cx)>.0008||Math.abs(ty-cy)>.0008) raf=requestAnimationFrame(tick); };
      addEventListener("pointermove",(e)=>{ tx=e.clientX/innerWidth-.5; ty=e.clientY/innerHeight-.5; if(!raf) raf=requestAnimationFrame(tick); },{passive:true});
    }
  }

  /* Idioma */
  const I18N = {
    es:{ "m.inicio":"Inicio","m.foto":"Foto","m.diseno":"Diseño","m.video":"Vídeo","m.musica":"Música","m.dam":"DAM","m.mec":"Mecánica","m.contacto":"Contacto",
      "sec.sobre":"Sobre mí","sec.obra":"Obra","sec.form":"Formación","sec.tools":"Herramientas","sec.exp":"Experiencia","sec.comp":"Competencias","sec.ref":"Referentes",
      "sub.paisaje":"Paisaje","sub.robados":"Robados","sub.personal":"Visión personal","sub.bodegon":"Bodegón publicitario","sub.moda":"Moda","sub.retrato":"Retrato","sub.etsid":"ETSID · UPV","sub.casos":"Casos de proyecto","sub.bodas":"Bodas y eventos",
      "view.toGrid":"Mosaico","view.toStd":"Carrusel",
      "eyebrow":"Diseño + Desarrollo · Perfil técnico-creativo","hub.nombre":"Salvador Llácer Ivars","hub.frase":"Seis disciplinas, una sola forma de trabajar: pensar como diseñador y ejecutar como desarrollador. Elige por dónde entrar.",
      "sel.foto":"Fotografía","sel.foto.sub":"Luz, encuadre y narrativa","sel.diseno":"Diseño gráfico e ilustración","sel.diseno.sub":"Retícula, tinta y trazo","sel.video":"Edición de vídeo","sel.video.sub":"Ritmo, sonido y color","sel.musica":"Música","sel.musica.sub":"Composición y montaje sonoro","sel.dam":"DAM y videojuegos","sel.dam.sub":"Código, apps y Simon Says","sel.fab":"Fabricación mecánica","sel.fab.sub":"CATIA, planos y ERP",
      "pie.eyebrow":"¿Tienes un proyecto?","pie.nota":"Abierto a nuevas oportunidades. Diseño, desarrollo y administración en una sola persona.","pie.loc":"Localización","clima.ubicacion":"Ubicación",
      "modal.eyebrow":"Hablemos","modal.titulo":"Cuéntame tu proyecto","form.nombre":"Nombre","form.email":"Email","form.mensaje":"Mensaje","form.enviar":"Enviar mensaje","form.exito":"✓ Mensaje enviado correctamente.","toast.soon":"Subweb en construcción" },
    en:{ "m.inicio":"Home","m.foto":"Photo","m.diseno":"Design","m.video":"Video","m.musica":"Music","m.dam":"DAM","m.mec":"Machining","m.contacto":"Contact",
      "sec.sobre":"About me","sec.obra":"Work","sec.form":"Education","sec.tools":"Tools","sec.exp":"Experience","sec.comp":"Skills","sec.ref":"References",
      "sub.paisaje":"Landscape","sub.robados":"Candid","sub.personal":"Personal vision","sub.bodegon":"Still life","sub.moda":"Fashion","sub.retrato":"Portrait","sub.etsid":"ETSID · UPV","sub.casos":"Project cases","sub.bodas":"Weddings & events",
      "view.toGrid":"Mosaic","view.toStd":"Carousel",
      "eyebrow":"Design + Development · Technical-creative profile","hub.nombre":"Salvador Llácer Ivars","hub.frase":"Six disciplines, one way of working: think like a designer, build like a developer. Choose where to enter.",
      "sel.foto":"Photography","sel.foto.sub":"Light, framing and narrative","sel.diseno":"Graphic design & illustration","sel.diseno.sub":"Grid, ink and line","sel.video":"Video editing","sel.video.sub":"Rhythm, sound and colour","sel.musica":"Music","sel.musica.sub":"Composition and sound editing","sel.dam":"DAM & video games","sel.dam.sub":"Code, apps and Simon Says","sel.fab":"Mechanical manufacturing","sel.fab.sub":"CATIA, blueprints and ERP",
      "pie.eyebrow":"Have a project?","pie.nota":"Open to new opportunities. Design, development and administration in one person.","pie.loc":"Location","clima.ubicacion":"Location",
      "modal.eyebrow":"Let's talk","modal.titulo":"Tell me about your project","form.nombre":"Name","form.email":"Email","form.mensaje":"Message","form.enviar":"Send message","form.exito":"✓ Message sent successfully.","toast.soon":"Sub-web under construction" }
  };
  const i18nEls = [...document.querySelectorAll("[data-i18n]")];
  const langBtns = [...document.querySelectorAll(".lang__btn")];
  function aplicarIdioma(lang){ const dic=I18N[lang]; if(!dic) return; i18nEls.forEach((el)=>{const k=el.getAttribute("data-i18n"); if(dic[k]) el.textContent=dic[k];}); html.setAttribute("lang",lang); langBtns.forEach((b)=>{const on=b.dataset.lang===lang;b.classList.toggle("is-active",on);b.setAttribute("aria-pressed",String(on));}); try{localStorage.setItem("idioma",lang);}catch(e){} if(window.__updateViewBtn) window.__updateViewBtn(); }
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

  /* Revelado */
  const rev=document.querySelectorAll(".reveal");
  if(!reduce&&"IntersectionObserver" in window){ rev.forEach((el,i)=>{el.style.animationDelay=(i%6)*0.07+"s";});
    const obs=new IntersectionObserver((es)=>es.forEach((e)=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);}}),{threshold:.12}); rev.forEach((el)=>obs.observe(el));
  } else rev.forEach((el)=>el.classList.add("visible"));

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
    try{const r=await fetch(API(`action=query&titles=${encodeURIComponent(titulo)}&prop=pageimages&piprop=original`));const j=await r.json();return firstPage(j)?.original?.source||null;}catch{return null;}
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

  /* ░░ OBRA / EXPERIENCIA: slider + masonry, vista global y por subsección ░░ */
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
        files:["robados-vertical-008.webp","010.webp","robados-vertical-001.webp","robados-vertical-002.webp","robados-vertical-003.webp","robados-vertical-004.webp","robados-vertical-005.webp","robados-vertical-006.webp","robados-vertical-007.webp","robados-vertical-009.webp"]},
      "personal-h":{title:"Visión personal",orient:"h",base:"Imagenes/foto/personal/horizontal/",
        files:["personal-horizontal-001.webp","personal-horizontal-002.webp","personal-horizontal-003.webp","personal-horizontal-004.webp","personal-horizontal-005.webp","personal-horizontal-006.webp"]},
      "personal-v":{title:"Visión personal",orient:"v",base:"Imagenes/foto/personal/vertical/",
        files:["personal-vertical-004.webp","personal-vertical-001.webp","personal-vertical-002.webp","personal-vertical-003.webp"]},
      "bodegon":{title:"Bodegón publicitario",orient:"h",base:"Imagenes/foto/bodegon/",
        files:["bodegon-005.webp","bodegon-001.webp","bodegon-002.webp","bodegon-003.webp","bodegon-004.webp","bodegon-006.webp"]},
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
        files:["exterior-001.webp","exterior-002.webp","exterior-003.webp","exterior-004.webp","exterior-005.webp","exterior-006.webp","exterior-007.webp","exterior-008.webp","exterior-009.webp","exterior-010.webp","exterior-011.webp"]}
    };

    function serieItems(cfg){ return cfg.files.map((f,i)=>({src:cfg.base+f,label:cfg.title+" "+pad2(i+1)})); }

    /* SLIDER */
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

      const imgs=cfg.files.map((f,i)=>{
        const img=document.createElement("img");
        stage.insertBefore(img,prog);
        const src=cfg.base+f;
        if(i===0){ img.src=src; img.setAttribute("fetchpriority","high"); } else { img.dataset.src=src; }
        img.width=w; img.height=h; img.alt=items[i].label; img.decoding="async";
        img.addEventListener("error",()=>{ img.dataset.broken="1"; },{once:true});
        return img;
      });
      const cargar=(i)=>{ const im=imgs[i]; if(im && im.dataset.src && !im.src){ im.src=im.dataset.src; delete im.dataset.src; } };

      const slider={ idx:0,timer:null,visible:false,el:el,stage:stage,
        go(i){ if(!imgs.length) return;
          let nn=i; for(let k=0;k<imgs.length;k++){ const c=(nn+k)%imgs.length; if(imgs[c].dataset.broken!=="1"){ nn=c; break; } }
          this.idx=nn; cargar(nn); cargar((nn+1)%imgs.length);
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

    /* MASONRY */
    function buildGrid(el){
      const cfg=SERIES2[el.dataset.slider]; if(!cfg) return;
      const w=cfg.orient==="h"?1600:1067, h=cfg.orient==="h"?1067:1600;
      el.setAttribute("data-orient",cfg.orient);
      const items=serieItems(cfg);
      const m=document.createElement("div"); m.className="masonry";
      cfg.files.forEach((f,i)=>{
        const fig=document.createElement("figure"); fig.className="m-item";
        const img=document.createElement("img"); img.src=cfg.base+f; img.alt=items[i].label; img.width=w; img.height=h; img.loading="lazy"; img.decoding="async";
        img.onload=()=>img.classList.add("ok"); img.onerror=()=>fig.remove();
        fig.appendChild(img); fig.addEventListener("click",()=>openLightbox(items,i,fig));
        m.appendChild(fig);
      });
      el.innerHTML=""; el.appendChild(m);
    }

    function render(el,grid){ if(el._slider){ el._slider.destroy(); el._slider=null; } el.innerHTML=""; grid?buildGrid(el):buildSlider(el); el._grid=grid; }

    /* modo efectivo por subserie (override local > global) */
    function modeOf(sub){ const ov=sub.dataset.view; return (ov==="grid"||ov==="std")?ov:globalMode(); }
    function syncSub(sub){ const grid=modeOf(sub)==="grid"; sub.classList.toggle("view-grid",grid); const b=sub.querySelector("[data-subview]"); if(b) b.setAttribute("aria-pressed",String(grid)); }
    function renderSubSeries(sub){ sub.querySelectorAll(".serie[data-slider]").forEach(el=>{ const grid=modeOf(sub)==="grid"; if(el._grid!==grid) render(el,grid); }); }
    function applyView(){ document.querySelectorAll(".subserie").forEach(sub=>{ if(!sub.querySelector(".serie[data-slider]")) return; syncSub(sub); if(sub._mounted) renderSubSeries(sub); }); }

    /* Grid modal (modo estándar) */
    const gm=document.getElementById("gridmodal");
    const gmGrid=document.getElementById("gm-grid"), gmTitle=document.getElementById("gm-title");
    let gmSlider=null;
    function openGrid(slider,items,cfg,last){
      gmSlider=slider; gmTitle.textContent=cfg.title; gmGrid.innerHTML=""; clearTimeout(slider.timer);
      items.forEach((it,i)=>{ const b=document.createElement("button"); b.className="mini"+(i===slider.idx?" is-active":""); b.setAttribute("aria-label",it.label);
        const im=document.createElement("img"); im.src=it.src; im.alt=it.label; im.width=160; im.height=160; im.loading="lazy"; im.decoding="async"; im.onload=()=>im.classList.add("ok"); im.onerror=()=>b.remove();
        b.appendChild(im); b.addEventListener("click",()=>{ slider.go(i); closeGrid(); openLightbox(items,i,last||slider.el); }); gmGrid.appendChild(b); });
      gm.classList.add("is-open"); gm.setAttribute("aria-hidden","false");
    }
    function closeGrid(){ gm.classList.remove("is-open"); gm.setAttribute("aria-hidden","true"); if(gmSlider) gmSlider.schedule(); }
    if(gm){ gm.querySelector("[data-gm-cerrar]").addEventListener("click",closeGrid); gm.querySelector("[data-gm-fondo]").addEventListener("click",closeGrid); }

    /* Lightbox */
    const lb=document.getElementById("lightbox"); const lbImg=lb.querySelector("img");
    let lbItems=[],lbIdx=0,lbLast=null;
    function lbShow(n){ if(!lbItems.length) return; lbIdx=(n+lbItems.length)%lbItems.length; lbImg.src=lbItems[lbIdx].src; lbImg.alt=lbItems[lbIdx].label; }
    function openLightbox(items,i,ret){ lbItems=items; lbLast=ret||document.activeElement; if(gmSlider) clearTimeout(gmSlider.timer); lb.classList.add("is-open"); lb.setAttribute("aria-hidden","false"); lbShow(i); lb.querySelector(".lightbox__cerrar").focus(); }
    function closeLightbox(){ lb.classList.remove("is-open"); lb.setAttribute("aria-hidden","true"); if(lbLast&&lbLast.focus) lbLast.focus(); }
    if(lb){ lb.querySelector(".lightbox__cerrar").addEventListener("click",closeLightbox); lb.querySelector("[data-lb-fondo]").addEventListener("click",closeLightbox);
      lb.querySelector("[data-lb-prev]").addEventListener("click",()=>lbShow(lbIdx-1)); lb.querySelector("[data-lb-next]").addEventListener("click",()=>lbShow(lbIdx+1)); }
    document.addEventListener("keydown",(e)=>{
      if(gm&&gm.classList.contains("is-open")&&e.key==="Escape"){closeGrid();return;}
      if(!lb||!lb.classList.contains("is-open")) return;
      if(e.key==="Escape") closeLightbox(); else if(e.key==="ArrowLeft") lbShow(lbIdx-1); else if(e.key==="ArrowRight") lbShow(lbIdx+1);
    });

    /* Montaje diferido por subserie */
    const subs=[...document.querySelectorAll(".subserie")].filter(s=>s.querySelector(".serie[data-slider]"));
    if("IntersectionObserver" in window){
      const ioBuild=new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ const sub=e.target; sub._mounted=true; renderSubSeries(sub); ioBuild.unobserve(sub);} }),{rootMargin:"400px 0px"});
      subs.forEach(sub=>ioBuild.observe(sub));
    } else { subs.forEach(sub=>{ sub._mounted=true; renderSubSeries(sub); }); }
    subs.forEach(syncSub);

    /* Botón local por subsección */
    document.querySelectorAll("[data-subview]").forEach(btn=>{
      btn.addEventListener("click",()=>{ const sub=btn.closest(".subserie"); if(!sub) return;
        sub.dataset.view = (modeOf(sub)==="grid")?"std":"grid"; syncSub(sub); if(sub._mounted) renderSubSeries(sub); });
    });

    /* Botón global (header) */
    const viewBtn=document.getElementById("viewToggle");
    function updateViewBtn(){ if(!viewBtn) return; const grid=globalMode()==="grid"; const dic=I18N[langActual()]||I18N.es;
      viewBtn.setAttribute("aria-pressed",String(grid));
      const lbl=viewBtn.querySelector(".viewbtn__label"); if(lbl) lbl.textContent=grid?dic["view.toStd"]:dic["view.toGrid"];
      viewBtn.setAttribute("aria-label",grid?"Cambiar visualización a carrusel":"Cambiar visualización a mosaico"); }
    window.__updateViewBtn=updateViewBtn;
    function setView(v){ html.setAttribute("data-view",v); try{localStorage.setItem("viewMode",v);}catch(e){} if(v==="std") closeToc(); applyView(); updateViewBtn(); }
    if(viewBtn) viewBtn.addEventListener("click",()=>setView(globalMode()==="grid"?"std":"grid"));

    /* FAB subir + índice */
    const toTop=document.getElementById("toTop");
    if(toTop){ toTop.addEventListener("click",()=>scrollTo({top:0,behavior:reduce?"auto":"smooth"}));
      const onScroll=()=>{ toTop.classList.toggle("is-on", scrollY>560 && globalMode()!=="grid"); };
      addEventListener("scroll",onScroll,{passive:true}); onScroll(); }

    const toc=document.getElementById("toc"), tocScrim=document.getElementById("tocScrim"), tocBtn=document.getElementById("tocBtn"), tocClose=document.getElementById("tocClose"), tocList=document.getElementById("tocList");
    function buildToc(){ if(!tocList) return; const secs=[...document.querySelectorAll("#contenido .seccion")]; tocList.innerHTML="";
      secs.forEach(s=>{ const hid=s.getAttribute("aria-labelledby"); const h=hid&&document.getElementById(hid); if(!h) return; const a=document.createElement("a"); a.href="#"+hid; a.textContent=h.textContent.trim(); a.dataset.target=hid; a.addEventListener("click",closeToc); tocList.appendChild(a); }); }
    function setActiveToc(hid){ if(!tocList) return; tocList.querySelectorAll("a").forEach(a=>a.classList.toggle("is-active",a.dataset.target===hid)); }
    function openToc(){ if(!toc||globalMode()!=="grid") return; buildToc(); toc.classList.add("is-open"); toc.setAttribute("aria-hidden","false"); if(tocScrim) tocScrim.classList.add("is-open"); if(tocBtn) tocBtn.setAttribute("aria-expanded","true"); }
    function closeToc(){ if(!toc) return; toc.classList.remove("is-open"); toc.setAttribute("aria-hidden","true"); if(tocScrim) tocScrim.classList.remove("is-open"); if(tocBtn) tocBtn.setAttribute("aria-expanded","false"); }
    if(tocBtn) tocBtn.addEventListener("click",()=>{ toc.classList.contains("is-open")?closeToc():openToc(); });
    if(tocClose) tocClose.addEventListener("click",closeToc);
    if(tocScrim) tocScrim.addEventListener("click",closeToc);
    document.addEventListener("keydown",(e)=>{ if(e.key==="Escape"&&toc&&toc.classList.contains("is-open")) closeToc(); });

    /* Scrollspy */
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
      widgetEls.forEach((els)=>{
        if(els.select) els.select.value=actual;
      });
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
});
