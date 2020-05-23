<template>
  <div class="warp">
    <section>
      <el-card>
        <div slot="header">
          订单号: {{order.id}}
        </div>
        <div>
          <el-steps :active="activeIndex" align-center>
            <el-step :description="step.description" :key="i" :title="step.title" v-for="(step, i) in steps"></el-step>
          </el-steps>
          <el-card class="order-state" shadow="never">
            <div slot="header">
              订单状态: {{getStateStr}}
            </div>
            <div>
            </div>
          </el-card>
        </div>
      </el-card>
    </section>
    <section>
      <el-card shadow="never">
        <el-table :data="order.items">
          <el-table-column align="center" prop="image" width="120">
            <template slot-scope="scope">
              <img v-lazy="scope.row.image" :lazy="true" style="width: 80px;height: 80px;"/>
            </template>
          </el-table-column>
          <el-table-column align="left" label="商品信息" prop="name" show-overflow-tooltip width="250">
            <template slot-scope="scope">
              <a :href="'/detail?id=' + scope.row.gid">{{scope.row.name}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="单价" prop="price">
            <template slot-scope="scope">
              ¥ {{scope.row.price}}
            </template>
          </el-table-column>
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
        <div style="padding: 15px;float:right">实付金额: ¥ <b style="color: red;font-size: large">{{order.totalAmount}}</b>
        </div>
      </el-card>
    </section>
    <section>
      <el-card shadow="never">
        <div slot="header">
          收货信息
        </div>
        <el-row>
          <el-col :span="2">收件人:</el-col>
          <el-col :span="6">{{order.address.name}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="2">收件号码:</el-col>
          <el-col :span="6">{{order.address.phone}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="2">收件地址:</el-col>
          <el-col :span="6">{{order.address.address}}</el-col>
        </el-row>
      </el-card>
    </section>
  </div>
</template>

<script>
  import {getOrder} from "../../../api/member";

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
        if (!data.status) {
          this.$message(data.message);
          this.$router.push({path: '/member/orderList'});
        }

        this.order = data.content;
      })
    }
  }
</script>

<style lang="scss" scoped>
  .warp {
    width: 930px;
    margin: auto;
  }

  .order-state {
    margin: 15px;
    border: none;
  }

  section {
    margin-bottom: 15px;

    .el-row {
      margin-bottom: 5px;
    }

    .el-row:last-child {
      margin-bottom: 0;
    }
  }

  a.link, a:hover, a:visited {
    color: #000;
  }
</style>