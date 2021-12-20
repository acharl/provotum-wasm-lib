extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::crypto::{DecryptionProof,HexDecryptionProof, ElGamal, ElGamalParams, PrivateKey, PublicKey, Cipher as BigCipher};
/*
* TODO add all the relevant pieces of code such as `DecryptionProof`
* which are needed by `wasm_decrypt()`
**/
use serde::{Serialize, Deserialize};

use hex_literal::hex;
use num_bigint::BigUint;
use std::str::FromStr;
use web_sys;

fn get_sealer(sealer: String) -> [u8; 32] {
    // get the sealer and sealer_id
    if sealer == "bob" {
        return hex!("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48").into();      
    } else {
        return hex!("90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22").into();                  
    };
}

#[derive(Serialize, Deserialize, Clone, Eq, PartialEq, Debug, Hash)]
pub struct DecryptPostBody {
    pub decryption_proof: HexDecryptionProof,
    pub shares: Vec<Vec<u8>>
} 
/*
* TODO: make sure that `npm run build` runs error-free to
* compile the code. 
* Take care of the error messages, they generally explain
* very well what the issue is and how to solve it. 
**/

/*
* TODO: call the function from test.ts with the correct parameters by
* running `npx ts-node packages/sapling-wasm/examples/test.ts`
**/

#[wasm_bindgen(catch, js_name = "decrypt")]
pub fn wasm_decrypt(_encryptions:  &JsValue, _sealer: &JsValue, _r: &JsValue, _params: &JsValue, _sk: &JsValue, _pk: &JsValue) -> JsValue {   
    println!("HARIBOL");

    let encryptions: Vec<BigCipher> = _encryptions.into_serde().unwrap();
    let r_raw: String = _r.into_serde().unwrap();
    // let r: BigUint = BigUint::from_str(&r_raw).unwrap();
    let r: BigUint = BigUint::from_str(&r_raw).unwrap();
    let params: ElGamalParams = _params.into_serde().unwrap();
    let sk: PrivateKey = _sk.into_serde().unwrap();
    let pk: PublicKey = _pk.into_serde().unwrap();
    let sealer: String = _sealer.into_serde().unwrap();

    

    let sealer_id: [u8; 32] = get_sealer(sealer);

    // let topic_id = question.as_bytes().to_vec();
    // let nr_of_shuffles = 3;

    /*
    * TODO: wasm_decrypt should take `encryptions` as an input (
    * see the txt file I sent via whatsapp earlier today. That's
    * exactly what `encryptions` looks like when we pass it into
    * the function. 
    * The idea is that we fetch them from the PBB via the API from the Wallet
    * and then pass them onto the Vault from which `wasm_decrypt()` is called ---I think I need help to understand what you mean here
    **/

    // let encryptions: Vec<Cipher> = get_ciphers(&client, topic_id.clone(), nr_of_shuffles).await?;
    // let encryptions: Vec<BigCipher> = Wrapper(encryptions).into();

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


    println!();
    println!();
    // web_sys::console::log();

    // web_sys::console::log(&pk.h);


    // web_sys::console::log_1(&JsValue::from_serde(&pk.h.to_str_radix(16)).unwrap());


    // let v1_iter = encryptions.iter();

    // for val in v1_iter {
    //     web_sys::console::log_1(&JsValue::from_serde(&val.a.to_str_radix(16)).unwrap());
    //     web_sys::console::log_1(&JsValue::from_serde(&val.b.to_str_radix(16)).unwrap());
    //     web_sys::console::log_0();
    // }
    println!();

    // println!("PARAMS: {:?}", params);
    // println!();

    // println!("ENCRYPTIONS: {:?}", encryptions);
    // println!();

    // println!("DECRYPTIONS: {:?}", partial_decryptions);
    // println!();


    // create proof using public and private key share
    let raw_proof = DecryptionProof::generate(
        &params,
        &sk.x,
        &pk.h.into(),
        &r,
        encryptions,
        partial_decryptions,
        &sealer_id,
    );



   
    let decryption_proof = HexDecryptionProof {
        challenge: raw_proof.challenge.to_str_radix(16),
        response: raw_proof.response.to_str_radix(16)
    };

    web_sys::console::log_1(&JsValue::from_serde(&decryption_proof.challenge).unwrap());
    web_sys::console::log_0();
    web_sys::console::log_1(&JsValue::from_serde(&decryption_proof.response).unwrap());


    let result = DecryptPostBody {
        shares: shares,
        decryption_proof: decryption_proof
    };


    /*
    * TODO: return the decryption proof
    * eg. something like 
    * `JsValue::from_serde(&proof).unwrap()` --DONE
    **/
    JsValue::from_serde(&result).unwrap()
}