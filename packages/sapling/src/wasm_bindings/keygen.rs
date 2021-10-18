
extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::wasm_bindings::init::init_lib;
use crate::crypto::{Helper, Random};

#[wasm_bindgen(catch, js_name = "keygen")]
pub fn wasm_keygen(sk_as_string: String) -> Vec<JsValue> {
    init_lib();
    let (params, sk, pk) = Helper::setup_lg_system_with_sk(sk_as_string.as_bytes());
   

    // create public key share + proof
    let r = Random::get_random_less_than(&params.q());
    // let proof = KeyGenerationProof::generate(&params, &sk.x, &pk.h, &r, &sealer_id);
    // let pk_share = PublicKeyShare {
    //     proof: proof.clone().into(),
    //     pk: pk.h.to_bytes_be(),
    // };

    vec![JsValue::from_serde(&sk).unwrap(), JsValue::from_serde(&pk.h.to_str_radix(16)).unwrap(), JsValue::from_serde(&r.to_str_radix(16)).unwrap()]
}
