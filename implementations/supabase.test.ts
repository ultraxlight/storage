import { load } from 'https://deno.land/std@0.202.0/dotenv/mod.ts'

const env = await load({ envPath: './.env.test' })
const supabaseUrl = env['SUPABASE_URL']
const supabasePublicAnonKey = env['SUPABASE_PUBLIC_ANON_KEY']

import Storage from './supabase.ts'

import Tests from '../src/tests.ts'

Tests(Storage, { url: supabaseUrl, publicAnonKey: supabasePublicAnonKey })
