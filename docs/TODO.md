void 机制现状

使用位置 (7处创建 + 4处标记):

| 位置               | 操作           | 目的                       |
| ------------------ | -------------- | -------------------------- |
| context.ts:32,74   | 创建 void item | 参数默认值处理时占位       |
| calls.ts:24,25,33  | 标记/创建 void | Native() 转换时移除原token |
| prepend-this.ts:18 | 标记 void      | constructor 移除逗号       |
| pick-item.ts:27    | 标记 void      | 匿名函数提取时移除原位置   |

清理位置 (1处):

- Content.reload() - list.filter((it) => !it.is('void')) 过滤所有 void 项

机制特征对比

| 维度          | void标记机制             | 直接移除         |
| ------------- | ------------------------ | ---------------- |
| 执行时机      | 延迟(需调用reload)       | 立即             |
| 中间状态      | 包含void项(length不准确) | 始终干净         |
| 循环安全      | 可在forEach中标记        | 需倒序/filter    |
| 代码分散度    | 标记分散+集中清理        | 操作即清理       |
| 类型系统      | 引入非语义类型'void'     | 无额外类型       |
| 调试可见性    | toArray()包含void        | 直接可见最终状态 |
| Agent理解成本 | 需理解标记-清理两阶段    | 单步操作         |

实际障碍

对Agent的影响:

1. content.length 在 reload 前包含 void 项，计数不准
2. 中间状态遍历会遇到 void，需跳过逻辑(如 next.ts:30)
3. 必须记住在流程末尾调用 reload，否则 void 残留

典型模式:
// 当前: 31个文件需记住调用 reload
content.toArray().forEach((item) => {
if (condition) item.type = 'void'
})
content.reload() // 忘记则失败

// 替代:
const filtered = content.toArray().filter((item) => !condition)
content.reload(filtered)

迁移可行性

所有使用场景可改为：

- forEach 遍历标记 → filter 收集保留项
- 递归标记 → 仅克隆需要项
- 占位 void → 不添加

无技术阻塞，改动范围: 4个文件核心逻辑 + 删除 Content.ts:53 过滤
