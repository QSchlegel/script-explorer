<template>
    <div class="card">

        <div class="card-header">
            <ul class="list-group list-group-horizontal">
                <li class="list-group-item">{{ sHash }} <i class="bi bi-file-earmark-code"></i></li>
                <button type="button" class="list-group-item list-group-item btn btn-outline-secondary"
                    @click='copyToClipboard(sHash)'><i class="bi bi-clipboard"></i></button>
            </ul>

        </div>
        <div class="card">


            <ul class="list-group list-group-flush" v-if='dataType == "timelock"'>

                <div class="card">
                    <div class="card-header">{{ (sJSON.json.type == "atLeast") ?
                            "min: " + sJSON.json.required :
                            (sJSON.json.type != "sig") ?
                                sJSON.json.type : "1"
                    }} <i class="bi bi-arrow-right"></i> <i class="bi bi-unlock-fill"></i>
                    </div>
                    <div v-if='sJSON.json.type == "sig"'>{{ sJSON.json.keyHash }} <i class="bi bi-key"></i></div>

                    <li class="list-group-item" v-for='s in sJSON.json.scripts'>
                        <div v-if='s.type == "after"'>
                            <i class="bi bi-arrow-bar-right"></i> {{ s.slot }} <i class="bi bi-clock"></i>
                        </div>
                        <div v-if='s.type == "before"'>{{ s.slot }} <i class="bi bi-clock"></i> <i
                                class="bi bi-arrow-bar-left"></i></div>
                        <div v-if='s.type == "sig"'>{{ s.keyHash }} <i class="bi bi-key"></i></div>
                    </li>
                </div>


            </ul>
            <ul class="list-group list-group-flush" v-if='dataType == "plutusV1" || dataType == "plutusV2" '>
                <li class="list-group-item" v-for='r in sRedeemer'>
                    <ul class="list-group">
                        <li class="list-group-item">
                            <div class="card mt-2 mb-2">
                                <div class="card-header">
                                    <button class="btn btn-outline-secondary" type="button"
                                        @click='(toggleTX == r.tx_hash) ? toggleTX = "" : toggleTX = r.tx_hash; getScriptUtxos(r.tx_hash);'>{{
                                                r.tx_hash
                                        }} <i class="bi bi-send"></i></button>
                                </div>
                                <ul class="list-group list-group-horizontal mx-2">
                                    <li class="list-group-item">{{ r.tx_index }} <i class="bi bi-journals"></i></li>
                                    <li class="list-group-item">{{ r.purpose }} <i class="bi bi-layers-half"></i></li>
                                    <li class="list-group-item">{{ `${r.redeemer_data_hash.slice(0, 8)} ...
                                                                            ${r.redeemer_data_hash.slice(r.redeemer_data_hash.length - 8)}`
                                    }} <i class="bi bi-file-earmark-binary"></i></li>
                                    <li class="list-group-item">{{ r.unit_mem }} <i class="bi bi-device-hdd"></i></li>
                                    <li class="list-group-item">{{ r.unit_steps }} <i class="bi bi-activity"></i></li>
                                    <li class="list-group-item">{{ r.fee / 1000000 }} ₳</li>
                                </ul>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <ul class="list-group list-group-horizontal">

                                <li class="list-group-item">
                                    <div class="card" v-if="toggleTX == r.tx_hash">
                                        <div class="card-header">Inputs</div>
                                        <div class="card-body">
                                            <ul class="list-group">
                                                <li class="list-group-item" v-for='utxo in sUtxos.inputs'>
                                                    <div class="card text-bg-danger mb-3">
                                                        <div class="card-header">
                                                            {{ utxo.address.slice(10, 20) }} <i
                                                                class="bi bi-three-dots"></i> {{
                                                                        utxo.address.slice(utxo.address.length - 10)
                                                                }} <i class="bi bi-cash"></i>
                                                        </div>
                                                        <ul class="list-group">
                                                            <li class="list-group-item" v-for="v in utxo.amount">
                                                                <p v-if='v.unit == "lovelace"'>{{ v.quantity / 1000000
                                                                }} ₳</p>
                                                                <p v-if='v.unit != "lovelace"'>{{ v.quantity }} <a
                                                                        role="button"
                                                                        @click=' if (toggleAX != v.unit) { getScriptAsset(v.unit); toggleAX = v.unit } else toggleAX = "" '><i
                                                                            class="bi bi-coin"></i></a></p>
                                                                <div v-if="toggleAX == v.unit">
                                                                <ul class="list-group list-group-horizontal">
                                                                        <li class="list-group-item"> {{sAsset.asset_name}} <i class="bi bi-person-bounding-box"></i></li>
                                                                        <li class="list-group-item"> {{sAsset.quantity}} <i class="bi bi-boxes"></i></li>
                                                                    </ul>
                                                                    

                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                </li>

                                <li class="list-group-item">
                                    <div class="card" v-if="toggleTX == r.tx_hash">
                                        <div class="card-header">Outputs</div>
                                        <div class="card-body">
                                            <ul class="list-group">
                                                <li class="list-group-item" v-for='utxo in sUtxos.outputs'>
                                                    <div class="card text-bg-primary mb-3">
                                                        <div class="card-header">
                                                            {{ utxo.address.slice(10, 20) }} <i
                                                                class="bi bi-three-dots"></i> {{
                                                                        utxo.address.slice(utxo.address.length - 10)
                                                                }} <i class="bi bi-cash"></i>
                                                        </div>
                                                        <ul class="list-group">
                                                            <li class="list-group-item" v-for="v in utxo.amount">
                                                                <p v-if='v.unit == "lovelace"'>{{ v.quantity / 1000000
                                                                }} ₳</p>
                                                                <p v-if='v.unit != "lovelace"'>{{ v.quantity }} <a
                                                                        role="button"
                                                                        @click=' if (toggleAX != v.unit) { getScriptAsset(v.unit); toggleAX = v.unit } else toggleAX = "" '><i
                                                                            class="bi bi-coin"></i></a></p>
                                                                <div v-if="toggleAX == v.unit">
                                                                    <ul class="list-group list-group-horizontal">
                                                                        <li class="list-group-item"> {{sAsset.asset_name}} <i class="bi bi-person-bounding-box"></i></li>
                                                                        <li class="list-group-item"> {{sAsset.quantity}} <i class="bi bi-boxes"></i></li>
                                                                    </ul>
                                                                    


                                                                </div>

                                                            </li>
                                                        </ul>
                                                    </div>

                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                </li>
                            </ul>


                        </li>

                    </ul>

                </li>
            </ul>
        </div>


    </div>

