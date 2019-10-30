<template>
  <el-container class="container">
    <el-aside>
      <el-menu class="tab" default-active="0" router>
        <el-menu-item :index="tab.path" :key="i" v-for="(tab, i) in tabs">
          <span slot="title">{{tab.name}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="el-main-style">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
    export default {
        data() {
            return {
                tabs: [
                    {name: '个人资料', path: '/member/userInfo'},
                    {name: '订单管理', path: '/member/orderList'},
                    {name: '收货地址', path: '/member/addressList'},
                ],
            }
        }
    }
</script>

<style lang="scss" scoped>
  .container {
    margin: auto;
    padding: 0;
    width: 1200px;
  }

  .tab {
    width: 250px;
    margin: 0 20px 0 0;
    text-align: center;
  }

  .el-main-style {
    min-height: 700px;
    padding: 0;
  }
</style>
