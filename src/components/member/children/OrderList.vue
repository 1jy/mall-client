<template>
  <div>
    <el-card :key="i" style="margin-bottom: 20px;" v-for="(order, i) in list" body-style="padding: 0px;">
      <div style="padding:15px 0 15px 15px;border-bottom: #EBEEF5 solid 1px;">
        <span style="margin-right: 15px;">{{formatTime(order.created)}}</span>
        <span>
          订单号:&nbsp;&nbsp;<el-link :href="'orderDetail?id=' + order.id" style="color: grey;">{{order.id}}</el-link>
        </span>
        <span style="float:right;margin-right:20px;">
          <el-link :href="'orderDetail?id=' + order.id" style="color: grey;">查看详情</el-link>
        </span>
      </div>

      <el-table :data="order.items" :span-method="objectSpanMethod">
        <el-table-column align="center" prop="image">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" fit="cover" lazy style="width: 80px;height: 80px;"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="name">
          <template slot-scope="scope">
            <el-link :href="'/detail?id=' + scope.row.gid">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单价" prop="price"></el-table-column>
        <el-table-column align="center" label="数量" prop="num"></el-table-column>
        <el-table-column align="center" label="小计" prop="total">
          <template slot-scope="scope">
            ¥ {{scope.row.total}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单操作">
          <template slot-scope="scope">
            <el-button v-if="order.state === 'CONFIRM' && scope.row['rateId'] == null" size="small">去评价</el-button>
            <el-button v-if="order.state === 'PAID' && order.expressId" type="success" size="small" @click="confirmOrder(order.id)">确认收货</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单状态">
          <template slot-scope="scope">
            <el-button type="success" v-if="order.state === 'CREATED'" @click="payment(order.id)" size="small">待支付
            </el-button>
            <slot v-else-if="order.state === 'PAID' && !order.expressId">待发货</slot>
            <slot v-else-if="order.state === 'PAID' && order.expressId">
              待收货
            </slot>
            <slot v-else-if="order.state === 'CANCEL'">交易取消</slot>
            <slot v-else-if="order.state === 'CONFIRM'">交易完成</slot>
            <div>
              <el-link
                v-if="['CANCEL','CONFIRM'].indexOf(order.state) === -1 && !order['expressId']"
                @click="cancelOrder(order.id)">取消订单
              </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding: 20px;" v-if="order['expressId']">快递单号: {{order['expressId']}}</div>
      <div style="padding: 15px;float:right">实付金额: ¥ <b style="color: red;font-size: large">{{order.totalAmount}}</b>
      </div>
    </el-card>

    <el-pagination
      :page-size="page.size"
      :total="totalPages"
      @current-change="changePage"
      background
      class="el-pagination"
      layout="prev, pager, next">
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
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 6) {
          return {
            rowspan: this.list.length,
            colspan: 1
          }
        }
      },
      payment(id) {
        this.$router.push({path: '/payment', query: {id: id}})
      },
      cancelOrder(id) {
        cancelOrder({id: id}).then(res => {
          let data = res.data;
          if (data.code === 1) {
            this.$router.push({path: '/member/orderList/#'})
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
          if(data.code !== 1){
            this.$message.error('确认收货失败');
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
          if (data.code === 1) {
            let rs = data.content;
            this.list = rs.result;
            this.totalPages = rs.totalPages;

            this.list.sort((a, b) => {
              return b.created - a.created;
            })
          } else {
            this.$message.error(data.message);
          }
        })
      }
    },
    created() {
      this.listOrder()
    }
  }
</script>

<style scoped>
  .el-pagination {
    text-align: center;
    margin: 20px;
  }

  .el-table tr:hover > td {
    background-color: red;
  }
</style>
