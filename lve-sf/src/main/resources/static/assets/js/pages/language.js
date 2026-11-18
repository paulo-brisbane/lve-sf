import { loadLanguage, setLanguage } from "../ui/i18n.js";
import { messages } from "../i18n/messages.js";


const API_BASE = "/api/clients";
const LANGUAGES = ["en-GB", "pt-BR", "es-AR"];

const languageSelect = document.getElementById("language-select");
const saveBtn = document.getElementById("save-btn");
const saveStatus = document.getElementById("save-status");

function applyTheme(theme) {
  const dark = theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function showStatus(message, isError) {
  saveStatus.textContent = message;
  saveStatus.className = "text-sm " + (isError ? "text-red-600" : "text-emerald-700");
}

async function loadTheme() {
  try {
    const response = await fetch(API_BASE + "/me/settings");
    if (response.ok) {
      const settings = await response.json();
      applyTheme(settings.theme ?? "system");
      return;
    }
  } catch {}
  applyTheme("system");
}

saveBtn.addEventListener("click", async () => {
  saveBtn.disabled = true;
  try {
    const language = languageSelect.value;
    const response = await fetch(API_BASE + "/me/language", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language }),
    });
    if (response.ok) {
      setLanguage(language);
      showStatus(messages[language].saved, false);
    } else {
      showStatus(messages[languageSelect.value].save_error, true);
    }
  } catch {
    showStatus(messages[languageSelect.value].connection_error, true);
  } finally {
    saveBtn.disabled = false;
  }
});

loadTheme();

// Always reveal the page, even if loading the language or translating fails.
loadLanguage()
  .then((current) => {
    if (LANGUAGES.includes(current)) {
      languageSelect.value = current;
    }
  })
  .finally(() => {
    document.body.classList.remove("invisible");
  });
