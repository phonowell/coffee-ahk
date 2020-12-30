import $ from 'fire-keeper'
import include_ from './include'

// function

async function main_(
  source: string
): Promise<string> {

  let src = source

  const extname = '.coffee'
  if (!src.endsWith(extname)) src += extname

  const content = await include_(
    await $.read_(src) as string,
    src
  )

  if (!content)
    throw new Error(`invalid source '${src}'`)

  return content
}

// export
export default main_
