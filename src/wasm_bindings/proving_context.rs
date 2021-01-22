use wasm_bindgen::prelude::*;

use zcash_proofs::sapling::SaplingProvingContext;

use crate::common::utils::wasm_utils::{drop_reference, reference};
use crate::init_lib;

#[wasm_bindgen(catch, js_name = "initProvingContext")]
pub fn wasm_init_proving_context() -> u32 {
    init_lib();
    reference(SaplingProvingContext::new())
}

#[wasm_bindgen(catch, js_name = "dropProvingContext")]
pub fn wasm_drop_proving_context(ctx: u32) {
    init_lib();
    unsafe { drop_reference::<SaplingProvingContext>(ctx) }
}