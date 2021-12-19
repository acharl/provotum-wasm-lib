extern crate console_error_panic_hook;

use wasm_bindgen::prelude::*;
use crate::crypto::{DecryptionProof, ElGamal, ElGamalParams, PrivateKey, PublicKey, Cipher as BigCipher};
/*
* TODO add all the relevant pieces of code such as `DecryptionProof`
* which are needed by `wasm_decrypt()`
**/
use serde::{Serialize, Deserialize};

use hex_literal::hex;
use num_bigint::BigUint;
use std::str::FromStr;


#[derive(Serialize, Deserialize, Clone, Eq, PartialEq, Debug, Hash)]
pub struct DecryptPostBody {
    pub decryption_proof: DecryptionProof,
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
pub fn wasm_decrypt(_encryptions:  &JsValue, _r: &JsValue, _params: &JsValue, _sk: &JsValue, _pk: &JsValue) -> JsValue {   

    let encryptions: Vec<BigCipher> = _encryptions.into_serde().unwrap();
    let string: String = _r.into_serde().unwrap();
    let r: BigUint = BigUint::from_str(&string).unwrap();
    let params: ElGamalParams = _params.into_serde().unwrap();
    let sk: PrivateKey = _sk.into_serde().unwrap();
    let pk: PublicKey = _pk.into_serde().unwrap();

    let sealer_id: [u8; 32] = hex!("8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48").into();

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

    /*
    * TODO: add partial_decrypt_a from Moritz' code in 
    * an appropriate place such as, so that 
    * we can actually call it here. Probably it would make sense 
    * to create a new file and paste the contents of `encryption.rs` (until line 354)
    * from Moritz' code in there, which includes partial_decrypt_a() ---DONE I have added the encrypt. and decryption (proof) into crypto
    * I thought it makes sense to add both, let me know if the seond one is unnecessary
    **/


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


    let result = DecryptPostBody {
        shares: shares,
        decryption_proof: proof
    };

    /*
    * TODO: return the decryption proof
    * eg. something like 
    * `JsValue::from_serde(&proof).unwrap()` --DONE
    **/
    JsValue::from_serde(&result).unwrap()
}