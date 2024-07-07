<template>
    <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--center">
            <h2 class="fr-callout__title">Gestion des collections</h2>
        </div>

        <label class="fr-label" for="text-input-text">Rechercher ou créer une collection</label>
        <input class="fr-input" type="text" id="text-input-text" name="text-input-text" v-model="typeParcours">
        <br>
        <button class="fr-btn" @click="this.create_collections()">Créer la collection</button>
        <br>
        
        <div class="fr-table">
            <table>
                <caption>Liste collections</caption>
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Supprimer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  v-for="(item, index) in this.filter_collection" :key="index">
                        <CollectionRow :typeParcours="item"></CollectionRow>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import store from '@/store'
import CollectionRow from '@/components/CollectionsRow.vue'
    export default {
        name: 'ManageCollection',
        components:{CollectionRow},
        data(){
            return {
                token: null,
                collections:[],
                typeParcours:null
            }
        },
        computed:{
            filter_collection(){
                let filtre = []
                for(let ty of this.collections){
                    if(this.typeParcours!=null && this.typeParcours != ""){
                        if(ty.nom.toUpperCase().includes(this.typeParcours.toUpperCase())){
                            filtre.push(ty)
                        }
                    }else{
                        filtre.push(ty)
                    }
                }
                return filtre
            },
            collection_exist(){
                for(let ty of this.collections){
                    if(this.typeParcours != null && ty.nom.toUpperCase() === this.typeParcours.toUpperCase()){
                        return true
                    }
                }
                return false
            }
        },
        methods:{
            create_collections(){
                if(!this.collection_exist && this.typeParcours != null && this.typeParcours != ""){
                    let form = new FormData()
                    form.append("nom",this.typeParcours.toUpperCase())
                    const options = {
                        method: 'POST',
                        headers: {
                            "Authorization": "Bearer " + store.state.token
                        },
                        body:form
                    };
                    fetch(this.api_path + this.type_parcours,options)
                    .then(res=>{
                        if(res.status == 200){
                            location.reload()
                        }else{
                            alert("Une erreur est survenue!")
                        }
                    }).catch(err =>{
                        alert("Une erreur est survenue! " + err)
                    })
                }else{
                    alert("Collection existante!")
                    this.typeParcours = ""
                }
            }
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
                        store.state.email = cookieValue
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
            fetch(this.api_path + this.type_parcours,options)
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