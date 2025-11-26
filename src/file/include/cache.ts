// Cache and utility functions for include processing

type ModuleMeta = {
  id: number
  content: string
  dependencies: string[]
}

const cache = new Map<string, ModuleMeta>()

let cacheSalt = ''
let idModule = 0

export const getCache = () => cache
export const setCacheSalt = (salt: string) => {
  cacheSalt = salt
}
export const getCacheSalt = () => cacheSalt
export const getNextModuleId = () => ++idModule

export const clearCache = () => {
  cache.clear()
  idModule = 0
}

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
 * Topologically sort modules by dependencies
 * Throws descriptive error on circular dependency
 */
export const sortModules = (): string[] => {
  // Build dependency graph: source -> modules it depends on
  const deps = new Map<string, string[]>()
  for (const [source, { dependencies }] of cache) {
    const validDeps = dependencies.filter((dep) => cache.has(dep))
    deps.set(source, validDeps)
  }

  // Check for circular dependencies
  const cycle = detectCycle(deps)
  if (cycle) {
    const cycleStr = cycle.map((p) => `  → ${p}`).join('\n')
    throw new Error(`ahk/file: circular dependency detected:\n${cycleStr}`)
  }

  // Build reverse graph: source -> modules that depend on it
  const dependents = new Map<string, string[]>()
  for (const source of deps.keys()) dependents.set(source, [])
  for (const [source, depList] of deps)
    for (const dep of depList) dependents.get(dep)?.push(source)

  // Kahn's algorithm: in-degree = number of dependencies (not dependents)
  const inDegree = new Map<string, number>()
  for (const [source, depList] of deps) inDegree.set(source, depList.length)

  // Start with modules that have no dependencies (leaves)
  const queue: string[] = []
  for (const [source, degree] of inDegree) if (degree === 0) queue.push(source)

  const sorted: string[] = []
  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) continue

    const meta = cache.get(current)
    if (meta) sorted.push(meta.content)

    // Reduce in-degree of modules that depend on current
    for (const dependent of dependents.get(current) ?? []) {
      const newDegree = (inDegree.get(dependent) ?? 1) - 1
      inDegree.set(dependent, newDegree)
      if (newDegree === 0) queue.push(dependent)
    }
  }

  return sorted
}
