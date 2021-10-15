use num_bigint::{BigUint};
use core::ops::{Div, Sub};
use num_traits::One;

use serde::{Serialize, Deserialize};


#[derive(Clone, Eq, PartialEq, Debug, Hash, Serialize, Deserialize)]
// #[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub struct ElGamalParams {
    // modulus: p
    pub p: BigUint,

    // 1. public generator g
    pub g: BigUint,

    // 2. public generator h
    pub h: BigUint,
}

impl ElGamalParams {
    // q:
    // q is valid if it is prime
    pub fn q(&self) -> BigUint {
        (self.p.clone().sub(BigUint::one())).div(BigUint::from(2u32))
    }
}

#[derive(Clone, PartialEq, Eq, Debug, Serialize, Deserialize)]
// #[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
pub struct PublicKey {
    // system parameters (p, g)
    pub params: ElGamalParams,

    // public key: h = g^x mod p
    // - g: generator
    // - x: private key
    pub h: BigUint,
}

impl PublicKey {
    pub fn combine_public_keys_bigunits(self, others: &[BigUint]) -> Self {
        assert!(!others.is_empty(), "there must be at least another key!");
        let mut h: BigUint = self.h.clone();
        others.iter().for_each(|pk| h *= pk);
        h %= self.params.p.clone();
        PublicKey {
            h,
            params: self.params,
        }
    }

    pub fn combine_public_keys(self, others: &[PublicKey]) -> Self {
        assert!(!others.is_empty(), "there must be at least another key!");
        let mut h: BigUint = self.h.clone();
        others.iter().for_each(|pk| h *= pk.h.clone());
        h %= self.params.p.clone();
        PublicKey {
            h,
            params: self.params,
        }
    }
}

#[derive(Clone, Eq, PartialEq, Debug, Hash, Serialize, Deserialize)]
pub struct PrivateKey {
    // system parameters (p, g)
    pub params: ElGamalParams,

    // private key: x
    // - x: a random value (x ∈ Zq)
    pub x: BigUint,
}

