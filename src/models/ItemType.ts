/**
 * Strict type-value mapping for AST items.
 * Each item type has a defined set of allowed values.
 */

/** Type-value mapping definition */
export type ItemTypeMap = {
  '++': '++'
  '--': '--'
  '.': '.'
  boolean: 'false' | 'true'
  bracket: '(' | ')' | '{' | '}-' | '}' | '[' | ']'
  class: string // class name
  compare: '<' | '<=' | '==' | '>' | '>=' | '!=' | 'is' | 'isnt'
  edge:
    | 'array-end'
    | 'array-start'
    | 'block-end'
    | 'block-start'
    | 'call-end'
    | 'call-start'
    | 'expression-end'
    | 'expression-start'
    | 'index-end'
    | 'index-start'
    | 'instanceof-class'
    | 'interpolation-end'
    | 'interpolation-start'
    | 'object-end'
    | 'object-start'
    | 'parameter-end'
    | 'parameter-start'
    | 'typeof-start'
  error: string // error message
  for: 'for'
  'for-in': 'in' | 'of'
  function: string // function name or 'anonymous'
  identifier: string // variable/function name
  if: 'case' | 'default' | 'else' | 'if' | 'switch'
  'logical-operator': '!' | '&&' | '||' | 'and' | 'or' | 'not'
  math:
    | '%'
    | '%='
    | '*'
    | '*='
    | '+'
    | '+='
    | '-'
    | '-='
    | '/'
    | '/='
    | '**'
    | '**='
    | '~'
    | '^'
    | '^='
    | '|'
    | '|='
    | '&'
    | '&='
    | '<<'
    | '<<='
    | '>>'
    | '>>='
    | '>>>'
    | '>>>='
  native: string // raw AHK code
  negative: '+' | '-'
  'new-line': string // indent level as string number
  number: string // numeric literal
  property: string // property name
  prototype: '::'
  sign: ',' | '...' | ':' | '='
  statement:
    | 'break'
    | 'continue'
    | 'extends'
    | 'new'
    | 'return'
    | 'throw'
    | 'export'
  string: string // string literal (with quotes)
  super: 'super'
  this: 'this'
  try: 'catch' | 'finally' | 'try'
  void: string // void marker
  while: 'loop' | 'until' | 'while'
}

/** All item types */
export type ItemType = keyof ItemTypeMap

/** Get value type for a specific item type */
export type ItemValue<T extends ItemType> = ItemTypeMap[T]
