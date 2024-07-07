<template>
    <td><img v-if='this.cheminPhotoProfil != ""' class="profil-picture" :src="this.urlImage" alt="photo de profil"></td>
    <td>[{{ this.id }}]</td> 
    <td>{{ this.nom }}</td>
    <td>{{ this.prenom }}</td> 
    <td>{{ this.dateDesactivation }}</td>
    <td>{{ this.role }}</td>
    <td>{{ this.status }}</td>
</template>
        
    <script>
        import store from '@/store'
        import router from '@/router'
    
        export default {
            name: 'SuperAdminUserRow',
            data(){
                return{
                }
            },
            props:{
                id:Number,
                nom: String,
                prenom : String,
                cheminPhotoProfil:String,
                dateDesactivation:String,
                role:String
            },
            computed:{
                status(){
                    let now = new Date();
                    let date = new Date(this.dateDesactivation)
                    if( date < now){
                        return "ACTIF"
                    }else{
                        return "INACTIF"
                    }
                },
                urlImage(){
                    return this.api_path + this.get_file + "/" + this.cheminPhotoProfil
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

<style>
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
</style>
    