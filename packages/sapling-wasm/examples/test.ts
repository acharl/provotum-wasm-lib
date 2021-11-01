
import * as provotumAirGap from '../dist'
import BN = require('bn.js')
import crypto = require('crypto')

const run = async() => {
try {
    const secretKey = '1000008'
    const q = await provotumAirGap.keygen(secretKey)

    const rawByteSize = Buffer.byteLength(q.toString(), 'utf8')
    const byteSize = new BN(rawByteSize, 10)
    const targetValue: BN = new BN(q, 16)
  
    const randomValue = getSecureRandomValue(targetValue, byteSize)


    console.log(randomValue.lt(targetValue))
} catch (error) {
    console.log(error)
 }
}
run()




    // get a secure random value x: 0 < x < n
export const getSecureRandomValue = (n: BN, BYTE_SIZE: BN): BN => {
  let byteSize: number
  try {
    byteSize = BYTE_SIZE.toNumber()
  } catch {
    // https://www.ecma-international.org/ecma-262/5.1/#sec-8.5
    // used for large numbers from EC
    byteSize = 32
  }

  let randomBytes: Buffer = crypto.randomBytes(byteSize)
  let randomValue: BN = new BN(randomBytes)

  return randomValue.mod(n)
}