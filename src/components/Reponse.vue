<template>
    <div v-if="!this.isRemoved" class="reponse-block">
        <div class="fr-grid-row fr-mb-3w remove-bottom-margin">
            <div class="fr-col-1">
                <img class="profil-picture" :src="this.user.cheminPhotoProfil" alt="photo de profil">
            </div>
            <div class="fr-col-11">
                <span class="fr-quote__author">[{{ this.user.nom }} {{  this.user.prenom }}]</span>
            </div>
        </div>
        <div class="fr-grid-row fr-mb-3w remove-bottom-margin">
            <div class="fr-col-10">
                <p>{{ this.reponse.reponse }}</p>
            </div>
            <div class="fr-col-2">
                <div v-if="this.isMyReponse">
                    <button class="fr-btn fr-btn--icon-left fr-icon-delete-fill color-red-fr" @click="this.showModalDelete = true"></button>
                </div>
            </div>
        </div>
        <div class="fr-grid-row fr-mb-3w">
            <div class="fr-col-12">
                <button v-if="this.fileIsPresent" @click="downloadFile" class="fr-btn--icon-left fr-icon-file-download-fill color-blue-fr" :alt="this.ressourceFilename">Télécharger la ressource</button>
            </div>
            
        </div>
    </div>
    <div v-if="showModalDelete" class="modal">
        <div class="fr-modal__body modal-content">
            <div class="fr-modal__header">
                <button class="fr-btn--close fr-btn" aria-controls="fr-modal-2" @click="this.closeModalDelete()">Fermer</button>
            </div>
            <div class="fr-modal__content">
                <h1 id="fr-modal-2-title" class="fr-modal__title">
                    <span class="fr-icon-arrow-right-line fr-icon--lg"></span>
                    Voulez-vous supprimer la réponse ?
                </h1>
            </div>
            <div class="fr-modal__footer">
                <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                    <button class="fr-btn fr-btn--icon-left fr-icon-delete-fill color-red-fr" @click="this.deleteReponse()">Supprimer la réponse</button>
                    <button class="fr-btn fr-btn--icon-left fr-icon-close-circle-fill" @click="this.closeModalDelete()">Annuler</button>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
// TODO : fix utilisateur not get correctly
    import store from "@/store"

    export default{
        name : "ReponseView",
        props:{
            reponse:Object
        },
        data(){
            return{
                isRemoved:false,
                emailConnected:null,
                file:[],
                showModalDelete:false,
                user:this.reponse.utilisateur
            }
        },
        computed:{
            isMyReponse(){
                if(this.reponse.utilisateur.adresseMail == this.emailConnected){
                    return true
                }else{
                    return false
                }
            },
            fileIsPresent(){
                if(this.reponse.pieceJointe != null && this.reponse.pieceJointe != "null"){
                    return true
                }else{
                    return false
                }
            }
        },
        methods:{
            deleteReponse(){
                const options = {
                    method: 'DELETE',
                    headers: {
                        "Authorization": "Bearer " + store.state.token
                    }
                };
                fetch(this.api_path + this.route_reponse + "/" + this.reponse.id ,options)
                .then(res=>{
                    if(res.status != 200){
                        throw new Error("is not deleted")
                    }else{
                        this.isRemoved = true
                        this.showModalDelete = false;
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            closeModalDelete() {
                this.showModalDelete = false;
            },
            async downloadFile() {
                let segments = this.reponse.pieceJointe.cheminPieceJointe.split("/")
                let filename = segments[segments.length - 1]
                let response = await fetch(this.reponse.pieceJointe.cheminPieceJointe, {
                    headers: {
                    'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.status != 200) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let blob = await response.blob();

                let link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();

                URL.revokeObjectURL(link.href);
            }
        },
        mounted(){
            if(store.state.token == null){
                if(sessionStorage.getItem('token')){
                    store.state.token = sessionStorage.getItem('token');
                    store.state.email = sessionStorage.getItem('email');
                    this.emailConnected = store.state.email
                    this.token = store.state.token                
                }else{
                    this.emailConnected = store.state.email
                }
            }else{
                store.state.email = sessionStorage.getItem('email');
                this.token = store.state.token
                this.emailConnected = store.state.email
            }
            const options = {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + store.state.token
                }
            };
            if(this.user.cheminPhotoProfil != "" && this.user.cheminPhotoProfil!=null && this.user.cheminPhotoProfil != "null"){
                fetch(this.user.cheminPhotoProfil ,options)
                .then(res =>{
                    if(res.status == 200){
                        return res.blob();
                    }else{
                        throw new Error("not a image")
                    }
                })
                .then(blob =>{
                    // TODO : A OPTI pour conserver le blob de l'utilisateur une fois créer...
                    this.user.cheminPhotoProfil =  URL.createObjectURL(blob)
                }).catch(err=>{
                    console.log(err)
                })
            }
        }

    }

</script>
<style scoped>
.reponse{
    margin-left: 10%;
}
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
.remove-bottom-margin{
    margin-bottom: 0px !important;
  }
  .color-blue-fr{
    color:#000091;
  }

  .profil-picture {
    position: relative;
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    border: 1px solid #deebff;
    text-align: center;
    margin-right: 6px;
    margin-left: 10px;
    object-fit: cover;
  }
  .reponse-block{
    margin-left: 10%
  }
</style>
