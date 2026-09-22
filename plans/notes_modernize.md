## 记录

- 基线：e2e 54/54 · unit 20/20 · error 19/19（旧 runner）
- pnpm 11 不再读 package.json 的 `pnpm` 字段 → `pnpm-workspace.yaml` `allowBuilds`；该文件原有占位符 `set this to true or false` 导致 esbuild build script 被拒
- nodenext 迁移：98 文件补 `.js` 扩展名（`tmp/add-extensions.mjs` codemod，已删）；`import 'dir'` 需 `dir/index.js`；JSON import 需 `with { type: 'json' }`
- `src/types/coffeescript.ts` 的 `declare module` augmentation 在 nodenext 下失效 → 改 `.d.ts` ambient + `import type * as cs`
- `import { version } from '../package.json'` 两处（index.ts/write.ts）→ esbuild `define __VERSION__` + `src/version.ts`，tsx/vitest 下回退 '0.0.0-dev'
- 修复存量 bug：`dist` 清理删掉嵌套 `.d.ts` → 发布类型断裂；改 `remove(['./dist/**/*.js','!./dist/index.js'])`
- oxlint 修复：`args.reverse()`→`toReversed()`、`sort`→`toSorted()`、no-shadow 改名、`_` 前缀变量改名、`hasNestedIf` 提升模块级、`__VERSION__` 加 allow
- renderer 死键确认：ItemTypeMap 无 async/await，`await` 在 forbidden formatter 抛错；`void` 项由 `Content.reload()` 过滤不到 render 层 → 三键均删
- `while` item value 恒为 'while'（formatter 归一 loop/until）→ `'while '` 字面量正确
- vitest：测试 import `src/`（不经 dist）；`tasks/test.ts` wrapper 解析 argv 置 `UPDATE_FIXTURES`/`TEST_TARGET` env 后 `exec('vitest run')`，exec 不 throw 需查返回码
- AGENTS.md 已实体化，CLAUDE.md 删除
- `node dist/index.js <file>` 是文档幻觉：dist 无 CLI，仅 API export
- 遗留清理：coffeelint.json（kokoro 模板同步物）、data/sync/、update-test.js、test-report.md、tasks/update.ts 的过期 dep 清单
- 最终：tsc7+esbuild0.28 build ✓ / vitest 94 ✓ / oxlint 0 warn / oxfmt clean
