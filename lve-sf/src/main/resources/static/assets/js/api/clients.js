const API_BASE = "/api/clients";

/**
 * Low-level request helper.
 * Resolves to { ok, status, body }. Rejects only on network failure.
 */
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null; // empty or non-JSON response
  }

  return { ok: response.ok, status: response.status, body };
}

export function createClient(nickname) {
  return request("", {
    method: "POST",
    body: JSON.stringify({ nickname }),
  });
}

export function signIn(clientRef) {
  return request("/sign-in", {
    method: "POST",
    body: JSON.stringify({ clientRef }),
  });
}

export function getCurrentClient() {
  return request("/me");
}

export function signOut() {
  return request("/sign-out", { method: "POST" });
}
