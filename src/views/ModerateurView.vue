<template>
    <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--center">
            <h2 class="fr-callout__title">{{ this.ressource.nomRessource }}</h2>
        </div>
        <p v-for="(item, index) in this.typeParcours" :key="index" class="fr-badge fr-badge--info fr-badge--no-icon">
            {{ item.nom }}
        </p>
        <div class="fr-grid-row">
            <div v-html="this.designedText"></div>
            <!-- <p>{{ this.ressource.text }}</p> -->
        </div>
        <div class="fr-grid-row">
            <figure v-if="this.fileIsImage" class="fr-content-media fr-content-media--sm" role="group" :aria-label="this.ressource.nomRessource">
                <div class="fr-content-media__img">
                    <img class="fr-responsive-img fr-ratio-16x9" :src="this.urlFile" :alt="this.filename" />
                </div>
                <figcaption class="fr-content-media__caption">{{ this.filename }}</figcaption>
            </figure>
        
            
            <p v-if="this.fileIsPresent && !this.fileIsImage">{{ this.filename }}</p>
        </div>
        <div class="fr-grid-row fr-grid-row--center">
            <a v-if="this.fileIsPresent" :href="this.urlFile" class="fr-btn fr-btn--icon-left fr-icon-file-download-fill">Télécharger la ressource</a>
        </div>
        <div v-if="this.userConnect">
            <button class="fr-btn fr-icon-arrow-go-back-fill fr-btn--icon-left fr-btn--tertiary-no-outline" v-if="this.itsMyRessource" @click="goToModeration">Revenir à la modération</button>
        </div>
    </div>
    
</template>
<script>
import store from '@/store'
import router from '@/router'

    export default {
        name: 'ModerationViewRessource',
        data(){
            return {
                token: null,
                ressourceId: null,
                ressource: Object,
                imagePath : "",
                utilisateur:null,
                utilisateurRessource:null,
                text:null,
                file:[],
                typeParcours:[],
            }
        },
        computed:{
            fileIsPresent(){
                if(this.ressource.pieceJointe != null && this.ressource.pieceJointe != "null"){
                    return true
                }else{
                    return false
                }
            },
            itsMyRessource(){
                if(this.utilisateurRessource != null){
                    if(this.utilisateurRessource.id == store.state.id || store.state.role == "MODERATEUR" || store.state.role == "ADMIN" || store.state.role == "SUPER_ADMIN"){
                        return true
                    }else{
                        return false
                    }
                }else{
                    return false
                }
            },
            progressionActual(){
                if(this.progression == null){
                    return 0
                }else{
                    return this.progression
                }
            },
            fileIsImage(){
                if(this.fileIsPresent){
                    let segments = this.ressource.pieceJointe.cheminPieceJointe.split(".")
                    let extension = segments[segments.length - 1];
                    if(extension == "webp" || extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "gif"){
                        return true
                    }else{
                        return false
                    }
                }else{
                    return false
                }
            },
            urlFile(){
                return this.api_path + this.get_file + "/" + this.ressource.pieceJointe.cheminPieceJointe
            },
            filename(){
                if(this.fileIsPresent){
                    return this.ressource.pieceJointe.nomOrigin
                
                }else{
                    return "No name..."
                }
            },
            designedText(){
                // a securiser en remplaceant les balise, a voir si on le fait pas plutot dans le backend pour supprimer les balises
                if(this.ressource.text != null){
                    return this.ressource.text.replace(/\r\n/g, '<br>');
                }else{
                    return ""
                }
            },
            userConnect(){
                return store.state.isConnected
            }

        },
        methods:{
            goToModeration(){
                router.push("/validate-ressource")
            }
        },
        mounted(){
            // Récupérer les informations utilisateur
        
            if(sessionStorage.getItem('token') && sessionStorage.getItem('email') && sessionStorage.getItem('role') && sessionStorage.getItem('id') ){
                store.commit("setConnectionStatus", true)
                store.state.token = sessionStorage.getItem('token');
                store.state.email = sessionStorage.getItem('email');
                store.state.role = sessionStorage.getItem('role');
                store.state.id = sessionStorage.getItem('id');
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
                    if(cookieName === "email"){
                        store.state.email = cookieValue
                        sessionStorage.setItem("email",cookieValue)
                    }
                    if(cookieName === "email"){
                        store.state.role = cookieValue
                        sessionStorage.setItem("role",cookieValue)
                    }
                }
                if(cookieFound){
                    store.commit("setConnectionStatus", true)
                }
            }
            this.token = store.state.token
            this.ressourceId = this.$route.params.id
            if(this.token != null){
                const options = {
                    method: 'GET',
                    headers: {
                        "Authorization": "Bearer " + store.state.token
                    }
                };
                fetch(this.api_path + this.route_utilisateur, options)
                .then(res=>{
                    if(res.status == 401){
                        router.push("/")
                    }else if(res.status == 200){
                        return res.json()
                    }
                })
                .then(data=>{
                    this.utilisateur = data
                }).catch(err=>{
                    console.log(err)
                })

                fetch(this.api_path + this.get_ressource_moderateur + "/" +this.$route.params.id, options)
                .then(res=>{
                    if(res.status == 200){
                        return res.json()
                    }
                }).then(data => {
                    this.ressource = data
                    this.typeParcours = data.typeParcours
                    this.utilisateurRessource = data.utilisateur
                }).catch(err =>{
                    console.log(err)
                })

            }
            
        }
    }
</script>
<style>
.static-comment{
    position:fixed;
}
</style>