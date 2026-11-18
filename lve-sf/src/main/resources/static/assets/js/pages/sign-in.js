import { signIn } from "../api/clients.js";
import { normalizeClientRef, isValidClientRef } from "../core/validation.js";
import { showMessage, clearMessage, setBusy } from "../ui/feedback.js";

const MESSAGES = {
  invalidFormat: "Enter your client reference in the format ABCD-1234.",
  notFound: "Client reference not found. Check it and try again.",
  failed: "Could not sign in. Try again.",
  network: "Connection error. Check your network and try again.",
};

const el = {
  form: document.getElementById("signin-form"),
  input: document.getElementById("signin-ref"),
  submit: document.getElementById("signin-submit"),
  error: document.getElementById("signin-error"),
};

function fail(message) {
  showMessage(el.error, message);
}

async function handleSubmit(event) {
  event.preventDefault();
  clearMessage(el.error);

  const clientRef = normalizeClientRef(el.input.value);
  el.input.value = clientRef;

  if (!isValidClientRef(clientRef)) {
    fail(MESSAGES.invalidFormat);
    return;
  }

  setBusy(el.submit, true);
  try {
    const { ok, status } = await signIn(clientRef);
    if (ok) {
      window.location.href = "client-portal.html";
      return;
    }
    fail(status === 401 ? MESSAGES.notFound : MESSAGES.failed);
  } catch {
    fail(MESSAGES.network);
  } finally {
    setBusy(el.submit, false);
  }
}

el.input.addEventListener("input", () => {
  el.input.value = normalizeClientRef(el.input.value);
});

el.form.addEventListener("submit", handleSubmit);
