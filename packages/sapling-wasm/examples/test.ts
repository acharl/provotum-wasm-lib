
import * as provotumAirGap from '../dist'

const run = async() => {
try {
    const keygen = await provotumAirGap.keygen('1000008')
    console.log('KEYGEN ', JSON.stringify(keygen))

} catch (error) {
    console.log(error)
    
}
}
run()