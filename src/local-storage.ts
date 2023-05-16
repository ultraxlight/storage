export interface Item {id: string}

/**
 * Create Item
 * @param {Object} Partial Item
 * @returns {Schema} Item object
 */
export const create = <Schema extends Item>(partialItem?: Partial<Schema>): Schema => {
  const item = { id: crypto.randomUUID(), ...partialItem }

  localStorage.setItem(item.id, JSON.stringify(item))

  // @ts-ignore Can't get this sorted
  return item
}

export const get = <Schema extends Item>(id?: string): null | Schema | Schema[] => {
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

export const remove = (id: string) => {
  localStorage.removeItem(id)
}

export const removeAll = () => {
  localStorage.clear()
}