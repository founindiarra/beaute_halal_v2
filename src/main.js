import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { magnetic, parallax, split, tilt } from './directives/motion'
import reveal from './directives/reveal'
import './style.css'

createApp(App)
  .use(router)
  .directive('reveal', reveal)
  .directive('split', split)
  .directive('parallax', parallax)
  .directive('tilt', tilt)
  .directive('magnetic', magnetic)
  .mount('#app')
