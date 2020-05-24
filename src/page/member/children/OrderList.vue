<template>
  <div class="wrap">
    <el-card body-style="padding: 0;" class="order-wrap" shadow="never">
      <div slot="header">
        订单信息
      </div>
      <div class="order-wrap-line">
        <div style="width: 350px">宝贝儿</div>
        <div style="width: 100px">单价</div>
        <div style="width: 100px">数量</div>
        <div style="width: 100px">实付款</div>
        <div style="width: 100px">订单操作</div>
        <div style="flex:1">商品状态</div>
      </div>

      <el-table :cell-style="getCellStyle"
                :data="order.items" :header-cell-style="getHeaderCellStyle"
                :key="key"
                :span-method="objectSpanMethod(order)"
                v-for="(order, key) in list">
        <el-table-column align="center" width="150">
          <template slot="header" slot-scope="scope">
            {{formatTime(order.created)}}
          </template>
          <template slot-scope="scope">
            <img v-lazy="scope.row.image" style="width: 80px;height: 80px;"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" show-overflow-tooltip width="200px">
          <template slot="header" slot-scope="scope">
            <span>
              订单号:&nbsp;&nbsp;{{order.id}}
            </span>
          </template>
          <template slot-scope="scope">
            <a :href="'/detail?id=' + scope.row.gid">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100px">
          <template slot-scope="scope">
            ¥ {{scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100px">
          <template slot-scope="scope">
            {{scope.row.num}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100px">
          <template slot-scope="scope">
            ¥ {{order.totalAmount}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="100px">
          <template slot-scope="scope">
            <el-button size="small" v-if="order.state === 'CONFIRM' && scope.row.rateId == null">去评价</el-button>
            <el-button @click="confirmOrder(order.id)" size="small" type="success"
                       v-if="order.state === 'PAID' && scope.row.expressId">确认收货
            </el-button>
            <div>
              <el-link
                @click="cancelOrder(order.id)"
                v-if="['CANCEL','CONFIRM'].indexOf(order.state) === -1 && !scope.row.expressId">取消订单
              </el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <div style="height:50px;">
              <el-button @click="payment(order.id)" size="small" type="success" v-if="order.state === 'CREATED'">待支付
              </el-button>
              <slot v-else-if="order.state === 'PAID' && !scope.row.expressId">待发货</slot>
              <slot v-else-if="order.state === 'PAID' && scope.row.expressId">
                待收货
              </slot>
              <slot v-else-if="order.state === 'CANCEL'">交易取消</slot>
              <slot v-else-if="order.state === 'CONFIRM'">交易完成</slot>
              <br/>
              <el-link :href="'orderDetail?id=' + order.id">查看详情</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      :page-size="page.size"
      :total="totalPages"
      @current-change="changePage"
      background
      class="el-pagination"
      layout="prev, pager, next"
      v-if="list.length !== 0">
    </el-pagination>
  </div>
</template>
<script>
  import {cancelOrder, confirmOrder, listOrder} from "../../../api/member";
  import {formatDate} from "element-ui/lib/utils/date-util";

  export default {
    data() {
      return {
        highlight: false,
        list: [],
        totalPages: 0,
        page: {
          start: 0,
          size: 5,
        }
      }
    },
    methods: {
      objectSpanMethod(order) {
        return ({row, column, rowIndex, columnIndex}) => {
          if (columnIndex >= 5) {
            return {
              rowspan: order.items.length,
              colspan: 1
            }
          }
        }
      },
      getHeaderCellStyle({row, column, rowIndex, columnIndex}) {
        return {
          "font-size": "12px",
          "line-height": 0,
          "padding": "5px 0 5px 0",
          "background-color": "#f4f4f4"
        };
      },
      getCellStyle() {
        return {
          "height": 80,
          "max-height": 80,
          "padding": "7px 0 0 0"
        };
      },
      payment(id) {
        this.$router.push({path: '/payment', query: {id: id}})
      },
      cancelOrder(id) {
        cancelOrder({id: id}).then(res => {
          let data = res.data;
          if (data.status) {
            window.location.href = '/member/orderList';
          } else {
            this.$message.error(data.message);
          }
        })
      },
      formatTime(stamp) {
        return formatDate(new Date(stamp), "yyyy-MM-dd hh:mm:ss")
      },
      confirmOrder(id) {
        confirmOrder({id: id}).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return;
          }
          this.$router.go(0);
        })
      },
      changePage(i) {
        this.page.start = (i - 1);
        window.scrollTo(0, 0);
        this.listOrder()
      },
      listOrder() {
        listOrder(this.page).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return;
          }
          let rs = data.content;
          this.list = rs.result;
          this.totalPages = rs.totalPages;

          this.list.sort((a, b) => {
            return b.created - a.created;
          })
        })
      }
    },
    created() {
      this.listOrder()
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    margin: auto;
    /*height: auto;*/
  }

  .order-wrap {
  }

  .el-pagination {
    text-align: center;
    margin: 20px;
  }

  .order-wrap-line {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    background-color: #fff;
    font-size: small;

    div {
      text-align: center;
      padding: 7px 0 7px 0;
    }
  }
</style>
