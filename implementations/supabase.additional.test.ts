import { assertRejects } from 'https://deno.land/std@0.168.0/testing/asserts.ts'

import Storage from './supabase.ts'

Deno.test('Additional Supabase tests', async (t) => {
  await t.step('Init requires args', async () => {
    await assertRejects(
      async () => await Storage.init(),
    )
  })

  await t.step('Init must be called before Create', async () => {
    await assertRejects(
      async () => await Storage.create(),
    )
  })

  await t.step('Init must be called before Get', async () => {
    await assertRejects(async () => await Storage.get('a'))
  })

  await t.step('Init must be called before GetAll', async () => {
    await assertRejects(async () => await Storage.getAll())
  })

  await t.step('Init must be called before Update', async () => {
    await assertRejects(async () =>
      await Storage.update<{ id: string; title: string }>('a', { title: 'b' })
    )
  })

  await t.step('Init must be called before Remove', async () => {
    await assertRejects(async () => await Storage.remove('a'))
  })

  await t.step('Init must be called before RemoveAll', async () => {
    await assertRejects(async () => await Storage.removeAll())
  })
})
