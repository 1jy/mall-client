<template>
  <el-card>
    <div class="clearfix" slot="header">
      <span>收货地址管理</span>
      <el-button @click="newAddress" style="float: right; padding: 3px 0" type="text">新增收货地址</el-button>
    </div>

    <div v-if="defaultIndex !== -1">
      <table>
        <tr>
          <td><b>默认收货地址</b></td>
        </tr>
        <tr>
          <td>姓名: {{tableData[defaultIndex].name}}</td>
          <td>号码: {{tableData[defaultIndex].phone}}</td>
        </tr>
        <tr>
          <td>地址: {{tableData[defaultIndex].address}}</td>
        </tr>
      </table>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="姓名"
        prop="name">
      </el-table-column>
      <el-table-column label="电话" prop="phone"></el-table-column>
      <el-table-column label="地址" prop="address"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editAddress(scope.$index, scope.row)" circle icon="el-icon-edit"></el-button>
          <el-button @click="handleDeleteAddress(scope.$index, scope.row)" circle icon="el-icon-delete"
                     type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" style="margin:auto;width:800px;" title="收货地址">
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
        <el-form-item label="设为默认地址">
          <el-checkbox false-label="false" true-label="true" v-model="form.flag"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSave" type="success">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
    import {delAddress, listAddress, newAddress, updateAddress} from "../../../api/member";

    let Mode = {CREATE: 0, UPDATE: 1};
    export default {
        name: "AddressList",
        data() {
            return {
                tableData: [],
                form: {
                    id: '',
                    name: '',
                    phone: '',
                    address: '',
                    flag: false
                },
                defaultIndex: -1,
                dialogVisible: false,
                selectedIndex: 0,
                dialogMode: Mode.CREATE
            }
        },
        methods: {
            editAddress(index) {
                this.dialogVisible = true;
                this.selectedIndex = index;
                this.dialogMode = Mode.UPDATE;
                this.form = Object.assign({}, this.tableData[index])
            },
            newAddress() {
                this.dialogVisible = true;
                this.dialogMode = Mode.CREATE;
                this.form = {flag: false}
            },
            handleDeleteAddress(index) {
                let id = this.tableData[index].id;
                delAddress({id: id}).then(res => {
                    let data = res.data;
                    if (data.code !== 1) {
                        this.$message.error('删除失败');
                        return
                    }
                    this.tableData.splice(index, 1);
                    this.updateDefaultAddress()
                })
            },
            handelUpdateAddress() {
                let index = this.selectedIndex;

                updateAddress(this.form).then(res => {
                    let data = res.data;
                    if (data.code !== 1) {
                        this.$message.error('更新失败');
                        return
                    } else {
                        this.$message.success("更新成功");
                        this.dialogVisible = false
                    }

                    this.tableData = data.content;
                    this.updateDefaultAddress()
                })
            },
            handleCreateAddress() {
                newAddress(this.form).then(res => {
                    let data = res.data;
                    if (data.code !== 1) {
                        this.$message.error('添加失败');
                        return
                    } else {
                        this.dialogVisible = false
                    }

                    if (this.form.flag) {
                        this.tableData.forEach(v => v.flag = false)
                    }
                    this.form = res.content;
                    this.tableData.push(this.form);
                    this.updateDefaultAddress()
                })
            },
            handleSave() {
                this.dialogMode === Mode.CREATE ? this.handleCreateAddress() : this.handelUpdateAddress()
            },
            updateDefaultAddress() {
                if (this.tableData.length === 0) {
                    return
                }

                for (let i = 0; i < this.tableData.length; i++) {
                    let v = this.tableData[i];
                    if (v.flag) {
                        this.defaultIndex = i;
                        return
                    }
                }
                this.defaultIndex = -1
            },
        },
        created() {
            listAddress().then(res => {
                let data = res.data;
                if (data.code !== 1) {
                    this.$message.error("获取收货地址列表失败")
                }
                this.tableData = data.content;
                this.updateDefaultAddress()
            })
        }
    }
</script>

<style scoped>
  section {
    margin-bottom: 15px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
