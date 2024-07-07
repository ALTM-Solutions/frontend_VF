<template>
    <div v-if="!this.isRemoved" class="fr-grid-row fr-mb-3w">
        <div :class="{'fr-col-8' : this.itsMyRessource, 'fr-col-12': !this.itsMyRessource }">
            <div class="fr-card fr-enlarge-link">
                <div class="fr-card__body">
                    <div class="fr-card__content">
                        <h3 class="fr-card__title">
                            
                            <a :href="this.pathRessourceView">{{ this.truncatedTitre}}</a>
                        </h3>
                        
                        <p class="fr-card__desc">{{ this.truncatedText }} <br><span v-for="(item, index) in this.collections" :key="index" class="fr-badge fr-badge--info fr-badge--no-icon fr-badge--sm">
                            {{ item.nom }}
                        </span> </p>
                        
                    </div>
                </div>
            </div>
        </div>
        <div v-if="this.itsMyRessource" class="fr-col-4" >
            <button class="fr-btn fr-btn--icon-left fr-icon-delete-fill color-red-fr get-full-height" @click="this.showModal = true">Delete</button>
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
                    Voulez-vous vraiment supprimer cette ressource ?
                </h1>
                <p>Cette suppression de la ressource effacera tous les commentaires et réponses associés et supprimera definitivement le fichier associé.</p>
            </div>
            <div class="fr-modal__footer">
                <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                    <button class="fr-btn fr-btn--icon-left fr-icon-delete-fill color-red-fr" @click="this.deleteRessource">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
// TODO : fix utilisateur not get correctly
    import router from "@/router"
    import store from "@/store"
    export default{
        name : "RessourceCard",
        props:{
            text : String,
            titre : String,
            datePublication : String,
            ressourceId: Number,
            utilisateur: Object,
            collections: Object
        },
        data(){
            return{
                password:null,
                token:null,
                display_error:false,
                emailConnected:null,
                isRemoved:false,
                showModal:false
            }
        },
        methods:{
            goToRessource(){
                router.push({name : "ressource-view", params : { id : this.ressourceId}})
            },
            deleteRessource(){
                const options = {
                    method: 'DELETE',
                    headers: {
                        "Authorization": "Bearer " + store.state.token
                    }
                };
                fetch(this.api_path + this.route_ressources + "/" + this.ressourceId,options)
                .then(res=>{
                    if(res.status == 401){
                        router.push("/")
                    }else if(res.status == 200){
                        this.isRemoved = true
                        this.showModal = false;
                    }
                }).catch(err =>{
                    console.log(err)
                })
            },
            closeModal() {
                this.showModal = false;
            }
        },
        computed:{
            pathRessourceView(){
                return "/ressource-view/" + this.ressourceId
            },
            itsMyRessource(){
                if(this.utilisateur.id == store.state.id || store.state.role == "MODERATEUR" || store.state.role == "ADMIN" || store.state.role == "SUPER_ADMIN"){
                    return true
                }else{
                    return false
                }
            },
            truncatedText(){
                var max_size = 20
                if(this.text.length >= max_size){
                    return this.text.substring(0,max_size) + "..."
                }else{
                    return this.text
                }
            },
            truncatedTitre(){
                var max_size = 25
                if(this.titre.length >= max_size){
                    return this.titre.substring(0,max_size) + "..."
                }else{
                    return this.titre
                }
            }
        },
        mounted(){
            if(store.state.token == null || store.state.role == null || store.state.id == null){
                if(sessionStorage.getItem('token') &&  sessionStorage.getItem('role')&& sessionStorage.getItem('id')){
                    store.state.token = sessionStorage.getItem('token');
                    store.state.role = sessionStorage.getItem('role');
                    store.state.id = sessionStorage.getItem('id');
                }
            }
        }

    }

</script>

<style scoped>
  .modal {
    display: block;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
  }
  
  .modal-content {
    position: fixed; /* Positionnement fixe par rapport à la fenêtre du navigateur */
    top: 50%; /* Positionnement à 50% du haut de la page */
    left: 50%; /* Positionnement à 50% de la gauche de la page */
    transform: translate(-50%, -50%); /* Déplace l'élément vers le haut et vers la gauche de 50% de sa propre taille */
    padding: 20px;
    width: 80%;
    }
  .get-full-height{
    height: 100%!important;
    /* width: 90% !important; */
  }
</style>
