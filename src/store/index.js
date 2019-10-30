import Vuex from "vuex"
import Vue from "vue"
import {addCart} from "../api/goods";
import jwtDecode from 'jwt-decode'
import {flat2Tree, Storage} from "../util";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: '',
      username: '',
      avator: ''
    },
    cartList: {},
    loginState: false,
    orderItems: [],
    token: ''
  },
  methods: {},
  getters: {
    getCartList(state) {
      let rs = Storage.get('cartList');
      state.cartList = rs != null ? JSON.parse(rs) : {};
      return state.cartList
    },
    getUser(state) {
      let rs = Storage.get("user");
      state.user = rs != null ? JSON.parse(rs) : {};
      return state.user
    },
    hasLogin(state) {
      let rs = Storage.get("loginState");
      state.loginState = rs != null ? rs : false;
      return state.loginState
    },
    getOrderItems(state) {
      let rs = Storage.get('orderItems')
      state.orderItems = rs != null ? JSON.parse(rs) : [];
      return state.orderItems
    },
    getToken(state) {
      state.token = Storage.get('token')
      return state.token
    }
  },
  mutations: {
    login(state, token) {
      let decoded = jwtDecode(token)

      state.user = {
        username: decoded.username,
        id: decoded.id,
        roles: decoded.roles
      }
      state.loginState = true
      state.token = token

      Storage.set('user', JSON.stringify(state.user))
      Storage.set('loginState', state.loginState)
      Storage.set('token', state.token)
      console.log(Storage.get("token"))

      // 本地数据同步
      for (let k in state.cartList) {
        let params = {gid: k, num: state.cartList[k]}
        addCart(params)
      }
      state.cartList = {}
    },
    logout(state) {
      state.user = state.token = null
      state.loginState = false
      Storage.clear()
    },
    addCart(state, params) {
      state.cartList[params.gid] = params.num
      Storage.set('cartList', JSON.stringify(state.cartList))
    },
    delCart(state, id) {
      delete state.cartList[id]
    },
    checkout(state, items) {
      state.orderItems = items
      Storage.set("orderItems", JSON.stringify(state.orderItems))
    }
  }
})
