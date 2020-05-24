<template>
  <div class="wrap">
    <mescroll-vue :up="mescroUp()" @init="mescrollInit" ref="mescroll">
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
      <el-card :style="'min-height:' + !loading && list.length === 0 ? '600px' : 0" class="cart" id="cart"
               shadow="never" v-loading="loading">
        <div slot="header">
          <span style="font-size: large">购物清单</span>
        </div>
        <div id="content">
          <transition name="el-fade-in-linear">
            <div id="empty-cart" v-show="!loading && list.length === 0"></div>
          </transition>
          <el-checkbox-group v-if="!loading && list.length !== 0" v-model="selectedIdx">
            <el-table :data="list">
              <el-table-column width="30">
                <template slot-scope="scope">
                  <el-checkbox :label="scope.$index">&nbsp;</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品信息" width="120">
                <template slot-scope="scope">
                  <el-image :src="scope.row.image" fit="cover" style="width:100px;height:100px;"/>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip>
                <template slot-scope="scope">
                  <a :href="'/detail?id=' + scope.row.gid">{{scope.row.name}}</a>
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品单价">
                <template slot-scope="scope">
                  ¥<b>{{scope.row.price}}</b>
                </template>
              </el-table-column>
              <el-table-column align="center" label="数量">
                <template slot-scope="scope">
                  <el-button @click="updateCart(scope.$index, 1)" circle icon="el-icon-plus" size="mini"></el-button>
                  <span style="padding: auto 5px auto 5px;">{{scope.row.num}}</span>
                  <el-button @click="updateCart(scope.$index, -1)" circle icon="el-icon-minus" size="mini"></el-button>
                </template>
              </el-table-column>
              <el-table-column align="center" label="小计">
                <template slot-scope="scope">
                  <span style="color:red;">¥<b>{{scope.row.num * scope.row.price}}</b></span>
                </template>
              </el-table-column>
            </el-table>
          </el-checkbox-group>
          <div class="opeator-wrap" v-if="!loading && list.length !== 0">
            <div style="text-align: right">
              <p>共计 {{countItem}} 件商品</p>
              <p>应付总额: <span style="color: red;">¥ <b style="font-size: large">{{calTotalAmount}}</b></span></p>
            </div>
            <div>
              <el-button @click="selectAll">全选/反选</el-button>
              <el-button @click="delCart" type="danger">移除</el-button>
              <el-button @click="checkout" type="success">结算</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </mescroll-vue>
  </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {delCart, listCart, updateCart} from "../../api/member";
  import {checkout, searchList} from "../../api/goods";
  import jjNav from "../../components/siderbar/SiderBar";
  import jjHeader from "../../components/header/Header";

  export default {
    name: "Cart",
    components: {
      MescrollVue, jjNav, jjHeader
    },
    data() {
      return {
        isFixed: true,
        list: [],
        selectedIdx: [],
        loading: true,
        isSelectAll: false,
        isEmpty: false,
        totalPages: 0,
        query: ''
      }
    },
    computed: {
      calTotalAmount() {
        let total = 0;
        for (let i = 0; i < this.selectedIdx.length; i++) {
          total += this.list[i].num * this.list[i].price
        }
        return total
      },
      countItem() {
        let total = 0;
        for (let i = 0; i < this.selectedIdx.length; i++) {
          total += this.list[i].num
        }
        return total
      }
    },
    methods: {
      mescroUp() {
        return { // 上拉加载的配置.
          callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
          //以下是一些常用的配置,当然不写也可以的.
          page: {
            num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 10 //每页数据条数,默认10
          },
          onScroll: this.onScroll,
          htmlNodata: '<p class="upwarp-nodata">-- 没了,别拉了 --</p>',
          noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
          empty: {
            //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: "empty-cart", //父布局的id (1.3.5版本支持传入dom元素)
            icon: './static/cart-empty.png', //图标,默认null,支持网络图
            tip: "你的购物车空空如也.." //提示
          },
          toTop: {
            //回到顶部按钮
            src: "./static/mescroll/mescroll-totop.png", //图片路径,默认null,支持网络图
            offset: 1000, //列表滚动1000px才显示回到顶部按钮
          },
        }
      },
      onScroll(obj, top) {
        this.isFixed = top <= 36;
      },
      mescrollInit(mescroll) {
        this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      },
      handleScroll() {
        let offsetTop = document.querySelector('#sticker').offsetTop;
        // 如果小于等于头部高度
        this.isFixed = offsetTop <= 36;
      },
      handleSelect(key) {
        this.$router.push({path: '/search', query: {query: key.value}});
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
      updateCart(i, num) {
        this.list[i].num += num;
        let params = {
          id: this.list[i].id,
          num: this.list[i].num + num
        };

        if (params.num > 0 && params.num < this.list[i].stork) {
          updateCart(params).then(res => {
            let data = res.data;
            if (!data.status) {
              this.$message.error(data.message);
            }
          })
        }
      },
      delCart() {
        let ids = this._index2Id();

        delCart(ids).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.success(data.message);
            return
          }

          for (let i in ids) {
            for (let j in this.list) {
              if (this.list[j].id === ids[i]) {
                this.list.splice(j, 1)
              }
            }
          }
        });

        this.isEmpty = this.list.length === 0
      },
      checkout() {
        let items = [];
        for (let i in this.selectedIdx) {
          let idx = this.selectedIdx[i];
          items.push(this.list[idx]);
        }
        this.$store.commit('checkout', items);
        this.$router.push({path: '/checkout'})
      },
      selectAll() {
        this.isSelectAll = !this.isSelectAll;
        this.selectedIdx = this.isSelectAll ? Array.apply(null, {length: this.list.length}).map((item, index) => index) : []
      },
      _index2Id() {
        let ids = [];

        this.selectedIdx.forEach(value => {
          ids.push(this.list[value].id)
        });

        return ids
      },
      upCallback(page, mescroll) {
        // 如果大于总条数就不执行
        if (this.totalPages !== 0 && this.totalPages === this.list.length) {
          mescroll.endSuccess(this.list.length);
          return
        }
        listCart({
          start: page.num - 1,
          size: page.size
        }).then(res => {
          let rs = res.data;
          if (rs.code !== 1) {
            mescroll.endErr();
            return
          }
          this.loading = false;
          this.list = this.list.concat(rs.content.result);
          this.totalPages = rs.content.totalPages;
          this.$nextTick(() => {
            mescroll.endSuccess(this.list.length)
          })
        }).catch(e => {
          mescroll.endErr()
        })
      }
    }
  }
</script>
<style lang="scss">
  html, body, #app {
    background-color: #efefef;
  }

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
    max-height: 100vh;
    width: 100vw;

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

    .mescroll {
      position: absolute;
      top: 0;
      overflow: auto;
      overflow-x: hidden;

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
          }

          .search-btn {

          }
        }
      }

      .cart {
        width: 1200px;
        margin: auto;
      }

      #empty-cart {
        width: 350px;
        height: 350px;
        padding-top: 50px;
        margin: 0 auto;
        display: block;
      }

      .opeator-wrap {
        float: right;
        margin: 20px;
        display: block;
      }
    }

  }


</style>
