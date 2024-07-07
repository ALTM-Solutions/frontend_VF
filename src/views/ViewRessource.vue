<template>
    <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--center">
            <h2 class="fr-callout__title">{{ this.ressource.nomRessource }}</h2>
        </div>
        <p class="fr-text--sm" v-if="this.userConnect">Avancement actuel : {{ this.progressionActual }}%</p>
        <p v-for="(item, index) in this.typeParcours" :key="index" class="fr-badge fr-badge--info fr-badge--no-icon">
            {{ item.nom }}
        </p>
        <div class="fr-grid-row">
            <div v-html="this.designedText"></div>
            <!-- <p>{{ this.ressource.text }}</p> -->
        </div>
        <div class="fr-grid-row">
            <figure v-if="this.fileIsImage" class="fr-content-media fr-content-media--sm" role="group" :aria-label="this.nomRessource">
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
        <br>    
        <hr> 
        <div v-if="this.userConnect">
            <button class="fr-btn fr-icon-star-fill fr-btn--icon-left fr-btn--tertiary-no-outline" title="mettre en favoris" v-if="this.favoris" @click="switchFavoris">Retirer des favoris</button>
            <button class="fr-btn fr-icon-star-line fr-btn--icon-left fr-btn--tertiary-no-outline" title="mettre en favoris" v-if="!this.favoris" @click="switchFavoris">Mettre en favoris</button>

            <button class="fr-btn fr-icon-checkbox-fill fr-btn--icon-left fr-btn--tertiary-no-outline" title="mettre de coté" v-if="this.misDeCote" @click="switchMisDeCote">Ne plus mettre de côté</button>
            <button class="fr-btn fr-icon-checkbox-line fr-btn--icon-left fr-btn--tertiary-no-outline" title="mettre de coté" v-if="!this.misDeCote" @click="switchMisDeCote">mettre de côté</button>

            <button class="fr-btn fr-icon-git-commit-line fr-btn--icon-left fr-btn--tertiary-no-outline" @click="this.showModal = true">Ajouter une progression</button>
            <button class="fr-btn fr-icon-pencil-line fr-btn--icon-left fr-btn--tertiary-no-outline" v-if="this.itsMyRessource" @click="goToEditRessource">Edition de la ressource</button>
        </div>
            <br>
            <div v-if="this.userConnect">
                <div class="fr-grid-row fr-mb-3w fr-grid-row--center">

                    <label class="fr-label" for="commentaire">Saisir un commentaire</label>
                    <input class="fr-input" type="text" id="commentaire" name="text-input-text" v-model="this.text" @keypress.enter="this.sendComment()">
                </div>
                <div class="fr-grid-row fr-mb-3w fr-grid-row--center">
                    <br>
                    <input class="fr-upload" type="file" id="file-commentaire" name="text-input-text" @change="handleFileUpload" placeholder="Fichier de la ressource">
                </div>
                <div class="fr-grid-row fr-mb-3w fr-grid-row--center">
                    <!-- <input class="fr-input" autocomplete="titre" aria-required="true" aria-describedby="titre-ressource" name="titre" id="username-1757" type="file" @change="handleFileUpload" placeholder="Fichier de la ressource"> -->
                    <button class="fr-btn fr-btn--icon-left fr-icon-chat-2-fill" @click="this.sendComment()">Envoyer un commentaire</button>
                </div>
            </div>
            <div v-for="(item, index) in ressource.commentaires" :key="index" class="fr-grid-row fr-mb-3w fr-grid-row--center">
                <CommentaireView :commentaire="item"></CommentaireView>
            </div>

        </div>

        <div v-if="showModal" class="modal">
            <div class="fr-modal__body modal-content">
                <div class="fr-modal__header">
                    <button class="fr-btn--close fr-btn" aria-controls="fr-modal-2" @click="this.closeModal()">Fermer</button>
                </div>
                <div class="fr-modal__content">
                    <h1 id="fr-modal-2-title" class="fr-modal__title">
                        <span class="fr-icon-arrow-right-line fr-icon--lg"></span>
                        Indiquer votre pourcentage d'avancement sur cette ressource
                    </h1>
                    <div class="fr-range-group" id="range-2256-group">
                        <label class="fr-label">
                            Avancement : {{ this.percentage }}%
                            <span class="fr-hint-text">valeur de 0 à 100%</span>
                        </label>
                        <div class="fr-range fr-range--step">
                            <span class="fr-range__output">{{ this.percentage }}</span>
                            <input id="range-2255" name="range-2255" type="range" aria-labelledby="range-2255-label" max="100" value="50" step="10" aria-describedby="range-2255-messages" v-model="percentage">
                            <span class="fr-range__min" aria-hidden="true">0</span>
                            <span class="fr-range__max" aria-hidden="true">100</span>
                        </div>
                        <div class="fr-messages-group" id="range-2255-messages" aria-live="polite">
                        </div>
                    </div>
                    
                </div>
                <div class="fr-modal__footer">
                    <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                        <button class="fr-btn fr-btn--icon-left fr-icon-checkbox-fill" @click="this.validePercentage">
                            Valider ma progression
                        </button>
                    </div>
                </div>
            </div>
        </div>
    
