import { WasmSapling } from "./types"

export function __wasm__setupElgamal(
    sk_as_string: string, 
    sapling: WasmSapling, 
): any {
  return sapling.setupElgamal(sk_as_string)
}



export function __wasm__keygen(
  r: any, params: any, sk: any, pk: any,
  sapling: WasmSapling, 
): any {
return sapling.keygen(r, params, sk, pk)
}
