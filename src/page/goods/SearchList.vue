<template>
  <div class="search-wrap">
    <jjHeader/>
    <div class="sticker">
      <div class="stick-wrap">
        <el-autocomplete :fetch-suggestions="fetchSuggests" :hide-loading="true"
                         :trigger-on-focus="false"
                         @select="handleSelect"
                         class="search-bar"
                         max="50"
                         placeholder="搜索商品"
                         v-model="form.query">
          <el-button @click="handleQuery" class="search-btn" icon="el-icon-search" slot="append"/>
        </el-autocomplete>
      </div>
    </div>

    <div class="content">
      <div class="grid-wrap">
        <ul :key="i" class="gird-line" v-for="(arr, i) in page.result">
          <li :key="k" class="item-wrap" v-for="(item, k) in arr">
            <a :href="'/detail?id=' + item.id">
              <el-image :src="item.images[0]" class="item-image"/>
            </a>
            <div class="item-price">￥<span>{{item.price}}</span></div>
            <div class="item-title">
              <a :href="'/detail?id=' + item.id">{{item.name}}</a>
            </div>
          </li>
        </ul>
        <div id="empty-result" v-show="page.totalPages === 0">
          啥都都没搜到
        </div>
      </div>
      <el-pagination
        :page-size="page.size"
        :total="page.totalPages"
        @current-change="changePage"
        background
        align="center"
        class="el-pagination"
        layout="prev, pager, next">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {searchList} from "../../api/goods";
  import jjHeader from "../../components/header/Header"

  export default {
    components: {jjHeader},
    name: "SearchList",
    data() {
      return {
        form: {
          query: '',
          start: 0,
          size: 20
        },
        page: {
          start: 0,
          size: 0,
          totalPages: 0,
          result: []
        }
      }
    },
    methods: {
      handleSelect(key) {
        window.location.href = '/search?query=' + key.value;
      },
      changePage(i) {
        this.form.start = (i - 1);
        this.search(this.form);
        window.scrollTo(0, 0);
      },
      listResult() {
        this.search(this.form);
      },
      handleQuery() {
        window.location.href = '/search?query=' + this.form.query;
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
      search(param) {
        searchList(param).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return;
          }
          this.page = data.content;
          this.page.result = this.convert2arry(this.page.result);
        });
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
      }
    },
    created() {
      this.form.query = this.$route.query.query;
      this.search(this.form);
    }
  }
</script>
<style lang="scss">
  html, body, #app {
    background-color: #efefef;
  }
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
</style>
<style lang="scss" scoped>
  .search-wrap {
    width: 100vw;
    max-height: 100vh;
    overflow: auto;
    overflow-x: hidden;

    .content {
      width: 1200px;
      margin: auto;
    }

    .sticker {
      position: sticky;
      position: -webkit-sticky;
      background-color: #fff;
      top: 0;
      height: 60px;
      z-index: 1000;
      margin-bottom: 30px;
      clear: both;

      .stick-wrap {
        width: 1200px;
        margin: auto;
        padding: 10px;

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

    .grid-wrap {
      margin-bottom: 30px;

      .gird-line {
        width: 1200px;
        margin: 0 0 30px;
        padding: 0;
        list-style: none;
        border: none;

        .item-wrap {
          height: 300px;
          width: 200px;
          margin: 5px;
          padding: 15px;
          float: left;
          border: 1px transparent solid;
          background-color: #fff;
          position: relative;

          .item-image {
            width: 198px;
            height: 198px;
          }

          .item-price {
            color: orangered;
            font-size: small;
            height: 30px;
            padding: 5px;

            span {
              font-size: large;
            }
          }

          .item-title {
            height: 50px;
            line-height: 25px;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .item-title:after {
            width: 100px;
            content: '...';
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

      .gird-line:after {
        content: ".";
        display: block;
        height: 0;
        visibility: hidden;
        clear: both;
      }
    }
  }

</style>
