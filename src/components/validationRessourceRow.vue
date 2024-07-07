
<template>
    <td>{{ this.ressource.id }}</td>
    <td>{{ this.ressource.nomRessource }}</td>
    <td>{{ this.shortedText }}</td>
    <td>{{ this.allCollection }}</td>
    <td><a :href="this.urlImage" v-if="this.ressource.pieceJointe != null" target="_blank">{{ this.ressource.pieceJointe.nomOrigin }}</a></td>
    <td>{{ this.status }}</td>
    <td><button class="fr-btn" @click="this.showModal()">{{ this.buttonDisplay }}</button></td>
    <td><button class="fr-btn fr-icon-information-fill fr-btn--tertiary-no-outline" @click="this.goToRessource"></button></td>
    <td><button class="fr-btn fr-icon-delete-line color-red-fr" @click="this.showModalDeleted()"></button></td>
    <div v-if="showModalEnable" class="modal">
        <div class="fr-modal__body modal-content">
            <div class="fr-modal__header">
                <button class="fr-btn--close fr-btn" aria-controls="fr-modal-2" @click="this.closeModal()">Fermer</button>
            </div>
            <div class="fr-modal__content">
                <h1 id="fr-modal-2-title" class="fr-modal__title">
                    <span class="fr-icon-arrow-right-line fr-icon--lg"></span>
                    Voulez-vous vraiment activer la ressource ?
                </h1>
            </div>
            <div class="fr-modal__footer">
                <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">

                    <button class="fr-btn fr-btn--icon-left fr-icon-checkbox-fill" @click="this.enable()">Activer la ressource</button>
                    <button class="fr-btn fr-btn--icon-left fr-icon-close-circle-fill" @click="this.closeModal()">Annuler</button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showModalDisable" class="modal">
        <div class="fr-modal__body modal-content">
            <div class="fr-modal__header">
                <button class="fr-btn--close fr-btn" aria-controls="fr-modal-2" @click="this.closeModal()">Fermer</button>
            </div>
            <div class="fr-modal__content">
                <h1 id="fr-modal-2-title" class="fr-modal__title">
                    <span class="fr-icon-arrow-right-line fr-icon--lg"></span>
                    Voulez-vous vraiment désactiver la ressource ?
                </h1>
            </div>
            <div class="fr-modal__footer">
                <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">

                    <button class="fr-btn fr-btn--icon-left fr-icon-checkbox-fill" @click="this.disable()">Désactiver la ressource</button>
                    <button class="fr-btn fr-btn--icon-left fr-icon-close-circle-fill" @click="this.closeModal()">Annuler</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showModalDel" class="modal">
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
                    <button class="fr-btn fr-btn--icon-left fr-icon-delete-fill color-red-fr" @click="this.deletedRessource">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import router from '@/router'

export default {
    name:"ValidationRessourceRow",
    data(){
        return{
            showModalDisable:false,
            showModalEnable:false,
            showModalDel:false
        }
    },
    props:{
        ressource:Object
    },
    computed:{
        status(){
            if(this.ressource.valide){
                return "ACTIF"
            }else{
                return "INACTIF"
            }
        },
        urlImage(){
            return this.api_path + this.get_file + "/" + this.ressource.pieceJointe.cheminPieceJointe
        },
        buttonDisplay(){
            if(this.ressource.valide){
                return "Désactivation"
            }else{
                return "Activation"
            }
        },
        shortedText(){
            var max_size = 200
            if(this.ressource.text.length >= max_size){
                return this.ressource.text.substring(0,max_size) + "..."
            }else{
                return this.ressource.text
            }
        },
        allCollection(){
            let output = ""
            for(let col of this.ressource.typeParcours){
                if(output == ""){
                    output += col.nom
                }else{
                    output += ", " + col.nom
                }
            }
            return output
        }
    },
    methods:{
        goToRessource(){
            router.push("/moderateur-view-ressource/" + this.ressource.id)
        },  
        closeModal(){
            this.showModalDisable = false
            this.showModalEnable = false
            this.showModalDel = false
        },
        showModal(){
            if(this.status == "ACTIF"){
                this.showModalDisable = true
            }else{
                this.showModalEnable = true
            }
        },
        showModalDeleted(){
            this.showModalDel = true
        },
        deletedRessource(){
            const options = {
                method: 'DELETE',
                headers: {
                    "Authorization": "Bearer " + store.state.token
                }
            };
            fetch(this.api_path + this.route_ressources + "/" + this.ressource.id,options)
            .then(res=>{
                if(res.status == 401){
                    alert("not working!")
                    router.push("/")
                }else if(res.status == 200){
                    location.reload()
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        disable(){
            const options = {
                    method: 'POST',
                    headers: {
                        "Authorization": "Bearer " + store.state.token
                    }
            };
            fetch(this.api_path + this.disable_ressource + "/"+ this.ressource.id ,options)
            .then(res=>{
                if(res.status == 401){
                    router.push("/")
                }else if(res.status == 200){
                    location.reload()
                }

            })
            .catch(err=>{
                console.log(err)
            })
        },
        enable(){
            const options = {
                    method: 'POST',
                    headers: {
                        "Authorization": "Bearer " + store.state.token
                    }
            };
            fetch(this.api_path + this.enable_ressource + "/"+ this.ressource.id ,options)
            .then(res=>{
                if(res.status == 401){
                    router.push("/")
                }else if(res.status == 200){
                    location.reload()
                }

            })
            .catch(err=>{
                console.log(err)
            })
        }
    },
    mounted(){
        if(store.state.token == null || store.state.id == null || store.state.role == null){
            if(sessionStorage.getItem('token') || sessionStorage.getItem("id") || sessionStorage.getItem("role")){
                store.commit("setConnectionStatus", true)
                store.state.token = sessionStorage.getItem('token');
                store.state.id = sessionStorage.getItem('id');
                store.state.role = sessionStorage.getItem('role');
            }else{
                router.push("/")
            }
        }
    }


}
</script>