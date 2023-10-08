/**
 * @file LocalStorage implementation of Storage
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

export const init: Init = () => Promise.resolve()

export const create: Create = <Schema extends Item>(
  partialItem?: Partial<Schema>,
) => {
  const item = { id: crypto.randomUUID(), ...partialItem } as Schema

  localStorage.setItem(item.id, JSON.stringify(item))

  return Promise.resolve(item)
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

  return Promise.resolve(listItems)
}

export const update: Update = async <Schema extends Item>(
  id: string,
  update: Partial<Schema>,
) => {
  const item = await get<Schema>(id)

  if (item) {
    const updatedItem = { ...item, ...update }
    localStorage.setItem(id, JSON.stringify(updatedItem))

    return Promise.resolve(updatedItem)
  } else {
    return Promise.reject(Error(`Item with ID: '${id}' not found`))
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
  init,
  remove,
  removeAll,
  update,
}
