import { createApp, watch } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

watch(pinia.state, (state) => {
  localStorage.setItem("user", JSON.stringify(state.user));
},
{ deep: true });

app.use(pinia)
app.use(router)
app.mount('#app')

// createApp(App).use(router).mount('#app')
