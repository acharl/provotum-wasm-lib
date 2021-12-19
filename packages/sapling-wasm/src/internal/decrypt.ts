import { WasmProvotum } from "./types"

export function __wasm__decrypt(
  encryptions: any, r: any, params: any, sk: any, pk: any,
  provotum: WasmProvotum, 
): any {
return provotum.decrypt(encryptions, r, params, sk, pk)
}
