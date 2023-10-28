import { assertRejects } from 'https://deno.land/std@0.168.0/testing/asserts.ts'

import Storage from './supabase.ts'

Deno.test('Additional Supabase tests', async (t) => {
  await t.step('Init requires args', async () => {
    await assertRejects(
      async () => await Storage.init(),
    )
  })
})
