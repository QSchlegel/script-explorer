import { defineStore } from 'pinia';
import { useScrStore } from './scr-store';
import { useAddrStore } from './addr-store';
import { useTxStore } from './tx-store';

const scrStore = useScrStore();
const addrStore = useAddrStore();
const txStore = useTxStore();

export const useGraphStore = defineStore('graph-store', {
    state: () => ({
        graphList: [],

        graphType: 'address',
        addressGraphList: [],
        txGraphList: [],
        utxoGraphList: [],
        gLoading: false,

    }),
    actions: {
        createAddressGraph(address) {
            this.gLoading = true
            if (address !== '' && this.addressGraphList.filter((f) => f.address === address).length === 0) {
                const links = []
                var utxos = addrStore.addressUTxOList.filter((f) => f.address === address)
                if (utxos.length > 0) {
                    utxos = utxos[0].data
                    utxos.map((m) => m.amount.map((n) => links.push({
                        source: 'inutxo_' + m.tx_hash + ' - ' + m.tx_index,
                        target: (n.unit === 'lovelace') ? 'ada_₳' : 'unit_' + n.unit,
                        value: n.quantity
                    })))
                    this.addressGraphList.push({
                        address: address,
                        links: links,
                        width: 1000,
                        height: 400
                    })
                }
            }
            this.gLoading = false
        },

        createUtxoGraph(utxo) { },

        //combine tx and redeemer creator
        createTxGraph(tx) {
            this.gLoading = true
            if (tx !== '' && this.txGraphList.filter((f) => f.id === tx).length === 0) {
                const txObject = txStore.utxosList.filter((f) => f.txHash === tx)[0]
                if (txObject === undefined) return;
                const scriptHash = txObject.scriptHash
                const links = []
                const valueIn = txObject.inputs.map((m) => m.amount.map((n) => Object.assign(n, { utxo: m.tx_hash + "-" + m.output_index, addr: m.address, collateral: m.collateral }))).flat()
                const valueOut = txObject.outputs.map((m) => m.amount.map((n) => Object.assign(n, { utxo: tx + "-" + m.output_index, addr: m.address, collateral: m.collateral }))).flat()

                //take care of reference inputs
                //Inputs
                //Input utxo to values
                valueIn.map((m) =>
                    (m.collateral === false) ? links.push({
                        source: "inaddr_" + m.addr,
                        target: "inutxo_" + m.utxo,
                        value: m.quantity
                    }, {
                        source: "inutxo_" + m.utxo,
                        target: (m.unit === 'lovelace') ? "ada_" + m.unit : "unit_" + m.unit,
                        value: m.quantity
                    }) :
                        '')
                //Outputs
                //values to output utxo
                valueOut.map((m) =>
                    (m.collateral === false) ? links.push({
                        source: (m.unit === 'lovelace') ? "ada_" + m.unit : "unit_" + m.unit,
                        target: "oututxo_" + m.utxo,
                        value: m.quantity
                    }, {
                        source: "oututxo_" + m.utxo,
                        target: "outaddr_" + m.addr,
                        value: m.quantity
                    }) : '')
                //Detect Burns 🔥 and Mints 🔨
                valueOut.map((m) =>
                    (valueIn.filter((f) => f.unit === m.unit).length === 0 && m.unit !== "lovelace") ?
                        links.push({
                            source: "iutil_In Util",
                            target: "mint_Mint 🔨",
                            value: m.quantity
                        }, {
                            source: "mint_Mint 🔨",
                            target: "unit_" + m.unit,
                            value: m.quantity
                        }) : m
                )
                valueIn.map((m) =>
                    (valueOut.filter((f) => f.unit === m.unit).length === 0 && m.unit !== "lovelace") ?
                        links.push({
                            source: "unit_" + m.unit,
                            target: "burn_Burn 🔥",
                            value: m.quantity
                        }, {
                            source: "burn_Burn 🔥",
                            target: "outil_Out Util",
                            value: m.quantity
                        }) : m
                )
                //calculate Fees
                const baseFee = scrStore.plutusList.filter((f) => f.scriptHash === scriptHash).map((m) => m.data)[0].filter((f) => f.tx_hash === tx)[0].fee
                const inSum = links.filter((f) => f.target === 'ada_lovelace').map((m) => parseInt(m.value)).reduce((x, y) => x + y)
                const outSum = links.filter((f) => f.source === 'ada_lovelace').map((m) => parseInt(m.value)).reduce((x, y) => x + y)
                const sumDifferential = inSum - outSum - baseFee
                links.push({
                    source: 'ada_lovelace',
                    target: "fee_Base Fee",
                    value: baseFee
                }, {
                    source: 'fee_Base Fee',
                    target: "outil_Out Util",
                    value: baseFee
                }, {
                    source: 'ada_lovelace',
                    target: "fee_Added Fee",
                    value: sumDifferential
                }, {
                    source: 'fee_Added Fee',
                    target: "outil_Out Util",
                    value: sumDifferential
                })
                this.txGraphList.push({
                    id: tx,
                    links: links,
                    width: 1500,
                    height: 800
                })
            }
            this.gLoading = false
        }
    }
})