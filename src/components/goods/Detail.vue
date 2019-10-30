<template>
  <div class="wrap">
    <el-container class="product-info-wrap">
      <el-aside class="preview-wrap" width="450px">
        <div class="spec-image">
          <el-image :src="view" fit="cover" lazy="lazy" alt=""/>
        </div>
        <div class="spec-list">
          <jjcarousel @hover="handelHover" :data="product.images"/>
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
              <el-input-number style="width:100px;margin:0;" v-model="num" controls-position="right" :min="1" :max="product.stork" size="small" />
            </el-col>
            <el-col :span="4" class="itemInfo-label">
              <span style="line-height: 30px;">库存{{product.stork}}件</span>
            </el-col>
          </el-row>
        </div>
        <div class="itemInfo-btn">
          <el-button @click="checkout" type="success" size="medium">立即购买</el-button>
          <el-button @click="addCart" type="danger" size="medium" >加入购物车</el-button>
        </div>
      </el-main>
    </el-container>

    <el-tabs class="product-intro-wrap" type="border-card" v-model="activeName">
      <el-tab-pane label="产品介绍" name="first" v-html="intro.content"></el-tab-pane>
      <el-tab-pane label="用户评价" name="second">
        <el-table :data="rateList">
          <el-table-column prop="created">
            <template slot-scope="scope">
              {{scope.row.created | formatTime}}
            </template>
          </el-table-column>
          <el-table-column prop="content"/>
          <el-table-column prop="owner"/>
          <el-table-column prop="star">
            <template slot-scope="scope">
              <el-rate v-model="scope.row.star" disabled/>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import {addCart, checkout, listGoodsRate, productInfo} from "../../api/goods";
  import {mapGetters} from "vuex";
  import Carousel from "../common/Carousel";
  import {formatDate} from "element-ui/lib/utils/date-util";

  export default {
    name: 'detail',
    components: {jjcarousel: Carousel},
    data() {
      return {
        product: {
          images: [],
          id: '',
          name: '',
          price: '',
          stork: '',
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
        view: ''
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
      switchPic(url) {
        this.view = url
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
            if (data.code === 1) {
              this.$message.success("添加成功")
            } else {
              this.$message.error("添加失败")
            }
          })
        } else {
          this.$store.commit('addCart', params);
          this.$message.success("添加成功")
        }
      },
      getProductInfo(id) {
        productInfo({id: id}).then(res => {
          let data = res.data;
          if (data.code === 1) {
            let rs = data.content;
            this.product = rs.product;
            this.view = this.product.images[0];
            this.intro = rs['productIntro']
          } else {
            this.$router.push({path: '/'})
          }
        })
      },
      listGoodsRate(id) {
        listGoodsRate({gid: id, start: this.page.start, size: this.page.size}).then(res => {
          let data = res.data;
          if (data.code !== 1) {
            this.$message.error("获取商品评价列表失败");
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

<style lang="scss" scoped>
  .wrap {
    width: 1200px;
    margin: auto;
  }
  .product-info-wrap {
    border: solid #e5e6e6 1px;
    padding: 20px;

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
        font: 700 16px Arial,"microsoft yahei";
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
      padding : 10px;

      .el-row {
        margin: 0;
      }

      .el-col {
        margin: 0;

      }
    }
  }

  .product-intro-wrap {
    margin: 20px auto auto;
    box-shadow: none;
  }
</style>
