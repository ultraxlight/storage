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

/** Supabase client */
// deno-lint-ignore no-explicit-any
let supabase: null | SupabaseClient<any, 'public', any> = null

/** Table name to read from */
let tableName: null | string = null

/**
 * Initialize Supabase client
 * @param {Object} opts Initialization options
 * @param {string} opts.url Supabase URL
 * @param {string} opts.publicAnonKey Supabase Public Anon Key
 * @param {string} opts.tableName Supabase Table name
 */
export const init: Init = (
  opts,
) => {
  if (!opts) {
    return Promise.reject('Missing init options')
  }

  if (!opts.tableName) {
    return Promise.reject('Missing tableName in init options')
  }

  supabase = createClient(opts.url, opts.publicAnonKey)
  tableName = opts.tableName

  return Promise.resolve()
}

export const create: Create = async <Schema extends Item>(
  partialItem?: Partial<Schema>,
) => {
  if (!supabase || !tableName) {
    throw Error('Storage not initialized')
  }

  const item = { id: crypto.randomUUID(), ...partialItem }

  const { data, error } = await supabase
    .from(tableName)
    .insert([item])
    .select()

  if (error) {
    throw error
  }

  return data[0] as Schema
}

export const get: Get = async (id: string) => {
  if (!supabase || !tableName) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from(tableName)
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
  if (!supabase || !tableName) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from(tableName)
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
  if (!supabase || !tableName) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from(tableName)
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
  if (!supabase || !tableName) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from(tableName)
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
  if (!supabase || !tableName) {
    throw Error('Storage not initialized')
  }

  const { data, error } = await supabase
    .from(tableName)
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
