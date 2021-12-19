use crate::crypto::{Cipher, ModuloOperations, PrivateKey, PublicKey};
// use alloc::vec::Vec;
use num_bigint::BigUint;
use num_traits::{One, Zero};

#[derive(Clone, Eq, PartialEq, Debug, Hash)]
pub struct ElGamal;

impl ElGamal {
    /// Returns an ElGamal Encryption of a message. The message encoded such that additive homomorphic operations are possible i.e. g^m_1 * g^m_2 = g^(m_1 + m_2)
    /// - (a, b) = (g^r, pk.h^r * g^m)
    ///
    /// ## Arguments
    ///
    /// * `m`  - The message (BigUint)
    /// * `r`  - The random number used to encrypt_encode the vote
    /// * `pk` - The public key used to encrypt_encode the vote
    pub fn encrypt_encode(m: &BigUint, r: &BigUint, pk: &PublicKey) -> Cipher {
        let g = &pk.params.g;
        let p = &pk.params.p;
        let h = &pk.h;

        // a = g^r
        let a = g.modpow(r, p);

        // encode the message: g^m (exponential elgamal)
        let enc_m = ElGamal::encode_message(m, g, p);

        // b = h^r * g^m
        let h_pow_r = h.modpow(r, p);
        let b = h_pow_r.modmul(&enc_m, p);

        Cipher { a, b }
    }

    /// Returns an ElGamal Encryption of a message.
    /// NOTE! No message encoding done! If message encoding is required use: `encrypt_encode`
    /// - (a, b) = (g^r, pk.h^r * m)
    ///
    /// ## Arguments
    ///
    /// * `m`  - The message (BigUint)
    /// * `r`  - The random number used to encrypt the vote
    /// * `pk` - The public key used to encrypt the vote
    pub fn encrypt(m: &BigUint, r: &BigUint, pk: &PublicKey) -> Cipher {
        let g = &pk.params.g;
        let p = &pk.params.p;
        let q = &pk.params.q();
        let h = &pk.h;

        // perform quadratic residue check: m^q mod p == 1
        // to ensure DDH is given
        assert!(m.modpow(q, p) == BigUint::one());

        // a = g^r
        let a = g.modpow(r, p);

        // b = h^r * m
        let h_pow_r = h.modpow(r, p);
        let b = h_pow_r.modmul(m, p);

        Cipher { a, b }
    }

    /// Returns the plaintext contained in an ElGamal Encryption.
    /// Decrypts the ciphertext and decodes the result.
    /// Important! Requires that the encryption was done using `encrypt_encode`.
    /// - mh = b * (a^sk.x)^-1
    /// - m = log mh = log g^m
    ///
    /// ## Arguments
    ///
    /// * `cipher` - The ElGamal Encryption (a: BigUint, b: BigUint)
    /// * `sk`     - The private key used to decrypt the vote
    pub fn decrypt_decode(cipher: &Cipher, sk: &PrivateKey) -> BigUint {
        let a = &cipher.a;
        let b = &cipher.b;

        let g = &sk.params.g;
        let p = &sk.params.p;
        let x = &sk.x;

        // a = g^r -> a^x = g^r^x
        let s = a.modpow(x, p);

        // compute multiplicative inverse of s
        let s_1 = s.invmod(p).expect("cannot compute mod_inverse!");

        // b = g^m*h^r -> mh = b * s^-1
        let mh = b.modmul(&s_1, p);

        // brute force discrete logarithm
        ElGamal::decode_message(&mh, g, p)
    }

    /// Returns the plaintext contained in an ElGamal Encryption.
    /// NOTE! This function does not decode the message. Either it is not required or you must do it manually using `decode`.
    /// - m = b * (a^sk.x)^-1
    ///
    /// ## Arguments
    ///
    /// * `cipher` - The ElGamal Encryption (a: BigUint, b: BigUint)
    /// * `sk`     - The private key used to decrypt the vote
    pub fn decrypt(cipher: &Cipher, sk: &PrivateKey) -> BigUint {
        let a = &cipher.a;
        let b = &cipher.b;

        let p = &sk.params.p;
        let x = &sk.x;

        // a = g^r -> a^x = g^r^x
        let s = a.modpow(x, p);

        // compute multiplicative inverse of s
        let s_1 = s.invmod(p).expect("cannot compute mod_inverse!");

        // b = m * h^r -> m = b * s^-1
        b.modmul(&s_1, p)
    }

    /// Similar to GetDecryptions Algorithm 8.49 (CHVoteSpec 3.2)
    /// Computes the partial decryption of a given encryption e = (a,b) using a share sk of the private decryption key.
    ///
    /// Partially decrypts an ElGamal Encryption.
    /// Returns the decrypted part: a = (g^r) -> a^sk = (g^r)^sk
    ///
    /// ## Arguments
    ///
    /// * `cipher` - The ElGamal Encryption (a: BigUint, b: BigUint)
    /// * `sk`     - The private key used to decrypt the vote
    pub fn partial_decrypt_a(cipher: &Cipher, sk: &PrivateKey) -> BigUint {
        let a = &cipher.a;
        let p = &sk.params.p;
        let x = &sk.x;

        a.modpow(x, p)
    }

