## 任务

仓库全面现代化：工具链+打包升级、eslint/prettier → oxlint/oxfmt、测试迁移 vitest、编译管线重构。

## 能力评估

- oxlint 1.85 / oxfmt 0.70 / vitest 5.0.1 / typescript 7.0.2 均已发布可用
- e2e fixture 测试（54 个 `.coffee`→`.ahk` 金样本）作为管线重构安全网，先迁移后重构
- fire-keeper 语义保留（文件/glob/argv/exec），未替换为裸 Node API
- 无生命周期缺口

## 计划

1. ~~基线：`pnpm build && pnpm test` 全绿~~ ✓
2. ~~依赖与打包~~ ✓
3. ~~lint/format 迁移~~ ✓
4. ~~vitest 迁移~~ ✓
5. ~~编译管线重构~~ ✓
6. ~~收尾：文档同步、遗留清理、最终验证~~ ✓

## 实际执行记录

- 修复 `pnpm-workspace.yaml` 占位符 `allowBuilds.esbuild`（pnpm 11 设置已迁出 package.json）
- deps: typescript 7.0.2 / vitest 5.0.1 / oxlint 1.85 / oxfmt 0.70 / esbuild 0.28 / @types/node 26 / tsx 4.23 / fire-keeper 0.0.239 / iconv-lite 0.7.3；删 eslint+prettier 全家桶、`@types/cson`、`@types/fs-extra`
- tsconfig: `nodenext` + `verbatimModuleSyntax` + `isolatedModules` + `skipLibCheck` + `include: src/**`；98 文件补 `.js` 扩展名（codemod）；`coffeescript.ts` → `coffeescript.d.ts` ambient 声明
- package.json: `exports` map + `engines.node>=20`；version 改 esbuild `define __VERSION__` 注入（`src/version.ts`）；build 清理改保留完整 `.d.ts` 树（修复发布类型断裂）
- eslint.config.mjs(463行)+prettier → `.oxlintrc.json`(correctness/suspicious) + `.oxfmtrc.json`(semi:false/singleQuote/trailingComma:all)；顺手修 14 警告+1 错误（toReversed/toSorted/no-shadow/死键）
- 测试：`tasks/test/*` → `tests/*.test.ts`（vitest），`tasks/test.ts` wrapper 保留 `pnpm test [name]`/`overwrite` 语义；e2e 改测 src 而非 dist
- renderer: `mapMethod`+`~`hack+`Object.keys` 循环 → `Partial<Record<ItemType, Renderer>>` 直查；`*2` 后缀全清；删死键 async/await/void；`RenderContext` 入 `src/types`
- formatters: `formattersMap`+`formatterOrder` 双清单 → 单一 `formatters` 数组
- entry: `token: undefined as unknown` → `EMPTY_TOKEN` 真实占位
- 清理: coffeelint.json、data/sync/、update-test.js、test-report.md
- 文档: AGENTS.md 行号/命令更新；debug-coffee-ahk skill 同步

## 风险

- ~~TS7 兼容~~ 已验证：`emitDeclarationOnly`+`resolveJsonModule`+nodenext 全过
- ~~`pnpm test overwrite` 语义~~ 已验证：fixture 字节一致

## 当前状态

- 进行中：步骤 6 最终验证
