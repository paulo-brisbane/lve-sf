export const NICKNAME_MIN = 2;
export const NICKNAME_MAX = 30;

const CLIENT_REF_PATTERN = /^[A-Z]{4}-\d{4}$/;

export function normalizeNickname(value) {
  return value.trim();
}

export function isValidNickname(value) {
  return value.length >= NICKNAME_MIN && value.length <= NICKNAME_MAX;
}

/** Removes all whitespace and uppercases, so "abcd 1234" becomes "ABCD1234". */
export function normalizeClientRef(value) {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function isValidClientRef(value) {
  return CLIENT_REF_PATTERN.test(value);
}