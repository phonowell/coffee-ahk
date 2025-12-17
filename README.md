# coffee-ahk

Translate `coffeescript` to `ahk`.

[Documentation](./docs/documentation.md) | [文档](./docs/cn/documentation.md) | [AI Agent 使用指南](./USAGE.md)

> **For AI Agents**: See [USAGE.md](./USAGE.md) for a comprehensive guide on writing CoffeeScript for AHK transpilation. The document is in Chinese, but AI agents can read and understand it without issues.

## Features

- Transpiles CoffeeScript to AutoHotkey v1 scripts
- Supports class syntax, inheritance, and method binding
- Import/export syntax for modules (including `.coffee`, `.ahk`, `.json`, `.yaml`)
  - `import './module'` (side-effect), `import m from './module'` (default), `import { a, b } from './module'` (named), `import m, { a } from './module'` (mixed)
  - `export default` (single expression, multiline block, or object literal)
  - `export { named, exports }` (named exports with optional key-value pairs)
  - Recursive import resolution and namespace isolation
- Partial npm package management support (install and import local/third-party modules)
- Functional programming support; functions are first-class citizens
- Arrow functions (`->`, `=>`) and `this` binding
- Function parameter binding, default values, and rest parameters
- Destructuring assignment for arrays and objects
- Supports various syntactic sugar, such as destructuring, splats, chained comparisons, negative indexing, and if-then-else expressions
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
- **Single-letter class names are forbidden**: AHK v1 has issues with single-letter class names. All class names must be at least 2 characters long.
- **Implicit return is limited**:
  - Maximum 2 newlines (3 lines of code) for regular functions
  - Maximum 1 newline (2 lines) for object literals without braces
  - Functions with `for`/`if`/`while`/`try` as last statement require explicit `return`
  - Exceeding these limits requires explicit `return` statement
- No true boolean type in AHK; `true`, `false`, `on`, and `off` are syntactic sugar
- Character and number distinction is blurred in AHK; `'0'` is falsy
- `NaN`, `null`, and `undefined` are converted to the empty string `''`
- Optional chaining (`?`) is not supported (compiler error)
- Unsigned right shift (`>>>`) is not supported (compiler error)
- `async`/`await` and generators (`yield`) are not supported (compiler error)
- For-loop destructuring (`for [a, b] in arr`) is not supported (compiler error). Workaround: `for item in arr` then `[a, b] = item`
- Nested array destructuring (`[a, [b, c]] = x`) is not supported (compiler error). Workaround: flatten manually
- Nested if-then-else expressions (`if a then (if b then c else d) else e`) are not supported (compiler error). Workaround: use temporary variables or separate statements
- Floor division (`//`) and modulo (`%%`) operators conflict with AHK syntax (compiler error)
- Avoid using `=>` outside classes; pure functions in AHK lack `this`
- `.coffee` files must be UTF-8; `.ahk` files must be UTF-8 with BOM
- Import/export and npm package management are incomplete
- **Class + Export conflict**: AHK v1 classes must be defined at top-level (not inside functions/closures). Since exported modules are wrapped in `do ->` for scope isolation, classes cannot be exported directly. Workaround: define classes in separate files without `export`, then use side-effect imports (`import './myclass'`) to include them at top-level.
- **Array/Object index limitation**: In AHK v1, `[]` is syntactic sugar for `{}` (`[a,b]` equals `{1:a, 2:b}`), and there is no native way to distinguish arrays from objects. The index converter (`ℓci`) assumes arrays use numeric indices and objects use string keys. If you use numeric keys on objects (e.g., `obj[0]`), it will be incorrectly converted to `obj[1]`. Note: In AHK v1, `obj[0]` and `obj["0"]` access **different keys** (numeric vs string). Variables are an exception: `i := "0"; obj[i]` accesses the numeric key (pure numeric strings are auto-converted). Workaround: use `obj["0"]` for string keys, or use Native embedding for direct AHK access.
- **Native variable references**: Inside functions, Native code automatically uses temporary variables (`λ_var`) to bridge closure variables. Before a Native block: `λ_var := λ.var`, after: `λ.var := λ_var`. This allows AHK commands like `Sort`, `StringUpper` to work with simple variables.

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
| If-then-else expr (`if a then b else c`)|      ✅      |          ❌           |     ✅     |
| **Not Supported**                       |
| Optional chaining (`?.`)                |      ✅      |          ❌           |     ❌     |
| Nullish coalescing (`??`)               |      ✅      |          ❌           |     ❌     |
| Getter/Setter                           |      ✅      |    ⚠️ (meta-funcs)    |     ❌     |
| `async`/`await`                         |      ✅      |          ❌           |     ❌     |
| Generator/`yield`                       |      ✅      |          ❌           |     ❌     |
| `Map`/`Set`/`Symbol`                    |      ✅      |          ❌           |     ❌     |

Note: Features marked ❌ in the coffee-ahk column will produce a **compiler error** with a helpful message.

Legend:
✅ Supported & equivalent  🟡 Partially supported / limited  ⚠️ Supported with caveats  ❌ Not supported
