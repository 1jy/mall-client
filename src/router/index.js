import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Detail from '../components/goods/Detail.vue'
import Checkout from "../components/order/Checkout";
import Member from "../components/member/Member";
import UserInfo from "../components/member/children/UserInfo";
import OrderList from "../components/member/children/OrderList";
import Cart from "../components/cart/Cart";
import AddressList from "../components/member/children/AddressList";
import Support from "../components/member/children/Support";
import Payment from "../components/order/Payment";
import OrderDetail from "../components/order/OrderDetail";
import SearchList from "../components/goods/SearchList";

Vue.use(Router)

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
        {path: 'orderDetail', name: 'orderDetail', component: OrderDetail, meta: {requiresAuth: true}},
        {path: 'support', name: 'support', component: Support, meta: {requiresAuth: true}}
      ]
    },
    {path: '/cart', name: 'cart', component: Cart, meta: {requiresAuth: true}},
    {path: '/checkout', name: "checkout", component: Checkout, meta: {requiresAuth: true}},
    {path: '/payment', name: 'payment', component: Payment, meta: {requiresAuth: true}},
    {path: '/search', name: 'search', component: SearchList},
    {path: '*', component: Home}
  ]
})
