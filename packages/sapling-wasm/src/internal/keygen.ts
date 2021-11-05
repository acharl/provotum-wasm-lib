import { WasmProvotum } from "./types"

export function __wasm__setupElgamal(
    sk_as_string: string, 
    provotum: WasmProvotum, 
): any {
  return provotum.setupElgamal(sk_as_string)
}



export function __wasm__keygen(
  r: any, params: any, sk: any, pk: any,
  provotum: WasmProvotum, 
): any {
return provotum.keygen(r, params, sk, pk)
}
