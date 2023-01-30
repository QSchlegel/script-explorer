import { defineStore } from 'pinia';
import axios from "axios";
import { useNetStore } from './net-store';

const netStore = useNetStore();

export const useAddrStore = defineStore('addr-store', {
    state: () => ({

        addressList: [],
        loadInfo: false,
        addressInfoList: [],
        addressTxList: [],
        addressUTxOList: []

    }),
    actions: {
        async loadAddress(input, isAddress) {
            try {
                const address = (isAddress) ? input :
                    (await axios.get('https://europe-central2-canvas-joy-368008.cloudfunctions.net/function-1?mode=' + netStore.mode + '&address=' + input)).data
                return Promise.all([
                    this.loadAddressInfo(address, (!isAddress) ? input : ''),
                    this.loadAddressTransactions(address, (!isAddress) ? input : ''),
                    this.loadAddressUTxOs(address, (!isAddress) ? input : '')
                ]).then(([a, b, c]) => a && b && c)

            } catch (err) {
                console.log(err)
                return false
            }
        },
        async loadAddressInfo(address, scriptHash = '') {
            const tmp = this.addressInfoList.filter((f) => f.address === address)
            if (tmp.length === 0) {
                try {

                    this.loadInfo = true
                    const data = await axios.get(netStore.ApiDetails.url + 'addresses/' + address + '/extended', {
                        headers: { project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' }
                    })
                    const res = {
                        address: data.data.address,
                        scriptHash: scriptHash,
                        data: data.data,
                    }
                    this.addressInfoList = this.addressInfoList.concat(res)
                    this.loadInfo = false
                    return res
                } catch (err) {
                    console.log(err)
                    return false
                }
            } return tmp[0]
        },
        async loadAddressTransactions(address, addrPage = 1 , scriptHash = '') {
            const tmp = this.addressTxList.filter((f) => f.address === address)
            if (tmp.length === 0) {
                try {
                    const txData = await axios.get(netStore.ApiDetails.url + 'addresses/' + address + '/transactions', {
                        headers: { project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
                        params: { count: 20, page: addrPage, order: 'desc' }
                    })
                    const res = {
                        address: address,
                        scriptHash: scriptHash,
                        data: txData.data
                    }
                    this.addressTxList = this.addressTxList.concat(res)
                    return res
                } catch (err) {
                    console.log(err)
                    return false
                }
            }return tmp[0]
        },
        async loadAddressUTxOs(address, scriptHash) {
            const tmp = this.addressUTxOList.filter((f) => f.address === address)
            if (tmp.length === 0) {
                try {

                    const utxoData = await axios.get(netStore.ApiDetails.url + 'addresses/' + address + '/utxos', {
                        headers: { project_id: netStore.ApiDetails.pid,
                            'Access-Control-Allow-Headers': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS' },
                        params: { count: 20, page: 1, order: 'desc' }
                    })
                    const res = {
                        address: address,
                        scriptHash: scriptHash,
                        data: utxoData.data
                    }
                    this.addressUTxOList = this.addressUTxOList.concat(res)
                    return res
                } catch (err) {
                    return false
                }
            } return tmp[0]
        }
    }
})