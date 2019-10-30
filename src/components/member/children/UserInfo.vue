<template>
  <div>
    <el-card>
      <div slot="header">
        用户头像上传
      </div>
      <el-avatar :size="80" :src="this.$store.getters.getUser.avatar"></el-avatar>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Info"
  }
</script>

<style scoped>

</style>
