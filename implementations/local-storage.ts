/**
 * @file LocalStorage implementation of Storage
 */

import type { Init, Item } from '../src/types.ts'

export const init: Init = () => {
  const db = {
    create: <Schema extends Item>(
      partialItem?: Partial<Schema>,
    ) => {
      const item = { id: crypto.randomUUID(), ...partialItem } as Schema

      localStorage.setItem(item.id, JSON.stringify(item))

      return Promise.resolve(item)
    },

    get: <Schema extends Item>(id: string) => {
      const listItem = localStorage.getItem(id)
      return Promise.resolve(listItem && JSON.parse(listItem) as Schema || null)
    },

    getAll: <Schema extends Item>() => {
      const listItems: Schema[] = Object.values({ ...localStorage }).map((
        str,
      ) => JSON.parse(str))

      return Promise.resolve(listItems)
    },

    update: async <Schema extends Item>(
      id: string,
      update: Partial<Schema>,
    ) => {
      const item = await db.get<Schema>(id)

      if (item) {
        const updatedItem = { ...item, ...update }
        localStorage.setItem(id, JSON.stringify(updatedItem))

        return Promise.resolve(updatedItem)
      }

      return Promise.reject(Error(`Item with ID: '${id}' not found`))
    },

    remove: <Schema extends Item>(id: string) => {
      const item = db.get<Schema>(id)

      localStorage.removeItem(id)

      return item
    },

    removeAll: <Schema extends Item>() => {
      const items = db.getAll<Schema>()

      localStorage.clear()

      return items
    },
  }

  return Promise.resolve(db)
}

export default {
  init,
}
