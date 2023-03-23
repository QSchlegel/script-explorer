import { defineStore } from 'pinia';
import axios from "axios";
import { useNetStore } from './net-store';

const netStore = useNetStore();

type State = {
    addressInfoList: localAddress[],
    addressTxList: localAddrTx[],
    addressUTxOList: localAddrUtxo[]
}

export const useAddrStore = defineStore('addr-store', {
    state: (): State => ({
        addressInfoList: [],
        addressTxList: [],
        addressUTxOList: []
    }),

    actions: {
        async loadAddress(input:string, isAddress:boolean) {
            try {
                const address = (isAddress) ? input :
                    (await axios.get('https://europe-central2-canvas-joy-368008.cloudfunctions.net/function-1?mode=' + netStore.mode + '&address=' + input)).data
                return Promise.all([
                    this.loadAddressInfo(address,(!isAddress) ? input : ''),
                    this.loadAddressTransactions(address, 1, (!isAddress) ? input : ''),
                    this.loadAddressUTxOs(address, (!isAddress) ? input : '')
                ]).then(([a, b, c]) => a && b && c)
            } catch (err) {
                console.log(err)
                return false
            }
        },
        async loadAddressInfo(iAddress:String, scriptHash = '') {
            const tmp = this.addressInfoList.filter((f) => f.network === netStore.mode && f.address === iAddress)
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
                    const response = await axios.get<Address>(
                        netStore.ApiDetails.url + 'addresses/' + iAddress, { headers })
                    const res: localAddress = { 
                        ...response.data, 
                        ...<Network>net,
                        ...<scriptListItem>{script_hash: scriptHash}
                    }
                    this.addressInfoList.push(res)
                    return res
                } catch (err) {
                    console.log(err)
                    return false
                }
            } return tmp[0]
        },
        async loadAddressTransactions(address:String , addrPage:number = 1, scriptHash:String = '') {
            const tmp = this.addressTxList.filter((f) => f.network === netStore.mode && f.address === address)
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
                    const txData:addrTx = await axios.get(netStore.ApiDetails.url + 'addresses/' + address + '/transactions', 
                        {
                            headers,
                            params: { count: 20, page: addrPage, order: 'desc' }
                        }
                    )
                    const res: localAddrTx = {
                        ...txData,
                        ...<Network>net,
                        ...<addedInfo>{ address: address, scriptHash: scriptHash, }
                    }
                    this.addressTxList.push(res)
                    return res
                } catch (err) {
                    console.log(err)
                    return false
                }
            } return tmp[0]
        },
        async loadAddressUTxOs(address: String, scriptHash: String) {
            const tmp = this.addressUTxOList.filter((f) => f.network === netStore.mode && f.address === address)
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
                    const utxoData:addrUtxo = await axios.get(netStore.ApiDetails.url + 'addresses/' + address + '/utxos', 
                        {
                            headers,
                            params: { count: 20, page: 1, order: 'desc' }
                        }
                    )
                    const res: localAddrUtxo = {
                        ...utxoData,
                        ...<Network>net,
                        ...<addedInfo>{ address: address, scriptHash: scriptHash, }
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