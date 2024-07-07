<template>

    <RegisterCard :roleCreation="this.roleCreation"></RegisterCard>
    
</template>
    
<script>
    import RegisterCard from '@/components/RegisterCard.vue';
    import store from '@/store';

    export default {
        name: 'RegisterSuperAdmin',
        components: {
            RegisterCard
        },
        data(){
            return{
                roleCreation:null
            }
        }, 
        mounted(){
            this.roleCreation = this.$route.params.role
            if(store.state.token == null || store.state.id == null || store.state.role == null ){
                if(sessionStorage.getItem('token') && sessionStorage.getItem('role') && sessionStorage.getItem('id')){
                    store.state.token = sessionStorage.getItem('token');
                    store.state.role = sessionStorage.getItem('role');
                    store.state.id = sessionStorage.getItem('id');
                }
            }
        }
    }
</script>
