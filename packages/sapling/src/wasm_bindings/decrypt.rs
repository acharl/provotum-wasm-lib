extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::crypto::{Helper, DecryptionProof, ElGamalParams, PrivateKey, PublicKey};

use hex_literal::hex;
use num_bigint::BigUint;
use std::str::FromStr;

#[wasm_bindgen(catch, js_name = "setupElgamal")]
pub fn wasm_setup_elgamal(sk_as_string: String) -> Vec<JsValue> {
    let (params, sk, pk) = Helper::setup_lg_system_with_sk(sk_as_string.as_bytes());
    vec![JsValue::from_serde(&params.q().to_str_radix(16)).unwrap(), JsValue::from_serde(&params).unwrap(), JsValue::from_serde(&sk).unwrap(), JsValue::from_serde(&pk).unwrap()]
}

#[wasm_bindgen(catch, js_name = "decrypt")]
pub fn wasm_decrypt(_r: &JsValue, _params: &JsValue, _sk: &JsValue, _pk: &JsValue) -> JsValue {   

    // create private and public key
    let sk: PrivateKey = _sk.into_serde().unwrap();
    let pk: PublicKey = _pk.into_serde().unwrap();

    let string: String = _r.into_serde().unwrap();
    let r: BigUint = BigUint::from_str(&string).unwrap();
    let params: ElGamalParams = _params.into_serde().unwrap();
    //let encryptions:
    //let partial_decryptions:

    let sealer_id: [u8; 32] = hex!("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48").into();

    // fetch the encrypted votes from chain
    let vote_id = vote.as_bytes().to_vec();
    let topic_id = question.as_bytes().to_vec();
    let nr_of_shuffles = 3;
    let encryptions: Vec<Cipher> = get_ciphers(&client, topic_id.clone(), nr_of_shuffles).await?;
    let encryptions: Vec<BigCipher> = Wrapper(encryptions).into();

    // get partial decryptions
    let partial_decryptions = encryptions
        .iter()
        .map(|cipher| ElGamal::partial_decrypt_a(cipher, &sk))
        .collect::<Vec<BigUint>>();

    // convert the decrypted shares: Vec<BigUint> to Vec<Vec<u8>>
    let shares: Vec<Vec<u8>> = partial_decryptions
        .iter()
        .map(|c| c.to_bytes_be())
        .collect::<Vec<Vec<u8>>>();

    // create proof using public and private key share
    let proof = DecryptionProof::generate(
        &params,
        &sk.x,
        &pk.h.into(),
        &r,
        encryptions,
        partial_decryptions,
        &sealer_id,
    );

    Ok(())
}
//npx ts-node packages/sapling-wasm/examples/test.ts
