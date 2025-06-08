const pad = (str: string, length: number, padString: string = ' '): string => {
  if (str.length >= length) return str
  const totalPadding = length - str.length
  const leftPadding = Math.floor(totalPadding / 2)
  const rightPadding = totalPadding - leftPadding
  return padString.repeat(leftPadding) + str + padString.repeat(rightPadding)
}

export default pad
