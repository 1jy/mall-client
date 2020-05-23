import Vue from 'vue'
import Router from 'vue-router'
import Home from '../page/Home.vue'
import Login from '../page/Login.vue'
import Detail from '../page/goods/Detail.vue'
import Checkout from "../page/order/Checkout";
import Member from "../page/member/Member";
import UserInfo from "../page/member/children/UserInfo";
import OrderList from "../page/member/children/OrderList";
import Cart from "../page/cart/Cart";
import AddressList from "../page/member/children/AddressList";
import Payment from "../page/order/Payment";
import OrderDetail from "../page/member/children/OrderDetail";
import SearchList from "../page/goods/SearchList";

Vue.use(Router);

export default new Router({
  // 去掉url中的#
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home
    },
    {path: '/login', name: 'login', component: Login},
    {path: '/detail', name: 'detail', component: Detail},
    {
      path: '/member',
      name: 'member',
      component: Member,
      redirect: '/member/userInfo',
      children: [
        {path: 'orderList', name: 'orderList', component: OrderList, meta: {requiresAuth: true}},
        {path: 'userInfo', name: 'userInfo', component: UserInfo, meta: {requiresAuth: true}},
        {path: 'addressList', name: 'addressList', component: AddressList, meta: {requiresAuth: true}},
        {path: 'orderDetail', name: 'orderDetail', component: OrderDetail, meta: {requiresAuth: true}}
      ]
    },
    {path: '/cart', name: 'cart', component: Cart, meta: {requiresAuth: true}},
    {path: '/checkout', name: "checkout", component: Checkout, meta: {requiresAuth: true}},
    {path: '/payment', name: 'payment', component: Payment, meta: {requiresAuth: true}},
    {path: '/search', name: 'search', component: SearchList},
    {path: '*', component: Home}
  ]
})
