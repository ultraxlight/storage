/**
 * @file 
 */

import type { Create, Get, Item, Remove, RemoveAll } from './types.ts'

export const create: Create = (partialItem) => {
  const item = { id: crypto.randomUUID(), ...partialItem }

  localStorage.setItem(item.id, JSON.stringify(item))

  return item
}

export const get: Get = <Schema extends Item>(id?: string) => {
  if (id) {
    const listItem = localStorage.getItem(id)

    if (listItem) {
      return JSON.parse(listItem)
    } else return null
  }

  const listItems: Schema[] = Object.values({ ...localStorage }).map((str) =>
    JSON.parse(str)
  )

  return listItems
}

export const remove: Remove = <Schema extends Item>(id: string) => {
  const item = get<Schema>(id)

  localStorage.removeItem(id)

  return item
}

export const removeAll: RemoveAll = <Schema extends Item>() => {
  const items = get<Schema>()

  localStorage.clear()

  return items
}

export default {
  create,
  get,
  remove,
  removeAll,
}
