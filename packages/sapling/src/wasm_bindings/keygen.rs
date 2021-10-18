
extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::wasm_bindings::init::init_lib;
use crate::crypto::{Helper, Random, KeyGenerationProof, PublicKeyShare};
use hex_literal::hex;


#[wasm_bindgen(catch, js_name = "keygen")]
pub fn wasm_keygen(sk_as_string: String) -> Vec<JsValue> {
    init_lib();
    let (params, sk, pk) = Helper::setup_lg_system_with_sk(sk_as_string.as_bytes());
   

    let sealer_id: [u8; 32] = hex!("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48").into();
    // create public key share + proof
    let r = Random::get_random_less_than(&params.q());
    let proof = KeyGenerationProof::generate(&params, &sk.x, &pk.h, &r, &sealer_id);
    let pk_share = PublicKeyShare {
        proof: proof.clone().into(),
        pk: pk.h.to_bytes_be(),
    };

    vec![JsValue::from_serde(&sk).unwrap(), JsValue::from_serde(&pk_share).unwrap()]
}
