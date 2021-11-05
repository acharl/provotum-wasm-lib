
import { __wasm__keygen, __wasm__setupElgamal } from './internal/keygen'
import { WasmProvotum } from './internal/types'
import { rejectPromise } from './internal/utils'

const provotumPromise: Promise<WasmProvotum> = import('../pkg')
  .catch((error) => {
    console.error(error)
    throw new Error(`Could not load sapling-wasm: ${error}`)
  })

  export async function setupElgamal(sk_as_string: string): Promise<any[]> {
    try {
      const provotum: WasmProvotum = await provotumPromise
      return __wasm__setupElgamal(sk_as_string, provotum)
    } catch (error) {
      return rejectPromise('keygenError', error)
    }
  }
   


  export async function keygen(r: any, params: any, sk: any, pk: any): Promise<any[]> {
    try {
      const provotum: WasmProvotum = await provotumPromise
      return __wasm__keygen(r,params, sk, pk, provotum)
    } catch (error) {
      return rejectPromise('keygenError', error)
    }
  }