<template>

    <main class="fr-pt-md-14v" role="main" id="content">
        <div class="fr-container fr-container--fluid fr-mb-md-14v">
            <div class="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
                <div class="fr-container fr-background-alt--grey fr-px-md-0 fr-py-10v fr-py-md-14v">
                    <div class="fr-grid-row fr-grid-row-gutters fr-grid-row--center">
                        <div class="fr-col-12 fr-col-md-9 fr-col-lg-8">
                            <h1>Modification d'une ressource</h1>
                            <div>
                                <fieldset class="fr-fieldset" id="login-1760-fieldset" aria-labelledby="login-1760-fieldset-legend login-1760-fieldset-messages">
                                    
                                    <div class="fr-fieldset__element">
                                        <fieldset class="fr-fieldset" id="ressource" aria-labelledby="credentials-messages">
                                            <div class="fr-fieldset__element">
                                                <div class="fr-input-group">
                                                    <label class="fr-label" for="titre-1757">
                                                        Titre de la ressource
                                                        <span class="fr-hint-text">Définition claire et conscise de la ressource</span>
                                                    </label>
                                                    <input v-model="this.titre" class="fr-input" autocomplete="titre" aria-required="true" aria-describedby="titre-1757-messages" name="titre" id="titre-1757" type="text">
                                                </div>
                                            </div>
                                            <div class="fr-fieldset__element">
                                                <div class="fr-password" id="password-1758">
                                                    <label class="fr-label" for="text-1758-input">
                                                       Texte de la ressource
                                                    </label>
                                                    <div class="fr-input-wrap">
                                                        <textarea class="fr-input" aria-describedby="text-1758-input-messages" aria-required="true" name="text" id="text-1758-input" v-model="this.text"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fr-fieldset__element">
                                                <div class="fr-password" id="password-1758">
                                                    <label class="fr-label" for="password-1758-input">
                                                       Insérer un fichier
                                                    </label>
                                                    <div class="fr-input-wrap">
                                                        <input class="fr-upload" type="file" id="file-commentaire" name="text-input-text" @change="handleFileUpload" placeholder="Fichier de la ressource">
                                                    </div>
                                                </div>
                                                <br>
                                                <div class="fr-checkbox-group">
                                                    <input name="checkboxes-inline" id="checkboxes-inline" type="checkbox" aria-describedby="checkboxes-inline" v-model="deleteFile" >
                                                    <label class="fr-label" for="checkboxes-inline" >Supprimer le fichier ?</label>
                                                </div>
                                            </div>
    
                                            <fieldset class="fr-fieldset" id="checkboxes-inline" aria-labelledby="checkboxes-inline-legend checkboxes-inline-messages">
                                                <legend class="fr-fieldset__legend--regular fr-fieldset__legend" id="checkboxes-inline-legend">
                                                    Selectionner les collections
                                                </legend>
                                                <div v-for="(item, index) in collections" :key="index" class="fr-fieldset__element fr-fieldset__element--inline">
                                                    <div class="fr-checkbox-group">
                                                        <input :name="'checkbox-' + index" type="checkbox"  :aria-describedby="'checkboxes-inline-' + index + '-messages'" v-model="collections_selected" :value="item.id">
                                                        <input :name="'checkboxes-inline-' + index" :id="'checkboxes-inline-'+index" type="checkbox" :aria-describedby="'checkboxes-inline-' + index + '-messages'" v-model="collections_selected" :value="item.id">
                                                        <label class="fr-label" :for="'checkboxes-inline-' + index" >
                                                            {{ item.nom }}
                                                        </label>
                                                    </div>
                                                    <div class="fr-messages-group" :id="'checkboxes-inline-' + index + '-messages'" aria-live="assertive"></div>
                                                </div>
                                            </fieldset>
                                        </fieldset>
                                    </div>
                                    <div class="fr-fieldset__element">
                                        <div class="fr-notice fr-notice--info">
                                            <div class="fr-container">
                                                <div class="fr-notice__body">
                                                    <p class="fr-notice__title">La ressouce passe une étape de validation par un administrateur et sera visible quand votre ressource sera validée</p>
                                                </div>
                                            </div>
                                        </div>
                                        <ul class="fr-btns-group">
                                            <li>
                                                <button class="fr-mt-2v fr-btn" @click="updateRessource">
                                                    Mettre à jour la ressource
                                                </button>
                                                <button class="fr-mt-2v fr-btn" @click="goToRessource">
                                                    Revenir à la ressource
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    
    </template>
        
    <script>
        import store from "@/store"
        import router from "@/router"
        export default {
            name: 'EditionRessource',
            data(){
                return {
                    token: null,
                    text:null,
                    titre:null,
                    file:[],
                    collections:[],
                    collections_selected:[],
                    deleteFile:false
                }
            },
            methods:{
                handleFileUpload(event) {
                    this.file = event.target.files[0];
                },
                updateRessource(){
                    let form = new FormData()
                    // Changer si avec ou sans fichier :
                    let route = null
                    
                    if(this.file.length != 0){
                        route = this.api_path + this.update_text_and_file_ressource + "/" + this.$route.params.id
                        form.append('file', this.file)
                    }else{
                        if(this.deleteFile){
                            route = this.api_path + this.update_text_and_file_ressource + "/" + this.$route.params.id
                            let emptyFile = new Blob([], { type: 'application/octet-stream' });
                            form.append("file",emptyFile)
                        }else{
                            route = this.api_path + this.update_text_ressource + "/" + this.$route.params.id
                        }
                    }
                    
                    
                    form.append('texte', this.text)
                    form.append("nomRessource", this.titre)
                    form.append("listTypeParcours",this.collections_selected.join(","))
                    const options = {
                        method: 'PUT',
                        headers: {
                            "Authorization": "Bearer " + this.token
                        },
                        body:form
                    };
                    fetch(route,options)
                    .then(res =>{
                        if(res.status == 200){
                            router.push("/" )
                        }else if(res.status == 401){
                            sessionStorage.clear()
                            store.state.token = null
                            store.state.email = null
                            store.commit("setConnectionStatus",false)
                            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                            document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                            router.push("/login")
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                },
                goToRessource(){
                    router.push("/ressource-view/"+this.$route.params.id)
                }
            },
            mounted(){
                if(store.state.token == null){
                    if(sessionStorage.getItem('token')){
                        store.state.token = sessionStorage.getItem('token');
                    }else{
                        router.push("/")
                    }
                }
                this.token = store.state.token
                const options = {
                    method: 'GET'
                };
                fetch(this.api_path + this.public_type_parcours,options)
                .then(res=>{
                   if(res.status == 200){
                        return res.json()
                    }
                }).then(data => {
                    this.collections = data
                }).catch(err =>{
                    console.log(err)
                })


                fetch(this.api_path + this.get_all_ressources + "/" + this.$route.params.id, {method: 'GET'})
                .then(res=>{
                    if(res.status == 200){
                        return res.json()
                    }
                }).then(data => {
                    this.text = data.ressources.text
                    this.titre = data.ressources.nomRessource
                    let selectedCol = []
                    for(let col of data.typeParcours){
                        selectedCol.push(col.id)
                    }
                    this.collections_selected = selectedCol
                }).catch(err =>{
                    console.log(err)
                })
            }
        }
    </script>