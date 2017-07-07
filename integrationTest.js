const chain = require('../chain/sdk/node/src/index')
const access=require('./client_key.json')
const accessKey=`${access.tokenname}:${access.tokenname}`
const fs=require('fs')

const client = new chain.Client(access.url, accessKey)

//console.log(client)
/**I want to put something here where I interact with n depositors and m banks and assess the useability of a deposit/loan relationship.   */


/**compile contracts */
fs.readFile("./DepositContract.ivy", (err, data)=>{
    err?console.log(err):null
    client.ivy.compile({
        contract:data.toString()
    }).then(result=>console.log(result)).catch(err=>console.log(err))
})
