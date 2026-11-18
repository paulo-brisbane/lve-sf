export function show(element) {
  element.classList.remove("hidden");
}

export function hide(element) {
  element.classList.add("hidden");
}

export function showMessage(element, message) {
  element.textContent = message;
  show(element);
}

export function clearMessage(element) {
  element.textContent = "";
  hide(element);
}

export function setBusy(button, busy) {
  button.disabled = busy;
}
