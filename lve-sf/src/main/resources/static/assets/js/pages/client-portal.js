import { loadLanguage } from "/assets/js/ui/i18n.js";

const API_BASE = "/api/clients";
const text = (id) => document.getElementById(id).textContent;

function showError(message) {
  document.getElementById("portal-loading").classList.add("hidden");
  document.getElementById("portal-content").classList.add("hidden");
  document.getElementById("portal-error-message").textContent = message;
  document.getElementById("portal-error").classList.remove("hidden");
}

async function loadPortal() {
  try {
    const response = await fetch(API_BASE + "/me");

    if (response.status === 401) {
      window.location.href = "/assets/html/sign-in.html";
      return;
    }
    if (!response.ok) {
      showError(text("msg-load-error"));
      return;
    }

    const client = await response.json();
    document.getElementById("portal-nickname").textContent = client.nickname || text("msg-fallback-name");

    document.getElementById("portal-loading").classList.add("hidden");
    document.getElementById("portal-content").classList.remove("hidden");
  } catch {
    showError(text("msg-connection-error"));
  }
}

const menuBtn = document.getElementById("user-menu-btn");
const menu = document.getElementById("user-menu");

function closeMenu() {
  menu.classList.add("hidden");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = menu.classList.toggle("hidden") === false;
  menuBtn.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target)) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.getElementById("signout-btn").addEventListener("click", async () => {
  try {
    await fetch(API_BASE + "/sign-out", { method: "POST" });
  } finally {
    window.location.href = "/index.html";
  }
});

async function init() {
  // Translate first, so the strings the script reads are already in the user's language.
  await loadLanguage().catch(() => {});
  menuBtn.setAttribute("aria-label", text("msg-user-menu"));
  document.body.classList.remove("invisible");
  await loadPortal();
}

init();
