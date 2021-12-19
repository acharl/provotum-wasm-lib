use codec::{Decode, Encode};
use crypto::{Cipher as BigCipher};
use num_bigint::BigUint;
use sp_std::{collections::btree_map::BTreeMap, vec::Vec};
use serde::{Deserialize, Serialize};

/// the BigCipher from the crypto crate.
/// different types which the blockchain can handle.
#[derive(Deserialize, Serialize, Encode, Decode, Default, Clone, PartialEq, Eq, Debug)]
pub struct Cipher {
    pub a: Vec<u8>,
    pub b: Vec<u8>,
}

impl Into<Cipher> for BigCipher {
    fn into(self) -> Cipher {
        Cipher {
            a: self.a.to_bytes_be(),
            b: self.b.to_bytes_be(),
        }
    }
}

impl Into<BigCipher> for Cipher {
    fn into(self) -> BigCipher {
        BigCipher {
            a: BigUint::from_bytes_be(&self.a),
            b: BigUint::from_bytes_be(&self.b),
        }
    }
}

/// required to perform into() conversion for trait Vec
/// for Vec<Cipher> is not allowed, since trait Vec is not defined here
pub struct Wrapper<T>(pub Vec<T>);

impl Into<Vec<BigCipher>> for Wrapper<Cipher> {
    fn into(self) -> Vec<BigCipher> {
        self.0
            .into_iter()
            .map(|v| v.into())
            .collect::<Vec<BigCipher>>()
    }
}

impl Into<Vec<Cipher>> for Wrapper<BigCipher> {
    fn into(self) -> Vec<Cipher> {
        self.0
            .into_iter()
            .map(|v| v.into())
            .collect::<Vec<Cipher>>()
    }
}