// Per-compilation module registry for include processing
import { createTranspileError, ErrorType } from '../../utils/error.js'

export type ModuleMeta = {
  id: number
  source: string
  content: string
  originalContent: string
  dependencies: string[]
}

export type FileMapping = { file: string; line: number; content: string }

/**
 * Detect circular dependencies using DFS
 * Returns the cycle path if found, undefined otherwise
 */
const detectCycle = (graph: Map<string, string[]>): string[] | undefined => {
  const visiting = new Set<string>()
  const visited = new Set<string>()
  const path: string[] = []

  const dfs = (node: string): string[] | undefined => {
    if (visiting.has(node)) {
      // Found cycle - return the cycle path
      const cycleStart = path.indexOf(node)
      return [...path.slice(cycleStart), node]
    }
    if (visited.has(node)) return undefined

    visiting.add(node)
    path.push(node)

    for (const dep of graph.get(node) ?? []) {
      const cycle = dfs(dep)
      if (cycle) return cycle
    }

    path.pop()
    visiting.delete(node)
    visited.add(node)
    return undefined
  }

  for (const node of graph.keys()) {
    const cycle = dfs(node)
    if (cycle) return cycle
  }
  return undefined
}

/**
 * Module registry scoped to a single transpile() call.
 * A fresh instance per call keeps concurrent compiles isolated.
 */
export class IncludeContext {
  readonly cache = new Map<string, ModuleMeta>()
  private idCounter = 0

  constructor(readonly salt: string) {}

  nextId(): number {
    return ++this.idCounter
  }

  /**
   * Topologically sort modules by dependencies (Kahn's algorithm).
   * Single source of ordering for both sortModules() and getLineMapping().
   * Throws descriptive error on circular dependency.
   */
  topoSort(): ModuleMeta[] {
    const { cache } = this

    // Build dependency graph: source -> modules it depends on
    const deps = new Map<string, string[]>()
    for (const [source, { dependencies }] of cache) {
      const validDeps = dependencies.filter((dep) => cache.has(dep))
      deps.set(source, validDeps)
    }

    const cycle = detectCycle(deps)
    if (cycle) {
      const cycleStr = cycle.map((p) => `  → ${p}`).join('\n')
      throw createTranspileError(
        ErrorType.FILE_ERROR,
        `circular dependency detected:\n${cycleStr}`,
        `Refactor imports to remove circular dependencies`,
      )
    }

    // Build reverse graph: source -> modules that depend on it
    const dependents = new Map<string, string[]>()
    for (const source of deps.keys()) dependents.set(source, [])
    for (const [source, depList] of deps)
      for (const dep of depList) dependents.get(dep)?.push(source)

    // In-degree = number of dependencies (not dependents)
    const inDegree = new Map<string, number>()
    for (const [source, depList] of deps) inDegree.set(source, depList.length)

    // Start with modules that have no dependencies (leaves)
    const queue: string[] = []
    for (const [source, degree] of inDegree) if (degree === 0) queue.push(source)

    const sorted: ModuleMeta[] = []
    for (let head = 0; head < queue.length; head++) {
      const current = queue[head]
      if (!current) continue

      const meta = cache.get(current)
      if (meta) sorted.push(meta)

      // Reduce in-degree of modules that depend on current
      for (const dependent of dependents.get(current) ?? []) {
        const newDegree = (inDegree.get(dependent) ?? 1) - 1
        inDegree.set(dependent, newDegree)
        if (newDegree === 0) queue.push(dependent)
      }
    }

    return sorted
  }

  /** Sorted module contents in dependency order. */
  sortModules(): string[] {
    return this.topoSort().map((meta) => meta.content)
  }

  /** Merged line number -> {file, line, content} for error reporting. */
  getLineMapping(): FileMapping[] {
    const mapping: FileMapping[] = []
    for (const meta of this.topoSort()) {
      meta.content.split('\n').forEach((line, i) => {
        mapping.push({ file: meta.source, line: i + 1, content: line })
      })
    }
    return mapping
  }
}
