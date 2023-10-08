/**
 * @file
 */

import type {
  Create,
  Get,
  GetAll,
  Init,
  Item,
  Remove,
  RemoveAll,
  Update,
} from '../src/types.ts'

interface Database<Schema extends Item> {
  [id: string]: Schema
}

let DB = {}

const getDB = <Schema extends Item>(): Database<Schema> => {
  if (!Object.keys(DB).length) {
    const initDB: Database<Schema> = {}
    DB = initDB
  }

  return DB
}

export const init: Init = () => Promise.resolve()

export const create: Create = <Schema extends Item>(
  partialItem?: Partial<Schema>,
) => {
  const DB = getDB<Schema>()
  const item = { id: crypto.randomUUID(), ...partialItem } as Schema

  DB[item.id] = item

  return Promise.resolve(item)
}

export const get: Get = <Schema extends Item>(id: string) => {
  const DB = getDB<Schema>()
  const listItem: Schema | null = DB[id] || null // as Schema

  return Promise.resolve(listItem) as Promise<Schema | null>
}

export const getAll: GetAll = <Schema extends Item>() => {
  const DB = getDB<Schema>()
  const listItems: Schema[] = Object.values(DB)

  return Promise.resolve(listItems)
}

export const update: Update = async <Schema extends Item>(
  id: string,
  update: Partial<Schema>,
) => {
  const DB = getDB<Schema>()
  const item = await get<Schema>(id)

  if (item) {
    const updatedItem = { ...item, ...update } as Schema
    DB[id] = updatedItem

    return Promise.resolve(updatedItem)
  } else {
    return Promise.reject(Error(`Item with ID: '${id}' not found`))
  }
}

export const remove: Remove = <Schema extends Item>(id: string) => {
  const DB = getDB<Schema>()
  const item = get<Schema>(id)

  delete DB[id]

  return item
}

export const removeAll: RemoveAll = async <Schema extends Item>() => {
  const items = Object.values(await getDB<Schema>())

  DB = {}

  return items
}

export default {
  create,
  get,
  getAll,
  init,
  remove,
  removeAll,
  update,
}
