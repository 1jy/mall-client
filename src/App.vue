<template>
  <div id="app">
    <el-container>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>

  import Header from "./components/header/Header";
  import Footer from "./components/footer/Footer";

  export default {
    name: 'app',
    data() {
      return {
        whiteList: ['/login', '/register']
      }
    },
    components: {
      'jj-header': Header,
      'jj-footer': Footer
    }
  }
</script>
<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    text-decoration: none;
    list-style: none;
  }

  html, body, #app {
    width: 100vw;
    background-color: #fff;

    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

    .el-main {
      padding: 0;
      overflow: unset;
    }
  }

  a:hover, a:link, a:visited {
    color: #8c939d;
  }

  html {
    overflow-x: hidden;
  }
</style>
