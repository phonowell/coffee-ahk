import $ from 'fire-keeper'
import include_ from './include'

// function

async function main_(
  source: string
): Promise<string> {

  const extname = '.coffee'
  if (!source.endsWith(extname)) source += extname

  const content = await include_(
    await $.read_(source) as string,
    source
  )

  if (!content)
    throw new Error(`invalid source '${source}'`)

  return content
}

// export
export default main_