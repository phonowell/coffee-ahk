## 记录

- 初查确认：`pnpm build && pnpm test` 全绿，但 JSON 默认导入协议与生成物不一致。
- `fire-keeper` 读取 `data/forbidden.yaml` 返回的是对象数组，不是原始字符串。
- 当前测试的 “coverage” 只是名称/字符串命中，不是真正覆盖率，后续改为 reachability 描述。
- 数据模块协议已统一为 `{ ...named, default: value }`，默认导入和对象型具名导入现在共存。
- `tasks/test/index.ts` 已拆出 `tasks/test/helpers.ts`，测试入口降到 90 行。
- 最终验证：`pnpm build && pnpm test` 通过；reachability 报告保留 `new-line` 为未映射组件。
