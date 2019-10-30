import http from './public.js'

/** 登录账号 */
export const userLogin = (params) => {
  return http.fetchPost('https://sso.ne0.xyz/api/public/login', params)
};

/** 注册账号 */
export const register = (params) => {
  return http.fetchPost('https://sso.ne0.xyz/api/public/register', params)
};

/** 获取购物车列表 */
export const listCart = (params) => {
  return http.fetchGet('/api/private/user/listCart', params)
};

/** 删除购物车 */
export const delCart = (params) => {
  return http.fetchJSON('/api/private/user/delCart', params)
};

/** 更新购物车 */
export const updateCart = (params) => {
  return http.fetchPost('/api/private/user/updateCart', params)
};

/** 获取订单详情页 */
export const getOrder = (params) => {
  return http.fetchGet('/api/private/user/getOrder', params)
};

/** 获取用户订单列表 */
export const listOrder = (params) => {
  return http.fetchGet('/api/private/user/listOrder', params)
};

/** 获取收货地址列表 */
export const listAddress = (params) => {
  return http.fetchGet('/api/private/user/listAddress', params)
};

/** 添加收货地址 */
export const newAddress = (params) => {
  return http.fetchPost('/api/private/user/newAddress', params)
};

/** 更新收货地址信息 */
export const updateAddress = (params) => {
  return http.fetchPost('/api/private/user/updateAddress', params)
};

/** 删除指定收货地址 */
export const delAddress = (params) => {
  return http.fetchPost('/api/private/user/delAddress', params)
};

/** 确认收货 */
export const confirmOrder = (params) => {
  return http.fetchPost('/api/private/user/confirmOrder', params);
};

/** 订单支付 */
export const payment = (params) => {
  return http.fetchPost('/api/private/user/payment', params)
};

/** 取消订单 */
export const cancelOrder = (params) => {
  return http.fetchPost('/api/private/user/cancelOrder', params)
};



