<template>
    <div class="fr-container">

        <div class="fr-grid-row fr-grid-row--center">
            <h2 class="fr-callout__title">Modification de la visibilité des ressources</h2>
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
        <fieldset class="fr-fieldset" id="checkboxes" aria-labelledby="checkboxes-inline-legend checkboxes-inline-messages">
            <div class="fr-checkbox-group">
                    <input name="checkbox-a" type="checkbox" aria-describedby="checkboxes-inline-a-messages" v-model="actifRessource">
                    <input name="checkboxes-inline-a" id="checkboxes-inline-a" type="checkbox" aria-describedby="checkboxes-inline-a-messages" v-model="actifRessource" >
                    <label class="fr-label" for="checkboxes-inline-a" style="font-size: 0.8rem;">
                        Afficher les ressources actives
                    </label>
            </div>
        </fieldset>
        
        <div class="fr-table">
            <table>
                <caption>Liste ressources</caption>
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Titre</th>
                        <th scope="col">Texte</th>
                        <th scope="col">Collections</th>
                        <th scope="col">Ressource</th>
                        <th scope="col">Status</th>
                        <th scope="col">Mettre à jour</th>
                        <th scope="col">Voir la ressource</th>
                        <th scope="col">Supprimer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  v-for="(item, index) in this.filterRessource" :key="index">
                        <ValidationRessourceRow :ressource="item"></ValidationRessourceRow>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import store from '@/store'
import ValidationRessourceRow from '@/components/validationRessourceRow.vue'

    export default {
        name: 'ValidateRessource',
        components:{ValidationRessourceRow},
        data(){
            return {
                token: null,
                ressources:[],
                search:null,
                collections:[],
                selectedCollections:[],
                actifRessource:false
            }
        },
        computed:{
            filterRessource(){
                // XOR filter
                let filtre = []
                let actif_filter = []
                for(let ressource of this.ressources){
                    if(ressource.valide == this.actifRessource){
                        actif_filter.push(ressource)
                    }
                }
                if(this.selectedCollections.length == 0){
                    return actif_filter
                }

                for(let ressource of actif_filter){
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
        },
        mounted(){
            // Récupérer les informations utilisateur
            if(sessionStorage.getItem('token') && sessionStorage.getItem('id') && sessionStorage.getItem('role')){
                store.commit("setConnectionStatus", true)
                store.state.token = sessionStorage.getItem('token');
                store.state.id = sessionStorage.getItem('id');
                store.state.role = sessionStorage.getItem('role');
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
                    if(cookieName === "id"){
                        store.state.id = cookieValue
                        sessionStorage.setItem("id",cookieValue)
                    }
                    if(cookieName === "role"){
                        store.state.role = cookieValue
                        sessionStorage.setItem("role",cookieValue)
                    }
                }
                if(cookieFound){
                    store.commit("setConnectionStatus", true)
                }
            }
            this.token = store.state.token
            const options = {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + store.state.token
                }
            };
            fetch(this.api_path + this.get_ressource_moderateur,options)
            .then(res=>{
               if(res.status == 200){
                    return res.json()
                }
            }).then(data => {
                this.ressources = data 
            }).catch(err =>{
                console.log(err)
            })

            fetch(this.api_path + this.public_type_parcours,{
                method: 'GET'
            })
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
<style>
.static-comment{
    position:fixed;
}
</style>