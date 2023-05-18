export interface Item {
  id: string
}

/**
 * Create Item
 * @param {Object} Partial Item
 * @returns {Schema} Item object
 */
export const create = (
  partialItem?: Record<string, unknown>,
): { id: string; [key: string]: unknown } => {
  const item = { id: crypto.randomUUID(), ...partialItem }

  localStorage.setItem(item.id, JSON.stringify(item))

  return item
}

export function get<Schema extends Item>(id: string): null | Schema
export function get<Schema extends Item>(): null | Schema[]
export function get<Schema extends Item>(
  id?: string,
): null | Schema | Schema[] {
  if (id) {
    const listItem = localStorage.getItem(id)

    if (listItem) {
      return JSON.parse(listItem)
    } else return null
  } else {
    const listItems = Object.values({ ...localStorage }).map((str) =>
      JSON.parse(str)
    )

    return listItems
  }
}

export const remove = <Schema extends Item>(id: string): Schema | null => {
  const item = get<Schema>(id)

  localStorage.removeItem(id)

  return item
}

export const removeAll = <Schema extends Item>(): Schema[] | null => {
  const items = get<Schema>()

  localStorage.clear()

  return items
}
