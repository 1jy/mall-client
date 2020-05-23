import axios from 'axios'
import Qs from 'qs'
import {Jwt, ResultCode} from "../common";
import {Storage} from "../util";
import state from "../store";
import jwtDecode from "jwt-decode";

axios.defaults.timeout = 10000;

/**
 * 在请求头部添加 token 信息
 */
axios.interceptors.response.use(res => {
  if (res.data.code === ResultCode.REQUEST_LOGIN) {
    Storage.clear();
    window.location.href = '/login';
    return;
  }
  return res;
});

/**
 * 拦截未登录响应, 重定向到登录页
 */
axios.interceptors.request.use(req => {
  let token = state.getters.getToken;
  if (token != null) {
    req.headers[Jwt.TOKEN_HEADER] = Jwt.TOKEN_PREFIX + token;
  }
  return req;
});

export default {
  fetchGet(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        params: params,
        url: url,
        transformRequest: [function (data) {
          data = Qs.stringify(data);
          return data;
        }],
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  uploadFile(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        data: params,
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        transformRequest: [function (data) {
          let rs = new FormData();
          for (let k in data) {
            rs.append(k, data[k]);
          }
          return rs;
        }]
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchPost(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        data: params,
        url: url,
        transformRequest: [function (data) {
          data = Qs.stringify(data);
          return data;
        }],
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchJSON(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        data: params,
        url: url,
      }).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
