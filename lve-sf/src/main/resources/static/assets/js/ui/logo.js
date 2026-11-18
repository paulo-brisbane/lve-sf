/**
 * Site logo. Edit this file to change the logo on every page.
 *
 * Text mode (default): renders LVE with SF beside it.
 * Image mode: set `image` to a URL (for example "assets/img/logo.svg")
 * and the logo renders that image instead.
 */
const LOGO = {
  image: null,
  alt: "LVE SF",
  imageClass: "h-8 w-auto",
  main: { text: "LVE", class: "text-3xl", color:"var(--button-bg, #4f46e5)" },
  sub: { text: "SF", class: "text-sm text-slate-500" },
};

function createSpan({ text, class: className, color }) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  if (color) span.style.color = color;
  return span;
}

/** Fills a container element with the logo. The container keeps its own position classes. */
export function renderLogo(container) {
  if (LOGO.image) {
    const img = document.createElement("img");
    img.src = LOGO.image;
    img.alt = LOGO.alt;
    img.className = LOGO.imageClass;
    container.replaceChildren(img);
    return;
  }
  container.replaceChildren(createSpan(LOGO.main), createSpan(LOGO.sub));
}

const target = document.getElementById("site-logo");
if (target) renderLogo(target);