import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts'
import { create, get } from './local-storage.ts'

Deno.test('Empty call creates full object', () => {
  const newLi = create()
  assertEquals(typeof newLi.id, 'string')
  assertEquals(newLi.title, '')
})

Deno.test('Title can be passed', () => {
  const newLi = create('Mow the lawn')
  assertEquals(typeof newLi.id, 'string')
  assertEquals(newLi.title, 'Mow the lawn')
})

Deno.test('Get can retrieve single', () => {
  const newLi = create('Mow the lawn')
  const retrievedLi = get(newLi.id)
  assertEquals(
    newLi.id,
    retrievedLi && !Array.isArray(retrievedLi) && retrievedLi.id,
  )
  assertEquals(
    newLi.title,
    retrievedLi && !Array.isArray(retrievedLi) && retrievedLi.title,
  )
})

Deno.test('Get can retrieve multiple', () => {
  const newLi1 = create('Mow the lawn')
  const newLi2 = create('Mow the lawn 2')
  const retrievedLis = get()
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

Deno.test('Get returns null', () => {})
