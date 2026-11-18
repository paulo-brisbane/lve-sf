import { messages } from "../i18n/messages.js";

const ME_URL = "/api/clients/me";
const SUPPORTED = Object.keys(messages);
const FALLBACK = "en-GB";

let currentLanguage = FALLBACK;

/** Returns the translated text for a key, falling back to en-GB. */
export function t(key) {
  return messages[currentLanguage]?.[key] ?? messages[FALLBACK][key] ?? key;
}

/** Replaces the text of every element with a data-i18n attribute. */
export function applyTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}

/** Reads the client's saved language, sets <html lang>, and translates the page. */
export async function loadLanguage() {
  try {
    const response = await fetch(ME_URL);
    if (response.ok) {
      const { language } = await response.json();
      if (SUPPORTED.includes(language)) {
        currentLanguage = language;
      }
    }
  } catch {
    // Keep the fallback language if the request fails.
  }
  document.documentElement.lang = currentLanguage;
  applyTranslations();
  return currentLanguage;
}

export function setLanguage(language) {
  if (SUPPORTED.includes(language)) {
    currentLanguage = language;
    document.documentElement.lang = language;
    applyTranslations();
  }
}

