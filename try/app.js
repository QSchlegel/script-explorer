const express = require('express')
const app = express()
const port = 3000
const cors = require('cors'); 

const {
    ScriptHash,
    NetworkInfo,
    EnterpriseAddress,
    StakeCredential
  } = require("@emurgo/cardano-serialization-lib-nodejs")
  
  
  const addrFromHash = (mode, hash) => {
    const scripthash = ScriptHash.from_bytes(Buffer.from(hash,"hex"));
    const cred = StakeCredential.from_scripthash(scripthash);
    const networkId = (mode == 'mainnet')? NetworkInfo.mainnet().network_id() : NetworkInfo.testnet().network_id();
    const baseAddr = EnterpriseAddress.new(networkId, cred);
    const addr = baseAddr.to_address();
    const addrBech32 = addr.to_bech32();
    return addrBech32;
  }


app.use(cors({ origin: 'http://10.8.8.127:9000'}) )

  //ToDo remove potential leading spaces
app.get('/addrFromHash/:mode/:hash', (req, res) => {
  const hash = req.params.hash
  try {
    const addr = addrFromHash(req.params.mode, hash)
    console.log(hash + '  ->  ' + addr)
    res.status(200).send(addr)
  } catch (err){
    console.log(err)
    res.status(400).send(err)
  }
  
  
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})