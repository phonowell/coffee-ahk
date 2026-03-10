import { MODULE_PREFIX } from '../../../constants.js'

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const shapeDataModule = (value: unknown): unknown =>
  isPlainObject(value) ? { ...value, default: value } : { default: value }

export const serializeDataModule = (
  value: unknown,
  salt: string,
  id: number,
): string =>
  `${MODULE_PREFIX}_${salt}_${id} = ${JSON.stringify(shapeDataModule(value))}`
