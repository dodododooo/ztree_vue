import 'reset-css';
import './style/index.scss';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import plugins from './plugins';


Vue.config.productionTip = false

Vue.use(ViewUI);
Vue.use(plugins);



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
