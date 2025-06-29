# coffee-ahk

Translate `coffeescript` to `ahk`.

[Documentation](./doc/documentation.md) | [文档](./doc/cn/documentation.md)

## Features

- Transpiles CoffeeScript to AutoHotkey v1 scripts
- Supports class syntax, inheritance, and method binding
- Import/export syntax for modules (including `.coffee`, `.ahk`, `.json`, `.yaml`)
- Recursive import resolution and namespace isolation
- Partial npm package management support (install and import local/third-party modules)
- Functional programming support; functions are first-class citizens
- Arrow functions (`->`, `=>`) and `this` binding
- Function parameter binding, default values, and rest parameters
- Destructuring assignment for arrays and objects
- Supports various syntactic sugar, such as destructuring, splats, and concise expressions
- Try/catch/finally error handling
- Chained and implicit function calls
- Anonymous and higher-order functions
- Native AHK code embedding with backticks
- Strict variable and reserved word checking
- Optional TypeScript static type system support via plugins

## Usage

```shell
pnpm i coffee-ahk
```

```typescript
import c2a from "coffee-ahk";

await c2a("./script/toolkit/index.coffee", {
  salt: "toolkit",
  save: true,
  verbose: false,
});
```

## Testing

```shell
pnpm test
```

## Limitations

- AutoHotkey is case-insensitive; variable and function names are not case-sensitive.
  **Class names are simulated as case-sensitive:**
  - Class names must start with an uppercase letter.
  - All class identifiers are rendered with uppercase letters replaced by full-width Unicode for AHK v1 case simulation.
  - Variable, function, and parameter names cannot be the same as any class name; such conflicts will throw an error at compile time.
- No support for getter/setter
- No implicit return; all `return` statements must be explicit
- No true boolean type in AHK; `true`, `false`, `on`, and `off` are syntactic sugar
- Character and number distinction is blurred in AHK; `'0'` is falsy
- `NaN`, `null`, and `undefined` are converted to the empty string `''`
- Optional chaining (`?`) is not supported
- Inverted syntax (e.g., `a = 1 unless a >= 1`) is not supported; use standard syntax
- Avoid using `=>` outside classes; pure functions in AHK lack `this`
- `.coffee` files must be UTF-8; `.ahk` files must be UTF-8 with BOM
- Import/export and npm package management are incomplete
