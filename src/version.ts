declare const __VERSION__: string

export const version = typeof __VERSION__ === 'undefined' ? '0.0.0-dev' : __VERSION__
