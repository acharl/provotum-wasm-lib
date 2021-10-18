
import { __wasm__keygen } from './internal/keygen'

import { WasmSapling } from './internal/types'
import { rejectPromise } from './internal/utils'

const saplingPromise: Promise<WasmSapling> = import('../pkg')
  .catch((error) => {
    console.error(error)
    throw new Error(`Could not load sapling-wasm: ${error}`)
  })

  export async function keygen(sk_as_string: string): Promise<number> {
    try {
      const sapling: WasmSapling = await saplingPromise
      return __wasm__keygen(sk_as_string, sapling)
    } catch (error) {
      return rejectPromise('keygenError', error)
    }
  }
   