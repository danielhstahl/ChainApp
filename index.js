const chain=require('chain-sdk')
const client=new chain.Client()
const signer=new chain.HsmSigner()

const danielAccount=(accountKey)=>({
    alias: 'daniel',
    rootXpubs: [accountKey],
    quorum: 1,
    tags: {
        type: 'checking',
        first_name: 'Alice',
        last_name: 'Jones',
        user_id: '12345',
    }
})

client.mockHsm.keys.create()
.then(key=>{
    const dAccount=danielAccount(key)
    signer.addKey(key.xpub, client.mockHsm.signerConnection)
    return signer.sign(unsigned)
})



const bobAccount=(accountKey)=>({
    alias: 'bob',
    rootXpubs: [accountKey],
    quorum: 1,
    tags: {
        type: 'checking',
        first_name: 'Alice',
        last_name: 'Jones',
        user_id: '12345',
    }
})
client.accounts.create(danielAccount())
const myAwesomeAsset=(assetKey)=>({
    alias:'daniel_money',
    rootXpubs:[assetKey]//asset key is the key belonging to the asset...what does it mean for an asset to have a key?
    ,quorum: 1 //im the only one who is required to vote on my money!
    ,tags:{
        internalRating:'1'//what is this??
    },
    definition:{
        issuer:'daniel',
        type:'currency',
        subtype:'heavily inflationary',
        class:'the awesome kind'
    }
})
client.assets.create(myAwesomeAsset())//is this broadcast to the entire network or just local?

client.assets.queryAll({ //get all local assets
  filter: 'is_local=$1',
  filterParams: ['yes'],
}, (asset, next) => {
  console.log('Local asset: ' + asset.alias)
  next()
})

client.assets.queryAll({
  filter: 'definition.type=$1 AND definition.subtype=$2 AND definition.class=$3',
  filterParams: ['currency', 'heavily inflationary', 'the awesome kind'],
}, (asset, next) => {
  console.log('Private preferred security: ' + asset.alias)
  next()
})

const issuePromise = client.transactions.build(builder => { //only available on local...issued to local account.  Can be placed on chain below
  builder.issue({
    assetAlias: 'daniel_money',
    amount: 1000
  })
  builder.controlWithAccount({
    accountAlias: 'daniel',
    assetAlias: 'daniel_money',
    amount: 1000
  })
})

const signingPromise = signer.sign(issueTx)
client.transactions.submit(signedIssueTx) //now its on the network


client.transactions.build(builder => { //since assigning to external account, MUST be on chain
  builder.issue({
    assetAlias: 'daniel_money',
    amount: 2000
  })
  builder.controlWithReceiver({
    receiver: externalReceiver,
    assetAlias: 'daniel_money',
    amount: 2000
  })
}).then(template => {
  return signer.sign(template)
}).then(signed => {
  return client.transactions.submit(signed)
})

client.transactions.queryAll({ //query all issue transactions...is this only local?
  filter: 'inputs(type=$1 AND asset_alias=$2)',
  filterParams: ['issue', 'acme_common'],
}, (tx, next) => {
  console.log('Acme Common issued in tx ' + tx.id)
  next()
})

client.transactions.queryAll({ //query all spend transactions
  filter: 'inputs(type=$1 AND asset_alias=$2)',
  filterParams: ['spend', 'acme_common'],
}, (tx, next) => {
  console.log('Acme Common transferred in tx ' + tx.id)
  next()
})

const spendPromise = client.transactions.build(builder => { //local
  builder.spendFromAccount({
    accountAlias: 'daniel',
    assetAlias: 'daniel_money',
    amount: 10
  })
  builder.controlWithAccount({
    accountAlias: 'bob',
    assetAlias: 'daniel_money',
    amount: 10
  })
})


/* 
const keyPromise=client.mockHsm.keys.create()
signer.addKey(key.xpub, client.mockHsm.signerConnection)
const signerPromise=signer.sign(unsigned)
*/