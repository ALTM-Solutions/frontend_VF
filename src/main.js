import { createApp } from 'vue'
import App from './App.vue'
import './assets/part1.css';
import './assets/part2.css';
import './assets/part3.css';
import './assets/part4.css';
import './assets/part5.css';
import './assets/part6.css';

import store from './store'
import router from './router'


const app = createApp(App).use(store).use(router)

app.config.globalProperties.api_path = "http://localhost:8080/"

app.config.globalProperties.route_login = "api/v1/login"
app.config.globalProperties.route_register = "api/v1/register"
app.config.globalProperties.get_all_ressources = "api/public/ressources"
app.config.globalProperties.route_commentaire = "api/public/commentaire"
app.config.globalProperties.route_utilisateur = "api/public/utilisateur"
app.config.globalProperties.route_reponse = "api/public/reponse"

app.config.globalProperties.expire_cookies = (7 * 24 * 60 * 60 * 1000)

app.mount('#app')
