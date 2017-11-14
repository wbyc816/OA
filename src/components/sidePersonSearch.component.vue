<template>
  <div class='sidePerson'>
    <el-card >
      <div slot="header">
        <span>公司同仁</span>
      </div>
      <el-input placeholder="请输入员工姓名" class="search " v-model.trim="searchName" @keyup.enter.native="search" :maxlength="10">
        <el-button slot="append" @click="search">搜索</el-button>
      </el-input>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchName:''
    }
  },
  methods:{
    search(){
      this.$router.push({name:'contactList',params:{name:this.searchName}})
    }
  }
}

</script>
<style lang='scss'>
.sidePerson{
  .el-card__header{
    padding: 8px 20px;
  }
}

</style>
