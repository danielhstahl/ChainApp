const chain = require('../chain/sdk/node/src/index')
const nodePersist=require('node-persist')
const access=require('./client_key.json')
const accessKey=`${access.tokenname}:${access.token}`
const fs=require('fs')
const client = new chain.Client(access.url||"http://localhost:1999", accessKey)
const signer = new chain.HsmSigner()

const fsPromisfy=(file)=>new Promise((resolve, reject)=>{
    fs.readFile(file, (err, data)=>{
        err?reject(err):resolve(data)
    })
})
//console.log(client)
/**I want to put something here where I interact with n depositors and m banks and assess the useability of a deposit/loan relationship.   */

const account1="DanielAccount"
const account2="NotDanielAccount"
/**compile contracts */
const compileContract=()=>{
    return fsPromisfy("./DepositContract.ivy").then(contract=>{
        return client.ivy.compile({
            contract:contract.toString()
        })
    })
}
const generateAccounts=()=>{
    let danielKey
    return nodePersist.init().then(()=>{
        return client.mockHsm.keys.create()
    }).then(danielKey_=>{
        danielKey=danielKey_
        nodePersist.setItem(account1, danielKey.xpub)
        signer.addKey(danielKey.xpub, client.mockHsm.signerConnection)
        return client.mockHsm.keys.create()
    }).then(someOtherPersonKey=>{
        nodePersist.setItem(account2, someOtherPersonKey.xpub)
        return Promise.all([
            client.assets.create({
                alias:'DanielStock',
                rootXpubs:[danielKey.xpub],
                quorum:1
            }),
            client.accounts.create({
                alias:account1,
                rootXpubs:[danielKey.xpub],
                quorum:1
            }),
            client.accounts.create({
                alias:account2,
                rootXpubs:[someOtherPersonKey.xpub],
                quorum:1
            })
        ])
    }).then(()=>{
        return client.transactions.build(builder => {
            builder.issue({
                assetAlias: 'DanielStock',
                amount: 100
            })
            builder.controlWithAccount({
                accountAlias: account1,
                assetAlias: 'DanielStock',
                amount: 100
            })
        })
    }).then(template => signer.sign(template)
    ).then(signed => client.transactions.submit(signed))
}
const transact=(aliasSpend, aliasReceive, aliasAsset, amount)=>{//receiver, see https://chain.com/docs/1.2/core/build-applications/control-programs
    nodePersist.init().then(()=>{
        return nodePersist.getItem(aliasSpend)
    }).then(key=>{
        return signer.addKey(key, client.mockHsm.signerConnection)
    }).then(()=>{
        return client.accounts.createReceiver({
            accountAlias: aliasReceive,
        })
    }).then(receiver => {
        return JSON.stringify(receiver)
    }).then(receiverSerialized => {
        /*how to send money transact in node */
        return client.transactions.build(builder => {
            builder.spendFromAccount({
                accountAlias: aliasSpend,
                assetAlias: aliasAsset,
                amount
            })
            builder.controlWithReceiver({
                receiver: JSON.parse(receiverSerialized),
                assetAlias: aliasAsset,
                amount
            })
        })
    }).then(template =>signer.sign(template)
    ).then(signed =>client.transactions.submit(signed)
    ).then(() =>{
        console.log("transaction complete")
    }).catch(err=>{
        console.log(err)
    })
}
generateAccounts().then(()=>{
    transact(account1, account2, "DanielStock", 10)

})