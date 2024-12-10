import { createApp } from 'vue'
import 'virtual:svg-icons-register'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import '@/router/permisstion'

import '@/styles/element/index.scss'
import ElementPlus from 'element-plus'
import '@/styles/index.scss'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
