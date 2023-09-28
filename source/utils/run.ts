// function

const run = <T>(fn: (...args: unknown[]) => T) => fn()

// export
export default run
