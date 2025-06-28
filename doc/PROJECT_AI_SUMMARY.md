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

## 4. Constraints

- No support: optional chaining, getter/setter, implicit return, NaN/null/undefined (all → ''), full import/export, npm
- AHK v1: no property accessors, no real module system, no boolean type (true/false/on/off = sugar)
- .coffee: UTF-8; .ahk: UTF-8 with BOM
- Export in CoffeeScript is simulated (downgraded to return/closure var)

## 5. Import Handling

- `import 'xxx'`: Target file content is directly inserted into global scope of output (e.g. `import './includes/lodash'` → `lodash = {}` in output)
- `import entry from 'xxx'`: Generates `entry = __SALT_module_ID__`, imported file is inserted as a module, referenced by variable
- `import { x } from 'xxx'`: Generates property binding (e.g. `x := __object__["x"]`), content inserted as module
- All import dependencies are processed recursively, deduped, handled by source-resolver/transformers
- No real module scope or export mechanism is simulated

## 6. Types/Artifacts

- Input: `.coffee` text/path
- Intermediate: AST, formatting objects, logs
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
