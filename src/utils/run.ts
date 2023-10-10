// function

/**
 * Executes the provided function and returns its result.
 * @param fn The function to execute.
 * @returns The result of the provided function.
 */
const run = <T>(fn: (...args: unknown[]) => T) => fn()

// export
export default run
