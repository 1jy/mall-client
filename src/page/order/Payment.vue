<template>
  <div class="wrap">
    <jjHeader/>
    <div class="content">
      <el-image class="qrcode" src="/static/qrcode.png"></el-image>
      <div>演示用二维码</div>
      <div>应付金额: ¥{{order.totalAmount}}</div>
      <div>
      <span>
        <el-button @click="payment">确定支付</el-button>
        <el-button @click="cancelOrder">取消订单</el-button>
      </span>
      </div>
    </div>
  </div>
</template>

<script>
  import {cancelOrder, getOrder, payment} from "../../api/member";
  import jjHeader from "../../components/header/Header"

  export default {
    components: {jjHeader},
    name: "Payment",
    data() {
      return {
        order: {
          id: ''
        },
      }
    },
    methods: {
      cancelOrder() {
        cancelOrder({id: this.order.id}).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return
          }
          window.location.href = '/member/orderList';
        })
      },
      payment() {
        payment({id: this.order.id}).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return
          }
          window.location.href = '/member/orderList';
        })
      }
    },
    created() {
      let id = this.$route.query.id;
      getOrder({id: id}).then(res => {
        let data = res.data;
        if (!data.status) {
          this.$message.error(data.message);
          return
        }
        this.order = data.content
      })
    }
  }
</script>

<style lang="scss" scoped>

  .wrap {
    width: 100vw;
    max-height: 100vh;
    background-color: #fff;
  }

  .content {
    width: 1200px;
    margin: 30px auto 30px auto;
    text-align: center;

    .qrcode {
      width: 150px;
      height: 150px;
    }
  }
</style>
