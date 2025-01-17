// tällä minä vain teen sen salasanan sinne tietokantaan hashattuna
// kun sen haluaa nähdä tuolla terminaalissa, niin kirjoita "node hasheri.js"

let hashi = require('crypto').createHash('SHA512').update('kissakala').digest('hex')

console.log(hashi)

