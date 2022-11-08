import { defineStore } from 'pinia';
import axios from "axios";
import { useNetStore } from './net-store';

const netStore = useNetStore();

export const useAssetStore = defineStore('asset-store', {
    state: () => ({

        assetList:[],
        currentAsset: ''
        
    }),
    actions: {
        async loadAsset() {
            if (this.currentAsset !== undefined && this.assetList.filter((f) => f.asset === this.currentAsset).length === 0) {
                try {
                    const data = await axios.get(
                        netStore.ApiDetails.url + '/assets/' + this.currentAsset, {
                        headers: {
                            project_id: netStore.ApiDetails.pid
                        }
                    })
                    this.assetList = this.assetList.concat(data.data)
                } catch (err) {
                    console.log(err)
                }
            }

        }
    }
})