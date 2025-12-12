---
name: fire-keeper-guide
description: 提供 fire-keeper 常用 API 和最佳实践参考，use when working with file operations, path handling, or using fire-keeper library
allowed-tools: Read, Grep, Glob
---

# Fire Keeper Guide

fire-keeper API 参考和最佳实践。

## 何时使用

文件操作 / 路径处理 / 需要 fire-keeper API 参考时

**效率优先**：直接使用 Read/Glob/Grep 工具，避免调用 Task 工具

## 核心原则

优先用 fire-keeper · 禁止手动拼接路径 · 使用 Node.js `path` 标准库 · 利用上下文节省 tokens

## 常用 API

### 路径处理

```ts
import { normalizePath, getName } from 'fire-keeper'
import { join, relative } from 'node:path'

normalizePath('./src')           // 规范化（支持 ~、./、../）
join(base, 'file.ts')             // 拼接路径
relative('/a/b', '/a/b/c/d')      // 获取相对路径 'c/d'
getName('path/to/file.txt')       // { basename, dirname, extname, filename }

// ❌ 禁止手动拼接：`${base}/${path}` 或 path.slice()
```

### 文件操作

```ts
import { glob, read, write, copy, clean, isExist, isSame, exec, prompt } from 'fire-keeper'

glob('src/**/*.ts')               // 查找（默认绝对路径）
read<T>('config.yaml')            // 读取（自动解析 YAML/JSON）
write('output.json', data)        // 写入（自动创建目录）
copy('src.txt', '/dest', 'new')   // 复制
clean('file') / isExist('file') / isSame(['a', 'b'])

exec('git status')                // 执行并返回输出
prompt({ type: 'confirm', message: '?' })  // 交互
```

## 双向同步模式

```ts
const cwd = process.cwd()
const sourceBase = normalizePath(join(cwd, base))
const targetBase = normalizePath(join(cwd, '../target', base))

const [sourceFiles, targetFiles] = await Promise.all([
  glob(join(sourceBase, '**/*')),
  glob(join(targetBase, '**/*')),
])

// Map 收集，自动去重
const filesToSync = new Map<string, { source: string; target: string }>()

for (const src of sourceFiles) {
  const rel = relative(sourceBase, src)
  filesToSync.set(rel, { source: src, target: join(targetBase, rel) })
}

for (const tgt of targetFiles) {
  const rel = relative(targetBase, tgt)
  if (!filesToSync.has(rel)) {
    filesToSync.set(rel, { source: join(sourceBase, rel), target: tgt })
  }
}
```

## 反模式对照

| ❌ 错误 | ✅ 正确 |
|-------|--------|
| `` `${base}/${path}` `` | `join(base, path)` |
| `path.slice(cwd.length + 1)` | `relative(cwd, path)` |
| `base !== '.' ? ${base}/ : ''` | 直接用 `join()` |
| `path.startsWith('./') ? path.slice(2)` | `normalizePath(path)` |
| 手动解析路径 | `getName(path)` |
