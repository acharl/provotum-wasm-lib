#![allow(dead_code)]

#[cfg(feature = "wasm_bindings")]
mod wasm_bindings;

#[cfg(feature = "wasm_bindings")]
pub use wasm_bindings::{
    keygen::*,
    init::*
};

use crate::state::State;

mod state;
mod crypto;

