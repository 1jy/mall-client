<template>
  <div class="wrap">
    <el-card shadow="never">
      <div slot="header">
        账号资料
      </div>
      <el-row>
        <el-col :span="3" style="vertical-align:middle;">
          <el-avatar :src="getAvatar + '?' + Date.now()" class="avatar" shape="square" style="display: block;"/>
        </el-col>
        <el-col :span="1" style="height: 150px;line-height: 160px;">
          <el-button @click="showCropper = true" style="">上传头像</el-button>
        </el-col>
      </el-row>
      <cropper
        @cancel="showCropper = false"
        @enter="uploadUserAvatar"
        return-type="file"
        v-if="showCropper">
      </cropper>

    </el-card>
  </div>
</template>

<script>
  import cropper from "@/components/cropper/Cropper";
  import {uploadAvatar} from "../../../api/member";

  export default {
    name: "Info",
    components: {cropper},
    data() {
      return {
        showCropper: false,
      }
    },
    computed: {
      getAvatar(val) {
        return this.$store.getters.getUser.avatar;
      }
    },
    methods: {
      uploadUserAvatar(file) {
        uploadAvatar({file: file}).then(res => {
          let data = res.data;
          if (!data.status) {
            this.$message.error(data.message);
            return;
          }
          this.showCropper = false;
          this.$store.commit("updateAvatar", data.content.key);
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    margin: auto;

    .avatar {
      width: 100px;
      height: 100px;
    }
  }
</style>
