<template>
    <ul class="list-group">
        <li v-for='s, index in sList' class="list-group-item">
            <ul class="list-group list-group-horizontal">
                <button @click='selIndex = index; getScriptInfo(s.script_hash);'
                    class="list-group-item list-group-item-action" type="button">
                    {{ (s.script_hash != null) ? ` ${s.script_hash.slice(0,8)} ... ${s.script_hash.slice(s.script_hash.length-8,s.script_hash.length)} ` : "empty" }}
                    <i class="bi bi-file-earmark-code"></i>
                </button>
                <li class="list-group-item">
                    <i v-if='index == selIndex && loaded'>{{ sType }}</i>
                </li>
            </ul>
        </li>     
            <button class="list-group-item list-group-item-secondary" @click="getScriptList(page)">
            Load page {{page}}
            </button>    
    </ul>
</template>

<script>
import ScriptAPI from '../services/ScriptAPI';
export default {
    name: "ScriptList",
    data() {
        return {
            sList: null,
            sType: "",
            sInfo: null,
            page: 1,
            selIndex: 0
        }
    },
    computed:{
        loaded(){
            if (this.sType!="loading" && this.sInfo != null) this.$emit('info-update',this.sInfo);
            return this.sType!="loading";
        }
    },
    methods: {
        async getScriptList(p) {
            try {
                const res = await ScriptAPI.getScriptList(100, p, "desc");
                if (this.sList == null) this.sList = res.data;
                else this.sList = res.data.concat(this.sList);
                this.page += 1;
                //remember building limiter if sub 100
            } catch (err) {
                console.log(err)
            }
        },
        async getScriptInfo(sh) {
            this.sType = "loading"
            try {
                const res = await ScriptAPI.getScriptInfo(sh);
                this.sInfo = res.data;
                this.sType = res.data.type;
            } catch (err) {
                console.log(err);
            }
        }
    }
}
</script>