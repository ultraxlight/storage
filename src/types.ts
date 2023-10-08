export interface Item {
  id: string
}

export interface Init {
  // deno-lint-ignore no-explicit-any
  (initObject?: { [key: string]: any }): Promise<void>
}

/**
 * Create Item
 * @param {Object} Partial Item
 * @returns {Schema} Item object
 */
export interface Create {
  <Schema extends Item>(
    partialItem?: Partial<Schema>,
  ): Promise<Schema>
}

/**
 * Get a single Item from storage
 * @param {string} id ID of item to retrieve
 * @returns {null|Item} Item or null
 */
export interface Get {
  <Schema extends Item>(id: string): Promise<null | Schema>
}

/**
 * Get all Items from storage
 * @returns {Item[]} Items
 */
export interface GetAll {
  <Schema extends Item>(): Promise<Schema[]>
}

/**
 * Update an Item in storage
 * @param {string} id Item ID
 * @param {Object} update Data to update
 * @returns {Item} UpdItem not found
 * @throws Will throw an error if Item not found
 */
export interface Update {
  <Schema extends Item>(
    id: string,
    update: Partial<Schema>,
  ): Promise<Schema>
}

/**
 * Remove an item from storage
 * @param {string} id ID of item to remove
 * @returns {Item|null}
 */
export interface Remove {
  <Schema extends Item>(id: string): Promise<Schema | null>
}

/**
 * Remove ALL items
 * @returns {Item[]}
 */
export interface RemoveAll {
  <Schema extends Item>(): Promise<Schema[] | null>
}

export default interface Storage {
  create: Create
  get: Get
  getAll: GetAll
  init: Init
  remove: Remove
  removeAll: RemoveAll
  update: Update
}
