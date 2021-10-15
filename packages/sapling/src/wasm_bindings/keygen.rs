
extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::wasm_bindings::helper::Helper;
use crate::wasm_bindings::init::init_lib;

#[wasm_bindgen(catch, js_name = "keygen")]
pub fn wasm_keygen(sk_as_string: String) -> JsValue {
    init_lib();
    let (_params, sk, _pk) = Helper::setup_lg_system_with_sk(sk_as_string.as_bytes());
    JsValue::from_serde(&sk).unwrap()
}