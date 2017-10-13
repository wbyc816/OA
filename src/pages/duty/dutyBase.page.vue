<template>
  <div id='duty'>
    <el-row :gutter='12'>
      <el-col :span='17' :xs="24">
        <router-view></router-view>
      </el-col>
      <el-col :span='7' class="sideBox">
        <side-Person-Search></side-Person-Search>
        <duty></duty>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import duty from '../../components/duty.component'
import SidePersonSearch from '../../components/sidePersonSearch.component'
export default {
  components: {
    duty,
    SidePersonSearch
  }
}
</script>

<style>

</style>
