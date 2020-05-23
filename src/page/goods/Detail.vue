<template>
  <div @scroll.passive="handleScroll" class="detail-wrap">
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
      <el-container class="product-info-wrap">
        <el-aside class="preview-wrap" width="450px">
          <div class="spec-image">
            <el-image :src="view" alt="" fit="cover" lazy="lazy"/>
          </div>
          <div class="spec-list">
            <jjCarousel :data="product.images" @hover="handelHover"/>
          </div>
        </el-aside>
        <el-main class="itemInfo-wrap">
          <div>
            <span class="itemInfo-name">{{product.name}}</span>
          </div>
          <div class="itemInfo-price">
            <el-row>
              <el-col :span="2" class="itemInfo-label">
                <span>价格</span>
              </el-col>
              <el-col :span="12" style="color: red">
                <span style="line-height: 12px;color: red;">￥<span style="font-size: x-large;">{{product.price}}</span></span>
              </el-col>
            </el-row>
          </div>
          <div class="itemInfo-num">
            <el-row>
              <el-col :span="2" class="itemInfo-label">
                <span style="line-height: 30px;">数量</span>
              </el-col>
              <el-col :span="4">
                <el-input-number :max="product.stork" :min="1" controls-position="right" size="small"
                                 style="width:100px;margin:0;" v-model="num"/>
              </el-col>
              <el-col :span="4" class="itemInfo-label">
                <span style="line-height: 30px;">库存{{product.stork}}件</span>
              </el-col>
            </el-row>
          </div>
          <div class="itemInfo-btn">
            <el-button @click="checkout" size="medium" type="success">立即购买</el-button>
            <el-button @click="addCart" size="medium" type="danger">加入购物车</el-button>
          </div>
        </el-main>
      </el-container>
      <el-tabs class="product-intro-wrap" type="border-card" v-model="activeName">
        <el-tab-pane label="产品介绍" name="first">
          <div class="product-intro" v-html="intro.content"></div>
        </el-tab-pane>
        <el-tab-pane label="用户评价" name="second">
          <el-table :data="rateList" class="user-rate-list">
            <el-table-column prop="created">
              <template slot-scope="scope">
                {{scope.row.created | formatTime}}
              </template>
            </el-table-column>
            <el-table-column prop="content"/>
            <el-table-column prop="owner"/>
            <el-table-column prop="star">
              <template slot-scope="scope">
                <el-rate disabled v-model="scope.row.star"/>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>
