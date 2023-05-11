/**
 * Create List Item
 * @param {string} title Main List Item content
 * @returns {Schema} List Item object
 */
export const create = <Schema>(title = ''): Schema => {
  const listItem = { id: crypto.randomUUID(), title }

  localStorage.setItem(listItem.id, JSON.stringify(listItem))

  return listItem
}

export const get = <Schema>(id?: string): null | Schema | Schema[] => {
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

