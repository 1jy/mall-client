<template>
  <div :width="width" class="navlist">
    <ul class="menu">
      <li v-for="(node0, node0Index) in data" v-if="node0Index < 15">
        <!-- 0 级节点  -->
        <div class="title">
          <!-- 1 级节点  -->
          <span>
            <!-- 只显示前3个节点, 作为标题 -->
            <slot v-for="(node1, node1Index) in node0.children" v-if="node1Index <= 2">
              <a :href="'/search?query=' + node1.label">{{node1.label}}</a>
              <span class="label" v-if="node1Index < 2 && node1Index !== (node0.children.length - 1)"> / </span>
            </slot>
          </span>
        </div>

        <div class="submenu">
          <!-- 1 级节点  -->
          <div class="item" v-for="(node1, node1Index) in node0.children">
            <div class="title">
              <a :href="'/search?query=' + node1.label"><b>{{node1.label}} <i class="el-icon-arrow-right"></i></b></a>
              <!-- 2 级节点  -->
              <span>
              <slot v-for="(node2, node2Index) in node1.children">
                <a :href="'/search?query=' + node2.label">{{node2.label}}</a>&nbsp;
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

  a {
    text-decoration: none;
  }

  a:hover, a:link, a:visited {
    color: #8c939d;
  }

  * {
    font-size: 15px;
    font-weight: 800;
  }

  .navlist {
    position: absolute;

    .menu {
      list-style: none;
      background-color: $menu_bg_color;
      padding: 0;
      height: 500px;
      margin: 0;

      li {
        display: flex;
        width: 232px;
        height: 35px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
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
        box-shadow: darkgrey 0 0 0 0;
        width: 970px;
        height: 500px;
        top: 0;
        left: 230px;
        z-index: 500;
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