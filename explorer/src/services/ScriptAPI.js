import API from './API'

export default {
    data: {
        return: {
            url:'',
            pid: ''
        }
        
    },
    getScriptList(c, p, o){
        return API(this.data.return.url , this.data.return.pid).get('/scripts', { params: { count:c, page: p, order:o } })
    },
    getScriptInfo(sh){
        return API(this.data.return.url , this.data.return.pid).get('/scripts/'+sh)
    },
    getScriptJSON(sh){
        return API(this.data.return.url , this.data.return.pid).get('/scripts/'+sh+'/json')
    },
    getScriptCBOR(sh){
        return API(this.data.return.url , this.data.return.pid).get('/scripts/'+sh+'/cbor')
    },
    getScriptRedeemer(sh){
        return API(this.data.return.url , this.data.return.pid).get('/scripts/'+sh+'/redeemers')
    },
    getScriptDatum(dh){
        return API(this.data.return.url , this.data.return.pid).get('/scripts/datum/'+dh)
    },
    getHealth(){
        return API(this.data.return.url , this.data.return.pid).get('/health')
    },
    getUtxos(t){
        return API(this.data.return.url , this.data.return.pid).get('/txs/'+t+'/utxos')
    },
    getAsset(a){
        return API(this.data.return.url , this.data.return.pid).get('/assets/'+a)
    }
}