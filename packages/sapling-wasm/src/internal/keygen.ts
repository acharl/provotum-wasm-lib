import { WasmSapling } from "./types"

export function __wasm__setupElgamal(
    sk_as_string: string, 
    sapling: WasmSapling, 
): any {
  return sapling.setupElgamal(sk_as_string)
}
