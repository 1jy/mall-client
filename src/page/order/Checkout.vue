<template>
  <div class="wrap">
    <jjHeader/>
    <div class="addr-box">
      <el-card shadow="never">
        <div slot="header">
          <b>收货信息</b>
        </div>
        <ul class="addr-box-wrap">
          <li :key="i" :span="6" v-for="(addr, i) in address">
            <div @click="selectAddress(i)" v-bind:class="[selectedAddrIndex===i? selectedAddrBg : normalAddrBg]">
              <el-card class="addr-card" shadow="hover">
                <p>收件人: {{addr.name}}</p>
                <p>收件号码: {{addr.phone}}</p>
                <p>收件地址: {{addr.address}}</p>
                <div class="operation-section">
                  <el-row>
                    <el-col :span="12">
                      <el-button @click="editAddr(i)" size="small">修改</el-button>
                    </el-col>
                    <el-col :span="12">
                      <el-button @click="handelDelAddr(i)" size="small">删除</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </div>
          </li>
          <li :span="6">
            <div class="addr-bg">
              <el-card class="addr-card" shadow="hover" style="text-align: center;">
                <el-button @click="showDialog" circle icon="el-icon-info"></el-button>
                <div>添加新地址</div>
              </el-card>
            </div>
          </li>
        </ul>
      </el-card>
      <el-dialog :visible.sync="dialogVisible" style="margin:auto;width:800px;" title="添加收货地址">
        <el-form>
          <el-form-item label="收货人">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item label="号码">
            <el-input v-model="form.phone"/>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.address"/>
          </el-form-item>
          <el-form-item>
            <el-checkbox false-label="false" true-label="true" v-model="form.flag">设为默认地址</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSave" style="width: 100%;" type="success">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-card class="order-card" shadow="never">
        <div slot="header">
          <b>订单信息</b>
        </div>
        <el-table :data="order.items">
          <el-table-column align="center" label="商品信息" width="200px">
            <template slot-scope="scope">
              <el-image :src="scope.row.image" fit="cover" style="width: 100px;height: 100px;"/>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-link :href="'/detail?id=' + scope.row.gid">{{scope.row.name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="单价" prop="price">
            <template slot-scope="scope">
              ¥ {{scope.row.price}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量" prop="num"></el-table-column>
          <el-table-column align="center" label="小计">
            <template slot-scope="scope">
              ¥ {{scope.row.price * scope.row.num}}
            </template>
          </el-table-column>
        </el-table>
        <div style="padding: 20px;float:right">
        <span>应付金额: ¥ <b
          style="color: red;font-size: x-large;height: 100%;text-align: center">{{calcTotalAmount}}</b></span>
          <el-button @click.once="checkout" style="float:right;margin-left:20px;" type="primary">提交订单</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {delAddress, listAddress, newAddress, updateAddress} from "../../api/member";
  import {checkout} from "../../api/goods";
  import jjHeader from "../../components/header/Header";

  export default {
    name: "Payment",
    components: {jjHeader},
    data() {
      return {
        order: {
          totalAmount: 0,
          items: []
        },
        form: {
          id: '',
          name: '',
          phone: '',
          address: '',
          flag: false
        },
        address: [],
        dialogVisible: false,
        selectedAddrIndex: -1,
        selectedAddrBg: 'selected-Addr-bg',
        normalAddrBg: 'addr-bg'
      }
    },
    computed: {
      calcTotalAmount() {
        let items = this.order.items;
        for (let i = 0; i < items.length; i++) {
          this.order.totalAmount += items[i].num * items[i].price
        }
        return this.order.totalAmount
      }
    },
    methods: {
      handleSave() {
        if (this.form.id) {
          updateAddress(this.form).then(res => {
            let data = res.data;

            if (!data.status) {
              this.$message.error(data.message);

            }
          })
        } else {
          newAddress(this.form).then(res => {
            let data = res.data;

            if (!data.status) {
              this.$message.error(data.message);
              return
            }
            this.address.push(data.content);
            this.form = {flag: false}
          })
        }
        this.updateDefaultAddress();
        this.dialogVisible = false
      },
      editAddr(i) {
        this.form = this.address[i];
        this.dialogVisible = true
      },
      handelDelAddr(i) {
        let id = this.address[i].id;
        delAddress({id: id}).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return
          }
          this.address.splice(i, 1)
        })
      },
      showDialog() {
        this.form = {flag: false};
        this.dialogVisible = true
      },
      selectAddress(i) {
        this.selectedAddrIndex = i
      },
      updateDefaultAddress() {
        listAddress().then(res => {
          let data = res.data;

          if (!data.status) {
            this.$message.error(data.message);
            return;
          }
          this.address = data.content;

          for (let i = 0; i < this.address.length; i++) {
            if (this.address[i].flag) {
              this.selectedAddrIndex = i;
              break
            }
          }
        })
      },
      checkAddress() {
        if (this.selectedAddrIndex === -1) {
          return false
        }
        return this.address[this.selectedAddrIndex];
      },
      checkout() {
        if (!this.checkAddress()) {
          this.$message.error("请选择收货地址!");
          return
        }

        let items = {};
        for (let i = 0; i < this.order.items.length; i++) {
          items[this.order.items[i].gid] = this.order.items[i].num;
        }

        let params = {
          addrId: this.address[this.selectedAddrIndex].id,
          items: items
        };

        checkout(params).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return;
          }
          this.$store.commit('checkout', null);
          let oid = data.content.id;
          this.$router.push({path: '/payment', query: {id: oid}})
        })
      }
    },
    created() {
      this.order.items = this.$store.getters.getOrderItems;
      this.updateDefaultAddress()
    }
  }
</script>
<style lang="scss">
  html, body, #app {
    background-color: #efefef;
  }
</style>
<style lang="scss" scoped>
  .wrap {
    width: 100vw;
    max-height: 100vh;
    overflow: auto;
    overflow-x: hidden;

    .addr-box {
      width: 1200px;
      margin: 30px auto 30px auto;

      .addr-box-wrap {
        display: flex;
        flex-wrap: wrap;

        li {
          list-style: none;
          float: left;
          width: 270px;
        }
      }

      .addr-card {
        height: 160px;
        background-color: transparent;
        color: #475669;
        position: relative;
        font-size: small;

        &:hover {
          .operation-section {
            visibility: visible;
            transform: translate(0, 0);
          }
        }

        .operation-section {
          visibility: hidden;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          text-align: center;
          background-color: white;
          transition: all .2s ease;
          transform: translate(0, 40px);

          .el-button {
            width: 100%;
            border-radius: 0;
          }
        }
      }

      .order-card {
        margin: 30px auto auto;
      }

      .selected-Addr-bg {
        background-color: white;
        padding: 0;
        margin: 10px;
        border-color: #6a8fe5;
        border-width: thin;
        border-style: solid;
      }

      .addr-bg {
        background-color: #fafafa;
        padding: 0;
        margin: 10px;
        border-color: transparent;
        border-width: thin;
        border-style: solid;
      }
    }
  }
</style>
