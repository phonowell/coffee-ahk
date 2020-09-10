// interface

type Type = 'function' | 'variable'

// function

class Storage {

  private listFunction: string[] = []
  private listVariable: string[] = []

  clear(): void {
    this.listFunction = []
    this.listVariable = []
  }

  has(
    type: Type,
    name: string
  ): boolean {

    if (type === 'function')
      return this.listFunction.includes(name)

    if (type === 'variable')
      return this.listVariable.includes(name)

    return false
  }

  push(
    type: Type,
    name: string
  ): this {

    if (this.has(type, name)) return this

    if (type === 'function')
      this.listFunction.push(name)
    else if (type === 'variable')
      this.listVariable.push(name)
    return this
  }
}

// export
export default new Storage()