
import { __wasm__keygen, __wasm__setupElgamal } from './internal/keygen'
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
   


  export async function keygen(r: any, params: any, sk: any, pk: any): Promise<any[]> {
    try {
      const sapling: WasmSapling = await saplingPromise
      return __wasm__keygen(r,params, sk, pk, sapling)
    } catch (error) {
      return rejectPromise('keygenError', error)
    }
  }