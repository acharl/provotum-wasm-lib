use crate::crypto::types::{ElGamalParams, PrivateKey, PublicKey};
use num_bigint::BigUint;
use num_traits::One;
use blake2::{Blake2b, Digest};

pub struct Helper;

impl Helper {
    pub fn setup_lg_system_with_sk(sk_as_bytes: &[u8]) -> (ElGamalParams, PrivateKey, PublicKey) {
        // 2048bit key
        let p = BigUint::parse_bytes(b"B7E151628AED2A6ABF7158809CF4F3C762E7160F38B4DA56A784D9045190CFEF324E7738926CFBE5F4BF8D8D8C31D763DA06C80ABB1185EB4F7C7B5757F5958490CFD47D7C19BB42158D9554F7B46BCED55C4D79FD5F24D6613C31C3839A2DDF8A9A276BCFBFA1C877C56284DAB79CD4C2B3293D20E9E5EAF02AC60ACC93ED874422A52ECB238FEEE5AB6ADD835FD1A0753D0A8F78E537D2B95BB79D8DCAEC642C1E9F23B829B5C2780BF38737DF8BB300D01334A0D0BD8645CBFA73A6160FFE393C48CBBBCA060F0FF8EC6D31BEB5CCEED7F2F0BB088017163BC60DF45A0ECB1BCD289B06CBBFEA21AD08E1847F3F7378D56CED94640D6EF0D3D37BE69D0063", 16).unwrap();
        let x = BigUint::parse_bytes(sk_as_bytes, 16).unwrap();
        Self::setup_system(p, x)
    }

    // helper function to setup ElGamal system before a test
    fn setup_system(p: BigUint, x: BigUint) -> (ElGamalParams, PrivateKey, PublicKey) {
        let params = ElGamalParams {
            p,
            g: BigUint::parse_bytes(b"4", 10).unwrap(),
            h: BigUint::parse_bytes(b"9", 10).unwrap(),
        };
        assert!(
            Self::is_generator(&params.p, &params.q(), &params.g),
            "g is not a generator!"
        );
        assert!(
            Self::is_generator(&params.p, &params.q(), &params.h),
            "h is not a generator!"
        );
        let sk = PrivateKey {
            params: params.clone(),
            x,
        };
        let pk = PublicKey {
            params: params.clone(),
            h: params.g.modpow(&sk.x, &params.p),
        };
        (params, sk, pk)
    }

    pub fn is_generator(p: &BigUint, q: &BigUint, g: &BigUint) -> bool {
        // g is a generator (valid) if:
        // 1. g != 1
        // 2. q != q
        // 3. g^q mod p == 1
        let one = BigUint::one();
        g != q && g != &one && (g.modpow(q, p) == one)
    }


    pub fn hash_key_gen_proof_inputs(
        id: &[u8],
        constant: &str,
        h: &BigUint,
        b: &BigUint,
    ) -> BigUint {
        let hasher = Blake2b::new();
        let hash = hasher
            .chain(id)
            .chain(constant.as_bytes())
            .chain(h.to_bytes_be())
            .chain(b.to_bytes_be())
            .finalize();
        BigUint::from_bytes_be(&hash)
    }
   
}
