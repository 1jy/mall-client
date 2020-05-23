<template>
  <el-container class="wrap">
    <el-tabs :value="activeTab" class="tabs" type="card">
      <el-tab-pane label="登录">
        <el-form>
          <el-form-item>
            <el-input placeholder="用户名" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="login" style="width: 100%" type="success">登录</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册">
        <el-form>
          <el-form-item>
            <el-input id="username"
                      placeholder="用户名"
                      type="text"
                      v-model="form.username"/>
          </el-form-item>
          <el-form-item>
            <el-input :show-password="true"
                      id="password"
                      placeholder="密码"
                      type="password"
                      v-model="form.password"/>
          </el-form-item>
          <el-form-item>
            <el-input id="email"
                      placeholder="邮箱"
                      type="text"
                      v-model="form.email"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="reg()" style="width: 100%" type="success">注册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script>
  import {register, userLogin} from "../api/member";
  import {Jwt} from "../common";

  export default {
    name: 'login',
    data: () => {
      return {
        form: {
          username: '',
          password: '',
          email: ''
        },
        activeTab: "0",
        flag: false,
      }
    },
    methods: {
      printErrMsg(msg) {
        this.$message({
          type: 'error',
          message: msg,
          showClose: true,
          duration: 1000
        })
      },
      login() {
        if (!this.checkUserName() || !this.checkUserPwd()) {
          return false
        }

        let params = {
          username: this.form.username,
          password: this.form.password
        };

        userLogin(params).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return;
          }
          let token = res.headers[Jwt.TOKEN_HEADER].substr(Jwt.TOKEN_PREFIX.length);
          this.$store.commit('login', token);
          this.$router.push({path: '/'})
        });
        return true
      },
      checkUserName() {
        let rs = RegExp('^[a-zA-Z0-9_-]{4,16}$').test(this.form.username);
        if (!rs) {
          this.$message.error('用户名格式不对');
          return rs
        }
        return rs
      },
      checkUserPwd() {
        if (!this.form.password) {
          this.$message.error('密码不能为空');
          return false
        }
        if (this.form.password.length > 16) {
          this.$message.error('密码最多包含16个字符');
          return false
        }
        if (this.form.password.length < 8) {
          this.$message.error('密码最少包含8个字符');
          return false
        }
        let rs = RegExp('^[a-zA-Z0-9_-]{8,16}$').test(this.form.password);
        if (!rs) {
          this.$message.error('密码不能包含除字母、数字、_、-外字符');
          return false
        }
        return true
      },
      checkEmail() {
        let rs = RegExp('^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$').test(this.form.email);
        if (!rs) {
          this.$message.error('邮箱格式不对');
          return rs
        }
        return rs
      },
      reg() {
        if (this.checkUserName() && this.checkUserPwd() && this.checkEmail()) {
          register(this.form).then(res => {
            let data = res.data;
            if (!data.status) {
              this.$message.error(data.message);
              return;
            }
            this.activeTab = "1";
          })
        }
        return true
      }
    },
    created() {
      this.$notify({type: "info", title: "提示", message: "体验测试账号: 12345678\n密码: 12345678", duration: 5000});
    }
  }
</script>
<style lang="scss">
  html, body, #app {
    background-color: #efefef;
    overflow: hidden;
  }
</style>
<style lang="scss" scoped>
  .wrap {
    width: 100vw;
    max-height: 100vh;
    overflow: auto;
    overflow-x: hidden;
  }

  .tabs {
    width: 300px;
    height: 400px;
    padding: 20px;
    margin: 0 auto;
    border-radius: 10px;
  }
</style>
