import $ from 'fire-keeper'

// function

const main = async () => {
  const content = await $.read('./data/forbidden.yaml')
  await $.write('./data/forbidden.json', content)
}

// export
export default main
