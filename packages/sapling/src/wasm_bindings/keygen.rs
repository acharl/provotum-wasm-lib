
extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::crypto::{Helper, Random, KeyGenerationProof, PublicKeyShare};
use hex_literal::hex;


#[wasm_bindgen(catch, js_name = "keygen")]
pub fn wasm_keygen(sk_as_string: String) -> Vec<JsValue> {
    let (params, sk, pk) = Helper::setup_lg_system_with_sk(sk_as_string.as_bytes());
   
    /*
    * There seems to be an issue with RNG on the side of WASM
    * Perhaps it would anyways make more sense to to the generation on the TS side
    * 
    * We need to generate a number less than params.q(), so let's do the following: 
    *   1) return params.q()
    *   2) RNG on TS side
    *   3) pass RN back here
    *   4) continue with KeyGenerationProof::generate(
    */

    let sealer_id: [u8; 32] = hex!("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48").into();
    // create public key share + proof
    let r = Random::get_random_less_than(&params.q());
    let proof = KeyGenerationProof::generate(&params, &sk.x, &pk.h, &r, &sealer_id);
    let pk_share = PublicKeyShare {
        proof: proof.clone().into(),
        pk: pk.h.to_bytes_be(),
    };

    vec![JsValue::from_serde(&&params.q().to_str_radix(16)).unwrap(), JsValue::from_serde(&sk).unwrap(), JsValue::from_serde(&pk_share).unwrap()]
}
