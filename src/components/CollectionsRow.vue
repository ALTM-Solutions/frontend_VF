
<template>
    <td>{{ this.typeParcours.id }}</td>
    <td>{{ this.typeParcours.nom }}</td>
    <td><button class="fr-btn color-red-fr"  @click="this.showModal()">Supprimer</button></td>

    <div v-if="showModalDelete" class="modal">
        <div class="fr-modal__body modal-content">
            <div class="fr-modal__header">
                <button class="fr-btn--close fr-btn" aria-controls="fr-modal-2" @click="this.closeModal()">Fermer</button>
            </div>
            <div class="fr-modal__content">
                <h1 id="fr-modal-2-title" class="fr-modal__title">
                    <span class="fr-icon-arrow-right-line fr-icon--lg"></span>
                    Voulez-vous vraiment supprimer la collections ?
                </h1>
            </div>
            <div class="fr-modal__footer">
                <div class="fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">

                    <button class="fr-btn fr-btn--icon-left color-red-fr fr-icon-checkbox-fill" @click="this.deleted()">Supprimer la collections</button>
                    <button class="fr-btn fr-btn--icon-left fr-icon-close-circle-fill" @click="this.closeModal()">Annuler</button>
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
            showModalDelete:false,
        }
    },
    props:{
        typeParcours:Object
    },
    methods:{
        closeModal(){
            this.showModalDelete = false
        },
        deleted(){
            const options = {
                    method: 'DELETE',
                    headers: {
                        "Authorization": "Bearer " + store.state.token
                    }
            };
            fetch(this.api_path + this.type_parcours + "/"+ this.typeParcours.id ,options)
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
        showModal(){
            this.showModalDelete=true
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