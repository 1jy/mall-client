<template>
  <div class="wrap">
    <el-autocomplete style="width: 550px;" placeholder="输入关键字" v-model="page.query"
                     :fetch-suggestions="handleQuery">
      <el-button slot="append" icon="el-icon-search" />
    </el-autocomplete>
    <el-container class="wrap">
      <el-main style="padding:0;">
        <ul class="search-wrap">
          <li v-for="(item, i) in list" :key="i">
            <el-card body-style="padding: 0px;">
              <a :href="'/detail?id=' + item.id">
                <el-image :src="item.images[0]" />
              </a>
              <div>{{item.price}}</div>
              <el-link :href="'/detail?id=' + item.id">{{item.name}}</el-link>
            </el-card>
          </li>
        </ul>
        <el-pagination
          :page-size="page.size"
          :total="page.totalPages"
          @current-change="changePage"
          background
          class="el-pagination"
          layout="prev, pager, next">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import {searchList} from "../../api/goods";

  export default {
    name: "SearchList",
    data() {
      return {
        list: [],
        page: {
          query: '',
          start: 0,
          size: 100
        }
      }
    },
    methods: {
      changePage(i) {
        this.page.start = (i - 1);
        window.scrollTo(0, 0);
        this.searchList()
      },
      listResult(){
        searchList(this.page).then(res => {
          let data = res.data;
          if(data.code !== 1){
            this.$message.error(data.message);
            return;
          }
          this.list = data.content.result;
          this.page.totalPages = data.content.totalPages;
        });
      },
      handleQuery(queryString, cb) {
        let params = {
          query: queryString,
          start: 0,
          size: 100,
          totalPages: 0
        };
        searchList(params).then(res => {
          let data = res.data;
          if (data.code !== 1) {
            this.$message.error(data.message);
            return;
          }

          this.list = data.content.result;
          let hits = [];

          for (let i = 0; i < this.list.length; i++) {
            hits.push({value: this.list[i].name})
          }
          cb(hits)
        });
      }
    },
    created() {
      let query = this.$route.query.query;
      if (query != null) {
        this.page.query = query;
      }
      searchList(this.page).then(res => {
        let data = res.data;
        if (data.code !== 1) {
          this.$message.error(data.message);
          return;
        }
        this.list = data.content.result;
      });
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    width: 1200px;
    margin: auto;

    .search-wrap {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;

      li {
        list-style: none;
        float: left;
        width: 220px;
        margin-right: 10px;
        margin-bottom: 30px;

        .el-card {
          width: 220px;

          .el-image {
            width: 220px;
            height: 220px;
          }
        }
      }
    }
  }

</style>