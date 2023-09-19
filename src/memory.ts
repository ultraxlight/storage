/**
 * @file
 */

import type { Create, Get, GetAll, Item, Remove, RemoveAll } from './types.ts'

let DB: { [id: string]: Item } = {}

export const create: Create = (partialItem) => {
  const item = { id: crypto.randomUUID(), ...partialItem }

  DB[item.id] = item

  return item
}

export const get: Get = (id: string) => {
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
  const item = get<Schema>(id)

  delete DB[id]

  return item
}

export const removeAll: RemoveAll = () => {
  const items = DB

  DB = {}

  return items
}

export default {
  create,
  get,
  remove,
  removeAll,
}
