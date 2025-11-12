import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import vant from './vant'
import 'vant/lib/index.css';

window._AMapSecurityConfig = {
    securityJsCode: 'fa8b44df3da8452fae356cabb77a11fe'
}

let app = createApp(App);
const pinia = createPinia()
app.use(pinia);
app.use(vant);

app.mount('#app');
