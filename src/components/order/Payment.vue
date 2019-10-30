<template>
  <div class="wrap">
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
</template>

<script>
    import {getOrder} from "../../api/member";
    import {_ERROR} from "../../api/resultCode";
    import {cancelOrder, payment} from "../../api/member";

    export default {
        name: "Payment",
        data() {
            return {
                order: {}
            }
        },
        methods: {
            cancelOrder() {
                cancelOrder({id: this.order.id}).then(res => {
                    let data = res.data;
                    if (data.code === -1) {
                        this.$message.error("取消订单失败");
                        return
                    }
                    this.$router.push({path: '/member/orderList'})
                })
            },
            payment() {
                payment({id: this.order.id}).then(res => {
                    let data = res.data;
                    if (data.code !== 1) {
                        this.$message.error("确认支付失败");
                        return
                    }
                    this.$router.push({path: '/member/orderList'})
                })
            }
        },
        created() {
            let id = this.$route.query.id;
            getOrder({id: id}).then(res => {
                let data = res.data;
                if (data.code === _ERROR) {
                    this.$message.error("订单不存在");
                    return
                }
                this.order = data.content
            })
        }
    }
</script>

<style lang="scss" scoped>

  .wrap {
    width: 1200px;
    margin: auto;
    text-align: center;

    .qrcode {
      width: 150px;
      height: 150px;
    }
  }
</style>
