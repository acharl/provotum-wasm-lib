use core::ops::{Add, Div, Mul, Sub};
use num_bigint::{BigInt, BigUint};
use num_traits::{One, Zero};

use codec::{Decode, Encode};
use crate::crypto::keygenproof::KeyGenerationProof;
use serde::{Serialize, Deserialize};

#[derive(Clone, Eq, PartialEq, Debug, Hash, Serialize, Deserialize)]
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


pub trait ModuloOperations {
    /// Calculates the modular multiplicative of a BigUint: result = self * rhs % modulus.
    fn modmul(&self, rhs: &Self, modulus: &Self) -> Self;

    /// Calculates the modular division of two BigUints: result = self / divisor % modulus.
    fn moddiv(&self, divisor: &Self, modulus: &Self) -> Option<BigUint>;

    /// Calculates the modular addition of two BigUints: result = (self + other) % modulus.
    fn modadd(&self, other: &Self, modulus: &Self) -> Self;

    /// Calculates the modular subtraction of two BigUints: result = ((self + modulus) - other) % modulus.
    fn modsub(&self, other: &Self, modulus: &Self) -> Self;

    /// Calculates the modular multiplicative inverse x of an integer a such that ax ≡ 1 (mod m).
    /// Alternative formulation: a^-1 (mod m)
    fn invmod(&self, modulus: &Self) -> Option<BigUint>;
    // fn extended_gcd(a: &BigUint, b: &BigUint) -> (BigUint, BigUint, BigUint);
}

impl ModuloOperations for BigUint {
    fn modmul(&self, multiplier: &Self, modulus: &Self) -> Self {
        assert!(
            !modulus.is_zero(),
            "attempt to calculate with zero modulus!"
        );
        self.mul(multiplier) % modulus
    }

    fn moddiv(&self, divisor: &Self, modulus: &Self) -> Option<BigUint> {
        assert!(
            !modulus.is_zero(),
            "attempt to calculate with zero modulus!"
        );
        assert!(
            divisor < modulus,
            "modulus must be greater than the divisor!"
        );
        assert!(self < modulus, "modulus must be greater than the dividend!");
        divisor
            .invmod(modulus)
            .map(|value| self.mul(&value) % modulus)
    }

    fn modadd(&self, other: &Self, modulus: &Self) -> Self {
        assert!(
            !modulus.is_zero(),
            "attempt to calculate with zero modulus!"
        );
        self.add(other) % modulus
    }

    fn modsub(&self, other: &Self, modulus: &Self) -> Self {
        assert!(
            !modulus.is_zero(),
            "attempt to calculate with zero modulus!"
        );
        // self + modulus is done to ensure that the value is always >0
        // it's a simple shift by the whole modulus
        self.add(modulus).sub(other) % modulus
    }

    fn invmod(&self, modulus: &Self) -> Option<BigUint> {
        assert!(
            !modulus.is_zero(),
            "attempt to calculate with zero modulus!"
        );
        assert!(
            self < modulus,
            "modulus must be greater or equal to the number!"
        );
        let a = BigInt::from(self.clone());
        let b = BigInt::from(modulus.clone());

        let (g, x, _) = extended_gcd(&a, &b);
        if g != BigInt::one() {
            None
        } else {
            let result = ((x % &b) + &b) % &b;
            result.to_biguint()
        }
    }
}


fn extended_gcd(a: &BigInt, b: &BigInt) -> (BigInt, BigInt, BigInt) {
    assert!(a < b, "a must be smaller than b!");
    if *a == BigInt::zero() {
        (b.clone(), BigInt::zero(), BigInt::one())
    } else {
        let (g, x, y) = extended_gcd(&(b % a), &a);
        (g, y - (b / a) * x.clone(), x)
    }
}


// the public key share submitted by each sealer to generated the system's public key
#[derive(Encode, Decode, Default, Clone, PartialEq, Eq, Debug, Serialize, Deserialize)]

pub struct PublicKeyShare {
    pub pk: Vec<u8>,
    pub proof: PublicKeyShareProof,
}


#[derive(Encode, Decode, Default, Clone, PartialEq, Eq, Debug, Serialize, Deserialize)]

pub struct PublicKeyShareProof {
    pub challenge: Vec<u8>,
    pub response: Vec<u8>,
}

impl Into<PublicKeyShareProof> for KeyGenerationProof {
    fn into(self) -> PublicKeyShareProof {
        PublicKeyShareProof {
            challenge: self.challenge.to_bytes_be(),
            response: self.response.to_bytes_be(),
        }
    }
}

impl Into<KeyGenerationProof> for PublicKeyShareProof {
    fn into(self) -> KeyGenerationProof {
        KeyGenerationProof {
            challenge: BigUint::from_bytes_be(&self.challenge),
            response: BigUint::from_bytes_be(&self.response),
        }
    }
}