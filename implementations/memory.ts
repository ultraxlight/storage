/**
 * @file In memory implementation of Storage
 */

import type { Init, Item } from '../src/types.ts'

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

export const init: Init = () => {
  const db = {
    create: <Schema extends Item>(
      partialItem?: Partial<Schema>,
    ) => {
      const DB = getDB<Schema>()
      const item = { id: crypto.randomUUID(), ...partialItem } as Schema

      DB[item.id] = item

      return Promise.resolve(item)
    },

    get: <Schema extends Item>(id: string) => {
      const DB = getDB<Schema>()
      const listItem: Schema | null = DB[id] || null // as Schema

      return Promise.resolve(listItem) as Promise<Schema | null>
    },

    getAll: <Schema extends Item>() => {
      const DB = getDB<Schema>()
      const listItems: Schema[] = Object.values(DB)

      return Promise.resolve(listItems)
    },

    update: async <Schema extends Item>(
      id: string,
      update: Partial<Schema>,
    ) => {
      const DB = getDB<Schema>()
      const item = await db.get<Schema>(id)

      if (item) {
        const updatedItem = { ...item, ...update } as Schema
        DB[id] = updatedItem

        return Promise.resolve(updatedItem)
      } else {
        return Promise.reject(Error(`Item with ID: '${id}' not found`))
      }
    },

    remove: <Schema extends Item>(id: string) => {
      const DB = getDB<Schema>()
      const item = db.get<Schema>(id)

      delete DB[id]

      return item
    },

    removeAll: <Schema extends Item>() => {
      const items = Object.values(getDB<Schema>())

      DB = {}

      return Promise.resolve(items)
    },
  }

  return Promise.resolve(db)
}

export default {
  init,
}
