<template>
  <div class="v-header">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      mode="horizontal"
      router
      text-color="#fff">

      <el-menu-item index="/cart" style="float:right">购物车</el-menu-item>
      <el-submenu index="/member" style="float:right">
        <template slot="title"><i class="el-icon-user"></i></template>
        <el-menu-item index="/member/orderList">订单</el-menu-item>
        <el-menu-item index="/member/addressList">收货地址</el-menu-item>
        <el-menu-item @click="logout" v-if="hasLogin">退出</el-menu-item>
      </el-submenu>
    </el-menu>

  </div>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    computed: {
      hasLogin() {
        return this.$store.getters.hasLogin
      }
    },
    methods: {
      logout() {
        this.$store.commit('logout');
        this.$router.push({path: '/', redirect: "/"})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .v-header {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;

    .el-menu {
      padding-right: 50px;
    }
  }
</style>
