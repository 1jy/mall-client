<template>
  <div @scroll="handleScroll" class="wrap">
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
    <div class="content">
      <el-container class="container-wrap">
        <el-aside width="242px">
          <jjNav :data="navData" />
        </el-aside>
        <el-main v-if="!hasEmptyPanelList">
          <el-carousel :interval="interval" autoplay height="500px" trigger="click">
            <el-carousel-item :key="i" v-for="(item, i) in panelMap['CAROUSEL'][0].contents">
              <a :href="item.link ? item.link : '/detail?id=' + item.gid">
                <el-image :src="item.image" fit="cover" style="height:500px;"/>
              </a>
            </el-carousel-item>
          </el-carousel>
        </el-main>
      </el-container>
      <div :key="i" class="panel" v-for="(panel, i) in panelMap['CONTENT']">
        <div class="panel-title" slot="header">
          <span>{{panel.name}}</span>
        </div>
        <ul :key="k" class="panel-content" v-for="(arr, k) in panel.contents">
          <li :key="j" class="item-wrap" v-for="(item, j) in arr">
            <a :href="item.link ? item.link : '/detail?id=' + item.gid">
              <img v-lazy="item.image" class="item-image"/>
            </a>
            <div class="item-title">
              <a :href="item.link ? item.link : '/detail?id=' + item.gid">{{item.label}}</a>
            </div>
            <div class="item-price">￥<span>{{item.price}}</span></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {flat2Tree} from "../util";
  import {listCategory, listPanel, searchList} from "../api/goods";
  import jjNav from "../components/siderbar/SiderBar";
  import jjHeader from "../components/header/Header";

  export default {
    components: {jjNav, jjHeader},
    data() {
      return {
        query: '',
        panelMap: [{}],
        navData: [],
        hasEmptyPanelList: true,
        interval: 3000,
        isFixed: true
      };
    },
    methods: {
      handleScroll() {
        let offsetTop = document.querySelector('#sticker').offsetTop;
        // 如果小于等于头部高度
        this.isFixed = offsetTop <= 36;
      },
      handleSelect(key) {
        this.$router.push({path: '/search', query: {query: key.value}});
      },
      flat(data) {
        let rs = [], len = data.length;

        for (let i = 0; i < len; ++i) {
          let val = data[i];
          let key = val.type;
          let tmp = rs[key];
          if (tmp != null) {
            tmp.push(val)
          } else {
            rs[key] = [];
            rs[key].push(val)
          }
        }
        return rs
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
      },
      convert2arry(data) {
        // 分组
        let rs = [];
        for (let i = 0; i < data.length; i++) {
          let tmp = [];
          for (; data[i] != null; i++) {
            if (((i % 6) + 1) !== 6) {
              tmp.push(data[i]);
            } else {
              rs.push(tmp);
              tmp = [data[i]]
            }
          }

          rs.push(tmp);
        }
        return rs;
      },
    },
    created() {
      this.$notify({type: "error", title: "提示", message: "本站点为演示 DEMO, 站内所有商品为演示内容, \n如有不足之处请联系站长修改. 谢谢! \n(email: info#1jy.me)", duration: 5000});
      listCategory().then(res => {
        let data = res.data;
        if (!data.status) {
          this.$message.error(data.message);
          return
        }

        let list = data.content;
        this.navData = flat2Tree(list)
      });
      listPanel().then(res => {
        let data = res.data;
        if (!data.status) {
          this.$message.error(data.message);
          return
        }
        this.panelMap = this.flat(data.content);
        for (let k in this.panelMap['CONTENT']) {
          this.panelMap['CONTENT'][k].contents = this.convert2arry(this.panelMap['CONTENT'][k].contents);
        }
        this.hasEmptyPanelList = false
      })
    }
  }
</script>
<style lang="scss">
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
    width: 100vw;
    max-height: 100vh;
    overflow: auto;
    overflow-x: hidden;
    background-color: #efefef;

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

    .content {
      width: 1200px;
      margin: auto;

      .container-wrap {
        position: relative;
        margin: auto auto 30px;

        .el-main {
          width: 970px;
          padding: 0;
        }

        .el-aside {
          width: 220px;
        }

        .el-carousel__item h3 {
          color: #475669;
          font-size: 14px;
          opacity: 0.75;
          line-height: 150px;
          margin: 0;
        }

        .el-carousel__item:nth-child(2n) {
          background-color: #fff;
        }

        .el-carousel__item:nth-child(2n+1) {
          background-color: #fff;
        }

        .info {
          height: 500px;
          text-align: center;

          div {
            margin-bottom: 10px;
          }
        }
      }

      // 清除浮动影响
      .panel:after {
        content: ".";
        display: block;
        height: 0;
        visibility: hidden;
        clear: both;
      }

      .panel {
        margin: 0 0 30px;
        width: 1200px;
        min-height: 300px;
        border: none;

        .panel-title {
          font-size: medium;
          color: #ff242d;

          span::before {
            content: "";
            position: relative;
            float: left;
            top: 2px;
            width: 4px;
            height: 16px;
            background: #ff242d;
            background: linear-gradient(to bottom, #ff7436, #ff0000);
            margin-right: 7px;
          }
        }

        .panel-content {
          padding: 0;
          margin: 0;
          border: none;

          .item-wrap {
            float: left;
            height: 300px;
            list-style: none;
            width: 200px;
            border: 1px transparent solid;
            background-color: #fff;
            padding: 15px;
            margin: 5px;

            .item-image {
              width: 198px;
              height: 198px;
            }

            .item-price {
              color: orangered;
              font-size: small;
              margin-top: 35px;
              height: 30px;

              span {
                font-size: large;
              }
            }

            .item-title {
              height: 30px;
              font-size: medium;
              margin-top: 10px;
              margin-bottom: 2px;
            }
          }

          .item-wrap:first-child {
            margin-left: 0;
          }

          .item-wrap:last-child {
            margin-right: 0;
          }

          .item-wrap:hover {
            border: 1px #ff242d solid;
          }

        }
      }
    }
  }
</style>
