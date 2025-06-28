/** Token types used in the AST */
export type ItemType =
  | '++'
  | '--'
  | '.'
  | 'boolean'
  | 'bracket' // (){}
  | 'class'
  | 'compare'
  | 'edge' // array-end array-start block-end block-start call-end call-start expression-end expression-start index-end index-start interpolation-end interpolation-start parameter-end parameter-start
  | 'error'
  | 'for'
  | 'for-in' // in of
  | 'function'
  | 'identifier'
  | 'if' // case default else if switch
  | 'logical-operator' // ! && ||
  | 'math'
  | 'native'
  | 'negative' // + -
  | 'new-line'
  | 'number'
  | 'property'
  | 'prototype'
  | 'sign' // , ... : =
  | 'statement' // break continue extends new return throw
  | 'string'
  | 'super'
  | 'this'
  | 'try' // catch finally try
  | 'void'
  | 'while'
