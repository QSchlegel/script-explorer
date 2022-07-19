<template>
    <nav class="navbar navbar-expand-lg pt-4">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Cardano Script Explorer</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">

        <form class="d-flex input-group" id="button-addon1" v-if='!keySet'>
        <input class="form-control" type="text" placeholder="Project ID" aria-describedby="button-addon1" v-model="apiKey">
        <button class="btn btn-outline-secondary" type="button" id="button-addon1" @click="keySet=true; this.$emit('set-key',apiKey); setPID();">Enter</button>
      </form>
        <li class="nav-item" v-if='keySet'>
          <a class="nav-link" role="button" @click='keySet=false; apiKey=""; this.$emit("set-key",apiKey)'> {{`${cNetwork}`}} <i class="bi bi-chevron-right"></i> {{`${apiKey.slice(7,13)}`}}<i class="bi bi-three-dots"></i>{{`${apiKey.slice(apiKey.length-6)}`}}  </a>
        </li>
         <li class="nav-item" >
        <a id='btn-dark-mode' class='nav-link' role="button" @click='toggleDarkMode'>
          {{ (!darkMode) ? "Dark" : "Light" }}
        </a>
      </li>
      </ul>
      
      <form class="d-flex" role="search" >
        <input class="form-control" type="text" placeholder="Scripthash" aria-describedby="button-addon2" v-if='!loaded' v-model="scriptHash">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="getInfo(scriptHash)"  v-if='!loaded' >Find</button>
        <button class="btn btn-outline-secondary"  @click='scriptHash=""; sInfo=null' v-if='loaded'>{{scriptHash}} <i class="bi bi-x-lg"></i></button>
      </form>
         
     
     
    </div>
  </div>
</nav>
</template>

<script>
import ScriptAPI from '../services/ScriptAPI';

export default {
    name:'Navbar',
    props:['darkToggle', 'listToggle'],
    data () {
        return {
            apiKey:"",
            scriptHash:"",
            sInfo: null,
            keySet: false,
            cNetwork: "",
            darkMode:false
        }
    },
    computed:{
        loaded (){
            if (this.sInfo != null) this.$emit('info-update', this.sInfo);
            return this.sInfo != null
    
        }
    },
    methods:{
        async getInfo(sh) {
            try {
                const res = await ScriptAPI.getScriptInfo(sh);
                this.sInfo = res.data;
            } catch (err) {
                console.log(err);
            }
        },
        setPID () {
            const network = this.apiKey.slice(0,7)
            if (network == "testnet" || network == "mainnet") this.cNetwork = network;
        },
        toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.$emit('dark-mode', this.darkMode);
    },
    }
}
</script>