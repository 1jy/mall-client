import axios from 'axios'
import Qs from 'qs'
import state from "../store";
import {REQUIRE_LOGIN} from './resultCode'

axios.defaults.timeout = 10000;

export const TOKEN_PREFIX = 'Bearer ';
export const TOKEN_HEADER = 'authorization';

export default {
    checkLogin(code) {
        if (code === REQUIRE_LOGIN) {
            window.location.href = '/login'
        }
    },
    fetchGet(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                params: params,
                url: url,
                headers: {
                    [TOKEN_HEADER]: TOKEN_PREFIX + state.getters.getToken
                },
                transformRequest: [function (data) {
                    data = Qs.stringify(data);
                    return data;
                }],
            }).then(res => {
                this.checkLogin(res.data.code);
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
                headers: {
                    [TOKEN_HEADER]: TOKEN_PREFIX + state.getters.getToken
                },
                transformRequest: [function (data) {
                    data = Qs.stringify(data);
                    return data;
                }],
            }).then(res => {
                this.checkLogin(res.data.code);
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
                headers: {
                    [TOKEN_HEADER]: TOKEN_PREFIX + state.getters.getToken
                },
            }).then(res => {
                this.checkLogin(res.data.code);
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
