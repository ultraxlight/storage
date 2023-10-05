/**
 * @file
 */

import type { Create, Get, GetAll, Item, Remove, RemoveAll } from '../src/types.ts'

interface Database<Schema extends Item> {
  [id: string]: Schema
}

let DB = {};

const getDB = <Schema extends Item>(): Database<Schema> => {
  if(!Object.keys(DB).length){
    const initDB: Database<Schema> = {}
    DB = initDB
  }

  return DB
}

export const create: Create = <Schema extends Item>(partialItem?: Partial<Schema>) => {
  const DB = getDB<Schema>()
  const item = { id: crypto.randomUUID(), ...partialItem }

  DB[item.id] = item as Schema

  return item
}

export const get: Get = <Schema extends Item>(id: string) => {
  const DB = getDB<Schema>()
  const listItem = DB[id]

  if (listItem) {
    return listItem
  }

  return null
}

export const getAll: GetAll = <Schema extends Item>() => {
  const listItems: Schema[] = Object.values(DB)

  return listItems
}

export const remove: Remove = <Schema extends Item>(id: string) => {
  const DB = getDB<Schema>()
  const item = get<Schema>(id)

  delete DB[id]

  return item
}

export const removeAll: RemoveAll = <Schema extends Item>() => {
  const DB = getDB<Schema>()
  const items = Object.values(DB)

  return items
}

export default {
  create,
  get,
  remove,
  removeAll,
}