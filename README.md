# mi-web — Portafolio personal de Salvador Llácer Ivars

Portafolio estático multitema: **HTML + CSS + JavaScript plano**, sin frameworks, sin
compilación ni dependencias. Se abre con doble clic sobre `index.html` y se publica en
GitHub Pages desde la rama `Rediseño-Web`.

## Estructura

| Fichero | Rol |
|---|---|
| `index.html` | Portada: cargador de bienvenida, carrusel de 6 láminas (intro, foto, diseño, vídeo, mecánica, programación) y footer con clima |
| `fotografia.html` · `diseno.html` · `video.html` · `dfm.html` · `dam.html` | Cinco subwebs, una por disciplina |
| `estilos.css` | Única hoja de estilos. Variables en `:root`; cada tema se aplica con `html[data-tema="foto\|diseno\|video\|fab\|dam"]` y el modo oscuro con `data-mode="dark"` |
| `script.js` | Núcleo compartido: menú, carrusel, i18n ES/EN (diccionario + persistencia), chatbot, widgets (clima, consejos, Spotify PKCE), fades de audio, indicador de música y **modo bajo rendimiento** |
| `dam.js` · `dfm.js` | Lógica propia de Programación (Simon con sonido original y APIs en vivo) y de Mecánica (visor 3D, tolerancias ISO 286, materiales) |

## Decisiones de arquitectura

1. **Cero build.** Todo se edita y sirve tal cual. Si el navegador lo ejecuta, aquí se usa:
   HTML semántico, CSS con variables y ES moderno en IIFEs con `defer`.
2. **`file://` primero.** La web se abre desde el disco; por eso los modelos 3D viajan como
   data-URI dentro de `<script src>` clásicos y no hay `fetch` de binarios locales.
3. **Un solo CSS, cinco identidades.** Los temas son atributos en `<html>` + variables;
   así el hover de cada CTA de la portada tiñe nav, favicon y fondo sin duplicar estilos.
4. **i18n sin dependencias.** Diccionario ES/EN en `script.js` con `data-i18n`, guardado en
   `localStorage`; los bloques vivos (APIs, juegos) se re-renderizan solos al cambiar idioma.
5. **APIs públicas sin clave** siempre que sea posible (GitHub, Dev.to, clima, Flipsnack);
   Spotify usa OAuth PKCE para no exponer secretos en el cliente.
6. **Modo bajo rendimiento opt-in.** Botón en el FAB (todas las páginas): pausa vídeos de
   fondo, difiere mapas y lienzos a un clic, desactiva blur/animaciones y guarda la
   preferencia. El modo normal por defecto no se toca nunca.
7. **Verificación sin navegador.** Chrome headless (`--dump-dom`, `--screenshot`) y CDP con
   Node para probar interactividad; las capturas se hacen sobre una copia en ruta ASCII.

## Cómo verla

Doble clic en `index.html`, o un servidor local si prefieres (`python -m http.server`).

## Despliegue

GitHub Pages sirve la rama `Rediseño-Web`. No hay pasos de build: subir cambios basta.
