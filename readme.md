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
- Implicit return is supported in common cases (functions, object methods); complex control flows (for/while/if/switch/try) still require explicit `return`
- No true boolean type in AHK; `true`, `false`, `on`, and `off` are syntactic sugar
- Character and number distinction is blurred in AHK; `'0'` is falsy
- `NaN`, `null`, and `undefined` are converted to the empty string `''`
- Optional chaining (`?`) is not supported
- Avoid using `=>` outside classes; pure functions in AHK lack `this`
- `.coffee` files must be UTF-8; `.ahk` files must be UTF-8 with BOM
- Import/export and npm package management are incomplete

---

## Language Feature Compatibility

| Feature / Syntax                     | CoffeeScript |      AutoHotkey v1      | coffee-ahk |
| ------------------------------------ | :----------: | :---------------------: | :--------: |
| Variable Declaration                 |      ✅      |           ✅            |     ✅     |
| Function Declaration/Expression      |      ✅      | ⚠️ (no anonymous/arrow) |     ✅     |
| Class/Inheritance                    |      ✅      |           ✅            |     🟡     |
| Module (import/export)               |      ✅      |           ❌            |     🟡     |
| Destructuring                        |      ✅      |           ❌            |     🟡     |
| Template String                      |      ✅      |           ❌            |     ✅     |
| Optional Chaining/Nullish Coalescing |      ✅      |           ❌            |     ❌     |
| Getter/Setter                        |      ✅      |           ❌            |     ❌     |
| Implicit Return                      |      ✅      |           ❌            |     🟡     |
| Default Param/Rest/Spread            |      ✅      |    ⚠️ (default only)    |     🟡     |
| Exception Handling                   |      ✅      |           ✅            |     ✅     |
| for/while/switch/if                  |      ✅      |           ✅            |     ✅     |
| Boolean/true/false                   |      ✅      |           ⚠️            |     ✅     |
| null/undefined/NaN                   |      ✅      |           ⚠️            |     🟡     |
| Map/Set/Symbol                       |      ✅      |           ❌            |     ❌     |
| Generator/yield                      |      ✅      |           ❌            |     ❌     |
| async/await                          |      ✅      |           ❌            |     ❌     |
| this/arguments                       |      ✅      |           ✅            |     ✅     |
| prototype/extends                    |      ✅      |           ✅            |     🟡     |
| delete/in/of                         |      ✅      |           🟡            |     🟡     |
| with/do                              |      ✅      |           🟡            |     🟡     |
| case/break/continue                  |      ✅      |           ✅            |     ✅     |
| typeof/instanceof                    |      ✅      |           🟡            |     🟡     |
| static properties/methods            |      ✅      |           🟡            |     🟡     |
| super                                |      ✅      |           ✅            |     ✅     |
| new                                  |      ✅      |           ✅            |     ✅     |
| throw                                |      ✅      |           ✅            |     ✅     |

Legend:
✅ Supported & equivalent  🟡 Partially supported / limited  ⚠️ Supported with caveats  ❌ Not supported

### Details

- **Variable Declaration**: CoffeeScript uses implicit declaration; AHKv1 uses global/local/static; coffee-ahk auto-maps scope and prevents class name conflicts.
- **Function Declaration/Expression**: AHKv1 only supports named functions (no anonymous/arrow); coffee-ahk converts arrow functions and supports anonymous functions.
- **Class/Inheritance**: coffee-ahk supports class/extends, constructor as `__New`, `super` as `base`, class names are full-width Unicode; some advanced features are limited.
- **Module (import/export)**: Only static import/export is supported in coffee-ahk; recursive dependency resolution.
- **Destructuring**: coffee-ahk supports common object/array destructuring; some advanced patterns are not supported.
- **Template String**: coffee-ahk converts to string concatenation, supports interpolation and escape.
- **Optional Chaining/Nullish Coalescing**: Not supported in coffee-ahk (forbidden in source).
- **Getter/Setter**: Not supported in coffee-ahk (forbidden in source).
- **Implicit Return**: coffee-ahk auto-inserts return in common cases; not equivalent for complex control flow.
- **Default Param/Rest/Spread**: coffee-ahk supports default params; rest/spread only in function params/calls.
- **Exception Handling**: try/catch/finally mapped directly.
- **for/while/switch/if**: All supported; for supports in/of; while/until/loop handled.
- **Boolean/true/false**: No native boolean in AHKv1; true/false/on/off/yes/no are all equivalent; coffee-ahk matches this.
- **null/undefined/NaN**: All converted to empty string `""` in coffee-ahk.
- **Map/Set/Symbol**: Not supported in coffee-ahk.
- **Generator/yield**: Not supported in coffee-ahk.
- **async/await**: Not supported in coffee-ahk.
- **this/arguments**: coffee-ahk auto-maps; AHKv1 uses `this`, `A_Args`, etc.
- **prototype/extends**: coffee-ahk supports via class mechanism; some limitations apply.
- **delete/in/of**: coffee-ahk supports in/of; delete is partially supported (object property deletion).
- **with/do**: `with` not supported; `do` in CoffeeScript/coffee-ahk is IIFE (immediately-invoked function expression), which is different from AHKv1's `do-while`.
- **case/break/continue**: All supported and auto-converted.
- **typeof/instanceof**: coffee-ahk maps `typeof` to type checks; `instanceof` is partially supported.
- **static properties/methods**: coffee-ahk supports static in class body only; cannot add dynamically.
- **super**: coffee-ahk maps `super` to `base`.
- **new**: coffee-ahk maps to constructor.
- **throw**: coffee-ahk maps to error throw.
