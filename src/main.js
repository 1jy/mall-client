// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import 'babel-polyfill'

import VueLazyLoad from 'vue-lazyload'
import jwtDecode from "jwt-decode";
Vue.use(VueLazyLoad);

Vue.use(VueAwesomeSwiper);
Vue.use(ElementUI);
Vue.config.productionTip = false;


/** 检查 token 是否过期 */
function hasTokenExpired() {
  let token = store.getters.getToken;
  let jwt = jwtDecode(token);
  return jwt.exp < new Date().getTime() / 1000;
}

function hasAdapt(){
  let userAgent = navigator.userAgent;
  console.log(userAgent);
  if(RegExp('^((MSIE [0-9])|(rv))$').test(userAgent)){
    window.alert("暂不兼容此浏览器, 请更换 [Fire, Chrome, Edge] 浏览更佳.");
    return false;
  }

  if(userAgent.indexOf("Android") !== -1){
    window.alert("暂未对移动端设备适配处理, 请更换桌面端 [Fire, Chrome, Edge] 浏览更佳.");
    return false;
  }

  if(userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1){
    window.alert("暂未对移动端设备适配处理, 请更换桌面端 [Fire, Chrome, Edge] 浏览更佳.");
    return false;
  }
  return true;
}

router.beforeEach((to, from, next) => {
  // 判断浏览器是否兼容
  if(!hasAdapt()){
    return;
  }

  if (to.name === 'login' || !to.meta.requiresAuth) {
    next();
    return
  }

  let hasLogin = store.getters.hasLogin;
  if (hasLogin) {
    if(hasTokenExpired()){
      next({path: '/login', redirect: to.path});
      return;
    }
    next()
  } else {
    next({path: '/login', redirect: to.path})
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
