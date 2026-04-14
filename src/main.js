import { createApp, watch } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

watch(pinia.state, (state) => {
  localStorage.setItem("user", JSON.stringify(state.user));
},
{ deep: true });

app.use(pinia).use(router).mount('#app')

// createApp(App).use(router).mount('#app')