    /// Similar to GetVotes Algorithm 8.53 (CHVoteSpec 3.2)
    /// Computes the decrypted plaintext vote m by
    /// deducting the combined partial decryptions vec_a (== decrypted_a == a^sk == (g^r)^sk) from
    /// the left-hand side b of the ElGamal Encryption e = (a, b) = (g^r, pk^r * m)
    ///
    /// b = pk^r * m = (g^sk)^r * m = g^(sk*r) * m
    /// m = b / g^(sk*r) = b * (g^(sk*r))^(-1) = b * inverse_mod(g^(sk*r)) mod p
    /// Returns plaintext vote: m | encoded(m)
    ///
    /// ## Arguments
    ///
    /// * `b` - The component b of an ElGamal Encryption (a: BigUint, b: BigUint)
    /// * `decrypted_a` - The decrypted component a of an ElGamal Encryption
    /// * `p` - The group modulus p (BigUint)
    pub fn partial_decrypt_b(b: &BigUint, decrypted_a: &BigUint, p: &BigUint) -> BigUint {
        let s_1 = decrypted_a.invmod(p).expect("cannot compute mod_inverse!");

        // b = m * h^r -> m = b * s^-1
        b.modmul(&s_1, p)
    }

    /// Similar to GetCombinedDecryptions Algorithm 8.52 (CHVoteSpec 3.2)
    ///
    /// Combines a vector of paritially decrypted a compoents of Cipher { a, b }
    /// Returns the decrypted part a i.e. a multiplication of all partially decrypted parts
    ///
    /// ## Arguments
    ///
    /// * `vec_a` - A vector of partial decryptions of component a: Cipher { a, b }
    /// * `p` - The group modulus p (BigUint)
    pub fn combine_partial_decrypted_a(vec_a: Vec<BigUint>, p: &BigUint) -> BigUint {
        vec_a
            .iter()
            .fold(BigUint::one(), |sum, value| sum.modmul(value, p))
    }

    /// Similar to GetCombinedDecryptions Algorithm 8.52 (CHVoteSpec 3.2)
    /// Similar to `combine_partial_decrypted_a` but on a vector level (all encryptions at once).
    ///
    /// ## Arguments
    ///
    /// * `vec_vec_a` - A vector of all participants of a vecor of all partial decryptions of component a: Cipher { a, b }
    /// * `p` - The group modulus p (BigUint)
    pub fn combine_partial_decrypted_as(vec_vec_a: Vec<Vec<BigUint>>, p: &BigUint) -> Vec<BigUint> {
        assert!(
            !vec_vec_a.is_empty(),
            "there must be at least one participant."
        );
        assert!(!vec_vec_a[0].is_empty(), "there must be at least one vote.");
        let mut combined_decrypted_as = Vec::with_capacity(vec_vec_a[0].len());

        // outer loop: all partial decrypted a for all submitted votes -> size = # of votes
        for i in 0..vec_vec_a[0].len() {
            // inner loop: all partial decryptions by all participants -> size = # of participants
            let combined_decrypted_a = vec_vec_a
                .iter()
                .fold(BigUint::one(), |product, partial_decryptions| {
                    product.modmul(&partial_decryptions[i], p)
                });
            combined_decrypted_as.push(combined_decrypted_a);
        }
        combined_decrypted_as
    }

    /// Encodes a plain-text message to be used in an explonential ElGamal scheme
    /// Returns encoded_message = g^m.
    ///
    /// ## Arguments
    ///
    /// * `m` - The message  (BigUint)
    /// * `g` - The generator of the cyclic group Z_p (BigUint)
    /// * `p` - The group modulus p (BigUint)
    pub fn encode_message(m: &BigUint, g: &BigUint, p: &BigUint) -> BigUint {
        g.modpow(m, p)
    }

    /// Decodes an explonential ElGamal scheme encoded message by brute forcing the discrete lograithm.
    /// The goal is to find: encoded_message = g^m by iterating through different values for m.
    ///
    /// ## Arguments
    ///
    /// * `encoded_message` - The encoded message: g^m (BigUint)
    /// * `g` - The generator of the cyclic group Z_p (BigUint)
    /// * `p` - The group modulus p (BigUint)
    pub fn decode_message(encoded_message: &BigUint, g: &BigUint, p: &BigUint) -> BigUint {
        let one = 1u32;
        let mut message = BigUint::zero();

        // *encoded_message = dereference 'encoded_message' to get the value
        // brute force the discrete logarithm
        while *encoded_message != ElGamal::encode_message(&message, g, p) {
            message += one
        }
        message
    }

