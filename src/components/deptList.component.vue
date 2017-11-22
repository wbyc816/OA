<template>
  <el-select v-model="name" @change="deptChange" clearable placeholder="部门">
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
      name: ''
    }
  },
  props: ['deptName'],
  methods: {
    deptChange() {
      this.$emit('deptChange', this.name)
    }
  },
  created() {
    api.getDeptList().then(data => {
      if (data.status == '0') {
        this.deptList = data.data.deptList[0].childNode
      }
    })
    this.name = this.deptName
  },
  watch: {
    'deptName': function(newVal) {
      this.name = newVal
    }
  }
}
</script>

<style>

</style>
