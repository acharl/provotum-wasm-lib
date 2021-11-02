
extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::crypto::{Helper, KeyGenerationProof, PublicKeyShare, ElGamalParams, PrivateKey, PublicKey};

use hex_literal::hex;
use num_bigint::BigUint;
use std::str::FromStr;




#[wasm_bindgen(catch, js_name = "setupElgamal")]
pub fn wasm_setup_elgamal(sk_as_string: String) -> Vec<JsValue> {
    let (params, sk, pk) = Helper::setup_lg_system_with_sk(sk_as_string.as_bytes());
    vec![JsValue::from_serde(&params.q().to_str_radix(16)).unwrap(), JsValue::from_serde(&params).unwrap(), JsValue::from_serde(&sk).unwrap(), JsValue::from_serde(&pk).unwrap()]
}


#[wasm_bindgen(catch, js_name = "keygen")]
pub fn wasm_keygen(_r: &JsValue, _params: &JsValue, _sk: &JsValue, _pk: &JsValue) -> JsValue {   
    /*
    * There seems to be an issue with RNG on the side of WASM
    * Perhaps it would anyways make more sense to do the generation on the TS side
    * 
    * We need to generate a number less than params.q(), so let's do the following: 
    *   1) return params.q()
    *   2) RNG on TS side
    *   3) pass RN back here
    *   4) continue with KeyGenerationProof::generate(
    */


    let string: String = _r.into_serde().unwrap();
    let r: BigUint = BigUint::from_str(&string).unwrap();
    let params: ElGamalParams = _params.into_serde().unwrap();
    let sk: PrivateKey = _sk.into_serde().unwrap();
    let pk: PublicKey = _pk.into_serde().unwrap();


    
    let sealer_id: [u8; 32] = hex!("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48").into();
    // create public key share + proof
    let proof = KeyGenerationProof::generate(&params, &sk.x, &pk.h, &r, &sealer_id);
    let pk_share = PublicKeyShare {
        proof: proof.clone().into(),
        pk: pk.h.to_bytes_be(),
    };

    JsValue::from_serde(&pk_share).unwrap()
}
