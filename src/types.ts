export interface Item {
  id: string
}

/**
 * Create Item
 * @param {Object} Partial Item
 * @returns {Schema} Item object
 */
export type Create = (
  partialItem?: Record<string, unknown>,
) => { id: string; [key: string]: unknown }

export interface Get {
  <Schema extends Item>(id: string): null | Schema
}

export interface Get {
  <Schema extends Item>(): Schema[]
}

export type Remove = <Schema extends Item>(id: string) => Schema | null

export type RemoveAll = <Schema extends Item>() => Schema[] | null
