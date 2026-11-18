import { loadLanguage } from "/assets/js/ui/i18n.js";

 const API_BASE = "/api/clients";
 const DEFAULTS = { avatar: "indigo", language: "en-GB", theme: "system" };
 const text = (id) => document.getElementById(id).textContent;

 let settings = { ...DEFAULTS };

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

 document.querySelectorAll('input[name="theme"]').forEach((input) => {
   input.addEventListener("change", () => {
     settings.theme = input.value;
     applyTheme(settings.theme);
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
     const response = await fetch(API_BASE + "/me/settings");
     if (response.ok) {
       settings = { ...DEFAULTS, ...(await response.json()) };
     }
   } catch {}
   applyTheme(settings.theme);
   document.querySelectorAll('input[name="theme"]').forEach((input) => {
     input.checked = input.value === settings.theme;
   });
 }

 loadLanguage()
   .catch(() => {})
   .finally(() => document.body.classList.remove("invisible"));
 load();
