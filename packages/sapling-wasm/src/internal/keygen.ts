import { WasmSapling } from "./types"

export function __wasm__keygen(
    sk_as_string: string, 
    sapling: WasmSapling, 
): any {
  return sapling.keygen(sk_as_string)
}
