import { defineStore } from 'pinia';
import axios from "axios";
import { useNetStore } from './net-store';
import { Buffer } from 'buffer'  // note: the trailing slash is important!

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
                            project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        }
                    })
                    const utf8Name = Buffer.from((data.data.asset_name) ? data.data.asset_name : '', 'hex').toString('utf8');
                    const res = {
                        assetName: utf8Name,
                        data: data.data
                    }
                    this.assetList = this.assetList.concat(res)
                    return res
                } catch (err) {
                    return false
                }
            } return tmp[0]
        },


        async loadAssetAddr(asset, page = 1) {
            const tmp = this.assetAddrList.filter((f) => f.asset === asset)
            if (tmp.length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'assets/' + asset + '/addresses', {
                        headers: {
                            project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        },
                        params: { count: 20, page: page, order: 'desc' }
                    })
                    const res = {
                        asset: asset,
                        addrs: data.data
                    }
                    this.assetAddrList.push(res)
                    return res
                } catch (err) {
                    return false
                }
            } return tmp[0]
        },

        async loadAssetTx(asset, page = 1) {
            const tmp = this.assetTxList.filter((f) => f.asset === asset)
            if (tmp.length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + 'assets/' + asset + '/transactions', {
                        headers: {
                            project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        },
                        params: { count: 20, page: page, order: 'desc' }
                    })
                    const res = {
                        asset: asset,
                        txs: data.data
                    }
                    this.assetTxList.push(res)
                    return res
                } catch (err) {
                    return false
                }
            } return tmp[0]
        },

        async loadPolicy(policyId, page = 1) {
            const tmp = this.policyList.filter((f) => f.policyId === policyId)
            if (tmp.length === 0 || page !== 1) {
                try {
                    const data = await axios.get(netStore.ApiDetails.url + 'assets/policy/' + policyId, {
                        headers: {
                            project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
                        },
                        params: { count: 20, page: page, order: 'desc' }
                    })
                    var res
                    if (page === 1) {
                        res = {
                            policyId: policyId,
                            assets: data.data
                        }
                    } else {
                        res = {
                            policyId: policyId,
                            assets: tmp[0].assets.concat(data.data)
                        }
                        this.policyList.pop(tmp[0])
                    }
                    this.policyList.push(res)
                    return res;
                } catch (err) {
                    return false;
                }
            } return tmp[0];
        }
    }
})