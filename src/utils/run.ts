// function

/**
 * Runs the provided function and returns its result.
 * @template T - The return type of the provided function.
 * @param {(...args: unknown[]) => T} fn - The function to run.
 * @returns {T} - The result of running the provided function.
 */
const run = <T>(fn: (...args: unknown[]) => T): T => fn()

// export
export default run
