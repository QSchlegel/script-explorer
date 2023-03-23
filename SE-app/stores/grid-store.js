import { defineStore } from 'pinia';
import { useAddrStore } from './addr-store';
import { useTxStore } from './tx-store';
import { useNetStore } from './net-store';
import { useLocalStorage } from '@vueuse/core'

const addrStore = useAddrStore();
const txStore = useTxStore();
const netStore = useNetStore();

export const useGridStore = defineStore('grid-store', {
    state: () => ({
        addrListMem: useLocalStorage('addrListMem', []),
        txListMem: useLocalStorage('txListMem', []),
        addrList: [],
        txList: [],
        scrList: useLocalStorage('scrList', []),
        assetList: useLocalStorage('assetList', []),
        graph: [],
        gridSwitch: true
    }),
    actions: {
        async addItem(gridId, gridType) {
            switch (gridType) {
                case 'address': if (this.addrList.filter((f) => f.network === netStore.mode && f.id === gridId).length === 0) {
                    this.addrListMem.push({ id: gridId, network:netStore.mode });
                    await this.loadAddressItems(gridId)
                    setTimeout(() => { this.generateGraph() }, 2000);
                } break
                case 'tx': if (this.txList.filter((f) => f.network === netStore.mode && f.id === gridId).length === 0) {
                    this.txListMem.push({ id: gridId, network:netStore.mode });
                    await this.loadTxItems(gridId)
                    this.generateGraph()
                } break
                case 'scr': if (this.scrList.filter((f) => f.network === netStore.mode && f.id === gridId).length === 0) {
                    this.scrList.push({ id: gridId, network:netStore.mode })
                } break
                case 'asset': if (this.assetList.filter((f) => f.network === netStore.mode && f.id === gridId).length === 0) {
                    this.assetList.push({ id: gridId, network:netStore.mode })
                } break
            }
        },
        async loadItem(gridId, gridType) {
            switch (gridType) {
                case 'address': if (this.addrList.filter((f) => f.network === netStore.mode && f.id === gridId).length === 0) {
                    return this.loadAddressItems(gridId)
                } break
                case 'tx': if (this.txList.filter((f) => f.network === netStore.mode && f.id === gridId).length === 0) {
                    return this.loadTxItems(gridId)
                } break
            }
        },
        removeItem(gridId, gridType) {
            switch (gridType) {
                case 'address': this.addrList = this.addrList.filter((f) => f.network === netStore.mode && f.id !== gridId); this.addrListMem = this.addrListMem.filter((f) => f.network === netStore.mode && f.id !== gridId); break
                case 'tx': this.txList = this.txList.filter((f) => f.network === netStore.mode && f.id !== gridId); this.txListMem = this.txListMem.filter((f) => f.network === netStore.mode && f.id !== gridId); break
                case 'scr': this.scrList = this.scrList.filter((f) => f.network === netStore.mode && f.id !== gridId); break
                case 'asset': this.assetList = this.assetList.filter((f) => f.network === netStore.mode && f.id !== gridId); break
            }
            this.generateGraph()
        },
        async loadAddressItems(addr) {
            await addrStore.loadAddress(addr, true)
            const addrObj = addrStore.addressTxList.filter((f) => f.network === netStore.mode && f.address === addr)
            var txList = []
            if (addrObj.length > 0) {
                addrObj[0].data
                    .map((m) => { txList.push({ tx: m.tx_hash }); return m.tx_hash })
                txList = txList.map((m) => {
                    const AddrIn = [];
                    const AddrOut = [];
                    txStore.loadUtxos(m.tx)
                        .then(_ => {
                            txStore.utxosList
                                .filter((f) => f.network === netStore.mode && f.hash === m.tx)
                                .map((n) => {
                                    n.inputs.map((k) => AddrIn.push(k.address))
                                    n.outputs.map((k) => AddrOut.push(k.address))
                                    return n
                                })
                        })
                    return {
                        network: netStore.mode,
                        id: m.tx,
                        inAddr: AddrIn,
                        outAddr: AddrOut
                    }
                });
                this.addrList.push({ network: netStore.mode, id: addr, txs: txList });
            }
        },
        async loadTxItems(tx) {
            const AddrIn = [];
            const AddrOut = [];
            txStore.loadUtxos(tx)
                .then(_ => {
                    txStore.utxosList
                        .filter((f) => f.txHash === tx)
                        .map((n) => {
                            n.inputs.map((k) => AddrIn.push(k.address))
                            n.outputs.map((k) => AddrOut.push(k.address))
                            return n
                        })
                })
            this.txList.push({
                network: netStore.mode,
                id: tx,
                inAddr: AddrIn,
                outAddr: AddrOut
            })
        },
        generateGraph() {
            const tmp = [];
            this.addrList
                .map((m) => m.txs)
                .flat()
                .concat(this.txList)
                .map((m) => {
                    m.inAddr.map((n) => tmp.push({
                        network: m.network,
                        source: n,
                        target: m.id,
                        type: "input"
                    }));
                    m.outAddr.map((n) => tmp.push({
                        network: m.network,
                        source: m.id,
                        target: n,
                        type: "output"
                    }))
                    return m
                })
            this.graph = Array.from(new Set(tmp.map(el => JSON.stringify(el)))).map(el => JSON.parse(el))
        }
    }
})