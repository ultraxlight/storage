import {
  assert,
  assertEquals,
  assertThrows,
} from 'https://deno.land/std@0.168.0/testing/asserts.ts'
import {
  create,
  get,
  getAll,
  remove,
  removeAll,
  update,
} from './local-storage.ts'

interface Schema {
  id: string
  title: string
}

Deno.test('Empty call creates object with just ID', () => {
  const newItem = create()
  assertEquals(typeof newItem.id, 'string')
})

Deno.test('Attribute can be passed', () => {
  const newItem = create<Schema>({ title: 'Mow the lawn' })
  assertEquals(typeof newItem.id, 'string')
  assertEquals(newItem.title, 'Mow the lawn')
})

Deno.test('Get can retrieve single', () => {
  const newItem = create<Schema>({ title: 'Mow the lawn' })
  const retrievedItem = get<Schema>(newItem.id)
  assertEquals(
    newItem.id,
    retrievedItem && !Array.isArray(retrievedItem) && retrievedItem.id,
  )
  assertEquals(
    newItem.title,
    retrievedItem && !Array.isArray(retrievedItem) && retrievedItem.title,
  )
})

Deno.test('Update updates', () => {
  const newItem = create<Schema>({ title: 'Mow the lawn' })
  const updatedItem = update<Schema>(newItem.id, {
    title: 'Mow the neighbor\'s lawn',
  })
  const retrievedItem = get<Schema>(newItem.id)

  assertEquals(
    retrievedItem?.title,
    'Mow the neighbor\'s lawn',
  )

  assertEquals(
    updatedItem.title,
    retrievedItem?.title,
  )
})

Deno.test('Update w/ bad ID throws', () => {
  assertThrows(
    () => update<Schema>('WRONG', { title: 'Mow the neighbor\'s lawn' }),
    Error,
    'Item with ID: \'WRONG\' not found',
  )
})

Deno.test('GetAll can retrieve multiple', () => {
  const newLi1 = create<Schema>({ title: 'Mow the lawn' })
  const newLi2 = create<Schema>({ title: 'Mow the lawn 2' })
  const retrievedLis = getAll<Schema>()
  const retrievedLi1 = Array.isArray(retrievedLis) &&
    retrievedLis.find((rLi) => rLi.id === newLi1.id)
  const retrievedLi2 = Array.isArray(retrievedLis) &&
    retrievedLis.find((rLi) => rLi.id === newLi2.id)

  assertEquals(
    newLi1.id,
    retrievedLi1 && !Array.isArray(retrievedLi1) && retrievedLi1.id,
  )
  assertEquals(
    newLi2.title,
    retrievedLi2 && !Array.isArray(retrievedLi2) && retrievedLi2.title,
  )
})

Deno.test('remove removes', () => {
  const newItem = create<Schema>({ title: 'Mow the lawn' })
  const retrievedItemBeforeRemove = get<Schema>(newItem.id)

  assertEquals(
    !Array.isArray(retrievedItemBeforeRemove) &&
      retrievedItemBeforeRemove?.title,
    'Mow the lawn',
  )

  remove(newItem.id)

  assertEquals(
    get<Schema>(newItem.id),
    null,
  )
})

Deno.test('remove returns removed', () => {
  const newItem = create<Schema>({ title: 'Mow the lawn' })
  const removedItem = remove(newItem.id)

  assertEquals(
    newItem,
    removedItem,
  )
})

Deno.test('removeAll removes all', () => {
  create<Schema>({ title: 'Mow the lawn' })
  create<Schema>({ title: 'Mow the lawn 2' })

  const items = getAll()

  assert(
    Array.isArray(items) && items.length > 1,
  )

  removeAll()

  assertEquals(
    getAll<Schema>(),
    [],
  )
})

Deno.test('removeAll returns all', () => {
  const item1 = create<Schema>({ title: 'Mow the lawn' })
  const item2 = create<Schema>({ title: 'Mow the lawn 2' })

  const sortByTitle = (
    a: Record<string, unknown>,
    b: Record<string, unknown>,
  ) => {
    if (
      a.title && typeof a.title === 'string' && b.title &&
      typeof b.title === 'string'
    ) {
      return a.title.length - b.title.length
    }
    return 0
  }

  const removed = removeAll<{ title: string; id: string }>()

  assertEquals(
    [item1, item2].sort(sortByTitle),
    (removed || []).sort(sortByTitle),
  )
})