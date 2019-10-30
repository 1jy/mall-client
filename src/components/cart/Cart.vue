<template>
  <mescroll-vue :up="mescrollUp" ref="mescroll">
    <el-card class="cart" v-loading="loading">
      <div slot="header">
        <span style="font-size: large">购物清单</span>
      </div>

      <el-checkbox-group v-if="!loading && list.length !== 0" v-model="index">
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
          <el-table-column>
            <template slot-scope="scope">
              <el-link :href="'/detail?id=' + scope.row.gid">{{scope.row.name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品单价">
            <template slot-scope="scope">
              <span style="color:red;">¥<b>{{scope.row.price}}</b></span>
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

      <div style="float:right;margin:20px;display: block;" v-if="list.length !== 0">
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
      <h1 v-if="isEmpty">毛都没有!... -_>-</h1>
    </el-card>
    <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
  </mescroll-vue>

</template>

<script>
    import MescrollVue from 'mescroll.js/mescroll.vue'
    import {delCart, listCart, updateCart} from "../../api/member";
    import {checkout} from "../../api/goods";

    export default {
        name: "Cart",
        components: {
            MescrollVue
        },
        data() {
            return {
                list: [],
                index: [],
                loading: false,
                isSelectAll: false,
                isEmpty: false,
                totalPages: 0,
                mescrollUp: { // 上拉加载的配置.
                    callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                    //以下是一些常用的配置,当然不写也可以的.
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 10 //每页数据条数,默认10
                    },
                    htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
                    noMoreSize: 0, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
                    empty: {
                        //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                        warpId: "xxid", //父布局的id (1.3.5版本支持传入dom元素)
                        icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
                        tip: "暂无相关数据~" //提示
                    }
                }
            }
        },
        computed: {
            calTotalAmount() {
                let total = 0
                for (let i = 0; i < this.index.length; i++) {
                    total += this.list[i].num * this.list[i].price
                }
                return total
            },
            countItem() {
                let total = 0
                for (let i = 0; i < this.index.length; i++) {
                    total += this.list[i].num
                }
                return total
            }
        },
        methods: {
            updateCart(i, num) {
                this.list[i].num += num
                let params = {
                    id: this.list[i].id,
                    num: this.list[i].num + num
                }

                if (params.num > 0 && params.num < this.list[i].stork) {
                    updateCart(params).then(res => {
                        let data = res.data
                        if (data.code !== 1) {
                            this.$message.error("更新失败")
                            return
                        }
                    })
                }
            },
            delCart() {
                let ids = this._index2Id()

                delCart(ids).then(res => {
                    let data = res.data
                    if (data.code !== 1) {
                        this.$message.success("移除购物车失败")
                        return
                    }

                    for (let i in ids) {
                        for (let j in this.list) {
                            if (this.list[j].id === ids[i]) {
                                this.list.splice(j, 1)
                            }
                        }
                    }
                })

                this.isEmpty = this.list.length === 0
            },
            checkout() {
                this.$store.commit('checkout', this.list)
                this.$router.push({path: '/checkout'})
            },
            selectAll() {
                this.isSelectAll = !this.isSelectAll
                this.index = this.isSelectAll ? Array.apply(null, {length: this.list.length}).map((item, index) => index) : []
            },
            _index2Id() {
                let ids = []

                this.index.forEach(value => {
                    ids.push(this.list[value].id)
                })

                return ids
            },
            upCallback(page, mescroll) {
                // 如果大于总条数就不执行
                if (this.totalPages !== 0 && this.totalPages === this.list.length) {
                    mescroll.endSuccess(this.list.length)
                    return
                }
                listCart({
                    start: page.num - 1,
                    size: page.size
                }).then(res => {
                    let rs = res.data
                    console.log(rs)
                    if (rs.code !== 1) {
                        mescroll.endErr()
                        return
                    }
                    this.list = this.list.concat(rs.content.result)
                    this.totalPages = rs.content.totalPages
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

<style scoped>
  .cart {
    width: 1000px;
    margin: auto;
    height: 100%;
  }

  .mescroll {
    position: absolute;
    top: 0;
    padding-top: 100px;
    bottom: 0;
    height: auto;
  }
</style>
