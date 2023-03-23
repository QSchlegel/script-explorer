import { defineStore } from 'pinia';
import axios, { AxiosResponse } from "axios";
import { useNetStore } from './net-store';
import { Buffer } from 'buffer'  // note: the trailing slash is important!

const netStore = useNetStore();

type State = {
    assetList: localAsset[],
    assetAddrList: localAssetAddr[],
    assetTxList: localAssetTx[],
    policyList: assetPolicy[]
}

export const useAssetStore = defineStore('asset-store', {
    state: (): State => ({
        assetList: [],
        assetAddrList: [],
        assetTxList: [],
        policyList: []
    }),

    actions: {

        async loadAsset(iAsset: String) {
            const tmp = this.assetList.filter((f) => f.network === netStore.mode && f.asset === iAsset)
            if (tmp.length === 0) {
                const pid: string = netStore.getPid()
                const headers = {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'project_id': pid
                }
                const net = { network: netStore.mode }
                try {
                    const response: AxiosResponse<Asset> = await axios.get<Asset>(
                        netStore.ApiDetails.url + 'assets/' + iAsset, { headers })
                    const utf8Name = Buffer.from((response.data.asset_name) ? response.data.asset_name : '', 'hex').toString('utf8');
                    const res: localAsset = {
                        ...response.data,
                        ...<Network>net,
                        ...<asset_name>{ assetName: utf8Name }
                    }
                    this.assetList.push(res)
                    return res
                } catch (err) {
                    return false
                }
            } return tmp[0]
        },
        async loadAssetAddr(asset: String, page = 1) {
            const tmp = this.assetAddrList.filter((f) => f.network === netStore.mode && f.asset === asset)
            if (tmp.length === 0) {
                const pid: string = netStore.getPid()
                const headers = {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'project_id': pid
                }
                const net = { network: netStore.mode }
                try {
                    const response = await axios.get<assetAddrResponse>(
                        netStore.ApiDetails.url + 'assets/' + asset + '/addresses',
                        {
                            headers,
                            params: { count: 20, page: page, order: 'desc' }
                        }
                    )
                    const res: localAssetAddr = {
                        ...<AssetAddresses>{ addrs: response.data },
                        ...<Network>net,
                        ...<assetHash>{ asset: asset },
                    }
                    this.assetAddrList.push(res)
                    return res
                } catch (err) {
                    return false
                }
            } return tmp[0]
        },

        async loadAssetTx(asset: String, page = 1) {
            const tmp = this.assetTxList.filter((f) => f.network === netStore.mode && f.asset === asset)
            if (tmp.length === 0) {
                const pid: string = netStore.getPid()
                const headers = {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'project_id': pid
                }
                const net = { network: netStore.mode }
                try {
                    const response = await axios.get<assetTxResponse>(
                        netStore.ApiDetails.url + 'assets/' + asset + '/transactions',
                        {
                            headers,
                            params: { count: 20, page: page, order: 'desc' }
                        }
                    )
                    const res: localAssetTx = {
                        ...<AssetTransactions>{ txs: response.data },
                        ...<Network>net,
                        ...<assetHash>{ asset: asset },
                    }
                    this.assetTxList.push(res)
                    return res
                } catch (err) {
                    return false
                }
            } return tmp[0]
        },

        async loadPolicy(policyId: String, page = 1) {
            const tmp = this.policyList.filter((f) => f.network === netStore.mode && f.policyId === policyId)
            if (tmp.length === 0 || page !== 1) {
                const pid: string = netStore.getPid()
                const headers = {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'project_id': pid
                }
                const net = { network: netStore.mode }
                try {
                    const response = await axios.get<assetPolicyResponse>(
                        netStore.ApiDetails.url + 'assets/policy/' + policyId,
                        {
                            headers,
                            params: { count: 20, page: page, order: 'desc' }
                        }
                    )
                    var res
                    if (page === 1) {
                        res = {
                            ...<AssetPolicy>{assets: response.data},
                            ...<Network>net,
                            ...<policyId>{policyId: policyId}
                        }
                    } else {
                        res = {
                            ...<AssetPolicy>{assets: tmp[0].assets.concat(response.data)},
                            ...<Network>net,
                            ...<policyId>{policyId: policyId}
                        }
                        this.policyList = this.policyList.filter(f=>f !== tmp[0])
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