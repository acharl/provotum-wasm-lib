import { WasmProvotum } from "./types"

export function __wasm__initLib(
    provotum: WasmProvotum, 
): any {
  return provotum.initLib()
}


