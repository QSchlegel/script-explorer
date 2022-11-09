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
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.addressFromHash = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const mode = req.query.mode
    const address = req.query.address
    res.status(200).send(addrFromHash(mode, address))

  }catch (err){
    res.status(400).send(err)
  }
};
