import { defineStore } from 'pinia';
import axios from "axios"
import { useNetStore } from './net-store';

const netStore = useNetStore();

export const useScrStore = defineStore('scr-store', {
    state: () => ({

        scriptList:     [],
        slLoading:     false,
        page:           1,

        scriptDataList: [],
        plutusList:     [],
        timelock:       {},      
        dLoading:      false, 
        
        currentScript:  '',
        loadAddress: false
        
        
    }),
    actions: {
        async loadMoreScripts() {
            try {
                this.slLoading = true
                const data = await axios.get(netStore.ApiDetails.url + 'scripts', {
                        headers: { project_id: netStore.ApiDetails.pid },
                        params: { page: this.page, order: 'desc' }
                    })
                this.scriptList = this.scriptList.concat(data.data.map((s) => s.script_hash))
                this.page++
                this.slLoading = false

            } catch (err) {
                console.log(err)
            }
        },

        async loadScriptData() {
            try {
                this.dLoading = true
                const data = await axios.get(netStore.ApiDetails.url + 'scripts/' + this.currentScript, {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                this.scriptDataList = this.scriptDataList.concat(data.data)
                
                switch(data.data.type){
                    case 'timelock':
                        this.loadScriptJson();
                        break;
                    case 'plutusV1':
                        this.loadScriptRedemer();
                        break;
                    case 'plutusV2':
                        this.loadScriptRedemer();
                        break;
                
                }

            } catch (err) {
                console.log(err)
            }
        },

        async loadScriptJson() {
            try {
                const data = await axios.get(netStore.ApiDetails.url + 'scripts/' + this.currentScript + '/json', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                this.timelock = data.data.json
                //load Policy => load Assets
            } catch (err) {
                console.log(err)
            }
            this.dLoading = false
        },
        
        async loadScriptRedemer() {
            if (this.currentScript !== undefined && this.plutusList.filter((f) => f.script_hash === this.CurScript).length === 0) {
                try {
                    const data = await axios.get( netStore.ApiDetails.url + '/scripts/' + this.currentScript + '/redeemers', {
                        headers: { project_id: netStore.ApiDetails.pid }
                    })
                    this.plutusList = this.plutusList.concat({
                        script_hash: this.currentScript,
                        data: data.data
                    })
                    //if(data.data[0].purpose === 'mint') load Policy => load Assets
                    if(data.data[0] === undefined || (data.data[0].purpose !== 'mint' && data.data[0].purpose !== 'cert')) this.loadAddress = true;
                    

                } catch (err) {
                    console.log(err)
                }
            }
            this.dLoading = false
        },
        toggleLoadAddrOff (){
            this.loadAddress = false
        }
    }
})