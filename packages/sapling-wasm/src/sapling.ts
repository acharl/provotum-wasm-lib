
import { __wasm__setupElgamal } from './internal/keygen'
import { WasmSapling } from './internal/types'
import { rejectPromise } from './internal/utils'

const saplingPromise: Promise<WasmSapling> = import('../pkg')
  .catch((error) => {
    console.error(error)
    throw new Error(`Could not load sapling-wasm: ${error}`)
  })

  export async function setupElgamal(sk_as_string: string): Promise<any[]> {
    try {
      const sapling: WasmSapling = await saplingPromise
      return __wasm__setupElgamal(sk_as_string, sapling)
    } catch (error) {
      return rejectPromise('keygenError', error)
    }
  }
   