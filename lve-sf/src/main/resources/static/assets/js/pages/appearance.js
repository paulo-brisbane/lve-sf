import { loadLanguage } from "/assets/js/ui/i18n.js";
import { publishColour } from "/assets/js/ui/theme.js";
import { renderLogo } from "/assets/js/ui/logo.js";

const API_BASE = "/api/clients";
const DEFAULTS = { colour: "blue" };
const text = (id) => document.getElementById(id).textContent;

const saveBtn = document.getElementById("save-btn");
const saveStatus = document.getElementById("save-status");

function selectedColour() {
  return document.querySelector('input[name="colour"]:checked')?.value ?? DEFAULTS.colour;
}

function applyColour(colour) {
  const radio = document.querySelector(`input[name="colour"][value="${colour}"]`);
  if (radio) radio.checked = true;
}

function showStatus(message, isError) {
  saveStatus.textContent = message;
  saveStatus.className = "text-sm " + (isError ? "text-red-600" : "text-emerald-700");
}

saveBtn.addEventListener("click", async () => {
  const colour = selectedColour();
  saveBtn.disabled = true;
  try {
    const response = await fetch(API_BASE + "/me/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colour }),
    });
    if (response.ok) {
      localStorage.setItem("colour", colour);
      publishColour(colour);
      renderLogo(document.getElementById("site-logo"), colour);
    }
    showStatus(response.ok ? text("msg-saved") : text("msg-save-error"), !response.ok);
  } catch {
    showStatus(text("msg-connection-error"), true);
  } finally {
    saveBtn.disabled = false;
  }
});

async function load() {
  let settings = { ...DEFAULTS };
  try {
    const response = await fetch(API_BASE + "/me/settings");
    if (response.ok) {
      settings = { ...DEFAULTS, ...(await response.json()) };
      localStorage.setItem("colour", settings.colour);
    }
  } catch {}
  applyColour(settings.colour);
}

loadLanguage()
  .catch(() => {})
  .finally(() => document.body.classList.remove("invisible"));
load();
