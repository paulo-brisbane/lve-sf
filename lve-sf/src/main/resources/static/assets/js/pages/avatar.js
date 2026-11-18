import { loadLanguage } from "/assets/js/ui/i18n.js";

const API_BASE = "/api/clients";
const DEFAULTS = { avatar: "indigo", language: "en-GB", theme: "system" };
const AVATAR_CLASSES = {
  indigo: "bg-indigo-600", emerald: "bg-emerald-600", amber: "bg-amber-500",
  rose: "bg-rose-600", sky: "bg-sky-600", slate: "bg-slate-600",
};
const text = (id) => document.getElementById(id).textContent;

let settings = { ...DEFAULTS };
let nickname = "";

const preview = document.getElementById("avatar-preview");
const saveBtn = document.getElementById("save-btn");
const saveStatus = document.getElementById("save-status");

function applyTheme(theme) {
  const dark = theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function render() {
  preview.textContent = nickname ? nickname.charAt(0).toUpperCase() : "?";
  preview.className = "flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white " +
    AVATAR_CLASSES[settings.avatar];

  document.querySelectorAll("[data-avatar]").forEach((btn) => {
    const selected = btn.dataset.avatar === settings.avatar;
    btn.classList.toggle("ring-2", selected);
    btn.classList.toggle("ring-offset-2", selected);
    btn.classList.toggle("ring-slate-800", selected);
    btn.setAttribute("aria-pressed", String(selected));
  });
}

function showStatus(message, isError) {
  saveStatus.textContent = message;
  saveStatus.className = "text-sm " + (isError ? "text-red-600" : "text-emerald-700");
}

document.querySelectorAll("[data-avatar]").forEach((btn) => {
  btn.addEventListener("click", () => {
    settings.avatar = btn.dataset.avatar;
    render();
  });
});

saveBtn.addEventListener("click", async () => {
  saveBtn.disabled = true;
  try {
    const response = await fetch(API_BASE + "/me/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    showStatus(response.ok ? text("msg-saved") : text("msg-save-error"), !response.ok);
  } catch {
    showStatus(text("msg-connection-error"), true);
  } finally {
    saveBtn.disabled = false;
  }
});

async function load() {
  try {
    const settingsResponse = await fetch(API_BASE + "/me/settings");
    if (settingsResponse.ok) {
      settings = { ...DEFAULTS, ...(await settingsResponse.json()) };
    }
    const meResponse = await fetch(API_BASE + "/me");
    if (meResponse.ok) {
      nickname = (await meResponse.json()).nickname || "";
    }
  } catch {}
  applyTheme(settings.theme);
  render();
}

loadLanguage()
  .catch(() => {})
  .finally(() => document.body.classList.remove("invisible"));
load();
