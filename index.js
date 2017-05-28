const chain=require('chain-sdk')
const client=new chain.Client()
const signer=new chain.HsmSigner()

const myAwesomeAsset=(assetKey)=>({
    alias:'daniel money',
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



/* 
const keyPromise=client.mockHsm.keys.create()
signer.addKey(key.xpub, client.mockHsm.signerConnection)
const signerPromise=signer.sign(unsigned)
*/