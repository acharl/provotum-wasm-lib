
import * as provotumAirGap from '../dist'

const run = async() => {
try {
    const keygen = await provotumAirGap.keygen('108')
    console.log('KEYGEN ', keygen)

} catch (error) {
    console.log(error)
    
}
}
run()