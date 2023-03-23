export { };

declare global {
    interface Network {
        network: string
    }
   
//Assets
    interface Asset {
        asset: String,
        policy_id: string,
        asset_name: string,
        fingerprint: string,
        quantity: number,
        initial_mint_tx_hash: string,
        mint_or_burn_count: number,
        onchain_metadata: Object,
        onchain_metadata_standard: number,
        metadata: Object
    } 
    interface asset_name {
        assetName: string
    }
    interface ahEvent {
        tx_hash: string,
        amount: number,
        action: string
    }
    interface assetHistory {
        results: ahEvent
    }
    interface tx {
        tx_hash: string,
        tx_index: number,
        block_height: number,
        block_time: number
    }
    interface assetTxResponse {
        results: tx[]
    }
    interface AssetTransactions {
        txs: tx[]
    }
    interface assetAddr {
        address: string,
        quantity: number
    }
    interface assetAddrResponse {
        results: assetAddr[]
    }
    interface AssetAddresses {
        addrs: assetAddr[]
    }
    interface assetHash {
        asset: string
    }
    interface assetP {
        asset: string,
        quantity: number
    }
    interface assetPolicyResponse {
        results: assetP[]
    }
    interface AssetPolicy {
        assets: assetP[]
    }
    interface policyId {
        policyId: string
    }
    type localAsset = Asset & Network & asset_name
    type localAssetAddr = AssetAddresses & Network & assetHash
    type localAssetTx = AssetTransactions & Network & assetHash
    type localPolicy = AssetPolicy & Network & policyId

//Scripts
    interface scriptListItem {
        script_hash: string
    }
    interface scriptInfo {
        script_hash: string,
        type: string,
        serialzed_size: number
    }
    interface Redeemer {
        tx_hash: string,
        tx_index: number,
        purpose: string,
        redeemer_data_hash: string,
        datum_hash: string,
        unit_mem: number,
        unit_steps: number,
        fee: number
    }
    interface datum {
        json_value: Object
    }
    type localScriptListItem = scriptListItem & Network
    type localScriptInfo = scriptInfo & Network
    type localRedeemer = Redeemer & Network & scriptListItem

//Transactions
    interface outputAmount {
        unit: string,
        quantity: number
    }
    interface Transaction {
        hash: string,
        block: string,
        block_height: number,
        block_time: number,
        slot: number,
        index: number,
        output_amount: outputAmount[],
        fees: number,
        deposit: number,
        size: number,
        invalid_before: number,
        invalid_hereafter: number,
        utxo_count: number,
        withdrawal_count: number,
        mir_cert_count: number,
        delegation_count: number,
        stake_cert_count: number,
        pool_update_count: number,
        pool_retire_count: number,
        asset_mint_or_burn_count: number,
        redeemer_count: number,
        valid_contract: boolean
    }
    interface inputs {
        address: string,
        amount: outputAmount[],
        tx_hash: string,
        output_index: number,
        data_hash: string,
        inline_datum: string,
        reference_script_hash: string,
        collateral: boolean,
        reference: boolean
    }
    interface outputs {
        address: string,
        amount: outputAmount[],
        output_index: number,
        data_hash: string,
        inline_datum: string,
        collateral: boolean,
        reference_script_hash: string
    }
    interface Utxos {
        hash: string,
        inputs: inputs[],
        outputs: outputs[]
    }
    type localTx = Transaction & Network
    type localUtxos = Utxos & Network

//Address
    interface addrInputs {
        address: string,
        amount: [outputAmount],
        tx_hash: string,
        output_index: number,
        data_hash: string,
        inline_datum: string,
        reference_script_hash: string,
        reference: boolean
    }
    interface Address {
        address: string,
        amount: [outputAmount],
        stake_address: number,
        type: number,
        script: boolean
    }
    interface addrTx {
        txs: [tx]
    }
    interface addrUtxo {
        utxos: [addrInputs]
    }
    interface addedInfo {
        address: string,
        scriptHash: string
    }
    type localAddress = Address & Network
    type localAddrTx = addrTx & Network & addedInfo
    type localAddrUtxo = addrUtxo & Network & addedInfo
}