<template>
    <main class="fr-pt-md-14v" role="main" id="content">
    <div class="fr-container fr-container--fluid fr-mb-md-14v">
    <div class="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
    <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
        <div class="fr-container fr-background-alt--grey fr-px-md-0 fr-py-10v fr-py-md-14v">
            <div class="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
                <div class="fr-col-12 fr-col-md-9 fr-col-lg-8">
                    <h1>Créer un compte (Re)Sources Relationnelles</h1>
                    <div>
                        <fieldset class="fr-fieldset" id="login-1760-fieldset" aria-labelledby="login-1760-fieldset-legend login-1760-fieldset-messages">
                            <legend class="fr-fieldset__legend" id="login-1760-fieldset-legend" v-if="display_error">
                                <div class="fr-alert fr-alert--error">
                                    <h3 class="fr-alert__title">Erreur : Erreur de connexion</h3>
                                    <p>Veuillez saisir un identifiant et mot de passe valide</p>
                                </div>
                            </legend>
                            <div class="fr-fieldset__element">
                                <fieldset class="fr-fieldset" id="credentials" aria-labelledby="credentials-messages">
                                    <div class="fr-fieldset__element">
                                        <div class="fr-input-group">
                                            <label class="fr-label" for="username-1757">
                                                Identifiant
                                                <span class="fr-hint-text">Format attendu : nom@domaine.fr</span>
                                            </label>
                                            <input class="fr-input" autocomplete="username" aria-required="true" aria-describedby="username-1757-messages" name="username" id="username-1757" type="text" v-model="user" @keypress.enter="this.register()">
                                            <div class="fr-messages-group" id="username-1757-messages" aria-live="assertive">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fr-fieldset__element">
                                        <div class="fr-input-group">
                                            <label class="fr-label" for="nom-1757">
                                                Nom
                                            </label>
                                            <input class="fr-input" autocomplete="nom" aria-required="true" aria-describedby="nom-1757-messages" name="nom" id="nom-1757" type="text" v-model="nom" @keypress.enter="this.register()">
                                            <div class="fr-messages-group" id="nom-1757-messages" aria-live="assertive">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fr-fieldset__element">
                                        <div class="fr-input-group">
                                            <label class="fr-label" for="prenom-1757">
                                                Prénom
                                            </label>
                                            <input class="fr-input" autocomplete="prenom" aria-required="true" aria-describedby="prenom-1757-messages" name="prenom" id="prenom-1757" type="text" v-model="prenom" @keypress.enter="this.register()">
                                            <div class="fr-messages-group" id="prenom-1757-messages" aria-live="assertive">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fr-fieldset__element">
                                        <div class="fr-password" id="password-1758">
                                            <label class="fr-label" for="password-1758-input">
                                                Mot de passe
                                            </label>
                                            <div class="fr-input-wrap">
                                                <input v-if="!this.showPassword" class="fr-password__input fr-input" aria-describedby="password-1758-input-messages" aria-required="true" name="password" autocomplete="current-password" id="password-1758-input" type="password" v-model="password" @keypress.enter="this.register()">
                                                <input v-if="this.showPassword" class="fr-password__input fr-input" aria-describedby="password-1758-input-messages" aria-required="true" name="password" autocomplete="current-password" id="password-1758-input" type="text" v-model="password" @keypress.enter="this.register()">
                                            </div>
                                            <div class="fr-messages-group" id="password-1758-input-messages" aria-live="assertive">
                                            </div>
                                            <div class="fr-password__checkbox fr-checkbox-group fr-checkbox-group--sm">
                                                <input aria-label="Afficher le mot de passe" id="password-1758-show" type="checkbox" aria-describedby="password-1758-show-messages" v-model="this.showPassword">
                                                <label class="fr-password__checkbox fr-label" for="password-1758-show">
                                                    Afficher
                                                </label>
                                                <div class="fr-messages-group" id="password-1758-show-messages" aria-live="assertive">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fr-fieldset__element">
                                        <div class="fr-password" id="password-validator-1758">
                                            <label class="fr-label" for="password-validator-1758-input">
                                                Validation du mot de passe
                                            </label>
                                            <div class="fr-input-wrap">
                                                <input class="fr-password__input fr-input" aria-describedby="password-validator-1758-input-messages" aria-required="true" name="password" autocomplete="password-validator" id="password-validator-1758-input" type="password" v-model="password_validator"  @keypress.enter="this.register()">
                                            </div>
                                            <div class="fr-messages-group" id="password-validator-1758-input-messages" aria-live="assertive">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fr-messages-group" id="credentials-messages" aria-live="assertive">
                                    </div>
                                </fieldset>
                            </div>
                           
                            <div class="fr-fieldset__element">
                                <ul class="fr-btns-group">
                                    <li>
                                        <button class="fr-mt-2v fr-btn" @click="this.register()">
                                            Créer un compte
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div class="fr-messages-group" id="login-1760-fieldset-messages" aria-live="assertive">
                            </div>
                        </fieldset>
                    </div>
                    <hr>
                    <h2>Vous avez déjà un compte ?</h2>
                    <ul class="fr-btns-group">
                        <li>
                            <button class="fr-btn fr-btn--secondary" @click="this.goToLogin()">
                                Se connecter
                            </button>
                        </li>
                    </ul>
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
            name : "LoginCard",
            data(){
                return{
                    user:null,
                    password:null,
                    nom:null,
                    prenom:null,
                    display_error:false,
                    password_validator:null,
                    showPassword:false

                }
            },
            methods:{
                register(){
                    if(this.checkform()){
                        const options = {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json",
                            },
                            
                            body: JSON.stringify({
                                "adresseMail":this.user,
                                "password":this.password,
                                "nom":this.nom,
                                "prenom":this.prenom,
                                "cheminPhotoProfil": ""
                            })
                        };
                        
                        fetch(this.api_path + this.route_register, options)
                        .then(res =>{
                            if(res.status != 201){
                                sessionStorage.clear()
                                store.state.email = null
                                store.state.token = null
                                this.display_error = true
                            }else{
                                return res.json()
                            }
                        })
                        .then(data =>{
                            if(data.success){
                                // TODO: Rajouter également dans les cookies 
                                // stockage dans le store vue
                                store.state.token = data.token
                                store.state.email = data.username
                                // stockage dans le session storage
                                sessionStorage.setItem("token",data.token) 
                                sessionStorage.setItem("email",data.username)
                                store.commit("setConnectionStatus", true) 
                                router.push("/home")
                            }
                        }).catch(err=>{
                            console.log(err)
                        })
                    }
                },
                checkform(){
                    // TODO : check this.user format adresse mail
                    if(this.user == null || this.user == ""){
                        this.display_error = true
                        return false
                    }
                    if(this.password == "" || this.password == null){
                        this.display_error = true
                        return false
                    }
                    if(this.password != this.password_validator){
                        return false
                    }
                    if(this.nom == "" || this.nom == null){
                        return false
                    }
                    if(this.prenom == "" || this.prenom == null){
                        return false
                    }
                    return true
                },
                goToLogin(){
                    router.push("/")
                }
    
    
            },
            mounted(){
                // TODO: Rajouter la vérification dans les cookies
                if(sessionStorage.getItem('token')){
                    store.commit("setConnectionStatus", true)
                    store.state.token = sessionStorage.getItem('token');
                    store.state.email = sessionStorage.getItem('email');
                    router.push("/home")
                }
            }
    
        }
    
</script>