<script>
  import {addCart, checkout, listGoodsRate, productInfo, searchList} from "../../api/goods";
  import {mapGetters} from "vuex";
  import jjCarousel from "../../components/carousel/Carousel";
  import jjHeader from "../../components/header/Header";
  import {formatDate} from "element-ui/lib/utils/date-util";

  export default {
    name: 'detail',
    components: {jjCarousel, jjHeader},
    data() {
      return {
        isFixed: true,
        product: {
          images: [],
          id: '',
          name: '',
          price: '',
          stork: 0,
          intro: '',
        },
        rateList: [],
        page: {
          start: 0,
          size: 10,
          totalPages: 10
        },
        intro: '',
        num: 1,
        activeName: 'first',
        view: '',
        query: ''
      }
    },
    computed: {
      ...mapGetters({
        hasLogin: 'hasLogin',
        getCartList: 'getCartList'
      })
    },
    filters: {
      formatTime(stamp) {
        return formatDate(new Date(stamp), "yyyy-MM-dd hh:mm:ss")
      }
    },
    methods: {
      handleScroll() {
        let offsetTop = document.querySelector('#sticker').offsetTop;
        // 如果小于等于头部高度
        this.isFixed = offsetTop <= 66;
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
      checkout() {
        if (!this.hasLogin) {
          this.$router.push({path: '/login'})
        }

        let items = {
          gid: this.product.id,
          num: this.num,
          price: this.product.price,
          image: this.product.images != null ? this.product.images[0] : '',
          name: this.product.name
        };
        this.$store.commit('checkout', [items]);
        this.$router.push({path: "/checkout"})
      },
      addCart() {
        // 未登录状态下本地购物车不能超过指定个数, 否则跳转登录
        let params = {gid: this.product.id, num: this.num};

        if (!this.hasLogin && Object.keys(this.getCartList).length > 1) {
          this.$store.commit('addCart', params);
          this.$message.error("亲,请先登录呢!");
          this.$router.push({path: '/login'});
          return
        }

        if (this.hasLogin) {
          addCart(params).then(res => {
            let data = res.data;
            if (!data.status) {
              this.$message.error(data.message);
              return;
            }
            this.$message.success("添加成功")
          })
        } else {
          this.$store.commit('addCart', params);
          this.$message.success("添加成功")
        }
      },
      getProductInfo(id) {
        productInfo({id: id}).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            this.$router.push({path: '/'});
          } else {
            let rs = data.content;
            this.product = rs.product;
            this.view = this.product.images[0];
            this.intro = rs['productIntro']
          }
        })
      },
      listGoodsRate(id) {
        listGoodsRate({gid: id, start: this.page.start, size: this.page.size}).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
          }

          this.rateList = data.content.result;
          this.page.start = data.content.start;
          this.page.size = data.content.size;
          this.page.totalPages = data.content.totalPages;
        })
      },
      handelHover(i) {
        this.view = this.product.images[i];
      }
    },
    created() {
      let id = this.$route.query.id;
      this.getProductInfo(id);
      this.listGoodsRate(id);
    }
  }
</script>
<style lang="scss">
  .product-intro-wrap {
    margin: auto;
    box-shadow: none;
    padding: 0;

    .el-tabs__content {
      padding: 0 !important;
    }

    figure {
      padding: 0;
      margin: 0;
    }

    img {
      width: 1200px;
      display: block;
    }

    .product-intro {
      padding: 0;
      margin: 0;
    }
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
  .detail-wrap {
    width: 100vw;
    max-height: 100vh;
    overflow: auto;
    overflow-x: hidden;
    background-color: #fff;
  }

  .sticker {
    position: sticky;
    position: -webkit-sticky;
    background-color: #fff;
    top: 0;
    height: 60px;
    z-index: 1000;
    margin: 20px auto 20px auto;
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
    margin: auto auto 30px auto;
  }

  .product-info-wrap {
    border: solid #e5e6e6 1px;
    padding: 20px;
    margin-bottom: 30px;

    .preview-wrap {
      overflow-x: hidden;

      .spec-image {
        .el-image {
          width: 460px;
          height: 460px;
        }
      }

      .spec-list {
        .el-carousel__item {
          width: 100px;
        }

        .el-image {
          width: 100px;
          height: 100px;
        }
      }
    }

    .itemInfo-wrap {
      margin: 0 0 0 20px;
      padding: 0;

      div {
        margin-bottom: 20px;
      }

      .itemInfo-name {
        font: 700 16px Arial, "microsoft yahei";
        margin: 0;
      }

      .itemInfo-price {
        background-image: linear-gradient(to right, #e6e9f0 0%, #eef1f5 100%);
        padding: 15px;

        .el-row {
          margin: 0;
        }

        .el-col {
          margin: 0;
        }
      }

      .itemInfo-label {
        font-size: small;
      }
    }

    .itemInfo-num {
      padding: 10px;

      .el-row {
        margin: 0;
      }

      .el-col {
        margin: 0;

      }
    }
  }

  .product-intro-wrap {
    margin: auto;
    padding: 0;
    box-shadow: none;

    figure {
      padding: 0;
      margin: 0;
    }

    img {
      width: 1200px;
      display: block;
    }

    .product-intro {
      padding: 0;
      margin: 0;
    }
  }
</style>


