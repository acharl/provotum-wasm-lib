use wasm_bindgen::prelude::*;

use crate::State;

#[wasm_bindgen(js_name = "initLib")]
pub fn init_lib() {
    if !State::is_initialized() {
        console_error_panic_hook::set_once();
        State::set_initialized();
    }
}