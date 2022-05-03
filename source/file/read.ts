import $read from 'fire-keeper/read'
import include from './include'

// function

const main = async (
  source: string,
): Promise<string> => {

  let src = source

  const extname = '.coffee'
  if (!src.endsWith(extname)) src += extname

  const content = await include(
    await $read<string>(src),
    src
  )

  if (!content) throw new Error(`invalid source '${src}'`)

  return content
}

// export
export default main