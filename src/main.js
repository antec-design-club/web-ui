import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import VueMqtt from 'vue-mqtt';

Vue.config.productionTip = false;
Vue.use(VueMqtt, 'ws://test.mosquitto.org:8080');

new Vue({
  render: h => h(App),
}).$mount('#app');
