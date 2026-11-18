// assets/js/ui/theme.js
export const PAGE_TINTS = {
  "red": "#fef2f2",
  "red-violet": "#fdf4ff",
  "violet": "#f5f3ff",
  "blue-violet": "#eef2ff",
  "blue": "#eff6ff",
  "blue-green": "#f0fdfa",
  "green": "#f0fdf4",
  "yellow-green": "#f7fee7",
  "yellow": "#fefce8",
  "yellow-orange": "#fffbeb",
  "orange": "#fff7ed",
  "orange-red": "#fff1ec",
};

// Second ring from the centre of the colour wheel (Tailwind 100 shades)
export const CARD_TINTS = {
  "red": "#fee2e2",
  "red-violet": "#fae8ff",
  "violet": "#ede9fe",
  "blue-violet": "#e0e7ff",
  "blue": "#dbeafe",
  "blue-green": "#ccfbf1",
  "green": "#dcfce7",
  "yellow-green": "#ecfccb",
  "yellow": "#fef9c3",
  "yellow-orange": "#fef3c7",
  "orange": "#ffedd5",
  "orange-red": "#ffe4d9",
};

export const BUTTON_TINTS = {
  "red": "#ef4444",         // red-500
  "red-violet": "#d946ef",  // fuchsia-500
  "violet": "#8b5cf6",      // violet-500
  "blue-violet": "#6366f1", // indigo-500
  "blue": "#3b82f6",        // blue-500
  "blue-green": "#14b8a6",  // teal-500
  "green": "#22c55e",       // green-500
  "yellow-green": "#84cc16",// lime-500
  "yellow": "#facc15",      // yellow-400
  "yellow-orange": "#f59e0b", // amber-500
  "orange": "#f97316",      // orange-500
  "orange-red": "#ff4d1f",  // already a hex value in your markup
};

export const HOVER_TINTS = {
  "red": "gray",
  "red-violet": "gray",
  "violet": "gray",
  "blue-violet": "gray",
  "blue": "gray",
  "blue-green": "gray",
  "green": "gray",
  "yellow-green": "gray",
  "yellow": "gray",
  "yellow-orange": "gray",
  "orange": "gray",
  "orange-red": "gray",
};


const channel = new BroadcastChannel("client-theme");

export function applyColour(colour) {
  const valid = PAGE_TINTS[colour] ? colour : "blue";
  const style = document.documentElement.style;
  style.setProperty("--brand", `var(--colour-${valid})`);
  style.setProperty("--page-bg", PAGE_TINTS[valid]);
  style.setProperty("--card-bg", CARD_TINTS[valid]);
  style.setProperty("--button-bg", BUTTON_TINTS[valid]);
  style.setProperty("--hover-bg", HOVER_TINTS[valid]);
}

/** Applies the colour here and notifies every other open tab. */
export function publishColour(colour) {
  applyColour(colour);
  channel.postMessage(colour);
}

// Other open tabs update when this tab saves
channel.onmessage = (event) => applyColour(event.data);

export async function applySavedBackground() {
  // Apply the cached colour immediately to avoid a flash of blue
  const cached = localStorage.getItem("colour");
  if (cached) applyColour(cached);

  // Fetch the logged-in user's saved colour
  try {
    const res = await fetch("/api/clients/me/settings");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { colour } = await res.json();
    if (colour) {
      localStorage.setItem("colour", colour);
      applyColour(colour);
    }
  } catch (err) {
    console.warn("Could not load saved colour:", err);
  }
}

applySavedBackground();

