# PROJECT_AI_SUMMARY.md (FOR AI AGENTS — PROJECT DIRECTORY & GUIDE)

> **NOTICE: FOR AI AGENT REFERENCE ONLY. NOT FOR HUMANS.**
>
> 1. This file is a quick-start and directory for AI agents.
> 2. It summarizes structure, modules, and constraints, but does NOT replace actual source code.
> 3. After major changes, update this file, but always verify with real code.
> 4. All output targets AutoHotkey v1.
> 5. This document MUST use simple, clear English.

---

## 1. Overview

Transpiles CoffeeScript to AutoHotkey v1. TypeScript. API only.

## 2. Data Flow

- Input: `.coffee` file/string
- Read: `src/file/read.ts`
- Parse/Transform: `src/entry/index.ts`, `src/formatters/`, `src/processors/`
- Output: `.ahk` via `src/file/write.ts`
- Logging: `src/logger/index.ts`

## 3. Modules

- `src/formatters/`: Syntax mapping (function, class, array, etc.)
- `src/processors/`: Advanced transforms (destructuring, class, etc.)
- `src/models/`, `src/types/`: Core types (`Content`, `Item`, `Scope`)
- `src/file/`: IO, cache, source resolution
- `src/logger/`: Logging
- `src/formator/`: Function formatting
- `src/picker/`: Code selection/combination
- `src/renderer/`: Output rendering
- `src/utils/`: Helpers
- `data/`: Config, forbidden, sync rules
- `script/test/`: Test cases (.coffee/.ahk)

## 3.1. formatters vs processors

### src/formatters/

- **Purpose:** Responsible for formatting and transforming each token or small code fragment into a standard AST item.
- **Granularity:** Fine-grained, processes one token at a time.
- **Typical usage:** Handles left-to-right token conversion, e.g. operators, if, for, property, etc. Each formatter decides how to convert a token and append it to `content`.
- **Return value:** Usually returns a boolean to indicate if the token was handled.
- **Example:** `operator.ts` converts `a ||= b` to `if (!a) a = b` during token processing.

### src/processors/

- **Purpose:** Responsible for global, batch, or structural post-processing of the entire content list after all tokens have been formatted.
- **Granularity:** Coarse-grained, processes the whole content list.
- **Typical usage:** Performs batch filtering, reordering, merging, or advanced transforms (e.g. destructuring, for-in expansion) that require knowledge of the full code context.
- **Return value:** Usually void; modifies the content list in place.
- **Example:** `object/deconstruct.ts` rewrites destructuring assignments after all tokens are processed.

### Summary

- **formatters**: Per-token, left-to-right, structure-building, suitable for syntax sugar and direct token-to-item mapping.
- **processors**: Whole-content, post-processing, suitable for global transforms, batch rewrites, or context-dependent logic.

## 4. Constraints

- No support: optional chaining, getter/setter, implicit return, NaN/null/undefined (all → ''), full import/export, npm
- AHK v1: no property accessors, no real module system, no boolean type (true/false/on/off = sugar)
- .coffee: UTF-8; .ahk: UTF-8 with BOM
- Export in CoffeeScript is simulated (downgraded to return/closure var)

## 5. Import Handling

- `import 'xxx'`:
  - If importing a `.coffee` file, its content is wrapped in a closure before insertion.
  - Other file types are inserted without closure wrapping.
  - Example: `import './includes/lodash'` → `lodash = {}` in output.
- `import entry from 'xxx'`:
  - Generates `entry = __SALT_module_ID__.default`, where the imported file (including `.coffee`, `.json`, `.yaml`) is assigned to a salt-based variable and always returns an object.
  - `.json`/`.yaml` files are stringified and imported as CoffeeScript objects.
- `import { x } from 'xxx'`:
  - Generates property binding (e.g. `x = __SALT_module_ID__.x`), content inserted as module.
- `import entry, { x, y } from 'xxx'`:
  - Supports mixed default and named imports. Generates `entry = __SALT_module_ID__.default`, `x = __SALT_module_ID__.x`, `y = __SALT_module_ID__.y`.
- All import dependencies are processed recursively, deduped, and tracked via a cache mechanism.
- No real module scope or export mechanism is simulated.
- All exports are unified as a returned object at the end of the module, e.g. `return { default: foo, a: a, b: bar() }`. If only default is exported, returns `{ default: foo }`.

## 6. Types/Artifacts

- Input: `.coffee`, `.ahk`, `.json`, `.yaml` text/path
- Intermediate: AST, formatting objects, logs, cache (for deduplication and transformation state)
- Output: `.ahk` text/file
- Key types: `Content`, `Item`, `Scope`

## 7. Test Coverage

- All test cases in `script/test/`. Each `.coffee` must have a corresponding `.ahk` (1:1 mapping).
- Test runner: transpiles each `.coffee`, compares output to `.ahk`. Mismatch prints both and throws error.
- Commands:
  - `pnpm test` — Run all tests in batch (compare all pairs)
  - `pnpm test xxx` — Run single test (e.g. `pnpm test array` → `array.coffee` vs `array.ahk`)
  - `pnpm test overwrite` — Overwrite all `.ahk` files with current transpiler output (danger: replaces expected outputs)
- Strict mapping and output validation enforced.

## 8. Maintenance

- After any structure/core/config change, update this file. Always verify with real code.

## 9. Transformation Logic & Constraints

- Only `.coffee`, `.ahk`, `.json`, `.yaml` are supported for transformation.
- Transformation is recursive and cache-driven: all files and their dependencies are processed until completion.
- All export statements are collected and removed from the code body; a single return statement is appended at the end of the module closure, returning an object with all exported members (default and named).
- `.ahk` files are wrapped in code blocks in the output.
- Salt-based variable naming is used for all imported modules.