    /// Homomorphically sums two ElGamal encryptions.
    /// Returns an ElGamal encryption.
    ///
    /// ## Arguments
    ///
    /// * `this`   - a Cipher { a, b } (ElGamal encryption)
    /// * `other`  - a Cipher { a, b } (ElGamal encryption)
    /// * `p` - The group modulus p (BigUint)    
    pub fn homomorphic_addition(this: &Cipher, other: &Cipher, p: &BigUint) -> Cipher {
        Cipher {
            a: this.a.modmul(&other.a, p),
            b: this.b.modmul(&other.b, p),
        }
    }

    /// Homomorphically substracts one ElGamal encryption from another.
    /// Returns an ElGamal encryption.
    ///
    /// ## Arguments
    ///
    /// * `this`   - a Cipher { a, b } (ElGamal encryption)
    /// * `other`  - a Cipher { a, b } (ElGamal encryption)
    /// * `p` - The group modulus p (BigUint)    
    pub fn homomorphic_subtraction(this: &Cipher, other: &Cipher, p: &BigUint) -> Cipher {
        let inverse = Cipher {
            a: other.a.invmod(p).expect("cannot compute mod_inverse!"),
            b: other.b.invmod(p).expect("cannot compute mod_inverse!"),
        };
        Self::homomorphic_addition(this, &inverse, p)
    }

    /// Homomorphically multiplies a scalar with an ElGamal encryption.
    /// Returns an ElGamal encryption.
    ///
    /// ## Arguments
    ///
    /// * `this`   - a Cipher { a, b } (ElGamal encryption)
    /// * `scalar`  - a BigUint
    /// * `p` - The group modulus p (BigUint)    
    pub fn homomorphic_multiply(this: &Cipher, scalar: &BigUint, p: &BigUint) -> Cipher {
        Cipher {
            a: this.a.modpow(scalar, p),
            b: this.b.modpow(scalar, p),
        }
    }

    /// Returns an ElGamal re-encryption of a message
    /// - message:      (a, b)   = (g^r, h^r * g^m)
    /// - reencryption: (a', b') = (a * g^r', b * h^r') = (g^(r * r'), h^(r * r') * g^m)
    ///
    /// ## Arguments
    ///
    /// * `cipher` - An ElGamal Encryption { a: BigUint, b: BigUint }
    /// * `r`      - The random number used to re-encrypt_encode the vote    
    /// * `pk`     - The public key used to re-encrypt_encode the vote
    pub fn re_encrypt(cipher: &Cipher, r: &BigUint, pk: &PublicKey) -> Cipher {
        let p = &pk.params.p;
        let a_ = pk.params.g.modpow(r, p);
        let b_ = pk.h.modpow(r, p);
        Cipher {
            a: cipher.a.modmul(&a_, p),
            b: cipher.b.modmul(&b_, p),
        }
    }

    /// Returns an ElGamal re-encryption of a message
    /// - message:      (a, b)      = (g^r, h^r * g^m)
    /// - zero:         (a', b')    = (g^r', h^r' * g^0) = (g^r', h^r')
    /// - reencryption: (a'', b'')  = (a * a', b * b')     = (g^(r * r'), h^(r * r') * g^m)
    ///
    /// Note: The g^0 = 1 and, therefore, can be dropped. Re-encryption -> homomorphic addition with zero.
    ///
    /// ## Arguments
    ///
    /// * `cipher` - An ElGamal Encryption { a: BigUint, b: BigUint }
    /// * `r`      - The random number used to re-encrypt_encode the vote    
    /// * `pk`     - The public key used to re-encrypt_encode the vote
    pub fn re_encrypt_via_addition(cipher: &Cipher, r: &BigUint, pk: &PublicKey) -> Cipher {
        let zero = Self::encrypt_encode(&BigUint::zero(), &r, &pk);
        Self::homomorphic_addition(cipher, &zero, &pk.params.p)
    }

    /// Returns a shuffled (permuted & re-encrypted) list of ElGamal encryptions.
    ///
    /// ## Arguments
    ///
    /// * `cipher` - An ElGamal Encryption { a: BigUint, b: BigUint }
    /// * `r`      - The random number used to re-encrypt_encode the vote    
    /// * `pk`     - The public key used to re-encrypt_encode the vote
    pub fn shuffle(
        encryptions: &[Cipher],
        permutation: &[usize],
        randoms: &[BigUint],
        pk: &PublicKey,
    ) -> Vec<(Cipher, BigUint, usize)> {
        assert!(
            encryptions.len() == randoms.len(),
            "encryptions and randoms need to have the same length!"
        );
        assert!(
            encryptions.len() == permutation.len(),
            "encryptions and permutation need to have the same length!"
        );
        assert!(!encryptions.is_empty(), "vectors cannot be empty!");

        // generate a permutatinon of size of the encryptions
        let mut re_encryptions: Vec<(Cipher, BigUint, usize)> = Vec::new();

        for entry in permutation {
            // get the encryption and the random value at the permutation position
            let encryption = &encryptions[*entry];
            let random = &randoms[*entry];

            // re-encrypt_encode
            let re_encryption = ElGamal::re_encrypt(&encryption, &random, pk);
            re_encryptions.push((re_encryption, random.clone(), *entry));
        }
        re_encryptions
    }
}

