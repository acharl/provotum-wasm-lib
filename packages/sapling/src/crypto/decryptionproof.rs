use crate::crypto::{
    helper::Helper,
    types::{Cipher, ElGamalParams, ModuloOperations},
};
// use alloc::vec::Vec;
use num_bigint::BigUint;
use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize, Clone, Eq, PartialEq, Debug, Hash)]
pub struct HexDecryptionProof {
    pub challenge: String,
    pub response: String,
}

#[derive(Serialize, Deserialize, Clone, Eq, PartialEq, Debug, Hash)]
pub struct DecryptionProof {
    pub challenge: BigUint,
    pub response: BigUint,
}

impl DecryptionProof {
    /// GenDecryptionProof Algorithm 8.50 (CHVoteSpec 3.2)
    ///
    /// Generates a decryption proof relative to encryptions e and partial decryptions c. This is essentially a NIZKP of knowledge of the private key sk satisfying c_i = b_i ^ sk for all input encryptions e_i = (a_i, b_i) and pk = g^sk.
    pub fn generate(
        params: &ElGamalParams,
        sk: &BigUint, // private key of public key share
        pk: &BigUint, // public key of public key share -> not system public key
        r: &BigUint,
        vec_e: Vec<Cipher>,
        vec_c: Vec<BigUint>,
        id: &[u8],
    ) -> DecryptionProof {
        assert!(
            vec_e.len() == vec_c.len(),
            "encryptions and partial decryptions need to have the same length!"
        );
        assert!(!vec_e.is_empty(), "vectors cannot be empty!");

        // system parameters
        let g = &params.g;
        let q = &params.q();
        let p = &params.p;

        // the commitment
        let t_0 = g.modpow(r, p);

        // get commitments for all encryptions
        let mut vec_t: Vec<BigUint> = Vec::with_capacity(vec_e.len() + 1);
        vec_t.push(t_0);

        for e_i in vec_e.iter() {
            let t_i = e_i.a.modpow(r, p);
            vec_t.push(t_i);
        }

        // compute challenge
        // hash public values (hash(unique_id, constant, pk, vec_e, vec_c, vec_t) mod q)
        let mut c = Helper::hash_decryption_proof_inputs(id, "decryption", pk, vec_e, vec_c, vec_t);
        c %= q;

        // compute the response: d = r - c * sk mod q
        let d = r.modsub(&c.modmul(sk, q), q);

        DecryptionProof {
            challenge: c,
            response: d,
        }
    }

    /// CheckDecryptionProof Algorithm 8.51 (CHVoteSpec 3.2)
    ///
    /// Verifies a proof of knowledge of a secret key (sk) that belongs to a public key (pk = g^sk) using the Schnorr protocol. It is a proof of knowledge of a discrete logarithm of x = log_g(g^x).
    pub fn verify(
        params: &ElGamalParams,
        pk: &BigUint, // public key of public key share -> not system public key
        proof: &DecryptionProof,
        vec_e: Vec<Cipher>,
        vec_c: Vec<BigUint>,
        id: &[u8],
    ) -> bool {
        assert!(
            vec_e.len() == vec_c.len(),
            "encryptions and partial decryptions need to have the same length!"
        );
        assert!(!vec_e.is_empty(), "vectors cannot be empty!");

        // system parameters
        let g = &params.g;
        let q = &params.q();
        let p = &params.p;

        // the proof
        let c = &proof.challenge;
        let d = &proof.response;

        // the recomputed commitment
        // t_0 = pk^c * g^d mod p
        let pk_c = pk.modpow(&c, p);
        let g_d = g.modpow(d, p);
        let t_0 = pk_c.modmul(&g_d, p);

        // recompute all commitments for all encryptions
        let mut recompute_vec_t: Vec<BigUint> = Vec::with_capacity(vec_e.len() + 1);
        recompute_vec_t.push(t_0);

        for index in 0..vec_e.len() {
            let a_i = &vec_e[index].a;
            let c_i = &vec_c[index];

            // recompute t_i = c_i^c * a_i^d mod p
            let c_i_c = c_i.modpow(&c, p);
            let a_i_d = a_i.modpow(&d, p);
            let t_i = c_i_c.modmul(&a_i_d, p);
            recompute_vec_t.push(t_i);
        }

        // recompute the challenge
        // hash public values (hash(unique_id, constant, pk, vec_e, vec_c, recompute_vec_t) mod q)
        let mut recomputed_c = Helper::hash_decryption_proof_inputs(
            id,
            "decryption",
            pk,
            vec_e,
            vec_c,
            recompute_vec_t,
        );
        recomputed_c %= q;

        // verify that the challenges are the same
        &recomputed_c == c
    }
}
