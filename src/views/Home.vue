<template>
    <div class="fr-container">
        <fieldset class="fr-segmented fr-segmented--sm fr-segmented--no-legend fr-grid-row fr-grid-row--center" v-if="this.userConnect">
            <div class="fr-segmented__elements">
                <div class="fr-segmented__element">
                    <input value="1" checked type="radio" id="segmented-2218-1" name="segmented-2218" v-model="picked">
                    <label class="fr-label" for="segmented-2218-1">
                        Toutes les ressources
                    </label>
                </div>
                <div class="fr-segmented__element">
                    <input value="2" type="radio" id="segmented-2218-2" name="segmented-2218" v-model="picked">
                    <label class="fr-label" for="segmented-2218-2">
                        Favoris
                    </label>
                </div>
                <div class="fr-segmented__element">
                    <input value="3" type="radio" id="segmented-2218-3" name="segmented-2218" v-model="picked">
                    <label class="fr-label" for="segmented-2218-3">
                        Mis de coté
                    </label>
                </div>
            </div>
        </fieldset>
        <div class="fr-grid-row fr-grid-row--center">
            <h2>Liste des ressources :</h2>
        </div>
        <fieldset class="fr-fieldset" id="checkboxes-inline" aria-labelledby="checkboxes-inline-legend checkboxes-inline-messages">
            <legend class="fr-fieldset__legend--regular fr-fieldset__legend" id="checkboxes-inline-legend">
                Filtre sur les collections :
            </legend>
            <div v-for="(item, index) in collections" :key="index" class="fr-fieldset__element fr-fieldset__element--inline">
                <div class="fr-checkbox-group">
                    <input :name="'checkbox-' + index" type="checkbox"  :aria-describedby="'checkboxes-inline-' + index + '-messages'" v-model="selectedCollections" :value="item.id">
                    <input :name="'checkboxes-inline-' + index" :id="'checkboxes-inline-'+index" type="checkbox" :aria-describedby="'checkboxes-inline-' + index + '-messages'" v-model="selectedCollections" :value="item.id">
                    <label class="fr-label" :for="'checkboxes-inline-' + index" style="font-size: 0.8rem;">
                        {{ item.nom }}
                    </label>
                </div>
                <div class="fr-messages-group" :id="'checkboxes-inline-' + index + '-messages'" aria-live="assertive"></div>
            </div>
        </fieldset>
        <div class="fr-grid-row">
            <div v-for="(item, index) in this.filterRessource" :key="index" class="fr-col-12 fr-col-xl-4 fr-col-lg-4 fr-col-md-6 fr-col-sm-12">
                <RessourceCard :text="item.ressources.text" :titre="item.ressources.nomRessource" :datePublication="item.ressources.datePublication" :ressourceId=item.ressources.id :utilisateur="item.ressources.utilisateur" :collections="item.typeParcours"></RessourceCard>
            </div>
        </div>
    </div>

</template>
    
<script>
import store from '@/store'
import RessourceCard from '@/components/RessourceCard.vue'

    export default {
        name: 'HomePage',
        components: {RessourceCard},
        data(){
            return {
                all_ressource: [],
                favoris: [],
                mis_de_cote: [],
                collections:[],
                selectedCollections:[],
                picked:1
            }
        },
        computed:{
            filterRessource(){
                // XOR filter
                let filtre = []
                let source = []
                if(this.picked == 1){
                    source = this.all_ressource
                }else if(this.picked == 2){
                    source = this.favoris
                }else{
                    source = this.mis_de_cote
                }

                if(this.selectedCollections.length == 0){
                    return source
                }
                for(let ressource of source){
                    let found = false
                    for(let type_parcours of ressource.typeParcours){
                        for(let id of this.selectedCollections){
                            if(type_parcours.id === id){
                                found = true
                                filtre.push(ressource)
                                break
                            }
                        }
                        if(found){
                            break
                        }
                    }
                }
                return filtre
            },
            userConnect(){
                return store.state.isConnected
            }
        },
        mounted(){
            if(sessionStorage.getItem('token') && sessionStorage.getItem('role') && sessionStorage.getItem('id')){
                store.commit("setConnectionStatus", true)
                store.state.token = sessionStorage.getItem('token');
                store.state.id = sessionStorage.getItem('id');
                store.state.role = sessionStorage.getItem('role');
                const options = {
                        method: 'GET',
                        headers: {
                            "Authorization": "Bearer " + store.state.token
                        }
                    };

                    fetch(this.api_path + this.route_favoris,options)
                    .then(res=>{
                    if(res.status == 200){
                            return res.json()
                        }
                    }).then(data => {
                        this.favoris = data
                    }).catch(err =>{
                        console.log(err)
                    })

                    fetch(this.api_path + this.route_mis_de_cote,options)
                    .then(res=>{
                    if(res.status == 200){
                            return res.json()
                        }
                    }).then(data => {
                        this.mis_de_cote = data
                    }).catch(err =>{
                        console.log(err)
                    })
            }else{
                var allCookies = document.cookie;

                // Diviser les cookies en un tableau
                var cookiesArray = allCookies.split('; ');

                // Parcourir le tableau pour trouver le cookie souhaité
                var cookieFound = false
                for(var i = 0; i < cookiesArray.length; i++) {
                    var cookie = cookiesArray[i];
                    var cookieName = cookie.split('=')[0];
                    var cookieValue = cookie.split('=')[1];

                    if(cookieName === 'token') {
                        cookieFound = true
                        store.state.token = cookieValue
                        sessionStorage.setItem("token",cookieValue)
                    }
                    if(cookieName === "role"){
                        store.state.role = cookieValue
                        sessionStorage.setItem("role",cookieValue)
                    }
                    if(cookieName === "id"){
                        store.state.id = cookieValue
                        sessionStorage.setItem("id",cookieValue)
                    }
                }
                if(cookieFound){
                    store.commit("setConnectionStatus", true)
                    const options = {
                        method: 'GET',
                        headers: {
                            "Authorization": "Bearer " + store.state.token
                        }
                    };

                    fetch(this.api_path + this.route_favoris,options)
                    .then(res=>{
                    if(res.status == 200){
                            return res.json()
                        }
                    }).then(data => {
                        this.favoris = data
                    }).catch(err =>{
                        console.log(err)
                    })

                    fetch(this.api_path + this.route_mis_de_cote,options)
                    .then(res=>{
                    if(res.status == 200){
                            return res.json()
                        }
                    }).then(data => {
                        this.mis_de_cote = data
                    }).catch(err =>{
                        console.log(err)
                    })

                }
            }
            const options = {
                method: 'GET'
            };
            fetch(this.api_path + this.get_all_ressources,options)
            .then(res=>{
               if(res.status == 200){
                    return res.json()
                }
            }).then(data => {
                this.all_ressource = data
            }).catch(err =>{
                console.log(err)
            })

            fetch(this.api_path + this.public_type_parcours,options)
            .then(res=>{
               if(res.status == 200){
                    return res.json()
                }
            }).then(data => {
                this.collections = data
            }).catch(err =>{
                console.log(err)
            })

        }
    }
</script>