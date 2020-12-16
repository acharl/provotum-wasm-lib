use std::convert::TryInto;

use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::*;
use zcash_primitives::zip32::ExtendedFullViewingKey;

use crate::address::{get_next_xfvk_address, get_xfvk_address};
use crate::common::utils::wasm_utils::{js_deserialize, js_result_from, js_serialize_res};

#[wasm_bindgen(catch, js_name = "defaultPaymentAddressFromXfvk")]
pub fn wasm_default_payment_address_from_xfvk(xfvk: &[u8]) -> Result<Vec<u8>, JsValue> {
    let xfvk: ExtendedFullViewingKey = js_deserialize(xfvk)?;
    let xfvk_address = get_xfvk_address(&xfvk, None);

    js_serialize_res(xfvk_address)
}

#[wasm_bindgen(catch, js_name = "nextPaymentAddressFromXfvk")]
pub fn wasm_next_payment_address_from_xfvk(xfvk: &[u8], index: &[u8]) -> Result<Vec<u8>, JsValue> {
    let index: [u8; 11] = index.try_into()
        .or_else(|_| js_result_from("nextPaymentAddressFromXfvk: index must be an array of 11 bytes"))?;

    let xfvk: ExtendedFullViewingKey = js_deserialize(xfvk)?;
    let xfvk_address = get_next_xfvk_address(&xfvk, index);

    js_serialize_res(xfvk_address)
}

#[wasm_bindgen(catch, js_name = "paymentAddressFromXfvk")]
pub fn wasm_payment_address_from_xfvk(xfvk: &[u8], index: &[u8]) -> Result<Vec<u8>, JsValue> {
    let index: [u8; 11] = index.try_into()
        .or_else(|_| js_result_from("paymentAddressFromXfvk: index must be an array of 11 bytes"))?;

    let xfvk: ExtendedFullViewingKey = js_deserialize(xfvk)?;
    let xfvk_address = get_xfvk_address(&xfvk, Some(index));

    js_serialize_res(xfvk_address)
}