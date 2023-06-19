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

/**
 * Get a single Item from storage
 * @param {string} id ID of item to retrieve
 * @returns {null|Item} Item or null
 */
export interface Get {
  <Schema extends Item>(id: string): null | Schema
}

/**
 * Get all Items from storage
 * @returns {Item[]} Items
 */
export interface Get {
  <Schema extends Item>(): Schema[]
}

/**
 * Remove an item from storage
 * @param {string} id ID of item to remove
 * @returns {Item|null}
 */
export type Remove = <Schema extends Item>(id: string) => Schema | null

/**
 * Remove ALL items
 * @returns {Item[]}
 */
export type RemoveAll = <Schema extends Item>() => Schema[] | null
