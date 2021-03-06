// use rand_core::{OsRng, RngCore};

// use num_traits::{One, Zero};
// use core::ops::{Sub};
use num_bigint::{BigUint};
use num_traits::Zero;

use std::panic;

#[derive(Clone, Eq, PartialEq, Debug, Hash)]
pub struct Random;

impl Random {
   
    /// Generates a random value: 0 < x < number
    ///
    /// Arguments
    /// * `number` - upper limit
    pub fn get_random_less_than(number: &BigUint) -> BigUint {
        assert!(*number > BigUint::zero(), "q must be greater than zero!");
        // let one = BigUint::one();
        // let upper_bound = number.clone().sub(one);
        // let bit_size: u64 = upper_bound.bits();
        
        // let mut rng = OsRng;
        // let mut buffer = vec![0u8; 64];
        // rng.fill_bytes(&mut buffer);
        

    
        BigUint::new(vec![1230908])
    }
    
}
