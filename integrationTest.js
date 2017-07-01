const chain = require('chain-sdk')
const access=require('./client_key.json')
const accessKey=`client:${access.client}`


const client = new chain.Client("http://localhost:1999", accessKey)


/**I want to put something here where I interact with n depositors and m banks and assess the useability of a deposit/loan relationship.   */