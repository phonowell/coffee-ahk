/**
 * Convert ASCII uppercase letters to full-width forms.
 * AHK class names are rendered with full-width capitals so that
 * `class Foo` never collides with the built-in/command namespace.
 * Any comparison against `.__Class` must use the same form.
 */
export const toFullWidth = (name: string): string =>
  name.replace(/[A-Z]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0xfee0))
