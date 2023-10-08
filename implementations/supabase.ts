/**
 * @file Supabase implementation of Storage
 */

import {
  createClient,
  SupabaseClient,
} from 'https://esm.sh/@supabase/supabase-js@2.38.0'

import type {
  Create,
  Get,
  GetAll,
  Init,
  Item,
  Remove,
  RemoveAll,
  Update,
} from '../src/types.ts'

// Create a single supabase client for interacting with your database
// deno-lint-ignore no-explicit-any
let supabase: null | SupabaseClient<any, 'public', any> = null

export const init: Init = async (
  opts, /*: { url: string; publicAnonKey: string; options?: object }*/
) => {
  supabase = await createClient(opts?.url, opts?.publicAnonKey)
}

export const create: Create = async <Schema extends Item>(
  partialItem?: Partial<Schema>,
) => {
  if (!supabase) {
    throw Error('Storage not initialized')
  }

  const item = { id: crypto.randomUUID(), ...partialItem }

  const { data, error } = await supabase
    .from('list-items')
    .insert([item])
    .select()

  if (error) {
    throw error
  }

  return data[0] as Schema
}

export const get: Get = async (id: string) => {
  if (!supabase) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from('list-items')
    .select()
    .eq('id', id)

  if (error) {
    throw error
  }

  if (data[0]) {
    return data[0]
  }

  return null
}

export const getAll: GetAll = async () => {
  if (!supabase) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from('list-items')
    .select()

  if (error) {
    throw error
  }

  return data
}

export const update: Update = async <Schema extends Item>(
  id: string,
  update: Partial<Schema>,
) => {
  if (!supabase) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from('list-items')
    .update(update)
    .eq('id', id)
    .select()

  if (error) {
    throw error
  }

  if (data && data[0]) {
    return data[0]
  }
}

export const remove: Remove = async (id: string) => {
  if (!supabase) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from('list-items')
    .delete()
    .eq('id', id)
    .select()

  if (error) {
    throw error
  }

  if (data && data[0]) {
    return data[0]
  }
}

export const removeAll: RemoveAll = async () => {
  if (!supabase) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from('list-items')
    .delete()
    .neq('id', crypto.randomUUID())
    .select()

  if (error) {
    throw error
  }

  return data
}

export default {
  create,
  get,
  getAll,
  init,
  remove,
  removeAll,
  update,
}
