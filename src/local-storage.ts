/**
 * @file LocalStorage implementation of Storage
 */

import type {
  Create,
  Get,
  GetAll,
  Item,
  Remove,
  RemoveAll,
  Update,
} from './types.ts'

export const create: Create = (partialItem) => {
  const item = { id: crypto.randomUUID(), ...partialItem }

  localStorage.setItem(item.id, JSON.stringify(item))

  return item
}

export const get: Get = (id: string) => {
  const listItem = localStorage.getItem(id)

  if (listItem) {
    return JSON.parse(listItem)
  }

  return null
}

export const getAll: GetAll = <Schema extends Item>() => {
  const listItems: Schema[] = Object.values({ ...localStorage }).map((str) =>
    JSON.parse(str)
  )

  return listItems
}

export const update: Update = <Schema extends Item>(
  id: string,
  update: Partial<Schema>,
) => {
  const item = get<Schema>(id)

  if (item) {
    const updatedItem = { ...item, ...update }
    localStorage.setItem(id, JSON.stringify(updatedItem))

    return updatedItem
  } else {
    throw Error(`Item with ID: '${id}' not found`)
  }
}

export const remove: Remove = <Schema extends Item>(id: string) => {
  const item = get<Schema>(id)

  localStorage.removeItem(id)

  return item
}

export const removeAll: RemoveAll = <Schema extends Item>() => {
  const items = getAll<Schema>()

  localStorage.clear()

  return items
}

export default {
  create,
  get,
  getAll,
  remove,
  removeAll,
  update
}
