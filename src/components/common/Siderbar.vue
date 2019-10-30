<template>
  <div :width="width" class="navlist">
    <ul class="menu">
      <li v-for="(node0, nodex0Index) in data">
        <!-- 0 级节点  -->
        <div class="title">
          <!-- 1 级节点  -->
          <span>
            <!-- 只显示前3个节点, 作为标题 -->
            <slot v-for="(node1, node1Index) in node0.children" v-if="node1Index <= 2">
              <el-link :href="'/search?query=' + node1.label">{{node1.label}}</el-link>
              <slot v-if="node1Index !== 2">/&nbsp;</slot>
            </slot>
          </span>
        </div>

        <div class="submenu">
          <!-- 1 级节点  -->
          <div class="item" v-for="(node1, node1Index) in node0.children">
            <div class="title">
              <el-link :href="'/search?query=' + node1.label"><b>{{node1.label}} <i class="el-icon-arrow-right"></i></b></el-link>
              <!-- 2 级节点  -->
              <span>
              <slot v-for="(node2, node2Index) in node1.children">
                <el-link :href="'/search?query=' + node2.label">{{node2.label}}</el-link>&nbsp;
              </slot>
            </span>
            </div>
          </div>
        </div>
      </li>
    </ul>


  </div>
</template>

<script>
    export default {
        name: "NavBar",
        props: ["width", "data"]
    }
</script>

<style lang="scss" scoped>
  $menu_bg_color: white;
  $submenu_bg_color: white;

  * {
    font-size: small;
  }

  .navlist {
    display: flex;
    position: absolute;

    .menu {
      list-style: none;
      background-color: $menu_bg_color;
      padding: 0;
      height: 500px;
      margin: 0;

      li {
        width: 230px;
        display: flex;
        flex-wrap: wrap;
      }

      li:hover {
        .submenu {
          display: block;
        }
      }

      .title {
        padding-top: 10px;
        padding-left: 10px;
      }

      .submenu {
        position: absolute;
        box-shadow: darkgrey 0 0 0 0 ;
        width: 980px;
        height: 500px;
        top: 0;
        left: 220px;
        z-index: 10000;
        display: none;
        background: {
          color: $submenu_bg_color;
        }

        .item {
          width: 100%;
        }
      }
    }
  }
</style>