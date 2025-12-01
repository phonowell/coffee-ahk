import { glob, read, write } from 'fire-keeper'

const main = async () => {
  const listSource = await glob(['./src/**/*.ts'])

  for (const source of listSource) {
    const content = await read<string>(source)
    if (!content) continue

    // Convert multi-line JSDoc to single-line where applicable
    const lines = content.split('\n')
    const result: string[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line?.trim()

      // Check if this is a multi-line JSDoc that can be single-line
      if (trimmed === '/**') {
        const indent = line?.match(/^(\s*)/)?.[1] ?? ''
        const nextLine = lines[i + 1]
        const nextTrimmed = nextLine?.trim()
        const closeLine = lines[i + 2]
        const closeTrimmed = closeLine?.trim()

        // Pattern: /** \n * comment \n */
        if (
          nextTrimmed?.startsWith('* ') &&
          !nextTrimmed.startsWith('* @') &&
          closeTrimmed === '*/'
        ) {
          const comment = nextTrimmed.slice(2) // Remove "* "
          result.push(`${indent}/** ${comment} */`)
          i += 3
          continue
        }
      }

      result.push(line ?? '')
      i++
    }

    const newContent = result.join('\n')
    if (newContent !== content) {
      await write(source, newContent)
      console.log(`Updated: ${source}`)
    }
  }
}

export default main
