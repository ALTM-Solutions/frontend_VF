<template>
    <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--center">
            <h2>Liste des ressources : </h2>
        </div>
        <div class="fr-grid-row">
            <div v-for="(item, index) in all_ressource" :key="index" class="fr-col-12 fr-col-xl-4 fr-col-lg-4 fr-col-md-6 fr-col-sm-12">
                <RessourceCard :text="item.text" :titre="item.nomRessource" :datePublication="item.datePublication" :ressourceId=item.id :utilisateur="item.utilisateur"></RessourceCard>
            </div>
        </div>
    </div>

</template>
    
<script>
import store from '@/store'
import router from '@/router'
import RessourceCard from '@/components/RessourceCard.vue'

    export default {
        name: 'HomePage',
        components: {RessourceCard},
        data(){
            return {
                token: null,
                all_ressource: []
            }
        },
        mounted(){
            this.token = store.state.token
            if(store.state.token == null){
                if(sessionStorage.getItem('token')){
                    store.state.token = sessionStorage.getItem('token');
                    store.state.email = sessionStorage.getItem('email');
                }
            }
            if(this.token != null){
                const options = {
                    method: 'GET',
                    headers: {
                        "Authorization": "Bearer " + store.state.token
                    }
                };
                fetch(this.api_path + this.get_all_ressources,options)
                .then(res=>{
                    if(res.status == 401){
                        sessionStorage.clear()
                        store.state.token = null
                        store.state.username = null
                        store.commit("setConnectionStatus",false)
                        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                        document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                        router.push("/")
                    }else if(res.status == 200){
                        return res.json()
                    }
                }).then(data => {
                    this.all_ressource = data
                }).catch(err =>{
                    console.log(err)
                })
            }else{
                sessionStorage.clear()
                store.state.token = null
                store.state.username = null
                store.commit("setConnectionStatus",false)
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                router.push("/")
            }
            

        }
    }
</script>