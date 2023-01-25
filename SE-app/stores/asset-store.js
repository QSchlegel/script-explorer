import { defineStore } from 'pinia';
import axios from "axios";
import { useNetStore } from './net-store';
import { Buffer } from 'buffer/'  // note: the trailing slash is important!

const netStore = useNetStore();

export const useAssetStore = defineStore('asset-store', {
    state: () => ({

        assetList: [],
        assetAddrList: [],
        assetTxList: [],
        policyList: []

    }),
    actions: {
        async loadAsset(asset) {
            const tmp = this.assetList.filter((f) => f.data.asset === asset)
            if (tmp.length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'assets/' + asset, {
                        headers: {
                            project_id: netStore.ApiDetails.pid
                        },
                        params: { count: 100, page: 1, order: 'desc' }
                    })
                    const utf8Name = Buffer.from((data.data.asset_name) ? data.data.asset_name : '', 'hex').toString('utf8');
                    const res = {
                        assetName: utf8Name,
                        data: data.data
                    }
                    this.assetList.push(res)
                    return res
                } catch (err) {
                    console.log(err)
                    return false
                }
            } return tmp
        },

        async loadAssetAddr(asset) {
            const tmp = this.assetAddrList.filter((f) => f.asset === asset)
            if (tmp.length === 0) {
                try {
                    const data = axios.get(
                        netStore.ApiDetails.url + 'assets/' + asset + '/addresses', {
                        headers: {
                            project_id: netStore.ApiDetails.pid
                        }
                    })
                    const res = {
                        asset: asset,
                        addrs: await data.data
                    }
                    this.assetAddrList.push(res)
                    return res
                } catch (err) {
                    return false
                }
            } return tmp
        },

        async loadAssetTx(asset) {
            if (this.assetTxList.filter((f) => f.asset === asset).length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'assets/' + asset + '/transactions', {
                        headers: {
                            project_id: netStore.ApiDetails.pid
                        }
                    })
                    this.assetTxList = this.assetTxList.concat({
                        asset: asset,
                        txs: data.data
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        },

        async loadPolicy(policyId) {
            const tmp = this.policyList.filter((f) => f.policyId === policyId)
            if (tmp) {
                try {
                    const data = await axios.get(netStore.ApiDetails.url + 'assets/policy/' + policyId, {
                        headers: {
                            project_id: netStore.ApiDetails.pid
                        }
                    })
                    const res = {
                        policyId: policyId,
                        assets: data.data
                    }
                    this.policyList.push(res)
                    return res;
                } catch (err) {
                    return false;
                }
            } return tmp;
        }
    }
})