</template>
<script>
import store from '@/store'
import router from '@/router'
import CommentaireView from '@/components/Commentaire.vue'

    export default {
        name: 'ViewRessource',
        components:{CommentaireView},
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
                favoris:false,
                misDeCote:false,
                progression:null,
                showModal:false,
                percentage:0
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
            percentageActual(){
                if(this.percentage == null){
                    return 0
                }else{
                    return this.percentage
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
            goToEditRessource(){
                router.push("/edit-ressource/" + this.ressourceId)
            },
            closeModal() {
                this.showModal = false;
            },
            switchMisDeCote(){
                let options=null
                if(!this.misDeCote){
                    options = {
                        method: 'POST',
                        headers: {
                            "Authorization": "Bearer " + store.state.token
                        }
                    };
                }else{
                    options = {
                        method: 'DELETE',
                        headers: {
                            "Authorization": "Bearer " + store.state.token
                        }
                    };
                }
                
                fetch(this.api_path + this.route_mis_de_cote + "?ressourceId=" + this.ressourceId, options)
                .then(res=>{
                    if(res.status == 401){
                        router.push("/")
                    }else if(res.status == 200){
                        this.misDeCote = !this.misDeCote
                    }
                }).catch(err=>{
                    console.log(err)
                })
                
            },
            validePercentage(){
                let form = new FormData()
                form.append("ressourceId", this.ressourceId)
                form.append("progression", this.percentage)
                const options = {
                    method: 'POST',
                    headers: {
                        "Authorization": "Bearer " + store.state.token
                    },
                    body:form
                };
                fetch(this.api_path + this.route_progression, options)
                .then(res=>{
                    if(res.status == 401){
                        alert("not work")
                    }else if(res.status == 200){
                        this.progression = this.percentage
                        this.closeModal()
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            switchFavoris(){
                let options=null
                if(!this.favoris){
                    options = {
                        method: 'POST',
                        headers: {
                            "Authorization": "Bearer " + store.state.token
                        }
                    };
                }else{
                    options = {
                        method: 'DELETE',
                        headers: {
                            "Authorization": "Bearer " + store.state.token
                        }
                    };
                }
                
                fetch(this.api_path + this.route_favoris + "?ressourceId=" + this.ressourceId, options)
                .then(res=>{
                    if(res.status == 401){
                        router.push("/")
                    }else if(res.status == 200){
                        this.favoris = !this.favoris
                    }
                }).catch(err=>{
                    console.log(err)
                })
                
            },
            handleFileUpload(event) {
                this.file = event.target.files[0];
            },
            checkCommentaire(){
                if(this.text == null || this.text == ""){
                    return false
                }

                return true
            },
            sendComment(){
                if(this.checkCommentaire()){
                    let form = new FormData()
                    form.append("contenu", this.text)
                    if(this.file.length != 0){
                        form.append("file",this.file)
                    }else{
                        let emptyFile = new Blob([], { type: 'application/octet-stream' });
                        form.append("file",emptyFile)
                    }
                    form.append("idRessource", this.ressourceId)
                    const options = {
                        method: 'POST',
                        headers: {
                            "Authorization": "Bearer " + store.state.token
                        },
                        body:form
                    };
                    fetch(this.api_path + this.route_commentaire ,options)
                    .then(res=>{
                        if(res.status != 201){
                            throw new Error(`HTTP error! status: ${res.status}`);
                        }else{
                            // a voir pour faire mieux
                            location.reload()
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }else{
                    console.log("no text commentaire, create modal")
                }
                
            }
        },
        mounted(){
            // Récupérer les informations utilisateur
        
            if(sessionStorage.getItem('token') &&  sessionStorage.getItem('role') && sessionStorage.getItem('id') ){
                store.commit("setConnectionStatus", true)
                store.state.token = sessionStorage.getItem('token');
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
                    if(res.status == 200){
                        return res.json()
                    }
                })
                .then(data=>{
                    this.utilisateur = data
                }).catch(err=>{
                    console.log(err)
                })


                fetch(this.api_path + this.route_ressources + "/" +this.$route.params.id, options)
                .then(res=>{
                    if(res.status == 200){
                        return res.json()
                    }
                }).then(data => {
                    this.ressource = data.ressources
                    this.typeParcours = data.typeParcours
                    this.utilisateurRessource = data.ressources.utilisateur
                    this.favoris = data.favoris
                    this.misDeCote = data.mis_de_cote
                    this.progression = data.progression
                    if(data.progression == null){
                        this.percentage = 0
                        this.progression = 0
                    }else{
                        this.percentage = data.progression.status
                        this.progression = data.progression.status
                    }

                }).catch(err =>{
                    console.log(err)
                })

            }else{
                fetch(this.api_path + this.get_all_ressources + "/" +this.$route.params.id, {method: 'GET'})
                .then(res=>{
                    if(res.status == 200){
                        return res.json()
                    }
                }).then(data => {
                    this.ressource = data.ressources
                    this.typeParcours = data.typeParcours
                    this.utilisateurRessource = data.ressources.utilisateur
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