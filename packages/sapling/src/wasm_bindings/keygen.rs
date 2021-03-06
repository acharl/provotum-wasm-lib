
extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::crypto::{Helper, KeyGenerationProof, PublicKeyShare, ElGamalParams, PrivateKey, PublicKey};

use hex_literal::hex;
use num_bigint::BigUint;
use std::str::FromStr;

#[wasm_bindgen(catch, js_name = "setupElgamal")]
pub fn wasm_setup_elgamal(sk_as_string: String) -> Vec<JsValue> {
    let (params, sk, pk) = Helper::setup_lg_system_with_sk(sk_as_string.as_bytes());
    vec![
        JsValue::from_serde(&params.q().to_str_radix(16)).unwrap(), 
        JsValue::from_serde(&params).unwrap(), 
        JsValue::from_serde(&sk).unwrap(), 
        JsValue::from_serde(&pk).unwrap()
    ]
}

#[wasm_bindgen(catch, js_name = "keygen")]
pub fn wasm_keygen(_r: &JsValue, _sealer: &JsValue, _params: &JsValue, _sk: &JsValue, _pk: &JsValue) -> JsValue {   
    let string: String = _r.into_serde().unwrap();
    let sealer: String = _sealer.into_serde().unwrap();
    let r: BigUint = BigUint::from_str(&string).unwrap();
    let params: ElGamalParams = _params.into_serde().unwrap();
    let sk: PrivateKey = _sk.into_serde().unwrap();
    let pk: PublicKey = _pk.into_serde().unwrap();


    let sealer_id: [u8; 32] = get_sealer(sealer);
    // create public key share + proof
    let proof = KeyGenerationProof::generate(&params, &sk.x, &pk.h, &r, &sealer_id);
    let pk_share = PublicKeyShare {
        proof: proof.clone().into(),
        pk: pk.h.to_bytes_be(),
    };

    JsValue::from_serde(&pk_share).unwrap()
}

fn get_sealer(sealer: String) -> [u8; 32] {
    // get the sealer and sealer_id
    if sealer == "bob" {
        return hex!("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48").into();      
    } else {
        return hex!("90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22").into();                  
    };
}
