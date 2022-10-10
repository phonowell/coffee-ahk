import include from './include'

// function

const main = async (source: string, salt: string): Promise<string> => {
  let src = source

  const extname = '.coffee'
  if (!src.endsWith(extname)) src += extname

  const content = await include(src, salt)
  if (!content) throw new Error(`invalid source '${src}'`)

  return content.replace(/\r/g, '')
}

// export
export default main
