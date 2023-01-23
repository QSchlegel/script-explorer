import { defineStore } from 'pinia';
import axios from "axios";
import { useNetStore } from './net-store';

const netStore = useNetStore();

export const useAssetStore = defineStore('asset-store', {
    state: () => ({

        assetList: [],
        assetAddrList: [],
        assetTxList: [],
        policyList:[]

    }),
    actions: {
        async loadAsset(asset) {
            if (this.assetList.filter((f) => f.asset === asset).length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'assets/' + asset, {
                        headers: {
                            project_id: netStore.ApiDetails.pid
                        }
                    })
                    this.assetList = this.assetList.concat(data.data)
                    return true
                    
                } catch (err) {
                    console.log(err)
                    return false
                }
            }
            return false
        },
        async loadAssetAddr(asset) {
            if (this.assetAddrList.filter((f) => f.asset === asset).length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'assets/' + asset +'/addresses', {
                        headers: {
                            project_id: netStore.ApiDetails.pid
                        }
                    })
                    this.assetAddrList = this.assetAddrList.concat({
                        asset: asset,
                        addrs:data.data})
                } catch (err) {
                    console.log(err)
                }
            }
        },
        async loadAssetTx(asset) {
            if (this.assetTxList.filter((f) => f.asset === asset).length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'assets/' + asset +'/transactions', {
                        headers: {
                            project_id: netStore.ApiDetails.pid
                        }
                    })
                    this.assetTxList = this.assetTxList.concat({
                        asset: asset,
                        txs:data.data})
                } catch (err) {
                    console.log(err)
                }
            }
        },
        async loadPolicy(policyId){
            const tmp = this.policyList.filter((f)=> f.policyId === policyId)
            if(tmp){
                try{
                    const data = await axios.get( netStore.ApiDetails.url + 'assets/policy/' + policyId, {
                        headers: {
                            project_id: netStore.ApiDetails.pid
                        }
                    })
                    this.policyList.push({
                        policyId: policyId,
                        assets: data.data
                    })
                    return true;

                } catch (err){
                    return false;
                }
            }
            return true;
        }
    }
})