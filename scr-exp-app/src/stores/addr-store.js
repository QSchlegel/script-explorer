import { defineStore } from 'pinia';
import axios from "axios";
import { useNetStore } from './net-store';
import { useScrStore } from './scr-store';


const netStore = useNetStore();
const scrStore = useScrStore();


export const useAddrStore = defineStore('addr-store', {
    state: () => ({

        addressList:        [],
        loadInfo:           false,
        addressInfoList:    [],

        addressTxList:      [],
        addressUTxOList:    [],

        currentAddress:     ''

    }),
    actions: {
        async loadAddress(){
            try{
                const addr = await axios.get('https://europe-central2-canvas-joy-368008.cloudfunctions.net/function-1?mode='+ netStore.mode +'&address='+ scrStore.currentScript)
                this.currentAddress = addr.data
                this.currentScript = scrStore.currentScript
                this.loadAddressInfo()
                this.loadAddressTransactions()
                this.loadAddressUTxOs()
            }catch (err){
                console.log(err)
            }
        },
        async loadAddressInfo() {
            try {
                if (this.addressInfoList.filter((f) => f.address === this.currentAddress).length === 0) {
                    this.loadInfo = true
                    const data = await axios.get(netStore.ApiDetails.url +'addresses/'+ this.currentAddress +'/extended', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.addressInfoList = this.addressInfoList.concat(data.data)
                    this.loadInfo = false
                }

            } catch (err) {
                console.log(err)
            }
        },
        async loadAddressTransactions() {
            try {
                if (this.addressTxList.filter((f) => f.adress === this.currentAddress).length === 0) {
                    const txData = await axios.get(netStore.ApiDetails.url +'addresses/'+ this.currentAddress +'/transactions', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.addressTxList = this.addressTxList.concat({
                        address: this.currentAddress,
                        data: txData.data
                    })
                }

            } catch (err) {
                console.log(err)
            }
        },
        async loadAddressUTxOs() {
            try {
                if (this.addressUTxOList.filter((f) => f.adress === this.currentAddress).length === 0) {
                    const utxoData = await axios.get(netStore.ApiDetails.url + 'addresses/' + this.currentAddress + '/utxos', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.addressUTxOList = this.addressUTxOList.concat({
                        address: this.currentAddress,
                        data: utxoData.data
                    })
                }

            } catch (err) {
                console.log(err)
            }
        }
    }
})