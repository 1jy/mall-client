<template>
  <div class="navbar-wrap">
    <div class="header">
      <div class="col col-1">
        <el-link href="/">GGMall首页</el-link>
      </div>
      <div class="col col-2">
        <ul class="userinfo-name item">
          <li>
            <el-link>{{getUserInfo.username}}</el-link>
            <ul class="userinfo-detail">
              <li>
                <div>我的信息</div>
                <div>
                  <el-avatar :src="getUserInfo.avatar"/>
                </div>
                <div>
                  {{getUserInfo.username}}
                </div>
                <div>
                  <router-link to="/member/userInfo">账户资料</router-link>
                  <router-link to="/member/addressList">收件地址管理</router-link>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <el-link @click.prevent="logout"
                 class="item"
                 style="margin-right: 16px;"
                 v-if="hasLogin">退出</el-link>
        <el-link v-if="!hasLogin"
                 class="item"
                 href="/login?active=1">
          您好, 请登录
        </el-link>
        <el-link class="item" href="/login?active=1" v-if="!hasLogin">
          <span style="color:red;">免费注册</span>
        </el-link>
      </div>
      <div class="col col-3" style="text-align: center;">
        <el-link class="item" href="/member">我的GG</el-link>
        <el-link class="item" href="/member/orderList">我的订单</el-link>
        <el-link class="item" href="/cart">购物车</el-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    computed: {
      hasLogin() {
        return this.$store.getters.hasLogin
      },
      getUserInfo() {
        return this.$store.getters.getUser;
      }
    },
    methods: {
      logout() {
        this.$store.commit('logout');
        this.$router.push({path: '/'})
      }
    }
  }
</script>

<style lang="scss" scoped>

  .navbar-wrap {
    width: 100vw;
    top: 0;
    left: 0;
    right: 0;
    height: 36px;
    line-height: 32px;
    background-color: #efefef;
    overflow: hidden;

    .header {
      width: 1220px;
      height: 36px;
      margin: auto;
      padding: 0;

      .userinfo-detail {
        background-color: #fff;
        width: 230px;
        text-align: center;
        padding: 20px;
        display: none;
        z-index: 100000;
        font-size: small;
        border: 1px #efefef solid;

        .el-avatar {
          width: 90px;
          height: 90px;
        }
      }

      .userinfo-name {
        display: inline-block;
      }

      .userinfo-name:hover {
        .userinfo-detail {
          position: fixed;
          display: block;
        }
      }

      .col {
        float: left;
        display: block;

        .item {
          padding: 0 8px 0 8px;
        }

        .item:first-child {
          margin-left: 16px;
        }

        .item:last-child {
          margin-right: 16px;
        }
      }

      .col-1 {
        text-align: center;
        width: 220px;
      }

      .col-1::before {
        margin-left: 10px;
      }

      .col-1::after {
        margin-right: 10px;
      }

      .col-2 {
        text-align: right;
        width: 750px;
      }


      .col-3::before {
        width: 240px;
        height: 10px;
        color: #afafaf;
        content: '|'
      }

    }
  }
</style>
