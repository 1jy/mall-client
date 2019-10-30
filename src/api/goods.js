import http from "./public"

/** 商品详情 */
export const productInfo = (params) => {
  return http.fetchGet('/api/public/goods/detail', params)
};

/** 添加购物车 */
export const addCart = (params) => {
  return http.fetchPost('/api/private/goods/addCart', params)
};

/** 商品结算 */
export const checkout = (params) => {
  return http.fetchJSON('/api/private/goods/checkout', params)
};

/** 获取商品分类 */
export const listCategory = (params) => {
  return http.fetchGet('/api/public/listCategory', params)
};

/** 获取首页板块列表 */
export const listPanel = (params) => {
    return http.fetchGet('/api/public/listPanel', params)
};

/** 获取商品评价列表 */
export const listGoodsRate = (params) => {
  return http.fetchGet('/api/public/goods/listRate', params);
};

/** 获取搜索结果 */
export const searchList = (params) => {
  return http.fetchGet('/api/public/search', params);
};