<template>
  <div class="wrap">
    <div class="search-wrap">
      <el-autocomplete class="search-bar" max="50"
                       placeholder="输入关键字"
                       v-model="query"
                       :trigger-on-focus="false"
                       :hide-loading="true"
                       @select="handleSelect"
                       :fetch-suggestions="fetchSuggests">
        <el-button class="search-btn" icon="el-icon-search" slot="append" @click="handleQuery"/>
      </el-autocomplete>
    </div>
    <el-container class="container-wrap">
      <el-aside width="240px">
        <jjNav :data="navData"/>
      </el-aside>
      <el-main v-if="!hasEmptyPanelList">
        <el-carousel height="500px" trigger="click" autoplay :interval="interval">
          <el-carousel-item :key="i" v-for="(item, i) in panelMap['CAROUSEL'][0].contents">
            <el-link :href="item.link ? item.link : '/detail?id=' + item.gid">
              <el-image fit="cover" :src="item.image"/>
            </el-link>
          </el-carousel-item>
        </el-carousel>
      </el-main>
    </el-container>

    <div class="lazy" v-for="(item, i) in panelMap['CONTENT']" :key="i">
      <div class="item-title">🔥{{item.name}}</div>
      <div class="item-content">
        <el-card body-style="padding:0;" v-for="(content, j) in item.contents" :key="j">
          <a :href="content.link ? content.link : '/detail?id=' + content.gid">
            <el-image class="card-image" lazy :src="content.image" fit="cover"/>
          </a>
          <div class="item-label">
            <el-link :href="content.link ? content.link : '/detail?id=' + content.gid">{{content.label}}</el-link>
          </div>
          <div class="item-price"><span style="color:red;">￥<b>{{content.price}}</b></span></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  import {flat2Tree} from "../util";
  import {listCategory, listPanel, searchList} from "../api/goods";
  import jjNav from "./common/Siderbar";

  export default {
    components: {jjNav},
    data() {
      return {
        query: '',
        panelMap: [],
        navData: [],
        hasEmptyPanelList: true,
        interval: 3000
      };
    },
    methods: {
      handleSelect(key) {
        this.$router.push({path: '/search', query: {query: key}});
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
          if (data.code !== 1) {
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
    },
    created() {
      listCategory().then(res => {
        let data = res.data;
        if (data.code !== 1) {
          this.$message.error("获取分类目录失败");
          return
        }

        let list = data.content;
        this.navData = flat2Tree(list)
      });
      listPanel().then(res => {
        let data = res.data;
        if (data.code !== 1) {
          this.$message.error("获取模板列表失败");
          return
        }
        this.panelMap = this.flat(data.content);
        this.hasEmptyPanelList = false
      })
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    width: 1200px;
    margin: auto;

    .search-wrap {
      margin-bottom: 20px;

      .search-bar {
        width: 550px;
      }

      .search-btn {

      }
    }

    .container-wrap {
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
        background-color: #99a9bf;
      }

      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
      }

      .info {
        height: 500px;
        text-align: center;

        div {
          margin-bottom: 10px;
        }
      }
    }

    .lazy {
      width: 1200px;
      margin: auto;
    }

    .item-title {
      margin-bottom: 10px;
    }

    .item-content {
      display: flex;
      padding: 0;
      margin: 0;

      .el-card {
        width: 240px;
        margin-right: 10px;

        .card-image {
          width: 200px;
          height: 200px;
          padding: 15px;
        }
      }

      .item-price {
        padding: 15px;
      }

      .item-label {
        padding: 5px 15px;
      }

      .el-card:last-child {
        margin-right: 0;
      }
    }
  }
</style>
