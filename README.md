# coffee-ahk

[English](./README.md) | [中文](./README.zh.md) | [日本語](./README.ja.md)

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
- Partial `node_modules` support: bare imports resolve `./node_modules/<pkg>` via its `package.json` `main` field
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

| Option     | Type    | Default  | Description                                                              |
| ---------- | ------- | -------- | ------------------------------------------------------------------------ |
| `salt`     | string  | auto     | Identifier prefix for generated functions; defaults to a deterministic hash (`s`+base36) of the source path/content |
| `save`     | boolean | true     | Write output to `.ahk` file                                              |
| `string`   | boolean | false    | Treat input as source text and return the compiled string                |
| `comments` | boolean | false    | Preserve comments in output                                              |
| `metadata` | boolean | true     | Include timestamp comment in output                                      |
| `ast`      | boolean | false    | Also write `<name>.ast.json` (requires `save`)                           |
| `coffeeAst`| boolean | false    | Print the CoffeeScript AST (requires `verbose`)                          |
| `verbose`  | boolean | false    | Enable debug logging                                                     |

## Limitations

- AutoHotkey is case-insensitive; variable and function names are not case-sensitive.
  **Class names are simulated as case-sensitive:**
  - Class names must start with an uppercase letter.
  - All class identifiers are rendered with uppercase letters replaced by full-width Unicode for AHK v1 case simulation (e.g., `Animal` → `Ａnimal`).
- No support for getter/setter
- **Single-letter class names are forbidden**: AHK v1 has issues with single-letter class names. All class names must be at least 2 characters long.
- **Implicit return only fires for single-statement bodies**:
  - A function whose body is one statement/expression returns it automatically
  - Multi-statement bodies require an explicit `return`
  - Exception: an `if`/`else if`/`else` chain as the last statement of a function body returns the taken branch's last expression — this also applies in multi-statement bodies and recurses into nested tail `if`s
  - `for`/`while`/`try`/native bodies are never implicitly returned
  - Multi-line braceless object literals produce broken output — use `return { ... }` with braces
- No true boolean type in AHK; `true`, `false`, `on`, and `off` are syntactic sugar
- Character and number distinction is blurred in AHK; `'0'` is falsy
- `NaN`, `null`, and `undefined` are converted to the empty string `''`
- Optional chaining (`?`) is not supported (compiler error)
- Unsigned right shift (`>>>`) is not supported (compiler error)
- `async`/`await` and generators (`yield`) are not supported (compiler error)
- For-loop destructuring (`for [a, b] in arr`) is not supported (compiler error). Workaround: `for item in arr` then `[a, b] = item`
- Nested array destructuring (`[a, [b, c]] = x`) is not supported (compiler error). Workaround: flatten manually
- If-then-else expressions work on the right side of `=`, after `return`/`throw`, and inside parentheses; a missing `else` yields `""`, and `else if` chains compile to right-associative ternaries. Inside call arguments, arrays, index brackets, and object literals they are not supported (compiler error) — assign to a variable first
- Nested if-then-else expressions (`if a then (if b then c else d) else e`) are not supported (compiler error). Workaround: use temporary variables or separate statements
- Postfix forms (`return x if y`, `x++ while c`, `x++ for x in xs`), loop comprehensions, and `for` modifiers (`when`/`by`/`own`) are not supported (compiler error)
- `export` requires file-based compilation — `export` in string input raises a compile error; `export {}` is a legal no-op
- `||`/`&&` are rewritten to value-preserving ternaries only on the right side of `=` when the chain ends in a non-boolean literal (`x = a || "d"` behaves like `x := a ? a : "d"`); elsewhere they keep AHK boolean semantics (0/1)
- Spread calls `f(...args)` compile to `args*`; spreading a member/index expression (`f(...a.b)`) is not supported (compiler error) — assign to a variable first
- `arguments` and `eval` are not supported (compiler error) — use rest parameters (`args...`) or precompute values
- `try`/`switch` in expression position, regex literals (`///...///`), and `debugger` are not supported (compiler error)
- Floor division (`//`) and modulo (`%`, `%%`) operators conflict with AHK syntax (compiler error). Use `Mod(a, b)` instead
- Avoid using `=>` outside classes; pure functions in AHK lack `this`
- `.coffee` files must be UTF-8; `.ahk` files must be UTF-8 with BOM
- Import/export and `node_modules` resolution are incomplete
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
