<template>
  <div class="warp">
    <el-card>
      <div slot="header">
        订单号: {{order.id}}
      </div>
      <div>
        <el-steps :active="activeIndex" align-center>
          <el-step v-for="(step, i) in steps" :key="i" :title="step.title" :description="step.description"></el-step>
        </el-steps>
        <el-card shadow="never" class="order-state">
          <div slot="header">
            订单状态: {{getStateStr}}
          </div>
          <div>
            null
          </div>
        </el-card>
      </div>
    </el-card>
    <el-card shadow="never">
      <el-table :data="order.items">
        <el-table-column align="center" prop="image">
          <template slot-scope="scope">
            <el-image :src="scope.row.image" fit="cover" lazy style="width: 80px;height: 80px;"/>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" prop="name">
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
        <el-table-column align="center" label="订单操作" v-if="order.state === 'CONFIRM' && scope.row['rateId'] == null">
          <template slot-scope="scope">
            <el-button>去评价</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding: 20px;" v-if="order['expressId']">快递单号: {{order['expressId']}}</div>
      <div style="padding: 15px;float:right">实付金额: ¥ <b style="color: red;font-size: large">{{order.totalAmount}}</b></div>
    </el-card>
    <el-card shadow="never">
      <div slot="header">
        收货信息
      </div>
      <div>收件人: {{order.address.name}}</div>
      <div>收件号码: {{order.address.phone}}</div>
      <div>收件地址: {{order.address.address}}</div>
    </el-card>
  </div>
</template>

<script>
  import {getOrder} from "../../api/member";

  export default {
    name: "OrderDetail",
    data() {
      return {
        order: {
          id: '',
          state: '',
          items: [],
          expressId: undefined
        },
        activeIndex: 0,
        steps: [
          {
            title: '下单',
            description: ''
          },
          {
            title: '付款',
            description: ''
          },
          {
            title: '发货',
            description: ''
          },
          {
            title: '交易成功',
            description: ''
          }
        ]
      }
    },
    computed: {
      getStateStr() {
        let state = this.order.state;
        switch (state) {
          case 'CREATED':
            this.activeIndex = 1;
            return '待支付';
          case 'PAID':
            if (this.order.expressId == null || this.order.expressId === '') {
              this.activeIndex = 2;
              return '待发货'
            } else {
              this.activeIndex = 3;
              return '待收货';
            }
          case 'CANCEL':
            this.steps.splice(1, this.steps.length - 1);
            this.activeIndex = 2;
            this.steps.push({title: '交易关闭'});
            return '交易关闭';
          case 'CONFIRM':
            this.activeIndex = 4;
            return '交易完成';
        }
      }
    },
    created() {
      let id = this.$route.query.id;
      getOrder({id: id}).then(res => {
        let data = res.data;
        if (data.code !== 1) {
          this.$router.push({path: '/member/orderList'});
        }

        this.order = data.content;
      })
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    width: 1200px;
    margin: auto;
  }

  .order-state {
    margin: 15px;
  }
</style>