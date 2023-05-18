import {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.168.0/testing/asserts.ts'
import { create, get, remove, removeAll } from './local-storage.ts'
import type { Item } from './local-storage.ts'

interface Schema extends Item {
  title: string
}

Deno.test('Empty call creates object with just ID', () => {
  const newItem = create()
  assertEquals(typeof newItem.id, 'string')
})

Deno.test('Title can be passed', () => {
  const newItem = create({ title: 'Mow the lawn' })
  assertEquals(typeof newItem.id, 'string')
  assertEquals(newItem.title, 'Mow the lawn')
})

Deno.test('Get can retrieve single', () => {
  const newItem = create({ title: 'Mow the lawn' })
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

Deno.test('Get can retrieve multiple', () => {
  const newLi1 = create({ title: 'Mow the lawn' })
  const newLi2 = create({ title: 'Mow the lawn 2' })
  const retrievedLis = get<Schema>()
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
  const newItem = create({ title: 'Mow the lawn' })
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
  const newItem = create({ title: 'Mow the lawn' })
  const removedItem = remove(newItem.id)

  assertEquals(
    newItem,
    removedItem,
  )
})

Deno.test('removeAll removes all', () => {
  create({ title: 'Mow the lawn' })
  create({ title: 'Mow the lawn 2' })

  const items = get()

  assert(
    Array.isArray(items) && items.length > 1,
  )

  removeAll()

  assertEquals(
    get<Schema>(),
    [],
  )
})

Deno.test('removeAll returns all', () => {
  const item1 = create({ title: 'Mow the lawn' })
  const item2 = create({ title: 'Mow the lawn 2' })

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
