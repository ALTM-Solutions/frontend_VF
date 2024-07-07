<template>
    <main class="fr-pt-md-14v" role="main" id="content">
        <div class="fr-container fr-container--fluid fr-mb-md-14v">
            <div class="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
                <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                    <div class="fr-container fr-background-alt--grey fr-px-md-0 fr-py-10v fr-py-md-14v">
                        <div class="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
                            <div class="fr-col-12 fr-col-md-9 fr-col-lg-8">
                                <h1>Validation du compte </h1>
                                <p>*Vérfier la présence du mail dans les spam</p>
                                <div>
                                    <fieldset class="fr-fieldset" id="login-1760-fieldset" aria-labelledby="login-1760-fieldset-legend login-1760-fieldset-messages">
                                        <legend class="fr-fieldset__legend" id="login-1760-fieldset-legend" v-if="display_error">
                                            <div class="fr-alert fr-alert--error">
                                                <h3 class="fr-alert__title">Erreur : Erreur de connexion</h3>
                                                <p>Veuillez vérifier le code reçu, Attention le code n'est valide que 60 minutes.</p>
                                            </div>
                                        </legend>
                                        <div class="fr-fieldset__element">
                                            <fieldset class="fr-fieldset" id="credentials" aria-labelledby="credentials-messages">
                                                <div class="fr-fieldset__element">
                                                    <div class="fr-input-group">
                                                        <label class="fr-label" for="username-1757">
                                                            Adresse mail
                                                            <span class="fr-hint-text">Format attendu : nom@domaine.fr</span>
                                                        </label>
                                                        <input class="fr-input" autocomplete="username" aria-required="true" aria-describedby="username-1757-messages" name="username" id="username-1757" type="text" v-model="this.email" @keypress.enter="this.validate()">
                                                        <div class="fr-messages-group" id="username-1757-messages" aria-live="assertive">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="fr-fieldset__element">
                                                    <div class="fr-input-group">
                                                        <label class="fr-label" for="nom-1757">
                                                            Code
                                                        </label>
                                                        <input class="fr-input" autocomplete="code" aria-required="true" aria-describedby="code-1757-messages" name="code" id="code-1757" type="text" v-model="this.code" @keypress.enter="this.validate()">
                                                        <div class="fr-messages-group" id="nom-1757-messages" aria-live="assertive">
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    
                                        <div class="fr-fieldset__element">
                                            <ul class="fr-btns-group">
                                                <li>
                                                    <button class="fr-mt-2v fr-btn" @click="this.validate()">
                                                        Validation compte
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="fr-messages-group" id="login-1760-fieldset-messages" aria-live="assertive">
                                        </div>
                                    </fieldset>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style>
    
</style>
    
<script>
    import store from '@/store'
    import router from '@/router'

    export default{
        name : "ValidateCreate",
        data(){
            return{
                email:null,
                code:null,
                password:null,
                display_error:false

            }
        },
        methods:{
            validate(){
                if(this.checkform()){
                    let header = {
                        "Content-Type": "application/json",
                    }
                    const options = {
                        method: 'POST',
                        headers: header,
                        body: JSON.stringify({
                            "adresseMail":this.email,
                            "code":this.code
                        })
                    };
                    let routes = this.api_path + this.route_validate_register

                    fetch(routes, options)
                    .then(res =>{
                        if(res.status == 201){
                            if(this.password != null && this.password != ""){
                                this.login()
                            }else{
                                router.push("/login")
                            }
                        }else{
                            this.display_error = true
                        }
                    }).catch(err =>{
                        console.log(err)
                        this.display_error = true
                    })
                }else{
                    this.display_error = true
                }
            },
            checkform(){
                if(this.email == "" || this.email == null){
                    return false
                }
                if(this.code == "" || this.code == null){
                    return false
                }
                return true
            },
            login(){
                
                const options = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    
                    body: JSON.stringify({"email":this.email,"password":this.password})
                };
                
                fetch(this.api_path + this.route_login, options)
                .then(res =>{
                    if(res.status == 200 || res.status == 401){
                        return res.json()
                    }else{
                        this.display_error_inactif = false
                        this.display_error = false
                        this.display_error_server = true
                        throw new Error("User disabled")
                    }
                })
                .then(data =>{
                    if(data.success != null){
                        // stockage dans le store vue
                        store.state.token = data.token
                        store.state.email = data.details.username
                        store.state.role = data.details.role
                        // stockage dans le session storage
                        sessionStorage.setItem("token",data.token) 
                        sessionStorage.setItem("email",data.details.username)
                        sessionStorage.setItem("role",data.details.role)
                        store.commit("setConnectionStatus", true) 
                        router.push("/")
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        mounted(){
            // TODO: Rajouter la vérification dans les cookies
            if(store.state.email == null){
                if(sessionStorage.getItem('email')){
                    store.state.email = sessionStorage.getItem('email');
                }
            }
            this.email = store.state.email
            this.password = store.state.password
        }
    }
</script>