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
- Supports various syntactic sugar, such as destructuring, splats, chained comparisons, and negative indexing
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

## Options

| Option     | Type    | Default | Description                                    |
| ---------- | ------- | ------- | ---------------------------------------------- |
| `salt`     | string  | random  | Identifier prefix for generated functions      |
| `save`     | boolean | true    | Write output to `.ahk` file                    |
| `string`   | boolean | false   | Return compiled string instead of writing file |
| `comments` | boolean | false   | Preserve comments in output                    |
| `metadata` | boolean | true    | Include timestamp comment in output            |
| `verbose`  | boolean | false   | Enable debug logging                           |

## Limitations

- AutoHotkey is case-insensitive; variable and function names are not case-sensitive.
  **Class names are simulated as case-sensitive:**
  - Class names must start with an uppercase letter.
  - All class identifiers are rendered with uppercase letters replaced by full-width Unicode for AHK v1 case simulation (e.g., `Animal` → `Ａnimal`).
- No support for getter/setter
- Implicit return is supported in common cases (functions, object methods); complex control flows (for/while/if/switch/try) still require explicit `return`
- No true boolean type in AHK; `true`, `false`, `on`, and `off` are syntactic sugar
- Character and number distinction is blurred in AHK; `'0'` is falsy
- `NaN`, `null`, and `undefined` are converted to the empty string `''`
- Optional chaining (`?`) is not supported
- Unsigned right shift (`>>>`) is not supported
- Floor division (`//`) and modulo (`%%`) operators conflict with AHK syntax
- Avoid using `=>` outside classes; pure functions in AHK lack `this`
- `.coffee` files must be UTF-8; `.ahk` files must be UTF-8 with BOM
- Import/export and npm package management are incomplete
- **Array/Object index limitation**: In AHK v1, `[]` is syntactic sugar for `{}` (`[a,b]` equals `{1:a, 2:b}`), and there is no native way to distinguish arrays from objects. The index converter (`__ci__`) assumes arrays use numeric indices and objects use string keys. If you use numeric keys on objects (e.g., `obj[0]`), it will be incorrectly converted to `obj[1]`. Note: In AHK v1, `obj[0]` and `obj["0"]` access **different keys** (numeric vs string). Variables are an exception: `i := "0"; obj[i]` accesses the numeric key (pure numeric strings are auto-converted). Workaround: use `obj["0"]` for string keys, or use Native embedding for direct AHK access.

---

## Language Feature Compatibility

| Feature / Syntax                        | CoffeeScript |     AutoHotkey v1     | coffee-ahk |
| --------------------------------------- | :----------: | :-------------------: | :--------: |
| **coffee-ahk Advantages** (AHK ❌ → ✅) |
| Arrow functions (`->`, `=>`)            |      ✅      |          ❌           |     ✅     |
| Anonymous functions                     |      ✅      | ⚠️ (Func object only) |     ✅     |
| `this` binding with `=>`                |      ✅      |          ❌           |     ✅     |
| Array destructuring                     |      ✅      |          ❌           |     ✅     |
| Object destructuring                    |      ✅      |          ❌           |     🟡     |
| String interpolation (`"#{}"`)          |      ✅      |   ⚠️ (`%var%` only)   |     ✅     |
| Multiline strings (`"""`)               |      ✅      |   ⚠️ (continuation)   |     ✅     |
| `unless` (negated if)                   |      ✅      |          ❌           |     ✅     |
| `until` (negated while)                 |      ✅      |          ❌           |     ✅     |
| Implicit return                         |      ✅      |          ❌           |     🟡     |
| `do` (IIFE)                             |      ✅      |          ❌           |     ✅     |
| Implicit function calls                 |      ✅      |  ⚠️ (commands only)   |     ✅     |
| `import`/`export`                       |      ✅      |    ⚠️ (`#Include`)    |     🟡     |
| **Fully Supported**                     |
| Class declaration & inheritance         |      ✅      |          ✅           |     ✅     |
| Constructor (`__New`)                   |      ✅      |          ✅           |     ✅     |
| `super` / `base`                        |      ✅      |          ✅           |     ✅     |
| Static methods/properties               |      ✅      |          ✅           |     ✅     |
| Function default parameters             |      ✅      |  ✅ (literals only)   |     ✅     |
| `if`/`else`, `switch`/`case`            |      ✅      |          ✅           |     ✅     |
| `for key, value in obj`                 |      ✅      |          ✅           |     ✅     |
| `while`/`loop`                          |      ✅      |          ✅           |     ✅     |
| `break`/`continue`                      |      ✅      |          ✅           |     ✅     |
| `try`/`catch`/`finally`/`throw`         |      ✅      |          ✅           |     ✅     |
| Array/Object literals                   |      ✅      |          ✅           |     ✅     |
| Boolean, Comparison, Logical ops        |      ✅      |          ✅           |     ✅     |
| Bitwise operators (`&\|^~<<>>`)         |      ✅      |          ✅           |     ✅     |
| `new` operator                          |      ✅      |          ✅           |     ✅     |
| Chained method calls                    |      ✅      |          ✅           |     ✅     |
| Native AHK embedding (backticks)        |      ❌      |          ✅           |     ✅     |
| **Partial Support**                     |
| Rest parameters (`...args`)             |      ✅      |     ⚠️ (variadic)     |     🟡     |
| Spread in function calls                |      ✅      |     ⚠️ (variadic)     |     🟡     |
| `typeof`                                |      ✅      |          ❌           |     ✅     |
| `instanceof`                            |      ✅      |          ❌           |     ✅     |
| Chained comparison (`1<y<10`)           |      ✅      |          ❌           |     ✅     |
| Negative indexing (`arr[-1]`)           |      ✅      |          ❌           |     ✅     |
| **Not Supported**                       |
| Optional chaining (`?.`)                |      ✅      |          ❌           |     ❌     |
| Nullish coalescing (`??`)               |      ✅      |          ❌           |     ❌     |
| Getter/Setter                           |      ✅      |    ⚠️ (meta-funcs)    |     ❌     |
| `async`/`await`                         |      ✅      |          ❌           |     ❌     |
| Generator/`yield`                       |      ✅      |          ❌           |     ❌     |
| `Map`/`Set`/`Symbol`                    |      ✅      |          ❌           |     ❌     |

Legend:
✅ Supported & equivalent  🟡 Partially supported / limited  ⚠️ Supported with caveats  ❌ Not supported
