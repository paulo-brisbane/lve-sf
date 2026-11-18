import { loadLanguage } from "/assets/js/ui/i18n.js";

const API_BASE = "/api/clients";
const DEFAULTS = { avatar: "indigo", language: "en-GB", theme: "system" };

function applyTheme(theme) {
  const dark = theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

async function loadTheme() {
  try {
    const response = await fetch(API_BASE + "/me/settings");
    if (response.ok) {
      applyTheme({ ...DEFAULTS, ...(await response.json()) }.theme);
      return;
    }
  } catch {}
  applyTheme(DEFAULTS.theme);
}

loadTheme();
loadLanguage().catch(() => {}).finally(() => document.body.classList.remove("invisible"));
