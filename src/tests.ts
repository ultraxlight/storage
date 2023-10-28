import {
  assert,
  assertEquals,
  assertRejects,
} from 'https://deno.land/std@0.168.0/testing/asserts.ts'

interface Schema {
  id: string
  title: string
}

import { StorageInit } from '../src/types.ts'

export default async function (storage: StorageInit, initOptions?: object) {
  const db = await storage.init(initOptions)

  Deno.test('Standard Storage tests', async (t) => {
    await t.step('Empty call creates object with just ID', async () => {
      const newItem = await db.create()
      assertEquals(typeof newItem.id, 'string')
    })

    await t.step('Attribute can be passed', async () => {
      const newItem = await db.create<Schema>({ title: 'Mow the lawn' })
      assertEquals(typeof newItem.id, 'string')
      assertEquals(newItem.title, 'Mow the lawn')
    })

    await t.step('Get can retrieve single', async () => {
      const newItem = await db.create<Schema>({ title: 'Mow the lawn' })
      const retrievedItem = await db.get<Schema>(newItem.id)
      assertEquals(
        newItem.id,
        retrievedItem && !Array.isArray(retrievedItem) && retrievedItem.id,
      )
      assertEquals(
        newItem.title,
        retrievedItem && !Array.isArray(retrievedItem) && retrievedItem.title,
      )
    })

    await t.step('Update updates', async () => {
      const newItem = await db.create<Schema>({ title: 'Mow the lawn' })
      const updatedItem = await db.update<Schema>(newItem.id, {
        title: 'Mow the neighbor\'s lawn',
      })
      const retrievedItem = await db.get<Schema>(newItem.id)

      assertEquals(
        retrievedItem?.title,
        'Mow the neighbor\'s lawn',
      )

      assertEquals(
        updatedItem.title,
        retrievedItem?.title,
      )
    })

    await t.step('Update w/ bad ID throws', async () => {
      await assertRejects(
        async () =>
          await db.update<Schema>('WRONG', {
            title: 'Mow the neighbor\'s lawn',
          }),
      )
    })

    await t.step('GetAll can retrieve multiple', async () => {
      const newLi1 = await db.create<Schema>({ title: 'Mow the lawn' })
      const newLi2 = await db.create<Schema>({ title: 'Mow the lawn 2' })
      const retrievedLis = await db.getAll<Schema>()
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

    await t.step('remove removes', async () => {
      const newItem = await db.create<Schema>({ title: 'Mow the lawn' })
      const retrievedItemBeforeRemove = await db.get<Schema>(newItem.id)

      assertEquals(
        !Array.isArray(retrievedItemBeforeRemove) &&
          retrievedItemBeforeRemove?.title,
        'Mow the lawn',
      )

      await db.remove(newItem.id)

      assertEquals(
        await db.get<Schema>(newItem.id),
        null,
      )
    })

    await t.step('remove returns removed', async () => {
      const newItem = await db.create<Schema>({ title: 'Mow the lawn' })
      const removedItem = await db.remove(newItem.id)

      assertEquals(
        newItem,
        removedItem,
      )
    })

    await t.step('removeAll removes all', async () => {
      await db.create<Schema>({ title: 'Mow the lawn' })
      await db.create<Schema>({ title: 'Mow the lawn 2' })

      const items = await db.getAll()

      assert(
        Array.isArray(items) && items.length > 1,
      )

      await db.removeAll()

      assertEquals(
        await db.getAll<Schema>(),
        [],
      )
    })

    await t.step('removeAll returns all', async () => {
      const item1 = await db.create<Schema>({ title: 'Mow the lawn' })
      const item2 = await db.create<Schema>({ title: 'Mow the lawn 2' })

      const sortByTitle = (
        a: Schema,
        b: Schema,
      ) => {
        if (
          a.title && typeof a.title === 'string' && b.title &&
          typeof b.title === 'string'
        ) {
          return a.title.length - b.title.length
        }
        return 0
      }

      const removed = await db.removeAll<{ title: string; id: string }>()

      assertEquals(
        [item1, item2].sort(sortByTitle),
        (removed || []).sort(sortByTitle),
      )
    })
  })
}
