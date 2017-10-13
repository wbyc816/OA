<template>
  <el-select v-model="deptName"  @change="deptChange" clearable placeholder="请选择">
    <el-option v-for="item in deptList" :key="item.name" :label="item.name" :value="item.name">
    </el-option>
  </el-select>
</template>

<script>
import api from '../fetch/api'

export default {
  data() {
    return {
      deptList: [],
      deptName: ''
    }
  },
  methods: {
    deptChange(){
      this.$emit('deptChange', this.deptName)
    }
  },
  created() {
    api.getDeptList().then(data => {
      if (data.status == '0') {
        this.deptList = data.data.deptList[0].childNode
      }
    })
  },
  // watch: {
  //   deptName() {
  //     console.log(3)
  //   }
  // }
}
</script>

<style>

</style>
