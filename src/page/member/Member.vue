<template>
  <div @scroll.passive="handleScroll(e)" class="wrap">
    <jjHeader/>
    <div :class="!isFixed ? 'sticker-fixed' : 'sticker'" id="sticker">
      <div class="stick-wrap">
        <div class="logo-wrap">
          <el-avatar src="/static/duck.svg"></el-avatar>
        </div>
        <div class="search-wrap">
          <el-autocomplete :fetch-suggestions="fetchSuggests" :hide-loading="true"
                           :trigger-on-focus="false"
                           @select="handleSelect"
                           class="search-bar"
                           max="50"
                           placeholder="搜索商品"
                           v-model="query">
            <el-button @click="handleQuery" class="search-btn" icon="el-icon-search" slot="append"/>
          </el-autocomplete>
        </div>
      </div>
    </div>
    <el-container class="content">
      <el-aside width="221" class="el-aside">
        <div class="nav-warp">
          <el-avatar :src="getAvatar" class="avatar" shape="square"></el-avatar>
          <div class="username">{{getUsername}}</div>
          <el-menu class="tab" default-active="0" router>
            <el-menu-item :index="tab.path" :key="i" v-for="(tab, i) in tabs">
              <span slot="title">{{tab.name}}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>

  </div>
</template>
<script>
  import jjHeader from "../../components/header/Header";
  import {searchList} from "../../api/goods";

  export default {
    components: {jjHeader},
    data() {
      return {
        tabs: [
          {name: '账号资料', path: '/member/userInfo'},
          {name: '订单信息', path: '/member/orderList'},
          {name: '收货地址', path: '/member/addressList'},
        ],
        query: '',
        isFixed: true
      }
    },
    computed: {
      getAvatar() {
        let avatar = this.$store.getters.getUser.avatar;
        return avatar + '?' + new Date();
      },
      getUsername() {
        return this.$store.getters.getUser.username;
      }
    },
    mounted() {
      window.addEventListener("scroll", this.handleScroll);
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleScroll(e) {
        const result = window.pageYOffset <= 36;
        // 如果小于等于头部高度
        this.isFixed = result;
      },
      handleSelect(key) {
        this.$router.push({path: '/search', query: {query: key.value}});
      },
      fetchSuggests(queryString, cb) {
        let params = {
          query: queryString,
          start: 0,
          size: 5
        };
        searchList(params).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return;
          }

          let list = data.content.result;
          let hits = [];

          for (let i = 0; i < list.length; i++) {
            hits.push({value: list[i].name})
          }

          if (hits.length === 0) {
            hits = []
          }
          cb(hits)
        });
      },
      handleQuery() {
        this.$router.push({path: '/search', query: {query: this.query}});
      }
    }
  }
</script>
<style lang="scss">
  html, body, #app {
    background-color: #efefef;
  }

  // 调整搜索框颜色
  .search-wrap {
    .el-input-group__append, .el-input-group__prepend {
      border: none;
      background-color: #3a8ee6;
    }

    .el-input__inner {
      border-radius: 0;
      border: 1px transparent solid;
    }

    .el-input__inner:hover{
      border: 1px transparent solid;
    }
  }
</style>
<style lang="scss" scoped>

  .wrap {
    position: relative;

    .sticker {
      position: sticky;
      position: -webkit-sticky;
      background-color: #fff;
      top: 0;
      height: 60px;
      z-index: 1000;
      margin-bottom: 30px;
    }

    .sticker-fixed {
      position: sticky;
      position: -webkit-sticky;
      background-color: #fff;
      top: 0;
      height: 60px;
      z-index: 1000;
      margin-bottom: 30px;
      border-bottom: 2px #3a8ee6 solid;
    }

    .stick-wrap {
      width: 1200px;
      margin: auto;
      padding: 10px;
      display: flex;
      flex-wrap: wrap;

      .logo-wrap {
        width: 220px;
        text-align: center;
      }

      .search-wrap {
        padding-left: 30px;

      }

      .search-bar {
        width: 550px;
        border: 2px #3a8ee6 solid;
        border-radius: 0;
        background-color: #3a8ee6;
      }

      .search-btn {
        color: #fff;
        border-radius: 0;
        background-color: #3a8ee6;
        border: 1px #3a8ee6 solid;
      }
    }
  }

  .content {
    position: relative;
    width: 70%;
    display: flex;
    margin: auto;
  }

  .el-main {
    display: block;
    padding: 0;
    flex: 1;
    margin-left: 20px;
  }

  .el-aside {
    width: 221px;
    text-align: center;
    overflow-x: hidden;

    .nav-warp {
      border-right: solid 1px #e6e6e6;
      background-color: #fff;
      border-radius: 4px;

      .avatar {
        width: 135px;
        height: 135px;
        margin: 20px auto;
      }

      .username {
        margin: auto auto 20px auto;
        font-weight: bold;
      }

      .tab {
        width: 220px;
        margin: 0 20px 0 0;
        text-align: center;
        border-left: transparent;
        border-right: transparent;
        border-radius: 4px;

        .el-menu-item {
          border-top: #efefef solid 1px;

        }
      }
    }

  }
</style>
