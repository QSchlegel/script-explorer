<template>
  <nav-bar
    @set-key='setAPI'
    @dark-mode='toggleDarkMode'
    @info-update='infoUpdate'>
  </nav-bar>

  <div class="container-fluid" id="main">
    <div class="row row-offcanvas row-offcanvas-left vh-100">

      <div class="col-md-4 col-lg-4 sidebar-offcanvas h-100 overflow-auto pl-0" id="sidebar" role="navigation">
        <ul class="nav flex-column sticky-top pl-0 mt-3 pb-5 mb-4">
          <script-list ref='ScriptListView' @info-update='infoUpdate'>
          </script-list>

        </ul>
      </div>

      <main class="col-8 main mt-3 h-100 overflow-auto">
        <script-item ref='ScriptItemView' :getInfo='sInfo'>
        </script-item>
      </main>
    </div>

  </div>

</template>

<script>
import ScriptAPI  from './services/ScriptAPI.js';
import NavBar     from './components/Navbar.vue';
import ScriptList from './components/ScriptList.vue';
import ScriptItem from './components/ScriptItem.vue';

export default {
  name: 'App',
  data() {
    return {
      sInfo: "",
      apiKey:"",
      testnetUrl:'https://cardano-testnet.blockfrost.io/api/v0',
      mainnetUrl:'https://cardano-mainnet.blockfrost.io/api/v0',
      sres:"",
      lightThemeUrl: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
      darkThemeUrl:  'https://cdn.jsdelivr.net/npm/bootstrap-dark-5@1.1.3/dist/css/bootstrap-night.min.css'
    };
  },
  components: {
    NavBar,
    ScriptList,
    ScriptItem
  },
  methods: {
    infoUpdate(d) {
      this.sInfo = d
    },
    setAPI (k){
      this.apiKey = k;
      const network = k.slice(0,7)
      if(network=="testnet" || network=="mainnet") {
        ScriptAPI.data.return.url = (network=='testnet') ? this.testnetUrl : this.mainnetUrl;
        ScriptAPI.data.return.pid = k;
        this.testAPI();
      } else {
        ScriptAPI.data.return.url = '';
        ScriptAPI.data.return.pid = '';
      }
    },
    async testAPI() {
      console.log("hi")
      try{
        const res = await ScriptAPI.getHealth();
        this.sres = res
        
      } catch (err){
        console.log(err);
      }
    },
    toggleDarkMode(darkMode) {
      document.getElementById('bootstrap-theme').href = 
        (darkMode) ? this.darkThemeUrl : this.lightThemeUrl;
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: 0#2c3e50;
}
</style>