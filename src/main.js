import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './plugins/aMap';
//守卫路由
import "./router/permit";
//svgIcon
import "./icon";
//导入elementUi
import './plugins/elementui';
//导入Composition API 模块
import "./plugins/compositionApi";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
