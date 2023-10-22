#!/usr/bin/env -S deno run
// The shebang above lets us run the script directly,
// without needing to include `deno run` before the script name.

import { readline } from 'https://deno.land/x/readline@v1.1.0/mod.ts'

for await (const l of readline(Deno.stdin)) {
  const line = new TextDecoder().decode(l)

  console.log(line)

  const successRegex = /100\.000%/

  if (line.length && !successRegex.test(line)) {
    throw 'Test not at 100% coverage'
  }
}
