<template>
  <div id="app">
    <el-container>
      <el-header class="header-style" v-if="this.whiteList.indexOf(this.$route.path) === -1">
        <v-header/>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer v-if="this.whiteList.indexOf(this.$route.path) === -1">
        <v-footer/>
      </el-footer>
    </el-container>
  </div>
</template>

<script>

    import Header from "./components/common/Header";
    import Footer from "./components/common/Footer";

    export default {
        name: 'app',
        data() {
            return {
                whiteList: ['/login', '/logout', '/register']
            }
        },
        components: {
            'v-header': Header,
            'v-footer': Footer
        }
    }
</script>

<style lang="scss">
  html, body, #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;

    .header-style {
      padding: 0;
      margin: 0;
    }

    .el-main {
      overflow-x: hidden;
    }
  }

  html {
    overflow-y: scroll;
  }
</style>