</template>

<script>
// nested Timelocks -> minor error
import ScriptAPI from '../services/ScriptAPI';
export default {
    name: 'ScriptItem',
    props: ['getInfo'],
    data() {
        return {
            sJSON: {},
            sRedeemer: {},
            sUtxos: {},
            sAsset: {},
            toggleTX: "",
            toggleAX: ""
        }
    },
    computed: {
        dataType() {
            if (this.getInfo.type == null) return "loading";
            switch (this.getInfo.type) {
                case "timelock" : this.getScriptJson(this.getInfo.script_hash); return "timelock";
                case "plutus"   : this.getScriptRedeemer(this.getInfo.script_hash); return "plutus";
                case "plutusV1" : this.getScriptRedeemer(this.getInfo.script_hash); return "plutusV1";
                case "plutusV2" : this.getScriptRedeemer(this.getInfo.script_hash); return "plutusV2";
                default: return "err";
            }
        },
        sHash() {
            return (this.getInfo.script_hash != null) ? `${this.getInfo.script_hash}` : "Scriptdata";
        }
    },
    methods: {
        loadUtxos(tx) {
            console.log("hi");
            if (this.toggleTX) { this.getScriptUtxos(tx); this.toggleTX = !this.toggleTX }
        },
        async getScriptJson(sh) {
            try {
                const res = await ScriptAPI.getScriptJSON(sh);
                this.sJSON = res.data
            } catch (err) {
                console.log(err);
            }
        },
        async getScriptRedeemer(sh) {
            try {
                const res = await ScriptAPI.getScriptRedeemer(sh);
                this.sRedeemer = res.data;
                console.log(res.data)
            } catch (err) {
                console.log(err);
            }
        },

        async getScriptUtxos(tx) {
            try {
                const res = await ScriptAPI.getUtxos(tx);
                this.sUtxos = res.data;
            } catch (err) {
                console.log(err);
            }
        },
        async getScriptAsset(a) {
            try {
                const res = await ScriptAPI.getAsset(a);
                this.sAsset = res.data;
            } catch (err) {
                console.log(err);
            }
        },

        copyToClipboard(d) {
            navigator.clipboard.writeText(d)
        }
    }

}
</script>