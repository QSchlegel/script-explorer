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
                ]).then(([a,b,c])=> a+b+c )
                
            } catch (err) {
                console.log(err)
                return false
            }
        },
        async loadAddressInfo(address, scriptHash) {
            try {
                if (this.addressInfoList.filter((f) => f.address === address).length === 0) {
                    this.loadInfo = true
                    const data = await axios.get(netStore.ApiDetails.url + 'addresses/' + address + '/extended', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.addressInfoList = this.addressInfoList.concat({
                        address: data.data.address,
                        scriptHash: scriptHash,
                        data: data.data,

                    })
                    this.loadInfo = false
                    return 'x'
                }

            } catch (err) {
                console.log(err)
            }
        },
        async loadAddressTransactions(address, scriptHash) {
            try {
                if (this.addressTxList.filter((f) => f.address === address).length === 0) {
                    const txData = await axios.get(netStore.ApiDetails.url + 'addresses/' + address + '/transactions', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.addressTxList = this.addressTxList.concat({
                        address: address,
                        scriptHash: scriptHash,
                        data: txData.data
                    })
                }
                return 'y'

            } catch (err) {
                console.log(err)
            }
        },
        async loadAddressUTxOs(address, scriptHash) {
            try {
                if (this.addressUTxOList.filter((f) => f.address === address).length === 0) {
                    const utxoData = await axios.get(netStore.ApiDetails.url + 'addresses/' + address + '/utxos', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.addressUTxOList = this.addressUTxOList.concat({
                        address: address,
                        scriptHash: scriptHash,
                        data: utxoData.data
                    })
                }
                return 'z'

            } catch (err) {
                console.log(err)
            }
        }
    }
})